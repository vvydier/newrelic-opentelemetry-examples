const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { NodeTracerProvider } = require('@opentelemetry/node');
const {
  CollectorTraceExporter,
  CollectorMetricExporter,
} = require('@opentelemetry/exporter-collector-grpc');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { MeterProvider } = require('@opentelemetry/metrics');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { Resource, SERVICE_RESOURCE } = require('@opentelemetry/resources');
const { v4: uuidv4 } = require('uuid');

const resource = new Resource({
  [SERVICE_RESOURCE.NAME]: 'my-test-service',
  [SERVICE_RESOURCE.INSTANCE_ID]: uuidv4(),
});

const tracerProvider = new NodeTracerProvider({ resource });
const traceExporter = new CollectorTraceExporter();

tracerProvider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
tracerProvider.register();

const metricExporter = new CollectorMetricExporter();
const meterProvider = new MeterProvider({
  exporter: metricExporter,
  interval: 2000,
  resource,
});

registerInstrumentations({
  tracerProvider,
  meterProvider,
  instrumentations: [getNodeAutoInstrumentations()],
});

module.exports = {
  meter: meterProvider.getMeter('default'),
};
