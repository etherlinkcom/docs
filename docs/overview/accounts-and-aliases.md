---
title: Accounts and Aliases
---

# Accounts and Aliases

## Accounts

Every account in Etherlink<!--TX--> is **native to exactly one interface**: either the EVM interface or the Michelson interface. An interface fully owns its accounts: it defines their behaviour, manages their state, and controls how they interact with each other.

This means:
- An EVM account (native to the EVM<!--TEVM--> interface), be it an externally owned account or smart contract, behaves exactly as it would on any other EVM-compatible chain.
- A Tezos account (native to the Michelson interface) behaves exactly as it would on Tezos Layer 1.

Each interface's tooling, wallets, and indexers work without modification within the boundaries of their native interface because the underlying account semantics are unchanged.

## Aliases

Because accounts are interface-native, a Tezos account cannot directly hold an EVM balance, and vice versa. To bridge this gap, Etherlink<!--TX--> introduces **aliases**: every native account is automatically assigned a corresponding address in each of the other interfaces.

An alias is a regular address in the foreign interface — it can hold tokens, receive calls, and appear in blocks like any other account in that interface.
However, even though an alias can technically hold any kind of tokens, including ERC-20 tokens, FA2 tokens, and native tez tokens, the current implementation forwards the latter (any tez tokens it receives) to the corresponding native address in the other interface via the gateway, as described below.

The mapping from a native address to its alias is deterministic and can be computed off-chain, as explained below.

### EVM alias of a Tezos account

When a Tezos account interacts with the EVM runtime for the first time, an EVM alias address is created for it. The alias is implemented using **EIP-7702 delegation**: a shared `AliasForwarder` contract is deployed at the alias address and stores the native Tezos address. Any tez received by the EVM alias is automatically forwarded back to the native Tezos account via the gateway.

The EVM alias address is computed as the **first 20 bytes of the Keccak256 hash of the base58check-encoded Tezos address** (the human-readable string form, e.g. `tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb`):

```
evm_alias = keccak256(utf8(tz_address_base58check))[0:20]
```

### Michelson alias of an EVM account

When an EVM account interacts with the Michelson runtime for the first time, a Michelson alias is created as a **KT1 smart contract**. This contract automatically forwards any tez it receives back to the native EVM account via the gateway.

The KT1 alias address is computed by applying **BLAKE2b with a 20-byte output** to the raw 20-byte binary of the EVM address, then encoding the result as a KT1 contract hash:

```
kt1_alias = KT1(blake2b_160(evm_address_bytes))
```

Michelson's `SOURCE` instruction returns the null address (`tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU`) for operations originating from cross-interface calls — not the actual alias address. This is because Michelson requires the source to be a user account.

## Tez precision across interfaces

The two interfaces use different precision for tez:

| Interface | Unit | Decimals | Example |
|---|---|---|---|
| Michelson | mutez | 6 | 1 tez = 1,000,000 mutez |
| EVM | wei (of tez) | 18 | 1 tez = 10¹⁸ wei |

When transferring tez between interfaces, amounts are scaled by a factor of **10¹²**. A transfer of `n` mutez from the Michelson interface corresponds to `n × 10¹²` wei in the EVM interface. Values that are not a multiple of 10¹² cannot be represented precisely in mutez and will be truncated.

## Wallets and tooling

A user who owns both a Tezos address and an EVM address effectively controls assets that may be spread across up to four addresses (the two native addresses and their respective aliases). Wallets and indexers that aggregate information from both interfaces can present a unified view of a user's balances.
