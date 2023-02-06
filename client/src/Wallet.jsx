import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {

  async function onChange(evt) {
    const newPrivateKey = evt.target.value;
    setPrivateKey(newPrivateKey);
    if (!newPrivateKey) return;
    console.log({ "newPrivateKey": newPrivateKey })

    const address = toHex(secp.getPublicKey(newPrivateKey));
    console.log({ "address": address })
    setAddress(address)

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Keys
        <input placeholder="Type an address, for example: 0x1" value={privateKey} onChange={onChange}></input>
      </label>
      <label>
        Address:
        <p>
          {address.slice(0, 20)}...
        </p>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
