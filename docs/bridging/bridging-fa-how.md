---
title: How bridging FA tokens works
---

The process of bridging FA tokens is similar to the process of bridging tez.
In short, the bridge uses tickets to send tokens from the source network to the target network.

## Contracts

The bridging process relies on smart contracts that convert tokens to [tickets](https://docs.tezos.com/smart-contracts/data-types/complex-data-types#tickets) and transfer the tickets between Tezos and Etherlink.
These contracts are an implementation of the [TZIP-029](https://gitlab.com/baking-bad/tzip/-/blob/wip/029-etherlink-token-bridge/drafts/current/draft-etherlink-token-bridge/etherlink-token-bridge.md) standard for bridging between Tezos and Etherlink.

Each FA token needs its own copy of these contracts to be able to bridge the token:

- **Ticketer contract**: Stores tokens and issues tickets that represent them
- **Token bridge helper contract**: Accepts requests to bridge tokens on layer 1, uses the ticketer contract to get tickets for them, and sends the tickets to Etherlink
- **ERC-20 proxy contract**: Stores tickets and mints ERC-20 tokens that are equivalent to the FA tokens in layer 1

Examples of these contracts and tools to deploy them are available in the repository https://github.com/baking-bad/etherlink-bridge.

## Depositing tokens from layer 1 to Etherlink

The process of bridging FA-compatible tokens from layer 1 to Etherlink (also known as depositing tokens) follows these general steps:

1. A Tezos user gives the token bridge helper contract access to their tokens.

   - For FA1.2 tokens, the user gives the helper contract an allowance of tokens.
   - For FA2 tokens, the user makes the helper contract an operator of their tokens.

   For information about token access control, see [Token standards](https://docs.tezos.com/architecture/tokens#token-standards) on docs.tezos.com.

1. The user calls the helper contract's `deposit` entrypoint.
The request includes the amount of tokens to bridge, the address of the Etherlink Smart Rollup, and the user's Etherlink wallet address, but not the tokens themselves.

1. The token bridge helper contract stores the address of the Etherlink Smart Rollup and the user's Etherlink address temporarily.

1. The helper contract (as an operator of the user's tokens or with an allowance of the user's tokens) calls the token contract to transfer the tokens from the user's account to its account.

1. The helper contract calls the ticketer contract's `deposit` entrypoint and includes the tokens.

1. The ticketer contract stores the tokens and creates a [ticket](https://docs.tezos.com/smart-contracts/data-types/complex-data-types#tickets) that represents the receipt of the tokens.

1. The ticketer contract sends the ticket back to the helper contract.

1. The helper contract forwards the ticket to the Smart Rollup inbox and clears its storage for the next transfer.

1. The Etherlink Smart Rollup receives the ticket and sends it to the ERC-20 proxy contract.

1. The ERC-20 proxy contract stores the ticket, mints the equivalent tokens, and sends them to the user's Etherlink account.

This diagram is an overview of the process of bridging tokens from layer 1 to Etherlink:

![Overview of the FA token bridging deposit process](/img/bridging-deposit-fa.png)
<!-- https://lucid.app/lucidchart/50249082-2195-40fa-8fa0-bd030ef6b12e/edit -->

## Withdrawing tokens from Etherlink to layer 1

The process of bridging FA-compatible tokens from Etherlink to layer 1 (also known as withdrawing tokens) follows these general steps:

1. The user calls the FA withdrawal precompiled contract on Etherlink and includes this information:

   - The address of the ERC-20 proxy contract that stores the ticket that represents the tokens
   - The user's layer 1 address or the address of a contract to send the tokens to
   - The amount of tokens to bridge
   - The address of the ticketer contract on layer 1
   - The content of the ticket to remove from the proxy contract (not the ticket itself)

   The proxy contract uses the address of the ticketer contract and the content of the ticket to verify that the user owns the specified tokens.

   <!-- TODO the payload consists of two forged contracts concatenated:
   | receiver | proxy | 44 bytes
   Forged contract consists of binary suffix/prefix and body (blake2b hash digest):

   - tz1 — 0x00 0x00 <body>
   - tz2 — 0x00 0x01 <body>
   - tz3 — 0x00 0x02 <body>
   - KT1 — 0x01 <body> 0x00
   -->

1. The precompiled contract creates a transaction for the ERC-20 proxy contract to send the ticket to the helper contract and puts this transaction in the Smart Rollup outbox.
This transaction includes the target layer 1 address.

This outbox message becomes part of Etherlink's commitment to its state.
1. When the commitment that contains the transaction is cemented on layer 1, anyone can run the transaction by running the Octez client `execute outbox message` command.

1. The helper contract receives the ticket and address and stores the address.

1. The helper contract sends the ticket to the ticketer contract's `withdraw` entrypoint.

1. The ticketer contract burns the ticket and sends the tokens to the helper contract.

1. The helper contract sends the tokens to the target layer 1 address.

This diagram is an overview of the process of bridging tokens from Etherlink to layer 1:

![Overview of the FA token bridging withdrawal process](/img/bridging-withdrawal-fa.png)
<!-- https://lucid.app/lucidchart/068d1822-29cb-4f8c-8aa1-2bd79f9b8490/edit -->
