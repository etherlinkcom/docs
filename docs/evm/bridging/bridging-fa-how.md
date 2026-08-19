---
title: How bridging FA tokens works
---

The process of bridging FA tokens is similar to the process of bridging tez.
In short, the bridge uses tickets to send tokens from the source network to the target network.

## Contracts

The bridging process relies on smart contracts that convert tokens to [tickets](https://docs.tezos.com/smart-contracts/data-types/complex-data-types#tickets) and transfer the tickets between Tezos and Etherlink EVM<!--TEVM-->.
These contracts are an implementation of the [TZIP-029](https://gitlab.com/baking-bad/tzip/-/blob/wip/029-etherlink-token-bridge/drafts/current/draft-etherlink-token-bridge/etherlink-token-bridge.md) standard for bridging between Tezos and Etherlink EVM<!--TEVM-->.

Each FA token needs its own copy of these contracts to be able to bridge the token:

- **Ticketer contract**: Stores tokens and issues tickets that represent them
- **Token bridge helper contract**: Accepts requests to bridge tokens on layer 1, uses the ticketer contract to get tickets for them, and sends the tickets to Etherlink EVM<!--TEVM-->
- **ERC-20 proxy contract**: Stores tickets and mints ERC-20 tokens that are equivalent to the FA tokens in layer 1

You can run these transactions using the bridge, as described in [Bridging FA tokens between Tezos layer 1 and Etherlink EVM<!--TEVM-->](/evm/bridging/bridging-fa).
For information about how to run these transactions without using the bridge, see [Sending FA bridging transactions](/evm/bridging/bridging-fa-transactions).
Examples of these contracts and tools to deploy them are available in the repository https://github.com/baking-bad/etherlink-bridge.

## Depositing tokens from layer 1 to Etherlink EVM<!--TEVM-->

The process of bridging FA-compatible tokens from layer 1 to Etherlink EVM<!--TEVM--> (also known as depositing tokens) follows these general steps:

1. A Tezos user gives the token bridge helper contract access to their tokens.

   - For FA1.2 tokens, the user gives the helper contract an allowance of tokens.
   - For FA2 tokens, the user makes the helper contract an operator of their tokens.

   For information about token access control, see [Token standards](https://docs.tezos.com/architecture/tokens#token-standards) on docs.tezos.com.

1. The user calls the helper contract's `deposit` entrypoint.
The request includes the amount of tokens to bridge, the address of the Etherlink Smart Rollup, and the user's Etherlink EVM<!--TEVM--> wallet address, but not the tokens themselves.

1. The token bridge helper contract stores the address of the Etherlink<!--TX--> Smart Rollup and the user's Etherlink EVM<!--TEVM--> address temporarily.

1. The helper contract (as an operator of the user's tokens or with an allowance of the user's tokens) calls the token contract to transfer the tokens from the user's account to its account.

1. The helper contract calls the ticketer contract's `deposit` entrypoint and includes the tokens.

1. The ticketer contract stores the tokens and creates a [ticket](https://docs.tezos.com/smart-contracts/data-types/complex-data-types#tickets) that represents the receipt of the tokens.

1. The ticketer contract sends the ticket back to the helper contract.

1. The helper contract forwards the ticket to the Smart Rollup inbox and clears its storage for the next transfer.

1. The Etherlink<!--TX--> Smart Rollup kernel receives the ticket and puts it and information about it (including the addresses of the proxy contract and the user's Etherlink EVM<!--TEVM--> wallet address) in the delayed inbox.

1. The sequencer reads the ticket and information about it from the delayed inbox, leaves the ticket in control of the Smart Rollup itself, and calls the null address precompiled contract (`0x000...000`) with the information.

1. The null address precompile sends the information about the deposit to the FA bridging precompiled contract (`0xff0...0002`), which then emits a `QueuedDeposit` event which contains the `depositId` information needed to complete the transfer.

1. Any user can call the FA bridging precompiled contract's `claim` function, which causes the contract to call the ERC-20 proxy contract.
For tokens supported by the bridge, an automated program calls the `claim` function for you.

1. The ERC-20 proxy contract mints the equivalent tokens and sends them to the user's Etherlink EVM<!--TEVM--> account.

This diagram is an overview of the process of bridging tokens from layer 1 to Etherlink EVM<!--TEVM-->:

<svg viewBox="0 0 680 720" role="img" aria-label="Bridging FA tokens from Tezos layer 1 to Etherlink: the user's Tezos wallet allows access on the FA token contract and sends a transaction to the token bridge helper contract, which takes the tokens, locks them in the ticketer contract, and sends the resulting ticket and data to the Smart Rollup inbox; the data reaches the sequencer through the delayed inbox and flows through the null and FA bridging precompiles; any user claims the tokens, and the ERC-20 proxy contract mints them to the user's EVM wallet" style={{width: '100%', maxWidth: '680px', display: 'block', margin: '1.5rem auto', fontFamily: 'inherit'}}>
  <defs>
    <marker id="dg-w" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0.6 L7,4 L0,7.4" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </marker>
    <marker id="dg-g" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0.6 L7,4 L0,7.4" fill="none" stroke="#38FF9C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </marker>
    <marker id="dg-b" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0.6 L7,4 L0,7.4" fill="none" stroke="#9DB8FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </marker>
  </defs>

  <rect x="20" y="20" width="170" height="680" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="38" y="46" fill="rgba(255,255,255,0.75)" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>CLIENTS</text>
  <rect x="40" y="70" width="130" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="105.0" y="97.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">User's Tezos</text>
  <text x="105.0" y="117.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">wallet</text>
  <rect x="40" y="390" width="130" height="56" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="105.0" y="423.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Any user</text>
  <rect x="40" y="600" width="130" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="105.0" y="627.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">User's EVM</text>
  <text x="105.0" y="647.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">wallet</text>
  <rect x="230" y="20" width="430" height="300" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="248" y="46" fill="#9DB8FF" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>TEZOS LAYER 1</text>
  <rect x="260" y="60" width="140" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="330.0" y="87.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">FA token</text>
  <text x="330.0" y="107.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">contract</text>
  <rect x="450" y="60" width="150" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="525.0" y="87.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Ticketer</text>
  <text x="525.0" y="107.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">contract</text>
  <rect x="260" y="190" width="170" height="76" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="345.0" y="223.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Token bridge</text>
  <text x="345.0" y="243.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">helper contract</text>
  <rect x="480" y="184" width="150" height="52" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="555.0" y="215.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="13">Smart Rollup inbox</text>
  <rect x="480" y="254" width="150" height="48" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="555.0" y="283.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="13">Delayed inbox</text>
  <rect x="230" y="360" width="430" height="340" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="248" y="386" fill="#38FF9C" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>ETHERLINK</text>
  <rect x="480" y="400" width="150" height="52" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="555.0" y="431.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Sequencer</text>
  <rect x="480" y="490" width="150" height="52" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="555.0" y="521.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="13">Null precompile</text>
  <rect x="260" y="480" width="160" height="72" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="340.0" y="511.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">FA bridging</text>
  <text x="340.0" y="531.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">precompile</text>
  <rect x="260" y="600" width="160" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="340.0" y="627.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">ERC-20 proxy</text>
  <text x="340.0" y="647.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">contract</text>
  <path d="M170,88 L260,88" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <text x="215" y="78" textAnchor="middle" fill="#9DB8FF" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>allow access</text>
  <path d="M170,116 L215,116 L215,228 L260,228" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <text x="46" y="160" textAnchor="start" fill="#9DB8FF" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>send transaction:</text>
  <text x="46" y="175" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>- amount to bridge</text>
  <text x="46" y="189" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>- user's Etherlink</text>
  <text x="46" y="203" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>  address</text>
  <text x="46" y="217" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>- Smart Rollup</text>
  <text x="46" y="231" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>  address</text>
  <path d="M330,190 L330,124" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <text x="322" y="160" textAnchor="end" fill="#9DB8FF" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>take tokens</text>
  <path d="M430,208 L475,208 L475,124" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <text x="483" y="148" textAnchor="start" fill="#9DB8FF" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>send tokens</text>
  <path d="M560,124 L560,160 L395,160 L395,190" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <text x="430" y="152" textAnchor="middle" fill="#9DB8FF" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>send ticket</text>
  <path d="M605,60 L605,44 L555,44 L555,60" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" markerEnd="url(#dg-w)"/>
  <text x="568" y="37" textAnchor="middle" fill="rgba(255,255,255,0.7)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>lock tokens, create ticket</text>
  <path d="M430,218 L480,218" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <text x="455" y="206" textAnchor="middle" fill="#9DB8FF" style={{font: '11px var(--ifm-font-family-monospace)'}}>ticket</text>
  <text x="455" y="234" textAnchor="middle" fill="#9DB8FF" style={{font: '11px var(--ifm-font-family-monospace)'}}>+ data</text>
  <path d="M555,236 L555,254" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <path d="M555,302 L555,400" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <text x="545" y="350" textAnchor="end" fill="#38FF9C" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>receive information</text>
  <path d="M555,452 L555,490" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <path d="M480,516 L420,516" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <text x="450" y="508" textAnchor="middle" fill="#38FF9C" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>send info</text>
  <path d="M170,418 L340,418 L340,480" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <text x="250" y="408" textAnchor="middle" fill="#38FF9C" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>claim tokens</text>
  <path d="M340,552 L340,600" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <text x="350" y="580" textAnchor="start" fill="#38FF9C" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>send info</text>
  <path d="M420,612 L438,612 L438,636 L424,636" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" markerEnd="url(#dg-w)"/>
  <text x="444" y="630" textAnchor="start" fill="rgba(255,255,255,0.7)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>mint</text>
  <path d="M260,632 L170,632" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <text x="215" y="622" textAnchor="middle" fill="#38FF9C" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>send tokens</text>
</svg>

## Withdrawing tokens from Etherlink EVM<!--TEVM--> to layer 1

The process of bridging FA-compatible tokens from Etherlink EVM<!--TEVM--> to layer 1 (also known as withdrawing tokens) follows these general steps:

1. The user calls the FA bridging precompiled contract on Etherlink EVM<!--TEVM--> and includes this information:

   - The address of the ERC-20 proxy contract that manages the tokens
   - The user's layer 1 address or the address of a contract to send the tokens to
   - The amount of tokens to bridge
   - The address of the ticketer contract on layer 1
   - The content of the ticket to remove from the proxy contract (not the ticket itself)

1. The precompiled contract generates calls the withdrawal endpoint of the ERC-20 proxy contract.

1. The proxy contract sends the information about the withdrawal to the helper contract by putting it in a transaction in the Smart Rollup outbox.
This transaction includes the target layer 1 address.

   This outbox message becomes part of Etherlink<!--TX-->'s commitment to its state.

1. When the commitment that contains the transaction is cemented on layer 1, anyone can run the transaction by running the Octez client `execute outbox message` command.

1. The helper contract receives the ticket from the originally deposited tokens and target address and stores the address.

1. The helper contract sends the ticket to the ticketer contract's `withdraw` entrypoint.

1. The ticketer contract burns the ticket and sends the tokens to the helper contract.

1. The helper contract sends the tokens to the target layer 1 address.

This diagram is an overview of the process of bridging tokens from Etherlink EVM<!--TEVM--> to layer 1:

<svg viewBox="0 0 680 500" role="img" aria-label="Withdrawing FA tokens from Etherlink to Tezos layer 1: the user's EVM wallet calls the FA withdrawal precompile, which burns the tokens via the ERC-20 proxy contract and sends a transaction to the Smart Rollup outbox; once cemented, any user triggers the outbox message, and the outbox sends the ticket to the token bridge helper contract, which forwards it to the ticketer contract; the ticketer burns the ticket, unlocks the tokens, and sends them to the user's Tezos wallet" style={{width: '100%', maxWidth: '680px', display: 'block', margin: '1.5rem auto', fontFamily: 'inherit'}}>
  <defs>
    <marker id="dg-w" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0.6 L7,4 L0,7.4" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </marker>
    <marker id="dg-g" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0.6 L7,4 L0,7.4" fill="none" stroke="#38FF9C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </marker>
    <marker id="dg-b" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0.6 L7,4 L0,7.4" fill="none" stroke="#9DB8FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </marker>
  </defs>

  <rect x="20" y="20" width="170" height="460" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="38" y="46" fill="rgba(255,255,255,0.75)" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>CLIENTS</text>
  <rect x="40" y="70" width="130" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="105.0" y="97.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">User's Tezos</text>
  <text x="105.0" y="117.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">wallet</text>
  <rect x="40" y="240" width="130" height="56" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="105.0" y="273.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Any user</text>
  <rect x="40" y="400" width="130" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="105.0" y="427.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">User's EVM</text>
  <text x="105.0" y="447.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">wallet</text>
  <rect x="230" y="20" width="430" height="230" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="248" y="46" fill="#9DB8FF" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>TEZOS LAYER 1</text>
  <rect x="260" y="60" width="150" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="335.0" y="87.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Ticketer</text>
  <text x="335.0" y="107.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">contract</text>
  <rect x="260" y="170" width="170" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="345.0" y="197.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="13">Token bridge</text>
  <text x="345.0" y="217.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="13">helper contract</text>
  <rect x="480" y="170" width="150" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="555.0" y="197.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Smart Rollup</text>
  <text x="555.0" y="217.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">outbox</text>
  <rect x="230" y="290" width="430" height="190" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="248" y="316" fill="#38FF9C" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>ETHERLINK</text>
  <rect x="260" y="350" width="170" height="76" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="345.0" y="383.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">FA withdrawal</text>
  <text x="345.0" y="403.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">precompile</text>
  <rect x="470" y="356" width="160" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="550.0" y="383.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">ERC-20 proxy</text>
  <text x="550.0" y="403.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">contract</text>
  <path d="M170,424 L220,424 L220,396 L260,396" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <text x="46" y="330" textAnchor="start" fill="#38FF9C" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>send transaction:</text>
  <text x="46" y="345" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>- amount to bridge</text>
  <text x="46" y="359" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>- target layer 1</text>
  <text x="46" y="373" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>  address</text>
  <text x="46" y="387" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>- ticket &amp; contract</text>
  <text x="46" y="401" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>  info</text>
  <path d="M430,384 L470,384" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <path d="M550,356 L550,234" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <text x="542" y="300" textAnchor="end" fill="#9DB8FF" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>send transaction</text>
  <path d="M170,268 L555,268 L555,234" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <text x="340" y="258" textAnchor="middle" fill="#9DB8FF" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>trigger outbox message</text>
  <path d="M480,194 L430,194" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <text x="455" y="216" textAnchor="middle" fill="#9DB8FF" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>send ticket</text>
  <path d="M335,170 L335,124" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <text x="327" y="150" textAnchor="end" fill="#9DB8FF" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>send ticket</text>
  <path d="M410,78 L428,78 L428,102 L414,102" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" markerEnd="url(#dg-w)"/>
  <text x="436" y="88" textAnchor="start" fill="rgba(255,255,255,0.7)" style={{font: '11px var(--ifm-font-family-monospace)'}}>burn ticket,</text>
  <text x="436" y="101" textAnchor="start" fill="rgba(255,255,255,0.7)" style={{font: '11px var(--ifm-font-family-monospace)'}}>unlock tokens</text>
  <path d="M260,92 L170,92" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <text x="215" y="82" textAnchor="middle" fill="#9DB8FF" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>send tokens</text>
</svg>
