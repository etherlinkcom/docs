---
title: Getting information about Etherlink
---

import PublicRpcRateLimitNote from '@site/docs/conrefs/rate-limit.md';

Etherlink supports standard EVM endpoints that allow you to get information about the Etherlink network and its accounts, including user accounts and smart contract accounts.

- For a list of endpoints that Etherlink supports, see [Ethereum endpoint support](/building-on-etherlink/endpoint-support)
- For more information about the endpoints on this page, see the reference for the Ethereum [JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc).

<PublicRpcRateLimitNote />

## Getting the balance of accounts

To get the balance of a user account or smart contract, pass the account address to the [`eth_getBalance`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getbalance) endpoint, as in this example:

```bash
curl --request POST \
  --url https://node.mainnet.etherlink.com \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"jsonrpc": "2.0", "params": ["0x45Ff91b4bF16aC9907CF4A11436f9Ce61BE0650d", "latest" ], "method": "eth_getBalance"}'
```

The response includes the balance in XTZ in hexadecimal:

```json
{
  "jsonrpc": "2.0",
  "result": "0x6dc7654b7f612a7608"
}
```

## Getting the chain ID

Etherlink supports the standard EVM [`eth_chainId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_chainid) and [`net_version`](https://ethereum.org/en/developers/docs/apis/json-rpc/#net_version) endpoints to get the ID of the current network.
The `eth_chainId` endpoint returns the chain ID in hexadecimal and the `net_version` endpoint returns it in decimal, as in this example:

```bash
curl --request POST \
  --url https://node.mainnet.etherlink.com \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"jsonrpc": "2.0", "method": "net_version"}'
```

## Getting information about smart contracts

Etherlink supports the standard EVM [`eth_getCode`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getcode) and [`eth_getStorageAt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat) endpoints to get the code of a contract and its storage in hexadecimal, as in this example:

```bash
curl --request POST \
  --url https://node.mainnet.etherlink.com \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"jsonrpc": "2.0", "params": ["0xe92c00BC72dD12e26E61212c04E8D93aa09624F2", "0x0", "latest" ], "method": "eth_getStorageAt"}'
```

## Getting information about transactions

Etherlink supports several standard Ethereum endpoints to get information about transactions:

- [`eth_getTransactionByBlockNumberAndIndex`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactionbyblocknumberandindex)
- [`eth_getTransactionByBlockHashAndIndex`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactionbyblockhashandindex)
- [`eth_getTransactionByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactionbyhash)
- [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactionreceipt)
- [`eth_getTransactionCount`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactioncount)
- [`eth_getTransactionByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactionbyhash)

For example, you can get information about a transaction by passing its hash to the `eth_getTransactionByHash` or `eth_getTransactionReceipt` endpoints, as in this example:

```bash
curl --request POST \
  --url https://node.mainnet.etherlink.com \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"jsonrpc": "2.0", "params": ["0xe017665cd7bfdef375a863114ac9f7ed2538da4d8584b0f1e0aa71ce96342aee"], "method": "eth_getTransactionByHash"}'
```

The response includes the amount of XTZ in the transaction, the to and from addresses, and other information, as in this example:

```json
{
  "id": null,
  "jsonrpc": "2.0",
  "result": {
    "type": "0x2",
    "chainId": "0xa729",
    "hash": "0xe017665cd7bfdef375a863114ac9f7ed2538da4d8584b0f1e0aa71ce96342aee",
    "nonce": "0x18f",
    "blockHash": "0x45b2e97b0fd5b64a70f107091f013112b88804e76d7556d9922c8c0cfadc5c89",
    "blockNumber": "0x1737185",
    "transactionIndex": "0x2",
    "from": "0xc63c1a772a8b089d011ac224639bb1c25b032793",
    "to": "0xff00000000000000000000000000000000000002",
    "value": "0x0",
    "gas": "0xf4240",
    "maxFeePerGas": "0x174876e800",
    "maxPriorityFeePerGas": "0x174876e801",
    "gasPrice": "0x174876e800",
    "accessList": [],
    "input": "0x379607f50000000000000000000000000000000000000000000000000000000000003225",
    "v": "0x0",
    "r": "0x5c77847528151c2be044f1836b3b5056d83ac483676a5748e0a7b7d62a5f002",
    "s": "0x534cdd8c3a70757f9a3ce9a490ef311ba60c69d1e7e210c2d87baebf3a900810"
  }
}
```

You can also get transactions by block number or hash and the index of the transaction in the block, as in these examples:

```bash
curl --request POST \
  --url https://node.mainnet.etherlink.com \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"jsonrpc": "2.0", "params": ["0x118f087", "0x0"], "method": "eth_getTransactionByBlockNumberAndIndex"}'
```

```bash
curl --request POST \
  --url https://node.mainnet.etherlink.com \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"jsonrpc": "2.0", "params": ["0x45b2e97b0fd5b64a70f107091f013112b88804e76d7556d9922c8c0cfadc5c89", "0x0"], "method": "eth_getTransactionByBlockHashAndIndex"}'
```

For even more information about transactions and blocks, see [Tracing transactions](/building-on-etherlink/transactions#tracing-transactions).

## Using ethers.js

Similarly, you can use [ethers.js](https://docs.ethers.org/v6/) to get information about Etherlink.
This example uses ethers.js to get information about Etherlink, including the current block number, an account balance, and information about a block and a transaction:

```javascript
const { ethers } = require("ethers");

// Define the provider by its RPC address
const provider = new ethers.JsonRpcProvider("https://node.mainnet.etherlink.com");

// Sender's private key
const privateKey = process.env.ETHERLINK_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

async function getInfo() {

  // Get the current block number
  console.log(await provider.getBlockNumber());

  // Get account balance in XTZ
  const rawBalance = await provider.getBalance(wallet.address);
  console.log(ethers.formatUnits(rawBalance, 18));

  // Get a block by its hash
  const block = await provider.getBlock("0x45b2e97b0fd5b64a70f107091f013112b88804e76d7556d9922c8c0cfadc5c89");
  console.log(block.number);

  // Get information about a transaction by its hash
  const receipt = await provider.getTransactionReceipt("0xe017665cd7bfdef375a863114ac9f7ed2538da4d8584b0f1e0aa71ce96342aee");
  console.log(receipt.blockNumber);
}

getInfo();
```
