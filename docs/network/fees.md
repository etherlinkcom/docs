---
title: Fee structure
---

Etherlink transactions include two fees:

- The _gas fee_ changes depending on Etherlink throughput over time.
As the demand for Etherlink transactions increases, the gas fee rises.
- The _storage fee_ is proportional to the amount of data that Etherlink stores on Tezos layer 1.
Transactions that use more data pay a higher fee.

Unlike some other chains, Etherlink does not use a voluntary gas fee, also known as a tip, to encourage block producers to include transactions more quickly.
Because the Etherlink sequencer orders transactions in first-come-first-serve order, there is no need to offer higher fees for faster inclusion.

## Gas fee

The gas fee changes based on the transaction throughput over time.

Etherlink measures throughput in terms of _ticks_, which are processing operations.
As demand increases, Etherlink increases the number of ticks per second to process more transactions in the same amount of time.

Etherlink has a target number of ticks per second, referred to as the _speed limit_.
To calculate the actual throughput, Etherlink stores the number of actual ticks and subtracts the speed limit every second.
This number of ticks that exceed the speed limit is called the _backlog_.

In this way, if the number of ticks per second exceeds the speed limit, the backlog increases and the gas fee goes up.
If the number of ticks per second is below the speed limit, the backlog decreases or reaches zero and the gas fee decreases or reaches a base amount.
The backlog never goes below zero and the gas fee never goes below the base amount.

The gas fee depends on these parameters:

- `minimum_base_fee_per_gas`: The base fee for Etherlink transactions, which is 1 gwei
- `speed_limit`: The target number of ticks per second
- `tolerance`: The number of ticks that the actual number of ticks per second can exceed the speed limit without increasing the gas fee
- `backlog`: A measure of the number of ticks per second in excess of the speed limit; Etherlink deducts the speed limit from the backlog every second
- `alpha`: A scaling factor

If the backlog is less than the tolerance, the gas fee for a transaction is `minimum_base_fee_per_gas`.

If the backlog is greater than the tolerance, Etherlink calculates the gas fee according to this equation:

`minimum_base_fee_per_gas * exp(alpha * (backlog - tolerance)`

In other words, the gas fee is the base fee times Euler's number to the power of the alpha scaling factor times the backlog in excess of the tolerance.

## Storage fee

TODO

Is this like the storage fee portion of a Tezos L1 transaction?
