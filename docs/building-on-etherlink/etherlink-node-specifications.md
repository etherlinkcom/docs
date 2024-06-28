---
title: 'Etherlink Node Specifications'
---

## Node Client Support

| Specification | Type   | Comments                                                   |
| ------------- | ------ | ---------------------------------------------------------- |
| Node Client   | `geth` | Currently, the EVM RPC endpoint only implements geth RPCs. |

## Ethereum endpoint support

Etherlink nodes use [Geth](https://geth.ethereum.org/) to provide access to both standard Ethereum RPC endpoints and Geth-specific RPC endpoints.
These tables list these endpoints and whether Etherlink supports them:

### Standard Ethereum endpoints

For information about these endpoints, see [JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc) and the [Ethereum JSON-RPC Specification](https://ethereum.github.io/execution-apis/api-documentation/) in the Ethereum documentation.

Endpoint | Supported | Notes
--- | --- | ---
`debug_getBadBlocks` | No |
`debug_getRawBlock` | No |
`debug_getRawHeader` | No |
`debug_getRawReceipts` | No |
`debug_getRawTransaction` | No |
`engine_exchangeCapabilities` | No |
`engine_exchangeTransitionConfigurationV1` | No |
`engine_forkchoiceUpdatedV1` | No |
`engine_forkchoiceUpdatedV2` | No |
`engine_forkchoiceUpdatedV3` | No |
`engine_getPayloadBodiesByHashV1` | No |
`engine_getPayloadBodiesByHashV2` | No |
`engine_getPayloadBodiesByRangeV1` | No |
`engine_getPayloadBodiesByRangeV2` | No |
`engine_getPayloadV1` | No |
`engine_getPayloadV2` | No |
`engine_getPayloadV3` | No |
`engine_getPayloadV4` | No |
`engine_newPayloadV1` | No |
`engine_newPayloadV2` | No |
`engine_newPayloadV3` | No |
`engine_newPayloadV4` | No |
`eth_accounts` | Yes |
`eth_blobBaseFee` | No |
`eth_blockNumber` | Yes |
`eth_call` | Yes | Etherlink nodes use the standard Ethereum version of the `eth_call` endpoint instead of the Geth version
`eth_chainId` | Yes |
`eth_coinbase` | No |
`eth_createAccessList` | No |
`eth_estimateGas` | Yes |
`eth_estimateGas` | Yes |
`eth_feeHistory` | Yes |
`eth_gasPrice` | Yes |
`eth_getBalance` | Yes |
`eth_getBlockByHash` | Yes |
`eth_getBlockByNumber` | Yes |
`eth_getBlockReceipts` | Yes |
`eth_getBlockTransactionCountByHash` | Yes |
`eth_getBlockTransactionCountByNumber` | Yes |
`eth_getCode` | Yes |
`eth_getFilterChanges` | No |
`eth_getFilterLogs` | No |
`eth_getLogs` | Yes |
`eth_getProof` | No |
`eth_getStorageAt` | Yes |
`eth_getTransactionByBlockHashAndIndex` | Yes |
`eth_getTransactionByBlockNumberAndIndex` | Yes |
`eth_getTransactionByHash` | Yes |
`eth_getTransactionCount` | Yes |
`eth_getTransactionReceipt` | Yes |
`eth_getUncleByBlockHashAndIndex` | Yes |
`eth_getUncleByBlockNumberAndIndex` | Yes |
`eth_getUncleCountByBlockHash` | Yes |
`eth_getUncleCountByBlockNumber` | Yes |
`eth_hashrate` | No |
`eth_maxPriorityFeePerGas` | Yes |
`eth_mining` | No |
`eth_newBlockFilter` | No |
`eth_newFilter` | No |
`eth_newPendingTransactionFilter` | No |
`eth_protocolVersion` | No |
`eth_sendRawTransaction` | Yes |
`eth_sendTransaction` | No |
`eth_sign` | No |
`eth_signTransaction` | No |
`eth_syncing` | No |
`eth_uninstallFilter` | No |
`net_listening` | No |
`net_peerCount` | No |
`net_version` | Yes |
`web3_clientVersion` | Yes |
`web3_sha3` | Yes |

### Geth-specific endpoints

This table shows the Geth endpoints that Etherlink nodes support.
All other Geth endpoints are not supported.
For information about these endpoints, see the Geth documentation at https://geth.ethereum.org/docs.

Endpoint | Supported | Notes
--- | --- | ---
`debug_traceTransaction` | Partially | Supported on Ghostnet but not Mainnet
`eth_call` | No | Etherlink nodes use the standard Ethereum version of the `eth_call` endpoint instead of the Geth version
`txpool_content` | Partially | Returns the transaction pool on Ghostnet but always returns an empty pool on Mainnet

## [ethers.js](https://docs.ethers.org/v6/) SDK methods tested

<table><thead><tr><th width="366.3333333333333">Method</th><th data-type="checkbox">Supported</th><th>Comments</th></tr></thead><tbody><tr><td><code>provider.getBlock</code>(<a href="https://docs.ethers.org/v6/api/providers/#Provider-getBlock">link</a>)</td><td>true</td><td></td></tr><tr><td><code>provider.getTransactionReceipt</code> (<a href="https://docs.ethers.org/v6/api/providers/#Provider-getTransactionReceipt">link</a>)</td><td>true</td><td></td></tr><tr><td><code>provider.getBlockNumber</code>(<a href="https://docs.ethers.org/v6/api/providers/#Provider-getBlockNumber">link</a>)</td><td>true</td><td></td></tr><tr><td><code>provider.getBalance</code>(<a href="https://docs.ethers.org/v6/api/providers/#Provider-getBalance">link</a>)</td><td>true</td><td></td></tr><tr><td><code>singer.sendTransaction</code>(<a href="https://docs.ethers.org/v6/api/providers/#Signer-sendTransaction">link</a>)</td><td>true</td><td></td></tr></tbody></table>

## Additional Information

|                                      | Comments                                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Whitelisting Fireblocks IP addresses | Not Supported                                                                                           |
| Native Token Decimals                | 18                                                                                                      |
| Fee Structure                        | **Post London** (Fee market is not implemented yet, but the rollup supports EIP-1559 transaction types) |
