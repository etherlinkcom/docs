---
title: Running a local sandbox
---

You can run a local sandbox to test Etherlink transactions and smart contracts locally.
The sandbox consists of an [EVM node](/network/evm-nodes) in a special mode that includes the functionality of the sequencer and does not need any other nodes.
The local sandbox is intended for local testing and debugging.

Follow these steps to start the local sandbox:

1. Get the latest release of the `octez-evm-node` binary as described in [Running an Etherlink EVM node](/network/evm-nodes).

1. Initialize the data directory for the EVM node, as in these examples, which use the variable `<EVM_DATA_DIR>` to represent the local folder for the data directory:

   Testnet:

   ```bash
   octez-evm-node init config \
     --network testnet \
     --data-dir <EVM_DATA_DIR> \
     --dont-track-rollup-node
   ```

   Mainnet:

   ```bash
   octez-evm-node init config \
     --network mainnet \
     --data-dir <EVM_DATA_DIR> \
     --dont-track-rollup-node
   ```

   :::note

   After you use the node in sandbox mode with a certain data directory, you cannot re-use that data directory for running an EVM node on Etherlink Mainnet or Testnet.
   Consider using a different data directory for the sandbox than you use for other EVM nodes.

   :::

1. (Optional) Enable WebSockets in the node by editing the configuration file as described in [Getting updates with WebSockets](/building-on-etherlink/websockets).

1. Start the node in sandbox mode from a snapshot, either based on the Mainnet or Testnet context:

   Testnet:

   ```bash
   ./octez-evm-node run sandbox \
     --network testnet \
     --data-dir <EVM_DATA_DIR> \
     --init-from-snapshot \
     --fund 0x45Ff91b4bF16aC9907CF4A11436f9Ce61BE0650d
   ```

   Mainnet:

   ```bash
   ./octez-evm-node run sandbox \
     --network mainnet \
     --data-dir <EVM_DATA_DIR> \
     --init-from-snapshot \
     --fund 0x45Ff91b4bF16aC9907CF4A11436f9Ce61BE0650d
   ```

   The `--fund` arguments in these commands send 10,000 XTZ to one or more bootstrap addresses that you can use in the sandbox.

   The sandbox node runs in `rolling:1` history mode.

   The node takes time to download the snapshot and start the sandbox.
   The node is ready when the log shows new block numbers, as in this example:

   ```
   Mar 14 11:04:04.155 NOTICE │ head is now 7523759, applied in 11.422ms
   ```

1. Verify that the sandbox node is running.
For example, you can call an RPC endpoint with a `curl` command to verify the amount of XTZ in the bootstrap accounts, as in this example:

```bash
curl -X POST -H 'Content-Type: application/json' \
  --data '{"jsonrpc": "2.0","method": "eth_getBalance","params":["0x45Ff91b4bF16aC9907CF4A11436f9Ce61BE0650d"],"id": 1}' \
  http://localhost:8545
```

Now you can use the sandbox environment like a private test network.
