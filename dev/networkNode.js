const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain.js');
const rp = require('request-promise');
const uuid = require('uuid');
const nodeAddress = uuid().split('-').join('');
const port = process.argv[2];
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

// register and broadcast nodes to the network

app.post('/register-and-broadcast-node',function(req,res){
	const newNodeUrl = req.body.newNodeUrl;
	if (bitcoin.networkNodes.indexOf(newNodeUrl)==-1){
		bitcoin.networkNodes.push(newNodeUrl);
	}
	const regNodesPromises = [];
	bitcoin.networkNodes.forEach(newNodeUrl=> {
		const requestOptions = {
			uri: newNodeUrl + '/register-node',
			method: 'POST',
			body: {newNodeUrl:newNodeUrl},
			josn: true

		};
		regNodesPromises.push(rp(requestOptions));
	});
	Promise.all(regNodesPromises).then( data=>{
		//do something with data
		// do bulk registeration
		const bulkRegisterOptions = {
			uri : newNodeUrl + '/register-nodes-bulk',
			method: 'POST',
			body: {allNetworkNodes : [... bitcoin.networkNodes, bitcoin.currentNodeUrl]},
			json:true
		};
		return rp(bulkRegisterOptions);
	}).then(data=> {
		res.json({note: "New node registered successfully with the network"});
	});

});

//register node

app.post('/register-node',function(req,res){

});

//register nodes in bulk

app.post('/register-nodes-bulk',function(req,res){

});

app.listen(port,function(){
	console.log(`Listening on port ${port}`);
});