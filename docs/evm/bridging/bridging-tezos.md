---
title: Bridging XTZ between Tezos layer 1 and Etherlink EVM # tevm
sidebar_label: Bridging to Tezos
---

import CementingDelayNote from '@site/docs/conrefs/cementing-delay.md';

You can bridge XTZ tokens from Tezos layer 1 to Etherlink EVM<!--TEVM--> and back.
XTZ is the native token on Etherlink EVM<!--TEVM--> and Tezos, which is called tez and shown on price tickers with the symbol [XTZ](https://coinmarketcap.com/currencies/tezos/).

Two bridging operations are available:

- Bridging tokens from Tezos layer 1 to Etherlink EVM<!--TEVM--> is referred to as _depositing_ tokens.
- Bridging tokens from Etherlink EVM<!--TEVM--> to Tezos layer 1 is referred to as _withdrawing_ tokens.

Both operations rely on automated, transparent, and audited smart contracts installed on Etherlink EVM<!--TEVM--> and Tezos.
These bridges are permissionless, meaning that anyone can use them without restrictions or the intervention of a third party.
They are also trustless, meaning that they rely on automated, transparent, and audited smart contracts installed on Etherlink and Tezos.

- [Mainnet Tezos bridge](https://bridge.etherlink.com/tezos)
- [Shadownet Testnet Tezos bridge](https://shadownet.bridge.etherlink.com/tezos)

<CementingDelayNote />

The explorer at https://bridge.explorer.etherlink.com shows bridging transactions between Tezos Mainnet and Etherlink<!--TX--> Mainnet.

## Using the bridge

To use the bridge, follow these general steps:

1. Go to the bridge at https://bridge.etherlink.com/tezos for Mainnet or https://shadownet.bridge.etherlink.com/tezos for Shadownet Testnet.

1. Connect your Tezos and Etherlink EVM<!--TEVM-->-compatible wallets.

1. At the top of the page, select the source token and network.

1. Below the source token, select the target token and network.

1. Enter the amount of tokens to transfer.

1. For withdrawals, select whether to use fast withdrawals for an additional fee.
For more information about fast withdrawals, see [Fast withdrawals](#fast-withdrawals).

1. Click **Transfer**.

## How bridging XTZ works

The process of bridging XTZ between Etherlink EVM<!--TEVM--> and Tezos layer 1 uses two contracts on Tezos layer 1:

- A bridge contract that accepts deposits and sends them to be exchanged.
This bridge contract is not a fundamental part of the bridge; it is a helper contract that avoids limitations around tickets by forwarding them to the Etherlink<!--TX--> Smart Rollup on behalf of user accounts.

  - The source code of this contract is in [`evm_bridge.mligo`](https://gitlab.com/tezos/tezos/-/blob/master/etherlink/tezos_contracts/evm_bridge.mligo).
  - This contract is deployed to Shadownet Testnet at [`KT19aBsSWvWtvEkbiqReJnD8UzQMWcD8SHUD`](https://shadownet.tzkt.io/KT19aBsSWvWtvEkbiqReJnD8UzQMWcD8SHUD/).
  - This contract is deployed to Mainnet at [`KT1Wj8SUGmnEPFqyahHAcjcNQwe6YGhEXJb5`](https://tzkt.io/KT1Wj8SUGmnEPFqyahHAcjcNQwe6YGhEXJb5/).

- An exchanger contract that stores the tokens and issues tickets that represent those tokens.
This contract is a fundamental part of the bridging process because Etherlink EVM<!--TEVM--> accepts tickets from only this contract for the purpose of bridging XTZ.

  - The source code of this contract is in [`exchanger.mligo`](https://gitlab.com/tezos/tezos/-/blob/master/etherlink/tezos_contracts/exchanger.mligo).
  - This contract is deployed to Shadownet Testnet at [`KT1JYZsawXmeArts18nn4uT79tUJc4AGTYgc`](https://shadownet.tzkt.io/KT1JYZsawXmeArts18nn4uT79tUJc4AGTYgc/).
  - This contract is deployed to Mainnet at [`KT1CeFqjJRJPNVvhvznQrWfHad2jCiDZ6Lyj`](https://tzkt.io/KT1CeFqjJRJPNVvhvznQrWfHad2jCiDZ6Lyj/).

### Deposit process

The deposit process (moving tez from layer 1 to Etherlink EVM<!--TEVM-->) follows these general steps:

1. A Tezos user sends a request to the layer 1 bridge contract's `deposit` entrypoint.
The request includes the tez to bridge, the address of the Etherlink<!--TX--> Smart Rollup, and the user's Etherlink EVM<!--TEVM--> wallet address.
1. The bridge contract stores the address of the Etherlink<!--TX--> Smart Rollup temporarily.
1. It sends the tez in a transaction to the exchanger contract's `mint` entrypoint.
1. The exchanger contract stores the tez and creates a [ticket](https://docs.tezos.com/smart-contracts/data-types/complex-data-types#tickets) that represents the receipt of the tokens.
1. The exchanger contract sends the ticket to the bridge contract's `callback` entrypoint.
1. The bridge contract forwards the ticket to the Smart Rollup inbox and clears its storage for the next transfer.
1. Etherlink<!--TX--> Smart Rollup nodes receive the deposit transaction from the Smart Rollup inbox.
1. The Smart Rollup nodes put the deposit transaction in the delayed inbox.
1. The sequencer requests the state of Etherlink<!--TX--> from a Smart Rollup node and receives the delayed inbox.
1. The sequencer creates a corresponding transaction on Etherlink EVM<!--TEVM--> to transfer XTZ from the [null address](https://explorer.etherlink.com/address/0x0000000000000000000000000000000000000000) to the user's address.
1. The sequencer adds this transaction to an Etherlink EVM<!--TEVM--> block as in the usual transaction lifecycle described in [Architecture](/network/architecture).

This diagram is an overview of the deposit process:

<svg viewBox="0 0 680 480" role="img" aria-label="Bridging tez from Tezos layer 1 to Etherlink, in six steps: the user's Tezos wallet sends a transaction to the bridge contract, which locks tez in the exchanger contract and receives a ticket; the bridge contract sends the ticket and the user's Etherlink address to the kernel via the Smart Rollup inbox, and the kernel credits the user's EVM wallet" style={{width: '100%', maxWidth: '680px', display: 'block', margin: '1.5rem auto', fontFamily: 'inherit'}}>
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

  <rect x="20" y="20" width="170" height="440" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="38" y="46" fill="rgba(255,255,255,0.75)" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>CLIENTS</text>
  <rect x="40" y="70" width="130" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="105.0" y="97.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">User's Tezos</text>
  <text x="105.0" y="117.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">wallet</text>
  <rect x="40" y="340" width="130" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="105.0" y="367.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">User's EVM</text>
  <text x="105.0" y="387.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">wallet</text>
  <rect x="230" y="20" width="430" height="220" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="248" y="46" fill="#9DB8FF" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>TEZOS LAYER 1</text>
  <rect x="260" y="90" width="150" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="335.0" y="127.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Bridge contract</text>
  <rect x="470" y="90" width="160" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="550.0" y="117.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Exchanger</text>
  <text x="550.0" y="137.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">contract</text>
  <rect x="230" y="280" width="430" height="180" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="248" y="306" fill="#38FF9C" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>ETHERLINK</text>
  <rect x="420" y="340" width="140" height="60" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="490.0" y="375.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Kernel</text>
  <path d="M170,102 L260,102" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="215" cy="102" r="8.5" fill="#9DB8FF"/>
  <text x="215" y="105.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>1</text>
  <text x="46" y="162" textAnchor="start" fill="#9DB8FF" style={{font: '11px var(--ifm-font-family-monospace)'}}>send transaction:</text>
  <text x="46" y="178" fill="rgba(255,255,255,0.6)" style={{font: '11px var(--ifm-font-family-monospace)'}}>- amount of tez</text>
  <text x="46" y="192" fill="rgba(255,255,255,0.6)" style={{font: '11px var(--ifm-font-family-monospace)'}}>- user's Etherlink</text>
  <text x="46" y="206" fill="rgba(255,255,255,0.6)" style={{font: '11px var(--ifm-font-family-monospace)'}}>  address</text>
  <text x="46" y="220" fill="rgba(255,255,255,0.6)" style={{font: '11px var(--ifm-font-family-monospace)'}}>- Smart Rollup</text>
  <text x="46" y="234" fill="rgba(255,255,255,0.6)" style={{font: '11px var(--ifm-font-family-monospace)'}}>  address</text>
  <path d="M410,96 L470,96" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="440" cy="96" r="8.5" fill="#9DB8FF"/>
  <text x="440" y="99.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>2</text>
  <text x="440" y="82" textAnchor="middle" fill="#9DB8FF" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>send tez</text>
  <path d="M595,154 L595,172 L545,172 L545,154" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" markerEnd="url(#dg-w)"/>
  <circle cx="570" cy="172" r="8.5" fill="#9DB8FF"/>
  <text x="570" y="175.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>3</text>
  <text x="570" y="194" textAnchor="middle" fill="rgba(255,255,255,0.7)" style={{font: '11px var(--ifm-font-family-monospace)'}}>lock tez,</text>
  <text x="570" y="207" textAnchor="middle" fill="rgba(255,255,255,0.7)" style={{font: '11px var(--ifm-font-family-monospace)'}}>create ticket</text>
  <path d="M470,128 L410,128" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="440" cy="128" r="8.5" fill="#9DB8FF"/>
  <text x="440" y="131.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>4</text>
  <text x="440" y="150" textAnchor="middle" fill="#9DB8FF" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>send ticket</text>
  <path d="M300,154 L300,316 L490,316 L490,340" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <circle cx="300" cy="232" r="8.5" fill="#38FF9C"/>
  <text x="300" y="235.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>5</text>
  <text x="314" y="210" textAnchor="start" fill="#38FF9C" style={{font: '11px var(--ifm-font-family-monospace)'}}>send via the Smart Rollup inbox:</text>
  <text x="314" y="224" textAnchor="start" fill="#38FF9C" style={{font: '11px var(--ifm-font-family-monospace)'}}>- ticket</text>
  <text x="314" y="238" textAnchor="start" fill="#38FF9C" style={{font: '11px var(--ifm-font-family-monospace)'}}>- user's Etherlink address</text>
  <path d="M420,372 L170,372" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <circle cx="295" cy="372" r="8.5" fill="#38FF9C"/>
  <text x="295" y="375.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>6</text>
  <text x="295" y="358" textAnchor="middle" fill="#38FF9C" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>send tez on Etherlink</text>
</svg>

### Withdrawal process

The withdrawal process (moving XTZ from Etherlink EVM<!--TEVM--> to tez on Tezos layer 1) follows these general steps:

1. A Etherlink EVM<!--TEVM--> user sends XTZ and their layer 1 address to the [withdrawal precompiled contract](https://explorer.etherlink.com/address/0xff00000000000000000000000000000000000001) in the Etherlink<!--TX--> Smart Rollup via an EVM node<!--TXN-->.
1. The contract locks the XTZ.
1. The contract creates a transaction to the exchanger contract's `burn` entrypoint and puts this transaction in the Smart Rollup outbox.
This outbox message becomes part of Etherlink<!--TX-->'s commitment to its state.
1. When the commitment that contains the transaction is cemented on layer 1, anyone can run the transaction by running the Octez client `execute outbox message` command.
1. The exchanger contract receives the ticket, burns it, and sends the equivalent amount of tez to the user's layer 1 address.

This diagram is an overview of the withdrawal process:

<svg viewBox="0 0 680 480" role="img" aria-label="Withdrawing tez from Etherlink to Tezos layer 1, in seven steps: the user's EVM wallet calls the withdrawal precompile, which stores the tez and creates a ticket included in a commitment to the Smart Rollup outbox; after the commitment is cemented (about two weeks), any user triggers the outbox message with an Octez client, and the outbox calls the exchanger contract's burn entrypoint, which unlocks the tez and sends it to the user's Tezos wallet" style={{width: '100%', maxWidth: '680px', display: 'block', margin: '1.5rem auto', fontFamily: 'inherit'}}>
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

  <rect x="20" y="20" width="170" height="450" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="38" y="46" fill="rgba(255,255,255,0.75)" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>CLIENTS</text>
  <rect x="40" y="70" width="130" height="56" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="105.0" y="93.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">User's Tezos</text>
  <text x="105.0" y="113.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">wallet</text>
  <rect x="40" y="180" width="130" height="56" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="105.0" y="203.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Octez client</text>
  <text x="105.0" y="223.0" textAnchor="middle" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>anyone can run it</text>
  <rect x="40" y="344" width="130" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="105.0" y="371.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">User's EVM</text>
  <text x="105.0" y="391.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">wallet</text>
  <rect x="230" y="20" width="430" height="220" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="248" y="46" fill="#9DB8FF" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>TEZOS LAYER 1</text>
  <rect x="470" y="60" width="160" height="58" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="550.0" y="94.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="13">Exchanger contract</text>
  <rect x="470" y="170" width="160" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="550.0" y="197.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Smart Rollup</text>
  <text x="550.0" y="217.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">outbox</text>
  <rect x="230" y="280" width="430" height="190" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="248" y="306" fill="#38FF9C" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>ETHERLINK</text>
  <rect x="260" y="330" width="170" height="76" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="345.0" y="363.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">Withdrawal</text>
  <text x="345.0" y="383.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="14">precompile</text>
  <path d="M170,376 L260,376" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <circle cx="215" cy="376" r="8.5" fill="#38FF9C"/>
  <text x="215" y="379.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>1</text>
  <text x="46" y="418" textAnchor="start" fill="#38FF9C" style={{font: '11px var(--ifm-font-family-monospace)'}}>send transaction:</text>
  <text x="46" y="433" fill="rgba(255,255,255,0.6)" style={{font: '11px var(--ifm-font-family-monospace)'}}>- amount of tez</text>
  <text x="46" y="446" fill="rgba(255,255,255,0.6)" style={{font: '11px var(--ifm-font-family-monospace)'}}>- user's layer 1</text>
  <text x="46" y="459" fill="rgba(255,255,255,0.6)" style={{font: '11px var(--ifm-font-family-monospace)'}}>  address</text>
  <path d="M390,330 L390,312 L340,312 L340,330" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" markerEnd="url(#dg-w)"/>
  <circle cx="365" cy="312" r="8.5" fill="#38FF9C"/>
  <text x="365" y="315.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>2</text>
  <text x="398" y="303" textAnchor="start" fill="rgba(255,255,255,0.7)" style={{font: '11px var(--ifm-font-family-monospace)'}}>store tez,</text>
  <text x="398" y="318" textAnchor="start" fill="rgba(255,255,255,0.7)" style={{font: '11px var(--ifm-font-family-monospace)'}}>create ticket</text>
  <path d="M430,382 L550,382 L550,234" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="550" cy="300" r="8.5" fill="#9DB8FF"/>
  <text x="550" y="303.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>3</text>
  <text x="562" y="296" textAnchor="start" fill="#9DB8FF" style={{font: '11px var(--ifm-font-family-monospace)'}}>include in</text>
  <text x="562" y="310" textAnchor="start" fill="#9DB8FF" style={{font: '11px var(--ifm-font-family-monospace)'}}>commitment:</text>
  <text x="562" y="324" textAnchor="start" fill="#9DB8FF" style={{font: '11px var(--ifm-font-family-monospace)'}}>(ticket, user's</text>
  <text x="562" y="338" textAnchor="start" fill="#9DB8FF" style={{font: '11px var(--ifm-font-family-monospace)'}}>layer 1 address)</text>
  <path d="M170,208 L470,208" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="320" cy="208" r="8.5" fill="#9DB8FF"/>
  <text x="320" y="211.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>4</text>
  <text x="320" y="194" textAnchor="middle" fill="#9DB8FF" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>trigger outbox message</text>
  <text x="320" y="226" textAnchor="middle" fill="rgba(157,184,255,0.7)" style={{font: '10.5px var(--ifm-font-family-monospace)'}}>after the commitment is cemented (~2 weeks)</text>
  <path d="M550,170 L550,118" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="550" cy="144" r="8.5" fill="#9DB8FF"/>
  <text x="550" y="147.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>5</text>
  <text x="538" y="140" textAnchor="end" fill="#9DB8FF" style={{font: '11px var(--ifm-font-family-monospace)'}}>call burn entrypoint:</text>
  <text x="538" y="154" textAnchor="end" fill="#9DB8FF" style={{font: '10.5px var(--ifm-font-family-monospace)'}}>(ticket, layer 1 address)</text>
  <path d="M605,60 L605,42 L555,42 L555,60" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" markerEnd="url(#dg-w)"/>
  <circle cx="580" cy="42" r="8.5" fill="#9DB8FF"/>
  <text x="580" y="45.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>6</text>
  <text x="558" y="30" textAnchor="middle" fill="rgba(255,255,255,0.7)" style={{font: '11px var(--ifm-font-family-monospace)'}}>unlock tez, destroy ticket</text>
  <path d="M470,90 L170,90" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <circle cx="320" cy="90" r="8.5" fill="#9DB8FF"/>
  <text x="320" y="93.5" textAnchor="middle" fill="#121212" style={{font: '700 10.5px var(--ifm-font-family-monospace)'}}>7</text>
  <text x="320" y="76" textAnchor="middle" fill="#9DB8FF" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>send tez</text>
</svg>
<!-- https://lucid.app/lucidchart/d4fb99c8-74eb-4336-b971-117b0045772b/edit -->

### Fast withdrawals

As described above, normal withdrawals from Etherlink EVM<!--TEVM--> to Tezos take about 15 days.
You can receive your XTZ faster by selecting the fast withdrawal option on the bridge.
In this case, you receive your XTZ within 1 minute, minus a percentage as a fee.

Fast withdrawals build on the standard withdrawal process between Etherlink EVM<!--TEVM--> and Tezos, using built-in protocol support and smart contracts on both networks without requiring third-party services.
Internally, when you make a fast withdrawal, a liquidity provider on Tezos layer 1 sends you the XTZ that you are withdrawing minus the fee.
The liquidity provider receives your withdrawn XTZ after the usual 15-day delay.

The liquidity provider gets to keep the fee in exchange for the expenses of providing your funds earlier, running systems to watch for fast withdrawal requests, and taking the risk of providing your funds when the commitment that includes the withdrawal is not cemented yet.
They can use the bridge to verify that they will receive the withdrawn funds when the commitment containing that transaction state has been cemented on Tezos.

### Fast withdrawal process

The process for fast withdrawals is different than for standard withdrawals:

1. A Etherlink EVM<!--TEVM--> user submits a withdrawal transaction to the fast withdrawal precompiled contract instead of the standard withdrawal precompiled contract.
1. As in the standard withdrawal process, the fast withdrawal precompiled contract locks the Etherlink EVM<!--TEVM--> XTZ and puts a message in the Smart Rollup outbox that represents those tokens.
However, instead of sending the withdrawn tokens directly to the user's Tezos layer 1 account, it sends them to a fast withdrawal contract on layer 1.
1. Liquidity providers monitor the Smart Rollup outbox and when they detect fast withdrawal requests with favorable rates, they call the layer 1 contract to claim the fast withdrawal.
This request includes information from the event and the withdrawn tez minus the fee.
1. The fast withdrawal contract forwards the withdrawn tez to the user's account and marks the fast withdrawal fulfilled.
1. When the commitment that includes the withdrawn tokens is cemented, the fast withdrawal contract sends the withdrawn tez to the liquidity provider.

Liquidity providers usually claim the fast withdrawal within 1 minute.
However, if no liquidity providers claim the fast withdrawal within 1 day, the fast withdrawal expires and no liquidity providers can claim it.
In this case, the fast withdrawal contract waits until the commitment is cemented and sends the withdrawn tokens to the user account without deducting a fee.
