const client = require('prom-client');
const express = require('express');
const server = express();
const apiMetrics = require('prometheus-api-metrics');
server.use(apiMetrics())
const register = new client.Registry();

// Probe every 5th second.
const intervalCollector = client.collectDefaultMetrics({prefix: 'node_', timeout: 5000, register});

const counter = new client.Counter({
   name: "node_my_counter",
   help: "This is my counter"
});

const gauge = new client.Gauge({
   name: "node_my_gauge",
   help: "This is my gauge"
});

const histogram = new client.Histogram({
   name: "node_my_histogram",
   help: "This is my histogram",
   buckets: [0.1, 5, 15, 50, 100, 500]
});

const summary = new client.Summary({
   name: "node_my_summary",
   help: "This is my summary",
   percentiles: [0.01, 0.05, 0.5, 0.9, 0.95, 0.99, 0.999]
});

register.registerMetric(counter);
register.registerMetric(gauge);
register.registerMetric(histogram);
register.registerMetric(summary);

const rand = (low, high) => Math.random() * (high - low) + low;

setInterval(() => {
   counter.inc(rand(0, 1));
   gauge.set(rand(0, 15));
   histogram.observe(rand(0,10));
   summary.observe(rand(0, 10));
}, 1000);

server.get('/metrics', (req, res) => {
   res.set('Content-Type', register.contentType);
   res.end(register.metrics());
});



server.get('/hello', (req, res) => {
  res.status(200).send({'Message':'Hello World!'})
})

console.log('Server listening to 8080, metrics exposed on /metrics endpoint');
server.listen(8080);






