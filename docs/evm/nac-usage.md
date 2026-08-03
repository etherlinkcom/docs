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

The `data` parameter must be encoded in Michelson binary format. On-chain encoding libraries are available to help construct these payloads from within Solidity contracts.

## FA1.2 wrapper

For calling FA1.2 token contracts specifically, a convenience precompile is available at:

```
0xff00000000000000000000000000000000ffff09
```

This precompile provides `approve` and `transfer` methods that handle Michelson parameter encoding automatically, without requiring manual binary encoding.


## Return value

In the case of a regular Michelson call, there is no return value.

In case of a call to a Michelson view, the Michelson return value is ABI-encoded as bytes and returned to the calling Solidity contract. 

For non-effectful calls (read-only views), use the `call_view` entry point on the Michelson gateway.

On-chain libraries for encoding and decoding across runtimes are provided to simplify this.
