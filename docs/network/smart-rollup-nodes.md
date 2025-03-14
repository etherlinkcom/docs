---
title: Running an Etherlink Smart Rollup node
---

Etherlink uses Smart Rollup nodes as a bridge between the EVM transactions on the EVM nodes and Tezos layer 1.
Public Smart Rollup nodes for Etherlink are not yet available, so you must run your own if you want to participate in the Etherlink network.

:::note

In this context, an _Etherlink Smart Rollup node_ is an [Octez Smart Rollup node](https://octez.tezos.com/docs/shell/smart_rollup_node.html) that runs the Etherlink kernel.
This kernel is a Rust program compiled in WASM implementing the semantics of Etherlink blocks and transactions.

:::

To start, the node uses the _installer kernel_, which is a compressed version of the kernel that provides only enough information to install the original kernel.
The data for the original kernel is stored in separate files called _preimages_.

You can run the Smart Rollup node starting from Etherlink genesis or from a snapshot of a recent Etherlink state.

## System requirements

Running an Etherlink Smart Rollup node on Etherlink Mainnet requires a computer with 500GB of disk space and at least 16GB RAM.

## Modes

Running the Smart Rollup node in operator or maintenance mode is the best way to participate in Etherlink because in these modes the node posts commitments about Etherlink's state to layer 1.
These commitments validate Etherlink's state and ensure that Etherlink is processing blocks and transactions honestly according to its kernel.
As described in [Smart Rollups](https://docs.tezos.com/architecture/smart-rollups) on docs.tezos.com, one honest node is enough to ensure that Etherlink is running correctly, but adding more nodes strengthens its security and allows users to verify for themselves that Etherlink is running as intended.

The best way to run a node that can post commitments is to start with a node in observer mode, verify that it works, and convert it to maintenance mode.
Maintenance mode is similar to operator mode but it does not require settings for batching operations, which are required only for sequencer nodes.

For more information on modes, see [Smart Rollup node](https://octez.tezos.com/docs/shell/smart_rollup_node.html) in the Octez documentation.

## References

Make sure that you understand the interaction between different nodes as described in [Etherlink architecture](/network/architecture).

For more information about Smart Rollup nodes in general, see [Smart Rollups](https://docs.tezos.com/architecture/smart-rollups) on docs.tezos.com and [Smart Rollup Node](https://octez.tezos.com/docs/shell/smart_rollup_node.html) in the Octez documentation.

## Starting the Smart Rollup node in observer mode

You can start the Smart Rollup node in observer mode to bootstrap it and make sure that it works before you change to maintenance mode.

To bootstrap a Smart Rollup node from a snapshot, you need a node that has the full history from the time the snapshot was taken to the current level.
Usually this means connecting to an archive node, but if the snapshot is recent, it can work with a rolling node that keeps enough history.
After the node has started, you can switch to a rolling node.

Follow these steps to start the node in observer mode:

1. Get a built version of the Smart Rollup node binary, named `octez-smart-rollup-node`.
The best place to get the most recent binary files to use with Etherlink is https://gitlab.com/tezos/tezos/-/releases.

1. Initialize the local context of the node, which is where it stores local data:

   1. Create a directory for the node to store its data in.
   The default directory is `$HOME/.tezos-smart-rollup-node`.
   The following instructions use the variable `<SR_DATA_DIR>` to represent this directory.

   1. Initialize the local context by running this command and passing the address of the Etherlink Smart Rollup and the preimages endpoint.
   You can get this information on the [Network information](/get-started/network-information) page.

      For example, this command initializes the context for Etherlink Mainnet:

      ```bash
      octez-smart-rollup-node init observer config for sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf \
        with operators --data-dir <SR_DATA_DIR> \
        --pre-images-endpoint https://snapshots.eu.tzinit.org/etherlink-mainnet/wasm_2_0_0
      ```

      For Etherlink testnet, use this command:

      ```bash
      octez-smart-rollup-node init observer config for sr18wx6ezkeRjt1SZSeZ2UQzQN3Uc3YLMLqg \
        with operators --data-dir <SR_DATA_DIR> \
        --pre-images-endpoint https://snapshots.eu.tzinit.org/etherlink-ghostnet/wasm_2_0_0
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

   1. Download the latest snapshot.
   Mainnet snapshots are available at https://snapshots.eu.tzinit.org/etherlink-mainnet and Testnet snapshots are available at https://snapshots.eu.tzinit.org/etherlink-ghostnet.

      For example, this command downloads the latest snapshot for Etherlink Mainnet:

      ```bash
      wget https://snapshots.eu.tzinit.org/etherlink-mainnet/eth-mainnet.full
      ```

      This command downloads the latest snapshot for Etherlink Testnet:

      ```bash
      wget https://snapshots.eu.tzinit.org/etherlink-ghostnet/eth-ghostnet.full
      ```

   1. Load the snapshot by running the `snapshot import` command.

      Run this command for Mainnet:

      ```bash
      octez-smart-rollup-node --endpoint https://rpc.tzkt.io/mainnet \
        snapshot import eth-mainnet.full \
        --data-dir <SR_DATA_DIR>
      ```

      Run this command for Testnet:

      ```bash
      octez-smart-rollup-node --endpoint https://rpc.tzkt.io/ghostnet \
        snapshot import eth-ghostnet.full \
        --data-dir $SR_DATA_DIR
      ```

1. Start the Smart Rollup node in observer mode with the `run` command.

   Run this command for Mainnet:

   ```bash
   octez-smart-rollup-node --endpoint https://rpc.tzkt.io/mainnet run \
     --data-dir <SR_DATA_DIR>
   ```

   Run this command for Testnet:

   ```bash
   octez-smart-rollup-node --endpoint https://rpc.tzkt.io/ghostnet run \
     --data-dir $SR_DATA_DIR
   ```

   If you did not load a snapshot, the process of starting the node from genesis can take a long time because it must process every block.

   If you loaded a snapshot, the node must process every block that has been created since the snapshot was taken, which takes time depending on the age of the snapshot.

   By default, the node runs in archive mode.
   To run in full mode, which stores only the minimal data since the genesis required to reconstruct the ledger state, pass the argument `--history-mode full`.

1. Verify that the Smart Rollup node is running by querying it.
For example, this query gets the health of the node:

   ```bash
   curl -s http://localhost:8932/health
   ```

   If the response includes the fields `healthy: false` and the `blocks_late` field is more than 0, the node is catching up to the current state of Etherlink.

   ```json
   {
     "healthy": false,
     "degraded": false,
     "l1": {
       "connection": "connected",
       "blocks_late": 6949,
       "last_seen_head": {
         "hash": "BKmkbnFPsmQ28m4Wnsp3wgzvQnDeA9usqqfAFTsXieVGGJVEjS3",
         "level": 9253862,
         "timestamp": "2024-11-26T15:21:59Z"
       }
     },
     "active_workers": []
   }
   ```

1. Wait until the response includes the field `healthy: true` and the `blocks_late` field is 0.

Now the Smart Rollup node is running and tracking the state of Etherlink by receiving information from layer 1.

## Converting the Smart Rollup node to maintenance mode

Converting the observer node to maintenance mode requires these prerequisites:

- Your own Tezos layer 1 node running in any mode.

   :::warning Use a private layer 1 node

   To run the Smart Rollup node in a mode that posts commitments, including maintenance mode and operator mode, you must connect it to a layer 1 node that you control.
   Using a public layer 1 node as the basis for a Smart Rollup node in maintenance or operator mode exposes the Smart Rollup node to security risks.
   For example, a malicious layer 1 node can expose the Smart Rollup node to an incorrect branch, which can cause the Smart Rollup node to post invalid commitments and lose tez when other node operators computing from the correct branch refute them.

   As these steps describe, it is safe to bootstrap a node in observer mode by connecting it to a public node, connect it to a layer 1 node that you control, and then switch to maintenance or operator mode.

   :::

- Two accounts:

   - An account with at least 10,000 liquid, available tez, referred to as the _operator account_.
   You can use the same account that you use for a layer 1 baker, but for better security, you can use a different account and delegate its tez to the layer 1 account.
   Without 10,000 liquid tez, the Smart Rollup node will not start in operator or maintenance mode.
   The following examples use the variable `<REMOTE_OPERATOR>` to represent this account.

   - An account with a small amount of liquid tez for cementing and outbox operations.
   The following examples use the variable `<SECONDARY_ACCOUNT>` to represent this account.

   In most cases, you set these accounts up on another machine and use the Octez remote signer (`octez-signer`) to allow the Smart Rollup node to use them remotely.
   You can use a Ledger device to secure the keys.
   For more information, see [Key management](https://octez.tezos.com/docs/user/key-management.html) in the Octez documentation.
   You must also set up security to prevent anyone but your Smart Rollup node from using the remote signer as described in [Secure the connection](https://octez.tezos.com/docs/user/key-management.html#secure-the-connection).

   The following instructions include information about using the remote signer.

Follow these steps to convert a Smart Rollup node from observer mode to maintenance mode:

1. If you are using a remote signer, set up the two accounts in the remote signer:

   1. Create the two accounts in the `octez-signer` program or import them from a Ledger device.
   For example, to create accounts, run this command:

      ```bash
      octez-signer gen keys <REMOTE_OPERATOR>
      ```

      To import accounts from a Ledger device, get the address of the connected device by running the command `octez-signer list connected ledgers` and then import the key from the ledger by running the command `octez-signer import secret key <REMOTE_OPERATOR> ledger://XXXXXXXXXX`, where `ledger://XXXXXXXXXX` is the address of the connected device.

   1. Get the addresses of the accounts on the remote signer by running this command:

      ```bash
      octez-signer list known addresses
      ```

   1. Configure the remote signer to allow other Octez programs to sign with those accounts.
   For example, this command makes the keys available over the TCP protocol on localhost:

      ```bash
      octez-signer launch socket signer -a localhost
      ```

      For more information about configuring the remote signer, see [Signer configuration](https://octez.tezos.com/docs/user/key-management.html#signer-configuration) in the Octez documentation.

   1. Ensure that the remote signer runs persistently.

1. Set up the two accounts in the Octez client on the machine that is running the Smart Rollup node.

   To import keys from a remote signer, use this command:

   ```bash
   octez-client --remote-signer <URL> import secret key <ALIAS> remote:<ADDRESS>
   ```

   Use these values for the variables:

      - `<URL>`: The full URL that the remote signer is hosting the keys at, such as `tcp://localhost:7732`
      - `<ALIAS>`: The alias for the key in the client
      - `<ADDRESS>`: The address (public key hash) of the account to import

   For example:

   ```bash
   octez-client --remote-signer tcp://localhost:7732/ import secret key <REMOTE_OPERATOR> remote:tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx
   ```

   If you are not using a remote signer, you can use the `octez-client gen keys` or `octez-client import secret key` commands to create or import keys as usual.

1. Verify that the machine that is running the Smart Rollup node can use the keys by signing a message with them, as in this example:

   ```bash
   octez-client --remote-signer tcp://localhost:7732/ sign bytes 0x03 for <REMOTE_OPERATOR>
   ```

   If the client is successful, it returns `Signature:` and the signed message.

1. Ensure that the operator account has at least 10,000 liquid, unstaked tez and that the secondary account has a small amount of tez to sign operations.

1. Stop the Smart Rollup node.

1. Restart the node with the layer 1 node that you control, represented in this example by the variable `<MY_LAYER_1_NODE>`:

   ```bash
   octez-smart-rollup-node --endpoint <MY_LAYER_1_NODE> run \
     --data-dir <SR_DATA_DIR>
   ```

1. Verify that the node continues to run as expected in observer mode.

1. Stop the node.

1. Run the node in maintenance mode, passing the addresses or Octez aliases of the accounts and the layer 1 node that you control.

   The first address after `with operators` is the default address that the node uses for operations.
   You can use different accounts for specific operations by adding the operation and the address to the command, as in this example:

   ```bash
   octez-smart-rollup-node \
     --endpoint <MY_LAYER_1_NODE> \
     run maintenance for sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf \
     with operators <REMOTE_OPERATOR> \
     cementing:<SECONDARY_ACCOUNT> \
     executing_outbox:<SECONDARY_ACCOUNT> \
     --rpc-addr 0.0.0.0 \
     --data-dir <SR_DATA_DIR> \
     --pre-images-endpoint https://snapshots.eu.tzinit.org/etherlink-mainnet/wasm_2_0_0
   ```

   If you are using a remote signer, pass the address of the remote signer in the `--remote-signer` argument before the `run` command, as in this example:

   ```bash
   octez-smart-rollup-node \
     --endpoint <MY_LAYER_1_NODE> \
     --remote-signer tcp://localhost:7732/ \
     run maintenance for sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf \
     with operators <REMOTE_OPERATOR> \
     cementing:<SECONDARY_ACCOUNT> \
     executing_outbox:<SECONDARY_ACCOUNT> \
     --rpc-addr 0.0.0.0 \
     --data-dir <SR_DATA_DIR> \
     --pre-images-endpoint https://snapshots.eu.tzinit.org/etherlink-mainnet/wasm_2_0_0
   ```

1. Verify that the Smart Rollup node is running by querying it.
For example, this query gets the health of the node:

   ```bash
   curl -s http://localhost:8932/health
   ```

Now that you have a Smart Rollup node configured for Etherlink, you can run an Etherlink EVM node, as described in [Running an Etherlink EVM node](/network/evm-nodes).

## Stopping the Smart Rollup node

When you want to stop running the Smart Rollup node, you must wait for the last commitment that your node made to be cemented if you had any.
Then you can recover the node's bonded tez and stop the node.

:::warning

If you stop the node before waiting for its last commitment to be cemented, the bonded tez is at risk if other nodes challenge that commitment and your node is not online to defend it in the Smart Rollup refutation game.
For more information, see [Smart Rollups](https://docs.tezos.com/architecture/smart-rollups) on docs.tezos.com.

If you are not running the node in a mode that posts commitments, you can stop the node in any way you want.
The Smart Rollup node respects SIGTERM and exits cleanly when stopped.

:::

Follow these steps to stop an Etherlink Smart Rollup node:

1. Stop the node temporarily.

1. Restart the node in `bailout` mode.
A node running in `bailout` mode defends its existing commitments but does not make new commitments.

   ```bash
   octez-smart-rollup-node --endpoint <MY_LAYER_1_NODE> \
     run bailout for sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf \
     with operators <REMOTE_OPERATOR> \
     --rpc-addr 0.0.0.0 \
     --data-dir <SR_DATA_DIR> \
     --pre-images-endpoint https://snapshots.eu.tzinit.org/etherlink-mainnet/wasm_2_0_0
   ```

1. Keep the node running for two weeks for the node's last commitment to be cemented.

1. When the last commitment is cemented, the node automatically recovers the bonded tez and shuts down.

Now the node has stopped and the bonded tez is liquid.

If you want to recover the bond manually, use this command:

```bash
octez-client recover bond of <BONDED_ACCOUNT> for smart rollup <SMART_ROLLUP_ADDRESS> from <MY_ACCOUNT>
```

This command uses these arguments:

- `<BONDED_ACCOUNT>`: The account that you used to run the Smart Rollup in operator mode
- `<SMART_ROLLUP_ADDRESS>`: The address of the Etherlink Smart Rollup
- `<MY_ACCOUNT>`: The account to use to send this `recover bond` operation
