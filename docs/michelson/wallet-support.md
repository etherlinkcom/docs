---
title: Wallet Support
---

# Wallet Support

Any Tezos-compatible wallet that supports custom RPC endpoints can be used with the Michelson Interface on Etherlink<!--TX-->.

## Compatible wallets

| Wallet | Notes |
|---|---|
| **Temple** | Browser extension; supports custom networks |
| **Umami** | *Desktop* wallet; supports custom networks |

## Connecting to Etherlink<!--TX-->

1. Open your wallet's network settings.
2. Add a custom network using a Michelson RPC endpoint from [Michelson network information](/michelson/network-information) (or the [Previewnet](/testing/previewnet) endpoint for testing).
3. Switch to the custom network.

Your tz address and balance will be shown as usual. Transactions are signed and submitted the same way as on Tezos Layer 1.

## Note on aliases

Your tz address has a corresponding alias address on the EVM Interface.
Tez received by that alias is forwarded automatically to your Michelson Interface balance, see [accounts and aliases](/overview/accounts-and-aliases).
