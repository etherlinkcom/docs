---
title: Bridging tokens between Etherlink and other EVM networks
---

Etherlink allows you to bridge tokens to it from other EVM networks by creating wrapped versions of tokens.
Bridging tokens from other EVM networks is supported only on Etherlink Mainnet, not on Etherlink Testnet.
Some of the tokens you can bridge in this way include ETH, WETH, WAVAX, USDC, USDT, WBTC, and SHIB.

For information about the major tokens that are available on Etherlink, see [Tokens](./tokens).
For more information about wrapped tokens in general, see [Wrapped tokens](https://docs.tezos.com/architecture/tokens#wrapped-tokens) on docs.tezos.com.

The bridge is available at https://www.etherlinkbridge.com/bridge.

## Using the wrapped asset bridge

Follow these general steps to bridge tokens between Etherlink and other EVM networks:

1. Go to the Etherlink wrapped asset bridge at https://www.etherlinkbridge.com/bridge.
1. At the top of the page, click the **Connect** button and connect your EVM wallet.
1. Select the source and target networks.
1. Select the token to transfer.
1. Specify the amount of tokens to transfer.
1. Optional: At the bottom of the page, specify the transaction fee and slippage tolerance.
1. Optional: In the **Gas on destination** field, specify the amount of additional XTZ to buy on the destination network for use later.
1. To execute the transfer transaction, click **Transfer**.

The transaction can take up to 5 minutes depending on the networks.

## How bridging wrapped assets works

The Etherlink wrapped asset bridge uses a [wrapped asset bridge](https://github.com/LayerZero-Labs/wrapped-asset-bridge) created by [LayerZero](https://layerzero.network/).
It works by maintaining pools on each side of the bridge.

When you bridge tokens, it locks the tokens on the source network, sends a message over LayerZero's software to the target network, and unlocks wrapped tokens on the target network.

For more information, see the repository for the bridge: https://github.com/LayerZero-Labs/wrapped-asset-bridge.
