---
title: Participating in sequencer governance
dependencies:
  octez: 24.1
---

Bakers can propose the account to operate Etherlink's sequencer, vote for or against proposed operators, and trigger the change to a new account.

## Getting information about the current period

You can get information about the current period at https://governance.etherlink.com.

To get information about the current state of the sequencer operator governance contract directly from the contract, call its `get_voting_state` view.
For example, this Octez client command calls this view for the kernel governance contract on Mainnet:

```bash
octez-client -E https://mainnet.ecadinfra.com \
  run view get_voting_state on contract KT1WckZ2uiLfHCfQyNp1mtqeRcC1X6Jg2Qzf
```

The view returns information about the current governance period.
Block explorers show this information in a more human-readable format.

You can also subscribe to the `voting_finished` event to be notified when the Proposal period completes.

## Proposing and voting for a new operator

To propose an account to be the sequencer operator, bakers can call the `new_proposal` entrypoint of the governance contract during the Proposal period:

```bash
octez-client transfer 0 from my_wallet to KT1WckZ2uiLfHCfQyNp1mtqeRcC1X6Jg2Qzf \
  --entrypoint new_proposal \
  --arg 'Pair "<PUBLIC_KEY>" <L2_ADDRESS>'
```

The command takes these parameters:

- The address or Octez client alias of your baker account or voting key
- The address of the sequencer governance contract (referred to on the block explorer as the sequencer committee governance contract)
- The public key (not the public key hash or account address) of the account to propose, including the double quotes, represented in this example as `<PUBLIC_KEY>`
- The Etherlink address of the account to propose, represented in this example as `<L2_ADDRESS>`

For example:

```bash
octez-client call KT1WckZ2uiLfHCfQyNp1mtqeRcC1X6Jg2Qzf from my_wallet \
  --entrypoint new_proposal \
  --arg 'Pair "<PUBLIC_KEY>" <L2_ADDRESS>'
```

To upvote a proposed sequencer operator during a Proposal period, go to the [governance web site](https://governance.etherlink.com), connect your wallet (baking key or voting key), select the governance process and active period, and cast your vote.

As an alternative, call the `upvote_proposal` entrypoint with the same parameters as the `new_proposal` entrypoint:

```bash
octez-client call KT1WckZ2uiLfHCfQyNp1mtqeRcC1X6Jg2Qzf from my_wallet \
  --entrypoint upvote_proposal \
  --arg 'Pair "<PUBLIC_KEY>" <L2_ADDRESS>'
```

It's not necessary to upvote a proposal that you submitted; submitting a proposal implies that your account upvotes it.

## Voting for or against an operator

When a proposal is in the Promotion period, you can vote for or against it by going to the [governance web site](https://governance.etherlink.com), connecting your wallet (baking key or voting key), selecting the governance process and active period, and casting your vote.

As an alternative, you can vote for or against it or pass on voting by calling the `vote` entrypoint of the governance contract:

```bash
octez-client call KT1WckZ2uiLfHCfQyNp1mtqeRcC1X6Jg2Qzf from my_wallet \
  --entrypoint "vote" --arg '"yea"'
```

The command takes these parameters:

- The address or Octez client alias of your baker account or voting key
- The address of the sequencer governance contract
- `"yea"`, `"nay"`, or `"pass"`, including the double quotes

For example:

```bash
octez-client call KT1WckZ2uiLfHCfQyNp1mtqeRcC1X6Jg2Qzf from tz1RLPEeMxbJYQBFbXYw8WHdXjeUjnG5ZXNq \
  --entrypoint "vote" --arg '"yea"'
```

## Triggering sequencer operator updates

After a proposed account wins a vote, any account can trigger the change and enable that account to run the sequencer by calling the governance contract's `trigger_committee_upgrade` entrypoint:

```bash
octez-client call KT1WckZ2uiLfHCfQyNp1mtqeRcC1X6Jg2Qzf from my_wallet \
  --entrypoint "trigger_committee_upgrade" \
  --arg '"sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf"'
```

The command takes these parameters:

- The address or Octez client alias of your baker account or voting key
- The address of the sequencer governance contract
- The address of the Etherlink Smart Rollup; the parameter must include the double quotes
