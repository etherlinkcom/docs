---
title: "Part 1: Setting up a development environment"
---

There are many tools that you can use for developing applications on EVM-compatible systems, but this tutorial uses the [Foundry](https://getfoundry.sh) suite, which includes these tools:

- `forge`: For building, testing, debugging, and deploying smart contracts
- `anvil`: For local development nodes
- `cast`: For sending transactions to EVM chains from the command line

This tutorial uses Etherlink's built-in [Sandbox](/building-on-etherlink/sandbox) mode so you can run a local Etherlink environment to deploy and test applications without having to get XTZ from a faucet or deploy contracts to Etherlink Testnet.

Follow these steps to set up a local development environment with Foundry and the Etherlink sandbox mode:

## Install prerequisites

Before you begin, make sure that you have these programs installed:

- Node.JS
- `jq`
- `curl`

## Installing and configuring Foundry

1. Install Foundry from https://getfoundry.sh.

1. Create a keypair to use with the Etherlink sandbox by running this command:

   ```bash
   cast wallet new
   ```

   The output of the command includes the address and private key of the new account.

1. Put the address of the account in the `ADDRESS` environment variable.

1. Put the private key of the account in the `PRIVATE_KEY` environment variable.

## Setting up the Etherlink sandbox

1. Get the current version of the Octez EVM node (the `octez-evm-node` binary) from the Octez release page: https://gitlab.com/tezos/tezos/-/releases.

1. Verify that you have at least version 0.29 of the `octez-evm-node` binary by running this command in a terminal window:

   ```bash
   octez-evm-node --version
   ```

1. Run this command to configure the local sandbox environment:

   ```bash
   octez-evm-node init config --network testnet \
     --dont-track-rollup-node \
     --config-file <EVM_NODE_CONFIG_FILE> \
     --data-dir <EVM_DATA_DIR>
   ```

   Use a new location for the configuration file for the variable `<EVM_NODE_CONFIG_FILE>` (such as `~/sandbox-config.json`) and a new location for the node's data directory for the variable `<EVM_DATA_DIR>`, as in this example:

   ```bash
   octez-evm-node init config --network testnet \
     --dont-track-rollup-node \
     --config-file ~/sandbox-config.json \
     --data-dir ~/sandbox-node
   ```

   :::note

   Use a new directory for the `--data-dir` argument, not a directory that you have used for another EVM node.
   After you use the node in sandbox mode with a certain data directory, you cannot re-use that data directory for running an EVM node on Etherlink Mainnet or Testnet.

   :::

1. Run this command to start the EVM node in sandbox mode, using the same values for the variables `<EVM_NODE_CONFIG_FILE>` and `<EVM_DATA_DIR>` and the address you created for `$ADDRESS`:

   ```bash
   octez-evm-node run sandbox --network testnet \
     --init-from-snapshot \
     --config-file <EVM_NODE_CONFIG_FILE> \
     --data-dir <EVM_DATA_DIR> \
     --fund $ADDRESS
   ```

   This command starts the node in sandbox mode and sends 10,000 to your address.
   This sandbox state starts with the current state of Etherlink Testnet but is a separate environment, so you can't use it to deploy contracts or make transactions on Testnet.

1. Wait for the node to download teh snapshot of Etherlink Testnet and synchronize with the current state.
This can take a few minutes depending on your connection and how old the most recent snapshot is.

   The sandbox environment is ready when the EVM node's log logs the level of the new head block, as in this example:

   ```
   Jun 16 14:26:32.041 NOTICE │ head is now 19809131, applied in 10.681ms
   ```

1. Keep the terminal window that is running the EVM node open.

1. In a new terminal window, verify that the sandbox is running by running this command:

   ```bash
   curl -X POST -H 'Content-Type: application/json' \
     --data '{"jsonrpc": "2.0","method": "eth_getBalance","params":["'$ADDRESS'"],"id": 1}' \
     http://localhost:8545
   ```

   You may need to set the `ADDRESS` environment variable in this terminal window.

   The response shows the account's balance in the sandbox in hexadecimal format:

   ```json
   {"jsonrpc":"2.0","result":"0x21e19e0c9bab2400000","id":1}
   ```

   The response is 10000000000000000000000 wei, or 10,000 XTZ.
   As with Ethereum, Etherlink records its native token (XTZ) in units of 10^18, also referred to as wei.

Now you can use Foundry to work with Etherlink in a local sandbox environment.
