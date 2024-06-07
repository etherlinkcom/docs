---
title: Running an Etherlink Smart Rollup node
---

Etherlink uses Smart Rollup nodes as a bridge between the EVM transactions on the EVM nodes and Tezos layer 1.
Public Smart Rollup nodes for Etherlink are not yet available, so you must run your own if you want to participate in the Etherlink network.

The Smart Rollup node runs the _kernel_, which is a Rust program compiled in WASM implementing the semantics of Etherlink blocks and transactions.

To start, the node uses the _installer kernel_, which is a compressed version of the kernel that provides only enough information to install the original kernel.
The data for the original kernel is stored in separate files called _preimages_.

## References

Make sure that you understand the interaction between different nodes as described in [Etherlink architecture](/network/architecture).

For more information about Smart Rollup nodes in general, see [Smart Rollups](https://docs.tezos.com/architecture/smart-rollups) on docs.tezos.com and [Smart Rollup Node](https://tezos.gitlab.io/shell/smart_rollup_node.html) in the Octez documentation.

## Running the Smart Rollup node from a snapshot

You can start the Smart Rollup node with a snapshot of the Etherlink state to prevent it from having to compute the state from Etherlink genesis.

For simplicity, these steps show how to run the Smart Rollup node in observer mode:

1. Get a built version of the Smart Rollup node binary, named `octez-smart-rollup-node`.
The best place to get the most recent binary files to use with Etherlink is https://gitlab.com/tezos/tezos/-/releases.

1. Initialize the local context of the node, which is where it stores local data:

   1. Set the environment variable `sr_observer_data_dir` to the directory where the node should store its local data.
   The default value is `$HOME/.tezos-smart-rollup-node`.
   1. Initialize the local context by running this command:

      ```bash
      octez-smart-rollup-node init observer config for sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf \
        with operators --data-dir $sr_observer_data_dir \
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

1. Download the latest snapshot from https://snapshots.eu.tzinit.org/etherlink-mainnet/, which is named `eth-mainnet.snapshot`:

   ```bash
   wget https://snapshots.eu.tzinit.org/etherlink-mainnet/eth-mainnet.snapshot
   ```

1. Load the snapshot:

   ```bash
   octez-smart-rollup-node --endpoint https://rpc.tzkt.io/mainnet \
     snapshot import eth-mainnet.snapshot \
     --data-dir $sr_observer_data_dir
   ```

1. Start the Smart Rollup node in observer mode by running this command and using the RPC endpoint of a layer 1 node:

   ```bash
   octez-smart-rollup-node --endpoint https://rpc.tzkt.io/mainnet run \
     --data-dir $sr_observer_data_dir
   ```

   As in this example, you can use a public layer 1 RPC node for initial setup, or you can connect it to a layer 1 node that you are running for a more stable connection.
   A rolling node is sufficient if you are using a recent snapshot; if the snapshot is old, the Smart Rollup node needs a connection to an archive node.
   After that you can connect it to a rolling node.

1. Verify that the Smart Rollup node is running by querying it.
For example, this query gets the health of the node:

   ```bash
   curl -s http://localhost:8932/health
   ```

Now that you have a Smart Rollup node configured for Etherlink, you can run an Etherlink EVM node, as described in [Running an Etherlink EVM node](/network/evm-nodes).
