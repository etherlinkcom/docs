---
title: Building the Etherlink kernel
---

It's not necessary to build Etherlink's kernel.
You can set the `pre-images-endpoint` field in the Smart Rollup node's configuration file as described in [Running an Etherlink Smart Rollup node](/network/smart-rollup-nodes).
You can also download the installer kernel here: [installer.hex](/files/installer.hex).

However, if you want to build the kernel yourself, you can use these instructions.

This build process creates the installer kernel, which is a compressed version of the kernel that provides only enough information to install the original kernel.
The data for the original kernel is stored in separate files called preimages.
For more information about installer kernels and preimages, see the tutorial [Deploy a Smart Rollup](https://docs.tezos.com/tutorials/smart-rollup) on docs.tezos.com.

## Prerequisites

Before you begin, make sure that you have these prerequisites installed:

- Docker, because the Etherlink build process relies on a Docker image to ensure reproducible builds

- Rust, because of its support for WebAssembly (WASM), the language that Smart Rollups use to communicate.

   To install Rust via the `rustup` command, run this command:

   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

   You can see other ways of installing Rust at https://www.rust-lang.org.

- Clang and LLVM, which are required for compilation to WebAssembly.
   Version 11 or later of Clang is required.
   Here are instructions for installing the appropriate tools on different operating systems:

   **MacOS**

   ```bash
   brew install llvm
   export CC="$(brew --prefix llvm)/bin/clang"
   ```

   In some cases for MacOS you may need to update your `PATH` environment variable to include LLVM by running this command:

   ```bash
   echo 'export PATH="/opt/homebrew/opt/llvm/bin:$PATH"' >> ~/.zshrc
   ```

   **Ubuntu**

   ```bash
   sudo apt-get install clang-11
   export CC=clang-11
   ```

   **Fedora**

   ```bash
   dnf install clang
   export CC=clang
   ```

   **Arch Linux**

   ```bash
   pacman -S clang
   export CC=clang
   ```

   The `export CC` command sets Clang as the default C/C++ compiler.

   After you run these commands, run `$CC --version` to verify that you have version 11 or greater installed.

   Also, ensure that your version of Clang `wasm32` target with by running the command `$CC -print-targets | grep wasm32` and verifying that the results include `wasm32`.

- AR (macOS only)

   To compile to WebAssembly on macOS, you need to use the LLVM archiver.
   If you've used Homebrew to install LLVM, you can configure it to use the archiver by running this command:

   ```bash
   export AR="$(brew --prefix llvm)/bin/llvm-ar"
   ```

- The [WebAssembly Toolkit (`wabt`)](https://github.com/WebAssembly/wabt) provides tooling for reducing (or _stripping_) the size of WebAssembly binaries (with the `wasm-strip` command) and conversion utilities between the textual and binary representations of WebAssembly (including the `wat2wasm` and `wasm2wat` commands).

   Most distributions ship a `wabt` package, which you can install with the appropriate command for your operating system:

   **MacOS**

   ```bash
   brew install wabt
   ```

   **Ubuntu**

   ```bash
   sudo apt install wabt
   ```

   **Fedora**

   ```bash
   dnf install wabt
   ```

   **Arch Linux**

   ```bash
   pacman -S wabt
   ```

## Building the installer kernel

Follow these steps to build the installer kernel:

1. Clone the repository at https://gitlab.com/tezos/tezos.
1. Check out the commit with the hash `604663095ad8d9f537a7035821bc78112c3b865b`.
1. Build the kernel by running this command from the root directory:

   ```bash
   ./etherlink/scripts/build-wasm.sh
   ```

   This command creates the file `etherlink/kernels-604663095ad8d9f537a7035821bc78112c3b865b/evm_kernel.wasm`.

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
     -u etherlink/kernels-604663095ad8d9f537a7035821bc78112c3b865b/evm_kernel.wasm \
     -o installer.hex \
     -P wasm_2_0_0 \
     -S setup_file.yml \
     -d
   ```

The output of the build process is the installer kernel itself, named `installer.hex`, and the preimages for the kernel, in the `wasm_2_0_0` directory.
