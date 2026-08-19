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

<svg viewBox="0 0 680 720" role="img" aria-label="Bridging FA tokens from Tezos layer 1 to Etherlink, in eleven steps: the user's Tezos wallet allows access on the FA token contract and sends a transaction to the token bridge helper contract, which transfers the tokens, locks them in the ticketer contract, and sends the resulting ticket and data to the Smart Rollup inbox; the data reaches the sequencer through the delayed inbox and flows through the null and FA bridging precompiles; any user claims the tokens, and the ERC-20 proxy contract mints them to the user's EVM wallet" style={{width: '100%', maxWidth: '680px', display: 'block', margin: '1.5rem auto', fontFamily: 'inherit'}}>
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
  <rect x="260" y="80" width="140" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="330.0" y="107.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">FA token</text>
  <text x="330.0" y="127.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">contract</text>
  <rect x="450" y="80" width="150" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="525.0" y="107.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Ticketer</text>
  <text x="525.0" y="127.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">contract</text>
  <rect x="260" y="190" width="170" height="76" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="345.0" y="223.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Token bridge</text>
  <text x="345.0" y="243.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">helper contract</text>
  <rect x="480" y="184" width="150" height="52" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="555.0" y="215.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="13">Smart Rollup inbox</text>
  <rect x="480" y="254" width="150" height="48" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="555.0" y="273.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="13">Delayed inbox</text>
  <text x="555.0" y="293.0" textAnchor="middle" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>forced inclusion</text>
  <rect x="230" y="360" width="430" height="340" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="248" y="386" fill="#38FF9C" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>ETHERLINK</text>
  <rect x="480" y="400" width="150" height="52" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="555.0" y="431.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Sequencer</text>
  <rect x="480" y="490" width="150" height="52" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="555.0" y="511.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="13">Null precompile</text>
  <text x="555.0" y="531.0" textAnchor="middle" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>0x0000&#8230;0000</text>
  <rect x="260" y="480" width="160" height="72" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="340.0" y="501.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">FA bridging</text>
  <text x="340.0" y="521.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">precompile</text>
  <text x="340.0" y="541.0" textAnchor="middle" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>0xff00&#8230;0002</text>
  <rect x="260" y="600" width="160" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="340.0" y="627.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">ERC-20 proxy</text>
  <text x="340.0" y="647.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">contract</text>
  <path d="M170,96 L260,96" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="215" cy="96" r="8.5" fill="#9DB8FF"/>
  <text x="215" y="99.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>1</text>
  <text x="215" y="82" textAnchor="middle" fill="#9DB8FF" style={{font: '11px var(--ifm-font-family-monospace)'}}>allow access</text>
  <path d="M170,116 L215,116 L215,228 L260,228" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="215" cy="170" r="8.5" fill="#9DB8FF"/>
  <text x="215" y="173.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>2</text>
  <text x="46" y="160" textAnchor="start" fill="#9DB8FF" style={{font: '11px var(--ifm-font-family-monospace)'}}>send transaction:</text>
  <text x="46" y="175" fill="rgba(255,255,255,0.6)" style={{font: '11px var(--ifm-font-family-monospace)'}}>- amount to bridge</text>
  <text x="46" y="188" fill="rgba(255,255,255,0.6)" style={{font: '11px var(--ifm-font-family-monospace)'}}>- user's Etherlink</text>
  <text x="46" y="201" fill="rgba(255,255,255,0.6)" style={{font: '11px var(--ifm-font-family-monospace)'}}>  address</text>
  <text x="46" y="214" fill="rgba(255,255,255,0.6)" style={{font: '11px var(--ifm-font-family-monospace)'}}>- Smart Rollup</text>
  <text x="46" y="227" fill="rgba(255,255,255,0.6)" style={{font: '11px var(--ifm-font-family-monospace)'}}>  address</text>
  <path d="M330,190 L330,144" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="330" cy="167" r="8.5" fill="#9DB8FF"/>
  <text x="330" y="170.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>3</text>
  <text x="322" y="171" textAnchor="end" fill="#9DB8FF" style={{font: '11px var(--ifm-font-family-monospace)'}}>transfer tokens</text>
  <path d="M430,208 L475,208 L475,144" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="475" cy="182" r="8.5" fill="#9DB8FF"/>
  <text x="475" y="185.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>4</text>
  <text x="483" y="166" textAnchor="start" fill="#9DB8FF" style={{font: '11px var(--ifm-font-family-monospace)'}}>send tokens</text>
  <path d="M560,144 L560,172 L395,172 L395,190" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="420" cy="172" r="8.5" fill="#9DB8FF"/>
  <text x="420" y="175.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>5</text>
  <text x="405" y="160" textAnchor="start" fill="#9DB8FF" style={{font: '11px var(--ifm-font-family-monospace)'}}>send ticket</text>
  <path d="M605,80 L605,62 L555,62 L555,80" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" markerEnd="url(#dg-w)"/>
  <text x="580" y="54" textAnchor="middle" fill="rgba(255,255,255,0.7)" style={{font: '10.5px var(--ifm-font-family-monospace)'}}>lock tokens, create ticket</text>
  <path d="M430,218 L480,218" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="443" cy="218" r="8.5" fill="#9DB8FF"/>
  <text x="443" y="221.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>6</text>
  <text x="462" y="204" textAnchor="middle" fill="#9DB8FF" style={{font: '10.5px var(--ifm-font-family-monospace)'}}>ticket</text>
  <text x="462" y="240" textAnchor="middle" fill="#9DB8FF" style={{font: '10.5px var(--ifm-font-family-monospace)'}}>+ data</text>
  <path d="M555,236 L555,254" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <path d="M555,302 L555,400" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <circle cx="555" cy="350" r="8.5" fill="#38FF9C"/>
  <text x="555" y="353.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>7</text>
  <text x="545" y="354" textAnchor="end" fill="#38FF9C" style={{font: '11px var(--ifm-font-family-monospace)'}}>receive information</text>
  <path d="M555,452 L555,490" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <path d="M480,516 L420,516" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <circle cx="450" cy="516" r="8.5" fill="#38FF9C"/>
  <text x="450" y="519.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>8</text>
  <text x="450" y="502" textAnchor="middle" fill="#38FF9C" style={{font: '11px var(--ifm-font-family-monospace)'}}>send info</text>
  <path d="M170,418 L340,418 L340,480" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <circle cx="255" cy="418" r="8.5" fill="#38FF9C"/>
  <text x="255" y="421.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>9</text>
  <text x="255" y="404" textAnchor="middle" fill="#38FF9C" style={{font: '11px var(--ifm-font-family-monospace)'}}>claim tokens</text>
  <path d="M340,552 L340,600" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <circle cx="340" cy="576" r="8.5" fill="#38FF9C"/>
  <text x="340" y="579.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>10</text>
  <text x="355" y="580" textAnchor="start" fill="#38FF9C" style={{font: '11px var(--ifm-font-family-monospace)'}}>send info</text>
  <path d="M420,612 L438,612 L438,636 L424,636" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" markerEnd="url(#dg-w)"/>
  <text x="444" y="630" textAnchor="start" fill="rgba(255,255,255,0.7)" style={{font: '11px var(--ifm-font-family-monospace)'}}>mint</text>
  <path d="M260,632 L170,632" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <circle cx="215" cy="632" r="8.5" fill="#38FF9C"/>
  <text x="215" y="635.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>11</text>
  <text x="215" y="618" textAnchor="middle" fill="#38FF9C" style={{font: '11px var(--ifm-font-family-monospace)'}}>send tokens</text>
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

1. The helper contract receives the ticket and the target layer 1 address from the outbox message and forwards them, unchanged, to the ticketer contract's `withdraw` entrypoint.

1. The ticketer contract verifies and burns the ticket and sends the tokens directly to the target layer 1 address.

This diagram is an overview of the process of bridging tokens from Etherlink EVM<!--TEVM--> to layer 1:

<svg viewBox="0 0 680 500" role="img" aria-label="Withdrawing FA tokens from Etherlink to Tezos layer 1, in seven steps: the user's EVM wallet calls the FA bridging precompile, which burns the tokens via the ERC-20 proxy contract and queues an outbox message; after the commitment is cemented (about two weeks), any user triggers the outbox message, and the outbox sends the ticket to the token bridge helper contract, which forwards it to the ticketer contract; the ticketer burns the ticket and sends the tokens directly to the user's layer 1 address" style={{width: '100%', maxWidth: '680px', display: 'block', margin: '1.5rem auto', fontFamily: 'inherit'}}>
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
  <rect x="40" y="220" width="130" height="56" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="105.0" y="243.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Any user</text>
  <text x="105.0" y="263.0" textAnchor="middle" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>via an Octez client</text>
  <rect x="40" y="400" width="130" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="105.0" y="427.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">User's EVM</text>
  <text x="105.0" y="447.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">wallet</text>
  <rect x="230" y="20" width="430" height="230" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="248" y="46" fill="#9DB8FF" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>TEZOS LAYER 1</text>
  <rect x="260" y="60" width="150" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="335.0" y="87.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Ticketer</text>
  <text x="335.0" y="107.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">contract</text>
  <rect x="250" y="170" width="150" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="325.0" y="197.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="13">Token bridge</text>
  <text x="325.0" y="217.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="13">helper contract</text>
  <rect x="480" y="170" width="150" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="555.0" y="197.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Smart Rollup</text>
  <text x="555.0" y="217.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">outbox</text>
  <rect x="230" y="290" width="430" height="190" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="248" y="316" fill="#38FF9C" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>ETHERLINK</text>
  <rect x="260" y="350" width="170" height="76" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="345.0" y="373.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">FA bridging</text>
  <text x="345.0" y="393.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">precompile</text>
  <text x="345.0" y="413.0" textAnchor="middle" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>0xff00&#8230;0002</text>
  <rect x="470" y="356" width="160" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="550.0" y="383.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">ERC-20 proxy</text>
  <text x="550.0" y="403.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">contract</text>
  <path d="M170,424 L220,424 L220,396 L260,396" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <circle cx="220" cy="412" r="8.5" fill="#38FF9C"/>
  <text x="220" y="415.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>1</text>
  <text x="46" y="336" textAnchor="start" fill="#38FF9C" style={{font: '11px var(--ifm-font-family-monospace)'}}>send transaction:</text>
  <text x="46" y="351" fill="rgba(255,255,255,0.6)" style={{font: '11px var(--ifm-font-family-monospace)'}}>- amount</text>
  <text x="46" y="365" fill="rgba(255,255,255,0.6)" style={{font: '11px var(--ifm-font-family-monospace)'}}>- layer 1 address</text>
  <text x="46" y="379" fill="rgba(255,255,255,0.6)" style={{font: '11px var(--ifm-font-family-monospace)'}}>- ticket &amp; contract</text>
  <text x="46" y="393" fill="rgba(255,255,255,0.6)" style={{font: '11px var(--ifm-font-family-monospace)'}}>  info</text>
  <path d="M430,384 L470,384" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <circle cx="450" cy="384" r="8.5" fill="#38FF9C"/>
  <text x="450" y="387.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>2</text>
  <text x="450" y="370" textAnchor="middle" fill="#38FF9C" style={{font: '11px var(--ifm-font-family-monospace)'}}>burn tokens</text>
  <path d="M550,356 L550,234" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="550" cy="300" r="8.5" fill="#9DB8FF"/>
  <text x="550" y="303.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>3</text>
  <text x="542" y="320" textAnchor="end" fill="#9DB8FF" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>queue outbox message</text>
  <path d="M170,248 L455,248 L455,202 L480,202" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="310" cy="248" r="8.5" fill="#9DB8FF"/>
  <text x="310" y="251.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>4</text>
  <text x="310" y="234" textAnchor="middle" fill="#9DB8FF" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>trigger outbox message</text>
  <text x="310" y="268" textAnchor="middle" fill="rgba(157,184,255,0.7)" style={{font: '10.5px var(--ifm-font-family-monospace)'}}>after the commitment is cemented (~2 weeks)</text>
  <path d="M480,194 L400,194" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="440" cy="194" r="8.5" fill="#9DB8FF"/>
  <text x="440" y="197.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>5</text>
  <text x="440" y="180" textAnchor="middle" fill="#9DB8FF" style={{font: '11px var(--ifm-font-family-monospace)'}}>send ticket</text>
  <path d="M325,170 L325,124" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="325" cy="147" r="8.5" fill="#9DB8FF"/>
  <text x="325" y="150.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>6</text>
  <text x="317" y="138" textAnchor="end" fill="#9DB8FF" style={{font: '11px var(--ifm-font-family-monospace)'}}>forward ticket</text>
  <path d="M410,78 L428,78 L428,102 L414,102" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" markerEnd="url(#dg-w)"/>
  <text x="436" y="82" textAnchor="start" fill="rgba(255,255,255,0.7)" style={{font: '11px var(--ifm-font-family-monospace)'}}>burn ticket,</text>
  <text x="436" y="95" textAnchor="start" fill="rgba(255,255,255,0.7)" style={{font: '11px var(--ifm-font-family-monospace)'}}>unlock tokens</text>
  <path d="M260,92 L170,92" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="215" cy="92" r="8.5" fill="#9DB8FF"/>
  <text x="215" y="95.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>7</text>
  <text x="215" y="78" textAnchor="middle" fill="#9DB8FF" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>send tokens</text>
</svg>
