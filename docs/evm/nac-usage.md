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

## FA1.2 wrapper

For calling FA1.2 token contracts specifically, a convenience precompile is available at:

```
0xff00000000000000000000000000000000ffff09
```

This precompile provides `approve` and `transfer` methods that handle Michelson parameter encoding automatically, without requiring manual binary encoding.


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

### Infrastructure failures

A 5xx response from the Michelson runtime indicates a kernel-internal error (storage I/O failure, host fault). This is treated as a block-level abort rather than a catchable revert, meaning the entire block is rolled back. These failures are not caused by contract logic and are not catchable by EVM code.
