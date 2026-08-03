---
title: Previewnet test network
---

Previewnet is a temporary public test network made available before the Etherlink kernel upgrade 7.
It allows builders and integrators to experiment with both the EVM and Michelson interfaces and with cross-interface interactions ahead of Mainnet.

## Resources

The previewnet repository contains network parameters, configuration, and up-to-date endpoint information:

👉 [https://github.com/trilitech/tezos-x-previewnet](https://github.com/trilitech/tezos-x-previewnet)

## Connecting

The previewnet exposes two RPC endpoints — one per interface:

- **EVM Interface RPC** — compatible with Ethereum JSON-RPC. Connect using MetaMask, ethers.js, viem, or any Ethereum toolchain by pointing to this endpoint.
- **Michelson Interface RPC** — compatible with the Tezos RPC standard. Connect using Octez, Temple wallet, Taquito, or any Tezos toolchain by pointing to this endpoint.

See the previewnet repository for the current endpoint URLs.

## Getting tez

A faucet is available from the previewnet explorer linked in the repository. Tez obtained on the testnet has no real-world value.

## Block explorer

The previewnet ships with an explorer covering both interfaces. The explorer aggregates information from both the EVM and Michelson interface blocks and can display cross-interface call graphs.

## First demo testnet

Before previewnet has been put in place, the following demo testnet for the Etherlink<!--TX--> MVP was used:

| Service | URL |
|---------|-----|
| EVM RPC | `https://demo.txpark.nomadic-labs.com/rpc` |
| Tezos (Michelson) RPC | `https://demo.txpark.nomadic-labs.com/rpc/tezlink` |
| Block explorer / Faucet | `https://demo.txpark.nomadic-labs.com/` |

### Bootstrap accounts

The following accounts are pre-funded on the demo testnet.

#### EVM Interface

| Private key | Address |
|-------------|---------|
| `0x9722f6cc9ff938e63f8ccb74c3daa6b45837e5c5e3835ac08c44c50ab5f39dc0` | `0x6ce4d79d4E77402e1ef3417Fdda433aA744C6e1c` |
| `0x3a6a6ca30c1ef1ce605a63a7a1a4ff4c689f8414ca0838bca29423f0ec280ff5` | `0xB53dc01974176E5dFf2298C5a94343c2585E3c54` |
| `0x0eb9bfa77d6cd145cdc0e3d6f902ee1464aeb5f62b02e38f111c9b60cd3adab5` | `0x9b49c988b5817Be31DfB00F7a5a4671772dCce2B` |

#### Michelson Interface

| Private key | Public key | Alias |
|-------------|------------|-------|
| `edsk3gUfUPyBSfrS9CCgmCiQsTCHGkviBDusMxDJstFtojtc1zcpsh` | `edpkuBknW28nW72KG6RoHtYW7p12T6GKc7nAbwYX5m8Wd9sDVC9yav` | bootstrap1 |
| `edsk39qAm1fiMjgmPkw1EgQYkMzkJezLNewd7PLNHTkr6w9XA2zdfo` | `edpktzNbDAUjUk697W7gYg2CRuBQjyPxbEg8dLccYYwKSKvkPvjtV9` | bootstrap2 |
| `edsk4ArLQgBTLWG5FJmnGnT689VKoqhXwmDPBuGx3z4cvwU9MmrPZZ` | `edpkuTXkJDGcFd5nh6VvMz8phXxU3Bi7h6hqgywNFi1vZTfQNnS1RV` | bootstrap3 |
| `edsk2uqQB9AY4FvioK2YMdfmyMrer5R8mGFyuaLLFfSRo8EoyNdht3` | `edpkuFrRoDSEbJYgxRtLx2ps82UdaYc1WwfS9sE11yhauZt5DgCHbU` | bootstrap4 |
| `edsk4QLrcijEffxV31gGdN2HU7UpyJjA8drFoNcmnB28n89YjPNRFm` | `edpkv8EUUH68jmo3f7Um5PezmfGrRF24gnfLpH3sVNwJnV5bVCxL2n` | bootstrap5 |

**Example:**

```json
curl -s -X POST \
  -H "Content-Type: application/json" \
  --data '{
    "jsonrpc": "2.0",
    "method": "eth_getBlockByNumber",
    "params": ["latest", true],
    "id": 1
  }' https://demo.txpark.nomadic-labs.com/rpc | jq '.result.number'
```
