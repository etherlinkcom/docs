---
title: Proposing kernel upgrades
dependencies:
  octez: 24.1
---

:::note

Only the baker that proposes the upgrade runs this command.
Other bakers use different commands to vote for or against it, as described in [Participating in kernel governance](/governance/kernel-governance).

:::

During a Proposal period, bakers can propose updates by calling the `new_proposal` entrypoint of the appropriate governance contract and passing the hash of their proposed kernel, as in this example, which uses `<KERNEL_HASH>` as the kernel hash:

```bash
octez-client call KT1VZVNCNnhUp7s15d9RsdycP7C1iwYhAQ8r from my_wallet \
  --entrypoint "new_proposal" \
  --arg "0x<KERNEL_HASH>"
```

The command takes these parameters:

- The address or Octez client alias of your baker account or [voting key](/governance/voting-key)
- The address of the Etherlink kernel governance contract, either `KT1VZVNCNnhUp7s15d9RsdycP7C1iwYhAQ8r` for the slow governance process or `KT1DxndcFitAbxLdJCN3C1pPivqbC3RJxD1R` for the fast governance process; see [Governance contract addresses](/governance/overview#governance-contract-addresses)
- The hash of the upgraded kernel, which the proposer must generate from the code of the new kernel

The proposer must make the code and hash of the new kernel available for people to evaluate.
You can look for this information in blog posts or other announcements from proposal developers.
Proposers can make it easier for bakers to upgrade to the new kernel by providing the preimages for the kernel online so nodes can update from them directly.

It's not necessary to upvote a proposal that you submitted; submitting a proposal implies that your account upvotes it.
