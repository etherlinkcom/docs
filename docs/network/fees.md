---
title: Fee structure
---

Etherlink transactions include two fees:

- The _execution fee_, sometimes known as the _gas fee_, is a fee for running the transaction.
It changes depending on Etherlink throughput over time; at times of high demand for Etherlink transactions, the gas fee rises.
- The _inclusion fee_ helps defray the cost of the data that Etherlink stores on Tezos layer 1.
Transactions that use more data pay a higher fee.

Unlike some other chains, Etherlink does not use a voluntary gas fee, also known as a tip, to encourage block producers to include transactions more quickly.
Because the Etherlink sequencer orders transactions in first-come-first-serve order, there is no need to offer higher fees for faster inclusion.
Etherlink ignores any fees included in the transaction beyond the execution fee and the inclusion fee.

## Gas fee

The gas fee changes based on the transaction throughput over time.

Etherlink measures throughput in terms of _ticks_, which are processing operations.
As demand increases, Etherlink increases the number of ticks per second to process more transactions in the same amount of time.

Etherlink has a target number of ticks per second, referred to as the _speed limit_.
To calculate the actual throughput, Etherlink stores the number of ticks used and subtracts the speed limit every second.
The remaining number of ticks is known as the _backlog_.

In this way, if the number of ticks per second exceeds the speed limit, the backlog increases and the gas fee goes up.
If the number of ticks per second is below the speed limit, the backlog decreases or reaches zero and the gas fee decreases or reaches a base amount.
The backlog never goes below zero and the gas fee never goes below the base amount.

The gas fee depends on these parameters:

- `minimum_base_fee_per_gas`: The base fee for Etherlink transactions, which is 1 gwei
- `speed_limit`: The target number of ticks per second
- `tolerance`: The size the backlog is allowed to grow to, before the gas price increases
- `backlog`: A measure of the number of ticks per second in excess of the speed limit; Etherlink deducts the speed limit from the backlog every second
- `alpha`: A scaling factor

If the backlog is less than the tolerance, the gas fee for a transaction is `minimum_base_fee_per_gas`.

If the backlog is greater than the tolerance, Etherlink calculates the gas fee with this equation:

$$
\texttt{gas fee} = \texttt{minimum\_base\_fee\_per\_gas} * e ^{a * (\texttt{backlog} - \texttt{tolerance})}
$$

In other words, the gas fee is the base fee times Euler's number to the power of the alpha scaling factor times the backlog in excess of the tolerance.

## Storage fee

The storage fee, also called the _data availability fee_, helps Etherlink cover the cost of posting data to layer 1.

The amount of the fee depends on the size of the data in the transaction (as provided by `tx.data.size()`) and the size of the access list, a list of addresses and storage keys that a transaction intends to access (as provided by `tx.access_list.size()`).

Etherlink calculates the storage fee with this equation:

$$
\texttt{0.000004 XTZ} * (150 + \texttt{tx.data.size()} + \texttt{tx.access\_list.size()})
$$
