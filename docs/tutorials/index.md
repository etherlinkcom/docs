---
title: Tutorials
---

# Tutorials

Hands-on walkthroughs that take you from "what is Etherlink<!--TX-->?" to working code on the Previewnet.

Every tutorial is written so you can copy-paste, run, and verify the result in an explorer. They assume you've already skimmed the [Overview](../overview/index.md) and have a wallet ready (MetaMask for the EVM interface, Temple for the Michelson interface — see [Wallet support](../michelson/wallet-support.md)).

## Available tutorials

- **[Cross-interface counter](./nac-counter.md)** — Build a counter whose state lives on the Michelson interface but is incremented and decremented from a Solidity contract on the EVM interface. The whole call chain runs in a single atomic transaction. Good first contact with **Native Atomic Composability**: you'll see a real `callMichelson` go through the gateway, follow the result in both block explorers, and trigger an atomic revert to confirm the failure semantics.

More tutorials are on the way — check back, or open an issue at [gitlab.com/tezos/xdocs](https://gitlab.com/tezos/xdocs/-/issues) if there's a specific scenario you'd like covered.

For live, hosted demos and example dApps, see the [Previewnet dashboard](https://previewnet.tezosx.nomadic-labs.com/) — it lists the showcase apps currently running on the network (Potluck, xDex, …).
