---
title: NAC Usage
---

# NAC Usage: Michelson to EVM

Cross-interface calls go through the gateway contract of the caller's interface.
This page describes how to initiate a cross-interface call from the Michelson interface.
For the opposite way, see [EVM to Michelson](/evm/nac-usage).

The Michelson-to-EVM gateway is an enshrined contract deployed at:

```
KT18oDJJKXMKhfE1bSuAPGp92pYcwVDiqsPw
```

## `call_evm`

Call an EVM contract by providing the same parameters as the EVM-to-Michelson gateway: the destination address, entrypoint selector, and ABI-encoded data.
Additionally, it accepts as an optional parameter a callback, which takes the form of a Michelson contract address. This accommodates the specifics of Michelson, in which contract calls do not return a value.

## `staticcall_evm`

To call a read-only EVM function and receive the result, use the `staticcall_evm` on-chain view:

| Parameter | Type | Description |
|---|---|---|
| `destination` | `string` | The EVM contract address (hex string, e.g. `"0x…"`) |
| `calldata` | `bytes` | Full ABI calldata: 4-byte function selector followed by ABI-encoded arguments |

This view performs a read-only crossing — no value transfer, no state mutation — and returns the ABI-encoded response as `bytes`. It is invoked with the Michelson `VIEW` instruction, which yields an `option bytes`:

```michelson
VIEW "staticcall_evm"
     (pair string bytes)  (* input type *)
     bytes                (* return type *)
```

Because `VIEW` returns `option`, the caller must handle the `None` case with `IF_NONE`. The kernel maps outcomes as follows:

| EVM response | Michelson result |
|---|---|
| Success (2xx) | `Some bytes` — ABI-encoded return value |
| Revert / bad request (4xx) | `None` |
| Out of gas (429) | Operation fails with out-of-gas |
| Error (5xx) | Operation fails |

Unlike `%call_evm`, which accepts a method signature string and computes the 4-byte Keccak256 selector internally, `staticcall_evm` requires the caller to supply the complete calldata — selector and ABI-encoded arguments already concatenated.

```michelson
PUSH string "0x…";           (* destination *)
PUSH bytes 0x…;              (* selector ++ ABI-encoded args *)
PAIR;
VIEW "staticcall_evm" bytes;
IF_NONE
  { FAIL }   (* revert or bad destination *)
  { … }      (* use the returned bytes *)
```

## ERC-20 wrapper

For calling ERC-20 token contracts specifically, a convenience contract is available at:

```
KT18oDJJKXMKhfE1bSuAPGp92pYcwVKvCChb
```

This contract provides `approve` and `transfer` methods with a Michelson-friendly interface.

## Return value

Return values from cross-interface calls are encoded in the callee's native format:

The EVM return value (ABI-encoded bytes) is passed back to a **callback contract** specified via the `with_result` entrypoint of the gateway contract. The callback contract must implement handling for the raw bytes.

On-chain libraries for encoding and decoding across runtimes are provided to simplify this.
