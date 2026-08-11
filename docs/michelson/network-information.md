---
title: Network information (Michelson)
---

This page contains information for connecting to the public Etherlink<!--TX--> networks via the Michelson interface.
For using the networks via the EVM interface, see [EVM network information](/evm/get-started/network-information).

:::caution[In progress]
This page is under construction, the concrete endpoints are being worked out.
Come back soon!
:::

For current and historical status information for Etherlink<!--TX-->, see https://status.etherlink.com.

:::note

Instead of the public Michelson endpoints below serving [Michelson RPCs](/michelson/developing/rpc-reference) for Mainnet or Shadownet,
you may also [run your own EVM node](/network/evm-nodes), to get rid of any possible rate limitation.
In that case, the URL of your endpoint is `<your-evm-node-url>/michelson`.

:::

## Etherlink<!--TX--> Mainnet

| Network parameter | Value |
|---|---|
| Network identifier | TODO |
| Endpoint | michelson.etherlink.mainnet.octez.io |
| Indexer | TODO |
| Bridge | TODO (instead [bridge to EVM](/evm/bridging)) |

## Etherlink<!--TX--> Shadownet Testnet

| Network parameter | Value |
|---|---|
| Network identifier | TODO |
| Endpoint | michelson.etherlink.shadownet.octez.io |
| Indexer | TODO |
| Faucet | TODO (instead [get EVM test tokens](/evm/get-started/getting-testnet-tokens)) |
| Bridge | TODO (instead [bridge to EVM](/evm/bridging))|

## Etherlink<!--TX--> Previewnet Testnet

See [Previewnet](/testing/previewnet) page.

## Quick connectivity check:

``` bash
curl -s <ENDPOINT>/chains/main/chain_id
```
