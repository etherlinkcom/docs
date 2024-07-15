---
title: Tokens
---

## Token addresses

These are some of the tokens that are available on Etherlink.
Click the address to go to the block explorer page for the token:

<table class="token_address_table">
<thead>
  <th>Name</th>
  <th>Symbol</th>
  <th>Mainnet address</th>
  <th>Ghostnet address</th>
</thead>
<tbody>
<tr>
  <td>Wrapped XTZ (see <a href="#wxtz">WXTZ</a> below)</td>
  <td>WXTZ</td>
  <td><a href="https://explorer.etherlink.com/token/0xc9B53AB2679f573e480d01e0f49e2B5CFB7a3EAb" target="_blank">0xc9B53AB2679f573e480d01e0f49e2B5CFB7a3EAb</a></td>
  <td><a href="https://testnet-explorer.etherlink.com/address/0xB1Ea698633d57705e93b0E40c1077d46CD6A51d8" target="_blank">0xB1Ea698633d57705e93b0E40c1077d46CD6A51d8</a></td>
</tr>
<tr>
  <td>Etherlink USD</td>
  <td>eUSD</td>
  <td>Coming soon</td>
  <td><a href="https://testnet-explorer.etherlink.com/address/0x1A71f491fb0Ef77F13F8f6d2a927dd4C969ECe4f" target="_blank">0x1A71f491fb0Ef77F13F8f6d2a927dd4C969ECe4f</a></td>
</tr>
<tr>
  <td>Tether USD</td>
  <td> USDT</td>
  <td>Coming soon</td>
  <td><a href="https://testnet-explorer.etherlink.com/address/0xD21B917D2f4a4a8E3D12892160BFFd8f4cd72d4F" target="_blank">0xD21B917D2f4a4a8E3D12892160BFFd8f4cd72d4F</a></td>
</tr>
<tr>
  <td>USD Coin</td>
  <td>USDC</td>
  <td>Coming soon</td>
  <td><a href="https://testnet-explorer.etherlink.com/address/0xa7c9092A5D2C3663B7C5F714dbA806d02d62B58a" target="_blank">0xa7c9092A5D2C3663B7C5F714dbA806d02d62B58a</a></td>
</tr>
<tr>
  <td>Wrapped ETH</td>
  <td>WETH</td>
  <td>Coming soon</td>
  <td><a href="https://testnet-explorer.etherlink.com/address/0x8DEF68408Bc96553003094180E5C90d9fe5b88C1" target="_blank">0x8DEF68408Bc96553003094180E5C90d9fe5b88C1</a></td>
</tr>
<tr>
  <td>Tezos BTC</td>
  <td>tzBTC</td>
  <td>Coming soon</td>
  <td><a href="https://testnet-explorer.etherlink.com/address/0x6bDE94725379334b469449f4CF49bCfc85ebFb27" target="_blank">0x6bDE94725379334b469449f4CF49bCfc85ebFb27</a></td>
</tr>
</tbody>
</table>

## WXTZ

WXTZ is a token created to replicate the functionality of Wrapped Ether (WETH), but specifically for the Tez (XTZ) native token on Etherlink.
The goal of WXTZ is to facilitate the use of XTZ in various decentralized applications (dApps) and protocols that require ERC-20-like tokens.

If you want to have more details, go check our [repo](https://github.com/etherlinkcom/token-deployments/tree/main).

### Wrapping & Unwrapping

The token follows the `WETH9` interface for compatibility:

- **Wrapping XTZ**: The `deposit()` method can be called with XTZ attached to the message to wrap XTZ for WXTZ
- **Unwrapping XTZ**: The `withdraw(wad)` method can be called to unwrap `wad` WXTZ for XTZ

:::note

The original `WETH9` contract developed with solc version `0.4.x` also supports `fallback()`, but WXTZ does not.
Supporting this hook would cause function signatures that do not match the contract's to act as if they are supported and successfully executed.

:::

### Bridging with LayerZero OFT

WXTZ implements the [Omnichain Fungible Token (OFT)](https://docs.layerzero.network/v2/developers/evm/oft/quickstart) standard from LayerZero.
This standard allows WXTZ to be bridged in a secure and capital-efficient way across different chains through direct minting and burning of the supply.

Here are the chains the token is deployed on:

<table class="token_address_table">
<thead>
  <th>Chain</th>
  <th>Mainnet address</th>
</thead>
<tbody>
<tr>
  <td>Etherlink</td>
  <td><a href="https://explorer.etherlink.com/address/0xc9B53AB2679f573e480d01e0f49e2B5CFB7a3EAb" target="_blank">0xc9B53AB2679f573e480d01e0f49e2B5CFB7a3EAb</a></td>
</tr>
<tr>
  <td>Ethereum</td>
  <td><a href="https://etherscan.io/address/0xc9b53ab2679f573e480d01e0f49e2b5cfb7a3eab" target="_blank">0xc9B53AB2679f573e480d01e0f49e2B5CFB7a3EAb</a></td>
</tr>
<tr>
  <td>Base</td>
  <td><a href="https://basescan.org/address/0x91f9cc2649ac70a071602cade9b0c1a5868af51d" target="_blank">0x91F9cc2649ac70a071602cadE9b0C1A5868af51D</a></td>
</tr>
<tr>
  <td>Binance Smart Chain</td>
  <td><a href="https://bscscan.com/address/0x91F9cc2649ac70a071602cadE9b0C1A5868af51D" target="_blank">0x91F9cc2649ac70a071602cadE9b0C1A5868af51D</a></td>
</tr>
<tr>
  <td>Arbitrum One</td>
  <td><a href="https://arbiscan.io/address/0x7424f00845777a06e21f0bd8873f814a8a814b2d" target="_blank">0x7424f00845777A06E21F0bd8873f814A8A814B2D</a></td>
</tr>
</tbody>
</table>

:::note

The bridging system is not available yet. You can still use the WXTZ on Etherlink as a classic wrapper.

:::

### Gasless approval with ERC20Permit

The token also implements the [ERC20Permit](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20#ERC20Permit) standard from Openzeppelin.
This standard allows users to approve token transfers via gasless signatures instead of on-chain transactions.

This feature leverages the [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612) standard to facilitate off-chain authorization for token transfers.

### Audit & Security

The contract was audited by [Omniscia.io](https://omniscia.io/).
The final report is here: https://omniscia.io/reports/etherlink-cross-chain-token-665c8ac479e20900180f383b

WXTZ supports OFT to simplify cross-chain compatibility.
However, if the OFT bridge gets compromised, all the XTZ in the contract on Etherlink could be stolen by a malicious attacker with these steps:

1. Create and deploy a fake WXTZ contract on another EVM chain
1. Mint a maximum amount of WXTZ on the other chain
1. Connect to the contract on Etherlink using `setPeer()`
1. Transfer the WXTZ to Etherlink
1. Withdraw the XTZ locked in the WXTZ contract on Etherlink

The Etherlink team has taken measures to protect users native to Etherlink and bridged across EVM chains.

These are the measures to protect Etherlink users:

- We overrode the `_credit` method used by LayerZero to bridge tokens between chains.
- We added a condition checking that the receiving amount of WXTZ can't exceed the amount of XTZ stored in the contract.
The result is that **only the WXTZ supply bridged** using the LayerZero protocol should be at risk, and not the local WXTZ on Etherlink.
If an attacker succeeds in hacking the bridge, they will only be able to transfer the difference between the amount of XTZ stored in the contract and the local total supply of WXTZ on Etherlink.
In this way, all Etherlink users who own their WXTZ locally will still have their WXTZ backed 1:1 by XTZ in the contract.

To protect bridged users, the Etherlink team overrode the `setPeer()` method that connects and disconnects WXTZ contracts on different chains.
By adding a 2 day timelock to the `setPeer()` method, there is a 2 day delay between initially creating a connection and the connection being executed.
If a hacker takes ownership of the contracts and starts connecting or disconnecting, bridged users will have 2 days to bridge back all their funds on Etherlink and withdraw their XTZ.
