---
title: Setting up an Etherlink voting key
dependencies:
  octez: 24.1
  ligo: 1.10.0
---

For convenience, Tezos bakers can use a voting key to vote on Etherlink proposals instead of using their baking key directly.
Using a voting key can be more convenient than using your baking key because you don't have to retrieve the baking key from your baking setup to be able to vote on Etherlink governance.

You can set any Tezos layer 1 account as your voting key, so you can use an existing account or create an account to be the voting key.
The voting key has no special built-in privileges in Etherlink; it is merely an account used to authenticate on the governance contracts.
Bakers can change their Etherlink voting keys at any time, and changes take effect immediately.

:::note

Setting up an Etherlink voting key affects only Etherlink voting rights, not Tezos layer 1 protocol upgrade voting rights or layer 1 account delegation.

:::

Setting up a voting key is a two-step process; the voting key is not active until both of these steps are complete:

1. The baking key proposes a voting key by calling the `propose_voting_key` entrypoint.
1. The voting key claims the voting rights by calling the `claim_voting_rights` entrypoint.

Proposing a voting key requires a transaction from the Octez client or an indexer, but you can claim rights from a voting key with the [governance web site](https://governance.etherlink.com).


:::warning

Voting keys claim rights with the `claim_voting_rights` entrypoint only once.
Suppose that a baking key proposes a voting key for a certain contract and the voting key calls the `claim_voting_rights` entrypoint.
Then, the baking key submits a second proposal for a second contract to the same voting key.
In this case, the voting key automatically receives rights for the second contract, without needing to call the `claim_voting_rights` entrypoint again.

In fact, a voting key should never call the `claim_voting_rights` entrypoint more than once because doing so deactivates its voting rights and returns them to the baking key.

:::

At each vote period, each baker can vote only once, authenticating itself using either a voting key or its baking key.

### Setting a voting key for all contracts

To set up a voting key, call the `propose_voting_key` entrypoint of the voting rights contract.
By default, when you set up a voting key, that voting key receives the rights to vote for all governance contracts.
For example, the following command proposes allowing the voting key to vote for all governance contracts from the baking key with the alias `my_wallet`.
It uses the placeholder `<MY_VOTING_KEY>` in place of the address of the voting key:

```bash
octez-client call KT1Ut6kfrTV9tK967tDYgQPMvy9t578iN7iH from my_wallet \
  --entrypoint propose_voting_key \
  --arg '(Pair "<MY_VOTING_KEY>" True None)' --burn-cap 0.1
```

Then, to claim voting rights, go to the [governance web site](https://governance.etherlink.com), connect your voting key with the **Connect** button at the top right of the page, and use the connection dialog to claim rights.

As an alternative, you can claim voting rights directly by calling the `claim_voting_rights` entrypoint from the voting key and passing the baking key address.
For example, the following command claims the voting rights proposed in the previous command.
It uses the placeholder `<MY_BAKER>` in place of the address of the baking key:

```bash
octez-client call KT1Ut6kfrTV9tK967tDYgQPMvy9t578iN7iH from <MY_VOTING_KEY> \
  --entrypoint claim_voting_rights \
  --arg '"<MY_BAKER>"'
```

:::warning

Claiming rights a second time with the `claim_voting_rights` entrypoint with the voting key returns the voting rights to the baking key.

:::

### Setting a voting key for specific contracts

You can also select specific governance contracts to allow the voting key to vote for.
The following example passes `True` and the addresses of the slow kernel governance and sequencer governance contracts as a proposal.
As a result, the voting key can vote on those contracts but not on the kernel fast governance contract:

```bash
octez-client call KT1Ut6kfrTV9tK967tDYgQPMvy9t578iN7iH from <MY_BAKER> \
  --entrypoint propose_voting_key \
  --arg '(Pair "<MY_VOTING_KEY>" True (Some { "KT1WckZ2uiLfHCfQyNp1mtqeRcC1X6Jg2Qzf" ; "KT1VZVNCNnhUp7s15d9RsdycP7C1iwYhAQ8r" }))'
```

Then, to claim voting rights, go to the [governance web site](https://governance.etherlink.com), connect your voting key with the **Connect** button at the top right of the page, and use the connection dialog to claim rights.

As an alternative, you can claim voting rights directly for the specified contracts, which is just like the previous command to claim voting rights:

```bash
octez-client call KT1Ut6kfrTV9tK967tDYgQPMvy9t578iN7iH from <MY_VOTING_KEY> \
  --entrypoint claim_voting_rights \
  --arg '"<MY_BAKER>"'
```

The following example passes `False` and the address of the fast kernel governance contract.
The result is the same as the previous proposal example: the voting key can vote on the slow kernel governance and sequencer governance contracts but not the fast kernel governance contract.
You can also use this proposal to remove the voting key's ability to vote for specific contracts:

```bash
octez-client call KT1Ut6kfrTV9tK967tDYgQPMvy9t578iN7iH from <MY_BAKER> \
  --entrypoint propose_voting_key \
  --arg '(Pair "<MY_VOTING_KEY>" False (Some { "KT1QDgF5pBkXEizj5RnmagEyxLxMTwVRpmYk" }))' --burn-cap 0.1
```

:::tip

The source code for the voting rights contract is in the file [`delegated_governance.mligo`](https://gitlab.com/tezos/tezos/-/blob/master/etherlink/tezos_contracts/governance/contracts/delegated_governance.mligo) in the Octez repository.
You can install LIGO and use its `compile expression` command and information from the source code to compile parameters to call it.

For example, from the code of the contract you can see that the parameter to pass to the `propose_voting_key` entrypoint is the type `address * bool * (address set) option`.
This command compiles an expression of this CameLIGO type to Michelson to propose rights for two contracts:

```bash
ligo compile expression cameligo '("<MY_VOTING_KEY>" : address), True, (Some (Set.literal [("KT1WckZ2uiLfHCfQyNp1mtqeRcC1X6Jg2Qzf" : address); ("KT1VZVNCNnhUp7s15d9RsdycP7C1iwYhAQ8r" : address)]) : (address set) option)'
```

You can use the result as the parameter to pass to the `propose_voting_key` entrypoint.
Here is the result of the command:

```michelson
(Pair "<MY_VOTING_KEY>"
      True
      (Some { "KT1WckZ2uiLfHCfQyNp1mtqeRcC1X6Jg2Qzf" ;
              "KT1VZVNCNnhUp7s15d9RsdycP7C1iwYhAQ8r" }))
```

Here is the resulting `octez-client` command:

```bash
octez-client call KT1Ut6kfrTV9tK967tDYgQPMvy9t578iN7iH from <MY_BAKER> \
  --entrypoint propose_voting_key \
  --arg '(Pair "<MY_VOTING_KEY>" True (Some { "KT1VZVNCNnhUp7s15d9RsdycP7C1iwYhAQ8r" ; "KT1WckZ2uiLfHCfQyNp1mtqeRcC1X6Jg2Qzf" }))'
```
:::

### Verifying voting rights

To check if an address has voting rights for a governance contract, pass the baking account address, the voting account address, and an option containing the governance contracts (or `None` for all contracts) to the `is_voting_key_of` view.
For example, the following command verifies that the voting key represented by the placeholder `<MY_VOTING_KEY>` has the rights to vote for the baking key represented by the placeholder `<MY_BAKER>`.
It returns True if the `<MY_VOTING_KEY>` voting key has rights to vote in place of the `<MY_BAKER>` baking key for all contracts that use this contract to track voting rights or False if it has not.

```bash
octez-client run view is_voting_key_of on contract KT1Ut6kfrTV9tK967tDYgQPMvy9t578iN7iH \
  with input 'Pair "<MY_VOTING_KEY>" "<MY_BAKER>" None'
```

To check voting rights for a specific contract, pass the address as an option.
For example, this command verifies rights for the slow kernel governance contract:

```bash
octez-client run view is_voting_key_of on contract KT1Ut6kfrTV9tK967tDYgQPMvy9t578iN7iH \
  with input 'Pair "<MY_VOTING_KEY>" "<MY_BAKER>" (Some "KT1VZVNCNnhUp7s15d9RsdycP7C1iwYhAQ8r")'
```

:::tip

Similar to how you can compile parameters for the entrypoints as described in [Setting a voting key for specific contracts](#setting-a-voting-key-for-specific-contracts), you can use the `ligo compile expression` command to compile the parameter for the view.
The view accepts a tuple that includes the address of the voting key, the address of the baker key, and an option that is either None or a list of contracts.

For example, to compile the parameter from the previous example, install LIGO and run this command:

```bash
ligo compile expression cameligo '("<MY_VOTING_KEY>" : address), ("<MY_BAKER>" : address), (Some ("KT1VZVNCNnhUp7s15d9RsdycP7C1iwYhAQ8r" : address): address option)'
```

You can use the result as the parameter to pass to the view.
Here is the result of the command:

```michelson
(Pair "tz1fsVnw7VQD73kUDB8ZWc67GWvCjTEibi9A"
      "tz1QCVQinE8iVj1H2fckqx6oiM85CNJSK9Sx"
      (Some "KT1VZVNCNnhUp7s15d9RsdycP7C1iwYhAQ8r"))
```

:::

### Removing rights

To revoke rights from a voting key, call the `propose_voting_key` entrypoint from the baking key with the parameter `(Pair <MY_VOTING_KEY> False None)`, as in this example:

```bash
octez-client call KT1Ut6kfrTV9tK967tDYgQPMvy9t578iN7iH from my_wallet \
  --entrypoint propose_voting_key \
  --arg '(Pair "<MY_VOTING_KEY>" False None)' --burn-cap 0.1
```

This command revokes voting rights for only the specified voting key.
If you have set up other voting keys, you must run the same command for those keys.

You do not need to use the `claim_voting_rights` entrypoint to complete the removal of baking rights.