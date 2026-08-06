---
title: RPC reference
---

# RPC reference

EVM nodes<!--TXN--> provide the same RPCs as Tezos L1 nodes on their Michelson endpoint.
The Michelson endpoint is served at the `/tezlink` sub-path of the node's base RPC URL.
For example, a node running on the default port exposes the Michelson interface at `http://localhost:8545/tezlink`.
For public endpoint URLs, see [Michelson network information](/michelson/network-information).

Refer to the [RPC reference](https://octez.tezos.com/docs/active/rpc.html) in the Octez documentation (also available as [a set of OpenAPI descriptions](https://octez.tezos.com/docs/api/openapi.html)).

:::warning

Some Tezos RPCs have no handler on Etherlink<!--TX--> and will return an error; others are registered but behave differently due to the different context (no delegation, no baking, no voting).

:::

## Not applicable

The following L1 RPCs do not make sense in Etherlink<!--TX--> so they don't have a handler in Etherlink<!--TX-->  and will always return an error if called:

- **Delegation** — `GET /context/contracts/<addr>/delegate` and related staking/frozen-balance RPCs.
- **Baking and endorsing rights** — `GET /helpers/baking_rights`, `GET /helpers/endorsing_rights`.
- **Voting and governance** — all `/context/votes/*` RPCs.
- **Mempool operations** — `GET /chains/<chain>/mempool/pending_operations` and related.
- **Block and protocol injection** — `POST /injection/block`, `POST /injection/protocol`.

## Not implemented

The following L1 RPCs have no handler for the moment in Etherlink<!--TX-->  and return an error when called:

- **Tickets** — `GET /context/contracts/<addr>/ticket_balance`, `all_ticket_balances`.
- **Script execution** — `POST /helpers/scripts/run_code`, `POST /helpers/scripts/trace_code`, `POST /helpers/scripts/run_script_view`.

## Differences from L1

The following L1 RPCs exhibit different behavior in Etherlink<!--TX-->, either temporarily (because not fully implemented) or permanently (because the context is different):

| RPC | Difference |
|---|---|
| `GET /context/contracts/<addr>/counter` | Returns `0` for unallocated implicit accounts; Etherlink has no global counter. ([#7960](https://gitlab.com/tezos/tezos/-/issues/7960)) |
| `POST /helpers/scripts/simulate_operation` | Partial implementation; full simulation is not yet supported. ([#7965](https://gitlab.com/tezos/tezos/-/issues/7965)) |
| `POST /injection/operation` | The `async=true` parameter is not yet honored; the node always waits for validation before returning. ([#8007](https://gitlab.com/tezos/tezos/-/issues/8007)) |
| `GET /version` | Returns a stub value with an empty commit hash and date. |
| `GET /context/issuance/expected_issuance` | Returns dummy zero rewards; Etherlink has no token issuance. |
| `POST /helpers/scripts/pack_data` | Uses a throwaway dummy context instead of the live chain state; results may differ for gas-sensitive encodings. |
| `GET /context/constants` | Several constants differ from mainnet: `minimal_block_delay` = 1 s; `hard_gas_limit_per_operation` = 660,000 gas (≈ 30 M EVM gas ÷ 22); `cost_per_byte` = 1 mutez. |
