---
title: Sending transactions
---

import PublicRpcRateLimitNote from '@site/docs/conrefs/rate-limit.md';

import GasPriceWarning from '@site/docs/conrefs/gas-price-warning.md';

Etherlink supports the standard Ethereum `eth_call` and `eth_sendRawTransaction` RPC endpoints for calling smart contracts and sending transactions.

- For a list of endpoints that Etherlink supports, see [Ethereum endpoint support](/building-on-etherlink/endpoint-support)
- For more information about the endpoints on this page, see the reference for the Ethereum [JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc).

<PublicRpcRateLimitNote />

<GasPriceWarning />

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

Similarly, you can use [ethers.js](https://docs.ethers.org/v6/) to get information from smart contracts.
This example calls two read-only entrypoints on an ERC-20 contract:

```javascript
const { ethers } = require("ethers");

const fullABI = []; // Add complete ABI here

// Define the provider by its RPC address
const provider = new ethers.JsonRpcProvider("https://node.ghostnet.etherlink.com");

// Sender's private key
const privateKey = process.env.ETHERLINK_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// ERC-20 contract
const contractAddress = "0xaE96b26F0F9FD52ddd07227E0B73dFc58a1531Ec";

const acct1 = "0x45Ff91b4bF16aC9907CF4A11436f9Ce61BE0650d";
const acct2 = "0xaE96b26F0F9FD52ddd07227E0B73dFc58a1531Ec";
const accounts = [
  { name: "Account 1", address: acct1 },
  { name: "Account 2", address: acct2 },
];

async function getBalances() {

  const tokenContract = new ethers.Contract(contractAddress, fullABI, wallet);

  await Promise.all(accounts.map(async ({ name, address }) => {
    // Call balanceOf entrypoint
    const rawBalance = await tokenContract.balanceOf(address);
    // Call decimals entrypoint
    const decimals = await tokenContract.decimals();
    const formattedBalance = ethers.formatUnits(rawBalance, decimals);
    console.log(name, "has", formattedBalance, "tokens.");
  }));
}

getBalances();
```

The output includes information about the tokens that the specified accounts own:

```
Account 1 has 10.0 tokens.
Account 2 has 6.0 tokens.
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

The response is the estimated transaction fee in hexadecimal format, as in this example:

```json
{
  "jsonrpc": "2.0",
  "result": "0x98496",
  "id": 1
}
```

For more information, see [Estimating fees](/building-on-etherlink/estimating-fees).

## Calling smart contracts

Calling an Etherlink smart contract is just like calling any other EVM smart contract.
For example, this Solidity contract stores an integer and lets callers change it:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
contract SimpleStorage {
  uint storedData;

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
```

This program uses ethers.js to call the deployed contract:

```javascript
const { ethers } = require("ethers");

const fullABI = [{"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}];

// Define the provider by its RPC address
const provider = new ethers.JsonRpcProvider("https://node.ghostnet.etherlink.com");

// Sender's private key
const privateKey = process.env.ETHERLINK_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

const contractAddress = "0x3D3402f42Fb1ef5Cd643a458A4059E0055d48F9e";
const simpleContract = new ethers.Contract(contractAddress, fullABI, wallet);

const getValue = async () => {
  console.log("Value:", await simpleContract.get());
}

async function sendTransaction() {

  // Send the transaction
  const ercTx = await simpleContract.set(5);
  console.log("Transaction Hash:", ercTx.hash);

  // Wait for the transaction to be confirmed
  await ercTx.wait();
  console.log("Transaction Confirmed!");
}

const run = async () => {
  await getValue();
  await sendTransaction();
  await getValue();
}

run();

```

## Transferring ERC-20 tokens

To transfer ERC-20 tokens, you can use the standard `transfer` entrypoint, as in this example:

```javascript
const { ethers } = require("ethers");

// Define the provider by its RPC address
const provider = new ethers.JsonRpcProvider("https://node.ghostnet.etherlink.com");

// Sender's private key
const privateKey = process.env.ETHERLINK_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

async function sendTransaction() {

  const contractAddress = "0xaE96b26F0F9FD52ddd07227E0B73dFc58a1531Ec";
  // Standard transfer ABI for ERC-20 contracts
  const erc20Abi = [
    "function transfer(address to, uint256 amount) public returns (bool)"
  ];
  const tokenContract = new ethers.Contract(contractAddress, erc20Abi, wallet);

  const targetAddress = "0x46899d4FA5Ba90E3ef3B7aE8aae053C662c1Ca1d";

  const amountToTransfer = ethers.parseUnits("1", 18);

  // Send the transaction
  const ercTx = await tokenContract.transfer(targetAddress, amountToTransfer);
  console.log("Transaction Hash:", ercTx.hash);

  // Wait for the transaction to be confirmed
  await ercTx.wait();
  console.log("Transaction Confirmed!");
}

sendTransaction();
```

If you have the full ABI for the contract you can use other entrypoints to do things like get the account's current balance and the number of decimals that the account uses in its ledger of tokens, as in this example:

```javascript
const { ethers } = require("ethers");

const fullABI = []; // Add complete ABI here

// Define the provider by its RPC address
const provider = new ethers.JsonRpcProvider("https://node.ghostnet.etherlink.com");

// Sender's private key
const privateKey = process.env.ETHERLINK_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

async function sendTransaction() {

  const contractAddress = "0xaE96b26F0F9FD52ddd07227E0B73dFc58a1531Ec";
  const tokenContract = new ethers.Contract(contractAddress, erc20Abi, wallet);

  const targetAddress = "0x46899d4FA5Ba90E3ef3B7aE8aae053C662c1Ca1d";

  const rawBalance = await tokenContract.balanceOf(wallet.address);

  // Get token decimals and format balance
  const decimals = await tokenContract.decimals();
  const formattedBalance = ethers.formatUnits(rawBalance, decimals);

  console.log("Account has", formattedBalance, "tokens.");

  // Transfer 1 token, formatted for number of decimals the token uses
  const amountToTransfer = ethers.parseUnits("1", decimals);

  // Send the transaction
  const ercTx = await tokenContract.transfer(targetAddress, amountToTransfer);
  console.log("Transaction Hash:", ercTx.hash);

  // Wait for the transaction to be confirmed
  await ercTx.wait();
  console.log("Transaction Confirmed!");

  // Check balance after the transaction
  const updatedBalance = await tokenContract.balanceOf(wallet.address);
  const formattedUpdatedBalance = ethers.formatUnits(updatedBalance, decimals);
  console.log("Account now has", formattedUpdatedBalance, "tokens remaining.");
}

sendTransaction();
```

## Getting event logs

Etherlink does not support listening for smart contract events with endpoints such as `eth_newFilter` and `eth_getFilterChanges`.
You can't use the standard ethers.js `contract.on`  or `contract.addListener` functions to add a listener to a contract because they use these entrypoints.

To get updates about activity on Etherlink via WebSockets, see [Subscribing to events](/building-on-etherlink/websockets#subscribing-to-events).

You can look up event logs with the `eth_getLogs` endpoint, which accepts different filters.
For example, this command returns the event logs from the specified contract from block 18465925 to the current state:

```bash
curl --request POST \
  --url https://node.ghostnet.etherlink.com \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","method":"eth_getLogs","params":[{"fromBlock":"18465925", "toBlock":"latest", "address": "0xaE96b26F0F9FD52ddd07227E0B73dFc58a1531Ec"}],"id":1}'
```

The response includes information about the matching events:

```json
{
  "jsonrpc": "2.0",
  "result": [
    {
      "address": "0xae96b26f0f9fd52ddd07227e0b73dfc58a1531ec",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x00000000000000000000000045ff91b4bf16ac9907cf4a11436f9ce61be0650d",
        "0x000000000000000000000000ae96b26f0f9fd52ddd07227e0b73dfc58a1531ec"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
      "blockNumber": "0x119c486",
      "transactionHash": "0x3802692bf4ed0418bedc4d919f8ef5295fce9efc4b7223ebc91d04fadd3a8b65",
      "transactionIndex": "0x0",
      "blockHash": "0xf14d24040b30aa3b463687c2a1746a0aac80a145474d34789a8b7db2619d60ae",
      "logIndex": "0x0",
      "removed": false
    },
    {
      "address": "0xae96b26f0f9fd52ddd07227e0b73dfc58a1531ec",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x00000000000000000000000045ff91b4bf16ac9907cf4a11436f9ce61be0650d",
        "0x000000000000000000000000ae96b26f0f9fd52ddd07227e0b73dfc58a1531ec"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
      "blockNumber": "0x119c547",
      "transactionHash": "0x82419cccc1363c931024d76d253056d2dd5ed56917121150808739f5dc9a04bc",
      "transactionIndex": "0x0",
      "blockHash": "0xa65584a8d7a36ec30e63ed61daf06b6336db43fc55d6366f484f2be1d92c858b",
      "logIndex": "0x0",
      "removed": false
    }
  ],
  "id": 1
}
```

For other filters, see [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat) in the Ethereum JSON-RPC API reference.
