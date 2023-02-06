import * as secp from "ethereum-cryptography/secp256k1"
import { sha256 } from "ethereum-cryptography/sha256";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

export async function generateSignature(sender, recipient, amount, privateKey) {

    const messageHash = toHex(sha256(utf8ToBytes(JSON.stringify({ "from": sender, "to": recipient, "amount": amount })))
)
    console.log(messageHash);

    const signature = await secp.sign(messageHash, privateKey);

    const hexSignature = toHex(signature);

    return hexSignature;

}
