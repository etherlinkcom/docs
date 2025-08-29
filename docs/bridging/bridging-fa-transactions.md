---
title: Sending FA bridging transactions
---

Because the contracts that control bridging FA tokens follow the [TZIP-029](https://gitlab.com/baking-bad/tzip/-/blob/wip/029-etherlink-token-bridge/drafts/current/draft-etherlink-token-bridge/etherlink-token-bridge.md) standard, the transactions to bridge tokens are the same for any token.

## Depositing FA tokens from layer 1 to Etherlink

It takes a few transactions to bridge a token from layer 1 to Etherlink:

- A transaction to give the token bridge helper contract access to the tokens
- A transaction to initiate the deposit
- A transaction to claim the tokens on Etherlink

Follow these steps to deposit FA-compliant tokens from layer 1 to Etherlink:

1. Give the token bridge helper contract access to the tokens, depending on the type of token:

   - For FA1.2 tokens, give the token bridge helper contract an allowance for the number of tokens to deposit.
   You can submit this transaction with any Tezos client.
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
   For example, this Octez client command makes the token bridge helper contract `KT1PaqqmLgyUKyrWQG9tP57rt6tag8nGSrMh` an operator of the token with the ID 0 on the FA2 contract `KT1N5CWnvabCM71eBmzEhotnQX3eciLLyv8v`:

      ```bash
      octez-client --wait none transfer 0 from my_wallet \
        to KT1N5CWnvabCM71eBmzEhotnQX3eciLLyv8v \
        --entrypoint "update_operators" \
        --arg "{ Left (Pair \"tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx\" (Pair \"KT1PaqqmLgyUKyrWQG9tP57rt6tag8nGSrMh\" 0)) }"  \
        --burn-cap 0.1
      ```

1. Call the token bridge helper's `deposit` entrypoint and pass the address of the Etherlink Smart Rollup and the address of the Etherlink account to send the tokens to, as in this example:

   ```bash
   octez-client --wait none transfer 0 from my_wallet \
     to KT1K8od35rJtmQuTUeWbWMa9ciHGTpKjPaqx \
     --entrypoint "deposit" \
     --arg "Pair \"sr18wx6ezkeRjt1SZSeZ2UQzQN3Uc3YLMLqg\" (Pair 0x45Ff91b4bF16aC9907CF4A11436f9Ce61BE0650d 2)" \
     --burn-cap 0.1
   ```

   The token bridge helper contract sends the tokens to the ticketer contract, which issues a ticket that represents the tokens.
   The token bridge helper contract sends that ticket to Etherlink.

1. When the deposit is in an Etherlink block, call the FA bridging precompiled contract contract's `claim` function to cause the ERC-20 proxy contract to mint the tokens.

   The address of the precompiled contract is `0xff00000000000000000000000000000000000002` and to call the function you can use the ABI `claim(uint256 depositId)`, where `depositId` matches the `depositId` that was emitted in a previous event for this transfer by the precompile (`QueuedDeposit(uint256 depositId, address recipient, uint256 amount, uint256 timelock, uint256 depositCount)`).

   As a reference, here is an [example of the sequencer injecting a deposit](https://explorer.etherlink.com/tx/0x5a06fe64e880d6d1f53c243477cd5656204712f1543b607340996ad246158669) and here is an [example of the corresponding claim transaction](https://explorer.etherlink.com/tx/0xe017665cd7bfdef375a863114ac9f7ed2538da4d8584b0f1e0aa71ce96342aee).

   The precompiled contract sends information about the deposit to the ERC-20 proxy contract, which mints the tokens and sends them to the Etherlink account.

   :::note

   Normally an automated system run by Nomadic Labs calls the `claim` function on behalf of depositors, but if that system is down or does not call the `claim` function for your deposit, you may need to do it yourself.

   :::

To see the tokens in your Etherlink wallet, look up the ERC-20 proxy contract in a block explorer or use its address to manually add the tokens to your wallet.
Because the Etherlink tokens are compatible with the ERC-20 standard, EVM-compatible wallets should be able to display them.

## Withdrawing FA tokens from Etherlink to layer 1

It takes two transactions to withdraw an FA token back to Etherlink: one to initiate the withdrawal and another to run the outbox transaction on Tezos layer 1.
As described in [Bridging FA tokens](/bridging/bridging-fa), you must wait two weeks to run the outbox transaction due to the Smart Rollup refutation period.

Neither of these transactions are easy to do.
Initiating the withdrawal requires sending complex information about the ticket and contracts to the FA2 withdrawal precompile on Etherlink.
Running the outbox transaction requires you to know the level of the Etherlink commitment that contains it in order to get its proof and commitment, and there is no easy way to get that information without using an indexer to check each level for the transaction.

The command-line tool at https://github.com/baking-bad/etherlink-bridge provides commands that can help with the withdrawal transactions.
