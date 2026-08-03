---
title: Native Atomic Composability
---

# Native Atomic Composability

Etherlink<!--TX--> supports **native atomic composability** (NAC): a smart contract in one interface can call a contract in the other interface within a single, atomic transaction. If any part of the call chain fails, all effects — across both interfaces — are reverted.

## Gateways

Each interface exposes a **gateway**: a special contract that serves as the single entry point for cross-interface calls. From a smart contract's perspective, a cross-interface call is just a call to a well-known local address — no special language features or compiler extensions are needed.

- In the EVM interface, the gateway is a **precompile** callable at a fixed address like any other contract.
- In the Michelson interface, the gateway is an **enshrined contract** at a fixed KT1 address.

Gateways are the only interface between runtimes. Everything else — account semantics, gas models, token standards — remains interface-specific.

## How a cross-interface call works

1. The calling contract sends a request to its interface's gateway, specifying a target contract address and a payload.
2. The gateway forwards the payload to the target runtime.
3. If this is the caller's first interaction with the target runtime, the target runtime creates an alias for the caller (see [Accounts and Aliases](./accounts-and-aliases.md)).
4. The target runtime executes an internal transaction using the caller's alias as the sender.
5. The result is returned to the gateway, which passes it back to the calling contract.

The alias mechanism ensures that each interface only ever deals with its own native account types. No runtime needs to understand foreign address formats.

## Atomicity

Cross-interface calls are **atomic**: if the callee reverts, the revert is handled according to the calling semantics of the caller interface:

- In the EVM interface, the caller can choose to also revert (propagating the failure) or catch the error and continue (isolating the failure): callers can catch failures using low-level `call` and inspect the return status.
- In the Michelson interface, failures are always propagated: there is no try/catch mechanism in Michelson, so a failure in an internal operation reverts the entire operation group. In particular, if a NAC fails, the entire Michelson execution context that contains it fails.

If the Michelson runtime reverts (regardless if it was triggered by a NAC from EVM or not), all nested cross-interface calls it triggered are also rolled back, including any calls (or calls back) into the EVM interface.

## Re-entrancy

Cross-interface calls support re-entrancy. When interface A calls interface B, interface B may itself trigger a cross-interface call back into interface A. The alias mechanism preserves correct identity at every nesting level: the callback appears as a call from interface B's alias, not the original caller.

## Resources

Each runtime manages its own gas model. When a cross-interface call is made, the caller converts its remaining gas into an equivalent budget for the callee using a conversion coefficient derived from performance benchmarks. Unconsumed gas is converted back to the caller's model when the callee returns.

See [Resources](./resources.md) for the conversion rules between the EVM and Michelson interfaces.

## Observability

Each cross-interface call emits an event from the gateway before execution, containing an identifier that can be used to correlate calls across the two runtimes. This allows indexers to reconstruct the full call graph from the per-interface blocks.
