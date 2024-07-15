---
title: Running an Etherlink EVM node
---

The Etherlink EVM nodes are responsible for maintaining a copy of the Etherlink context and applying new blueprints that process EVM transactions.

## Prerequisites

- Make sure you understand the interaction between different nodes as described in [Etherlink architecture](/network/architecture).
- Run an Etherlink Smart Rollup node as described in [Running an Etherlink Smart Rollup node](/network/smart-rollup-nodes).
Public Smart Rollup nodes for Etherlink are not yet available, so you must run your own if you want to participate in the Etherlink network.

The EVM node runs Etherlink's kernel.
You can get the kernel by importing it from a running Etherlink Smart Rollup node or by providing the installer kernel.

## Running an Etherlink EVM node from an existing Etherlink Smart Rollup node

Follow these steps to run the EVM node from an existing Etherlink Smart Rollup node:

1. Get a built version of the EVM node binary, named `octez-evm-node`.
Octez does not yet provide a binary build of the EVM node as part of its binary distribution or in the `tezos/tezos` docker image, so you must build it yourself from the latest commit from the Octez source code.
See [Installing Octez](https://tezos.gitlab.io/introduction/howtoget.html).
1. Set the `sr_node_observer_rpc` environment variable to the URL to the Smart Rollup node, such as `http://localhost:8932`.
1. Set the `evm_observer_dir` environment variable to the directory where the node should store its local data.
The default is `$HOME/.octez-evm-node`.
1. Initialize the node by running this command:

   ```bash
   octez-evm-node init config --devmode \
     --data-dir $evm_observer_dir --rollup-node-endpoint $sr_node_observer_rpc \
     --preimages-endpoint https://snapshots.eu.tzinit.org/etherlink-mainnet/wasm_2_0_0 \
     --evm-node-endpoint https://node.mainnet.etherlink.com
   ```

   This configuration uses the preimages that the Tezos Foundation hosts on a file server on a so-called "preimages endpoint".
   It's safe to use these preimages because the node verifies them.
   If you don't want to use third-party preimages, you can build the kernel yourself and move the contents of the `wasm_2_0_0/` directory to the local data directory; see [Building the Etherlink kernel](/network/building-kernel).
   However, in this case, you must manually update this directory with the preimages of every kernel voted by the community and deployed on Etherlink after that.

1. Set the `sr_observer_data_dir` environment variable to the location of the data directory for the Smart Rollup node.
The default value is `$HOME/.tezos-smart-rollup-node`.

1. Run this command to import the kernel from the Smart Rollup node:

   ```bash
   octez-evm-node init from rollup node $sr_observer_data_dir --data-dir $evm_observer_dir
   ```

1. Run this command to start the node:

   ```bash
   octez-evm-node run observer --data-dir $evm_observer_dir
   ```

By default, the EVM node exposes its JSON RPC API endpoint to `localhost:8545`.
You can test that everything works as expected by running RPC requests manually or by setting your wallet to use your local node.
For example, this command gets the number of the most recent block in hexadecimal:

```bash
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_blockNumber"}' http://localhost:8545
```

## Running an Etherlink EVM node from the installer kernel

Follow these steps to run the EVM node from the installer kernel:

1. Get the Etherlink installer kernel (`installer.hex` file), which you can build yourself as described in [Building the Etherlink kernel](/network/building-kernel) or download here: [installer.hex](/files/installer.hex).
1. Get a built version of the EVM node binary, named `octez-evm-node`.
Octez does not yet provide a binary build of the EVM node as part of its binary distribution or in the `tezos/tezos` docker image, so you must build it yourself from the latest commit from the Octez source code.
See [Installing Octez](https://tezos.gitlab.io/introduction/howtoget.html).
1. Set the `sr_node_observer_rpc` environment variable to the URL to the Smart Rollup node, such as `http://localhost:8932`.
1. Set the `evm_observer_dir` environment variable to the directory where the node should store its local data.
The default is `$HOME/.octez-evm-node`.
1. Initialize the node by running this command:

   ```bash
   octez-evm-node init config --devmode \
     --data-dir $evm_observer_dir --rollup-node-endpoint $sr_node_observer_rpc \
     --preimages-endpoint https://snapshots.eu.tzinit.org/etherlink-mainnet/wasm_2_0_0 \
     --evm-node-endpoint https://node.mainnet.etherlink.com
   ```

   This configuration uses the preimages that the Tezos Foundation hosts on a file server on a so-called "preimages endpoint".
   It's safe to use these preimages because the node verifies them.
   If you don't want to use third-party preimages, you can build the kernel yourself and move the contents of the `wasm_2_0_0/` directory to the local data directory; see [Building the Etherlink kernel](/network/building-kernel).
   However, in this case, you must manually update this directory with the preimages of every kernel voted by the community and deployed on Etherlink after that.

1. Run this command to start the node with the Etherlink installer kernel that you built or downloaded; change the name of the `installer.hex` file in the command accordingly:

   ```bash
   octez-evm-node run observer --data-dir $evm_observer_dir --initial-kernel installer.hex
   ```

   The `--initial-kernel` argument is needed only the first time that you start the node.

By default, the EVM node exposes its JSON RPC API endpoint to `localhost:8545`.
You can test that everything works as expected by running RPC requests manually or by setting your wallet to use your local node.
For example, you can call the node's RPC API with this command, putting the URL to your EVM node at the end:

```bash
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"tez_kernelVersion"}' http://localhost:8545
```
