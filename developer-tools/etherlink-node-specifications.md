---
layout:
  title:
    visible: true
  description:
    visible: false
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# Etherlink Node Specifications

## Node Client Support

| Specification | Type   | Comments                                                   |
| ------------- | ------ | ---------------------------------------------------------- |
| Node Client   | `geth` | Currently, the EVM RPC endpoint only implements geth RPCs. |

## Geth Endpoint Support

<table><thead><tr><th width="333.3333333333333">Endpoint</th><th data-type="checkbox">Supported</th><th>Comments</th></tr></thead><tbody><tr><td><code>xpool_content</code> or <code>eth_getBlockByNumber</code> with pending transactions</td><td>true</td><td>The RPC is accessible but always returns an empty pool.</td></tr><tr><td><code>eth_getBlockByNumber</code></td><td>true</td><td></td></tr><tr><td><code>eth_getTransactionReceipt</code></td><td>true</td><td></td></tr><tr><td><code>eth_blockNumber</code></td><td>true</td><td></td></tr><tr><td><code>eth_getLogs</code> or <code>eth_getBlockReceipts</code></td><td>false</td><td>In Progress</td></tr><tr><td><code>debug_traceBlockByNumber</code></td><td>false</td><td>On roadmap but not guaranteed </td></tr><tr><td><code>debug_traceTransaction</code></td><td>false</td><td>On roadmap but not guaranteed </td></tr></tbody></table>

## [ethers.js](https://docs.ethers.org/v6/) SDK methods tested

<table><thead><tr><th width="366.3333333333333">Method</th><th data-type="checkbox">Supported</th><th>Comments</th></tr></thead><tbody><tr><td><code>provider.getBlock</code>(<a href="https://docs.ethers.org/v6/api/providers/#Provider-getBlock">link</a>)</td><td>true</td><td></td></tr><tr><td><code>provider.getTransactionReceipt</code> (<a href="https://docs.ethers.org/v6/api/providers/#Provider-getTransactionReceipt">link</a>)</td><td>true</td><td></td></tr><tr><td><code>provider.getBlockNumber</code>(<a href="https://docs.ethers.org/v6/api/providers/#Provider-getBlockNumber">link</a>)</td><td>true</td><td></td></tr><tr><td><code>provider.getBalance</code>(<a href="https://docs.ethers.org/v6/api/providers/#Provider-getBalance">link</a>)</td><td>true</td><td></td></tr><tr><td><code>singer.sendTransaction</code>(<a href="https://docs.ethers.org/v6/api/providers/#Signer-sendTransaction">link</a>)</td><td>true</td><td></td></tr></tbody></table>

## Additional Information

|                                      | Comments                                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Whitelisting Fireblocks IP addresses | Not Supported                                                                                           |
| Native Token Decimals                | 18                                                                                                      |
| Fee Structure                        | **Post London** (Fee market is not implemented yet, but the rollup supports EIP-1559 transaction types) |
