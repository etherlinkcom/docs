---
title: Running an Etherlink EVM node
---

The Etherlink EVM nodes are responsible for maintaining a copy of the Etherlink context and applying new blueprints that process EVM transactions.

## Prerequisites

- Make sure you understand the interaction between different nodes as described in [Etherlink architecture](./architecture).
- Run an Etherlink Smart Rollup node as described in [Running an Etherlink Smart Rollup node](./smart-rollup-nodes).
- Get the Etherlink installer kernel (`installer.hex` file), which you can build yourself as described in [Building the Etherlink kernel](./smart-rollup-nodes#building-the-etherlink-kernel) or download here: [installer.hex](/files/installer.hex).

## Running an Etherlink EVM node

Follow these steps to run the EVM node:

1. Get a built version of the EVM node binary, named `octez-evm-node`.
Octez does not yet provide a binary build of the EVM node as part of its binary distribution or in the `tezos/tezos` docker image, so you must build it yourself from the latest commit from the Octez source code.
See [Installing Octez](https://tezos.gitlab.io/introduction/howtoget.html).
1. Set the `sr_node_observer_rpc` environment variable to the URL to the Smart Rollup node you set up in the previous section, such as `http://localhost:8932`.
1. Set the `evm_observer_dir` environment variable to the directory where the node should store its local data.
1. Initialize the node by running this command:

   ```bash
   octez-evm-node init config --devmode \
     --data-dir $evm_observer_dir --rollup-node-endpoint $sr_node_observer_rpc \
     --preimages-endpoint https://snapshots.eu.tzinit.org/etherlink-mainnet/wasm_2_0_0 \
     --evm-node-endpoint https://node.mainnet.etherlink.com
   ```

   This command uses preimages hosted online.
   It's safe to use these preimages, but if you don't trust them, you can move the contents of the `wasm_2_0_0/` directory that was created when you built the installer kernel to the local data directory.
   However, in this case, you must manually update this directory with the preimages of every kernel voted by the community and deployed on Etherlink after that.

1. Run this command to start the node with the Etherlink installer kernel that you built or downloaded; change the name of the `installer.hex` file in the command accordingly:

   ```bash
   octez-evm-node run observer --data-dir $evm_observer_dir --initial-kernel installer.hex
   ```

By default, the EVM node exposes its JSON RPC API endpoint to `localhost:8545`.
You can test that everything works as expected by running RPC requests manually or by setting your wallet to use your local node.
