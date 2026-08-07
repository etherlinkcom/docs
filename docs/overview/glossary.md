---
title: Glossary
---

# Glossary

This glossary defines the most essential terms used in Etherlink<!--TX-->.
For a wider set of terms used in the Tezos ecosystem, see the [Glossary](https://docs.tezos.com/overview/glossary) in the Tezos documentation.
These glossaries are planned to be fused in the near term.

**Account** — An entity that can hold state and/or execute operations within one interface. Every account has an address and exists natively in exactly one interface.

**Account state** — The data associated with an account (balance, storage, nonce, etc.), maintained by its native interface.

**Address** — An identifier for an account within a specific interface.

**Alias** — An address in a foreign interface that represents a native account from another interface. Aliases are created automatically on first interaction and forward tez received back to the native account.

**Baker** - A user holding enough tez to participate in the Tezos L1 consensus PoS protocol, by staking some tez and contributing to block validation and creation. Bakers also can cast votes in the on-chain governance. They can also increase their weight in consensus and governance by allowing other users to delegate or stake with them.

**Blueprint** — A signed batch of operations produced by the sequencer, covering all interfaces, published to the Tezos Layer 1 rollup inbox.

**Etherlink<!--TX--> kernel** — The orchestration layer (smart rollup kernel) that contains and coordinates all runtimes.

**Etherlink<!--TX--> block** — A block produced by applying a blueprint, representing the combined effects of all runtimes at a given level.

**EVM runtime** — The runtime that implements the EVM interface, processing Ethereum-compatible transactions and executing code using the EVM. Exposes an Ethereum JSON-RPC endpoint.

**Externally owned account (EOA)** — An account controlled by a private key (as opposed to a smart contract).

**Foreign interface** — From an account's perspective, any interface other than its native interface.

**Gateway contract** — A special contract in each interface that acts as the single entry point for cross-interface calls. In the EVM interface, the gateway is a precompile; in the Michelson interface, it is an enshrined KT1 contract.

**Michelson** is the native smart contract language on Tezos L1.
Michelson smart contracts can also run on Etherlink<!--TX--> thanks to its Michelson runtime.

**Michelson entrypoints** are the callable endpoints in Michelson contracts.
They take parameters and may change the contract storage, but do not return a value.
Instead, they can emit new operations such as contract callbacks, that are executed after the entrypoint exits.

**Michelson runtime** — The runtime that implements the Michelson interface, processing Tezos-compatible operations and executing code using the Michelson VM. Exposes a Tezos RPC endpoint.

**Mutez** is a sub-unit of the native tez token, counting for one millionth of tez.

**NAC** — Short for _native atomic composability_. The feature of Etherlink<!--TX--> that enables a smart contract in one interface to call a contract in another interface within a single atomic transaction. Individual operations across interfaces are referred to as _cross-interface calls_.

**Native interface** — From an account's perspective, the interface where its account state and cryptographic material reside.

**Origination** is the operation used to deploy a Michelson smart contract.

**Revert isolation** — A cross-interface call failure handling strategy where the caller catches the failure and continues, preserving its own state changes.

**Revert propagation** — A cross-interface call failure handling strategy where the caller also reverts after observing a callee failure.

**Runtime** — An environment that executes code and maintains account state. Etherlink<!--TX--> currently includes the EVM runtime and the Michelson runtime.

**Sequencer** — The node responsible for ordering operations and producing blueprints. Elected by Tezos Layer 1 bakers.

**Smart contract** — An account controlled by code rather than a private key.
