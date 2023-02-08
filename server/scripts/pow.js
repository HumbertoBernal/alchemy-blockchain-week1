const SHA256 = require('crypto-js/sha256');
const TARGET_DIFFICULTY = BigInt(0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
const MAX_TRANSACTIONS = 10;

const mempool = [];
const blocks = [];

function addTransaction(transaction) {
    
    mempool.push(transaction)
}

function mine() {

    let transactions = [];
    
    while (mempool.length > 0 && transactions.length < MAX_TRANSACTIONS ) {
        transactions.push(mempool.pop());
    };

    let nonce = -1;

    let hash = '';
    let newBlock = '';

    do {
        nonce = nonce + 1;
        newBlock = { id: blocks.length, transactions: transactions, nonce: nonce  };
        hash = SHA256(JSON.stringify(newBlock))

    }while(BigInt(`0x${hash}`) > TARGET_DIFFICULTY )

    blocks.push({...newBlock, hash: hash });
}

module.exports = {
    TARGET_DIFFICULTY,
    MAX_TRANSACTIONS,
    addTransaction, 
    mine, 
    blocks,
    mempool
};