---
title: What is Etherlink? # tx
slug: /
---

# What is Etherlink<!--TX-->?

Etherlink<!--TX--> is an EVM-compatible, non-custodial execution layer enshrined in the Tezos protocol and powered by [Tezos Smart Rollup technology](https://tezos.com/developers/smart-rollups/), which settles back to the Tezos consensus layer (Tezos Layer 1) for security.

It enables seamless integration with existing Ethereum tools, including wallets and indexers, and facilitates asset transfers to and from other EVM-compatible chains.

Since kernel upgrade 7, Etherlink<!--TX--> also exposes a **Michelson interface** (previously called Tezlink), thus implementing a **single blockchain** that is **addressable through two interfaces**: the **EVM interface** and the new **Michelson interface** (previously called Tezlink).
In that, kernel upgrade 7 constituted an important milestone in the Tezos X roadmap, securing the way to the near-term Tezos X launch.

To learn more about these new features, see [Etherlink's architecture](/overview/architecture).

Built upon the secure foundation of Tezos layer 1, Etherlink<!--TX-->  delivers a *fast, fair, and (nearly) free* experience. This permissionless and censorship-resistant environment empowers developers and users to actively create and participate in the next generation of decentralized applications.

## It's fast

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

## It's fair

Etherlink<!--TX-->' governance is integrated with the permissionless and robust fraud-proof system of the Tezos protocol, ensuring transparency and fairness in decision making.

Stakeholders can propose and vote on protocol changes, including kernel updates, security patches, and changes to the sequencer operator.
To accurately reflect community consensus, all governance processes are equipped with robust safeguards.

Out of the box, anyone can participate and run a node, post commitments about the current state of Etherlink<!--TX-->, challenge other node operators' commitments, and contribute to network security.
With no administrative keys or centralized bridges, users retain complete control over their assets, which helps ensure a fair environment free from exploitation.

## It's (nearly) free

On Etherlink<!--TX-->, an ERC-20 transaction costs $0.001 or less, making it nearly free to use.
These minimal fees enable cost-effective transactions necessary to foster innovation and development.

Security is enhanced on Etherlink<!--TX--> in part because it is built on Tezos Smart Rollups, which are enshrined on the platform, meaning they are implemented directly in the protocol of the consensus layer.

Because Smart Rollups run in separate environments, they avoid the per-transaction gas fees of the consensus layer and incur only minimal costs when publishing their state to the consensus layer.
This unique architecture allows you to build and deploy applications without worrying about prohibitive transaction costs.
