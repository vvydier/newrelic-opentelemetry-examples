# OpenTelemetry-JS SDK New Relic Config

## Introduction

This is an example of auto-instrumenting a simple express application with [OpenTelemetry-JS](https://github.com/open-telemetry/opentelemetry-js#instantiate-tracing) and exporting traces to New Relic.

Currently New Relic only supports [OTLP/gRPC](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/protocol/otlp.md#otlpgrpc) so you must use the [@opentelemetry/exporter-trace-otlp-grpc](https://www.npmjs.com/package/@opentelemetry/exporter-trace-otlp-grpc) package to send data to New Relic.

## Prerequisites

1. Sign up for a [free New Relic account](https://newrelic.com/signup).

2. Copy your New Relic [account ingest license key](https://one.newrelic.com/launcher/api-keys-ui.launcher).

## Run

1. Run `npm install`.

2. Set the following environment variables:

   ```shell
   export OTEL_EXPORTER_OTLP_ENDPOINT=otlp.nr-data.net:4317

   export OTEL_EXPORTER_OTLP_HEADERS=api-key=<your_license_key_here>
   ```
   - Replace `<your_license_key_here>` with your New Relic account ingest license key.

3. Run the application:

   ```shell
   npm start
   ```

   - This is a script to load the tracing code before the application code.

The application exposes a simple endpoint at `http://localhost:8080/ping`.

Invoke it via: `curl http://localhost:8080/ping` to generate trace data.

## View your data in the New Relic UI

The application produces trace data reporting to a service named `OpenTelemetry-Node.JS-Example.`
