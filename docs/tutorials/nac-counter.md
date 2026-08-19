---
title: Cross-interface counter (NAC walkthrough)
---

# Cross-interface counter — getting started with Native Atomic Composability

Etherlink<!--TX--> is a single chain with an **EVM interface** and a **Michelson interface** living side by side. Through [Native Atomic Composability](../overview/native-atomic-composability.md), a contract on one interface can call a contract on the other within the same transaction, with full atomicity: if any step fails, every effect on both interfaces is rolled back.

In this tutorial we'll wire a small counter end-to-end:

- a user signs an EVM transaction in MetaMask;
- a Solidity contract forwards the call through the **EVM-to-Michelson gateway**, the EVM-side entrypoint for cross-interface calls;
- the **counter itself lives on the Michelson interface** — the single source of truth;
- `increment()` and `decrement()` are ordinary EVM-wallet calls that both forward through the gateway to the *same* Michelson counter, so there is no risk of two parallel tallies drifting apart.

By the end you will have:

1. deployed a Michelson smart contract from the SmartPy IDE,
2. deployed a Solidity contract from Remix,
3. seen a successful cross-interface call (EVM transaction succeeds, Michelson storage changes),
4. seen an *atomic revert* (Michelson rejects the call, the EVM transaction reverts as a whole).

The whole walkthrough runs on the **Etherlink<!--TX--> Previewnet**.

---

## Network values (read this first)

The Previewnet repository is the source of truth for endpoints, chain IDs, and configuration: [`github.com/trilitech/tezos-x-previewnet`](https://github.com/trilitech/tezos-x-previewnet). For convenience, the values you need today are reproduced below.

:::note

Values reproduced here are current at the time of writing. If anything in the table disagrees with the [previewnet repo](https://github.com/trilitech/tezos-x-previewnet) or the live [Previewnet dashboard](https://previewnet.tezosx.nomadic-labs.com/), prefer those — they are the canonical sources.

:::

| What you need | Value |
| --- | --- |
| EVM RPC URL | `https://evm.previewnet.tezosx.nomadic-labs.com` |
| EVM chain ID | `128064` (hex `0x1f440`) |
| EVM currency symbol | `XTZ` |
| Michelson interface RPC URL | `https://michelson.previewnet.tezosx.nomadic-labs.com` |
| EVM block explorer (Blockscout) | `https://blockscout.previewnet.tezosx.nomadic-labs.com` |
| Michelson block explorer (TzKT) | `https://tzkt.previewnet.tezosx.nomadic-labs.com` |
| Faucet | `https://faucet.previewnet.tezosx.nomadic-labs.com/` |

The Previewnet **dashboard** at [`previewnet.tezosx.nomadic-labs.com`](https://previewnet.tezosx.nomadic-labs.com/) has copy-paste cards for adding the network to MetaMask and Temple in one click — start there if you don't already have wallets configured.

This tutorial assumes you've added the Previewnet to your EVM wallet and your Michelson wallet before deploying or calling contracts.

---

## What is Etherlink<!--TX-->?

Etherlink<!--TX--> is a single chain with two interfaces side by side:

- the **EVM interface** — where Solidity contracts and EIP-1193 wallet interactions live;
- the **Michelson interface** — where Michelson contracts and Michelson storage live.

[Native Atomic Composability (NAC)](../overview/native-atomic-composability.md) is the mechanism that lets the two work together. A call that starts on the EVM side can trigger logic on the Michelson side, and vice versa, **in the same EVM transaction**. From a Solidity author's point of view it looks like a regular contract call to a fixed gateway address; no separate bridge, no relayers, no two-step ceremony.

If you already build on EVM, the upshot is that you keep your familiar tools (Remix, Hardhat, Foundry, MetaMask) and *additionally* reach contracts and storage on the Michelson side when that's the right tool for the job.

---

## What we're building

Two contracts:

- a **Michelson contract** that holds the counter as `int` storage, with three entrypoints: `increment`, `decrement`, `reset`.
- a **Solidity contract** that exposes `increment()` and `decrement()` from the EVM side. It does not maintain its own counter — it only forwards each call through the gateway to the Michelson contract.

When a user calls `increment()` (or `decrement()`) on the EVM contract:

1. the Solidity code calls the gateway precompile;
2. the gateway routes the call to the Michelson contract's matching entrypoint;
3. the Michelson storage changes;
4. the Solidity contract emits an EVM event so you can verify the transaction in the block explorer.

See a [live working example](https://tzx-counter.vercel.app/) of what we'll be building. You can also follow along in this tutorial by looking at the code in the [repo](https://github.com/trilitech/tezos-x-potluck-game/tree/main/tezosx-native-atomic-counter-example).


---

## Prerequisites

You don't need access to any private repository.

You do need:

- **MetaMask** (or another EIP-1193 wallet such as Rabby) for the EVM interface;
- **Temple Wallet** for the Michelson interface — see [wallet support](../michelson/wallet-support.md);
- test funds from the [Previewnet faucet](https://faucet.previewnet.tezosx.nomadic-labs.com/) on **both** interfaces;
- a Solidity workflow such as **Remix**, Hardhat, or Foundry;
- the **[SmartPy IDE](https://releases.smartpy.io/0.25.0a4/ide)** — a browser-based IDE for writing Tezos contracts in SmartPy (a Python-flavored language). If you're used to Remix on the EVM side, SmartPy IDE plays the same role on the Michelson side: edit, run, connect a wallet, deploy.

:::tip[Fund **both** address types]

In this tutorial you will use two different addresses (that may or may not be derived from the same passphrase in a wallet) — `0x…` for the EVM interface and `tz1…` for the Michelson interface — with **separate balances**. Funding one is not enough: the SmartPy origination in Part A pays gas from your `tz1…` balance, the Solidity deployment in Part B pays from your `0x…` balance. Paste each address into the faucet and request testnet XTZ for both before continuing.

:::

---

## Understanding the gateway call

The EVM-to-Michelson gateway is a precompile at:

```
0xff00000000000000000000000000000000000007
```

From Solidity's point of view it looks like an ordinary contract:

```solidity
interface INativeAtomicGateway {
    function callMichelson(
        string calldata destination,
        string calldata entrypoint,
        bytes calldata data
    ) external payable;
}
```

Parameters:

- **`destination`** — the Michelson contract address as a `KT1…` string (see the [glossary](../overview/glossary.md) for the address conventions). `KT1` is the standard Michelson smart-contract address format; it does not fit a 20-byte EVM `address`, which is why the gateway takes it as a string.
- **`entrypoint`** — the Michelson entrypoint name, e.g. `"increment"` or `"decrement"`.
- **`data`** — the Michelson parameter encoded as bytes.

For a Michelson entrypoint that takes `unit` (no parameter), the encoded payload is the constant `0x030b`:

:::note[Where does `0x030b` come from?]

`0x030b` is the Michelson binary encoding of the `Unit` literal: a one-byte tag (`0x03`) marking a primitive expression, followed by the opcode for `Unit` (`0x0b`). We'll use it for both `increment` and `decrement` in this tutorial. For non-trivial parameters you'll need a Michelson encoder — Taquito's `packData` or an on-chain encoding library, depending on whether you encode off-chain or in Solidity. See the [NAC usage reference](../evm/nac-usage.md#callmichelson) for the full gateway surface.

:::

---

## Part A — Michelson counter (do this first)

### A.1 Why Michelson comes first

You need the `KT1` address before you can deploy the Solidity contract — the address is passed to the Solidity constructor as a string. Doing Michelson first also matches how you'll verify behavior — set the baseline, then mutate it from the EVM side.

### A.2 Write the contract in SmartPy

Open the [SmartPy IDE](https://releases.smartpy.io/0.25.0a4/ide) and replace the default template with:

```py
import smartpy as sp  # type: ignore

@sp.module
def main():
    class CounterNacTutorial(sp.Contract):
        def __init__(self):
            self.data.counter = 0  # storage is a simple int, starts at 0

        @sp.entrypoint
        def increment(self):
            self.data.counter += 1

        @sp.entrypoint
        def decrement(self):
            assert self.data.counter > 0, "at zero"
            self.data.counter -= 1

        @sp.entrypoint
        def reset(self):
            self.data.counter = 0


if "main" in __name__:

    @sp.add_test()
    def test():
        sc = sp.test_scenario("CounterNacTutorial", main)
        c = main.CounterNacTutorial()
        sc.h1("Originate")
        sc += c

        sc.h2("Increment twice")
        c.increment()
        c.increment()
        sc.verify(c.data.counter == 2)

        sc.h2("Decrement once")
        c.decrement()
        sc.verify(c.data.counter == 1)

        sc.h2("Reset")
        c.reset()
        sc.verify(c.data.counter == 0)

        sc.h2("Decrement at zero should fail")
        c.decrement(_valid=False, _exception="at zero")
```

Click **Run** to make sure it compiles and the local tests pass.

The three entrypoints we'll use through NAC are:

- `increment` — adds 1.
- `decrement` — subtracts 1; fails with `"at zero"` when storage is already 0. We'll use this to demonstrate atomic reverts.
- `reset` — sets storage back to 0 (handy for re-running the demo).

### A.3 Connect Temple to the Previewnet

1. In Temple → **Settings → Networks → Add network**.
2. Set the RPC URL to `https://michelson.previewnet.tezosx.nomadic-labs.com` and use the values from the [network table](#network-values-read-this-first) above.
3. Switch Temple to that network.
4. Fund the account from the [faucet](https://faucet.previewnet.tezosx.nomadic-labs.com/) — paste your `tz1…` address and request test XTZ.

### A.4 Deploy from the SmartPy IDE

1. With the contract from A.2 still in the editor, click **Run** once more to be sure compilation succeeded.
2. Click **Deploy Contract**, then **Continue**.
3. In the deploy form, set both the **Node** and **Network** fields to the Michelson interface RPC URL (`https://michelson.previewnet.tezosx.nomadic-labs.com`). The IDE's network dropdown is unlikely to list "Etherlink<!--TX--> Previewnet" yet, so use the custom URL field.
4. Click **Wallet** and choose **Beacon**. Beacon is the Tezos wallet-connect protocol — it plays the same role as WalletConnect in the EVM world. The IDE will pop up a Temple connection request; approve it.
5. Make sure that account is funded on the Michelson side — request from the [faucet](https://faucet.previewnet.tezosx.nomadic-labs.com/) if needed.
6. Click **Estimate Cost**. If estimation fails, enter a fee manually so you can continue.
7. Click **Deploy Contract**.
8. Wait for the success state — the IDE shows a **Successful Deployment** checkmark and your new `KT1…` contract address.

:::note[SmartPy IDE UI may shift]

The SmartPy IDE's deploy panel evolves over time. If a button label or field name no longer matches, look for the equivalent: the flow is always *compile → deploy → connect wallet → estimate → confirm*.

:::

You should now have:

- the **`KT1` contract address** (from the deployment success screen);
- confirmation that **initial storage is `0`** (we'll double-check next).

### A.5 Verify storage is 0 (before any EVM call)

There are two ways to read Michelson storage. The RPC path is authoritative; the explorer is more readable but indexed asynchronously, so it can lag the chain by a few seconds — useful to know when we come back to verify after the EVM call.

**Option 1 (authoritative) — RPC with `curl`.**

```shell
curl -s "https://michelson.previewnet.tezosx.nomadic-labs.com/chains/main/blocks/head/context/contracts/<KT1>/storage"
```

Replace `<KT1>` with your contract address. The response should represent `0`.

**Option 2 — explorer.**

1. Open [TzKT for the Previewnet](https://tzkt.previewnet.tezosx.nomadic-labs.com/) (the Michelson explorer).
2. Paste your `KT1…` into the search box.
3. On the contract page, find **Storage** and confirm it shows `0`.

Keep that terminal (or explorer tab) open — you'll come back to it after the EVM call.

---

## Part B — EVM contract and wallet interaction

### B.1 Connect MetaMask to the Previewnet

The fastest path is the [Previewnet dashboard](https://previewnet.tezosx.nomadic-labs.com/) — click **Add to MetaMask** and approve.

If you prefer to add it manually: open MetaMask → **Settings → Networks → Add network** and use the values from the [network table](#network-values-read-this-first). Then switch MetaMask to the Previewnet and fund the account from the [faucet](https://faucet.previewnet.tezosx.nomadic-labs.com/).

### B.2 Write the Solidity contract

`EvmToMichelsonCounter` is a thin forwarder. The constructor takes the Michelson `KT1` as a string. Both `increment` and `decrement` call `callMichelson` with the matching entrypoint name and the `unit` payload `0x030b`. The counter you care about lives **only** on the Michelson side.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface INativeAtomicGateway {
    function callMichelson(
        string calldata destination,
        string calldata entrypoint,
        bytes calldata data
    ) external payable;
}

contract EvmToMichelsonCounter {
    /// @dev Etherlink Previewnet NAC / EVM/Michelson gateway precompile. 
    address internal constant NAC_GATEWAY = 0xfF00000000000000000000000000000000000007;

    INativeAtomicGateway public immutable gateway;
    string public michelsonCounter;

    bytes internal constant UNIT = hex"030b";

    uint256 internal constant GATEWAY_GAS = 3_000_000;

    event CounterCalled(
        address indexed caller,
        string action,
        string michelsonCounter
    );

    constructor(string memory michelsonCounterAddress) {
        gateway = INativeAtomicGateway(NAC_GATEWAY);
        michelsonCounter = michelsonCounterAddress;
    }

    /// @dev The NAC gateway is a zero-bytecode precompile. 
    /// use low-level `.call` + `abi.encodeWithSelector`
    function _callMichelson(string memory entrypoint) private {
        bytes memory callData = abi.encodeWithSelector(
            INativeAtomicGateway.callMichelson.selector,
            michelsonCounter,
            entrypoint,
            UNIT
        );
        (bool ok, bytes memory ret) = address(gateway).call{gas: GATEWAY_GAS}(callData);
        if (!ok) {
            if (ret.length > 0) {
                assembly ("memory-safe") {
                    revert(add(ret, 0x20), mload(ret))
                }
            }
            revert("NAC gateway call failed");
        }
    }

    function increment() external {
        _callMichelson("increment");
        emit CounterCalled(msg.sender, "increment", michelsonCounter);
    }

    function decrement() external {
        _callMichelson("decrement");
        emit CounterCalled(msg.sender, "decrement", michelsonCounter);
    }

    function reset() external {
        _callMichelson("reset");
        emit CounterCalled(msg.sender, "reset", michelsonCounter);
    }
}
```

### B.3 Deploy from Remix

Open [Remix](https://remix.ethereum.org), paste the contract above, and deploy as you would on any other EVM testnet:

- **Environment**: "Injected Provider — MetaMask", with MetaMask switched to the Etherlink<!--TX--> Previewnet.
- **Constructor argument**: the Michelson counter `KT1…` string from Part A (e.g. `"KT1abc…"`).

You can also deploy locally with Hardhat or Foundry — same network, same constructor argument.

### B.4 Call `increment()` from MetaMask

1. In Remix's deployed-contracts panel (or any other EVM-wallet UI for the deployed contract) click **`increment`**.
2. Approve the transaction in MetaMask.
3. When it confirms, copy the **transaction hash**.

### B.5 Inspect the EVM transaction in Blockscout

1. Open [Blockscout for the Previewnet](https://blockscout.previewnet.tezosx.nomadic-labs.com/).
2. Paste the transaction hash into the search box.
3. Confirm the transaction status is **Success**.
4. Open the **Logs** (or **Events**) tab and find the `CounterCalled` event:
   - `action` should be `increment`,
   - `michelsonCounter` should match your `KT1…`.

This is where the EVM-side narrative ends — the Solidity contract emitted an event, the transaction succeeded.

### B.6 Re-read Michelson storage

Go back to A.5. Run the `curl` first — the RPC reflects the chain immediately. If everything is wired correctly, **storage is now `1`**.

If TzKT still shows `0`, give the indexer a few seconds to catch up: when the explorer disagrees with the RPC, trust the RPC.

### B.7 Call `decrement()` once

1. Back in Remix, call **`decrement`** and confirm in MetaMask.
2. On Blockscout, open the new transaction and check the `CounterCalled` event — `action` should be `decrement`.
3. Refresh TzKT (or rerun the `curl`).

Storage should be back to `0`.

---

## Part C — Atomic revert

Native Atomic Composability means the Michelson step runs **as part of** the same EVM transaction. If Michelson rejects the call (for example, our `decrement` fails with `"at zero"` when storage is already `0`), the **EVM transaction reverts as a whole**. You should *not* see a successful EVM transaction with an unchanged Michelson counter — that split simply doesn't happen on this path.

To trigger it deliberately:

1. Make sure Michelson storage is `0` (call `reset` from Temple, or `decrement` from the EVM side until you land on 0).
2. From MetaMask, call **`decrement()`** again.

:::warning[Make the failed transaction land on-chain]

By default, MetaMask runs a pre-flight gas estimation and refuses to broadcast a transaction it predicts will revert. In that case you'll see an "Internal JSON-RPC error" popup and **no transaction will be created** — meaning no hash to inspect on Blockscout.

The cleanest workaround is Remix: in the Deploy & Run panel, set a fixed **Gas limit** (e.g. `300000`) and call `decrement` from there. Remix will broadcast the transaction even if estimation fails, the revert lands on-chain, and Blockscout shows it as **Failed**. Alternatively, in MetaMask click **Edit gas → Advanced**, set a manual gas limit, and confirm.

:::

What you should see:

- The transaction shows as **Failed** (not Success) on Blockscout, with a reverted status.
- The `CounterCalled` event is **not** in the logs (the contract reverted before reaching `emit`).
- On the Michelson side, storage is **still `0`** (verify via `curl` — see A.5).

That's the atomicity guarantee: the EVM side did *not* succeed independently of the Michelson side.

---

## Recap

In one walkthrough you:

- pulled network values from the [Previewnet repo](https://github.com/trilitech/tezos-x-previewnet) and configured both wallets;
- deployed a Michelson counter from the SmartPy IDE and verified storage at `0`;
- deployed an EVM forwarder from Remix that routes `increment`/`decrement` through the gateway;
- watched the result land on **both** sides — `CounterCalled` event in Blockscout, storage updated via the Michelson RPC;
- triggered an atomic revert and confirmed the EVM transaction failed *with* Michelson storage unchanged.

For more details on the gateway surface beyond `callMichelson`, see [NAC usage (EVM side)](../evm/nac-usage.md). For the Michelson-side gateway and how to call back into the EVM, see [NAC usage (Michelson side)](../michelson/nac-usage.md).

Well done! :tada: Now you may have some fun trying the [live working example](https://tzx-counter.vercel.app/). 
