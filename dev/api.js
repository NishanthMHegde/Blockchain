const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain.js');
const uuid = require('uuid');
const nodeAddress = uuid().split('-').join('');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
const bitcoin = new Blockchain();
app.get('/blockchain',function(req,res){
	res.send(bitcoin);
});

app.post('/transaction',function(req,res){
	const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.receiver);
	res.json({note: `The transaction will be added in the block number ${blockIndex}`});

});
app.get('/mine',function(req,res){
	const lastBlock = bitcoin.getLastBlock();
	const previousBlockHash = lastBlock['hash'];
	const currentBlockData = {
		index: lastBlock['index']+1,
		transaction: bitcoin.pendingTransactions
	};
	const nonce = bitcoin.proofOfWork(previousBlockHash,currentBlockData);
	const hash = bitcoin.hashBlock(previousBlockHash,currentBlockData,nonce);
	bitcoin.createNewTransaction(12.5,"00",nodeAddress);
	const newBlock = bitcoin.createNewBlock(nonce,previousBlockHash,hash);
	res.json({note: "New block mined successfully",
				block: newBlock
});
});

app.listen(3000,function(){
	console.log("Listening on port 3000");
});