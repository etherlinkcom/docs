---
title: Resources Management
---

# Resources Management

Etherlink<!--TX--> accounts for the following resources consumed by smart contracts, according to the [fee structure](./fee-structure.md): execution time, storage, and inclusion in L1 blocks.

Inclusion fees are the same in all Etherlink<!--TX--> interfaces, because they are related to the cost of publishing data to L1.

For execution and storage resources, Etherlink<!--TX--> preserves each interface's existing resource model. Cross-interface calls bridge these models at gateway boundaries using a **conversion coefficient** `c`, derived from performance benchmarks that measure the relative execution capacity of each interface.

Note that the gas cost of the different instructions in the Michelson runtime may differ with regard to their cost in Tezos L1.

## Gas conversion

Both the EVM and Michelson runtimes use gas to measure execution time, but they operate at different magnitudes. The coefficient `c` converts between them:

- To convert EVM gas to Michelson gas: multiply by `c`
- To convert Michelson gas to EVM gas: multiply by `1/c`

The `base_fee_per_gas` of the Michelson interface is also defined relative to the EVM interface's base fee using this coefficient, ensuring costs are consistent across interfaces.

## EVM interface calling the Michelson interface

When an EVM contract calls the Michelson gateway:

1. **Setting limits.** The EVM contract's remaining gas is converted to a Michelson gas limit using `c`. The Michelson storage limit is set to a generous upper bound (storage allocation in the Michelson interface is converted to gas when going back to the EVM interface).
2. **On failure.** The error is returned to the EVM caller, along with the remaining gas. The EVM caller can catch the failure and continue.
3. **On success.** The Michelson storage cost is expressed as additional EVM gas units: `g_storage = storage_cost / base_fee_per_gas`. The remaining EVM gas is converted from the remaining Michelson gas minus `g_storage`. If the resulting gas is negative, the call reverts with an out-of-gas error.

In the end, storage allocation in the Michelson runtime is accounted as gas in the EVM runtime, which preserves its semantics.

## Michelson interface calling the EVM interface

When a Michelson contract calls the EVM gateway:

1. **Setting limits.** The Michelson contract's remaining gas is converted to an EVM gas limit using `1/c`.
2. **On failure.** Michelson semantics apply: the entire operation group reverts, including any prior state changes.
3. **On success.** The remaining EVM gas (which includes storage allocation) is converted back to Michelson gas using `c`. Execution continues in the Michelson runtime.

## Simulation

Etherlink<!--TX--> simulates transactions to estimate resource limits (storage and gas) for the top-level operation. Cross-interface calls may take different execution paths at runtime, so simulated limits may need a margin to account for variability. Simulation tools add extra gas automatically where possible.
