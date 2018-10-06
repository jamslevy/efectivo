require('dotenv').config()
const Web3 = require('web3')
const Tx = require('ethereumjs-tx')
const ethUtils = require('ethereumjs-util')

//const w3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER));
const w3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
//const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex');
const privateKey = '0xcfe7e99b98d5a2024945b51b63ea967c17bb96c4413110aab49a9233bb97a65a'
const publicAddress = ethUtils.bufferToHex(ethUtils.privateToAddress(privateKey));
const KDAI = '0xc4375b7de8af5a38a93548eb8453a498222c4ff2';

function prepareData(input) {
    let encoded = web3.eth.abi.encodeFunctionCall({

        name: 'execute',
        type: 'function',
        inputs: [{
            type: 'uint8',
            name: 'v'
        },{
            type: 'bytes32',
            name: 'r'
        },{
            type: 'bytes32',
            name: 's'
        },{
            type: 'address',
            name: 'from'
        },{
            type: 'address',
            name: 'to'
        },{
            type: 'uint256',
            name: 'value'
        },{
            type: 'bytes',
            name: 'data'
        },{
            type: 'address',
            name: 'rewardType'
        },{
            type: 'uint256',
            name: 'rewardAmount'
        }]
    }, [input.v, input.r, input.s, input.from, input.to, input.value, input.data, input.rewardType, input.rewardAmount]);

    return encoded;
}

const executeCall = async function(personalWallet, payload) {
      //check if from is master account
      //let personalWallet = new web3.eth.Contract(ABI, req.params.personalWallet);
      //TODO: check gas estimates
      const gasLimit = web3.utils.toHex("211000");
      const gasPrice = web3.utils.toHex(web3.utils.toWei("10","gwei"));
      const nonce = web3.utils.toHex(await web3.eth.getTransactionCount(publicAddress));

      let data = prepareData(payload);

      let rawTx = {
          nonce: nonce,
          gasPrice: gasPrice,
          gasLimit: gasLimit,
          to: personalWallet,
          value: '0x00',
          data: data
      };

      let tx = new Tx(rawTx);
      tx.sign(privateKey);
      let serializedTx = tx.serialize();

}

module.exports = {
  relayAccount: publicAddress,
  w3,
  executeCall,
}

