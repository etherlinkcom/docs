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

Scraping metrics gives you instant values of the metrics. For more effective monitoring, create a time series of these metrics.

We suggest using [Prometheus](https://prometheus.io/) for that purpose.

First, you need to install Prometheus from your favourite package manager, e.g.

```bash
sudo apt install prometheus
```

When Prometheus is installed, add the scraping job to the configuration file, by default `/etc/prometheus/prometheus.yml`.

```yaml
- job_name: 'octez-evm-node-exporter'
  scrape_interval: <interval> s
  metrics_path: "/metrics"
  static_configs:
    - targets: ['<addr>:<port>']
```

By default, the EVM node exposes its JSON RPC API endpoint to `localhost:8545`.

Note that Prometheus can also scrape metrics from several nodes.

Prometheus is a service, so you need to start it:

```bash
sudo systemctl start prometheus
```

You may visualize the log in real time to make sure the service works correctly:

```bash
sudo journalctl --follow --unit=prometheus.service
```

#### History size

By default, Prometheus keeps 15 days of data. It may be useful to increase the history window to keep wider history. To do so, update the Prometheus service execution argument (typically, in `/etc/systemd/system/multi-user.target.wants/prometheus.service`).
To increase the history to 30 days, simply update the following line:
```
  ExecStart=/usr/bin/prometheus $ARGS --storage.tsdb.retention 30d
```
It is also possible to limit the size of the history by adding `--storage.tsdb.retention.size 5GB`. The first limit reached will trigger the cleanup.
You can also add `--storage.tsdb.path <path>` to change the path were Prometheus stores data.

There are RPCs to trigger an early garbage collection of the Prometheus data but this requires you to start the Prometheus RPC server and tweak some rights. Alternatively, the easiest way to delete the whole history is to remove the output directory (typically, `/var/lib/prometheus/metrics2/`).

Make sure to restart the Prometheus service after updating its parameters.

#### Hardware metrics {#hardware-metrics}

In addition to node metrics, you may want to gather other information and statistics for effective monitoring, such as hardware metrics.

For that purpose, we suggest using [Prometheus Node Exporter](https://github.com/prometheus/node_exporter).

To install node exporter:

```bash
sudo apt install prometheus-node-exporter
```

Prometheus Node Exporter is a service, so you need to start it:

```bash
sudo systemctl start prometheus-node-exporter
```

To check that everything is working you may check the metrics endpoint:

```bash
curl localhost:9100/metrics
```


Then you need to configure a scraping job on the prometheus config:

```yaml
- job_name: 'node-exporter'
  scrape_interval: <interval> s
  static_configs:
    - targets: ['<addr>:<port>']
```

The target address of the node exporter is typically `localhost:9100`.

## Logs
### Loki
### Adding log sinks
## Dashboards
