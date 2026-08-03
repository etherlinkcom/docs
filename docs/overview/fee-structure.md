---
title: Fee Structure
---

# Fee Structure

Each transaction on Etherlink<!--TX--> incurs three categories of fees.

## Execution and storage fees

Execution fees cover the computation cost of running a transaction. 
Storage fees compensate for permanent on-chain storage allocation:

Both interfaces use gas as the unit of execution:

- In the **EVM interface**, gas covers both computation and storage allocation — `SSTORE` operations consume gas. The fee is `gas_consumed × base_fee_per_gas`.
- In the **Michelson interface**, gas covers computation, while storage allocation is charged separately as a burn at a fixed rate per byte allocated: `fee = gas_consumed × base_fee_per_gas + bytes_allocated × cost_per_byte`.

`base_fee_per_gas` is determined by the Etherlink<!--TX--> kernel at the start of each block and adjusts dynamically based on network load.

Execution and storage fees are **burnt**.

## Inclusion fees

Inclusion fees cover the cost of publishing blueprints to Tezos Layer 1. All runtimes charge the same cost per byte for inclusion fees, based on transaction size.

From the **Michelson interface**'s point of view, inclusion fees are **burnt**. At the Etherlink<!--TX--> block level, the equivalent amount is credited to the **sequencer pool address on the EVM interface**, ensuring the sequencer is compensated regardless of which interface originated the transaction.

## Minimal fee

Each runtime may also apply a minimum fee per transaction, which is **burnt**.
