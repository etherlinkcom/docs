---
title: Data indexers
---

Etherlink has public block explorers that use indexers to provide information about Etherlink:

- Etherlink Mainnet: https://explorer.etherlink.com
- Etherlink Testnet: https://testnet.explorer.etherlink.com/

If you need custom information about your contracts or information formatted in a specific way, you may need to run a custom indexer.
Several Etherlink-compatible indexers are listed below.

For more information about indexers on Tezos, see [Indexers](https://docs.tezos.com/developing/information/indexers) on docs.tezos.com.

## The Graph

[The Graph](https://thegraph.com/) is an indexing protocol for organizing blockchain data and making it easily accessible with GraphQL. Etherlink dApps can use GraphQL to query open APIs called subgraphs, to retrieve data that is indexed on the network.

For information on indexing contracts with The Graph, see [Indexing Etherlink contracts with TheGraph](/building-on-etherlink/indexing-graph).

## Subsquid

[Subsquid](https://subsquid.io/) is a peer-to-peer network to quickly batch, query and aggregate on-chain and off-chain data.

Learn how to use their SDK with this [guide](https://docs.subsquid.io/sdk/how-to-start/).

## DipDup

[DipDup](https://dipdup.io) provides a framework for creating custom indexers.

For information on indexing Etherlink with DipDup, see [Etherlink](https://dipdup.io/docs/supported-networks/etherlink) in the DipDup documentation.

## Subquery

[Subquery indexer](https://www.subquery.network/indexer) is an open-source indexer that supports Etherlink, along with many other networks.

For examples of using Subquery with Etherlink, see these sample projects:

- Mainnet: https://github.com/subquery/ethereum-subql-starter/tree/main/Etherlink%20Mainnet/etherlink-mainnet-etherlink-starter
- Testnet: https://github.com/subquery/ethereum-subql-starter/tree/main/Etherlink/etherlink-testnet-starter

## Goldsky

[Goldsky](https://goldsky.com/) makes it easy to access real-time Web3 data with little maintenance.
It provides these services:

- [Subgraphs](https://docs.goldsky.com/subgraphs/introduction) let you intelligently extract Etherlink onchain data with ease - handling reorgs, RPC provider failures, and other complexities on your behalf.
- [Mirror](https://docs.goldsky.com/mirror/introduction) lets you replicate Subgraph data or chain-level streams directly to a data store of your choosing for highly flexible usage in your front-end or back-end.

See the Goldsky documentation at https://docs.goldsky.com.
