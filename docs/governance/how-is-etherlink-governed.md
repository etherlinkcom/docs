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

For the addresses of the contracts that manage governance, see [How do I participate in governance?](/governance/how-do-i-participate-in-governance).

## Kernel governance

The Etherlink kernel governance process is a streamlined version of the [Tezos governance and self-amendment process](https://docs.tezos.com/architecture/governance).
It consists of three periods: a Proposal period and a Promotion period, which are supervised by Etherlink's kernel governance contract, and a Cooldown period, which is enforced by the Etherlink kernel itself.

The lengths of these periods are stored in the [kernel governance contract](https://better-call.dev/mainnet/KT1H5pCmFuhAwRExzNNrPQFKpunJx1yEVa6J).
This table shows the period lengths as of the Bifröst Etherlink update and the Tezos Quebec protocol:

Period | Length | Approximate time
--- | --- | ---
Proposal | 20480 layer 1 blocks | About 2 days
Promotion | 20480 layer 1 blocks | About 2 days
Cooldown | 86400 seconds | About 1 day

Note that these periods can vary.
For example, 8 seconds is the minimal block time on layer 1, which means that blocks can take longer than 8 seconds and therefore periods that are based on blocks can last longer than this minimal time.
Also, an Etherlink user must trigger the protocol upgrade after the Cooldown period is over, so the exact time of the upgrade can vary.

### 1. Proposal period

During this period, Etherlink bakers submit and upvote proposals for new kernels.
Any baker can submit kernel upgrade proposals and upvote proposals, with the weight of their vote determined by the voting power of their baker account.
Bakers can submit and upvote up to 20 proposals in a single Proposal period.

At the end of the period, if a proposal has enough voting power to meet a certain percentage of the total voting power, it moves to the next phase.
As of the Bifröst update, the leading proposal must gather support from at least 1% of the total voting power to move to the next phase.
If no proposal gathers adequate support, a new Proposal period begins.

### 2. Promotion period

When a proposal moves to the Promotion period, bakers vote on whether to adopt the proposed kernel update.
The Promotion period is the same length as the Proposal period.
To pass, the proposal must meet both of these requirements:

- Quorum: A quorum of all of the voting power in the system must vote either "Yea", "Nay", or "Pass."

- Supermajority: The total voting power of the Yea votes must reach a supermajority.

The thresholds for these requirements are stored in the governance contract.
This table shows the requirements as of the Bifröst Etherlink update:

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

## Security governance

A separate security governance contract handles security updates.
Its security governance mechanism prioritizes swift responses to incidents while safeguarding community consensus.

The security governance process is like the kernel governance process, with these differences:

- The quorum and supermajority requirements are higher
- The timeframes are shorter

### Periods

The security governance process has the same Proposal, Promotion, and Cooldown periods as the kernel governance process, but the lengths of these periods are different.
The lengths are stored in the [security governance contract](https://better-call.dev/mainnet/KT1N5MHQW5fkqXkW9GPjRYfn5KwbuYrvsY1g).
This table shows the period lengths as of the Bifröst Etherlink update and the Tezos Quebec protocol:

Period | Length | Approximate time
--- | --- | ---
Proposal | 2560 layer 1 blocks | About 5.5 hours
Promotion | 2560 layer 1 blocks | About 5.5 hours
Cooldown | 86400 seconds | About 1 day

Like the kernel governance periods, these periods can vary based on the timing of layer 1 blocks and when users activate the new kernel at the end of the Cooldown period.

### Thresholds

The differences in thresholds in the security governance process ensure expedited resolution of urgent issues while upholding integrity by demanding higher quorum to prevent potential nefarious actions.

The thresholds for the quorum and supermajority requirements are stored in the governance contract.
This table shows the requirements as of the Bifröst Etherlink update:

Period | Requirement | Threshold
--- | --- | ---
Proposal | Quorum | 5% of all voting power must vote for a specific proposal
Promotion | Quorum | 15% of all voting power must vote Yea, Nay, or Pass
Promotion | Supermajority | 80% of Yea or Nay votes must be Yea

## Sequencer Committee governance

A separate sequencer governance contract handles the selection process for Etherlink's Sequencer Committee.

### Periods

Similar to the kernel and security governance processes, the Sequencer Committee voting process has Proposal, Promotion, and Cooldown periods.
In this process, bakers propose and vote on members for the Sequencer Committee.

The lengths of the periods are stored in the [sequencer committee governance contract](https://better-call.dev/mainnet/KT1NcZQ3y9Wv32BGiUfD2ZciSUz9cY1DBDGF).
This table shows the period lengths as of the Bifröst Etherlink update and the Tezos Quebec protocol:

Period | Length | Approximate time
--- | --- | ---
Proposal | 40960 layer 1 blocks | About 4 days
Promotion | 40960 layer 1 blocks | About 4 days
Cooldown | 86400 seconds | About 1 day

### Thresholds

The thresholds for the quorum and supermajority requirements are stored in the governance contract.
This table shows the requirements as of the Bifröst Etherlink update:

Period | Requirement | Threshold
--- | --- | ---
Proposal | Quorum | 1% of all voting power must vote for a specific proposal
Promotion | Quorum | 8% of all voting power must vote Yea, Nay, or Pass
Promotion | Supermajority | 75% of Yea or Nay votes must be Yea
