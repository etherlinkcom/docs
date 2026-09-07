---
title: NAC Usage

---

# NAC Usage: EVM to Michelson

Cross-interface calls go through the gateway contract of the caller's interface.
This page describes how to initiate a cross-interface call from the EVM interface.
For the opposite way, see [Michelson to EVM](/michelson/nac-usage).

The EVM-to-Michelson gateway is a precompile deployed at:

```
0xff00000000000000000000000000000000000007
```

## `callMichelson`

Call a Michelson contract by providing:

| Parameter | Type | Description |
|---|---|---|
| `destination` | string | The Michelson contract address (`KT1…` base58check) |
| `entrypoint` | string | The target entrypoint name |
| `data` | bytes | Michelson-encoded parameters |

A Michelson `KT1…` address is 22 bytes in base58check form and does not fit into a 20-byte EVM `address` type. The gateway therefore takes the destination as a string and parses it on the Michelson side.

```solidity
interface INativeAtomicGateway {
    function callMichelson(
        string calldata destination,
        string calldata entrypoint,
        bytes calldata data
    ) external payable;
}

INativeAtomicGateway gateway = INativeAtomicGateway(
    0xff00000000000000000000000000000000000007
);
gateway.callMichelson("KT1…", "default", michelsonParams);
```

The `data` parameter must be encoded in Michelson binary format. For simple types you can construct the payload inline: for example, passing a `nat` with value 42 encodes as `hex"002a"` (tag `0x00` = integer, value `0x2a` = 42). Worked Solidity examples using this pattern are available in the [`solidity_examples/` directory](https://gitlab.com/tezos/tezos/-/tree/master/etherlink/kernel_latest/solidity_examples) of the Etherlink sources. For complex types, off-line tools such as Taquito's `packData` function can compute the encoding.

## Return value

In the case of a regular Michelson call (`callMichelson`), there is no return value.

## `callMichelsonView`

To call a read-only Michelson view and receive the result, use `callMichelsonView`:

| Parameter | Type | Description |
|---|---|---|
| `destination` | string | The Michelson contract address (`KT1…` base58check) |
| `viewName` | string | The name of the on-chain view |
| `input` | bytes | Micheline-encoded input to the view |

This entry point performs a read-only crossing (no value transfer, no state mutation) and must be invoked via `staticcall`. The gateway returns the view's Micheline response ABI-encoded as `bytes`.

```solidity
interface INativeAtomicGateway {
    function callMichelsonView(
        string calldata destination,
        string calldata viewName,
        bytes calldata input
    ) external view returns (bytes memory);
}

INativeAtomicGateway gateway = INativeAtomicGateway(
    0xff00000000000000000000000000000000000007
);
bytes memory michelineResult = gateway.callMichelsonView(
    "KT1…",    // destination
    "myView",  // view name
    hex"030b"  // Micheline Unit — adjust to match the view's input type
);
```

A complete worked example (using the low-level `staticcall` pattern) is available in [`crac_michelson_view_staticcall.sol`](https://gitlab.com/tezos/tezos/-/blob/master/etherlink/kernel_latest/solidity_examples/crac_michelson_view_staticcall.sol).

## Address translation

Cross-interface calls run under the caller's alias (see [Accounts and Aliases](/overview/accounts-and-aliases)). The gateway exposes two `view` functions to translate between native addresses and aliases. Both take the address as a `string` in its printable form (`0x…` hex for the EVM interface, base58check for the Michelson interface) rather than as a Solidity `address`, and identify interfaces by a runtime id: `0` for the Michelson interface, `1` for the EVM interface.

```solidity
interface INativeAtomicGateway {
    function originOf(
        string calldata addr,
        uint8 sourceRuntime
    ) external view returns (uint8 kind, uint8 homeRuntime, string memory nativeAddress);

    function resolveAddress(
        string calldata addr,
        uint8 sourceRuntime,
        uint8 targetRuntime
    ) external view returns (bool classified, uint8 res, string memory translated);

    error InvalidRuntimeId(uint8 received);
}
```

### `originOf`

`originOf(addr, sourceRuntime)` returns how the address `addr` of the interface `sourceRuntime` is classified:

| `kind` | Meaning | `homeRuntime` | `nativeAddress` |
|---|---|---|---|
| `0` (Unknown) | The address is malformed or has not been seen by the kernel yet | `0` | `""` |
| `1` (Native) | An account native to `sourceRuntime` | `sourceRuntime` | `addr` |
| `2` (Alias) | The alias of an account native to the other interface | The interface the account is native to | The native address of that account |

The kernel records the origin of an account when it is first used: Michelson user accounts (`tz1…`, `tz2…`, `tz3…`) are always Native, Michelson smart contracts are recorded at origination, EVM accounts when they first sign a transaction or when they have code, and aliases when a cross-interface call creates them. In particular, an EVM address that has only received funds is Unknown.

For example, to check whether the caller is a Michelson account:

```solidity
(uint8 kind, , string memory native) = gateway.originOf(
    Strings.toHexString(msg.sender),  // OpenZeppelin helper: lowercase "0x…" string
    1
);
if (kind == 2) {
    // msg.sender is the alias of the Michelson account `native` (tz1… or KT1…)
}
```

### `resolveAddress`

`resolveAddress(addr, sourceRuntime, targetRuntime)` translates the address `addr` of the interface `sourceRuntime` into the corresponding address of the interface `targetRuntime`:

- If `addr` is malformed or Unknown, `classified` is `false` and the other values are zero.
- If `addr` is Native, `translated` is its alias in `targetRuntime`.
- If `addr` is an Alias, `translated` is the native address it stands for, rather than an alias of the alias.

`res` is `0` (Recorded) when the returned address already exists on chain and `1` (Derived) when it was computed with the derivation formula but no cross-interface call has created the alias yet. When `sourceRuntime` and `targetRuntime` are equal, a well-formed address is returned unchanged with `res == 0`.

```solidity
(bool classified, uint8 res, string memory evmAlias) = gateway.resolveAddress(
    "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb", 0, 1
);
// classified == true; evmAlias is the "0x…" EVM alias of the Tezos account;
// res == 1 until a cross-interface call creates the alias
```

## Failure behavior

### `callMichelson`

If the Michelson callee fails for any reason — `FAILWITH`, type mismatch, non-existent contract, or forwarded gas exhaustion — the gateway precompile reverts the calling EVM transaction. There is no way to distinguish a Michelson-side revert from a Michelson-side out-of-gas at the Solidity level; both surface as an EVM revert with an error string of the form `"Cross-runtime call failed with status 4xx: <reason>"`.

Because `callMichelson` is declared `external payable` (no return value), the revert propagates unconditionally to the EVM caller. To catch it without reverting your own transaction, call the precompile via a low-level `call`:

```solidity
(bool success, ) = address(gateway).call{value: ...}(
    abi.encodeWithSelector(
        INativeAtomicGateway.callMichelson.selector,
        destination, entrypoint, data
    )
);
// success == false if Michelson reverted
```

### `callMichelsonView`

`callMichelsonView` follows the same failure model. Any of the following causes a revert that propagates to the EVM caller:

| Cause | EVM outcome |
|---|---|
| Michelson view fails (`FAILWITH`, etc.) | Revert |
| View name does not exist on the contract | Revert |
| Type mismatch on input | Revert |
| Forwarded gas exhausted in the Michelson view | Revert (not out-of-gas — catchable) |

Because `callMichelsonView` must be invoked via `staticcall`, catch failures with low-level `staticcall`:

```solidity
(bool success, bytes memory result) = address(gateway).staticcall(
    abi.encodeWithSelector(
        INativeAtomicGateway.callMichelsonView.selector,
        destination, viewName, input
    )
);
// success == false if the Michelson view reverted or was not found
```

### `originOf` and `resolveAddress`

Malformed addresses never revert: they are reported as Unknown (`kind == 0`) or unclassified (`classified == false`). Both functions revert with the custom error `InvalidRuntimeId(uint8)` when a runtime id is neither `0` nor `1`.

### Infrastructure failures

A 5xx response from the Michelson runtime indicates a kernel-internal error (storage I/O failure, host fault). This is treated as a block-level abort rather than a catchable revert, meaning the entire block is rolled back. These failures are not caused by contract logic and are not catchable by EVM code.
