# Monitoring & Observability

## 1. Purpose

This document defines how Mezgeb will monitor, understand, and diagnose its production environment.

A deployed application is not enough.

Once real users interact with Mezgeb, the system needs to answer questions such as:

* Is the application running?
* Are users receiving errors?
* Is the API responding slowly?
* Is the database healthy?
* Did a deployment introduce a problem?
* Are authentication failures increasing?
* Is the system running out of resources?
* What happened when something failed?

Monitoring and observability provide the information needed to answer these questions.

---

# 2. Monitoring vs Observability

These concepts are related but different.

### Monitoring

Monitoring asks:

> "Is something wrong?"

It uses known signals such as:

* uptime
* error rate
* CPU usage
* memory usage
* response time

### Observability

Observability asks:

> "Why is something wrong?"

It uses information such as:

* logs
* metrics
* traces
* error reports
* request context

A useful mental model is:

```text
Monitoring
    ↓
Something is wrong
    ↓
Observability
    ↓
Why is it wrong?
```

---

# 3. Observability Pillars

The traditional observability model has three major signals:

```text id="m8q3v7"
        Observability
             │
     ┌───────┼───────┐
     ▼       ▼       ▼
   Logs    Metrics  Traces
```

Mezgeb will also use:

```text id="q4m7x2"
Error Tracking
Health Checks
Alerts
```

---

# 4. Initial Observability Strategy

The first production version should remain simple.

Initial monitoring should include:

```text id="7m3q8v"
✓ Application health
✓ Backend logs
✓ Deployment logs
✓ HTTP errors
✓ Response times
✓ Database connectivity
✓ Basic uptime monitoring
✓ Resource usage
```

Advanced distributed tracing is not required initially.

---

# 5. Health Checks

Health checks answer:

> "Is the application alive and able to serve requests?"

The backend should expose an appropriate health endpoint.

Conceptually:

```text id="m7q2v8"
GET /health
```

or a Spring Boot Actuator endpoint.

Example response:

```json id="q3m8v7"
{
  "status": "UP"
}
```

The actual response structure depends on the implementation.

---

# 6. Liveness vs Readiness

These concepts become useful as the infrastructure grows.

### Liveness

Asks:

> "Is the application process alive?"

### Readiness

Asks:

> "Is the application ready to receive traffic?"

Conceptually:

```text id="8m4q2v"
Application Running?
      │
      ├── No → Restart / Failure
      │
      └── Yes
           │
           ▼
     Dependencies Ready?
           │
           ├── No → Not Ready
           │
           └── Yes → Ready
```

The initial deployment may use a simpler health check.

---

# 7. Dependency Health

The backend depends on:

```text id="m3q7v9"
PostgreSQL
MongoDB
```

A health system may distinguish between:

```text id="q8m2v4"
Application = UP
PostgreSQL = UP
MongoDB = UP
```

and:

```text id="7m4q8x"
Application = UP
PostgreSQL = DOWN
```

This makes dependency failures easier to diagnose.

Health endpoints should not expose sensitive database information.

---

# 8. Uptime Monitoring

Uptime monitoring checks whether the application can be reached.

Conceptually:

```text id="m8q3v7"
Monitoring Service
       │
       ▼
GET /health
       │
       ▼
HTTP 200?
   │       │
  Yes      No
   │       │
Healthy   Alert
```

The monitoring interval depends on the chosen service.

---

# 9. Frontend Monitoring

Frontend monitoring should consider:

* page availability
* JavaScript errors
* failed API requests
* route failures
* performance
* asset loading failures

A frontend may appear visually available while the application is functionally broken because API requests are failing.

---

# 10. Backend Monitoring

Backend monitoring should include:

* request count
* error count
* response time
* HTTP status distribution
* database connectivity
* application health
* resource usage
* authentication failures

---

# 11. HTTP Metrics

Useful API metrics include:

```text id="q2m8v7"
Requests per second
Error rate
Average response time
P95 response time
P99 response time
Status code distribution
```

For example:

```text id="m7q3x8"
200 → successful requests
400 → validation/client errors
401 → authentication failures
403 → authorization failures
404 → missing resources
429 → rate limiting
500 → server errors
503 → unavailable service
```

These signals help identify whether problems are client-side, server-side, or infrastructure-related.

---

# 12. Response Time

Average response time alone can hide slow requests.

Percentiles are more informative.

For example:

```text id="8m4q7v"
P50 → typical request
P95 → slower requests
P99 → very slow requests
```

Example:

```text id="q3m8x7"
P50 = 120 ms
P95 = 450 ms
P99 = 1.8 s
```

This tells us that most requests are fast while a small number are significantly slower.

These values are examples, not Mezgeb targets.

---

# 13. Error Rate

The system should track the percentage or number of failed requests.

Important errors include:

```text id="m7q2v8"
5xx responses
Database failures
Unhandled exceptions
Frontend runtime errors
Failed authentication
```

A sudden increase in server errors can indicate a deployment or infrastructure problem.

---

# 14. Structured Logging

Backend logs should preferably use structured formats.

Instead of:

```text id="q8m3v7"
Goal failed
```

a structured log could conceptually contain:

```json id="m4q7x2"
{
  "level": "ERROR",
  "event": "goal_request_failed",
  "requestId": "abc123",
  "status": 500
}
```

The exact logging format will be determined during implementation.

Structured logs make searching and filtering easier.

---

# 15. Log Levels

The application should use appropriate log levels.

Common levels:

```text id="7m3q8v"
DEBUG
INFO
WARN
ERROR
```

### DEBUG

Detailed development information.

Usually minimized or disabled in production.

### INFO

Normal application events.

### WARN

Unexpected situations that do not necessarily break the application.

### ERROR

Failures requiring investigation.

---

# 16. Production Logging

Production logs should focus on useful operational information.

Examples:

```text id="m8q2v7"
Application startup
Application shutdown
Deployment version
Request failures
Database connection failures
Authentication failures
Unexpected exceptions
Important background operations
```

Avoid excessive logging because large volumes make useful information harder to find.

---

# 17. Sensitive Information in Logs

Never log:

```text id="q4m8v2"
Passwords
JWT secrets
Access tokens
Database passwords
Private API keys
Full authentication headers
```

Be careful with user-generated content.

Journal entries should not automatically appear in logs.

---

# 18. Request IDs

Requests should eventually have a unique identifier.

Conceptually:

```text id="m7q3v8"
Browser Request
      ↓
requestId = abc123
      ↓
Backend
      ↓
Logs
```

If an error occurs, the user-facing error can potentially reference the request ID without exposing technical details.

This makes debugging easier.

---

# 19. Example Request Flow

A request might produce logs like:

```text id="8m2q7v"
INFO  request_started
      requestId=abc123
      method=POST
      path=/api/v1/goals

INFO  goal_created
      requestId=abc123

INFO  request_completed
      requestId=abc123
      status=201
      duration=84ms
```

The exact implementation will depend on the logging framework.

---

# 20. Error Tracking

Error tracking focuses on application exceptions and failures.

It can provide:

* stack traces
* affected route
* browser information
* application version
* frequency
* affected users
* breadcrumbs/context

A service such as Sentry may be introduced later.

It is not required for the first deployment if basic hosting logs provide enough visibility.

---

# 21. Error Grouping

Repeated instances of the same underlying error should ideally be grouped.

For example:

```text id="q7m3v8"
NullPointerException
     ↓
500 requests
```

should be recognizable as one underlying problem rather than 500 unrelated incidents.

---

# 22. Frontend Error Tracking

Frontend errors may include:

```text id="m8q2v4"
React rendering errors
JavaScript exceptions
Failed API requests
Unhandled promise rejections
Route failures
```

These can be difficult to reproduce locally.

Error tracking can provide additional context.

---

# 23. Database Monitoring

PostgreSQL and MongoDB should be monitored for:

* availability
* connection failures
* storage usage
* resource usage
* slow queries
* connection counts
* backup status

The exact metrics depend on the database provider.

---

# 24. PostgreSQL Performance

Important PostgreSQL signals include:

```text id="7m4q8x"
Query duration
Connection count
CPU usage
Memory usage
Storage usage
Slow queries
Lock contention
```

The project should investigate actual bottlenecks before introducing database optimization.

---

# 25. MongoDB Performance

Potential MongoDB signals include:

```text id="m3q8v7"
Query duration
Connection usage
Storage usage
CPU usage
Memory usage
Slow operations
```

MongoDB monitoring should be treated similarly to PostgreSQL monitoring.

---

# 26. Resource Monitoring

Backend infrastructure should monitor:

```text id="q8m2v4"
CPU
Memory
Disk
Network
Container/runtime health
```

Resource exhaustion can cause application failures even when the application code itself is correct.

---

# 27. Memory Problems

A steadily increasing memory footprint may indicate:

* memory leaks
* unbounded caches
* large object retention
* excessive request data
* inefficient processing

Monitoring should help identify abnormal memory growth.

---

# 28. Database Storage

Persistent storage should be monitored.

For example:

```text id="m7q3v8"
PostgreSQL Storage
MongoDB Storage
Backup Storage
```

Storage exhaustion can cause serious production failures.

---

# 29. Alerts

Monitoring is useful only if important failures are noticed.

Alerts should focus on actionable conditions.

Potential alerts:

```text id="q4m8v2"
Application unavailable
High 5xx rate
Database unavailable
High error rate
Deployment failure
Backup failure
Storage nearly full
```

---

# 30. Avoid Alert Fatigue

Do not create alerts for every unusual event.

Too many alerts can cause developers to ignore them.

A good alert should answer:

> "Does someone need to take action?"

If not, it may be better represented as a dashboard metric or log.

---

# 31. Alert Severity

Alerts can be categorized.

### Critical

Production is unavailable or user data may be at risk.

### High

Major functionality is broken.

### Medium

Significant degradation exists but the system remains usable.

### Low

Something unusual should be investigated but does not require immediate action.

The exact thresholds should be defined based on actual usage.

---

# 32. Deployment Monitoring

Every deployment should be observable.

After deployment, monitor:

```text id="m8q3v7"
Health
Error rate
Response time
Application logs
Database connectivity
Frontend errors
```

A deployment that technically succeeds may still introduce a runtime problem.

---

# 33. Deployment Correlation

When an issue appears immediately after a deployment, the deployment should be considered as a possible cause.

The system should make it possible to identify:

```text id="q7m2v8"
Application Version
Git Commit
Deployment Time
```

This is why version traceability is important.

---

# 34. Dashboards

A future production dashboard may contain:

```text id="m3q8v7"
┌─────────────────────────────────────┐
│ Mezgeb Production                  │
├─────────────────────────────────────┤
│ Availability     ✓                 │
│ Error Rate       0.2%              │
│ P95 Latency      340ms             │
│ Requests/min     120               │
│ CPU              35%               │
│ Memory           48%               │
│ Database         ✓                 │
└─────────────────────────────────────┘
```

These values are illustrative only.

---

# 35. Metrics Retention

Monitoring systems should retain enough history to identify trends.

Useful periods may include:

```text id="8m4q2v"
Recent hours
Recent days
Recent weeks
```

The exact retention period depends on the monitoring provider and project needs.

---

# 36. Performance Monitoring

Performance should be monitored across:

```text id="q3m7v8"
Browser
   ↓
Frontend
   ↓
Network
   ↓
Backend
   ↓
Database
```

A slow page does not necessarily mean the frontend code is slow.

The bottleneck could be:

* API latency
* database query
* network
* asset delivery
* rendering

---

# 37. Distributed Tracing

Distributed tracing tracks a request through multiple services.

For the initial Mezgeb architecture, full distributed tracing is not required because the system is relatively simple.

If the architecture later becomes:

```text id="m8q2v7"
Frontend
   ↓
API
   ↓
Service A
   ↓
Service B
   ↓
Database
```

tracing becomes more valuable.

---

# 38. OpenTelemetry

OpenTelemetry may eventually be used for standardized:

* traces
* metrics
* instrumentation

It should not be introduced merely because it is popular.

The initial application can operate with logs, metrics, health checks, and error tracking.

---

# 39. Availability Targets

The project should define realistic availability expectations after deployment.

For an early portfolio application, the priority is:

```text id="q7m4v2"
Reliable enough for real users
```

rather than immediately targeting complex enterprise-grade availability guarantees.

Formal SLIs/SLOs can be introduced later if the application's usage justifies them.

---

# 40. Example Service-Level Indicators

Potential future SLIs:

```text id="m3q8v7"
Availability
API error rate
API latency
Successful login rate
Database availability
```

An SLI measures something observable.

---

# 41. SLOs

A Service Level Objective defines a desired level of reliability.

For example:

```text id="q8m2v4"
99.x% successful requests
```

The exact target should be based on real requirements rather than chosen arbitrarily.

For the initial project, formal SLOs are optional.

---

# 42. Incident Detection

A production incident may be detected through:

```text id="m7q3v8"
Automated alert
User report
Developer observation
Hosting notification
Database alert
Error tracking
```

All detection paths should eventually lead to the incident-response process.

---

# 43. Incident Information

When investigating a production issue, collect:

```text id="8m4q7v"
What happened?
When did it start?
Which version is deployed?
Which users are affected?
Which endpoint failed?
What do logs show?
What do metrics show?
Are databases healthy?
Was there a recent deployment?
```

Avoid changing many things simultaneously before understanding the failure.

---

# 44. Monitoring During Incidents

During an incident, prioritize:

```text id="q3m8v7"
Availability
Error rate
Database health
Recent deployments
Resource usage
```

Detailed optimization can wait until the system is stable.

---

# 45. Privacy Considerations

Monitoring must not become a way to collect unnecessary user data.

Avoid storing private journal content merely for observability.

Monitoring data should be:

* minimized
* access-controlled
* retained appropriately
* protected like other operational data

---

# 46. Monitoring Access

Production monitoring should be accessible only to authorized people.

This includes:

```text id="m7q2v8"
Logs
Metrics
Error tracking
Database dashboards
Infrastructure dashboards
```

Monitoring systems can themselves contain sensitive information.

---

# 47. Initial Tooling

The project can start with:

```text id="q8m3v7"
Spring Boot Actuator
+
Hosting logs
+
Database provider monitoring
+
Basic uptime monitoring
+
GitHub deployment logs
```

Later, if needed:

```text id="m4q7x2"
Sentry
Prometheus
Grafana
OpenTelemetry
```

The exact tools depend on the deployment environment.

---

# 48. Spring Boot Actuator

Spring Boot Actuator can provide production-oriented information such as:

* health
* metrics
* application information

Endpoints must be configured carefully.

Do not expose sensitive management endpoints publicly without appropriate protection.

---

# 49. Management Endpoint Security

Not every Actuator endpoint should be publicly accessible.

For example, detailed environment/configuration information could expose sensitive information.

Production should expose only the management endpoints that are actually required.

---

# 50. Monitoring Checklist

## Health

* [ ] Backend health endpoint
* [ ] Database health monitored
* [ ] Frontend availability monitored
* [ ] Uptime monitoring configured

## Logs

* [ ] Backend logs accessible
* [ ] Deployment logs accessible
* [ ] Appropriate log levels
* [ ] Structured logs where useful
* [ ] Secrets excluded
* [ ] Sensitive user data minimized

## Metrics

* [ ] Request count
* [ ] Error rate
* [ ] Response time
* [ ] CPU
* [ ] Memory
* [ ] Database health
* [ ] Storage

## Errors

* [ ] Backend errors tracked
* [ ] Frontend runtime errors considered
* [ ] Error context available
* [ ] Errors grouped where possible

## Alerts

* [ ] Application outage
* [ ] High server error rate
* [ ] Database outage
* [ ] Backup failure
* [ ] Important resource exhaustion

## Security

* [ ] Monitoring access restricted
* [ ] Sensitive data excluded
* [ ] Management endpoints protected

---

# 51. Initial Observability Strategy

The first production version does not need a massive observability stack.

Start with:

```text id="m8q3v7"
Health Checks
     +
Logs
     +
Basic Metrics
     +
Error Tracking
     +
Uptime Monitoring
```

Then expand only when the system produces problems that require better visibility.

---

# 52. Future Observability Evolution

Potential progression:

```text id="q4m8v2"
Phase 1
Logs + Health Checks

      ↓

Phase 2
Metrics + Alerts

      ↓

Phase 3
Error Tracking

      ↓

Phase 4
Distributed Tracing

      ↓

Phase 5
Advanced Dashboards + SLOs
```

This follows the same progressive-complexity principle used throughout Mezgeb.

---

# 53. Final Observability Mental Model

Think of production observability as the application's senses:

```text id="m7q3v8"
             Mezgeb Production
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
     Logs        Metrics       Traces
       │            │            │
       └────────────┼────────────┘
                    ▼
             Observability
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
    Detect       Diagnose      Improve
```

The central principle is:

> **Monitoring tells us that something is wrong; observability gives us enough information to understand why.**
