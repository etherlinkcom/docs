---
title: Etherlink # tx
slug: /
---

# What is Etherlink<!--TX-->?

Etherlink<!--TX--> is a fast, non-custodial execution layer enshrined in the Tezos protocol, which settles back to the Tezos consensus layer (Tezos Layer 1) for security.

Since kernel upgrade 7, Etherlink<!--TX--> exposes a **single blockchain** that is **addressable through two interfaces**: an **EVM interface** (available since early 2024 under the name "Etherlink") and a new **Michelson interface** (previously called Tezlink).
In that, kernel upgrade 7 constituted an important milestone in the Tezos X roadmap, securing the way to the near-term Tezos X launch.

To enable the seamless integration of the two ecosystems in this single blockchain, Etherlink<!--TX--> provides **Native Atomic Composability** (sometimes shortened as NAC): smart contracts in one interface can call contracts in the other within a single atomic transaction. From an economical perspective, the interface used to interact with the chain doesn't matter, it becomes only a technical detail.
Thanks to the atomic composition, Etherlink<!--TX--> can be seen as **unified execution layer**, constituting a single economical space.

Each interface is implemented by a dedicated runtime exposing a standard RPC endpoint.

| Interface | Runtime | RPC standard |
|---|---|---|
| EVM | EVM runtime | Ethereum JSON-RPC |
| Michelson | Michelson runtime | Tezos RPC |

The goal for each interface is to stay as compatible as possible with the original ecosystem it supports — Ethereum for the EVM interface, and Tezos Layer 1 for the Michelson interface. Where differences exist, they are documented in the respective interface sections.

## Network architecture

Etherlink<!--TX--> is powered by a [Tezos Smart Rollup](https://docs.tezos.com/architecture/smart-rollups). The key components of the [Etherlink<!--TX--> architecture](/network/architecture) are:

- **Sequencer** — elected by Tezos Layer 1 bakers, the sequencer orders and batches operations from all interfaces into _blueprints_, which it publishes to the L1 rollup inbox. It targets a block time of around 500 ms, and offers pre-confirmations in about 50ms.
- **Rollup nodes** — apply blueprints (including operations from all interfaces) to produce Etherlink<!--TX--> blocks and maintain the chain state. Each rollup node derives a per-interface block from each Etherlink<!--TX--> block.
- **EVM nodes<!--TXN-->** — expose the two JSON-RPC APIs, backed respectively by the EVM runtime state and Michelson runtime state.
- **Tezos nodes** — expose the Tezos Layer 1 RPC API.

Operations submitted via either interface to the corresponding runtime are collected by the sequencer, interleaved in first-in-first-out order, and included in the next blueprint.

## DX/UX (Developer and User eXperience)

Built upon the secure foundation of Tezos consensus layer, Etherlink<!--TX--> delivers a fast, fair, and (nearly) free experience for users and developers.

### It's fast

Experience a developer-friendly environment that minimizes wait times.
Etherlink<!--TX--> provides low latency with sub-second (< 500ms) confirmation times, delivered by the sequencer.

And it's getting even faster with [Instant Confirmations](/evm/developing/transactions#getting-instant-confirmations), currently an experimental feature, that provide pre-confirmations within 50ms.

Leveraging the Tezos 2-block finality guarantee and the high-speed execution of Smart Rollups, Etherlink<!--TX--> ensures your transactions are confirmed quickly and securely.

<table class="customTableContainer">
  <thead>
    <tr>
      <th>Chain</th>
      <th>Confirmation time (L2/execution layer)</th>
      <th>Settlement time (L1/consensus layer)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Etherlink<!--TX--></td>
      <td>~ <span class="emphasize-advantage">500 ms</span><br/>(preconfirmation: <span class="emphasize-advantage">50 ms</span>)</td>
      <td>~ <span class="emphasize-advantage">6 seconds</span></td>
    </tr>
    <tr>
      <td>Optimism Bedrock</td>
      <td>~ <a class="deemphasize-disadvantage" href="https://community.optimism.io/docs/developers/build/differences/#blocks" target="_blank" rel="noopener noreferrer">2 seconds</a></td>
      <td>~ <a class="deemphasize-disadvantage" href="https://optimistic.etherscan.io/batches" target="_blank" rel="noopener noreferrer">2 minutes</a></td>
    </tr>
    <tr>
      <td>Arbitrum One</td>
      <td>~ <a class="deemphasize-disadvantage" href="https://arbiscan.io/" target="_blank" rel="noopener noreferrer">300 ms</a></td>
      <td>~ <a class="deemphasize-disadvantage" href="https://arbiscan.io/batches" target="_blank" rel="noopener noreferrer">7 minutes</a></td>
    </tr>
  </tbody>
</table>

For more information about confirmation times and finality, see [Transaction finality](/network/architecture#transaction-finality).

### It's fair

Etherlink<!--TX-->' governance is integrated with the permissionless and robust fraud-proof system of the Tezos protocol, ensuring transparency and fairness in decision making.

Stakeholders can propose and vote on protocol changes, including kernel updates, security patches, and changes to the sequencer operator.
To accurately reflect community consensus, all governance processes are equipped with robust safeguards.

Out of the box, anyone can participate and run a node, post commitments about the current state of Etherlink<!--TX-->, challenge other node operators' commitments, and contribute to network security.
With no administrative keys or centralized bridges, users retain complete control over their assets, which helps ensure a fair environment free from exploitation.

### It's (nearly) free

On Etherlink<!--TX-->, an ERC-20 transaction costs $0.001 or less, making it nearly free to use.
These minimal fees enable cost-effective transactions necessary to foster innovation and development.

Security is enhanced on Etherlink<!--TX--> in part because it is built on Tezos Smart Rollups, which are enshrined on the platform, meaning they are implemented directly in the protocol of the consensus layer.

Because Smart Rollups run in separate environments, they avoid the per-transaction gas fees of the consensus layer and incur only minimal costs when publishing their state to the consensus layer.
This unique architecture allows you to build and deploy applications without worrying about prohibitive transaction costs.
