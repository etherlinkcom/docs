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
        callback = sp.option[sp.bytes] # callback
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

## Return value

For `%call_evm`, return values from the EVM callee are delivered to a **callback contract** supplied in the `callback` field. The callback receives the raw ABI-encoded return bytes. Pass `None` when no return value is needed.

For `staticcall_evm`, the return value is delivered synchronously as `option bytes` via the Michelson `VIEW` instruction — no callback is needed.

## Failure behavior

When a Michelson contract calls `%call_evm` and the EVM callee fails (revert, out of gas, or any other halt), Michelson semantics apply: **the entire operation group reverts**, including any state changes that preceded the call. There is no way to catch the failure and continue within the same operation.

For gas conversion between the two interfaces and the precise accounting rules, see [Resources management](/overview/resources.md#michelson-interface-calling-the-evm-interface).
