---
title: Participating in kernel governance
dependencies:
  octez: 24.1
---

:::note

For simplified instructions for voting for Etherlink kernel upgrades, see [Voting (fast path instructions)](/governance/fast-path).

:::

Bakers can vote on kernel updates with these commands.
The commands are the same for slow and fast upgrades but they target different governance contracts.

## Getting information about the current period

You can get information about the current period at https://governance.etherlink.com.

To get information about the current state of either kernel governance contract directly from the contract, connect the Octez client to an active node and call the contract's `get_voting_state` view.
For example, this Octez client command calls this view for the slow governance contract on Mainnet:

```bash
octez-client -E https://mainnet.ecadinfra.com \
  run view get_voting_state on contract KT1VZVNCNnhUp7s15d9RsdycP7C1iwYhAQ8r
```

The view returns information about the current governance period in this order:

- The index of the current period
- Whether the current period is Proposal (`Left Unit`) or Promotion (`Right Unit`)
- The number of blocks remaining in the period
- Information about voting during the period

For example, this response shows that the contract is currently in the Proposal period:

```
(Pair 1619 (Left Unit) 64 None)
```

Block explorers and the [governance web site](https://governance.etherlink.com) show this information in a more human-readable format.

You can also subscribe to the `voting_finished` event to be notified when the Proposal period completes.

## Upvoting upgrades in the Proposal period

To upvote a proposed kernel update during a Proposal period, go to the [governance web site](https://governance.etherlink.com), connect your wallet (baking key or voting key), select the governance process and active period, and cast your vote.

As an alternative, call the `upvote_proposal` entrypoint with the same parameters as the `new_proposal` entrypoint:

```bash
octez-client call KT1VZVNCNnhUp7s15d9RsdycP7C1iwYhAQ8r from my_wallet \
  --entrypoint "upvote_proposal" \
  --arg "0x<KERNEL_HASH>"
```

## Voting for or against upgrades in the Promotion period

When a proposal is in the Promotion period, you can vote for or against it by going to the [governance web site](https://governance.etherlink.com), connecting your wallet (baking key or voting key), selecting the governance process and active period, and casting your vote.

As an alternative, you can vote for it by calling the `vote` entrypoint of the appropriate governance contract:

```bash
octez-client call KT1VZVNCNnhUp7s15d9RsdycP7C1iwYhAQ8r from my_wallet \
  --entrypoint "vote" --arg '"yea"'
```

The command takes these parameters:

- The address or Octez client alias of your baker account or voting key
- The address of the Etherlink kernel governance contract
- `"yea"`, `"nay"`, or `"pass"`, including the double quotes

The command does not need the hash of the kernel because only one kernel can be in the Promotion period at a time, so the options are to vote for or against that kernel or to abstain by voting "pass."
