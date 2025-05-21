---
title: Fee structure
---

The Etherlink gas price (and therefore the fee for a given transaction) varies based on the activity on the chain.
As activity increases, fees increase, and vice versa.
For information about estimating fees, see [Estimating fees](/building-on-etherlink/estimating-fees).

Etherlink fees include the cost of running the transaction and writing the transaction to layer 1. It's not possible to set a voluntary tip or priority fee to increase the chances of a transaction being accepted, if included as part of the transaction parameters it will be ignored.

Etherlink transactions include two fees:

- The _execution fee_, sometimes known as the _gas fee_, is a fee for running the transaction.
It changes depending on Etherlink throughput over time; at times of high demand for Etherlink transactions, the gas fee rises.
This fee is burned.
- The _inclusion fee_ goes to the sequencer to defray the cost of the data that Etherlink stores on Tezos layer 1.
Transactions that use more data pay a higher fee.

Unlike some other chains, Etherlink does not use a voluntary gas fee, also known as a tip, to encourage block producers to include transactions more quickly.
Because the Etherlink sequencer orders transactions in first-come-first-served order, there is no need to offer higher fees for faster inclusion.

The base fee of the transaction (in the Ethereum `max_fee_per_gas` [EIP-1559](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md) field) must be enough to cover these Etherlink fees.
Etherlink ignores the priority fee in the `max_priority_fee_per_gas` field.
If the transaction's base fee is not enough to cover Etherlink's fees, the transaction fails, even if the amount of the priority fee would be enough to cover the fee.

## Execution fee

The execution fee changes based on the transaction throughput over time.

Etherlink measures throughput in terms of the amount of execution gas (that is, the units of computation used to execute transactions) used over time.
As demand increases and more execution gas is used in a shorter time, Etherlink increases the gas price to increase the execution fee.

Etherlink has a target amount of execution gas to use per second, referred to as the _speed limit_.
The speed limit is currently set to 2 million gas per second.
To calculate the throughput, Etherlink records the total execution gas used and subtracts the speed limit every second.
The remaining execution gas amount is known as the _backlog_.

In this way, if the execution gas used per second exceeds the speed limit for a certain amount of time, the backlog increases and the execution fee can go up.
If the gas used per second is below the speed limit, the backlog decreases or reaches zero and the execution fee decreases or reaches a base amount.
The backlog never goes below zero and the execution fee never goes below the base amount.

The execution fee depends on these parameters:

- `minimum_base_fee_per_gas`: The base fee for Etherlink transactions, which is 1 gwei
- `speed_limit`: The target amount of execution gas used per second
- `tolerance`: The size the backlog is allowed to grow to before the execution fee increases
- `backlog`: A measure of the amount of execution gas used in excess of the speed limit; Etherlink deducts the speed limit from the backlog every second
- `alpha`: A scaling factor

If the backlog is less than the tolerance, the execution fee for a transaction is `minimum_base_fee_per_gas`.

If the backlog is greater than the tolerance, Etherlink calculates the execution fee with this equation:

$$
\texttt{execution fee} = \texttt{minimum\_base\_fee\_per\_gas} * e ^{a * (\texttt{backlog} - \texttt{tolerance})}
$$

In other words, the execution fee is the minimum fee times the exponential function of the alpha scaling factor times the backlog in excess of the tolerance.

## Inclusion fee

The inclusion fee, also called the _data availability fee_, helps Etherlink cover the cost of posting data to layer 1.

The amount of the fee depends on the size of the data in the transaction (as provided by `tx.data.size()`) and the size of the access list, a list of addresses and storage keys that a transaction intends to access (as provided by `tx.access_list.size()`).

Etherlink calculates the inclusion fee with this equation:

$$
\texttt{0.000004 XTZ} * (150 + \texttt{tx.data.size()} + \texttt{tx.access\_list.size()})
$$

## Block gas limit

The block gas limit, or the maximum total amount of execution fees in a single Etherlink block, is 30 million gas units (i.e. excluding inclusion fees).
Transactions that require a higher execution fee fail.

There is no straightforward way of determining the execution fee for a transaction because estimating transaction fees with the `eth_estimateGas` endpoint the sum of the execution fee and the inclusion fee is returned as a single amount.
For this reason, some large transactions with a total fee higher than the gas limit may succeed because the execution fee is still less than the gas limit.
