---
title: Getting updates with WebSockets
dependencies:
  octez: 23.2
  ethers: 6.13.5
---

The Octez EVM node supports requests over WebSockets.
The WebSocket protocol provides bidirectional, real-time, and persistent communication between a client and server over a single, long-lived TCP connection.
WebSockets provide faster and more efficient data transfer than calling the node's REST HTTP endpoints, avoiding the overhead of repeatedly opening and closing connections with the server and performing TLS handshakes.

Another advantage of using WebSockets on Etherlink is support for the `eth_subscribe` method.
This method allows clients to subscribe to Etherlink events and receive notifications when these events happen, such as new blocks, transactions in the pool, and smart contract event logs.
The node sends these notifications to the client in real time without the need for continuous polling.
In this way, WebSockets enable use cases that need blockchain analytics and monitoring with real-time updates from the network.

You can use any WebSocket framework to connect to Etherlink nodes.

:::note

Using WebSockets as described on this page requires version 0.28 or later of the Octez EVM node.

:::

## Enabling WebSockets

WebSocket connections are not enabled on the EVM node by default.
To use them, you must run your own EVM node and enable them on it.

:::warning

The EVM node does not enforce rate limits on WebSocket connections, so be careful about who can access your EVM node and how much network bandwidth it uses.

:::

1. Set up an EVM node as described in [Running an Etherlink EVM node](/network/evm-nodes).

1. Start or restart the node with the `--ws` switch, as in this example:

   ```bash
   octez-evm-node run observer \
     --network shadownet \
     --history rolling:1 \
     --data-dir <EVM_DATA_DIR> \
     --dont-track-rollup-node \
     --init-from-snapshot \
     --ws
   ```

1. Verify that the node accepts WebSocket connections.
For example, you can use the `wscat` program to send and receive messages over a WebSocket connection on the command line:

   1. Install `wscat`.

   1. Connect to your EVM node by running this command, where `<URL>` is the URL of the node's WebSocket endpoint, which is on port 8545 by default:

      ```bash
      wscat -c <URL>/ws
      ```

      For example, if the EVM node is on the same computer, the command looks like this:

      ```bash
      wscat -c ws://127.0.0.1:8545/ws
      ```

   1. Send an RPC request over the WebSocket connection.
   For example, this RPC request gets the current block number:

      ```json
      {"jsonrpc": "2.0","method": "eth_getBlockByNumber","params":["latest", false],"id": 1}
      ```

      The response from the EVM node shows the current block number in hexadecimal and provides other information about that block.

      Similarly, you can get the balance of an account in hexadecimal by passing the address of the account to the `eth_getBalance` endpoint, as in this example:

      ```json
      {"jsonrpc": "2.0","method": "eth_getBalance","params":["0x45Ff91b4bF16aC9907CF4A11436f9Ce61BE0650d"],"id": 1}
      ```

      For other RPC methods that the EVM node supports, see [Ethereum endpoint support](/building-on-etherlink/endpoint-support).

Now clients can initiate connections over WebSockets.
For examples with other clients that can use WebSocket connections with Etherlink EVM nodes, see [Using WebSockets for instant notifications from Etherlink](https://medium.com/@etherlink/using-websockets-for-instant-notifications-from-etherlink-b70d1c79c7a1).

## Subscribing to events

The `eth_subscribe` method allows clients to subscribe to real-time updates for specific blockchain events, such as new blocks, pending transactions, and contract event logs.

When a client successfully creates a subscription with this method, the node responds with a unique subscription ID.
Then, when relevant events occur, the node sends push notifications to the client that include the subscription ID and the event data.

The initial request to the `eth_subscribe` method determines what events trigger these push notifications.
For example, if you subscribe to the `newBlockHeaders` event, the node sends a message to the client when each new Etherlink block (blueprint) is created.
This example uses the [Web3.js](https://docs.web3js.org/) library to subscribe to this event and print each new block number to the console:

```javascript
import Web3 from 'web3';

const web3Instance = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545/ws'));

// Subscribe to new block headers
const newBlocksSubscription = await web3Instance.eth.subscribe('newBlockHeaders');
newBlocksSubscription.on('error', error => {
    console.log('Error when subscribing to New block header:', error);
});

newBlocksSubscription.on('data', blockhead => {
    // Log the block number
    console.log(`New block: ${blockhead.number}`);
});
```

This example subscribes to the event logs for an ERC-20 contract and logs information about each transfer event:

```javascript
import Web3 from 'web3';

const web3Instance = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545/ws'));

const fullABI = []; // Add ABI here

const contractAddress = "0x3D3402f42Fb1ef5Cd643a458A4059E0055d48F9e";
const contract = new web3Instance.eth.Contract(fullABI, contractAddress);

const eventsSubscription = contract.events.Transfer();

// Subscribe to new block headers
eventsSubscription.on('error', error => {
    console.log('Error when subscribing to New block header:', error);
});

eventsSubscription.on('data', data => {
    console.log(data);
});

```

This example uses [ethers.js](https://docs.ethers.org/v6/) to subscribe to transfer events from the same contract:

```javascript
const { ethers } = require("ethers");

const provider = new ethers.WebSocketProvider('ws://127.0.0.1:8545/ws');

const fullABI = []; // Add ABI here

const contractAddress = "0x3D3402f42Fb1ef5Cd643a458A4059E0055d48F9e";

// Create a contract instance
const contract = new ethers.Contract(contractAddress, fullABI, provider);

// Subscribe to the event using on with WebSocket provider
contract.on("Transfer", (from, to, value) => {
    console.log(`Transfer event detected:
From: ${from}
To: ${to}
Value: ${ethers.formatUnits(value, 18)} tokens`);
});

console.log("Listening for Transfer events...");
```

See the documentation for your WebSocket client library for how to manage the connection, receive messages, and close the connection.

## Subscribing to instant confirmations

You can subscribe to WebSockets to receive instant confirmations, which are notices from the sequencer that a transaction will appear in the next block.
Using WebSockets for instant confirmations requires at least version 0.49 of the `octez-evm-node` binary.

:::note

The Ethers.js and Web3.js libraries do not support custom WebSocket events and therefore you cannot use them to subscribe to instant confirmation events.
For JavaScript/TypeScript, use the built-in Node.JS WebSocket library as in the example below.

:::

Etherlink provides two custom WebSocket events that you can subscribe to for notice of upcoming transactions:

- `tez_newIncludedTransactions`: Provides confirmations for transactions that the sequencer intends to put in the next block **before** it has executed them.
Returns a transaction object.

- `tez_newPreconfirmedReceipts`: Provides confirmations for transactions that the sequencer **has executed** and intends to put in the next block.
Returns a transaction receipt.

For example, this JavaScript code subscribes to these events and prints information about them to the log:

```javascript
// Create a WebSocket connection to a local EVM node
const socket = new WebSocket('ws://127.0.0.1:8545/ws');

// When the connection is established, subscribe to events
socket.addEventListener('open', _event => {
  console.log('WebSocket connection established!');
  const includedTxPayload = {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_subscribe",
    params: ["tez_newIncludedTransactions"],
  };
  socket.send(JSON.stringify(includedTxPayload));
  const preconfirmedTxPayload = {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_subscribe",
    params: ["tez_newPreconfirmedReceipts"],
  };
  socket.send(JSON.stringify(preconfirmedTxPayload));
});

// Log when a message is received from the server.
socket.addEventListener('message', event => {
  console.log('Message from server: ', event.data);
});

// Executes when the connection is closed, providing the close code and reason.
socket.addEventListener('close', event => {
  console.log('WebSocket connection closed:', event.code, event.reason);
});

// Executes if an error occurs during the WebSocket communication.
socket.addEventListener('error', error => {
  console.error('WebSocket error:', error);
});
```

The response to the `tez_newIncludedTransactions` event (a transaction object) includes basic information about the transaction including its hash but not the gas used (because the transaction has not been executed yet), as in this example:

```json
{
  "jsonrpc": "2.0",
  "method": "eth_subscription",
  "params": {
    "result": {
      "type": "0x2",
      "chainId": "0x1f308",
      "hash": "0xfbb0025e811b8bf37034e508da4740c68164c33947089b1c22119be55258a3e1",
      "nonce": "0x7",
      "blockHash": null,
      "blockNumber": null,
      "transactionIndex": null,
      "from": "0x45ff91b4bf16ac9907cf4a11436f9ce61be0650d",
      "to": "0x46899d4fa5ba90e3ef3b7ae8aae053c662c1ca1d",
      "value": "0x16345785d8a0000",
      "gas": "0x98496",
      "maxFeePerGas": "0x3b9aca00",
      "maxPriorityFeePerGas": "0x0",
      "gasPrice": "0x3b9aca00",
      "accessList": [],
      "input": "0x",
      "v": "0x1",
      "r": "0xe4d96c84fbf0ea73fb39ba5551acce44a41ba03b4502da1d93f1e4a02ce51a3e",
      "s": "0x6bc2aaa1580b58213e6e6586ae7b38351c2304df370853c74812ae09f5e74275"
    },
    "subscription": "0x40f582349eeac9b85b9ba3d936de0ebb"
  }
}
```

The response to the `tez_newPreconfirmedReceipts` event (a transaction receipt) is similar but also includes the number of the block and the gas used, as in this example:

```json
{
  "jsonrpc": "2.0",
  "method": "eth_subscription",
  "params": {
    "result": {
      "transactionHash": "0x2096d81abf605780b56c0db5f415e0bff29c82fbd73912348106ac8c61a808cc",
      "transactionIndex": "0x1",
      "blockHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "blockNumber": "0x2e4da9",
      "from": "0x45ff91b4bf16ac9907cf4a11436f9ce61be0650d",
      "to": "0x46899d4fa5ba90e3ef3b7ae8aae053c662c1ca1d",
      "cumulativeGasUsed": "0x5208",
      "effectiveGasPrice": "0x3b9aca00",
      "gasUsed": "0x5208",
      "logs": [],
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "type": "0x2",
      "status": "0x1",
      "contractAddress": null
    },
    "subscription": "0x221fe712815043cf05255c8b568557c5"
  }
}
```

For more information about instant confirmations, see [Getting instant confirmations](/building-on-etherlink/transactions#getting-instant-confirmations)

## WebSocket subscriptions

You can use WebSockets to subscribe to these Etherlink events:

- `newBlockHeaders`: Provides information about each new Etherlink block, including the block number, the hash of the parent block, and a list of the transactions in that block

- `pendingTransactions`: Provides the hashes of pending transactions in the node's memory

   :::note

   This subscription provides only the transactions that the connected EVM node is aware of, not all pending transactions.
   To ensure that this subscription provides the hash of a transaction, submit that transaction to the EVM node that is hosting the WebSocket subscription.

   :::

- `tez_newIncludedTransactions`: Provides confirmations for transactions that the sequencer intends to put in the next block before it has executed them.

- `tez_newPreconfirmedReceipts`: Provides confirmations for transactions that the sequencer has executed and intends to put in the next block.
For more information, see [Getting instant confirmations](/building-on-etherlink/transactions#getting-instant-confirmations).

- `logs`: Returns the events emitted by smart contracts, including the address of the contract, the associated topics, and the data for the event
