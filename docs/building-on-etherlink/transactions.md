---
title: Sending transactions
---

import PublicRpcRateLimitNote from '@site/docs/conrefs/rate-limit.md';

Etherlink supports the standard Ethereum `eth_call` and `eth_sendRawTransaction` RPC endpoints for calling smart contracts and sending transactions.

- For a list of endpoints that Etherlink supports, see [Ethereum endpoint support](/building-on-etherlink/endpoint-support)
- For more information about the endpoints on this page, see the reference for the Ethereum [JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc).

<PublicRpcRateLimitNote />

## Calling read-only entrypoints

You can use the `eth_call` endpoint to call read-only smart contract functions, which does not require you to create a transaction.
For example, this command calls the ERC-20 contract at the address `0xCda9B8eD25E465f24C26Ad8fF5E1f05661Df50B2` and gets the balance of tokens for the address `0x45Ff91b4bF16aC9907CF4A11436f9Ce61BE0650d`.

```bash
curl --request POST \
     --url https://node.ghostnet.etherlink.com \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_call",
  "params": [
    {
      "to": "0xCda9B8eD25E465f24C26Ad8fF5E1f05661Df50B2",
      "data": "0x70a0823100000000000000000000000045Ff91b4bF16aC9907CF4A11436f9Ce61BE0650d"
    }
  ]
}
'
```

In this case, the `to` parameter is the address of the contract and the `data` parameter is assembled from the hash of the `balanceOf()` function, 24 zeroes for padding, and the address of the account minus its `0x` prefix.
For more information about assembling the `data` parameter, see the Ethereum ABI specification: https://docs.soliditylang.org/en/v0.7.0/abi-spec.html.

The response includes the number of tokens that the account has, in hexadecimal format:

```json
{
  "jsonrpc":"2.0",
  "result":"0x0000000000000000000000000000000000000000000000000000000000000005",
  "id":1
}
```

## Sending XTZ

To send a XTZ in a transaction, you can call the `eth_sendRawTransaction` RPC endpoint with a signed transaction.
Etherlink does not support the `eth_sendTransaction` endpoint.

You must sign the data for the transaction and pass it as the `data` parameter, as in this example:

```bash
curl --request POST \
     --url https://node.ghostnet.etherlink.com \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "id": 1,
  "jsonrpc": "2.0",
  "params": [
    "0x88a747dbc7f84e8416dc4be31ddef0"
  ],
  "method": "eth_sendRawTransaction"
}
'
```

To sign the transaction data, most applications use a library such as [ethers.js](https://docs.ethers.org/v6/).
For example, this JavaScript program signs a transaction that sends 0.1 XTZ to an account and sends it to the network:

```javascript
const { ethers } = require("ethers");

// Define the provider by its RPC address
const provider = new ethers.JsonRpcProvider("https://node.ghostnet.etherlink.com");

// Sender's private key
const privateKey = process.env.ETHERLINK_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

async function sendTransaction() {

  // Create the transaction
  const estimateTx = {
    to: "0x46899d4FA5Ba90E3ef3B7aE8aae053C662c1Ca1d",
    value: ethers.parseEther("0.1"), // Sending 0.1 XTZ
    gasLimit: 21000,
    maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
    maxFeePerGas: ethers.parseUnits("50", "gwei"), // Replace with estimate later
    nonce: await provider.getTransactionCount(wallet.address, "latest"),
    chainId: (await provider.getNetwork()).chainId.toString(),
  };

  // Estimate the gas
  const estimatedGas = await provider.estimateGas(estimateTx);

  // Update the transaction with the estimated gas
  const tx = { ...estimateTx, gasLimit: estimatedGas };

  // Sign the transaction
  const signedTx = await wallet.signTransaction(tx);
  console.log("Signed Transaction:", signedTx);

  // Send the transaction
  const txResponse = await provider.broadcastTransaction(signedTx);
  console.log("Transaction Hash:", txResponse.hash);
}

sendTransaction();
```

The previous example uses ethers.js methods for getting the nonce, estimated gas, and chain ID.
You can also use the equivalent RPC endpoints `eth_getTransactionCount`, `eth_estimateGas`, and `net_version`.
For example, if you use `eth_getGasPrice` and it returns `0x3b9aca00`, you can estimate the gas for the transaction with this command:

```bash
curl --request POST \
     --url https://node.ghostnet.etherlink.com \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_estimateGas",
  "params": [
    {
      "to": "0x46899d4FA5Ba90E3ef3B7aE8aae053C662c1Ca1d",
      "gas": "0x0",
      "gasPrice": "0x3b9aca00",
      "value": "0xde0b6b3a7640000",
      "data": "0x"
    }
  ]
}
'
```
