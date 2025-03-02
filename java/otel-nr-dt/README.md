# OpenTelemetry with New Relic Distributed Tracing

## Introduction

This project demonstrates distributed tracing for two Java applications, one instrumented with OpenTelemetry, the other with the New Relic java agent. 

The project is composed of two modules:
- [nr-app](./nr-app): A simple Java application instrumented with the New Relic Java Agent running on `http://localhost:8081`.
- [otel-app](./otel-app): A simple Java application instrumented manually with the OpenTelemetry API running on `http://localhost:8080`.

Each application contains a simple `GET /ping` route, and a route to call the other application's `GET /ping` route. This allows distributed tracing to be demonstrated when originating from an OpenTelemetry instrumented application, and from a New Relic instrumented application. The routes are as follows:
- `GET http://localhost:8081/callOtelApp`: Return OpenTelemetry application's `GET /ping` at `GET http://localhost:8080/ping`
- `GET http://localhost:8080/callNewRelicApp`: Return New Relic application's `GET /ping` at `GET http://localhost:8081/ping`

Distributed trace context is propagated via [W3C Trace Context](https://www.w3.org/TR/trace-context/) headers in both directions.

## Run
Set the following environment variables:
* `NEW_RELIC_LICENSE_KEY=<your_license_key>`
  * Replace `<your_license_key>` with your [Account License Key](https://one.newrelic.com/launcher/api-keys-ui.launcher).
* Optional `OTLP_HOST=http://your-collector:4317`
  * The OpenTelemetry application is [configured](../shared-utils/src/main/java/com/newrelic/shared/OpenTelemetryConfig.java) to export to New Relic via OTLP by default. Optionally change it by setting this environment variable.

Run both applications from a shell in the [java root](../) as follows. NOTE, you'll need to set the `NEW_RELIC_LICENSE_KEY` environment variable in both shells. 
```shell
# Run the New Relic app in one shell
./gradlew otel-nr-dt:nr-app:bootRun

# Run the OpenTelemetry app in a separate shell
./gradlew otel-nr-dt:otel-app:bootRun
```

To demonstrate distributed tracing, invoke each application:
```shell
# Distributed trace starts in New Relic application and makes external call to OpenTelemetry application
curl http://localhost:8081/callOtelApp

# Distributed trace starts in OpenTelemetry application and makes external call to New Relic application
curl http://localhost:8080/callNewRelicApp
```

You should see spans from the OpenTelemetry application show up in the collector logs. 

You should see distributed traces from both applications in your New Relic account that resemble:

*New Relic App Rooted Trace*
![](new-relic-root-trace.png)

*OpenTelemetry App Rooted Trace*
![](otel-root-trace.png)