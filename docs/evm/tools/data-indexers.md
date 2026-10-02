---
title: Data indexers
---

Etherlink<!--TX--> has public block explorers that use indexers to provide information about the current chain state and its history.

For the Etherlink EVM<!--TEVM-->, you may use these explorers:

- Etherlink<!--TX--> Mainnet: https://explorer.etherlink.com
- Etherlink<!--TX--> Shadownet Testnet: https://shadownet.explorer.etherlink.com/

For the [Michelson interface](/michelson) of Etherlink<!--TX-->, you may use these block explorers and indexers providing the same explorer and API that Tezos developers use on Tezos layer 1:

- Etherlink<!--TX--> Mainnet: https://etherlink.tzkt.io/ (API: https://api.etherlink.tzkt.io/)
- Etherlink<!--TX--> Shadownet Testnet: https://shadownet.etherlink.tzkt.io/ (API: https://api.shadownet.etherlink.tzkt.io/)

[TzKT](https://tzkt.io/), developed by Baking Bad, is the main indexer and explorer for Tezos.
For documentation about the TzKT API, see https://api.tzkt.io/.

For more information about indexers on Tezos, see [Indexers](https://docs.tezos.com/developing/information/indexers) on docs.tezos.com.

## External Etherlink EVM<!--TEVM-->-compatible indexers

If you need custom information about your contracts or information formatted in a specific way, you may need to run a custom indexer.
Several Etherlink EVM<!--TEVM-->-compatible indexers are listed below.

### The Graph

[The Graph](https://thegraph.com/) is an indexing protocol for organizing blockchain data and making it easily accessible with GraphQL. Etherlink EVM<!--TEVM--> dApps can use GraphQL to query open APIs called subgraphs, to retrieve data that is indexed on the network.

For information on indexing contracts with The Graph, see [Indexing Etherlink EVM<!--TEVM--> contracts with TheGraph](/evm/developing/indexing-graph).

### Envio

[Envio](https://envio.dev/?utm_source=etherlink&utm_medium=partner-docs) is the data layer for blockchain apps. It gives Etherlink EVM<!--TEVM--> developers the fastest, most flexible way to get real-time and historical onchain data, from a single GraphQL API to raw high-speed access, with managed hosting on Envio Cloud. Envio supports Etherlink EVM<!--TEVM--> through HyperSync, its data engine that serves as the default data source and syncs historical data up to 2000x faster than traditional RPC.

You can auto-generate an indexer from any [verified contract](https://explorer.etherlink.com/verified-contracts), write event handlers in TypeScript, JavaScript, or ReScript, and deploy on Envio Cloud or self-host.
Indexing still works on non-verified contracts if you supply the ABI in the config yourself.

For information on indexing contracts with Envio, see [Indexing Etherlink EVM<!--TEVM--> contracts with Envio](/evm/developing/indexing-envio).

For more information, see the [Envio documentation](https://docs.envio.dev/?utm_source=etherlink&utm_medium=partner-docs) and the [HyperIndex quickstart](https://docs.envio.dev/docs/HyperIndex/quickstart?utm_source=etherlink&utm_medium=partner-docs).
See also Envio's [performance benchmarks](https://docs.envio.dev/docs/HyperIndex/benchmarking?utm_source=etherlink&utm_medium=partner-docs).

### Subsquid

[Subsquid](https://subsquid.io/) is a peer-to-peer network to quickly batch, query and aggregate on-chain and off-chain data.

Learn how to use their SDK with this [guide](https://docs.subsquid.io/sdk/how-to-start/).

### DipDup

[DipDup](https://dipdup.io) provides a framework for creating custom indexers.

For information on indexing Etherlink EVM<!--TEVM--> with DipDup, see [Etherlink](https://dipdup.io/docs/supported-networks/etherlink) in the DipDup documentation.

### Subquery

[Subquery indexer](https://www.subquery.network/indexer) is an open-source indexer that supports Etherlink EVM<!--TEVM-->, along with many other networks.

For examples of using Subquery with Etherlink EVM<!--TEVM-->, see these sample projects:

- Mainnet: https://github.com/subquery/ethereum-subql-starter/tree/main/Etherlink%20Mainnet/etherlink-mainnet-etherlink-starter

### Goldsky

[Goldsky](https://goldsky.com/) makes it easy to access real-time Web3 data with little maintenance.
It provides these services:

- [Subgraphs](https://docs.goldsky.com/subgraphs/introduction) let you intelligently extract Etherlink EVM<!--TEVM--> onchain data with ease - handling reorgs, RPC provider failures, and other complexities on your behalf.
- [Mirror](https://docs.goldsky.com/mirror/introduction) lets you replicate Subgraph data or chain-level streams directly to a data store of your choosing for highly flexible usage in your front-end or back-end.

See the Goldsky documentation at https://docs.goldsky.com.
