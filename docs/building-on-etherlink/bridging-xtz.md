---
title: Bridging XTZ between Tezos layer 1 and Etherlink
---

You can bridge the native token on Etherlink and Tezos, which is called tez and shown on price tickers with the symbol [XTZ](https://coinmarketcap.com/currencies/tezos/).
You can bridge tez from Tezos Mainnet to XTZ on Etherlink Mainnet and back, and you can bridge tez from Tezos Testnet (Ghostnet) to XTZ on Etherlink Testnet and back.
For more information about tez, see [Tokens](https://docs.tezos.com/architecture/tokens) on docs.tezos.com.

Etherlink provides canonical bridges for XTZ tokens.
These bridges are trustless and permissionless; anyone can use them without restrictions or the intervention of a third party.

- [Mainnet canonical bridge](https://bridge.etherlink.com/)
- [Testnet canonical bridge](https://testnet.bridge.etherlink.com/)

- Bridging tokens from Tezos layer 1 to Etherlink is referred to as _depositing_ tokens.
- Bridging tokens from Etherlink to Tezos layer 1 is referred to as _withdrawing_ tokens.

:::note Bridging time
Tokens that you bridge from Tezos layer 1 to Etherlink are available for use on Etherlink immediately.

Tokens that you bridge from Etherlink to Tezos layer 1 are available for use on Tezos in two weeks.

This delay is caused by the [Smart Rollup refutation period](https://docs.tezos.com/architecture/smart-rollups#refutation-periods).
As with all Smart Rollups, Etherlink nodes post commitments about their state to Tezos layer 1, including incoming bridging transactions, on a regular schedule.
Other nodes have the length of the refutation period (14 days) to challenge those commitments.
At the end of the refutation period, the correct commitment is _cemented_, or made final and unchangeable.
Users can execute the bridging transactions in a commitment only after the commitment is cemented.

The Etherlink indexer run by Nomadic Labs automatically executes these bridging transactions when they are cemented, which makes the bridged tokens available on Tezos.
:::

## Using the canonical bridges

To use these bridges, follow these general steps:

1. Connect your Tezos and Etherlink-compatible wallets.
1. Select the type of transfer:

   - **Deposit** transfers XTZ from Tezos layer 1 to Etherlink
   - **Withdraw** transfers XTZ from Etherlink to Tezos layer 1

1. Enter the amount of XTZ tokens to transfer.

1. Click **Move funds to Etherlink** or **Move funds to Tezos**.

You can monitor the status of your bridge operations on the **Transaction History** tab.

### How bridging XTZ works

The process of bridging XTZ between Etherlink and Tezos layer 1 uses two contracts on Tezos layer 1:

- A bridge contract that accepts deposits and sends them to be exchanged.
This bridge contract is not a fundamental part of the bridge; it is a helper contract that avoids limitations around tickets by forwarding them to the Etherlink Smart Rollup on behalf of user accounts.

  - The source code of this contract is in [`evm_bridge.mligo`](https://gitlab.com/tezos/tezos/-/blob/master/etherlink/tezos_contracts/evm_bridge.mligo).
  - This contract is deployed to testnet at [`KT1VEjeQfDBSfpDH5WeBM5LukHPGM2htYEh3`](https://ghostnet.tzkt.io/KT1VEjeQfDBSfpDH5WeBM5LukHPGM2htYEh3/).
  - This contract is deployed to Mainnet at [`KT1Wj8SUGmnEPFqyahHAcjcNQwe6YGhEXJb5`](https://tzkt.io/KT1Wj8SUGmnEPFqyahHAcjcNQwe6YGhEXJb5/).

- An exchanger contract that stores the tokens and issues tickets that represent those tokens.
This contract is a fundamental part of the bridging process because Etherlink accepts tickets from only this contract for the purpose of bridging XTZ.

  - The source code of this contract is in [`evm_bridge.mligo`](https://gitlab.com/tezos/tezos/-/blob/master/etherlink/tezos_contracts/exchanger.mligo).
  - This contract is deployed to testnet at [`KT1VEjeQfDBSfpDH5WeBM5LukHPGM2htYEh3`](https://ghostnet.tzkt.io/KT1VEjeQfDBSfpDH5WeBM5LukHPGM2htYEh3/).
  - This contract is deployed to Mainnet at [`KT1CeFqjJRJPNVvhvznQrWfHad2jCiDZ6Lyj`](https://tzkt.io/KT1CeFqjJRJPNVvhvznQrWfHad2jCiDZ6Lyj/).

### Deposit process

The deposit process (moving tez from layer 1 to Etherlink) follows these general steps:

1. A Tezos user sends a request to the layer 1 bridge contract's `deposit` entrypoint.
The request includes the tez to bridge, the address of the Etherlink Smart Rollup, and the user's Etherlink wallet address.
1. The bridge contract stores the address of the Etherlink Smart Rollup temporarily.
1. It sends the tez in a transaction to the exchanger contract's `mint` entrypoint.
1. The exchanger contract stores the tez and creates a [ticket](https://docs.tezos.com/smart-contracts/data-types/complex-data-types#tickets) that represents the receipt of the tokens.
1. The exchanger contract sends the ticket to the bridge contract's `callback` entrypoint.
1. The bridge contract forwards the ticket to the Smart Rollup inbox and clears its storage for the next transfer.
1. Etherlink Smart Rollup nodes receive the deposit transaction from the Smart Rollup inbox.
1. The Smart Rollup nodes put the deposit transaction in the delayed inbox.
1. The sequencer requests the state of Etherlink from a Smart Rollup node and receives the delayed inbox.
1. The sequencer creates a corresponding transaction on Etherlink to transfer XTZ from the [zero address](https://explorer.etherlink.com/address/0x0000000000000000000000000000000000000000) to the user's address.
1. The sequencer adds this transaction to a blueprint as in the usual transaction lifecycle described in [Architecture](../network/architecture).

This diagram is an overview of the deposit process:

![Overview of the token bridging deposit process](/img/bridging-deposit.png)
<!-- https://lucid.app/lucidchart/4ebdf949-72bd-47e3-a8ce-7ca4fba2e556/edit -->

### Withdrawal process

The withdrawal process (moving XTZ from Etherlink to tez on Tezos layer 1) follows these general steps:

1. An Etherlink user sends XTZ and their layer 1 address to the [withdrawal precompiled contract](https://explorer.etherlink.com/address/0xff00000000000000000000000000000000000001) in the Etherlink Smart Rollup via an Etherlink EVM node.
1. The contract locks the XTZ.
1. The contract creates a transaction to the exchanger contract's `burn` entrypoint and puts this transaction in the Smart Rollup outbox.
This outbox message becomes part of Etherlink's commitment to its state.
1. When the commitment that contains the transaction is cemented on layer 1, anyone can run the transaction by running the Octez client `execute outbox message` command.
1. The exchanger contract receives the ticket, burns it, and sends the equivalent amount of tez to the user's layer 1 address.

This diagram is an overview of the withdrawal process:

![Overview of the token bridging withdrawal process](/img/bridging-withdrawal.png)
<!-- https://lucid.app/lucidchart/d4fb99c8-74eb-4336-b971-117b0045772b/edit -->
