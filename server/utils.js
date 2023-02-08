const secp = require("ethereum-cryptography/secp256k1");
const { hexToBytes, utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

function hashMessage(message){

    const messageBytes = utf8ToBytes(JSON.stringify(message))
    const hash = keccak256(messageBytes)

    return hash
}


function recoverPublicKey (message, signature){
    const hash = hashMessage(message);

    const fullSignatureBytes = hexToBytes(signature);
    
    const recoveryBit = fullSignatureBytes[0];
    const signatureBytes = fullSignatureBytes.slice(1);

    const publicKey = secp.recoverPublicKey(hash, signatureBytes, recoveryBit);

    const publicKeyHex = toHex(publicKey);

    return publicKeyHex;
}

function verifySign(message, signature, publicKey){

    const fullSignatureBytes = hexToBytes(signature);
    const signatureBytes = fullSignatureBytes.slice(1);

    const hash = hashMessage(message);

    const isSigned = secp.verify(signatureBytes, hash, publicKey);
    
    return isSigned;
    
}

module.exports = {
    hashMessage,
    recoverPublicKey,
    verifySign
}