---
title: Getting updates with WebSockets
---

Starting with version 0.14, the Octez EVM node supports requests over WebSockets.
The WebSocket protocol provides bidirectional, real-time, and persistent communication between a client and server over a single, long-lived TCP connection.
WebSockets provide faster and more efficient data transfer than calling the node's REST HTTP endpoints, avoiding the overhead of repeatedly opening and closing connections with the server and performing TLS handshakes.

Another advantage of using WebSockets on Etherlink is support for the `eth_subscribe` method.
This method allows clients to subscribe to Etherlink events and receive notifications when these events happen, such as new blocks, transactions in the pool, and smart contract event logs.
The node sends these notifications to the client in real time without the need for continuous polling.
In this way, WebSockets enable use cases that need blockchain analytics and monitoring with real-time updates from the network.

You can use any WebSocket framework to connect to Etherlink nodes.

:::note

WebSockets are an experimental feature and may change in future versions.

:::

## Enabling WebSockets

WebSocket connections are not enabled on the EVM node by default.
To use them, you must run your own EVM node and enable them on it.

:::warning

The EVM node does not enforce rate limits on WebSocket connections, so be careful about who can access your EVM node and how much network bandwidth it uses.

:::

1. Set up an EVM node as described in [Running an Etherlink EVM node](/network/evm-nodes).

1. In the EVM node configuration file, enable WebSockets by setting the `enable_websocket` feature to `true` in the `experimental_features` section.
The configuration file looks like this example:

   ```json
   {
     "observer": {
       "evm_node_endpoint": "https://relay.ghostnet.etherlink.com",
       "rollup_node_tracking": false
     },
     "experimental_features": {
       "enable_websocket": true
     },
     "kernel_execution": {
       "preimages_endpoint": "https://snapshots.tzinit.org/etherlink-ghostnet/wasm_2_0_0"
     }
   }
   ```

1. Restart the node.

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

See the documentation for your WebSocket client library for how to manage the connection, receive messages, and close the connection.

## WebSocket subscriptions

You can use WebSockets to subscribe to these Etherlink events:

- `newBlockHeaders`: Provides information about each new Etherlink block, including the block number, the hash of the parent block, and a list of the transactions in that block

- `pendingTransactions`: Provides the hashes of pending transactions in the node's memory

   :::note

   This subscription provides only the transactions that the connected EVM node is aware of, not all pending transactions.
   To ensure that this subscription provides the hash of a transaction, submit that transaction to the EVM node that is hosting the WebSocket subscription.

   :::

- `logs`: Returns the events emitted by smart contracts, including the address of the contract, the associated topics, and the data for the event
