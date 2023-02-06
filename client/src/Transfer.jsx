import { useState } from "react";
import server from "./server";
import { generateSignature } from "./utils";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const sender = address;
    const amount = parseInt(sendAmount);

    const signature = await generateSignature(sender, recipient, amount, privateKey)

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: sender,
        amount: amount,
        recipient,
        signature

      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex.response.data)
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
