---
title: Monitoring Etherlink nodes
---

Monitoring the behavior of the EVM node can be partially achieved by exploring the logs or through metrics.

## Metrics

Metrics for the node are always available on the `/metrics` endpoint of the address and port of the `--rpc-addr` argument. One can query this using:

```bash
curl http://<rpc_addr>:<rpc_port>/metrics
```

You will be presented with the list of defined and computed metrics as follows:

```
#HELP metric description
#TYPE metric type
octez_metric_name{label_name=label_value} x.x
```

Each exported metric has the following form:

```
octez_evm_node_metric{label_name=label_value;...} value
```

Each metric name starts with `octez` as its namespace, followed by the a subsystem name `evm_node`, and the name of the metric.
It follows the [OpenMetrics specification](https://openmetrics.io/).

A metric may provide labeled parameters which allow for different instances of the metric, with different label values.
For instance, the metric `octez_evm_node_calls_method` has a label named `method` which allows this metric to have one value for each kind of method.

```
#HELP octez_evm_node_calls_method Method call counts
#TYPE octez_evm_node_calls_method counter
octez_evm_node_calls_method{method="debug_traceTransaction"} 13594.000000
octez_evm_node_calls_method{method="eth_blockNumber"} 2.000000
...
```

Metrics provide information about the node in the form of a [gauge](https://github.com/OpenObservability/OpenMetrics/blob/main/specification/OpenMetrics.md#gauge) that can increase or decrease (like the base gas price of a block),
a [counter](https://github.com/OpenObservability/OpenMetrics/blob/main/specification/OpenMetrics.md#counter) that can only increase (like the number of calls to a particular method),
or a [histogram](https://github.com/OpenObservability/OpenMetrics/blob/main/specification/OpenMetrics.md#histogram) used to track the size of events and how long they usually take (e.g., the time spent processing a block).


The label value is sometimes used to store information that can't be described by the metric value (which can only be a float). This is used for example by the ``octez_evm_node_info`` metric that provides the current mode of the node.

   Some of the metrics are computed when scraped from the node. As there is no rate limiter, you should consider scraping wisely and adding a proxy for a public endpoint, to limit the impact on performance.


   ------- List of metrics TBA --------------

### Prometheus
### Hardware metrics
## Logs
### Loki
### Adding log sinks
## Dashboards
