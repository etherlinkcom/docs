---
title: Monitoring Etherlink nodes
---

Monitoring the behavior of the EVM node can be partially achieved by exploring the logs or through metrics.

## Metrics

Metrics for the node are always available on the `/metrics` endpoint of the address and port of the node (by default "http://127.0.0.1:8545"). One can query this using:

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

### Metrics listing

Some of the metrics are computed when scraped from the node. As there is no rate limiter, you should consider scraping wisely and adding a proxy for a public endpoint, to limit the impact on performance.

The metric names in the table omit the namespace and subsystem for readability, so to have the full metric name you must add `octez_evm_node_`, e.g. `octez_evm_node_boostrapping`.

|             Metric names       |    Type   |                                                       Description                                                      |    Relevant mode    |
|:------------------------------:|:---------:|:----------------------------------------------------------------------------------------------------------------------:|:-------------------:|
| bootstrapping                  | gauge     | 0.0 if the EVM node is caught up with its upstream EVM node or 1.0 if it is in the process of bootstrapping            | Observer, RPC       |
| head                           | gauge     | Level of the node’s head                                                                                               | all                 |
| confirmed_head                 | gauge     | Confirmed level (smart rollup node's head, ie as registered on L1)                                                     | all                 |
| gas_price                      | gauge     | Base gas price of the last block                                                                                       | sequencer, observer | 
| info                           | gauge     | Information about the kernel (commit hash and date), the node (mode)  and the targeted rollup (smart_rollup_address)   | all                 |
| block_process_time_histogram   | histogram | The time the EVM node spent processing a block. Buckets : [0.1; 0.1; 0.5; 1.; 2.; 5.; 10.; infinity] (in seconds)      | Sequencer, observer |
| time_processed                 | counter   | Time to process blocks                                                                                                 | Sequencer, observer |
| transactions                   | counter   | Number of transactions in the blocks                                                                                   | all                 |
| calls                          | summary   | RPC endpoint call counts and sum of execution times                                                                    | all                 |
| calls_method                   | counter   | Method call counts                                                                                                     | all                 |
| tx_pool                        | gauge     | Metrics about transaction pool content (computed when scraped)                                                         | sequencer           |
| blueprint_chunks_sent_on_inbox | counter   | Number of blueprint chunks sent on the shared inbox                                                                    | sequencer           |
| blueprint_chunks_sent_on_dal   | counter   | Number of blueprint chunks sent on the DAL                                                                             | sequencer           |
| signals_sent                   | counter   | Number of DAL import signals sent on the inbox                                                                         | sequencer, observer |
| time_waiting                   | counter   | Time spent by a request waiting for a worker (in picosecond)                                                           | sequencer, observer |
| queue_size                     | gauge     | Size of the execution queue of simulations                                                                             | sequencer, observer |
| inconsistent_da_fees           | counter   | Node DA fees are inconsistent with kernel ones                                                                         | sequencer\*         |
| confirm_gas_needed             | counter   | Initially provided gas was not enough, confirmation was needed                                                         | sequencer\*         |

\* `inconsistent_da_fees` and `confirm_gas_needed` are listed for exhausitivity, but are mainly useful to the development team for testing and debugging the node side validation feature.

Some metrics have labels that store information that can't be described by the metric value (which can only be a float).
For example, the `octez_evm_node_info` metric has a label named `mode` (among others) that provides the mode of the node (RPC, observer, proxy, sequencer).
Here is an example of the content from this metric with its labels:

```
octez_evm_node_info{commit_hash="99aa672c", commit_date="2024-10-29 11:53:40 +0100", mode="observer", smart_rollup_address="sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf"} 0.000000
```

This table shows the available labels:

|             Metric             |        Label(s)        |                       Description                         |
|:------------------------------:|:----------------------:|:---------------------------------------------------------:|
| information                    | commit_hash            | commit hash of the node version                           |
| information                    | commit_date            | commit date of the node version                           |
| information                    | mode                   | mode of the node (RPC, observer, sequencer, proxy)        |
| information                    | smart_rollup_address   | address of the Smart Rollup monitored                      |
| calls                          | endpoint               | endpoint reached (`/`, etc.)                              |
| calls                          | method                 | JSON RPC method called (`etc_call`, etc.)                 |
| calls_method                   | method                 | JSON RPC method called (`etc_call`, etc.)                 |
| tx_pool                        | kind                   | Either `number_of_addresses` of `number_of_transactions`  |

### Scraping metrics with prometheus

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

The node outputs logs in the `<DATA_DIR>/daily_logs` directory for major events
(such as block production, connection to rollup node, etc) and a separate set of
logs for the inner working of the internal EVM (or, more precisely, the kernel)
in the `<DATA_DIR>/kernel_logs`. 

The standards logs are output in files with a daily rotation and a retention 
period of 5 days. They are limited to `INFO` and `ERROR` by default, but the 
EVM node can be started with the option `--verbose` for more.

```
...
2024-11-01T23:59:54.999-00:00 [evm_node.dev.evm_events_follower_upstream_blueprint_applied] The rollup node kernel applied blueprint 505715 leading to creating block 0xa33824839766bea9eb16e3cfb6a3e06fd5aedae1d19e50729f1575892[...].
2024-11-01T23:59:59.598-00:00 [evm_node.dev.blueprint_application] Applied a blueprint for level 505719 at 2024-11-01T23:59:59Z containing 0 transactions for 0 gas leading to creating block 0xe09fcee34c4f3fb7ac701e0508fadac7264cf7e595621a1d69d4dc533[...].
...
```

The EVM logs are stored in different files according to the context of the EVM call: creating blocks, simulation, validation of a transaction before inclusion in the tx pool, etc.

|              File             |                  Usage                 |
|:-----------------------------:|:--------------------------------------:|
| daily_logs/daily-YYYYMMDD.log | Major node events                           |
| kernel_logs/estimate_gas      | EVM logs during gas estimation         |
| kernel_logs/kernel_log        | EVM logs during block production       |
| kernel_logs/replay            | EVM logs during replay operations      |
| kernel_logs/simulate_call     | EVM logs during simulation             |
| kernel_logs/trace_transaction | EVM logs during tracing                |
| kernel_logs/tx_validity       | EVM logs during transaction validation |

### Scraping logs with Loki

Scraping logs makes them more easily searchable, and allows creating metrics to
be used in monitoring. 

We suggest using [Loki](https://github.com/grafana/loki) for that purpose.
Loki is a server that can be queried for logs, similar to what prometheus is 
for metrics. It relies on an agent to scrape and send the logs, we suggest Promtail.
Promtail will scrape the logs and push them to the Loki instance which will make
them available to the dashboard.

To install follow the [instructions on the grafana website](https://grafana.com/docs/loki/latest/setup/install/). 
Note that we don't discuss using the `Alloy` agent, but rather `Promtail`.
To install using a package manager, see the [install locally](https://grafana.com/docs/loki/latest/setup/install/local/) 
section, to add the grafana package repository.

Install Loki on the graphana server and Promtail on the EVM server.

Once both are installed, you need to add the scraping job to the Promtail 
configuration file (e.g. `/etc/promtail/config.yaml`) and specify the target 
Loki server.

```yaml
clients:
- url: <LOKI_ENDPOINT>
```

You must also configure a parsing pipeline for the logs.
Below is an example of a pipeline suitable for the daily logs. It uses `grep`
to extract the event's name from the log, to make searching the logs easier. 
Alternatively, we present [later](#adding-log-sinks) a method to produce logs in a json format, and the 
appropriate Promtail pipeline.

```yaml
scrape_configs:
- job_name: "evm-node-log-exporter" 
  pipeline_stages:
    - regex:
        expression: "^(?P<time>\\S+)\\s*\\[(?P<event>\\S+)\\](?P<msg>.*)$"
    - timestamp:
        source: time
        format: RFC3339
    - labels:
        event:
  static_configs:
  - targets:
      - 127.0.0.1
    labels:
      __path__: <EVM_NODE_DATA_DIR>/daily_logs/*.log

```

Replace `<EVM_NODE_DATA_DIR>` with the path to the EVM node data dir, and
`<LOKI_ENDPOINT>` with the Loki endpoint, most probably:

```
http://<LOKI_SERVER_ADDRESS>:3100/loki/api/v1/push
```

so if Loki is installed on the same server:

```
http://localhost:3100/loki/api/v1/push
```

Make sure that the Promtail daemon is able to access the log files. If it's 
installed as a service, an easy way is to make the `promtail` user part of the 
same group as the user used to run the EVM node.

### Adding log sinks

The EVM Node uses the same [logging features](https://tezos.gitlab.io/user/logging.html#file-descriptor-sinks)
as the [octez node](https://tezos.gitlab.io/). It is possible to add new 
`sinks` using [environment variables](https://tezos.gitlab.io/user/logging.html#environment-variables).

For example, the following definition will add logs in json format, with a 
daily rotation, 4 file retention, with `rw-r-----` unix rights, in the 
(fictional) `/some/data/dir/json_daily_logs` directory.

```
TEZOS_EVENTS_CONFIG="file-descriptor-path:///some/data/dir/json_daily_logs/daily.log?daily-logs=4&format=one-per-line&create-dirs=true&chmod=0o640"
```

This will result in files containing one json object per line.
```
...
{"fd-sink-item.v0":{"hostname":"etherlink-pinata-sequencer","time_stamp":1730505587.606614,"section":["evm_node","dev"],"event":{"blueprint_injection.v0":"505717"}}}
{"fd-sink-item.v0":{"hostname":"etherlink-pinata-sequencer","time_stamp":1730505590.115897,"section":["evm_node","dev"],"event":{"evm_events_follower_upstream_blueprint_applied.v0":{"level":"505714","hash":"0xfb6f61fe268481f1d18d31d7567011065418379b34722e83c517a6c509d3dfdb"}}}}
...
```

Such files can be scraped using the following Promtail configuration.
This will create a json event containing only the `event` of each log line.

```yaml
- job_name: "evm-node-json-log-exporter" 
  static_configs:
    - targets:
      - 127.0.0.1
      labels:
        __path__: /some/data/dir/json_daily_logs/*.log
  pipeline_stages:
  - json:
      expressions:
        event-sink: '"fd-sink-item.v0"'
  - json:
      source: event-sink
      expressions:
        event-name: event.keys(@)[0]
        event: event.* | [0] 
        timestamp: time_stamp
  - labels:
      event: event-name
  - timestamp:
      source: timestamp
      format: Unix
  - output:
      source: event
```
