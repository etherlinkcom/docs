---
title: Ethereum endpoint support
hide_table_of_contents: true
---

Etherlink nodes use [Geth](https://geth.ethereum.org/) to provide access to both standard Ethereum RPC endpoints and Geth-specific RPC endpoints.
These tables list these endpoints and whether Etherlink supports them:

## Standard Ethereum endpoints

For information about these endpoints, see [JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc) and the [Ethereum JSON-RPC Specification](https://ethereum.github.io/execution-apis/api-documentation/) in the Ethereum documentation.

<table class="customTableContainer fullWidthTable">
  <thead>
    <tr>
      <th>Endpoint</th>
      <th>Supported</th>
      <th class="absorbingColumn">Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`debug_getBadBlocks`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`debug_getRawBlock`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`debug_getRawHeader`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`debug_getRawReceipts`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`debug_getRawTransaction`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`debug_traceBlockByNumber`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`engine_exchangeCapabilities`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`engine_exchangeTransitionConfigurationV1`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`engine_forkchoiceUpdatedV1`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`engine_forkchoiceUpdatedV2`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`engine_forkchoiceUpdatedV3`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`engine_getPayloadBodiesByHashV1`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`engine_getPayloadBodiesByHashV2`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`engine_getPayloadBodiesByRangeV1`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`engine_getPayloadBodiesByRangeV2`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`engine_getPayloadV1`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`engine_getPayloadV2`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`engine_getPayloadV3`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`engine_getPayloadV4`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`engine_newPayloadV1`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`engine_newPayloadV2`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`engine_newPayloadV3`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`engine_newPayloadV4`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_accounts`</td>
      <td>Yes</td>
      <td>This endpoint always returns an empty list because the Etherlink EVM node does not manage any addresses</td>
    </tr>
    <tr>
      <td>`eth_blobBaseFee`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_blockNumber`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_call`</td>
      <td>Yes</td>
      <td>Etherlink nodes use the standard Ethereum version of the `eth_call` endpoint instead of the Geth version; see [Sending transactions](/building-on-etherlink/transactions)</td>
    </tr>
    <tr>
      <td>`eth_chainId`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_coinbase`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_createAccessList`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_estimateGas`</td>
      <td>Yes</td>
      <td>See [Sending transactions](/building-on-etherlink/transactions)</td>
    </tr>
    <tr>
      <td>`eth_feeHistory`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_gasPrice`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getBalance`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getBlockByHash`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getBlockByNumber`</td>
      <td>Yes</td>
      <td>Note that Etherlink uses a nonstandard way of computing block hashes, so you cannot use the header information from the `eth_getBlockByNumber` endpoint to compute the block hash.</td>
    </tr>
    <tr>
      <td>`eth_getBlockReceipts`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getBlockTransactionCountByHash`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getBlockTransactionCountByNumber`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getCode`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getFilterChanges`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getFilterLogs`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getLogs`</td>
      <td>Yes</td>
      <td>See [Getting event logs](/building-on-etherlink/transactions#getting-event-logs)</td>
    </tr>
    <tr>
      <td>`eth_getProof`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getStorageAt`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getTransactionByBlockHashAndIndex`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getTransactionByBlockNumberAndIndex`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getTransactionByHash`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getTransactionCount`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getTransactionReceipt`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getUncleByBlockHashAndIndex`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getUncleByBlockNumberAndIndex`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getUncleCountByBlockHash`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_getUncleCountByBlockNumber`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_hashrate`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_maxPriorityFeePerGas`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_mining`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_newBlockFilter`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_newFilter`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_newPendingTransactionFilter`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_protocolVersion`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_sendRawTransaction`</td>
      <td>Yes</td>
      <td>See [Sending transactions](/building-on-etherlink/transactions)</td>
    </tr>
    <tr>
      <td>`eth_sendTransaction`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_sign`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_signTransaction`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_subscribe`</td>
      <td>Experimental</td>
      <td>See <a href="/building-on-etherlink/websockets">Getting updates with WebSockets</a></td>
    </tr>
    <tr>
      <td>`eth_syncing`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_uninstallFilter`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`net_listening`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`net_peerCount`</td>
      <td>No</td>
      <td></td>
    </tr>
    <tr>
      <td>`net_version`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`web3_clientVersion`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`web3_sha3`</td>
      <td>Yes</td>
      <td></td>
    </tr>
  </tbody>
</table>

## Geth-specific endpoints

This table shows the Geth endpoints that Etherlink nodes support.
All other Geth endpoints are not supported.
For information about these endpoints, see the Geth documentation at https://geth.ethereum.org/docs.

<table class="customTableContainer fullWidthTable">
  <thead>
    <tr>
      <th>Endpoint</th>
      <th>Supported</th>
      <th class="absorbingColumn">Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`debug_traceCall`</td>
      <td>Partially</td>
      <td>Supports only callTracer and structLogger, not custom call tracers</td>
    </tr>
    <tr>
      <td>`debug_traceTransaction`</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>`eth_call`</td>
      <td>No</td>
      <td>Etherlink nodes use the standard Ethereum version of the `eth_call` endpoint instead of the Geth version; see [Sending transactions](/building-on-etherlink/transactions)</td>
    </tr>
    <tr>
      <td>`txpool_content`</td>
      <td>Partially</td>
      <td>Returns the transaction pool on Testnet but always returns an empty pool on Mainnet</td>
    </tr>
  </tbody>
</table>

## ethers.js SDK methods

The Etherlink EVM node supports these [ethers.js](https://docs.ethers.org/v6/) methods:

<table class="customTableContainer fullWidthTable">
  <thead>
    <tr>
      <th>Method</th>
      <th>Supported</th>
      <th class="absorbingColumn">Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>[`provider.getBlock`](https://docs.ethers.org/v6/api/providers/#Provider-getBlock)</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>[`provider.getTransactionReceipt`](https://docs.ethers.org/v6/api/providers/#Provider-getTransactionReceipt) </td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>[`provider.getBlockNumber`](https://docs.ethers.org/v6/api/providers/#Provider-getBlockNumber)</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>[`provider.getBalance`](https://docs.ethers.org/v6/api/providers/#Provider-getBalance)</td>
      <td>Yes</td>
      <td></td>
    </tr>
    <tr>
      <td>[`signer.sendTransaction`](https://docs.ethers.org/v6/api/providers/#Signer-sendTransaction)</td>
      <td>Yes</td>
      <td></td>
    </tr>
  </tbody>
</table>

For examples of using these ethers.js methods, see [Using ethers.js](/building-on-etherlink/information).

## Additional information

<table class="customTableContainer fullWidthTable">
  <thead>
    <tr>
      <th></th>
      <th class="absorbingColumn">Comments</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>EVM version</td>
      <td><code>Cancun</code></td>
    </tr>
    <tr>
      <td>Whitelisting Fireblocks IP addresses</td>
      <td>Not Supported</td>
    </tr>
    <tr>
      <td>Native Token Decimals</td>
      <td>18</td>
    </tr>
    <tr>
      <td>Fee Structure</td>
      <td>**Post London** (Fee market is not implemented yet, but the rollup supports EIP-1559 transaction types); see <a href="/network/fees">Fee structure</a></td>
    </tr>
  </tbody>
</table>