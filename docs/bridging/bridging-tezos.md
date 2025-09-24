---
title: Bridging XTZ between Tezos layer 1 and Etherlink
sidebar_label: Bridging to Tezos
---

import CementingDelayNote from '@site/docs/conrefs/cementing-delay.md';

You can bridge XTZ tokens from Tezos layer 1 to Etherlink and back.
XTZ is the native token on Etherlink and Tezos, which is called tez and shown on price tickers with the symbol [XTZ](https://coinmarketcap.com/currencies/tezos/).

Two bridging operations are available:

- Bridging tokens from Tezos layer 1 to Etherlink is referred to as _depositing_ tokens.
- Bridging tokens from Etherlink to Tezos layer 1 is referred to as _withdrawing_ tokens.

These bridges are permissionless, meaning that anyone can use them without restrictions or the intervention of a third party.
They are also trustless, meaning that they rely on automated, transparent, and audited smart contracts installed on Etherlink and Tezos.

- [Mainnet Tezos bridge](https://bridge.etherlink.com/tezos)
- [Ghostnet Testnet Tezos bridge](https://testnet.bridge.etherlink.com/)

<CementingDelayNote />

## Using the bridge

To use the bridge, follow these general steps:

1. Go to the bridge at https://bridge.etherlink.com/tezos for Mainnet or https://testnet.bridge.etherlink.com for Ghostnet Testnet.

1. Connect your Tezos and Etherlink-compatible wallets.

1. At the top of the page, select the source token and network.

1. Below the source token, select the target token and network.

1. Enter the amount of tokens to transfer.

1. For withdrawals, select whether to use fast withdrawals for an additional fee.
For more information about fast withdrawals, see [Fast withdrawals](#fast-withdrawals).

1. Click **Transfer**.

## How bridging XTZ works

The process of bridging XTZ between Etherlink and Tezos layer 1 uses two contracts on Tezos layer 1:

- A bridge contract that accepts deposits and sends them to be exchanged.
This bridge contract is not a fundamental part of the bridge; it is a helper contract that avoids limitations around tickets by forwarding them to the Etherlink Smart Rollup on behalf of user accounts.

  - The source code of this contract is in [`evm_bridge.mligo`](https://gitlab.com/tezos/tezos/-/blob/master/etherlink/tezos_contracts/evm_bridge.mligo).
  - This contract is deployed to Ghostnet Testnet at [`KT1VEjeQfDBSfpDH5WeBM5LukHPGM2htYEh3`](https://ghostnet.tzkt.io/KT1VEjeQfDBSfpDH5WeBM5LukHPGM2htYEh3/).
  - This contract is deployed to Mainnet at [`KT1Wj8SUGmnEPFqyahHAcjcNQwe6YGhEXJb5`](https://tzkt.io/KT1Wj8SUGmnEPFqyahHAcjcNQwe6YGhEXJb5/).

- An exchanger contract that stores the tokens and issues tickets that represent those tokens.
This contract is a fundamental part of the bridging process because Etherlink accepts tickets from only this contract for the purpose of bridging XTZ.

  - The source code of this contract is in [`exchanger.mligo`](https://gitlab.com/tezos/tezos/-/blob/master/etherlink/tezos_contracts/exchanger.mligo).
  - This contract is deployed to Ghostnet Testnet at [`KT1Bp9YUvUBJgXxf5UrYTM2CGRUPixURqx4m`](https://ghostnet.tzkt.io/KT1Bp9YUvUBJgXxf5UrYTM2CGRUPixURqx4m/).
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
1. The sequencer creates a corresponding transaction on Etherlink to transfer XTZ from the [null address](https://explorer.etherlink.com/address/0x0000000000000000000000000000000000000000) to the user's address.
1. The sequencer adds this transaction to an Etherlink block as in the usual transaction lifecycle described in [Architecture](/network/architecture).

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

### Fast withdrawals

As described above, normal withdrawals from Etherlink to Tezos take about 15 days.
You can receive your XTZ faster by selecting the fast withdrawal option on the bridge.
In this case, you receive your XTZ within 1 minute, minus a percentage as a fee.

Fast withdrawals build on the standard withdrawal process between Etherlink and Tezos, using built-in protocol support and smart contracts on both networks without requiring third-party services.
Internally, when you make a fast withdrawal, a liquidity provider on Tezos layer 1 sends you the XTZ that you are withdrawing minus the fee.
The liquidity provider receives your withdrawn XTZ after the usual 15-day delay.

The liquidity provider gets to keep the fee in exchange for the expenses of providing your funds earlier, running systems to watch for fast withdrawal requests, and taking the risk of providing your funds when the commitment that includes the withdrawal is not cemented yet.
They can use the bridge to verify that they will receive the withdrawn funds when the commitment containing that transaction state has been cemented on Tezos.

### Fast withdrawal process

The process for fast withdrawals is different than for standard withdrawals:

1. An Etherlink user submits a withdrawal transaction to the fast withdrawal precompiled contract instead of the standard withdrawal precompiled contract.
1. As in the standard withdrawal process, the fast withdrawal precompiled contract locks the Etherlink XTZ and puts a message in the Smart Rollup outbox that represents those tokens.
However, instead of sending the withdrawn tokens directly to the user's Tezos layer 1 account, it sends them to a fast withdrawal contract on layer 1.
1. Liquidity providers monitor the Smart Rollup inbox and when they detect fast withdrawal requests with favorable rates, they call the layer 1 contract to claim the fast withdrawal.
This request includes information from the event and the withdrawn tez minus the fee.
1. The fast withdrawal contract forwards the withdrawn tez to the user's account and marks the fast withdrawal fulfilled.
1. When the commitment that includes the withdrawn tokens is cemented, the fast withdrawal contract sends the withdrawn tez to the liquidity provider.

Liquidity providers usually claim the fast withdrawal within 1 minute.
However, if no liquidity providers claim the fast withdrawal within 1 day, the fast withdrawal expires and no liquidity providers can claim it.
In this case, the fast withdrawal contract waits until the commitment is cemented and sends the withdrawn tokens to the user account without deducting a fee.
