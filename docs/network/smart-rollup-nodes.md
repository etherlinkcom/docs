---
title: Running an Etherlink Smart Rollup node
---

Etherlink uses Smart Rollup nodes as a bridge between the EVM transactions on the EVM nodes and Tezos layer 1.
Public Smart Rollup nodes for Etherlink are not yet available, so you must run your own if you want to participate in the Etherlink network.

The Smart Rollup node runs the  _kernel_, which is a Rust program compiled in WASM implementing the semantics of Etherlink blocks and transactions.
It is used by EVM nodes and Smart Rollup nodes to validate the blocks created by Etherlink's sequencer.
The Smart Rollup node verifies the integrity of the kernel based on a hash posted onchain during the origination of Etherlink.

To start, the node uses the _installer kernel_, which is a compressed version of the kernel that provides only enough information to install the original kernel.
The data for the original kernel is stored in separate files called _preimages_.
For more information about installer kernels and preimages, see the tutorial [Deploy a Smart Rollup](https://docs.tezos.com/tutorials/smart-rollup) on docs.tezos.com.

## Prerequisites

- Make sure you understand the interaction between different nodes as described in [Etherlink architecture](./architecture).
- Get access to a Tezos layer 1 archive node.
You can use a public layer 1 node or set up your own as described in [Installing Octez](https://tezos.gitlab.io/introduction/howtoget.html) in the Octez documentation.

## Running the Smart Rollup node

You can start the Smart Rollup node with a snapshot of the Etherlink state or from Etherlink genesis.
These instructions cover starting from Etherlink genesis, which requires a recent build of the Octez suite.

For simplicity, these steps show how to run the octez smart rollup node in observer mode:

1. Get a built version of the Smart Rollup node binary, named `octez-smart-rollup-node`, in one of these ways:

   - To set up a Smart Rollup node from Etherlink genesis, it's best to use recent Octez source code or the latest release of Octez.
   For more information about building Octez binaries, see the Octez documentation: https://tezos.gitlab.io/index.html

   - Octez binary builds for Linux systems are available for the [x86_64](https://gitlab.com/tezos/tezos/-/jobs/6849203975/artifacts/browse/octez-binaries/x86_64/) architecture.

   - Docker images are available at https://hub.docker.com/r/tezos/tezos.

1. Initialize the local context of the node, which is where it stores local data:

   1. Set the environment variable `sr_observer_data_dir` to the directory where the node should store its local data.
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

      This configuration uses the preimages that the Etherlink team hosts on a file server on a so-called "preimages endpoint".
      To build the preimages yourself, see [Building the Etherlink kernel](#building-the-etherlink-kernel).

1. Activate the `unsafe-pvm-patches` setting, which is required for Etherlink, to the `config.json` file, as in this example:

   ```json
   { "smart-rollup-address": "sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf",
     "smart-rollup-node-operator": {}, "fee-parameters": {}, "mode": "observer",
     "unsafe-pvm-patches": [
       { "increase_max_nb_tick": "50_000_000_000_000" }
     ],
     "pre-images-endpoint":
       "https://snapshots.eu.tzinit.org/etherlink-mainnet/wasm_2_0_0" }
   ```

   Similar to the Rust keyword, `unsafe` here means to be used with a good understanding of the feature.
   Etherlink uses this setting with care and using it is safe in this context.

1. Start the Smart Rollup node in observer mode by running this command and using the RPC endpoint of a layer 1 node that is running in archive mode:

   ```bash
   octez-smart-rollup-node --endpoint https://rpc.tzkt.io/mainnet run \
     --data-dir $sr_observer_data_dir \
     --apply-unsafe-patches
   ```

   As in this example, you can use a public layer 1 RPC node for initial setup, or you can connect it to a layer 1 node that you are running for a more stable connection.
   The Smart Rollup node needs a connection to an archive node while it catches up to the current state of layer 1; after that you can connect it to a rolling node.

   The `--apply-unsafe-patches` setting is required only the first time that you start the node.
   After that you can omit it.
   After the first run, you can also remove the `unsafe-pvm-patches` field from the configuration file.

   After the Smart Rollup node has caught up with the current state via the archive node, you can safely connect it to a rolling layer 1 node.

1. Verify that the Smart Rollup node is running by querying it.
For example, this query gets the health of the node:

   ```bash
   curl -s http://localhost:8932/health
   ```

Now that you have a Smart Rollup node configured for Etherlink, you can run an Etherlink EVM node, as described in [Running an Etherlink EVM node](./evm-nodes).

## Building the Etherlink kernel

It's not necessary to build Etherlink's kernel.
You can set the `pre-images-endpoint` field in the Smart Rollup node's configuration file as described in [Running the Smart Rollup node](#running-the-smart-rollup-node).
Then you can download the installer kernel here: [installer.hex](/files/installer.hex).

However, if you want to build the kernel yourself, you can use these instructions.

This build process creates the installer kernel, which is a compressed version of the kernel that provides only enough information to install the original kernel.
The data for the original kernel is stored in separate files called preimages.
For more information about installer kernels and preimages, see the tutorial [Deploy a Smart Rollup](https://docs.tezos.com/tutorials/smart-rollup) on docs.tezos.com.

The Etherlink build process relies on a Docker image to ensure reproducible builds, so you must have Docker installed.

Follow these steps to build the installer kernel:

1. Clone the repository at https://gitlab.com/tezos/tezos.
1. Check out the commit with the hash `b9f6c9138719220db83086f0548e49c5c4c8421f`.
1. Build the kernel by running this command from the root directory:

   ```bash
   ./etherlink/scripts/build-wasm.sh
   ```

   This command creates the file `etherlink/kernels-<CURRENT COMMIT>/evm_kernel.wasm`.

1. Run this command to install the installer kernel build dependencies:

   ```bash
   make -f kernels.mk build-deps kernel_sdk
   ```

1. Set the parameters for the installer kernel by running this command, which sets the chain ID, governance and bridge contracts, and other values:

   ```bash
   octez-evm-node make kernel installer config setup_file.yml --chain-id 42793 \
     --sequencer edpktufVZGs2JmEwHSFLdA7XHXotmnkD2Nwr75ACpxUr1iKUWzYFHJ      \
     --delayed-bridge KT1AZeXH8qUdLMfwN2g7iwiYYSZYG4RrwhCj                   \
     --ticketer KT1CeFqjJRJPNVvhvznQrWfHad2jCiDZ6Lyj                         \
     --sequencer-governance KT1NcZQ3y9Wv32BGiUfD2ZciSUz9cY1DBDGF             \
     --kernel-governance KT1H5pCmFuhAwRExzNNrPQFKpunJx1yEVa6J                \
     --kernel-security-governance KT1N5MHQW5fkqXkW9GPjRYfn5KwbuYrvsY1g       \
     --sequencer-pool-address 0xCF02B9Ca488f8F6F4E28e37AA1bDD16b3F1b2aD8     \
     --delayed-inbox-min-levels 1600 --remove-whitelist
   ```

1. Run this command to build the installer kernel:

   ```bash
   smart-rollup-installer get-reveal-installer \
     -u etherlink/kernels-b9f6c9138719220db83086f0548e49c5c4c8421f/evm_kernel.wasm \
     -o installer.hex \
     -P wasm_2_0_0 \
     -S setup_file.yml \
     -d
   ```

The output of the build process is the installer kernel itself, named `installer.hex`, and the preimages for the kernel, in the `wasm_2_0_0` directory.
