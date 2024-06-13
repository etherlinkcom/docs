---
title: 'Etherlink Node Specifications'
---

## Node Client Support

| Specification | Type   | Comments                                                   |
| ------------- | ------ | ---------------------------------------------------------- |
| Node Client   | `geth` | Currently, the EVM RPC endpoint only implements geth RPCs. |

## Geth Endpoint Support

Endpoint | Supported | Notes
--- | --- | ---
`txpool_content` or `eth_getBlockByNumber` with pending transactions | Yes | The RPC returns the transaction pool on Ghostnet but always returns an empty pool on Mainnet
`eth_getBlockByNumber` | Yes |
`eth_getTransactionReceipt` | Yes |
`eth_blockNumber` | Yes |
`eth_getLogs` | Yes |
`eth_getBlockReceipts` | Yes |
`eth_sendRawTransaction` | Yes |
`debug_traceBlockByNumber` | No | On roadmap but not guaranteed
`debug_traceTransaction` | Partially | Supported on Ghostnet but not Mainnet

## [ethers.js](https://docs.ethers.org/v6/) SDK methods tested

<table><thead><tr><th width="366.3333333333333">Method</th><th data-type="checkbox">Supported</th><th>Comments</th></tr></thead><tbody><tr><td><code>provider.getBlock</code>(<a href="https://docs.ethers.org/v6/api/providers/#Provider-getBlock">link</a>)</td><td>true</td><td></td></tr><tr><td><code>provider.getTransactionReceipt</code> (<a href="https://docs.ethers.org/v6/api/providers/#Provider-getTransactionReceipt">link</a>)</td><td>true</td><td></td></tr><tr><td><code>provider.getBlockNumber</code>(<a href="https://docs.ethers.org/v6/api/providers/#Provider-getBlockNumber">link</a>)</td><td>true</td><td></td></tr><tr><td><code>provider.getBalance</code>(<a href="https://docs.ethers.org/v6/api/providers/#Provider-getBalance">link</a>)</td><td>true</td><td></td></tr><tr><td><code>singer.sendTransaction</code>(<a href="https://docs.ethers.org/v6/api/providers/#Signer-sendTransaction">link</a>)</td><td>true</td><td></td></tr></tbody></table>

## Additional Information

|                                      | Comments                                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Whitelisting Fireblocks IP addresses | Not Supported                                                                                           |
| Native Token Decimals                | 18                                                                                                      |
| Fee Structure                        | **Post London** (Fee market is not implemented yet, but the rollup supports EIP-1559 transaction types) |
