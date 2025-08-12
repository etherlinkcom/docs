---
title: Node providers
---

## Public RPC

The public RPC nodes at `node.mainnet.etherlink.com` and `node.ghostnet.etherlink.com` are intended for use within user wallets such as MetaMask, and for dApps wanting to test out API access to Etherlink within the rate limits listed below. 
For higher limits you will need to [operate your own node](/network/evm-nodes), or subscribe to an API plan offered by a commercial RPC node provider.

### Current restrictions

<table class="customTableContainer fullWidthTable">
  <thead>
    <tr>
      <th>Item</th>
      <th>Restriction</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Requests rate limits</td>
      <td>1000 requests per minute</td>
    </tr>
    <tr>
      <td>`eth_getLogs`</td>
      <td>Block range: max 500 blocks<br />Max no. of logs returned: 5,000</td>
    </tr>    
  </tbody>
</table>

:::warning
These restrictions are kept under frequent review and may be updated without notice.
:::

## Commercial RPC Providers

If you don't wish to deploy and manage your own Etherlink RPC node, or require features or rate limits higher the ones listed above, these companies offer a wide range of plans:

- Ankr: See https://www.ankr.com/web3-api/chains-list/etherlink/
- BlockPI: See https://blockpi.io/chain/etherlink
- Chainstack: See https://chainstack.com/build-better-with-etherlink/
- Spectrum: See https://spectrumnodes.com/
- Zeeve: See https://www.zeeve.io/blockchain-protocols/deploy-etherlink-node/
