---
title: Estimating fees
---

import GasPriceWarning from '@site/docs/conrefs/gas-price-warning.md';

The Etherlink gas price (and therefore the fee for a given transaction) varies based on the activity on the chain.
As activity increases, fees increase, and vice versa.

As described in [Fee structure](/network/fees), Etherlink fees include the cost of running the transaction and writing the transaction to layer 1 but not a voluntary tip.

:::tip

You can use libraries such as [ethers.js](https://docs.ethers.org/v6/) to estimate transaction fees.
For an example, see [Sending transactions](/building-on-etherlink/transactions).

:::

Etherlink supports the standard EVM `eth_gasPrice` endpoint to provide the current gas price, as in this example:

```bash
curl --request POST \
     --url https://node.ghostnet.etherlink.com \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_gasPrice"
}
'
```

It returns the gas price plus a safety margin as a hexadecimal number, as in this example:

```json
{"jsonrpc": "2.0", "result": "0x3b9aca00", "id": 1}
```

In this response, the hex number `0x3b9aca00` corresponds to the decimal number 1,000,000,000.
The gas price is given in units that are equivalent to wei on Ethereum, or 1<sup>-18</sup> XTZ, which means that the current gas price is 1<sup>-9</sup> XTZ, or 0.000000001 XTZ (equivalent to 1 gwei in Ethereum terms).
This gas price is the cost per unit of computation required by a transaction.

<GasPriceWarning />

To calculate the fee estimate for a given transaction, you can send the transaction to the `eth_estimateGas` endpoint to obtain the estimated gas usage for the the transaction (as in this example), and then calculate the total expected gas fee:

```bash
curl --request POST \
     --url https://node.ghostnet.etherlink.com \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_estimateGas",
  "params": [
    {
      "to": "0x46899d4FA5Ba90E3ef3B7aE8aae053C662c1Ca1d",
      "gas": "0x0",
      "gasPrice": "0x3b9aca00",
      "value": "0xde0b6b3a7640000",
      "data": "0x"
    }
  ]
}
'
```

The response is the estimated gas units consumed by the transaction in hexadecimal format, as in this example:

```json
{
  "jsonrpc": "2.0",
  "result": "0x98496",
  "id": 1
}
```

In this case, the estimated gas usage for the transaction is 623766 gas units.
To get the total fee, multiply the gas price by this gas usage estimate.
If the gas price is 1 gwei, the total fee estimate is 1<sup>-9</sup> x 623766, or 0.000623766 XTZ.
This fee includes all fees described in [Fee structure](/network/fees), but you can set a higher amount for the transaction's gas consumption as a safety margin (sometimes known as setting the gas limit) to ensure that if the transaction requires more gas, it can use it.

You can also set a maximum base gas price for the transaction when submitting the transaction to increase the chances that it will be included in a block.
