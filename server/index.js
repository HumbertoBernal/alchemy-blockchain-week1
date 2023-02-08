
const { recoverPublicKey, verifySign } = require("./utils");
const cors = require("cors");
const express = require("express");

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04e57cc94486002d2f96884c6262b9c131e76a9a4c9fc1c8b29ac222db578fb0664c30f7381e334cd1ea11dfcc9a7ef13fb8b939d2b0565d02f179bec9f444cc35": 100,
  "045846197323c241987d27bc08db669fbbd3930382f15c9ef3e298789f13a88beb82d75e249ed939317381036801a511109b338071d61702f3cf65b53da1eca17a": 50,
  "044467dcdb7499258f7407bade66dbe09e07dac74176899adef3baa97f606f9106d2e1778b01c43dde1acae405eb42c67f28e3ccbe7e72aef586a4e55a892c2bed": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature } = req.body;
  const { amount, recipient } = message

  const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const dateString = new Date().toLocaleString('es', options).replace(",", "").replace(" ", "T")

  const fullMessage = { ...message, dateString }

  const senderPublicKey = recoverPublicKey(fullMessage, signature)
  const isSigned = verifySign(fullMessage, signature, senderPublicKey);

  setInitialBalance(senderPublicKey);
  setInitialBalance(recipient);

  if (!isSigned) {
    res.status(400).send({ message: "Invalid sign!" });
  } else if (balances[senderPublicKey] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {

    balances[senderPublicKey] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[senderPublicKey] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
