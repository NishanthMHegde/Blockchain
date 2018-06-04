const Blockchain = require('./blockchain.js');


const bitcoin = new Blockchain();
// bitcoin.createNewBlock(123,'AHTPI8667','12PI28334ASD');
// bitcoin.createNewTransaction(1000, 'ALEX123','BEN456');
// bitcoin.createNewBlock(456,'AHTPI8687','12PI28334AXYZ');
// bitcoin.createNewTransaction(2000, 'ALEX11123','BEN452226');
// bitcoin.createNewBlock(7896,'AHHHJPI8687','12PI2833SADSD4AXYZ');

var previousBlockHash = "12PI2833SADSD4AXYZ";
var nonce = 49469;
var currentBlockData = [
{
	amount:123,
	sender : "ALEX",
	receiver : "Bunty"
},
{
	amount:12378,
	sender : "ALEXA",
	receiver : "Bunkim"
}
];

console.log(bitcoin.hashBlock(previousBlockHash,currentBlockData,nonce));

