---
title: Building the Etherlink kernel
---

It's not necessary to build Etherlink's kernel.
You can set the `pre-images-endpoint` field in the Smart Rollup node's configuration file as described in [Running an Etherlink Smart Rollup node](./smart-rollup-nodes).
You can also download the installer kernel here: [installer.hex](/files/installer.hex).

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

   This command creates the file `etherlink/kernels-b9f6c9138719220db83086f0548e49c5c4c8421f/evm_kernel.wasm`.

1. Run this command to install the installer kernel build dependencies:

   ```bash
   make -f kernels.mk build-deps kernel_sdk
   ```

1. Set the parameters for the Etherlink kernel by running this command, which sets the chain ID, governance and bridge contracts, and other values:

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
