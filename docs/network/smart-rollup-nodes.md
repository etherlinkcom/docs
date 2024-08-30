---
title: Running an Etherlink Smart Rollup node
---

Etherlink uses Smart Rollup nodes as a bridge between the EVM transactions on the EVM nodes and Tezos layer 1.
Public Smart Rollup nodes for Etherlink are not yet available, so you must run your own if you want to participate in the Etherlink network.

The Smart Rollup node runs the _kernel_, which is a Rust program compiled in WASM implementing the semantics of Etherlink blocks and transactions.

To start, the node uses the _installer kernel_, which is a compressed version of the kernel that provides only enough information to install the original kernel.
The data for the original kernel is stored in separate files called _preimages_.

You can run the Smart Rollup node starting from Etherlink genesis or from a snapshot of a recent Etherlink state.

## References

Make sure that you understand the interaction between different nodes as described in [Etherlink architecture](/network/architecture).

For more information about Smart Rollup nodes in general, see [Smart Rollups](https://docs.tezos.com/architecture/smart-rollups) on docs.tezos.com and [Smart Rollup Node](https://tezos.gitlab.io/shell/smart_rollup_node.html) in the Octez documentation.

You can run the Etherlink Smart Rollup in many modes, but these instructions cover only the most common modes:

- [Running the Smart Rollup node in operator mode](#running-the-smart-rollup-node-in-operator-mode)
- [Running the Smart Rollup node in observer mode](#running-the-smart-rollup-node-in-observer-mode)

## Running the Smart Rollup node in operator mode

Running the Smart Rollup node in operator mode is the best way to participate in Etherlink because in this mode the node posts commitments about Etherlink's state to layer 1.
These commitments validate Etherlink's state and ensure that Etherlink is processing blocks and transactions honestly according to its kernel.
As described in [Smart Rollups](https://docs.tezos.com/architecture/smart-rollups) on docs.tezos.com, one honest node is enough to ensure that Etherlink is running correctly, but adding more nodes strengthens its security and allows users to verify for themselves that Etherlink is running as intended.

Running the node in this mode requires an account with at least 10,000 liquid tez and certain other prerequisites:

- A Tezos layer 1 node running in archive mode or full mode with expanded node history, such as with the argument `--history-mode full:50`
- An account with at least 10,000 tez staked, referred to as the _operator account_
- A clean data directory that has not been used for another Smart Rollup node or a node running in a different mode

1. Get a built version of the Smart Rollup node binary, named `octez-smart-rollup-node`.
The best place to get the most recent binary files to use with Etherlink is https://gitlab.com/tezos/tezos/-/releases.

1. Initialize the local context of the node, which is where it stores local data:

   1. Set the environment variable `SR_DATA_DIR` to the directory where the node should store its local data.
   The default value is `$HOME/.tezos-smart-rollup-node`.

   1. Initialize the local context by running this command and using the address of the Etherlink Smart Rollup, which you can get from the [Network information](/get-started/network-information) page, and the address or Octez client alias for the operator account:

      ```bash
      octez-smart-rollup-node init operator config for sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf \
        with operators \
        operating:$OPERATOR_ACCOUNT \
        cementing:$OPERATOR_ACCOUNT \
        executing_outbox:$OPERATOR_ACCOUNT \
        --history-mode archive \
        --rpc-addr 0.0.0.0 \
        --data-dir $SR_DATA_DIR \
        --pre-images-endpoint https://snapshots.eu.tzinit.org/etherlink-mainnet/wasm_2_0_0
      ```

      This command generates a configuration file (`config.json`) in the local data folder:

      ```json
      { "smart-rollup-address": "sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf",
        "smart-rollup-node-operator":
          { "operating": "tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx",
            "cementing": "tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx",
            "executing_outbox": "tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx" },
        "fee-parameters": {}, "mode": "operator",
        "pre-images-endpoint":
          "https://snapshots.eu.tzinit.org/etherlink-ghostnet/wasm_2_0_0" }
      ```

      This configuration uses the preimages that the Tezos Foundation hosts on a file server on a so-called "preimages endpoint".
      It's safe to use these preimages because the node verifies them.
      If you don't want to use third-party preimages, you can build the kernel yourself and move the contents of the `wasm_2_0_0/` directory to the local data directory; see [Building the Etherlink kernel](/network/building-kernel).
      However, in this case, you must manually update this directory with the preimages of every kernel voted by the community and deployed on Etherlink after that.

1. To speed up the setup process by loading a snapshot, follow these steps.
If you don't load a snapshot, the node must compute the current state from genesis and that can take a long time.

   1. Download the latest snapshot from https://snapshots.eu.tzinit.org/etherlink-mainnet/:

      ```bash
      wget https://snapshots.eu.tzinit.org/etherlink-mainnet/eth-mainnet.full
      ```

   1. Load the snapshot:

      ```bash
      octez-smart-rollup-node \
        snapshot import eth-mainnet.full \
        --data-dir $SR_DATA_DIR
      ```

1. Start the Smart Rollup node by running this command and using the RPC endpoint of your layer 1 node:

   ```bash
   octez-smart-rollup-node --endpoint $LAYER_1_NODE run --data-dir $SR_DATA_DIR
   ```

   If you did not load a snapshot, the process of starting the node from genesis can take a long time because it must process every block.

1. Verify that the Smart Rollup node is running by querying it.
For example, this query gets the health of the node:

   ```bash
   curl -s http://localhost:8932/health
   ```

1. Ensure that the node runs persistently.
Look up how to run programs persistently in the documentation for your operating system.

Now that you have a Smart Rollup node configured for Etherlink, you can run an Etherlink EVM node, as described in [Running an Etherlink EVM node](./evm-nodes).

## Running the Smart Rollup node in observer mode

Running the Smart Rollup node in observer mode is the simplest way to run an Etherlink Smart Rollup node, but it does not strengthen the security of the system by posting commitments.
In observer mode, the node only monitors the state of Etherlink.

1. Get a built version of the Smart Rollup node binary, named `octez-smart-rollup-node`.
The best place to get the most recent binary files to use with Etherlink is https://gitlab.com/tezos/tezos/-/releases.

1. Initialize the local context of the node, which is where it stores local data:

   1. Set the environment variable `SR_DATA_DIR` to the directory where the node should store its local data.
   The default value is `$HOME/.tezos-smart-rollup-node`.

   1. Initialize the local context by running this command and using the address of the Etherlink Smart Rollup, which you can get from the [Network information](/get-started/network-information) page:

      ```bash
      octez-smart-rollup-node init observer config for sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf \
        with operators --data-dir $SR_DATA_DIR \
        --pre-images-endpoint https://snapshots.eu.tzinit.org/etherlink-mainnet/wasm_2_0_0
      ```

      This command generates a minimal configuration file (`config.json`) in the local data folder:

      ```json
      { "smart-rollup-address": "sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf",
        "smart-rollup-node-operator": {}, "fee-parameters": {}, "mode": "observer",
        "pre-images-endpoint":
          "https://snapshots.eu.tzinit.org/etherlink-mainnet/wasm_2_0_0" }
      ```

      This configuration uses the preimages that the Tezos Foundation hosts on a file server on a so-called "preimages endpoint".
      It's safe to use these preimages because the node verifies them.
      If you don't want to use third-party preimages, you can build the kernel yourself and move the contents of the `wasm_2_0_0/` directory to the local data directory; see [Building the Etherlink kernel](/network/building-kernel).
      However, in this case, you must manually update this directory with the preimages of every kernel voted by the community and deployed on Etherlink after that.

1. To speed up the setup process by loading a snapshot, follow these steps:

   1. Download the latest snapshot from https://snapshots.eu.tzinit.org/etherlink-mainnet/:

      ```bash
      wget https://snapshots.eu.tzinit.org/etherlink-mainnet/eth-mainnet.full
      ```

   1. Load the snapshot:

      ```bash
      octez-smart-rollup-node --endpoint https://rpc.tzkt.io/mainnet \
        snapshot import eth-mainnet.full \
        --data-dir $SR_DATA_DIR
      ```

1. Start the Smart Rollup node in observer mode by running this command and using the RPC endpoint of a layer 1 node:

   ```bash
   octez-smart-rollup-node --endpoint https://rpc.tzkt.io/mainnet run \
     --data-dir $SR_DATA_DIR
   ```

   As in this example, you can use a public layer 1 RPC node for initial setup, or you can connect it to a layer 1 node that you are running for a more stable connection.

   If you did not load a snapshot, the process of starting the node from genesis can take a long time because it must process every block.

1. Verify that the Smart Rollup node is running by querying it.
For example, this query gets the health of the node:

   ```bash
   curl -s http://localhost:8932/health
   ```

Now that you have a Smart Rollup node configured for Etherlink, you can run an Etherlink EVM node, as described in [Running an Etherlink EVM node](./evm-nodes).
