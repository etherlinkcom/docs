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

You can run these transactions using the bridge, as described in [Bridging FA tokens between Tezos layer 1 and Etherlink](/bridging/bridging-fa).
For information about how to run these transactions without using the bridge, see [Sending FA bridging transactions](/bridging/bridging-fa-transactions).
Examples of these contracts and tools to deploy them are available in the repository https://github.com/baking-bad/etherlink-bridge.

## Depositing tokens from layer 1 to Etherlink

The process of bridging FA-compatible tokens from layer 1 to Etherlink (also known as depositing tokens) follows these general steps:

1. A Tezos user gives the token bridge helper contract access to their tokens.

   - For FA1.2 tokens, the user gives the helper contract an allowance of tokens.
   - For FA2 tokens, the user makes the helper contract an operator of their tokens.

   For information about token access control, see [Token standards](https://docs.tezos.com/architecture/tokens#token-standards) on docs.tezos.com.

1. The user calls the helper contract's `deposit` entrypoint.
The request includes the address of the Etherlink Smart Rollup, the user's Etherlink account address, and the amount of tokens to bridge, but not the tokens themselves.

1. The token bridge helper contract stores the address of the Etherlink Smart Rollup and the user's Etherlink address temporarily.

1. The helper contract (as an operator of the user's tokens or with an allowance of the user's tokens) calls the token contract to transfer the tokens from the user's account to its account.

1. The helper contract calls the ticketer contract's `deposit` entrypoint and includes the tokens.

1. The ticketer contract stores the tokens and creates a [ticket](https://docs.tezos.com/smart-contracts/data-types/complex-data-types#tickets) that represents the receipt of the tokens.

1. The ticketer contract sends the ticket back to the helper contract.

1. The helper contract forwards the ticket to the Smart Rollup inbox and clears its storage for the next transfer.

1. The Etherlink Smart Rollup kernel receives the ticket and puts it and information about it (including the addresses of the proxy contract and the user's Etherlink wallet address) in the delayed inbox.

1. The sequencer reads the ticket and information about it from the delayed inbox, leaves the ticket in control of the Smart Rollup itself, and calls the null address precompiled contract (`0x000...000`) with the information.

1. The null address precompile sends the information about the deposit to the FA bridging precompiled contract (`0xff0...0002`), which then emits a `QueuedDeposit` event which contains the `depositId` information needed to complete the transfer.

1. Any user can call the FA bridging precompiled contract's `claim` function, which causes the contract to call the ERC-20 proxy contract.
For tokens supported by the bridge, an automated program calls the `claim` function for you.

   You can call the `claim` function yourself with this ABI, using the `depositId` field from the event:

   ```
   claim(uint256 depositId)
   ```

1. The ERC-20 proxy contract mints the equivalent tokens and sends them to the user's Etherlink account.

This diagram is an overview of the process of bridging tokens from layer 1 to Etherlink:

<img src="/img/bridging-deposit-fa.png" alt="Overview of the FA token bridging deposit process" style={{width: 500}} />

## Withdrawing tokens from Etherlink to layer 1

The process of bridging FA-compatible tokens from Etherlink to layer 1 (also known as withdrawing tokens) follows these general steps:

1. The user calls the FA bridging precompiled contract on Etherlink and includes this information:

   - The address of the ERC-20 proxy contract that manages the tokens
   - The user's layer 1 address or the address of a contract to send the tokens to
   - The amount of tokens to bridge
   - The address of the ticketer contract on layer 1
   - The content of the ticket to remove from the proxy contract (not the ticket itself)

1. The precompiled contract generates calls the withdrawal endpoint of the ERC-20 proxy contract.

1. The proxy contract sends the information about the withdrawal to the helper contract by putting it in a transaction in the Smart Rollup outbox.
This transaction includes the target layer 1 address.

   This outbox message becomes part of Etherlink's commitment to its state.

1. When the commitment that contains the transaction is cemented on layer 1, anyone can run the transaction by running the Octez client `execute outbox message` command.

1. The helper contract receives the ticket from the originally deposited tokens and target address and stores the address.

1. The helper contract sends the ticket to the ticketer contract's `withdraw` entrypoint.

1. The ticketer contract burns the ticket and sends the tokens to the helper contract.

1. The helper contract sends the tokens to the target layer 1 address.

This diagram is an overview of the process of bridging tokens from Etherlink to layer 1:

<img src="/img/bridging-withdrawal-fa.png" alt="Overview of the FA token bridging withdrawal process" style={{width: 500}} />

## Event reference

The contracts that manage the FA bridge emit these events:

### `QueuedDeposit` event

When a deposit is ready to be claimed, the FA bridging precompiled contract (`0xff0...0002`) emits a `QueuedDeposit` event.

The event includes these topics:

Field | Type | Description
--- | --- | ---
`ticketHash` | uint256 | The hash of the ticket that represents the transferred tokens, computed as `keccak256(L1 ticketer + content)`
`proxy` | address | The proxy address through which the deposit is routed

The payload includes these fields:

Field | Type | Description
--- | --- | ---
`nonce` | uint256 | The global counter for the transaction
`receiver` | address | The Etherlink address that receives the tokens
`amount` | uint256 | The amount of tokens in the transaction
`inboxLevel` | uint256 | The layer 1 block in which the deposit was submitted
`inboxMsgId` | uint256 | An identifier for the Smart Rollup inbox message

### `Deposit` event

When a deposit has been claimed, the FA bridging precompiled contract (`0xff0...0002`) emits a `Deposit` event.

The event includes these topics:

Field | Type | Description
--- | --- | ---
`ticketHash` | uint256 | The hash of the ticket that represents the transferred tokens, computed as `keccak256(L1 ticketer + content)`

Field | Type | Description
--- | --- | ---
`ticketOwner` | address | The ERC-20 proxy contract that manages the tokens
`receiver` | address | The ERC-20 proxy contract that manages the tokens (a duplicate of the `ticketOwner` field)
`amount` | uint256 | The amount of tokens
`inboxLevel` | uint256 | The layer 1 block in which the deposit was submitted
`inboxMsgId` | uint256 | An identifier for the Smart Rollup inbox message, which you can use to find the corresponding `QueuedDeposit` event and the Etherlink address that receives the tokens

### `Withdrawal` event

When an account initiates a withdrawal, the FA bridging precompiled contract (`0xff0...0002`) emits a `Withdrawal` event.

The event includes these topics:

Field | Type | Description
--- | --- | ---
`ticketHash` | uint256 | The hash of the ticket that represents the transferred tokens, computed as `keccak256(L1 ticketer + content)`

Field | Type | Description
--- | --- | ---
`sender` | address | The Etherlink address that is withdrawing the tokens
`ticketOwner` | address | The ERC-20 proxy contract that manages the tokens
`receiver` | bytes22 | The layer 1 address that receives the tokens
`proxy` | bytes22 | The proxy address through which the deposit is routed
`amount` | uint256 | The amount of tokens
`withdrawalId` | uint256 | An internal ID for the withdrawal

### `FastFaWithdrawal` event

When an account initiates a fast withdrawal, the FA bridging precompiled contract (`0xff0...0002`) emits a `FastFaWithdrawal` event.

The event includes these topics:

Field | Type | Description
--- | --- | ---
`ticketHash` | uint256 | The hash of the ticket that represents the transferred tokens, computed as `keccak256(L1 ticketer + content)`

Field | Type | Description
--- | --- | ---
`sender` | address | The Etherlink address that is withdrawing the tokens
`ticketOwner` | address | The ERC-20 proxy contract that manages the tokens
`receiver` | bytes22 | The layer 1 address that receives the tokens
`proxy` | bytes22 | The proxy address through which the deposit is routed
`amount` | uint256 | The amount of tokens
`withdrawalId` | uint256 | An internal ID for the withdrawal
`timestamp` | uint256 | The timestamp of the block that includes the fast withdrawal request
`payload` | bytes | Information about the fast withdrawal to forward to the fast withdrawal contact
