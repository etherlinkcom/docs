---
title: Running an Etherlink EVM node
---

The Etherlink EVM nodes are responsible for maintaining a copy of the Etherlink context and applying new blocks that process EVM transactions.

## Prerequisites

- Make sure you understand the interaction between different nodes as described in [Etherlink architecture](/network/architecture).
- If you want to verify the blocks that come from the sequencer, run an Etherlink Smart Rollup node as described in [Running an Etherlink Smart Rollup node](/network/smart-rollup-nodes).
Public Smart Rollup nodes for Etherlink are not yet available, so you must run your own if you want to participate in the Etherlink network.

The EVM node runs Etherlink's kernel.
You can get the kernel by importing it from a running Etherlink Smart Rollup node or by providing the installer kernel.

## System requirements

Running an Etherlink EVM node on Etherlink Mainnet requires a computer with 500GB of disk space and at least 16GB RAM.

## Getting the `octez-evm-node` binary

The easiest way to get the `octez-evm-node` binary is to download the binaries distributed as part of its latest release from https://gitlab.com/tezos/tezos/-/releases.
The release page provides static binaries for Linux systems (for amd64 and arm64 architectures).

As an alternative, you can use the minimal Docker image [tezos/tezos-bare](https://hub.docker.com/r/tezos/tezos-bare/tags?name=octez-evm-node) with a tag that includes `octez-evm-node`.
These images contain the correct version of the binary.

## Initializing the data directory

1. If you want your EVM node to check the correctness of the blocks it receives via a Smart Rollup node, set the `sr_node_observer_rpc` environment variable to the URL of that Etherlink Smart Rollup node, such as `http://localhost:8932`.
1. Set the `evm_observer_dir` environment variable to the directory where the node should store its local data.
The default is `$HOME/.octez-evm-node`.
1. Initialize the node. To trust incoming blocks, use `--dont-track-rollup-node`:

   ```bash
   octez-evm-node init config \
     --data-dir $evm_observer_dir --dont-track-rollup-node \
     --preimages-endpoint https://snapshots.eu.tzinit.org/etherlink-mainnet/wasm_2_0_0 \
     --evm-node-endpoint https://relay.mainnet.etherlink.com
   ```

   Alternatively, if you want to rely on a Smart Rollup node to check the correctness of blocks coming from the sequencer, use `--rollup-node-endpoint`:

   ```bash
   octez-evm-node init config \
     --data-dir $evm_observer_dir --rollup-node-endpoint $sr_node_observer_rpc \
     --preimages-endpoint https://snapshots.eu.tzinit.org/etherlink-mainnet/wasm_2_0_0 \
     --evm-node-endpoint https://relay.mainnet.etherlink.com
   ```

   This configuration uses the preimages that the Tezos Foundation hosts on a file server on a so-called "preimages endpoint".
   It's safe to use these preimages because the node verifies them.
   If you don't want to use third-party preimages, you can build the kernel yourself and move the contents of the `wasm_2_0_0/` directory to the local data directory; see [Building the Etherlink kernel](/network/building-kernel).
   However, in this case, you must manually update this directory with the preimages of every kernel voted by the community and deployed on Etherlink after that.

## Running the node

You can initialize the node from a snapshot or allow it to compute the Etherlink state from genesis, which can take a long time.

### From a snapshot

To automatically download and import a snapshot, start the node with the `--init-from-snapshot` switch, as in this example:

```bash
octez-evm-node run observer --data-dir $evm_observer_dir
```

The node can take time to download and import the snapshot.

To import the snapshot manually, download the snapshot from http://snapshotter-sandbox.nomadic-labs.eu/ and import it with this command:

```bash
wget http://snapshotter-sandbox.nomadic-labs.eu/etherlink-mainnet/evm-snapshot-sr1Ghq66tYK9y-latest.gz # this is for the latest mainnet etherlink snapshots, similarly there is one for testnet
octez-evm-node snapshot import evm-snapshot-sr1Ghq66tYK9y-latest.gz --data-dir $evm_observer_dir
```

Then, run this command to start the node:

```bash
octez-evm-node run observer --data-dir $evm_observer_dir
```

By default, the EVM node exposes its JSON RPC API endpoint to `localhost:8545`.
You can test that everything works as expected by running RPC requests manually or by setting your wallet to use your local node.
For example, this command gets the number of the most recent block in hexadecimal:

```bash
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_blockNumber"}' http://localhost:8545
```

### From an existing Etherlink Smart Rollup node

1. Download [an Etherlink Smart Rollup node snapshot](https://snapshots.eu.tzinit.org/etherlink-ghostnet/), and use the `octez-smart-rollup-node` binary to import it in a temporary directory.

   ```bash
   wget https://snapshots.eu.tzinit.org/etherlink-mainnet/eth-mainnet.full
   octez-smart-rollup-node --endpoint https://rpc.tzkt.io/mainnet \
     snapshot import eth-mainnet.full \
     --data-dir $sr_observer_data_dir
   ```

   :::tip
   If you are running a Smart Rollup node on the same machine, you can skip this step because you can reuse its data directory.
   :::

1. Set the `sr_observer_data_dir` environment variable to the location of the data directory you got from the previous step.

1. Run this command to import the kernel from the Smart Rollup node:

   ```bash
   octez-evm-node init from rollup node $sr_observer_data_dir --data-dir $evm_observer_dir
   ```

1. Run this command to start the node:

   ```bash
   octez-evm-node run observer --data-dir $evm_observer_dir
   ```

   The EVM node runs in archive mode.

By default, the EVM node exposes its JSON RPC API endpoint to `localhost:8545`.
You can test that everything works as expected by running RPC requests manually or by setting your wallet to use your local node.
For example, this command gets the number of the most recent block in hexadecimal:

```bash
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_blockNumber"}' http://localhost:8545
```

### From genesis

1. Get the Etherlink installer kernel (`installer.hex` file), which you can build yourself as described in [Building the Etherlink kernel](/network/building-kernel) or download here: [installer.hex](/files/installer.hex).
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
