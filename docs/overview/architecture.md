---
title: Architecture
---

# Etherlink's architecture

## Seamless integration

To enable the seamless integration of the two ecosystems (EVM and Michelson) in a single blockchain, Etherlink<!--TX--> provides **Native Atomic Composability** (sometimes shortened as NAC): smart contracts in one interface can call contracts in the other within a single atomic transaction.
Thanks to the atomic composition combined with the use of the same native token, Etherlink<!--TX--> can be seen as **a unified execution layer**, constituting a single economic space.

Each interface is implemented by a dedicated runtime exposing a standard RPC endpoint.

| Interface | Runtime | RPC standard |
|---|---|---|
| EVM | EVM runtime | Ethereum JSON-RPC |
| Michelson | Michelson runtime | Tezos RPC |

The goal for each interface is to stay as compatible as possible with the original ecosystem it supports — Ethereum for the EVM interface, and Tezos Layer 1 for the Michelson interface. Where differences exist, they are documented in the respective interface sections.

### Bridging vs. NAC

When an EVM contract calls a Michelson contract on Etherlink<!--TX-->, both execution steps happen inside the same rollup kernel, within a single block:

<svg viewBox="0 0 760 492" role="img" aria-label="Etherlink architecture: Ethereum and Tezos developer tools connect to the EVM and Michelson interfaces, each implemented by a runtime of the Etherlink chain; the runtimes are linked by cross-runtime atomic calls (NAC), and the chain is anchored on Tezos Layer 1 as a Smart Rollup" style={{width: '100%', maxWidth: '760px', display: 'block', margin: '1.5rem auto', fontFamily: 'inherit'}}>
  <defs>
    <marker id="arch-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0.6 L7,4 L0,7.4" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </marker>
  </defs>

  {/* Developer tools */}
  <rect x="40" y="10" width="310" height="76" rx="12" fill="rgba(255,255,255,0.08)"/>
  <text x="195" y="42" textAnchor="middle" fill="rgba(255,255,255,0.62)" style={{font: '600 11px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>ETHEREUM TOOLS</text>
  <text x="195" y="66" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="14">MetaMask &#183; Hardhat &#183; Foundry &#8230;</text>

  <rect x="410" y="10" width="310" height="76" rx="12" fill="rgba(255,255,255,0.08)"/>
  <text x="565" y="42" textAnchor="middle" fill="rgba(255,255,255,0.62)" style={{font: '600 11px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>TEZOS TOOLS</text>
  <text x="565" y="66" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="14">Temple &#183; Taquito &#183; TzKT &#8230;</text>

  {/* Tools to interfaces connectors */}
  <line x1="195" y1="86" x2="195" y2="196" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5" markerEnd="url(#arch-arrow)"/>
  <text x="207" y="140" fill="rgba(255,255,255,0.62)" style={{font: '11px var(--ifm-font-family-monospace)'}}>Ethereum JSON-RPC</text>
  <line x1="565" y1="86" x2="565" y2="196" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5" markerEnd="url(#arch-arrow)"/>
  <text x="577" y="140" fill="rgba(255,255,255,0.62)" style={{font: '11px var(--ifm-font-family-monospace)'}}>Tezos RPC</text>

  {/* Etherlink chain */}
  <rect x="40" y="152" width="680" height="180" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.28)"/>
  <text x="64" y="182" fill="rgba(255,255,255,0.62)" style={{font: '600 11px var(--ifm-font-family-monospace)', letterSpacing: '0.12em'}}>ETHERLINK</text>

  {/* Interfaces (the access surface) backed by runtimes (the executors) */}
  <rect x="64" y="200" width="262" height="30" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.28)"/>
  <text x="195" y="219" textAnchor="middle" fill="rgba(255,255,255,0.8)" style={{font: '600 10.5px var(--ifm-font-family-monospace)', letterSpacing: '0.1em'}}>EVM INTERFACE</text>
  <rect x="64" y="238" width="262" height="74" rx="12" fill="rgba(255,255,255,0.11)"/>
  <text x="195" y="280" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="16">EVM runtime</text>

  <rect x="434" y="200" width="262" height="30" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.28)"/>
  <text x="565" y="219" textAnchor="middle" fill="rgba(255,255,255,0.8)" style={{font: '600 10.5px var(--ifm-font-family-monospace)', letterSpacing: '0.1em'}}>MICHELSON INTERFACE</text>
  <rect x="434" y="238" width="262" height="74" rx="12" fill="rgba(255,255,255,0.11)"/>
  <text x="565" y="280" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="16">Michelson runtime</text>

  {/* NAC connector between the runtimes */}
  <path d="M338,275 L330,271 L330,279 Z" fill="#38FF9C"/>
  <line x1="336" y1="275" x2="352" y2="275" stroke="#38FF9C" strokeWidth="1.5"/>
  <rect x="352" y="263" width="56" height="24" rx="12" fill="rgba(56,255,156,0.18)"/>
  <text x="380" y="279" textAnchor="middle" fill="#38FF9C" style={{font: '600 11px var(--ifm-font-family-monospace)', letterSpacing: '0.08em'}}>NAC</text>
  <line x1="408" y1="275" x2="424" y2="275" stroke="#38FF9C" strokeWidth="1.5"/>
  <path d="M422,275 L430,271 L430,279 Z" fill="#38FF9C"/>
  <text x="380" y="305" textAnchor="middle" fill="rgba(255,255,255,0.62)" style={{font: '10.5px var(--ifm-font-family-monospace)'}}>cross-runtime</text>
  <text x="380" y="320" textAnchor="middle" fill="rgba(255,255,255,0.62)" style={{font: '10.5px var(--ifm-font-family-monospace)'}}>atomic calls</text>

  {/* Anchoring connector */}
  <line x1="380" y1="332" x2="380" y2="392" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5" markerEnd="url(#arch-arrow)"/>
  <text x="392" y="368" fill="rgba(255,255,255,0.62)" style={{font: '11px var(--ifm-font-family-monospace)'}}>anchored as a Smart Rollup</text>

  {/* Tezos Layer 1 */}
  <rect x="40" y="398" width="680" height="64" rx="12" fill="rgba(255,255,255,0.08)"/>
  <text x="380" y="436" textAnchor="middle" fill="rgba(255,255,255,0.95)" fontSize="16">Tezos Layer 1</text>
</svg>

This is fundamentally different from **L1↔L2 bridging** (moving assets between Tezos L1 and Etherlink<!--TX-->) or **cross-chain bridging** (connecting two independent chains through a third-party relayer).
In both bridging cases, the two sides are separate ledgers that must be reconciled across transactions.

| | L1↔L2 bridge | Cross-chain bridge | NAC (intra-Etherlink<!--TX-->) |
|---|---|---|---|
| Chains / layers involved | 2 | 3+ | 1 |
| Number of transactions | 2+ | 4+ | 1 |
| Atomic (all-or-nothing) | No | No | Yes — reverts entirely |
| Latency | Minutes (deposits) to days (withdrawals) | Minutes to hours | Same block (~500 ms) |
| Asset representation | Native tez; wrapped FA tokens | Doubly-wrapped tokens | Native tokens |
| Trust assumption | Bridge operator | Multiple bridge operators | None — same kernel |

### NAC call sequence

The diagram below shows what happens inside a single block when an EVM contract calls a Michelson contract through the gateway precompile.

```mermaid
sequenceDiagram
    actor U as EVM user
    participant EVM as EVM runtime
    participant GW as Gateway precompile
    participant M as Michelson runtime
    participant KT as KT1… contract

    U->>EVM: send transaction
    EVM->>GW: callMichelson("KT1…", "entrypoint", data)
    GW->>M: cross-runtime dispatch
    M->>KT: execute entrypoint
    KT-->>M: storage updated
    M-->>GW: success / revert
    GW-->>EVM: outcome
    EVM-->>U: transaction receipt

    Note over EVM,M: One atomic transaction — all or nothing
```

Because the two runtimes share the same ledger, there are no wrapped tokens to mint or burn, no bridge relayer to trust, and no risk of one side completing while the other fails.


## Network architecture

Etherlink<!--TX--> is powered by a [Tezos Smart Rollup](https://docs.tezos.com/architecture/smart-rollups). The key components of the [Etherlink<!--TX--> architecture](/network/architecture) are:

- **Sequencer** — elected by Tezos Layer 1 bakers, the sequencer orders and batches operations from all interfaces into _blueprints_, which it publishes to the L1 rollup inbox. It targets a block time of around 500 ms, and offers pre-confirmations in about 50ms.
- **Rollup nodes** — apply blueprints (including operations from all interfaces) to produce Etherlink<!--TX--> blocks and maintain the chain state. Each rollup node derives a per-interface block from each Etherlink<!--TX--> block.
- **EVM nodes<!--TXN-->** — expose the two JSON-RPC APIs, backed respectively by the EVM runtime state and Michelson runtime state.
  Thus, they could be called "Etherlink nodes" by now, but we keep calling them "EVM nodes" because the corresponding executable is still called `octez-evm-node`.
- **Tezos nodes** — expose the Tezos Layer 1 RPC API.

Operations submitted via either interface to the corresponding runtime are collected by the sequencer, interleaved in first-in-first-out order, and included in the next blueprint.
