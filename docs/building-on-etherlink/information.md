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
  --url https://node.ghostnet.etherlink.com \
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
  --url https://node.ghostnet.etherlink.com \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"jsonrpc": "2.0", "method": "net_version"}'
```

## Getting information about smart contracts

Etherlink supports the standard EVM [`eth_getCode`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getcode) and [`eth_getStorageAt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat) endpoints to get the code of a contract and its storage in hexadecimal, as in this example:

```bash
curl --request POST \
  --url https://node.ghostnet.etherlink.com \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"jsonrpc": "2.0", "params": ["0x319dce04624e67b1fc3DEb21426A1E76113bD732", "0x0", "latest" ], "method": "eth_getStorageAt"}'
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
  --url https://node.ghostnet.etherlink.com \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"jsonrpc": "2.0", "params": ["0x9e71aeeaf5146359879c412b24a85d9a0bc958e2e4305dafabf5e908bea265c3"], "method": "eth_getTransactionByHash"}'
```

The response includes the amount of XTZ in the transaction, the to and from addresses, and other information, as in this example:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "blockHash": "0x6c8490898a6b3d959ba46657d4e995771b076288a97508c0f80f22ee6925e210",
    "blockNumber": "0x118f087",
    "from": "0x45ff91b4bf16ac9907cf4a11436f9ce61be0650d",
    "gas": "0x98496",
    "gasPrice": "0x3b9aca00",
    "hash": "0x9e71aeeaf5146359879c412b24a85d9a0bc958e2e4305dafabf5e908bea265c3",
    "input": "0x",
    "nonce": "0x43",
    "to": "0x46899d4fa5ba90e3ef3b7ae8aae053c662c1ca1d",
    "transactionIndex": "0x0",
    "value": "0xde0b6b3a7640000",
    "v": "0x3e919",
    "r": "0x32b62cdd9b216d23234513504b31696afaef2399b033f61b063d37d7862fd1e2",
    "s": "0x5f77fc35d6b9156939ea4862de5b1f0ff48265a856dba00c49af59037431136a"
  }
}
```

You can also get transactions by block number or hash and the index of the transaction in the block, as in these examples:

```bash
curl --request POST \
  --url https://node.ghostnet.etherlink.com \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"jsonrpc": "2.0", "params": ["0x118f087", "0x0"], "method": "eth_getTransactionByBlockNumberAndIndex"}'
```

```bash
curl --request POST \
  --url https://node.ghostnet.etherlink.com \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"jsonrpc": "2.0", "params": ["0x6c8490898a6b3d959ba46657d4e995771b076288a97508c0f80f22ee6925e210", "0x0"], "method": "eth_getTransactionByBlockHashAndIndex"}'
```

For even more information about transactions and blocks, see [Tracing transactions](/building-on-etherlink/transactions#tracing-transactions).

## Using ethers.js

Similarly, you can use [ethers.js](https://docs.ethers.org/v6/) to get information about Etherlink.
This example uses ethers.js to get information about Etherlink, including the current block number, an account balance, and information about a block and a transaction:

```javascript
const { ethers } = require("ethers");

// Define the provider by its RPC address
const provider = new ethers.JsonRpcProvider("https://node.ghostnet.etherlink.com");

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
  const block = await provider.getBlock("0xb8ebd2a872bd0008d2eae550e9fd41f409709e71acd4cf652ae58bf62ed1cdf3");
  console.log(block.number);

  // Get information about a transaction by its hash
  const receipt = await provider.getTransactionReceipt("0x6bc8e2c56b31081e915b9d15ae0eb2a1373b9f5a4b30f432c0abe9e344884410");
  console.log(receipt.blockNumber);
}

getInfo();
```
