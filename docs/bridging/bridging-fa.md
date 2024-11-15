---
title: Bridging FA tokens between Tezos layer 1 and Etherlink
---

You can bridge FA standards-compliant tokens in and out of Etherlink by deploying contracts that move the tokens.
Etherlink does not have a UI that bridges FA tokens, so you must deploy and use the contracts yourself.

The Tezos FA standards are token standards like the Ethereum ERC-20, ERC-721, and ERC-1155 standards.
For more information about the FA standards, see [Token standards](https://docs.tezos.com/architecture/tokens#token-standards) on docs.tezos.com.

Two bridging operations are available:

- Bridging tokens from Tezos layer 1 to Etherlink is referred to as _depositing_ tokens.
- Bridging tokens from Etherlink to Tezos layer 1 is referred to as _withdrawing_ tokens.

:::note
<h3>Bridging time</h3>
Tokens that you bridge from Tezos layer 1 to Etherlink are available for use on Etherlink immediately.

Tokens that you bridge from Etherlink to Tezos layer 1 are available for use on Tezos in 15 days.

This delay is caused by the Smart Rollup refutation period.
As with all Smart Rollups, Etherlink nodes post commitments about their state to Tezos layer 1, including incoming bridging transactions, on a regular schedule.
Other nodes have the length of the refutation period (14 days) to challenge those commitments.
At the end of the refutation period, the correct commitment is cemented, or made final and unchangeable.

After the commitment with the withdrawal transaction is cemented, any user can execute the transaction to make the bridged tokens available on Tezos layer 1.
:::

## How bridging FA tokens works

The process of bridging FA tokens is similar to the process of bridging tez.
In short, the bridge uses tickets to send tokens from the source network to the target network.

### Contracts

The bridging process relies on smart contracts that convert tokens to [tickets](https://docs.tezos.com/smart-contracts/data-types/complex-data-types#tickets) and transfer the tickets between Tezos and Etherlink.
These contracts are an implementation of the [TZIP-029](https://gitlab.com/baking-bad/tzip/-/blob/wip/029-etherlink-token-bridge/drafts/current/draft-etherlink-token-bridge/etherlink-token-bridge.md) standard for bridging between Tezos and Etherlink.

Each FA token needs its own copy of these contracts to be able to bridge the token:

- **Ticketer contract**: Stores tokens and issues tickets that represent them
- **Token bridge helper contract**: Accepts requests to bridge tokens on layer 1, uses the ticketer contract to get tickets for them, and sends the tickets to Etherlink
- **ERC-20 proxy contract**: Stores tickets and mints ERC-20 tokens that are equivalent to the FA tokens in layer 1

Examples of these contracts and tools to deploy them are available in the repository https://github.com/baking-bad/etherlink-bridge.

### Depositing tokens from layer 1 to Etherlink

The process of bridging FA-compatible tokens from layer 1 to Etherlink (also known as depositing tokens) follows these general steps:

1. A Tezos user gives the token bridge helper contract access to their tokens.

   - For FA1.2 tokens, the user gives the helper contract an allowance of tokens.
   - For FA2 tokens, the user makes the helper contract an operator of their tokens.

   For information about token access control, see [Token standards](https://docs.tezos.com/architecture/tokens#token-standards) on docs.tezos.com.

1. The user calls the helper contract's `deposit` entrypoint.
The request includes the amount of tokens to bridge, the address of the Etherlink Smart Rollup, and the user's Etherlink wallet address, but not the tokens themselves.

1. The token bridge helper contract stores the address of the Etherlink Smart Rollup and the user's Etherlink address temporarily.

1. The helper contract (as an operator of the user's tokens or with an allowance of the user's tokens) calls the token contract to transfer the tokens from the user's account to its account.

1. The helper contract calls the ticketer contract's `deposit` entrypoint and includes the tokens.

1. The ticketer contract stores the tokens and creates a [ticket](https://docs.tezos.com/smart-contracts/data-types/complex-data-types#tickets) that represents the receipt of the tokens.

1. The ticketer contract sends the ticket back to the helper contract.

1. The helper contract forwards the ticket to the Smart Rollup inbox and clears its storage for the next transfer.

1. The Etherlink Smart Rollup receives the ticket and sends it to the ERC-20 proxy contract.

1. The ERC-20 proxy contract stores the ticket, mints the equivalent tokens, and sends them to the user's Etherlink account.

This diagram is an overview of the process of bridging tokens from layer 1 to Etherlink:

![Overview of the FA token bridging deposit process](/img/bridging-deposit-fa.png)
<!-- https://lucid.app/lucidchart/50249082-2195-40fa-8fa0-bd030ef6b12e/edit -->

### Withdrawing tokens from Etherlink to layer 1

The process of bridging FA-compatible tokens from Etherlink to layer 1 (also known as withdrawing tokens) follows these general steps:

1. The user calls the FA withdrawal precompiled contract on Etherlink and includes this information:

   - The address of the ERC-20 proxy contract that stores the ticket that represents the tokens
   - The amount of tokens to bridge
   - The user's layer 1 address or the address of a contract to send the tokens to
   - The address of the ticketer contract on layer 1
   - The content of the ticket to remove from the proxy contract (not the ticket itself)

   The proxy contract uses the address of the ticketer contract and the content of the ticket to verify that the user owns the specified tokens.

   <!-- TODO the payload consists of two forged contracts concatenated:
   | receiver | proxy | 44 bytes
   Forged contract consists of binary suffix/prefix and body (blake2b hash digest):

   - tz1 — 0x00 0x00 <body>
   - tz2 — 0x00 0x01 <body>
   - tz3 — 0x00 0x02 <body>
   - KT1 — 0x01 <body> 0x00
   -->

1. The precompiled contract creates a transaction for the ERC-20 proxy contract to send the ticket to the helper contract and puts this transaction in the Smart Rollup outbox.
This transaction includes the target layer 1 address.

This outbox message becomes part of Etherlink's commitment to its state.
1. When the commitment that contains the transaction is cemented on layer 1, anyone can run the transaction by running the Octez client `execute outbox message` command.

1. The helper contract receives the ticket and address and stores the address.

1. The helper contract sends the ticket to the ticketer contract's `withdraw` entrypoint.

1. The ticketer contract burns the ticket and sends the tokens to the helper contract.

1. The helper contract sends the tokens to the target layer 1 address.

This diagram is an overview of the process of bridging tokens from Etherlink to layer 1:

![Overview of the FA token bridging withdrawal process](/img/bridging-withdrawal-fa.png)
<!-- https://lucid.app/lucidchart/068d1822-29cb-4f8c-8aa1-2bd79f9b8490/edit -->

### Configuring a token for bridging

You can configure any FA1.2 or FA2 token for bridging by deploying the necessary contracts.
You can use this tool to simplify the process by deploying the contracts for a single token: https://github.com/baking-bad/etherlink-bridge.

Setting up a token for bridging in this way does not make it appear on the Etherlink bridge web site.
You must deploy and operate the FA bridge contracts yourself.

### Sending FA bridging transactions

Because the contracts that control bridging FA tokens follow the [TZIP-029](https://gitlab.com/baking-bad/tzip/-/blob/wip/029-etherlink-token-bridge/drafts/current/draft-etherlink-token-bridge/etherlink-token-bridge.md) standard, the transactions to bridge tokens are the same for any token.

#### Depositing FA tokens from layer 1 to Etherlink

It takes two transactions to bridge a token from layer 1 to Etherlink: one to give the token bridge helper contract access to the tokens and another to initiate the deposit.

Follow these steps to deposit FA-compliant tokens from layer 1 to Etherlink:

1. Give the token bridge helper contract access to the tokens, depending on the type of token:

   - For FA1.2 tokens, give the token bridge helper contract an allowance for the number of tokens to deposit.
   You can submit this transaction with any Tezos client, including on many block explorers.
   For example, this Octez client command sets the contract's allowance to 5 tokens:

      ```bash
      octez-client --wait none transfer 0 from my_wallet \
        to KT1SekNYSaT3sWp55nhmratovWN4Mvfc6cfQ \
        --entrypoint "approve" \
        --arg "Pair \"KT1K8od35rJtmQuTUeWbWMa9ciHGTpKjPaqx\" 5" \
        --burn-cap 0.1
      ```

      In this example, `KT1SekNYSaT3sWp55nhmratovWN4Mvfc6cfQ` is the address of the token contract and `KT1K8od35rJtmQuTUeWbWMa9ciHGTpKjPaqx` is the address of the token bridge helper contract.

   - For FA2 tokens, make the token bridge helper contract an operator of the token to deposit.
   You can submit this transaction with any Tezos client, including on many block explorers.
   For example, this Octez client command makes the token bridge helper contract `KT1PaqqmLgyUKyrWQG9tP57rt6tag8nGSrMh` an operator of the  token with the ID 0 on the FA2 contract `KT1N5CWnvabCM71eBmzEhotnQX3eciLLyv8v`:

      ```bash
      octez-client --wait none transfer 0 from my_wallet \
        to KT1N5CWnvabCM71eBmzEhotnQX3eciLLyv8v \
        --entrypoint "update_operators" \
        --arg "{ Left (Pair \"tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx\" (Pair \"KT1PaqqmLgyUKyrWQG9tP57rt6tag8nGSrMh\" 0)) }"  \
        --burn-cap 0.1
      ```

1. Call token bridge helper's `deposit` entrypoint and pass the address of the Etherlink Smart Rollup and the address of the Etherlink account to send the tokens to, as in this example:

   ```bash
   octez-client --wait none transfer 0 from my_wallet \
     to KT1K8od35rJtmQuTUeWbWMa9ciHGTpKjPaqx \
     --entrypoint "deposit" \
     --arg "Pair \"sr18wx6ezkeRjt1SZSeZ2UQzQN3Uc3YLMLqg\" (Pair 0x45Ff91b4bF16aC9907CF4A11436f9Ce61BE0650d 2)" \
     --burn-cap 0.1
   ```

The token bridge helper contract sends the tokens to the ticketer contract, which issues a ticket that represents the tokens.
The token bridge helper contract sends that ticket to the ERC-20 proxy contract, which mints the tokens and sends them to the Etherlink account.

To see the tokens in your Etherlink wallet, look up the ERC-20 proxy contract in a block explorer or use its address to manually add the tokens to your wallet.
Because the Etherlink tokens are compatible with the ERC-20 standard, EVM-compatible wallets should be able to display them.

#### Withdrawing FA tokens from Etherlink to layer 1

It takes two transactions to withdraw an FA token back to Etherlink: one to initiate the withdrawal and another to run the outbox transaction on Tezos layer 1.
As described above, you must wait two weeks to run the outbox transaction due to the Smart Rollup refutation period.

Neither of these transactions are easy to do.
Initiating the withdrawal requires sending complex information about the ticket and contracts to the FA2 withdrawal precompile on Etherlink.
Running the outbox transaction requires you to know the level of the Etherlink commitment that contains it in order to get its proof and commitment, and there is no easy way to get that information without using an indexer to check each level for the transaction.

The command-line tool at https://github.com/baking-bad/etherlink-bridge provides commands that can help with the withdrawal transactions.
