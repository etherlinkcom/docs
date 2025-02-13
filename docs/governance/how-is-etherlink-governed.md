---
title: How is Etherlink governed?
---

Like Tezos, Etherlink has a built-in on-chain mechanism for proposing, selecting, testing, and activating upgrades without the need to hard fork.
This mechanism makes Etherlink self-amending and empowers Tezos bakers to govern Etherlink’s kernel upgrades, security updates, and sequencer operators.

Etherlink has separate governance processes for the kernel, for security incidents, and for the Sequencer Committee.
To ensure that decisions accurately reflect the consensus of the Etherlink community, all three governance processes are designed with the same robust safeguards.
Like Tezos's governance process, Etherlink's governance process promotes transparency and fairness in decision-making.

## Governance information

For information about governance proposals and updates, see https://governance.etherlink.com.

## Kernel governance

The Etherlink kernel governance process is a streamlined version of the [Tezos governance and self-amendment process](https://docs.tezos.com/architecture/governance).
It consists of three periods: a Proposal period and a Promotion period, which are supervised by Etherlink's kernel governance contract, and a Cooldown period, which is enforced by the Etherlink kernel itself.

### 1. Proposal period

During this period, Etherlink bakers have about 3 days to submit and upvote proposals for new kernels.
Any baker can submit kernel upgrade proposals and upvote proposals, with the weight of their vote determined by the voting power of their baker account.
Bakers can submit and upvote up to 20 proposals in a single Proposal period.

At the end of the period, if a proposal has enough voting power to meet a certain percentage of the total voting power, it moves to the next phase.
If no proposal gathers adequate support, a new Proposal period begins.

### 2. Promotion period

When a proposal moves to the Promotion period, bakers vote on whether to adopt the proposed kernel update.
The Promotion period is the same length as the Proposal period.
To pass, the proposal must meet both of these requirements:

- Quorum: A quorum of all of the voting power in the system must vote either "Yea", "Nay", or "Pass."

- Supermajority: The total voting power of the Yea votes must reach a supermajority.

The thresholds for these requirements are stored in the governance contract.

If the proposal reaches both the quorum and supermajority requirements, it moves to the next period.
In either case, a new Proposal period begins.

### 3. Cooldown period

The Cooldown period is a delay in the process that gives developers and bakers time to adapt their code and infrastructure to the new Etherlink kernel.
This period lasts 24 hours, and at the end, Etherlink users can trigger the kernel to upgrade itself to the new kernel.

This period can overlap with another Proposal period.

### Alignment with Tezos layer 1 governance

Etherlink kernel governance periods are synchronized with layer 1 governance periods:

- Each Proposal and Promotion period must happen within a single Tezos layer 1 governance period; a single period cannot overlap with two different layer 1 governance periods.
This ensures that each delegate's voting power is the same throughout the period.
- The start of a layer 1 governance period always coincides with the start of an Etherlink Proposal or Promotion period.
However, because Etherlink periods are shorter than layer 1 periods, Etherlink periods can also start in the middle of a layer 1 governance period.

## Security governance

A separate security governance contract handles security updates.
Its security governance mechanism prioritizes swift responses to incidents while safeguarding community consensus.

The security governance process is like the kernel governance process, with these differences:

- The quorum and supermajority requirements are higher
- The timeframes are shorter

These changes ensure expedited resolution of urgent issues while upholding integrity by demanding higher quorum to prevent potential nefarious actions.

## Sequencer Committee governance

A separate sequencer governance contract handles the selection process for Etherlink's Sequencer Committee.

Similar to the kernel and security governance processes, the Sequencer Committee voting process has Proposal and Promotion periods.
In this process, bakers propose and vote on members for the Sequencer Committee.
