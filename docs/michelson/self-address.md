---
title: Self-address test
---

# `SENDER == SELF_ADDRESS` is externally inducible

On Etherlink<!--TX-->, an external party can make a contract observe its immediate caller as its own address on a bare value transfer. A Michelson contract can be made to see `SENDER == SELF_ADDRESS`, and an EVM contract can be made to see `msg.sender == address(this)`, without any cooperation from the target: by sending tez to the contract's EVM alias, or Michelson alias, respectively.

This is a consequence of the alias forwarding design, not a contract bug. Any authorization that trusts caller-equals-self as an internal only signal must not be relied upon on Etherlink<!--TX-->.

## What this means for developers

When developing smart contracts, keep in mind the following:

- Do not use `SENDER == SELF_ADDRESS` in Michelson, or `msg.sender == address(this)` in Solidity, as a trusted internal only or authorization signal on the default entrypoint or the value receiving fallback.
- A contract correct on Tezos L1 that gates a privileged default entrypoint action on caller-equals-self is silently reachable by any external party on Etherlink<!--TX-->. Move such gates to a named entrypoint or to an explicit authorization check on a recorded controller.
- The originator identity is unaffected: `SOURCE` in Michelson and `tx.origin` in Solidity still reflect the external party that initiated the transfer, so guards keyed on the originator remain meaningful.
