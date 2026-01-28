---
title: Voting quickstart
dependencies:
  octez: 24.1
---

:::note

This page includes only the basic commands for voting for Etherlink kernel upgrade proposals.
For complete information, see [Participating in kernel governance](/governance/kernel-governance).

:::

## Using the governance web site

To upvote a proposed kernel update during a Proposal period, go to the [governance web site](https://governance.etherlink.com), connect your wallet (baking key or voting key), select the governance process and active period, and cast your vote.

If you prefer to use the command line instead of the governance web site, the following sections cover how to vote with the Octez client.

## Voting in the Proposal period with the command line

During a Proposal period, go to the [governance web site](https://governance.etherlink.com) and find the hash of the kernel to upvote, adding `0x` if it doesn't already start with `0x`.
Then run this command:

```bash
octez-client call <GOVERNANCE_CONTRACT> from <MY_VOTER> \
  --entrypoint "upvote_proposal" \
  --arg "0x<KERNEL_HASH>"
```

Parameters:

- `<GOVERNANCE_CONTRACT>`: The governance contract to call, either `KT1VZVNCNnhUp7s15d9RsdycP7C1iwYhAQ8r` for the slow governance process or `KT1DxndcFitAbxLdJCN3C1pPivqbC3RJxD1R` for the fast governance process; see [Governance contract addresses](/governance/overview#governance-contract-addresses)
- `<MY_VOTER>`: Your baker key or Etherlink [voting key](/governance/voting-key)
- `<KERNEL_HASH>`: The hash of the kernel to upvote, starting with `0x`

## Voting in the Promotion period with the command line

During a Promotion period, run this command to vote for or against the kernel by running this command, using `yea`, `nay`, or `pass` as the argument:

```bash
octez-client call <GOVERNANCE_CONTRACT> from <MY_VOTER> \
  --entrypoint "vote" --arg '"yea"'
```

Parameters:

- `<GOVERNANCE_CONTRACT>`: The governance contract to call, either `KT1VZVNCNnhUp7s15d9RsdycP7C1iwYhAQ8r` for the slow governance process or `KT1DxndcFitAbxLdJCN3C1pPivqbC3RJxD1R` for the fast governance process; see [Governance contract addresses](/governance/overview#governance-contract-addresses)
- `<MY_VOTER>`: Your baker key or Etherlink [voting key](/governance/voting-key)

The command does not need the hash of the kernel because only one kernel can be in the Promotion period at a time, so the options are to vote for or against that kernel or to abstain by voting "pass."
