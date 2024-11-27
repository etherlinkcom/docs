---
title: Bridging FA tokens between Tezos layer 1 and Etherlink
sidebar_label: Bridging FA tokens
---

You can bridge FA standards-compliant tokens in and out of Etherlink by deploying contracts that move the tokens.

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
