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
