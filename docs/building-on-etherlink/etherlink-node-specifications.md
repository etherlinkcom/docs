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

For information about these endpoints, see [JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc) in the Ethereum documentation.

Endpoint | Supported | Notes
--- | --- | ---
`web3_clientVersion` | Yes |
`web3_sha3` | Yes |
`net_version` | Yes |
`net_listening` | No |
`net_peerCount` | No |
`eth_protocolVersion` | No |
`eth_syncing` | No |
`eth_coinbase` | No |
`eth_chainId` | Yes |
`eth_mining` | No |
`eth_hashrate` | No |
`eth_gasPrice` | Yes |
`eth_accounts` | Yes |
`eth_blockNumber` | Yes |
`eth_getBalance` | Yes |
`eth_getStorageAt` | Yes |
`eth_getTransactionCount` | Yes |
`eth_getBlockTransactionCountByHash` | Yes |
`eth_getBlockTransactionCountByNumber` | Yes |
`eth_getUncleCountByBlockHash` | Yes |
`eth_getUncleCountByBlockNumber` | Yes |
`eth_getCode` | Yes |
`eth_sign` | No |
`eth_signTransaction` | No |
`eth_sendTransaction` | No |
`eth_sendRawTransaction` | Yes |
`eth_call` | Yes |
`eth_estimateGas` | Yes |
`eth_getBlockByHash` | Yes |
`eth_getBlockByNumber` | Yes |
`eth_getTransactionByHash` | Yes |
`eth_getTransactionByBlockHashAndIndex` | Yes |
`eth_getTransactionByBlockNumberAndIndex` | Yes |
`eth_getTransactionReceipt` | Yes |
`eth_getUncleByBlockHashAndIndex` | Yes |
`eth_getUncleByBlockNumberAndIndex` | Yes |
`eth_newFilter` | No |
`eth_newBlockFilter` | No |
`eth_newPendingTransactionFilter` | No |
`eth_uninstallFilter` | No |
`eth_getFilterChanges` | No |
`eth_getFilterLogs` | No |
`eth_getLogs` | Yes |

### Geth-specific endpoints

For information about these endpoints, see the Geth documentation at https://geth.ethereum.org/docs.

Endpoint | Supported | Notes
--- | --- | ---
`admin_addPeer` | No |
`admin_addTrustedPeer` | No |
`admin_datadir` | No |
`admin_exportChain` | No |
`admin_importChain` | No |
`admin_nodeInfo` | No |
`admin_peerEvents` | No |
`admin_peers` | No |
`admin_removePeer` | No |
`admin_removeTrustedPeer` | No |
`admin_startHTTP` | No |
`admin_startWS` | No |
`admin_stopHTTP` | No |
`admin_stopWS` | No |
`debug_accountRange` | No |
`debug_backtraceAt` | No |
`debug_blockProfile` | No |
`debug_chaindbCompact` | No |
`debug_chaindbProperty` | No |
`debug_cpuProfile` | No |
`debug_dbAncient` | No |
`debug_dbAncients` | No |
`debug_dbGet` | No |
`debug_dumpBlock` | No |
`debug_freeOSMemory` | No |
`debug_freezeClient` | No |
`debug_gcStats` | No |
`debug_getAccessibleState` | No |
`debug_getBadBlocks` | No |
`debug_getRawBlock` | No |
`debug_getRawHeader` | No |
`debug_getRawTransaction` | No |
`debug_getModifiedAccountsByHash` | No |
`debug_getModifiedAccountsByNumber` | No |
`debug_getRawReceipts` | No |
`debug_goTrace` | No |
`debug_intermediateRoots` | No |
`debug_memStats` | No |
`debug_mutexProfile` | No |
`debug_preimage` | No |
`debug_printBlock` | No |
`debug_setBlockProfileRate` | No |
`debug_setGCPercent` | No |
`debug_setHead` | No |
`debug_setMutexProfileFraction` | No |
`debug_setTrieFlushInterval` | No |
`debug_stacks` | No |
`debug_standardTraceBlockToFile` | No |
`debug_standardTraceBadBlockToFile` | No |
`debug_startCPUProfile` | No |
`debug_startGoTrace` | No |
`debug_stopCPUProfile` | No |
`debug_stopGoTrace` | No |
`debug_storageRangeAt` | No |
`debug_traceBadBlock` | No |
`debug_traceBlock` | No |
`debug_traceBlockByNumber` | No |
`debug_traceBlockByHash` | No |
`debug_traceBlockFromFile` | No |
`debug_traceCall` | No |
`debug_traceChain` | No |
`debug_traceTransaction` | Partially | Supported on Ghostnet but not Mainnet
`debug_verbosity` | No |
`eth_subscribe` | No |
`eth_unsubscribe` | No |
`eth_call` | Yes |
`eth_createAccessList` | No |
`eth_getHeaderByNumber` | No |
`eth_getHeaderByHash` | No |
`les_serverInfo` | No |
`les_clientInfo` | No |
`les_priorityClientInfo` | No |
`les_addBalance` | No |
`les_setClientParams` | No |
`les_setDefaultParams` | No |
`les_latestCheckpoint` | No |
`les_getCheckpoint` | No |
`les_getCheckpointContractAddress` | No |
`net_listening` | No |
`net_peerCount` | No |
`net_version` | No |
`txpool_content` | Partially | Returns the transaction pool on Ghostnet but always returns an empty pool on Mainnet
`txpool_contentFrom` | No |
`txpool_inspect` | No |
`txpool_status` | No |

## [ethers.js](https://docs.ethers.org/v6/) SDK methods tested

<table><thead><tr><th width="366.3333333333333">Method</th><th data-type="checkbox">Supported</th><th>Comments</th></tr></thead><tbody><tr><td><code>provider.getBlock</code>(<a href="https://docs.ethers.org/v6/api/providers/#Provider-getBlock">link</a>)</td><td>true</td><td></td></tr><tr><td><code>provider.getTransactionReceipt</code> (<a href="https://docs.ethers.org/v6/api/providers/#Provider-getTransactionReceipt">link</a>)</td><td>true</td><td></td></tr><tr><td><code>provider.getBlockNumber</code>(<a href="https://docs.ethers.org/v6/api/providers/#Provider-getBlockNumber">link</a>)</td><td>true</td><td></td></tr><tr><td><code>provider.getBalance</code>(<a href="https://docs.ethers.org/v6/api/providers/#Provider-getBalance">link</a>)</td><td>true</td><td></td></tr><tr><td><code>singer.sendTransaction</code>(<a href="https://docs.ethers.org/v6/api/providers/#Signer-sendTransaction">link</a>)</td><td>true</td><td></td></tr></tbody></table>

## Additional Information

|                                      | Comments                                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Whitelisting Fireblocks IP addresses | Not Supported                                                                                           |
| Native Token Decimals                | 18                                                                                                      |
| Fee Structure                        | **Post London** (Fee market is not implemented yet, but the rollup supports EIP-1559 transaction types) |
