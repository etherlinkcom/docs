---
title: Bridging FA tokens between Tezos layer 1 and Etherlink
sidebar_label: Bridging FA tokens
---

import CementingDelayNote from '@site/docs/conrefs/cementing-delay.md';

You can bridge FA standards-compliant tokens in and out of Etherlink by deploying contracts that move the tokens.
Then you can create dApps that use these contracts to move tokens or send a request to the Etherlink team to add your tokens to the bridge at https://bridge.etherlink.com/tezos.

The Tezos FA standards are token standards like the Ethereum ERC-20, ERC-721, and ERC-1155 standards.
For more information about the FA standards, see [Token standards](https://docs.tezos.com/architecture/tokens#token-standards) on docs.tezos.com.

Two bridging operations are available:

- Bridging tokens from Tezos layer 1 to Etherlink is referred to as _depositing_ tokens.
Depositing an FA token locks it in a contract on layer 1 and mints an equivalent ERC-20 token on Etherlink.
- Bridging tokens from Etherlink to Tezos layer 1 is referred to as _withdrawing_ tokens.
Withdrawing an FA token burns the ERC-20 token on Etherlink and unlocks the equivalent token on Tezos layer 1.

Like the bridge that transfers XTZ tokens (see [Bridging XTZ between Tezos layer 1 and Etherlink](/bridging/bridging-tezos)), the FA bridge is permissionless, meaning that anyone can use it without restrictions or the intervention of a third party.
It is also trustless, meaning that it relies on automated, transparent, and audited smart contracts installed on Etherlink and Tezos.

<CementingDelayNote />

For information about how FA token bridging works, see [How bridging FA tokens works](/bridging/bridging-fa-how).

## Configuring a token for bridging

You can configure any FA1.2 or FA2 token for bridging by deploying the necessary contracts.
You can use this tool to simplify the process by deploying the contracts for a single token: https://github.com/baking-bad/etherlink-bridge.

Setting up a token for bridging in this way does not make it appear on the Etherlink bridge web site.
You must deploy and operate the FA bridge contracts yourself as described in [Sending FA bridging transactions](/bridging/bridging-fa-transactions).

## Adding an FA token to the bridge UI

You can set up your own UI to call the bridging contracts using any Tezos and EVM clients.

You can also send a request to the Etherlink team to add your token to the bridge UI at https://bridge.etherlink.com/tezos.
To request that your FA token be added to the bridge UI, fill out this request form: https://tt-tezos.typeform.com/to/qHTs7IUD.

The form requires information about the token and the bridging contracts.

- The address of the FA token contract on Tezos
- The address of the ticketer contract on Tezos
- The address of the token bridge helper contract on Tezos
- The address of the ERC-20 proxy contract on Etherlink
- CoinMarketCap URL for the token
- The name of the token
- The ticker symbol for the token
- The number of decimal places used in the token quantity
- An icon for the token
- The Twitter user name of the token creator
- A contact email address for follow-up questions

You can get information about the bridging contracts from the response messages from the [bridging tool](https://github.com/baking-bad/etherlink-bridge) and from block explorers.

After you submit the form, the team that manages the Etherlink bridge UI reviews it and adds it to the UI if they approve it. The token must be listed at CoinMarketCap as an additional condition of approval.
