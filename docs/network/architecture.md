---
title: Etherlink architecture # tx
---

The main running components of Etherlink<!--TX--> are its nodes and the sequencer.
The sequencer and nodes handle blocks, but they create and handle blocks in a way different from Tezos layer 1.
Some major differences are that only the sequencer can create blocks and that the timing for blocks changes based on the demand.

These components are instances of binaries in the [Octez software suite](https://octez.tezos.com/docs/introduction/tezos.html).

## High-level diagram

<svg viewBox="0 0 680 540" role="img" aria-label="High-level Etherlink architecture: clients send transactions to EVM nodes, which expose the Ethereum JSON-RPC and Tezos RPC endpoints and exchange transactions and blocks with the sequencer; Smart Rollup nodes track Tezos layer 1 while an operator or batcher node publishes blocks and commitments to it" style={{width: '100%', maxWidth: '680px', display: 'block', margin: '1.5rem auto', fontFamily: 'inherit'}}>
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

  <rect x="20" y="20" width="180" height="250" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="38" y="46" fill="rgba(255,255,255,0.75)" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>CLIENTS</text>
  <rect x="40" y="70" width="140" height="56" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="110.0" y="103.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="15">Web app</text>
  <rect x="40" y="160" width="140" height="56" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="110.0" y="193.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="15">Wallet</text>
  <rect x="240" y="20" width="420" height="330" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="258" y="46" fill="#38FF9C" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>ETHERLINK</text>
  <rect x="278" y="78" width="170" height="90" rx="12" fill="rgba(255,255,255,0.05)"/>
  <rect x="274" y="74" width="170" height="90" rx="12" fill="rgba(255,255,255,0.07)"/>
  <rect x="270" y="70" width="170" height="90" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="355" y="104" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="15">EVM nodes</text>
  <text x="355" y="126" textAnchor="middle" fill="#38FF9C" style={{font: '12px var(--ifm-font-family-monospace)'}}>Ethereum JSON-RPC</text>
  <text x="355" y="143" textAnchor="middle" fill="#9DB8FF" style={{font: '12px var(--ifm-font-family-monospace)'}}>Tezos RPC</text>
  <rect x="490" y="70" width="140" height="76" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="560.0" y="113.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="15">Sequencer</text>
  <rect x="278" y="248" width="170" height="76" rx="12" fill="rgba(255,255,255,0.05)"/>
  <rect x="274" y="244" width="170" height="76" rx="12" fill="rgba(255,255,255,0.07)"/>
  <rect x="270" y="240" width="170" height="76" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="355.0" y="273.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="15">Smart Rollup</text>
  <text x="355.0" y="293.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="15">nodes</text>
  <rect x="470" y="240" width="160" height="76" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="550.0" y="273.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="15">Smart Rollup node</text>
  <text x="550.0" y="293.0" textAnchor="middle" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>operator / batcher</text>
  <rect x="240" y="400" width="420" height="120" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="258" y="426" fill="#9DB8FF" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>TEZOS LAYER 1</text>
  <rect x="378" y="446" width="160" height="60" rx="12" fill="rgba(255,255,255,0.05)"/>
  <rect x="374" y="442" width="160" height="60" rx="12" fill="rgba(255,255,255,0.07)"/>
  <rect x="370" y="438" width="160" height="60" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="450.0" y="473.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="15">Layer 1 nodes</text>
  <path d="M180,98 L270,98" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" markerEnd="url(#dg-w)"/>
  <path d="M180,188 L232,188 L232,122 L270,122" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" markerEnd="url(#dg-w)"/>
  <text x="200" y="88" textAnchor="start" fill="rgba(255,255,255,0.7)" style={{font: '12px var(--ifm-font-family-monospace)'}}>transactions</text>
  <path d="M448,92 L490,92" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <text x="469" y="82" textAnchor="middle" fill="#38FF9C" style={{font: '12px var(--ifm-font-family-monospace)'}}>txs</text>
  <path d="M490,116 L448,116" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <text x="469" y="134" textAnchor="middle" fill="#38FF9C" style={{font: '12px var(--ifm-font-family-monospace)'}}>blocks</text>
  <path d="M355,168 L355,240" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" markerEnd="url(#dg-w)"/>
  <text x="367" y="208" textAnchor="start" fill="rgba(255,255,255,0.7)" style={{font: '12px var(--ifm-font-family-monospace)'}}>verify L1 finality</text>
  <path d="M560,146 L560,240" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" markerEnd="url(#dg-w)"/>
  <text x="572" y="208" textAnchor="start" fill="rgba(255,255,255,0.7)" style={{font: '12px var(--ifm-font-family-monospace)'}}>send blocks</text>
  <path d="M410,438 L410,410 L355,410 L355,324" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <text x="343" y="380" textAnchor="end" fill="#9DB8FF" style={{font: '12px var(--ifm-font-family-monospace)'}}>track</text>
  <path d="M560,324 L560,410 L490,410 L490,438" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <text x="572" y="375" textAnchor="start" fill="#9DB8FF" style={{font: '12px var(--ifm-font-family-monospace)'}}>publish blocks</text>
  <text x="572" y="390" textAnchor="start" fill="#9DB8FF" style={{font: '12px var(--ifm-font-family-monospace)'}}>and commitments</text>
</svg>

## Sequencer

Etherlink<!--TX--> relies on a sequencer to publish transactions.
The sequencer receives transactions from EVM nodes, puts them in order, and packages them into an Etherlink<!--TX--> block.

If the Tezos [Data Availability Layer](https://docs.tezos.com/architecture/data-availability-layer) (DAL) is active, the sequencer has the option to publish the block via the DAL if capacity requires it; otherwise, it publishes the block directly to Tezos layer 1.

The sequencer generates blocks at a variable rate, depending on demand.
Currently, it generates a block at least every 6 seconds, even if the block is empty.
As demand increases, it generates blocks more quickly, up to a block every 500ms.
These values can change with Etherlink<!--TX--> kernel upgrades.

Each Etherlink<!--TX--> block contains:

- A list of transactions
- A list of transactions that are currently in the delayed inbox, as described in [Transaction lifecycle](#transaction-lifecycle)
- The hash of the previous block
- The timestamp of the block

The sequencer publishes each block in two ways:

- It publishes them to EVM nodes
- It publishes them via the DAL or directly to Tezos layer 1

The sequencer is the primary way that Etherlink<!--TX--> transactions are processed.
However, to protect the system from censorship and any other problems with the sequencer, Etherlink<!--TX--> provides a backup way of handling transactions; see [Transaction lifecycle](#transaction-lifecycle).

The sequencer is an instance of the `octez-evm-node` binary running in sequencer mode.
Only one account can run the sequencer; see [Sequencer governance](/governance/how-is-etherlink-governed#sequencer-governance).

## Nodes

Etherlink<!--TX--> relies on three types of nodes, with instances of each type running in different modes:

- EVM nodes (`octez-evm-node`): The EVM nodes running in sequencer observer mode maintain a local copy of the Etherlink<!--TX--> context and expose a [JSON RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/)-compliant endpoint for clients to submit transactions to.
Since Etherlink<!--TX--> 7.0, they also expose the [Tezos RPC](/michelson/developing/rpc-reference) endpoint of the Michelson interface.
They forward these transactions to the sequencer and receive transactions from the sequencer, which they use to update their state.
They also check Smart Rollup nodes to verify that these transactions make it to Tezos layer 1.

- Smart Rollup nodes (`octez-smart-rollup-node`): Smart Rollup nodes are Octez daemons that run the kernel of a Tezos Smart Rollup.
For more information about Smart Rollup nodes in general, see [Smart Rollup node](https://octez.tezos.com/docs/shell/smart_rollup_node.html) in the Octez documentation.

  Etherlink<!--TX--> Smart Rollup nodes run the kernel for the Etherlink<!--TX--> Smart Rollup and store the state of the Etherlink<!--TX--> blockchain from the perspective of Tezos layer 1.
  They monitor the Tezos layer 1 Smart Rollup inbox, filter the inbox to Etherlink<!--TX-->-related messages, process them, and update their states.

  Importantly, the Smart Rollup nodes store the state of Etherlink<!--TX--> based on the information that they get from layer 1, not on information from EVM nodes or the sequencer.

  These Smart Rollup nodes run in different modes depending on the needs of the people who run them.
  The `octez-smart-rollup-node` binary has many different modes, but these are the primary modes for Etherlink<!--TX-->:

     - Nodes running in observer mode follow the state of the rollup by monitoring layer 1 and updating their states.
     - Nodes running in operator mode update their states like nodes running in observer mode.
     They also have the critical role of securing the Etherlink<!--TX--> Smart Rollup by publishing commitments to layer 1 and playing refutation games.
     - The sequencer can use a node running in batcher mode to publish transactions to layer 1.
     It can also use a node running in operator mode to publish transactions.

  For more information about Smart Rollup nodes in general, see [Smart Rollups](https://docs.tezos.com/architecture/smart-rollups) on docs.tezos.com and [Smart Rollup Node](https://octez.tezos.com/docs/shell/smart_rollup_node.html) in the Octez documentation.

- Tezos layer 1 nodes (`octez-node`): Layer 1 nodes are responsible for the state of layer 1.
In addition to ordinary layer 1 transactions, they receive Etherlink<!--TX--> transactions from the sequencer.
Then the baking nodes publish the Etherlink<!--TX--> transactions in the Smart Rollup inbox in layer 1 blocks.
For more information about Tezos layer 1 and its nodes, see [Architecture](https://docs.tezos.com/architecture) on docs.tezos.com.

## Transaction lifecycle

Etherlink<!--TX--> has a standard method of processing transactions and a backup method that protects it from censorship and network problems.

### Standard transaction processing

The lifecycle of a typical operation under normal circumstances is as follows:

1. A user submits a transaction to an EVM node.
1. The EVM node forwards the transaction to the sequencer when it is valid.
If users submit multiple transactions that depend on each other (that is, they have nonces that are not yet valid), the EVM node stores them until they are valid.
1. The sequencer puts the transaction in its pool.
1. The sequencer enqueues the transaction and sends an instant confirmation to the nodes that the transaction will be in the next block.
1. The sequencer puts the enqueued transactions into a block as soon as possible (less than 500ms after receiving it in a nominal scenario).
1. The sequencer publishes the block to the EVM nodes, which update their states based on the transactions in the block.
1. The sequencer publishes the block to the Smart Rollup inbox on layer 1 via a Smart Rollup node running in operator or batcher mode.
1. The Smart Rollup nodes tracking the state of Etherlink<!--TX--> fetch the block from the Smart Rollup inbox, read its transactions, and update their states.
1. The EVM nodes check the state of the Smart Rollup nodes to verify that blocks have successfully and faithfully been finalized on layer 1.
1. The Smart Rollup nodes running in operator mode post hashes of Etherlink<!--TX-->'s state to layer 1 as commitments.

This diagram summarizes the transaction process:

<svg viewBox="0 0 680 760" role="img" aria-label="Detailed Etherlink transaction flow: clients send transactions to EVM nodes in sequencer observer mode, which forward them to the sequencer's EVM node and receive blocks back; Smart Rollup nodes verify that blocks are published on layer 1, and an operator or batcher node publishes Etherlink blocks in the Smart Rollup inbox; layer 1 nodes create blocks containing the Smart Rollup inbox messages and commitments" style={{width: '100%', maxWidth: '680px', display: 'block', margin: '1.5rem auto', fontFamily: 'inherit'}}>
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

  <rect x="20" y="20" width="170" height="230" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="38" y="46" fill="rgba(255,255,255,0.75)" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>CLIENTS</text>
  <rect x="40" y="66" width="130" height="52" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="105.0" y="97.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="15">Web app</text>
  <rect x="40" y="150" width="130" height="52" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="105.0" y="181.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="15">Wallet</text>
  <rect x="230" y="20" width="430" height="400" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="248" y="46" fill="#38FF9C" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>ETHERLINK</text>
  <rect x="268" y="78" width="160" height="90" rx="12" fill="rgba(255,255,255,0.05)"/>
  <rect x="264" y="74" width="160" height="90" rx="12" fill="rgba(255,255,255,0.07)"/>
  <rect x="260" y="70" width="160" height="90" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="340.0" y="110.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="15">EVM nodes</text>
  <text x="340.0" y="130.0" textAnchor="middle" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>sequencer observer mode</text>
  <rect x="455" y="50" width="185" height="150" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="473" y="76" fill="rgba(255,255,255,0.75)" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>SEQUENCER</text>
  <rect x="475" y="95" width="145" height="80" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="547.5" y="130.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="15">EVM node</text>
  <text x="547.5" y="150.0" textAnchor="middle" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>sequencer mode</text>
  <rect x="268" y="288" width="160" height="84" rx="12" fill="rgba(255,255,255,0.05)"/>
  <rect x="264" y="284" width="160" height="84" rx="12" fill="rgba(255,255,255,0.07)"/>
  <rect x="260" y="280" width="160" height="84" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="340.0" y="307.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="15">Smart Rollup</text>
  <text x="340.0" y="327.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="15">nodes</text>
  <text x="340.0" y="347.0" textAnchor="middle" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>track layer 1</text>
  <rect x="470" y="280" width="160" height="84" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="550.0" y="317.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="15">Smart Rollup node</text>
  <text x="550.0" y="337.0" textAnchor="middle" fill="rgba(255,255,255,0.6)" style={{font: '11.5px var(--ifm-font-family-monospace)'}}>operator / batcher</text>
  <rect x="20" y="460" width="640" height="280" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)"/>
  <text x="38" y="486" fill="#9DB8FF" style={{font: '600 11.5px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>TEZOS LAYER 1</text>
  <rect x="68" y="528" width="150" height="64" rx="12" fill="rgba(255,255,255,0.05)"/>
  <rect x="64" y="524" width="150" height="64" rx="12" fill="rgba(255,255,255,0.07)"/>
  <rect x="60" y="520" width="150" height="64" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="135.0" y="557.0" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="15">Layer 1 nodes</text>
  <rect x="300" y="505" width="330" height="205" rx="12" fill="rgba(255,255,255,0.1)"/>
  <text x="320" y="535" textAnchor="start" fill="rgba(255,255,255,0.75)" style={{font: '600 11.5px var(--ifm-font-family-monospace)'}}>BLOCK</text>
  <text x="320" y="562" fill="rgba(255,255,255,0.7)" style={{font: '12px var(--ifm-font-family-monospace)'}}>- metadata, hash of the previous block</text>
  <text x="320" y="578" fill="rgba(255,255,255,0.7)" style={{font: '12px var(--ifm-font-family-monospace)'}}>- layer 1 transactions and operations</text>
  <text x="320" y="594" fill="rgba(255,255,255,0.7)" style={{font: '12px var(--ifm-font-family-monospace)'}}>- Smart Rollup inbox messages</text>
  <text x="320" y="610" fill="rgba(255,255,255,0.7)" style={{font: '12px var(--ifm-font-family-monospace)'}}>    (including Etherlink blocks)</text>
  <text x="320" y="626" fill="rgba(255,255,255,0.7)" style={{font: '12px var(--ifm-font-family-monospace)'}}>- hashes of Smart Rollup states</text>
  <text x="320" y="642" fill="rgba(255,255,255,0.7)" style={{font: '12px var(--ifm-font-family-monospace)'}}>    (including Etherlink), posted as</text>
  <text x="320" y="658" fill="rgba(255,255,255,0.7)" style={{font: '12px var(--ifm-font-family-monospace)'}}>    commitments</text>
  <path d="M190,92 L260,92" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" markerEnd="url(#dg-w)"/>
  <path d="M190,176 L225,176 L225,118 L260,118" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" markerEnd="url(#dg-w)"/>
  <text x="196" y="80" textAnchor="start" fill="rgba(255,255,255,0.7)" style={{font: '12px var(--ifm-font-family-monospace)'}}>send transactions</text>
  <path d="M428,100 L475,100" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <text x="452" y="90" textAnchor="middle" fill="#38FF9C" style={{font: '12px var(--ifm-font-family-monospace)'}}>txs</text>
  <path d="M475,130 L428,130" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <text x="452" y="148" textAnchor="middle" fill="#38FF9C" style={{font: '12px var(--ifm-font-family-monospace)'}}>blocks</text>
  <path d="M340,168 L340,280" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" markerEnd="url(#dg-w)"/>
  <text x="352" y="215" textAnchor="start" fill="rgba(255,255,255,0.7)" style={{font: '12px var(--ifm-font-family-monospace)'}}>verify blocks are</text>
  <text x="352" y="230" textAnchor="start" fill="rgba(255,255,255,0.7)" style={{font: '12px var(--ifm-font-family-monospace)'}}>published on layer 1</text>
  <path d="M550,175 L550,280" fill="none" stroke="#38FF9C" strokeWidth="1.6" markerEnd="url(#dg-g)"/>
  <text x="562" y="230" textAnchor="start" fill="#38FF9C" style={{font: '12px var(--ifm-font-family-monospace)'}}>send blocks</text>
  <path d="M325,520 L325,372" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <text x="313" y="440" textAnchor="end" fill="#9DB8FF" style={{font: '12px var(--ifm-font-family-monospace)'}}>track layer 1 and</text>
  <text x="313" y="455" textAnchor="end" fill="#9DB8FF" style={{font: '12px var(--ifm-font-family-monospace)'}}>receive Etherlink blocks</text>
  <path d="M550,364 L550,430 L376,430 L376,505" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <text x="538" y="398" textAnchor="end" fill="#9DB8FF" style={{font: '12px var(--ifm-font-family-monospace)'}}>publish Etherlink blocks</text>
  <text x="538" y="413" textAnchor="end" fill="#9DB8FF" style={{font: '12px var(--ifm-font-family-monospace)'}}>in the Smart Rollup inbox</text>
  <path d="M210,552 L300,552" fill="none" stroke="#9DB8FF" strokeWidth="1.6" markerEnd="url(#dg-b)"/>
  <text x="255" y="542" textAnchor="middle" fill="#9DB8FF" style={{font: '12px var(--ifm-font-family-monospace)'}}>create</text>
</svg>

### Delayed inbox transaction processing

Under normal circumstances, the sequencer handles all incoming transactions fairly and packages them into blocks to finalize them.
If the sequencer doesn't include transactions promptly for any reason, Etherlink<!--TX--> provides a backup method of processing transactions that does not rely on the sequencer.
This method allows users to add transactions to an area of storage called the _delayed inbox_ and to force Etherlink<!--TX--> to include them.

Transactions that run via the delayed inbox follow this lifecycle:

1. A user submits an Etherlink<!--TX--> transaction to a Tezos layer 1 smart contract called the "delayed bridge" contract.
This transaction includes the address of the Etherlink<!--TX--> Smart Rollup and the transaction to run on Etherlink<!--TX--> encoded via recursive-length prefix (RLP).
The user must also include 1 tez with the transaction to prevent spam; this amount is hardcoded in the smart contract and is subject to change.
1. The delayed bridge contract writes the transaction to the Smart Rollup inbox.
1. The Etherlink<!--TX--> Smart Rollup nodes receive the message, verify that it came from the delayed bridge contract by checking its address, and add it to the delayed inbox, which is a specific area of storage named `delayed-inbox`.
This address is hard-coded in the Etherlink<!--TX--> kernel.

   At this point, the sequencer has 12 hours or 1600 layer 1 blocks to include the transaction, whichever is longer.
   This delay is to give the sequencer time to catch up if it is trying to include transactions normally and the network is slow for some reason.

1. If the sequencer is running normally, it processes the transaction in the delayed inbox in the same way that it processes other transactions.
Then, when the Smart Rollup nodes receive the block with the transaction as in the standard transaction process, they remove it from the delayed inbox.
The only way to remove a transaction from the delayed inbox is to process it.
1. If the sequencer has not included the transaction at the end of the delay, the Smart Rollup nodes take over the block creation process by following these steps:

   1. Each time the Smart Rollup nodes run the Etherlink<!--TX--> kernel (at every layer 1 block level), they check to see if the delay has passed for any delayed inbox transactions.
   1. If any transaction needs to be forced, the nodes retrieve all transactions in the delayed inbox, even if they haven't been in the delayed inbox longer than the delay.
   1. The nodes package these transactions into a block and process the transactions in the same way as they process transactions in blocks that come from the sequencer.

   In this way, transactions in the delayed inbox take precedence over the sequencer.
   If the kernel (via the Smart Rollup nodes) generates a block, that block results in a new branch of the Etherlink<!--TX--> chain, and the states of the sequencer and the Smart Rollup nodes diverge.
   It becomes the responsibility of the sequencer to reorganize itself to build blocks on top of the kernel-generated block.

To submit a transaction to the delayed inbox, see [Sending transactions to the delayed inbox](/evm/developing/transactions#sending-transactions-to-the-delayed-inbox).

## Transaction finality

Transactions are considered finalized when you can trust that they cannot be reversed.

The source of truth of what Etherlink<!--TX--> transactions are final is the state of the Smart Rollup, which Etherlink<!--TX--> Smart Rollup nodes store and keep up to date.
They catch any misbehavior by the sequencer or other actors, accept only valid transactions, and challenge questionable behavior.
As described in [Refutation periods](https://docs.tezos.com/architecture/smart-rollups#refutation-periods) on docs.tezos.com, Smart Rollup nodes have two weeks to challenge commitments made about the state of a Smart Rollup, although they usually challenge any questionable state as soon as possible.

Therefore, an Etherlink<!--TX--> transaction is truly finalized two weeks after the block it is in has been published to Tezos layer 1.
At this point, it is permanently part of the state of the Etherlink<!--TX--> Smart Rollup and of Tezos.

However, Etherlink<!--TX--> is set up so users can be confident that transactions are irreversible much sooner than that.
Most users can assume that a transaction is irreversible and will be finalized after one of these milestones:

- **The sequencer provides Instant Confirmations within 50ms.**
As described in [Getting Instant Confirmations](/evm/developing/transactions#getting-instant-confirmations), the sequencer notifies the nodes of the transactions that it intends to include in the next block.
The sequencer provides this notification as soon as it enqueues the transaction for the next block, before the transaction has been executed.
Users can subscribe to these notifications via the `tez_newIncludedTransactions` event, as described in [Subscribing to Instant Confirmations](/evm/developing/websockets#subscribing-to-instant-confirmations).
Users who trust the sequencer and these confirmations can take them as proof that the transaction will be in the next block.

- **Transactions are confirmed on Etherlink<!--TX--> within 500ms.**
As described in [Sequencer](#sequencer), the sequencer puts transactions in blocks and distributes them to the EVM nodes.
When the EVM nodes get another block that builds on the previous block, they can trust that the transactions in the previous block are final as long as they trust that the sequencer will publish them to layer 1.
At this point, the previous block is considered _confirmed_ and it would take a significant bug in the sequencer for it to generate blocks that do not use the confirmed block and thus reorganize the blocks in such a way as to make the confirmed block invalid.

- **Transactions are confirmed on layer 1 in 6 seconds.**
The sequencer also posts blocks to Tezos layer 1.
As with Etherlink<!--TX--> blocks, Tezos blocks are confirmed when another block builds on them, as described in [The consensus algorithm](https://octez.tezos.com/docs/active/consensus.html) in the Octez documentation.
Tezos blocks are generated every 6 seconds, so Etherlink<!--TX--> transactions are posted and confirmed on Tezos after 6 seconds, when another block is posted.
Etherlink<!--TX--> Smart Rollup nodes also pick up these blocks and their instance of the kernel decides immediately whether these blocks are valid and if they should become the next Etherlink<!--TX--> block.

   When the Etherlink<!--TX--> block has been posted and confirmed on Tezos layer 1, Etherlink<!--TX--> treats the block (and the transactions in it) as finalized.
   For example, when you pass the `finalized` parameter to the `eth_getBlockByNumber` RPC endpoint, the EVM node returns not the most recently created block but the block that was most recently posted on layer 1:

   ```bash
   curl --request POST \
        --url https://node.shadownet.etherlink.com \
        --header 'accept: application/json' \
        --header 'content-type: application/json' \
        --data '
   {
     "id": 1,
     "jsonrpc": "2.0",
     "method": "eth_getBlockByNumber",
     "params": ["finalized", false]
   }
   '
   ```

   For this RPC call to work, the EVM node must be following a Smart Rollup node; that is, it must not use the `--dont-track-rollup-node` flag.

After a block containing Etherlink<!--TX--> transactions is confirmed on Etherlink<!--TX--> and on Tezos layer 1, it is very unlikely that it can be replaced by other blocks (sometimes known as a _reorg_ because it reorganizes the chain of blocks).
Here are two possible but unlikely ways that Etherlink<!--TX--> blocks can be reorganized after they are confirmed on layer 1:

- If the sequencer ignores transactions in the delayed inbox as described in [Delayed inbox transaction processing](#delayed-inbox-transaction-processing) for too long, the Smart Rollup nodes process the transactions automatically and generate a block to include those transactions.
This chain may be different from the blocks that the sequencer has posted to layer 1.
In this case, the sequencer automatically reorganizes its blocks to follow the new state of Etherlink<!--TX-->.
This type of reorg happens quickly because the Smart Rollup nodes constantly check the delayed inbox and respond quickly when a transaction has been in it for too long.

- As with all [Smart Rollups](https://docs.tezos.com/architecture/smart-rollups), Smart Rollup nodes running in operator or maintenance mode post commitments about their state to Tezos layer 1.
If they execute the kernel honestly, all of their commitments are the same.
If commitments differ, the Smart Rollup nodes play a refutation game to determine the correct commitment and therefore the correct state of Etherlink<!--TX-->.
Eliminating these incorrect commitments can mean rejecting blocks that have been confirmed on layer 1.

For these reasons, you can have complete confidence that a transaction is final after the refutation period has elapsed for the block that contains it.
At this point, the commitment that includes this transaction is said to be _cemented_ and therefore final and unchangeable.
