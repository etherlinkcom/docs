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

## Modes

The EVM node supports these history modes:

- `archive` (the default): The node stores a copy of all available Etherlink information.

- `full` (available starting with version 0.17): The node stores all of the necessary information to construct the current Etherlink state plus the states for a certain number of previous days, known as the _retention period_.

- `rolling` (available starting with version 0.16): The node stores the current context plus the complete transaction data for a certain number of previous days, known as the _retention period_.

The Octez EVM node history modes follow the same semantics as the Octez layer 1 node history modes.
For more information about modes, see [History modes](https://octez.tezos.com/docs/user/history_modes.html) in the Octez documentation.

To switch modes, see [Switching modes](#switching-modes).

## Getting the `octez-evm-node` binary

The easiest way to get the `octez-evm-node` binary is to download the binaries distributed as part of its latest release from https://gitlab.com/tezos/tezos/-/releases.
The release page provides static binaries for Linux systems (for amd64 and arm64 architectures).

As an alternative, you can use the minimal Docker image [tezos/tezos-bare](https://hub.docker.com/r/tezos/tezos-bare/tags?name=octez-evm-node) with a tag that includes `octez-evm-node`.
These images contain the correct version of the binary.

## Initializing the data directory

1. If you want your EVM node to check the correctness of the blocks it receives via a Smart Rollup node, get the RPC URL of that Etherlink Smart Rollup node, such as `http://localhost:8932`.
The following instructions use the variable `<SR_NODE_OBSERVER_RPC>` to represent this URL.
1. Create a directory for the node to store its data in.
The default directory is `$HOME/.octez-evm-node`.
The following instructions use the variable `<EVM_DATA_DIR>` to represent this directory.
1. Initialize the node by setting the data directory in the `--data-dir` argument and the network to use (such as `mainnet` or `testnet`) in the `--network` argument.

   To trust incoming blocks, use `--dont-track-rollup-node`:

   ```bash
   octez-evm-node init config \
     --network testnet \
     --data-dir <EVM_DATA_DIR> \
     --dont-track-rollup-node
   ```

   Alternatively, if you want to rely on a Smart Rollup node to check the correctness of blocks coming from the sequencer, pass the address of the Smart Rollup node to the `--rollup-node-endpoint` argument, as in this example:

   ```bash
   octez-evm-node init config \
     --network testnet \
     --data-dir <EVM_DATA_DIR> \
     --rollup-node-endpoint <SR_NODE_OBSERVER_RPC>
   ```

   The `--network` argument sets the node to use preimages that the Tezos Foundation hosts on a file server on a so-called "preimages endpoint".
   For example, passing `--network mainnet` implies these arguments:

   ```bash
   --preimages-endpoint https://snapshots.eu.tzinit.org/etherlink-mainnet/wasm_2_0_0 \
   --evm-node-endpoint https://relay.mainnet.etherlink.com
   ```

   It's safe to use these preimages because the node verifies them.
   If you don't want to use third-party preimages, you can build the kernel yourself and move the contents of the `wasm_2_0_0/` directory to the local data directory; see [Building the Etherlink kernel](/network/building-kernel).
   However, in this case, you must manually update this directory with the preimages of every kernel voted by the community and deployed on Etherlink after that.

## Running the node

You can initialize the node from a snapshot, initialize it from an existing Etherlink Smart Rollup node, or allow it to compute the Etherlink state from genesis.

### From a snapshot

You can import a snapshot into the EVM node in any of these ways:

- Manually download and import the snapshot
- Provide the URL of the snapshot to the node
- Allow the node to download the snapshot automatically

You must download the appropriate snapshot for the network and mode.
Rolling and full snapshots provided on the [Nomadic Labs snapshot site](http://snapshotter-sandbox.nomadic-labs.eu/) include 1 day of complete data.
These snapshots are equivalent to the mode `rolling:1` or `full:1`.

If you want a mode with a longer retention period, you can:

- Download an older snapshot and allow the EVM node to compute the data since the snapshot was taken.
- Create your own snapshot with the appropriate retention period from another EVM node.
- Start with a node in a mode that has the necessary data and [switch to another mode](#switching-history-modes) with the retention period that you want.

To download and import the snapshot manually, download the appropriate snapshot for the network and mode (such as from http://snapshotter-sandbox.nomadic-labs.eu/) and import it with the `octez-evm-node snapshot import` command, as in this example:

```bash
wget https://storage.googleapis.com/nl-sandboxes-etherlink--snapshots/etherlink-testnet/rolling/etherlink-testnet-rolling-latest.gz
octez-evm-node snapshot import etherlink-testnet-rolling-latest.gz \
  --data-dir <EVM_DATA_DIR>
```

You can also pass the snapshot URL to the command, as in this example:

```bash
octez-evm-node snapshot import https://storage.googleapis.com/nl-sandboxes-etherlink--snapshots/etherlink-testnet/rolling/etherlink-testnet-rolling-latest.gz \
  --data-dir <EVM_DATA_DIR>
```

Then, run this command to start the node, passing the data directory and the network and mode to use:

```bash
octez-evm-node run observer \
  --network testnet \
  --history rolling:1 \
  --data-dir <EVM_DATA_DIR>
```

If you have configured the data directory and imported a snapshot, you can omit the `--history` argument from the `octez-evm-node run` command.
Including this argument allows you to verify that the node is configured for the mode and retention period that you want to run the node in.
The node throws an error if you try to run it in a mode that it is not configured for.

To automatically download and import a snapshot, start the node with the `--init-from-snapshot` switch and the network and mode to use, as in this example:

```bash
octez-evm-node run observer \
  --network testnet \
  --history rolling:1 \
  --data-dir <EVM_DATA_DIR> \
  --dont-track-rollup-node \
  --init-from-snapshot
```

The `--history` argument is required in this case to tell the node what snapshot to download.
However, an appropriate snapshot must be available on the [Nomadic Labs snapshot site](http://snapshotter-sandbox.nomadic-labs.eu/).

The node can take time to download and import the snapshot.

### From an existing Etherlink Smart Rollup node

1. Download [an Etherlink Smart Rollup node snapshot](https://snapshots.eu.tzinit.org), and use the `octez-smart-rollup-node` binary to import it in a temporary directory.
The following examples use `<SR_OBSERVER_DATA_DIR>` as the location of this temporary directory.

   ```bash
   wget https://snapshots.eu.tzinit.org/etherlink-ghostnet/eth-ghostnet.full
   octez-smart-rollup-node --endpoint https://rpc.tzkt.io/ghostnet \
     snapshot import eth-ghostnet.full \
     --data-dir <SR_OBSERVER_DATA_DIR>
   ```

   :::tip
   If you are running a Smart Rollup node on the same machine, you can skip this step because you can reuse its data directory.
   :::

1. Run this command to import the kernel from the Smart Rollup node:

   ```bash
   octez-evm-node init from rollup node <SR_OBSERVER_DATA_DIR> --data-dir <EVM_DATA_DIR>
   ```

1. Run this command to start the node:

   ```bash
   octez-evm-node run observer --data-dir <EVM_DATA_DIR>
   ```

   The EVM node runs in archive mode.
   You can switch modes with the command `octez-evm-node switch history to <MODE>`.

### From genesis

1. Get the Etherlink installer kernel (`installer.hex` file), which you can build yourself as described in [Building the Etherlink kernel](/network/building-kernel) or download here: [installer.hex](/files/installer.hex).
1. Run this command to start the node with the Etherlink installer kernel that you built or downloaded; change the name of the `installer.hex` file in the command accordingly:

   ```bash
   octez-evm-node run observer --data-dir <EVM_DATA_DIR> --initial-kernel installer.hex
   ```

   The `--initial-kernel` argument is needed only the first time that you start the node.

## Switching history modes

After the node is running in one mode you can switch to another history mode:

1. Stop the node.
1. Switch to the new mode with the command `octez-evm-node switch history to <MODE>`, where `<MODE>` is the new mode.
1. Start the node as usual with the command `octez-evm-node run`.

For example, you can switch to `rolling` mode with the command `octez-evm-node switch history to rolling:<DAYS>`, where `<DAYS>` is the number of days of compete data to keep.
Then when you restart the node, run `octez-evm-node run observer --network testnet --history rolling:<DAYS> --data-dir <EVM_DATA_DIR>`.

Because the node cannot reconstruct data that it does not have, you can switch from only some modes to some other modes:

- The node can go from `archive` mode to `rolling` or `full` mode.
- The node can go from `full` mode to `rolling` mode or `full` mode with a different retention period.
- The node can go from `rolling` mode to `rolling` mode with a different retention period.

When you switch from `full` or `rolling` mode and change the retention period, the node can increase the retention period, but it does not immediately retrieve the new data.
For example, you can switch from `rolling:1` mode to `rolling:5` mode, but the node does not immediately download the previous 5 days of data.
Instead, it begins storing more data as time passes until it has enough for 5 days of history.
You can also start a node in `rolling:5` mode by downloading a rolling snapshot that is 5 days old or by switching from `archive` mode.

Switching modes can increase the size of the data directory, so be sure that the node has enough disk space before switching.
For example, switching from another mode to `rolling` mode requires more space than starting a new node in `rolling` mode from a new data directory with the same retention period.

## Verifying that the node is running

When the node is running, its log shows information about the blocks it receives from the sequencer (referred to here as _blueprints_), as in this example:

```
Jan 15 20:17:23.794: Applied a blueprint for level 16867349 at 2025-01-15T19:38:35Z containing 1
Jan 15 20:17:23.794:   transactions for 2814041 gas leading to creating block
Jan 15 20:17:23.794:   0xeb720c1c5df94f820d4ede15ddef92b9267d1291dea15a716a160b4c2[...] in 245ms.
```

By default, the EVM node exposes its JSON RPC API endpoint to `localhost:8545`.
You can test that everything works as expected by running RPC requests manually or by setting your wallet to use your local node.
For example, this command gets the number of the most recent block in hexadecimal:

```bash
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_blockNumber"}' http://localhost:8545
```

## Stopping the node

The EVM node respects SIGTERM and exits cleanly when stopped, so you can stop it in any way that you would ordinarily stop a program on your system.