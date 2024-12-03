---
title: Bridging FA tokens between Tezos layer 1 and Etherlink
sidebar_label: Bridging FA tokens
---

You can bridge FA standards-compliant tokens in and out of Etherlink by deploying contracts that move the tokens.
You can call those contracts to bridge the tokens or request that the Etherlink team add them to the bridge UI.

The Tezos FA standards are token standards like the Ethereum ERC-20, ERC-721, and ERC-1155 standards.
For more information about the FA standards, see [Token standards](https://docs.tezos.com/architecture/tokens#token-standards) on docs.tezos.com.

Two bridging operations are available:

- Bridging tokens from Tezos layer 1 to Etherlink is referred to as _depositing_ tokens.
Depositing an FA token locks it in a contract on layer 1 and mints an equivalent ERC-20 token on Etherlink.
- Bridging tokens from Etherlink to Tezos layer 1 is referred to as _withdrawing_ tokens.
Withdrawing an FA token burns the ERC-20 token on Etherlink and unlocks the equivalent token on Tezos layer 1.

:::note
<h3>Bridging time</h3>
Tokens that you bridge from Tezos layer 1 to Etherlink are available for use on Etherlink immediately.

Tokens that you bridge from Etherlink to Tezos layer 1 are available for use on Tezos in 15 days.

This delay is caused by the Smart Rollup refutation period.
As with all Smart Rollups, Etherlink nodes post commitments about their state to Tezos layer 1, including incoming bridging transactions, on a regular schedule.
Other nodes have the length of the refutation period (14 days) to challenge those commitments.
At the end of the refutation period, the correct commitment is cemented, or made final and unchangeable.

After the commitment with the withdrawal transaction is cemented, any user can execute the transaction to make the bridged tokens available on Tezos layer 1.
:::

For information about how FA token bridging works, see [How bridging FA tokens works](/bridging/bridging-fa-how).

## Configuring a token for bridging

You can configure any FA1.2 or FA2 token for bridging by deploying the necessary contracts.
You can use this tool to simplify the process by deploying the contracts for a single token: https://github.com/baking-bad/etherlink-bridge.

Setting up a token for bridging in this way does not make it appear on the Etherlink bridge web site.
You must deploy and operate the FA bridge contracts yourself as described in [Sending FA bridging transactions](/bridging/bridging-fa-transactions).

## Adding an FA token to the bridge UI

To request that your FA token be added to the bridge UI, you must fill out the request form with information including the addresses of your FA contract, the addresses of the bridge contracts that you deployed, and the token metadata, including its name, symbol, decimals, and icon.

The request form is here: https://tt-tezos.typeform.com/to/RmiMO04v

The form requires information about the token and the bridging contracts:

- The address of the FA token contract on Tezos
- The address of the ticketer contract on Tezos
- The address of the token bridge helper contract on Tezos
- The address of the ERC-20 proxy contract on Etherlink
- The name of the token
- The ticker symbol for the token
- The number of decimal places used in the token quantity
- An icon for the token
- The Twitter user name of the token creator
- A contact email address for follow-up questions

You can get information about the bridging contracts from the response messages from the [bridging tool](https://github.com/baking-bad/etherlink-bridge) and from block explorers.

After you submit the form, the team that manages the Etherlink bridge UI reviews it and adds it to the UI if they approve it.