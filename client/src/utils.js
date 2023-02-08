import * as secp from "ethereum-cryptography/secp256k1"
import { sha256 } from "ethereum-cryptography/sha256";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

export function hashMessage(message){

    const messageBytes = utf8ToBytes(JSON.stringify(message))
    const hash = keccak256(messageBytes)

    return hash
}


export async function signMessage(message, privateKey) {
    
    const hash = hashMessage(message);
    
    const [signature, recoveryBit] = await secp.sign(hash, privateKey, {recovered: true});
    const fullSignature = new Uint8Array([recoveryBit, ...signature])

    return toHex(fullSignature);
}
