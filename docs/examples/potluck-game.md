---
title: Potluck game
---

# Potluck game

**Source**: [`github.com/trilitech/tezos-x-potluck-game`](https://github.com/trilitech/tezos-x-potluck-game)

Potluck is a last-depositor-wins game running across both Etherlink<!--TX--> interfaces. Players deposit a fixed amount of a token on the EVM side. Each new deposit replaces the previous "last player". When the game ends, the full pot is paid out to whoever deposited last.

The interesting part for developers is the architecture: the game state is canonical on the Michelson side, but player interaction happens on the EVM side, and the two interfaces are connected by an off-chain relayer that forwards each deposit through a cross-runtime call.

---

## Architecture overview

```
User (MetaMask)
      |
      | deposit 1 USDC
      v
xEscrow (EVM, Solidity)
      |
      | DepositMade event
      v
Relayer (Node.js, off-chain)
      |
      | callMichelson via NAC gateway precompile
      v
Game contract (Michelson, LIGO)
      |
      | updates pot, last player, EVM address mapping
      |
      v
Frontend (React + Vite) <-- polls Michelson RPC for live state
```

The four components live in separate subdirectories of the repository:

| Directory | Language | Role |
|---|---|---|
| `contracts/evm/` | Solidity | xUSDC token, xEscrow escrow contract |
| `contracts/tezlink/` | LIGO | Game contract (pot, players, address mapping) |
| `xbutton-relayer/` | TypeScript | Off-chain service: watches escrow events, calls NAC gateway |
| `xbutton-frontend/` | React + Vite | UI: wallet connect, deposit button, live game state |

---

The off-chain relayer also has another workflow which monitors the storage of the Michelson contract to detect when a player has won. In that case, it triggers the payment on the EVM side which is then reported to the Michelson side through a cross-runtime call.

## Documentation concepts exercised

### Native atomic composability (NAC)

The relayer calls the EVM-to-Michelson gateway precompile at `0xff00000000000000000000000000000000000007` using `callMichelson`. This is the same gateway described in [NAC usage (EVM side)](../evm/nac-usage.md) and exercised at small scale in the [cross-interface counter tutorial](../tutorials/nac-counter.md). The potluck game shows it in a production-shaped context: the caller is an off-chain Node.js process rather than a user's wallet, and the Michelson call carries a non-trivial parameter (player identity plus EVM address).

See: [Native atomic composability](../overview/native-atomic-composability.md), [NAC usage — EVM side](../evm/nac-usage.md).

### Address interoperability

When the relayer receives a `DepositMade` event it must map the depositor's EVM `0x…` address to a Tezos `tz1…` address before calling into the Michelson contract. The game contract also stores the raw EVM address alongside the Tezos identity so that the payout can be sent back to the EVM side.

The address conversion is done through the RPC methods described in [Accounts and aliases](../overview/accounts-and-aliases.md).

### EVM interface

The escrow contract is a standard Solidity contract deployed on the EVM side. It holds deposited USDC, emits a `DepositMade` event on each deposit, and exposes a payout function callable by the game operator. The xUSDC token is a minimal ERC-20 contract used as the deposit currency.

See: [EVM Interface](../evm/index.md).

### Michelson interface

The game contract is written in LIGO and compiled to Michelson. It maintains the pot balance, the current last-player identity (as a `tz1` address), and a map from Tezos addresses to EVM addresses for payout routing. It exposes entrypoints callable from the relayer via NAC.

See: [Michelson Interface](../michelson/index.md), [Compatibility with Tezos Layer 1](../michelson/developing/compatibility.md).

---

## Patterns beyond the conceptual docs

### Off-chain relayer pattern

The cross-interface counter tutorial shows NAC called synchronously from a Solidity contract (EVM logic triggers Michelson logic in the same transaction). The potluck game shows a different integration pattern: an **EVM-to-Michelson off-chain relayer** that bridges an EVM event to a Michelson call.

In this pattern:
1. The EVM contract emits an event (no direct gateway call in Solidity).
2. An off-chain Node.js service subscribes to those events via `eth_getLogs` / WebSocket.
3. The relayer sends an EVM transaction that calls the NAC gateway, routing data into the Michelson contract.

All transactions are initiated on the EVM side, so there is no need to have a funded address on the Michelson interface.

This pattern is useful when you want the EVM side to remain a simple escrow or token contract, while the full application logic lives in Michelson. It is also useful when the Michelson parameter to encode is complex enough that you prefer to assemble it off-chain.

### LIGO for Michelson contracts

The game contract is written in [LIGO](https://ligolang.org/), a higher-level language that compiles to Michelson. LIGO is an alternative to SmartPy (used in the counter tutorial) and to writing Michelson directly. The repository structure shows the LIGO source alongside the compiled Michelson, which may help if you are deciding which language to use for your own contracts on the Michelson interface.

### ERC-20 token on the EVM side

The example includes a minimal ERC-20 (xUSDC) deployed alongside the escrow contract. This is a useful starting point if your dApp needs a fungible token on the EVM interface while keeping settlement or accounting logic on the Michelson side.

### Full-stack dApp layout

The monorepo layout — Solidity contracts, LIGO contracts, relayer service, and React frontend in a single repository — is a practical reference for structuring a cross-interface dApp project. The root `package.json` starts both the frontend and the relayer with `npm run dev`.

---

## Running the example

Clone the repository and follow the instructions in its `README.md`. At a high level:

```shell
git clone https://github.com/trilitech/tezos-x-potluck-game
cd tezos-x-potluck-game
npm install
# configure .env files (see README)
npm run dev
```

The relayer must remain running for deposits to update the game state. You will also need a funded EVM wallet on the Etherlink<!--TX--> network — use the faucet and the network values from the [EVM network information](/evm/get-started/network-information) page.

:::note[Network configuration]

The example's `.env.example` files contain RPC endpoints for an internal demo deployment. Update these to the current values from [EVM network information](/evm/get-started/network-information) before running against the public testnet.

:::
