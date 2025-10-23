---
title: Migrating to Etherlink Shadownet Testnet
---

import InlineCopy from '@site/src/components/InlineCopy';

Etherlink is migrating to a new testnet.
This new testnet is based on the Tezos [Shadownet](https://teztnets.com/shadownet-about) testnet, just as the legacy testnet was based on the Tezos [Ghostnet](https://teztnets.com/ghostnet-about) testnet.
For this reason, the new test network is referred to as "Etherlink Shadownet Testnet" and the legacy test network is referred in this documentation as "Etherlink Ghostnet Testnet."
This migration ensures that Etherlink's primary Testnet is aligned with the most up-to-date long-running Tezos test network that is similar to Mainnet.

The two testnets will run in parallel whilst migration by builders and partners takes place.
Etherlink Ghostnet Testnet will sunset on **15 January 2026**, and will then no longer be available.

This page gives the details of the migration, including milestones, calls to action, and the current progress.
It is intended for all the Etherlink partners such as infrastructure providers, node operators, and application builders.

## Key information

Here are some important pieces of information for Etherlink Shadownet Testnet:

- Built on Tezos L1 testnet [Shadownet](https://teztnets.com/shadownet-about)
- Chain ID: `127823`
- RPC endpoint: <InlineCopy code="https://node.shadownet.etherlink.com" />
- Block explorer: <a href="https://shadownet.explorer.etherlink.com/">https://shadownet.explorer.etherlink.com/</a>

For more technical details about this network, see [Network information](/get-started/network-information).

## Rationale

This migration will ensure better testnet parity with Etherlink Mainnet, ensuring a much smoother launch of applications and services in production.

This paves the way for more partners to bring their applications to Etherlink, by concretely ensuring:

- Earlier Etherlink Stack requirement forecasts
- Better pre-live simulations
- Better overall builder experience

In addition, Tezos L1 Ghostnet is likely to be discontinued at a similar time.

## Migration steps

The migration is being organized around the release and availability of key Shadownet Testnet infrastructure components.

The migration will be delivered in the following phases:

<table class="customTableContainer">
  <thead>
    <tr>
      <th>Phase</th>
      <th>Activities</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        Phase 1<br />Sep-Oct 2025
      </td>
      <td>
        - Sequencer & Relay nodes are set up
        - Etherlink Shadownet genesis takes place
        - Documentation for infrastructure providers issued
      </td>
      <td>✅ Complete</td>
    </tr>
    <tr>
      <td>
        Phase 2<br />Oct-Nov 2025
      </td>
      <td>
        - JSON-RPC API providers & blockchain indexers nodes setup ✅
        - Shadownet Tezos Bridge
        - EVM Bridge
        - Block Explorer ✅
        - Oracles
        - Network public goods: deployment of tokens, utility contracts (multicall3, create3 factories etc)
        - Smart rolltup node snapshot service available ✅
        - EVM node snapshot service available
        - Updates to developer SDKs (viem, chainlist, etc.)
        - Network monitoring infrastructure
      </td>
      <td>In progress</td>
    </tr>
    <tr>
      <td>
        Phase 3<br />Nov-Dec 2025
      </td>
      <td>
        - Faucet UI
        - Safe multisig service
        - Developers that have deployed apps to Ghostnet migrate them to Shadownet
      </td>
      <td>TODO</td>
    </tr>
    <tr>
      <td>
        Phase 4<br />Dec 2025-Jan 2026
      </td>
      <td>
        - Final app testing
        - Redirection of `testnet` URLs to Shadownet
      </td>
      <td>TODO</td>
    </tr>
    <tr>
      <td>
        Phase 5<br />Jan-Feb 2026
      </td>
      <td>
        - Planned sunset of Etherlink Ghostnet Testnet, aligned with deprecation of Tezos L1 Ghostnet
        - Sunset of Etherlink Ghostnet ecosystem infrastructure services and dapps
      </td>
      <td>TODO</td>
    </tr>
  </tbody>
</table>

## Calls to action

This section is meant for guiding the different categories of partners into action.
Instructions will be updated as the migration progresses.

### For node operators

If you run EVM nodes on the existing Ghostnet Testnet, please carry out the following tasks:

<table>
  <tr>
    <td>
      ACTION REQUIRED:

      1. Set up new Shadownet EVM nodes from genesis block following the instructions in [Running an Etherlink EVM node](/network/evm-nodes).
      1. If you run Smart Rollup nodes, follow the instructions for setting up your [Etherlink Shadownet Smart Rollup Node](/network/smart-rollup-nodes).
      1. If you run L1 Octez nodes, then follow these instructions to install [Octez](https://octez.tezos.com/docs/introduction/howtoget.html) for Tezos L1 Shadownet testnet.
      1. Carry out end-to-end testing to ensure performance is in line with your Ghostnet EVM node.
      1. (For commercial RPC providers) Inform your users about availability of the new nodes.
    </td>
  </tr>
</table>

:::note

Because EVM node snapshots for Shadownet are not yet available, you must bootstrap EVM nodes from the genesis block.
It should take only a few hours for the node to reach the latest block.
:::

### For infrastructure providers

If you currently operate infrastructure services for Etherlink Ghostnet Testnet, please prepare for these typical migration tasks:

- Check for any missing on-chain or off-chain dependencies and escalate with the Etherlink team
- Provision new infrastructure/hosts as needed
- Update JSON-RPC API endpoints from Etherlink Ghostnet to Etherlink Shadownet
- Obtain Etherlink Shadownet tez from the faucet
- Redeploy contracts to Etherlink Shadownet
- Update databases with Etherlink Shadownet data and addresses
- Update your apps to use the chain ID of Etherlink Shadownet
- Update your web3 SDKs to use Etherlink Shadownet
- End-to-end testing/QA
- Deployment and release to end-users

Detailed links will be added to this page as services on Shadownet are enabled.

<table>
  <tr>
    <td>
      - Action: Plan for your migration
      - Action: Your Etherlink team contacts will be in touch with further details and specific migration requirements
    </td>
  </tr>
</table>

:::note
In most cases developers will expect to use your services on both Ghostnet and Shadownet.
For this reason, anticipate running a parallel service for a few months until Ghostnet has been fully deprecated.

:::

### For developers

If you currently operate a dApp or marketplace on Etherlink Ghostnet Testnet for testing purposes, there should be no change in app behavior following the migration to Shadownet.

Migration would typically involve the following steps:

- Check for any missing on-chain or off-chain dependencies and escalate with the Etherlink team
- Provision new infrastructure/hosts as needed
- Update JSON-RPC API endpoints from Etherlink Ghostnet to Etherlink Shadownet.
- Obtain Etherlink Shadownet tez from the faucet
- Redeploy contracts to Etherlink Shadownet
- Migrate to new endpoints for data indexers or APIs
- Update databases with Etherlink Shadownet data
- Update your apps to use the new `chainId`
- Update your web3 SDKs to use Etherlink Shadownet
- End-to-end testing/QA
- Deployment and release to end-users

Detailed links will be added to this page as services on Shadownet are enabled.

<table>
  <tr>
    <td>
      <p>No immediate migration action is required at this stage.
      Refer to the timelines above and plan for your migration.</p>
      <p>Please join the [Etherlink Discord](https://discord.gg/etherlink) so that you can be alerted to updates when it's time to migrate your applications to Etherlink Shadownet.</p>
    </td>
  </tr>
</table>

## Getting help

Regular updates will be announced via the following channels:
- [Etherlink Discord](https://discord.gg/etherlink)
- [Twitter/X](https://x.com/etherlink)

For support, or if you have any questions about the testnet migration, please reach out to our team via existing direct channels or on the [Etherlink Discord](https://discord.gg/etherlink).