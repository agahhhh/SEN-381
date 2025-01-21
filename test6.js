const Blockchain = require("./blockchain");
const express = require('express');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const path = require('path')


const agah = new Blockchain();
const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    // send message to the listening port that will get the
    // alert
    res.sendFile(path.join( __dirname, 'index.html'));
});

app.get('/blockchain', function (req, res) {
    res.send(agah)
});

app.post('/transaction', function(req, res) {
    console.log('hey');
    
    const blockIndex =agah.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
    res.json({ note:`Transaction will be added in block ${JSON.stringify(blockIndex)}.`});
});

app.get('/mine', function(req, res) {
    const lastBlock = agah.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: agah.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = agah.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = agah.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = agah.createNewBlock(nonce, previousBlockHash, blockHash);
    const nodeAddress = uuid.v1().split('-').join('');
    agah.createNewTransaction(12.5, "00", nodeAddress);
    res.json({
        note: "New block mined successfully",
        block: newBlock
    });
});

app.listen(3000, function(res, req){
console.log('listening on port 3000… ');
});