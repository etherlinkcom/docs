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

## `%call_evm`

Call an EVM contract by invoking the `%call_evm` entrypoint on the gateway with the following parameters:

| Parameter | Michelson type | Description |
|---|---|---|
| `destination` | `string` | EVM contract address (hex string, e.g. `"0x…"`) |
| `method_signature` | `string` | ABI function signature, e.g. `"transfer(address,uint256)"` |
| `abi_params` | `bytes` | ABI-encoded arguments, **without** the 4-byte selector |
| `callback` | `option (contract bytes)` | Optional contract to receive the return value; `None` for fire-and-forget |

The full Michelson entrypoint type is:

```
%call_evm :
  pair string
       (pair string
            (pair bytes
                 (option (contract bytes))))
```

The gateway computes the 4-byte Keccak256 selector from `method_signature` and prepends it to `abi_params` before dispatching the call. Supply only the encoded arguments in `abi_params` — not the selector.

### SmartPy example — ERC-20 `transfer`

The following contract calls `transfer(address,uint256)` on any ERC-20 deployed on the EVM interface. The ABI encoding for the two-argument case is straightforward: each argument occupies a 32-byte slot, left-padded with zeros.

For EVM token addresses on Mainnet, see the [token address table](/evm/developing/tokens#token-addresses) (for example, WXTZ is at `0xc9B53AB2679f573e480d01e0f49e2B5CFB7a3EAb`).

```python
import smartpy as sp

@sp.module
def main():
    # Michelson-to-EVM gateway (enshrined contract, same address on all networks).
    GATEWAY = sp.address("KT18oDJJKXMKhfE1bSuAPGp92pYcwVDiqsPw")

    # Michelson type of the gateway's %call_evm entrypoint.
    t_call_evm: type = sp.record(
        destination = sp.string,  # destination
        method_signature = sp.string,  # method_signature
        abi_params = sp.bytes,         # abi_params (no selector)
        callback = sp.option[sp.contract[sp.bytes]] # callback
    )

    class Erc20Caller(sp.Contract):
        """
        Calls transfer(address,uint256) on an EVM ERC-20 contract.

        `abi_params` layout (64 bytes total, no selector):
          bytes  0-11 : zero-padding for the address slot
          bytes 12-31 : 20-byte EVM recipient address
          bytes 32-63 : 32-byte big-endian token amount
        """

        @sp.entrypoint
        def transfer_erc20(
            self,
            erc20: sp.string,    # ERC-20 contract address, e.g. "0xc9B5…EAb"
            recipient: sp.bytes, # 20-byte EVM recipient address (no 0x prefix, raw bytes)
            amount: sp.bytes     # 32-byte big-endian amount
        ):
            # ABI-encode (address, uint256): left-pad address to 32 bytes.
            addr_padding = sp.bytes("0x000000000000000000000000")  # 12 zero bytes
            abi_parms = sp.concat([addr_padding, recipient, amount])

            gateway = sp.contract(
                t_call_evm,
                GATEWAY,
                "call_evm"
            ).unwrap_some(error="gateway not found")

            sp.transfer(
                sp.record(destination=erc20,
                          method_signature="transfer(address,uint256)",
                          abi_params=abi_parms,
                          callback=None),
                sp.mutez(0),
                gateway
            )

@sp.add_test()
def test():
    sc = sp.test_scenario("Erc20Caller", main)
    c = main.Erc20Caller()
    sc += c
    # Transfer 1 WXTZ (1e18 = 0xDE0B6B3A7640000) to a placeholder address.
    # recipient: 20 bytes
    recipient = sp.bytes("0x1234567890123456789012345678901234567890")
    # amount: 1e18 as 32-byte big-endian
    amount = sp.bytes(
        "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000"
    )
    c.transfer_erc20(
        erc20="0xc9B53AB2679f573e480d01e0f49e2B5CFB7a3EAb",  # WXTZ Mainnet
        recipient=recipient,
        amount=amount
    )
```

## `staticcall_evm`

To call a read-only EVM function and receive the result, use the `staticcall_evm` on-chain view:

| Parameter | Type | Description |
|---|---|---|
| `destination` | `string` | The EVM contract address (hex string, e.g. `"0x…"`) |
| `calldata` | `bytes` | Full ABI calldata: 4-byte function selector followed by ABI-encoded arguments |

This view performs a read-only crossing — no value transfer, no state mutation — and returns the ABI-encoded response as `bytes`. It is invoked with the Michelson `VIEW` instruction, which yields an `option bytes`:

```michelson
VIEW "staticcall_evm" bytes
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
PUSH address "KT18oDJJKXMKhfE1bSuAPGp92pYcwVDiqsPw";  (* the gateway *)
PUSH bytes 0x…;              (* selector ++ ABI-encoded args *)
PUSH string "0x…";           (* destination *)
PAIR;                        (* pair string bytes *)
VIEW "staticcall_evm" bytes;
IF_NONE
  { FAIL }   (* revert or bad destination *)
  { … }      (* use the returned bytes *)
```

## Address translation

Cross-interface calls run under the caller's alias (see [Accounts and Aliases](/overview/accounts-and-aliases)). The gateway exposes two on-chain views to translate between native addresses and aliases. Both take the address as a `string` in its printable form (base58check for the Michelson interface, `0x…` hex for the EVM interface) rather than as a Michelson `address`, and identify interfaces by a `nat` runtime id: `0` for the Michelson interface, `1` for the EVM interface. Michelson has no instruction to convert an `address` to a `string`, so the address to translate must already be available as a `string`, for example as a parameter.

| View | Parameter type | Return type |
|---|---|---|
| `originOf` | `pair string nat` (address, source runtime) | `or unit (or nat (pair nat string))` |
| `resolveAddress` | `pair string (pair nat nat)` (address, source runtime, target runtime) | `option (pair nat string)` |

### `originOf`

`originOf` returns how the address is classified in the source interface:

| Result | Meaning |
|---|---|
| `Left Unit` | Unknown: the address is malformed or has not been seen by the kernel yet |
| `Right (Left n)` | Native: an account native to the source interface (`n` is the source runtime id) |
| `Right (Right (Pair n addr))` | Alias: the alias of the account `addr`, native to the interface `n` |

The kernel records the origin of an account when it is first used: user accounts (`tz1…`, `tz2…`, `tz3…`) are always Native, smart contracts are recorded at origination, EVM accounts when they first sign a transaction or when they have code, and aliases when a cross-interface call creates them. In particular, an EVM address that has only received funds is Unknown.

### `resolveAddress`

`resolveAddress` translates the address from the source interface into the corresponding address of the target interface:

| Result | Meaning |
|---|---|
| `None` | The address is malformed or Unknown in the source interface |
| `Some (Pair 0 addr)` | Recorded: `addr` already exists on chain |
| `Some (Pair 1 addr)` | Derived: `addr` was computed with the derivation formula, but no cross-interface call has created the alias yet |

For a Native address, `addr` is its alias in the target interface. For an Alias, `addr` is the native address it stands for, rather than an alias of the alias. When the source and target runtimes are equal, a well-formed address is returned unchanged as Recorded.

```michelson
PUSH address "KT18oDJJKXMKhfE1bSuAPGp92pYcwVDiqsPw";  (* the gateway *)
PUSH nat 0;                  (* target runtime: Michelson *)
PUSH nat 1;                  (* source runtime: EVM *)
PAIR;
PUSH string "0x1234567890abcdef1234567890abcdef12345678";
PAIR;                        (* pair string (pair nat nat) *)
VIEW "resolveAddress" (option (pair nat string));
IF_NONE
  { FAIL }     (* view not found *)
  { IF_NONE
      { … }    (* unknown address *)
      { … } }  (* Pair 0 "KT1CYcsqu3TnW3aA2hYL62ZCtcA484yCG4Zq" if the alias exists, Pair 1 … otherwise *)
```

## Return value

### `%call_evm` — callback

`%call_evm` is a state-mutating call with no direct return. To receive the EVM return value, supply a `contract bytes` handle in the `callback` field. After the EVM call succeeds, the kernel emits a `TRANSFER_TOKENS` internal operation that sends the raw ABI-encoded return bytes to the callback contract at zero mutez.

The callback contract must expose an entrypoint of type `bytes`. The entrypoint name is encoded in the `contract bytes` handle itself — you choose it when you construct the handle with `sp.contract`:

```python
callback = sp.Some(
    sp.contract(sp.bytes, sp.self_address, "receive_result")
        .unwrap_some(error="self-entrypoint not found")
)
```

If `callback` is `None`, the EVM return value is silently discarded. The call still reverts the whole operation group on EVM failure — passing `None` does not make the call "best-effort".

#### SmartPy example — call with callback

```python
import smartpy as sp

@sp.module
def main():
    GATEWAY = sp.address("KT18oDJJKXMKhfE1bSuAPGp92pYcwVDiqsPw")

    t_call_evm: type = sp.record(
        destination = sp.string,
        method_signature = sp.string,
        abi_params = sp.bytes,
        callback = sp.option[sp.contract[sp.bytes]]
    )

    class CallWithResult(sp.Contract):
        def __init__(self):
            self.data.last_result = sp.bytes("0x")

        @sp.entrypoint
        def call_evm_with_result(
            self,
            destination: sp.string,
            method_signature: sp.string,
            abi_params: sp.bytes,
        ):
            gateway = sp.contract(
                t_call_evm,
                GATEWAY,
                "call_evm"
            ).unwrap_some(error="gateway not found")

            callback = sp.Some(
                sp.contract(sp.bytes, sp.self_address, "receive_result")
                    .unwrap_some(error="self-entrypoint not found")
            )

            sp.transfer(
                sp.record(
                    destination=destination,
                    method_signature=method_signature,
                    abi_params=abi_params,
                    callback=callback,
                ),
                sp.mutez(0),
                gateway,
            )

        @sp.entrypoint
        def receive_result(self, result: sp.bytes):
            # `result` is the raw ABI-encoded return value from the EVM call.
            # Decode it according to the EVM function's return type.
            self.data.last_result = result

@sp.add_test()
def test():
    sc = sp.test_scenario("CallWithResult", main)
    c = main.CallWithResult()
    sc += c

    # Test receive_result directly: simulate the kernel delivering a callback.
    # The result is a 32-byte ABI-encoded uint256 (value = 42).
    encoded_uint256 = sp.bytes(
        "0x000000000000000000000000000000000000000000000000000000000000002a"
    )
    c.receive_result(encoded_uint256)
    sc.verify(c.data.last_result == encoded_uint256)

    # Call call_evm_with_result: reads balanceOf(address) on a token contract.
    # abi_params: 12-byte zero-pad + 20-byte address (no selector).
    addr_padding = sp.bytes("0x000000000000000000000000")
    addr_bytes   = sp.bytes("0x1234567890123456789012345678901234567890")
    c.call_evm_with_result(
        destination="0xc9B53AB2679f573e480d01e0f49e2B5CFB7a3EAb",  # WXTZ Mainnet
        method_signature="balanceOf(address)",
        abi_params=sp.concat([addr_padding, addr_bytes]),
    )
```

### `staticcall_evm` — synchronous

`staticcall_evm` is a read-only view. The return value is delivered synchronously as `option bytes` via the Michelson `VIEW` instruction — no callback contract is needed.

## Failure behavior

### `%call_evm`

If the EVM callee fails for any reason — revert, out of gas, or any other halt — Michelson semantics apply: **the entire operation group reverts**, including all state changes that preceded the call. This holds whether or not a callback was supplied.

If `callback` is `None` and the EVM call *succeeds*, the return value is silently dropped and execution continues normally. No error is raised.

For the gas conversion rules and how the forwarded budget is calculated, see [Resources management](/overview/resources.md#michelson-interface-calling-the-evm-interface).

### `staticcall_evm`

A view failure (EVM revert, missing view, type mismatch) surfaces as `None` from `VIEW`, which the caller handles with `IF_NONE`. Out-of-gas is the exception: it fails the operation outright rather than returning `None`, so a forwarded-gas exhaustion cannot be silently treated as a missing view. See the outcome table in the [`staticcall_evm`](#staticcall_evm) section above.

### `originOf` and `resolveAddress`

Malformed addresses never fail: they are reported as Unknown (`Left Unit`) or `None`. Both views fail the operation with `(Pair "INVALID_RUNTIME_ID" n)` when a runtime id `n` is neither `0` nor `1`.
