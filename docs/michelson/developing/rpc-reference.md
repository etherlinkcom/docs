---
title: RPC reference
---

# RPC reference

### RPC reference

EVM nodes<!--TXN--> provide the same RPCs as Tezos L1 nodes on their Michelson endpoint.
The Michelson endpoint is served at the `/tezlink` sub-path of the node's base RPC URL.
For example, a node running on the default port exposes the Michelson interface at `http://localhost:8545/tezlink`.
For public endpoint URLs, see [Michelson network information](/michelson/network-information).

Refer to the [RPC reference](https://octez.tezos.com/docs/active/rpc.html) in the Octez documentation (also available as [a set of OpenAPI descriptions](https://octez.tezos.com/docs/api/openapi.html)).

:::warning

Note however that some of these RPCs are handled differently on Etherlink<!--TX-->, due to the different context (e.g. no delegation possible), or are not implemented yet. The complete list of the differences will be compiled here.

:::
