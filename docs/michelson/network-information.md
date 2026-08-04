---
title: Network information (Michelson)
---

This page contains information for connecting to the public Etherlink<!--TX--> networks via the Michelson interface.
For using the networks via the EVM interface, see [EVM network information](/evm/get-started/network-information).

For current and historical status information for Etherlink<!--TX-->, see https://status.etherlink.com.

:::note

There is currently no public Michelson endpoint for Mainnet or Shadownet Testnet;
you must [run your own EVM node](/network/evm-nodes) to serve [Michelson RPCs](/michelson/developing/rpc-reference).
:::

## Etherlink<!--TX--> Mainnet

| Network parameter | Value |
|---|---|
| Network identifier | TODO |
| Endpoint | `<your-evm-node-url>/tezlink` ([run your own node](/network/evm-nodes)) |
| Indexer | TODO |
| Bridge | TODO (instead [bridge to EVM](/evm/bridging)) |

## Etherlink<!--TX--> Shadownet Testnet

| Network parameter | Value |
|---|---|
| Network identifier | TODO |
| Endpoint | `<your-evm-node-url>/tezlink` ([run your own node](/network/evm-nodes)) |
| Indexer | TODO |
| Faucet | TODO (instead [get EVM test tokens](/evm/get-started/getting-testnet-tokens)) |
| Bridge | TODO (instead [bridge to EVM](/evm/bridging))|

## Etherlink<!--TX--> Previewnet Testnet

See [Previewnet](/testing/previewnet) page.

## Quick connectivity check:

``` bash
curl -s <ENDPOINT>/chains/main/chain_id
```
