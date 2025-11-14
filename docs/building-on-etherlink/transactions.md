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

You can use the `eth_call` endpoint to call read-only smart contract functions.
These functions do not require you to create a transaction.
For example, this command calls the ERC-20 contract at the address `0xb4cB11018194D60B452CAF92a4A656A99E7D0145` and gets the balance of tokens for the address `0x45Ff91b4bF16aC9907CF4A11436f9Ce61BE0650d`.

```bash
curl --request POST \
     --url https://node.shadownet.etherlink.com \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_call",
  "params": [
    {
      "to": "0xb4cB11018194D60B452CAF92a4A656A99E7D0145",
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
  "result":"0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
  "id":1
}
```

You can use a hex to decimal converter to get the value of the response in decimal.

Similarly, you can use [ethers.js](https://docs.ethers.org/v6/) to get information from smart contracts.
This example calls two read-only entrypoints on an ERC-20 contract:

```javascript
const { ethers } = require("ethers");

const fullABI = []; // Add complete ABI here

// Define the provider by its RPC address
const provider = new ethers.JsonRpcProvider("https://node.shadownet.etherlink.com");

// Sender's private key
const privateKey = process.env.ETHERLINK_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// ERC-20 contract
const contractAddress = "0xb4cB11018194D60B452CAF92a4A656A99E7D0145";

const acct1 = "0x45Ff91b4bF16aC9907CF4A11436f9Ce61BE0650d";
const acct2 = "0x46899d4FA5Ba90E3ef3B7aE8aae053C662c1Ca1d";
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
     --url https://node.shadownet.etherlink.com \
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
const provider = new ethers.JsonRpcProvider("https://node.shadownet.etherlink.com");

// Sender's private key
const privateKey = process.env.ETHERLINK_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

async function sendTransaction() {

  // Create the transaction
  const estimateTx = {
    to: "0x46899d4FA5Ba90E3ef3B7aE8aae053C662c1Ca1d",
    value: ethers.parseEther("0.1"), // Sending 0.1 XTZ
    gasLimit: 21000, // Replace with an estimate later
    maxFeePerGas: ethers.parseUnits("1", "gwei"), // Limit transaction to gas price of 1 gwei
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
     --url https://node.shadownet.etherlink.com \
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

The response is the estimated transaction gas usage in hexadecimal format, as in this example:

```json
{
  "jsonrpc": "2.0",
  "result": "0x98496",
  "id": 1
}
```

You can multiply the estimated gas usage by the current gas price to estimate the total fee.
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
const provider = new ethers.JsonRpcProvider("https://node.shadownet.etherlink.com");

// Sender's private key
const privateKey = process.env.ETHERLINK_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

const contractAddress = "0x5F333531402b97ae46a0B6F3E8BC35Ac5A76Ead4";
const simpleContract = new ethers.Contract(contractAddress, fullABI, wallet);

const getValue = async () => {
  console.log("Value:", await simpleContract.get());
}

async function sendTransaction() {

  // Send the transaction
  const simpleTransaction = await simpleContract.set(5);
  console.log("Transaction Hash:", simpleTransaction.hash);

  // Wait for the transaction to be confirmed
  await simpleTransaction.wait();
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
const provider = new ethers.JsonRpcProvider("https://node.shadownet.etherlink.com");

// Sender's private key
const privateKey = process.env.ETHERLINK_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

async function sendTransaction() {

  const contractAddress = "0xb4cB11018194D60B452CAF92a4A656A99E7D0145";
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
const provider = new ethers.JsonRpcProvider("https://node.shadownet.etherlink.com");

// Sender's private key
const privateKey = process.env.ETHERLINK_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

async function sendTransaction() {

  const contractAddress = "0xb4cB11018194D60B452CAF92a4A656A99E7D0145";
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

## Batching transactions

Because the sequencer orders transactions in the order that it receives them, you cannot expect transactions that you submit to run sequentially, even if you submit them quickly.
To ensure that your transactions run in the same block or sequence, you can submit them in a batch by signing them all first and submitting them at the same time.

The following example uses the [`viem`](https://viem.sh/) SDK to create five transactions that send XTZ to an account and submit them in a batch.
It configures the Viem client to send transactions as a batch, signs multiple transactions, and submits them all at once so Viem uses [Batch JSON-RPC](https://viem.sh/docs/clients/transports/http#batch-json-rpc) to send them as a batch.

Note that the code submits the transaction to the relay endpoint, not the usual RPC endpoint, because the public RPC node has a load balancer that splits transactions into single RPC requests.
However, the relay endpoint accepts transactions only via the `eth_sendRawTransaction` endpoint, so the code uses the `sendRawTransaction` method to send transactions to this endpoint.
Other EVM clients may not use this endpoint to send transactions and therefore cannot use the relay endpoint.
In this case, you can set up your own Etherlink EVM node and send batched transactions to it.

```javascript
import { createWalletClient, createPublicClient, http, parseEther } from 'viem';  // "viem": "^2.27"
import { privateKeyToAccount } from 'viem/accounts';

const etherlinkShadownet = {
  "id": 127823,
  "name": "Etherlink Shadownet",
  "nativeCurrency": {
    "decimals": 18,
    "name": "Tez",
    "symbol": "XTZ"
  },
  "rpcUrls": {
    "default": {
      "http": [
        "https://node.shadownet.etherlink.com"
      ]
    }
  },
  "blockExplorers": {
    "default": {
      "name": "Etherlink Shadownet",
      "url": "https://shadownet.explorer.etherlink.com"
    }
  },
  "testnet": true
}

(async function main() {
  const client = createWalletClient({
    chain: etherlinkShadownet,
    transport: http()
  });

  const publicClient = createPublicClient({
    chain: etherlinkShadownet,
    transport: http()
  });

  // Relay supports eth_blockNumber & eth_sendRawTransaction only
  const publicRelayClient = createPublicClient({
    transport: http('https://relay.shadownet.etherlink.com', { batch: true }),
  });

  // Add the sender's private key
  const account = privateKeyToAccount('');

  const startingNonce = await publicClient.getTransactionCount({ address: account.address });

  const signedTransactions = [];

  // Create an array of signed transactions
  for (let i = 0; i < 5; i++) {
    const requestData = {
      account,
      to: '0x45Ff91b4bF16aC9907CF4A11436f9Ce61BE0650d',
      value: parseEther('0.001'),
      nonce: startingNonce + i
    };

    const request = await client.prepareTransactionRequest(requestData);
    const signedTx = await client.signTransaction(request);
    signedTransactions.push(signedTx);
  }

  // Batch send raw transactions
  const transactionHashes = await Promise.all(
    signedTransactions.map((serializedTransaction) =>
      publicRelayClient.sendRawTransaction({ serializedTransaction })
    )
  );

  console.log('Signed transactions:', JSON.stringify(signedTransactions, null, 2));
  console.log('Transaction hashes:', transactionHashes);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

## Getting event logs

Etherlink does not support listening for smart contract events with endpoints such as `eth_newFilter` and `eth_getFilterChanges`.
You can't use the standard ethers.js `contract.on`  or `contract.addListener` functions to add a listener to a contract because they use these entrypoints.

To get updates about activity on Etherlink via WebSockets, see [Subscribing to events](/building-on-etherlink/websockets#subscribing-to-events).

You can look up event logs with the `eth_getLogs` endpoint, which accepts different filters.
For example, this command returns the event logs from the specified contract from block 1070486 to the current state:

```bash
curl --request POST \
  --url https://node.shadownet.etherlink.com \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","method":"eth_getLogs","params":[{"fromBlock":"1070486", "toBlock":"latest", "address": "0xb4cB11018194D60B452CAF92a4A656A99E7D0145"}],"id":1}'
```

The response includes information about the matching events:

```json
{
  "jsonrpc": "2.0",
  "result": [
    {
      "address": "0xb4cb11018194d60b452caf92a4a656a99e7d0145",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x00000000000000000000000045ff91b4bf16ac9907cf4a11436f9ce61be0650d",
        "0x000000000000000000000000ae96b26f0f9fd52ddd07227e0b73dfc58a1531ec"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
      "blockNumber": "0x105644",
      "transactionHash": "0x0af4bb32a0efb716e676d896e94a370e2ebdc13e5ca57243c8cd2921e19e1277",
      "transactionIndex": "0x0",
      "blockHash": "0xdb8433b5c7a9ee4cabf7cc5349184d213cae2711fe611f783eb34688752b4198",
      "logIndex": "0x0",
      "removed": false
    },
    {
      "address": "0xb4cb11018194d60b452caf92a4a656a99e7d0145",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x00000000000000000000000045ff91b4bf16ac9907cf4a11436f9ce61be0650d"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
      "blockNumber": "0x10566c",
      "transactionHash": "0xe375b5bab21dee63c222f4b7dd0e0ac46c0f4bb1bd64aafbb41c064de25b1dd2",
      "transactionIndex": "0x0",
      "blockHash": "0x7cf111722ce93d3a744f08caa5639d9426d2dbf16cd34522d39712bb82706020",
      "logIndex": "0x0",
      "removed": false
    }
  ],
  "id": 1
}
```

For other filters, see [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat) in the Ethereum JSON-RPC API reference.

## Tracing transactions

Etherlink supports the `debug_traceTransaction` and `debug_traceBlockByNumber` RPC endpoints, which provide debugging information about transactions and blocks.
Note that the `debug_traceTransaction` endpoint supports only the `structLogger` and `callTracer` tracers.
For more information about tracers, see [Built-in tracers](https://geth.ethereum.org/docs/developers/evm-tracing/built-in-tracers) in the Geth documentation.

To get debugging information about a transaction with `debug_traceTransaction`, pass the hash of the transaction, as in this example:

```bash
curl --request POST \
     --url https://node.shadownet.etherlink.com \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "debug_traceTransaction",
  "params": [
    "0x76fd76c5443deebcf179fa1bc3d407750329fa47414300e2d8f89b93fd6751f9"
  ]
}
'
```

The response includes data about the transaction, including its status, gas cost, and return value.
It also includes the structured logs from the EVM execution of the transaction.

You can also get this information via ethers.js, as in this example:

```javascript
async function sendTransaction() {

  // Send the transaction
  const simpleTransaction = await simpleContract.set(5);
  console.log("Transaction hash:", simpleTransaction.hash);

  // Wait for the transaction to be confirmed
  await simpleTransaction.wait();
  console.log("Transaction confirmed!");

  // Get trace information and print the top level of data
  const trace = await provider.send("debug_traceTransaction", [simpleTransaction.hash]);
  console.log("Transaction trace output:");
  console.dir(trace, { depth: 2 });
}
```

The result looks like this:

```
Transaction hash: 0x37eb2986adf5ca31afe17bb00f79ad62cdf229757edd87b7ae900b747741575d
Transaction confirmed!
Transaction trace output:
{
  gas: '23796',
  failed: false,
  returnValue: '0x',
  structLogs: [
    {
      pc: 0,
      op: 'PUSH1',
      gas: 5414,
      gasCost: 3,
      memory: null,
      memSize: null,
      stack: [],
      returnData: null,
      storage: [],
      depth: 1,
      refund: 0,
      error: null
    },
    // Omitted for length
  ]
}
```

Similarly, you can use the `debug_traceBlockByNumber` endpoint to get information about a block by passing its number in hexadecimal, as in the following example:

```bash
curl --request POST \
     --url https://node.shadownet.etherlink.com \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "debug_traceBlockByNumber",
  "params": [
    "0x1056F9",
    {"tracer": "callTracer"}
  ]
}
'
```

:::note

Etherlink supports only the `callTracer` tracer for this endpoint, and only for blocks after the Bifröst upgrade.
Calling this endpoint on blocks prior to Bifröst returns empty data.
Bifröst was activated on block 10,758,937 on Ghostnet Testnet, block 1 on Shadownet Testnet, and block 4,162,673 on Mainnet.

:::

The response includes information about the transactions in that block, as in this example:

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
    {
      "txHash": "0x37eb2986adf5ca31afe17bb00f79ad62cdf229757edd87b7ae900b747741575d",
      "result": {
        "type": "CALL",
        "from": "0x45ff91b4bf16ac9907cf4a11436f9ce61be0650d",
        "to": "0x5f333531402b97ae46a0b6f3e8bc35ac5a76ead4",
        "value": "0x00",
        "gas": "0x67fa",
        "gasUsed": "0x5cf4",
        "input": "0x60fe47b10000000000000000000000000000000000000000000000000000000000000005",
        "output": "0x",
        "logs": [],
        "calls": []
      }
    }
  ]
}
```

You can also use ethers.js, as in this example:

```javascript
async function sendTransaction() {

  // Send the transaction
  const simpleTransaction = await simpleContract.set(5);
  console.log("Transaction hash:", simpleTransaction.hash);

  // Wait for the transaction to be confirmed
  const receipt = await simpleTransaction.wait();
  console.log("Transaction included in block:", receipt.blockNumber);
  const hexBlockNumber = ethers.toBeHex(receipt.blockNumber);

  // Get information about the block
  const traceBlock = await provider.send("debug_traceBlockByNumber", [hexBlockNumber, {"tracer": "callTracer"}]);
  console.log("Block trace output:");
  console.dir(traceBlock, { depth: null });
}
```

## Sending transactions to the delayed inbox

As described in [Delayed inbox transaction processing](/network/architecture#delayed-inbox-transaction-processing), the delayed inbox provides an alternative mechanism to add a transaction to Etherlink. If the sequencer is not operating normally, sending transactions to the delayed inbox is a way to force Etherlink to include them.

When you submit a transaction to the delayed inbox, you encode and sign it as an Etherlink transaction but submit it to the delayed bridge contract on Tezos layer 1.
Under normal circumstances, the sequencer receives the transaction and runs it as usual, but if the sequencer is not working for any reason and the transaction has not been run after a certain amount of time, the Etherlink Smart Rollup nodes run the transaction themselves.
In this way, you can submit emergency transactions to the delayed inbox when the sequencer is not working.

Delayed inbox transactions cost 1 tez (on Tezos, charged to the account that submits it) in addition to the normal Etherlink execution fee.
However, delayed inbox transactions do not require an inclusion fee as described in [Fee structure](/network/fees).
Therefore, you can calculate the execution fee as on any other Ethereum transaction and use that as the execution fee.
This transaction fee is deducted from the Etherlink account that signed the transaction.

The general steps for submitting a transaction to the delayed inbox are:

1. Encode and sign the Etherlink transaction as usual with a library such as ethers.js.
1. Send the transaction to the delayed inbox contract as in an ordinary Tezos transaction, with a library such as [Taquito](https://taquito.io/).

The delayed inbox transaction requires 1 tez and these parameters:

- `evm_rollup`: The address of the Etherlink Smart Rollup, which you can get from [Network information](/get-started/network-information)
- `transaction`: The signed transaction to run on Etherlink

The addresses of the delayed inbox smart contracts are:

- Shadownet Testnet: `KT18tqoSSpiMy6sizSMx9kQCe29EQfGq9wWv`
- Ghostnet Testnet: `KT1X1M4ywyz9cHvUgBLTUUdz3GTiYJhPcyPh`
- Mainnet: `KT1Vocor3bL5ZSgsYH9ztt42LNhqFK64soR4`

This example signs an Etherlink transaction that transfers 1 XTZ and submits it to the delayed inbox on Shadownet Testnet:

```javascript
const { ethers } = require("ethers");
const { TezosToolkit } = require("@taquito/taquito");
const { InMemorySigner } = require('@taquito/signer');

// Define the provider by its RPC address
const provider = new ethers.JsonRpcProvider("https://node.shadownet.etherlink.com");

// Sender's private key
const privateKey = process.env.ETHERLINK_PRIVATE_KEY;
const etherlinkWallet = new ethers.Wallet(privateKey, provider);

// Sign and return Etherlink transaction
const signEtherlinkTransaction = async () => {

  // Create the transaction
  const estimateTx = {
    // Send XTZ to this address
    to: "0x46899d4FA5Ba90E3ef3B7aE8aae053C662c1Ca1d",
    value: ethers.parseEther("0.1"), // Sending 0.1 XTZ
    gasLimit: 21000, // Replace with an estimate later
    maxFeePerGas: ethers.parseUnits("1", "gwei"), // Limit transaction to gas price of 1 gwei
    nonce: await provider.getTransactionCount(etherlinkWallet.address, "latest"),
    chainId: (await provider.getNetwork()).chainId.toString(),
  };

  // Estimate the gas
  const estimatedGas = await provider.estimateGas(estimateTx);

  // Update the transaction with the estimated gas
  const tx = { ...estimateTx, gasLimit: estimatedGas };

  // Sign the transaction
  const signedTx = await etherlinkWallet.signTransaction(tx);
  console.log("Signed Transaction:", signedTx);

  return signedTx;
}

// Set up Taquito
const rpcUrl = 'https://rpc.shadownet.teztnets.com';
const Tezos = new TezosToolkit(rpcUrl);
Tezos.setProvider({ signer: new InMemorySigner(process.env.TEZOS_PRIVATE_KEY) })
const delayedInboxContractAddress = "KT18tqoSSpiMy6sizSMx9kQCe29EQfGq9wWv"; // Shadownet
const rollupAddress = 'sr19fMYrr5C4qqvQqQrDSjtP31GcrWjodzvg'; // Shadownet

// Send the transaction to the delayed inbox
const sendDelayedInboxTransaction = async (etherlinkTransaction) => {
  const delayedInboxContract = await Tezos.wallet.at(delayedInboxContractAddress);
  try {
    const op = await delayedInboxContract.methodsObject.default({
      evm_rollup: rollupAddress,
      transaction: etherlinkTransaction.slice(2), // removes the 0x prefix
    }).send({ amount: 1 }); // Include 1 tez
    console.log(`Waiting for ${op.opHash} to be confirmed...`);
    await op.confirmation(2);
  } catch (error) {
    console.log(`Error: ${JSON.stringify(error, null, 2)}`);
  }
}

signEtherlinkTransaction()
  .then(sendDelayedInboxTransaction);
```

Similarly, this example signs a call to a smart contract and submits it to the delayed inbox:

```javascript
const { ethers } = require("ethers");
const { TezosToolkit } = require("@taquito/taquito");
const { InMemorySigner } = require('@taquito/signer');

const fullABI = [{"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}];

// Define the provider by its RPC address
const provider = new ethers.JsonRpcProvider("https://node.shadownet.etherlink.com");

// Sender's private key
const privateKey = process.env.ETHERLINK_PRIVATE_KEY;
const etherlinkWallet = new ethers.Wallet(privateKey, provider);

const contractAddress = "0x5F333531402b97ae46a0B6F3E8BC35Ac5A76Ead4";

// Sign and return Etherlink smart contract call
const signEtherlinkSmartContractCall = async () => {
  const contractInterface = new ethers.Interface(fullABI);
  const data = contractInterface.encodeFunctionData("set", [11]);

  // Create the transaction
  const estimateTx = {
    to: contractAddress,
    value: 0,
    data: data,
    gasLimit: 41000, // Replace with an estimate later
    maxFeePerGas: ethers.parseUnits("1", "gwei"), // Limit transaction to gas price of 1 gwei
    nonce: await provider.getTransactionCount(etherlinkWallet.address, "latest"),
    chainId: (await provider.getNetwork()).chainId.toString(),
  };

  // Estimate the gas
  const estimatedGas = await provider.estimateGas(estimateTx);
  console.log("Estimated gas:", estimatedGas);

  // Update the transaction with the estimated gas
  const tx = { ...estimateTx, gasLimit: estimatedGas };

  // Sign the transaction
  const signedTx = await etherlinkWallet.signTransaction(tx);
  console.log("Signed Transaction:", signedTx);

  return signedTx;
}

// Set up Taquito
const Tezos = new TezosToolkit('https://rpc.shadownet.teztnets.com');
Tezos.setProvider({ signer: new InMemorySigner(process.env.TEZOS_PRIVATE_KEY) })
const delayedInboxContractAddress = "KT18tqoSSpiMy6sizSMx9kQCe29EQfGq9wWv"; // Shadownet
const rollupAddress = 'sr19fMYrr5C4qqvQqQrDSjtP31GcrWjodzvg'; // Shadownet

// Send the transaction to the delayed inbox
const sendDelayedInboxTransaction = async (etherlinkTransaction) => {
  const delayedInboxContract = await Tezos.wallet.at(delayedInboxContractAddress);
  try {
    const op = await delayedInboxContract.methodsObject.default({
      evm_rollup: rollupAddress,
      transaction: etherlinkTransaction.slice(2), // removes the 0x prefix
    }).send({ amount: 1 }); // Include 1 tez
    console.log(`Waiting for ${op.opHash} to be confirmed...`);
    await op.confirmation(2);
  } catch (error) {
    console.log(`Error: ${JSON.stringify(error, null, 2)}`);
  }
}

signEtherlinkSmartContractCall()
  .then(sendDelayedInboxTransaction);
```
