---
title: How is Etherlink governed?
---

Like Tezos, Etherlink has a built-in on-chain mechanism for proposing, selecting, testing, and activating upgrades without the need to hard fork.
This mechanism makes Etherlink self-amending and empowers Tezos bakers to govern Etherlink’s kernel upgrades and sequencer operators.

Etherlink has two separate governance processes for the kernel and one for the sequencer.
To ensure that decisions accurately reflect the consensus of the Etherlink community, all governance processes are designed with the same robust safeguards.
Like Tezos's governance process, Etherlink's governance process promotes transparency and fairness in decision-making.

Two different processes are used for kernel upgrades: slow and fast.

- The **slow** kernel governance process is intended for larger changes or changes that require more time to evaluate and test before they go live.

- The **fast** kernel governance process is intended for smaller, simpler, or more urgent changes.
However, there is no requirement that small changes go through the fast governance process; they can also go through the slow process if they are not urgent.
In some cases, Etherlink developers share the code for fast updates with only a subset of bakers to avoid revealing security flaws before they can be fixed.

- [Kernel governance (slow)](#kernel-governance-slow)
- [Kernel governance (fast)](#kernel-governance-fast)
- [Sequencer](#sequencer-governance)

:::note

Each Etherlink governance period lasts a certain number of layer 1 blocks.
The minimum time between layer 1 blocks is set by the `minimal_block_delay` constant.
If the first baker chosen to bake a block does not bake it after a certain amount of time, other bakers have the opportunity to bake it, which increases the time between blocks.

For this reason, the lengths of Etherlink governance periods listed below are approximate times.
The real-world duration of governance periods can be longer, depending on the actual timing of layer 1 blocks.

:::

## Governance information

For information about governance proposals and updates, see https://governance.etherlink.com.

For the addresses of the contracts that manage governance, see [How do I participate in governance?](/governance/how-do-i-participate-in-governance).

## Kernel governance (slow)

The Etherlink slow kernel governance process is a streamlined version of the [Tezos governance and self-amendment process](https://docs.tezos.com/architecture/governance).
It consists of three periods: a Proposal period and a Promotion period, which are supervised by Etherlink's kernel governance contract, and a Cooldown period, which is enforced by the Etherlink kernel itself.

The lengths of these periods are stored in the [kernel governance contract](https://better-call.dev/mainnet/KT1XdSAYGXrUDE1U5GNqUKKscLWrMhzyjNeh).
This table shows the period lengths as of the Dionysus Etherlink update and the Tezos Rio protocol:

Period | Length | Approximate time
--- | --- | ---
Proposal | 50400 layer 1 blocks | About 4.5 days
Promotion | 50400 layer 1 blocks | About 4.5 days
Cooldown | 86400 seconds | About 1 day

Note that these periods can vary.
For example, 8 seconds is the minimal block time on layer 1, which means that blocks can take longer than 8 seconds and therefore periods that are based on blocks can last longer than this minimal time.
Also, an Etherlink user must trigger the protocol upgrade after the Cooldown period is over, so the exact time of the upgrade can vary.

### 1. Proposal period

During this period, Tezos bakers submit and upvote proposals for new kernels.
Any baker can submit kernel upgrade proposals and upvote proposals, with the weight of their vote determined by the voting power of their baker account.
Bakers can submit and upvote up to 20 proposals in a single Proposal period.

At the end of the period, if a proposal has enough voting power to meet a certain percentage of the total voting power, it moves to the next phase.
As of the Dionysus update, the leading proposal must gather support from at least 1% of the total voting power to move to the next phase.
If no proposal gathers adequate support, a new Proposal period begins.

### 2. Promotion period

When a proposal moves to the Promotion period, bakers vote on whether to adopt the proposed kernel update.
The Promotion period is the same length as the Proposal period.
To pass, the proposal must meet both of these requirements:

- Quorum: A quorum of all of the voting power in the system must vote either "Yea", "Nay", or "Pass."

- Supermajority: The total voting power of the Yea votes must reach a supermajority.

The thresholds for these requirements are stored in the governance contract.
This table shows the requirements as of the Dionysus Etherlink update:

Requirement | Threshold
--- | ---
Quorum | 5% of all voting power must vote Yea, Nay, or Pass
Supermajority | 75% of Yea or Nay votes must be Yea

If the proposal reaches both the quorum and supermajority requirements, it moves to the next period.
In either case, a new Proposal period begins.

### 3. Cooldown period

The Cooldown period is a delay in the process that gives developers and bakers time to adapt their code and infrastructure to the new Etherlink kernel.
This period lasts about 24 hours, and at the end, Etherlink users can trigger the kernel to upgrade itself to the new kernel.

This period can overlap with another Proposal period.

### Alignment with Tezos layer 1 governance

Etherlink kernel governance periods are synchronized with layer 1 governance periods:

- Each Proposal and Promotion period must happen within a single Tezos layer 1 governance period; a single period cannot overlap with two different layer 1 governance periods.
This ensures that each delegate's voting power is the same throughout the period.
- The start of a layer 1 governance period always coincides with the start of an Etherlink Proposal or Promotion period.
However, because Etherlink periods are shorter than layer 1 periods, Etherlink periods can also start in the middle of a layer 1 governance period.

## Kernel governance (fast)

The fast kernel governance process is separate from the slow process.
It uses a separate smart contract to handle smaller, simpler, or more urgent changes and prioritizes quick improvements for users and swift responses to incidents while safeguarding community consensus.

The fast kernel governance process is like the slow kernel governance process, with these differences:

- The quorum and supermajority requirements are higher
- The timeframes are shorter

### Periods

The fast governance process has the same Proposal, Promotion, and Cooldown periods as the slow governance process, but the lengths of these periods are different.
The lengths are stored in the [fast governance contract](https://better-call.dev/mainnet/KT1D1fRgZVdjTj5sUZKcSTPPnuR7LRxVYnDL).
This table shows the period lengths as of the Dionysus Etherlink update and the Tezos Rio protocol:

Period | Length | Approximate time
--- | --- | ---
Proposal | 3600 layer 1 blocks | About 8 hours
Promotion | 3600 layer 1 blocks | About 8 hours
Cooldown | 86400 seconds | About 1 day

Like the slow governance periods, these periods can vary based on the timing of layer 1 blocks and when users activate the new kernel at the end of the Cooldown period.

### Thresholds

The differences in thresholds in the security governance process ensure expedited resolution of urgent issues while upholding integrity by demanding higher quorum to prevent potential nefarious actions.

The thresholds for the quorum and supermajority requirements are stored in the governance contract.
This table shows the requirements as of the Dionysus Etherlink update:

Period | Requirement | Threshold
--- | --- | ---
Proposal | Quorum | 5% of all voting power must vote for a specific proposal
Promotion | Quorum | 15% of all voting power must vote Yea, Nay, or Pass
Promotion | Supermajority | 80% of Yea or Nay votes must be Yea

## Sequencer governance

A separate sequencer governance contract handles the selection process for Etherlink's sequencer.

### Periods

Similar to the kernel governance processes, the sequencer voting process has Proposal, Promotion, and Cooldown periods.
In this process, bakers propose and vote on the account that operates the sequencer.

The lengths of the periods are stored in the [sequencer governance contract](https://better-call.dev/mainnet/KT1NnH9DCAoY1pfPNvb9cw9XPKQnHAFYFHXa).
This table shows the period lengths as of the Dionysus Etherlink update and the Tezos Rio protocol:

Period | Length | Approximate time
--- | --- | ---
Proposal | 50400 layer 1 blocks | About 4.5 days
Promotion | 50400 layer 1 blocks | About 4.5 days
Cooldown | 86400 seconds | About 1 day

### Thresholds

The thresholds for the quorum and supermajority requirements are stored in the governance contract.
This table shows the requirements as of the Dionysus Etherlink update:

Period | Requirement | Threshold
--- | --- | ---
Proposal | Quorum | 1% of all voting power must vote for a specific proposal
Promotion | Quorum | 8% of all voting power must vote Yea, Nay, or Pass
Promotion | Supermajority | 75% of Yea or Nay votes must be Yea
