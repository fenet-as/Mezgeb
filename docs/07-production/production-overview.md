# Production Overview

## 1. Purpose

This document defines the production architecture and operational goals for Mezgeb.

Development documentation explains how to build and run Mezgeb locally.

Production documentation explains how Mezgeb should operate as a deployed application serving real users and handling persistent data.

The production environment must prioritize:

* security
* reliability
* data integrity
* reproducibility
* observability
* maintainability
* controlled releases
* safe configuration

---

# 2. Production Architecture

The initial production architecture is based on:

```text id="p7x2nd"
                    ┌──────────────────────┐
                    │       Users          │
                    └──────────┬───────────┘
                               │
                             HTTPS
                               │
                    ┌──────────▼───────────┐
                    │      Frontend        │
                    │ React + Vite Build   │
                    └──────────┬───────────┘
                               │
                          HTTPS / REST
                               │
                    ┌──────────▼───────────┐
                    │       Backend        │
                    │     Spring Boot      │
                    └───────┬───────┬──────┘
                            │       │
                   ┌────────▼───┐ ┌─▼────────────┐
                   │ PostgreSQL │ │   MongoDB    │
                   │ Structured │ │    Journal   │
                   │    Data    │ │  Documents   │
                   └────────────┘ └──────────────┘
```

The exact hosting providers will be selected during deployment.

---

# 3. Production Components

The production system consists conceptually of:

### Frontend

Responsible for:

* user interface
* client-side routing
* user interactions
* form handling
* server-state management
* API communication

The frontend should be deployed as a production-optimized static application unless a future requirement introduces server-side rendering.

---

### Backend

Responsible for:

* authentication
* authorization
* business logic
* validation
* API endpoints
* persistence
* progress calculations
* security enforcement

The backend runs as a production Spring Boot application.

---

### PostgreSQL

Responsible for structured relational data:

```text id="9f3x1v"
Users
Goals
Milestones
Tasks
Learning Sessions
Activity
```

---

### MongoDB

Initially responsible for:

```text id="w8m2qc"
Journal Entries
```

The MongoDB decision may be revisited if the additional operational complexity is not justified.

---

# 4. Production Principles

## 4.1 HTTPS Everywhere

Production traffic should use HTTPS.

The application should not expose authenticated traffic over plain HTTP.

Conceptually:

```text id="z4k8mp"
Browser
   │
 HTTPS
   ▼
Frontend / API
```

---

## 4.2 Production Secrets Stay Outside Git

Production secrets must be managed through secure environment configuration or a secret-management system.

Examples:

```text id="v3j5xq"
Database passwords
JWT secrets
MongoDB credentials
OAuth secrets
External API keys
```

must never be committed to the repository.

---

## 4.3 Production Is Separate From Development

Production must not depend on:

```text id="c7m9k2"
localhost
developer credentials
development databases
test data
debug configuration
development secrets
```

Production configuration must be explicitly defined.

---

## 4.4 The Backend Is the Security Boundary

The production backend must enforce:

* authentication
* authorization
* ownership
* validation
* data access restrictions

Frontend restrictions are not considered security controls.

---

# 5. Environment Separation

The intended environment model is:

```text id="1s6q9m"
Development
     │
     ├── Local frontend
     ├── Local backend
     ├── Local PostgreSQL
     └── Local MongoDB

Test
     │
     ├── Automated tests
     ├── Isolated databases
     └── Test configuration

Production
     │
     ├── Hosted frontend
     ├── Hosted backend
     ├── Production PostgreSQL
     └── Production MongoDB
```

Data must not accidentally cross these environments.

---

# 6. Production Domains

The eventual deployment is expected to use separate domains or subdomains for the frontend and API.

For example:

```text id="8v3m5q"
https://mezgeb.example.com
https://api.mezgeb.example.com
```

These are examples only.

The actual domains will be chosen during deployment.

---

# 7. Frontend Production

The frontend should use a production build.

Conceptually:

```text id="7m2q4x"
Source Code
    ↓
Vite Build
    ↓
Optimized Static Assets
    ↓
Frontend Hosting/CDN
```

Production builds should:

* use production configuration
* remove development-only behavior where applicable
* optimize assets
* use the production API URL
* support client-side routing
* serve over HTTPS

---

# 8. Backend Production

The backend should run as a production Spring Boot application.

Conceptually:

```text id="q4n8vp"
Spring Boot Application
        ↓
Production Configuration
        ↓
Database Connections
        ↓
HTTPS/API Traffic
```

The backend should:

* expose only required endpoints
* use production secrets
* use production database credentials
* restrict CORS
* disable unnecessary development features
* use appropriate logging
* expose a health endpoint
* handle failures predictably

---

# 9. Database Production

Production databases contain persistent user data and therefore require special protection.

PostgreSQL and MongoDB should have:

* authentication enabled
* restricted access
* encrypted connections where supported/required
* backups
* monitoring
* controlled credentials

Application users should not have unrestricted database access.

The backend should be the normal access layer.

---

# 10. Database Ownership

The application should follow:

```text id="4x7m2j"
Browser
   ↓
Backend
   ↓
Database
```

not:

```text id="n9q4v1"
Browser
   ↓
Database
```

The frontend must never connect directly to PostgreSQL or MongoDB.

---

# 11. Production Configuration

Production configuration should be supplied externally.

Examples:

```text id="6v2m8c"
DB_URL
DB_USERNAME
DB_PASSWORD
MONGODB_URI
JWT_SECRET
CORS_ALLOWED_ORIGINS
```

See:

```text id="q5w1pz"
05-development/environment-variables.md
```

for configuration rules.

---

# 12. Authentication in Production

Authentication is security-critical.

Production authentication should include:

* strong password hashing
* secure token handling
* token expiration
* protected endpoints
* ownership checks
* appropriate CORS configuration
* HTTPS
* rate limiting where appropriate
* generic authentication error responses

Before public deployment, the authentication implementation should undergo a dedicated security review.

---

# 13. Authorization in Production

Every protected resource must be scoped to the authenticated user.

For example:

```text id="4k9m3w"
GET /api/v1/goals/{goalId}
```

must verify that the requested goal belongs to the authenticated user.

The same applies to:

* milestones
* tasks
* sessions
* journal entries
* activity
* progress

---

# 14. API Security

The production API should:

* require authentication where appropriate
* validate request data
* enforce ownership
* return appropriate HTTP status codes
* avoid exposing internal exceptions
* avoid leaking sensitive information
* apply rate limits where necessary
* restrict CORS
* use HTTPS

Development debugging information should not be returned to users in production.

---

# 15. Error Handling

Production errors should be useful without exposing internal implementation details.

Bad:

```text id="8x5m2v"
NullPointerException at GoalService.java:84
Database password...
```

Better:

```json id="q7m1x3"
{
  "code": "INTERNAL_ERROR",
  "message": "Something went wrong. Please try again.",
  "status": 500
}
```

Detailed technical information should remain in controlled server logs.

---

# 16. Logging

Production logs should help developers understand system behavior.

Useful information may include:

* request identifiers
* endpoint
* HTTP status
* execution time
* error type
* application events
* authentication failures
* important system events

Logs must not contain:

* passwords
* JWT secrets
* database credentials
* access tokens
* private user content unless specifically justified

---

# 17. Health Checks

The backend should expose an appropriate health endpoint.

Conceptually:

```text id="z3p8m5"
GET /health
```

or a Spring Boot Actuator health endpoint.

The endpoint can be used by:

* deployment infrastructure
* uptime monitoring
* container orchestration
* operational debugging

Health checks should distinguish between application availability and dependency health where appropriate.

---

# 18. Database Migrations

Production PostgreSQL schema changes must be applied through version-controlled migrations.

The project uses Flyway.

Conceptually:

```text id="r5q2j8"
Migration
    ↓
Review
    ↓
Test
    ↓
Production
```

Never rely on manually editing the production database as the normal schema-management process.

---

# 19. Backups

Production user data must have a backup strategy.

At minimum, PostgreSQL and MongoDB backups should be considered before treating the system as production-ready.

A backup strategy should define:

* backup frequency
* retention
* storage location
* encryption
* restoration process
* ownership
* recovery expectations

A backup that has never been tested for restoration should not be assumed to be reliable.

---

# 20. Recovery

Production planning should distinguish:

### Backup

A copy of data that can be restored.

### Recovery

The process of returning the system to an operational state.

Future documentation should define appropriate:

* RPO — Recovery Point Objective
* RTO — Recovery Time Objective

These values can remain simple for an early portfolio application.

---

# 21. Deployment Strategy

Initial deployment should favor simplicity.

Conceptually:

```text id="6v3k9p"
GitHub
   ↓
CI
   ↓
Tests
   ↓
Build
   ↓
Deploy
   ↓
Production
```

The exact hosting providers are intentionally not fixed yet.

---

# 22. Containerization

The backend can be packaged as a Docker image.

Conceptually:

```text id="0r5m7x"
Spring Boot
    ↓
JAR
    ↓
Docker Image
    ↓
Production Runtime
```

Docker Compose remains primarily useful for local development unless the production platform specifically benefits from it.

---

# 23. CI/CD

The eventual CI/CD pipeline should validate the application before deployment.

A basic pipeline:

```text id="5j8q3n"
Push / Pull Request
        ↓
Install Dependencies
        ↓
Type Check
        ↓
Lint
        ↓
Frontend Tests
        ↓
Backend Tests
        ↓
Build
        ↓
Deploy
```

Production deployment should not occur when required validation fails.

---

# 24. Release Safety

Production releases should be intentional.

Before release:

```text id="3p7m2q"
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Database migrations reviewed
- [ ] Environment configuration verified
- [ ] Security-sensitive changes reviewed
- [ ] Changelog updated
- [ ] Known high-priority issues reviewed
```

---

# 25. Rollback

The deployment process should have a recovery strategy.

Depending on the hosting platform, rollback may involve:

```text id="v2x9m4"
Previous application version
        ↓
Redeploy
```

Database rollback is more complicated.

Therefore, destructive or incompatible database migrations should be carefully designed and tested.

---

# 26. Observability

Production observability should eventually cover:

```text id="c8m4z1"
Logs
Metrics
Health
Errors
Performance
Availability
```

The initial version can remain lightweight.

Potential future tools include:

* Sentry
* Prometheus
* Grafana
* hosted monitoring
* structured logging

These should be introduced based on actual operational needs.

---

# 27. Performance

Production performance should be measured rather than optimized based purely on assumptions.

Potential areas:

### Frontend

* JavaScript bundle size
* image sizes
* route loading
* rendering performance
* API request count

### Backend

* API response times
* database query performance
* connection usage
* expensive progress calculations

### Database

* slow queries
* missing indexes
* inefficient pagination
* excessive joins

---

# 28. Scalability

The initial architecture should support reasonable growth without requiring distributed infrastructure immediately.

Start with:

```text id="w4k7q2"
One frontend deployment
        +
One backend application
        +
PostgreSQL
        +
MongoDB
```

Scale individual components only when actual requirements justify it.

Possible future additions:

```text id="5x1m8p"
Redis
Load balancing
Multiple backend instances
Background workers
Message queues
CDN optimization
```

These are not initial production requirements.

---

# 29. Production Security Checklist

Before public deployment:

```text id="n7q3mc"
- [ ] HTTPS enabled
- [ ] Production secrets externalized
- [ ] No secrets in Git
- [ ] No secrets in frontend
- [ ] Strong password hashing
- [ ] Authentication reviewed
- [ ] Authorization reviewed
- [ ] Ownership checks tested
- [ ] CORS restricted
- [ ] Input validation enabled
- [ ] Production errors sanitized
- [ ] Rate limiting considered
- [ ] Database access restricted
- [ ] Database credentials protected
- [ ] Logs reviewed for sensitive data
- [ ] Security headers considered
- [ ] Dependencies reviewed
```

---

# 30. Production Readiness

Mezgeb should not be considered production-ready merely because it can be deployed.

Production readiness means:

```text id="1m6q8v"
Application works
      +
Data is protected
      +
Failures are observable
      +
Configuration is controlled
      +
Backups exist
      +
Releases are repeatable
      +
Recovery is possible
```

---

# 31. Initial Production Target

The first production release should aim for:

```text id="r8c2z5"
Reliable
Secure
Simple
Observable
Recoverable
```

It does not need:

```text id="q4v9m7"
Kubernetes
Microservices
Multi-region infrastructure
Complex event-driven architecture
Massive observability stack
Advanced autoscaling
```

Those technologies should only appear if the project develops a real requirement for them.

---

# 32. Production Documentation Map

The remaining production documentation will cover:

```text id="6x9m3v"
07-production/
│
├── production-overview.md
├── deployment.md
├── infrastructure.md
├── ci-cd.md
├── security.md
├── monitoring-and-observability.md
├── database-and-backups.md
├── release-management.md
└── incident-response.md
```

Each document should answer a different operational question.

### `deployment.md`

> How do we actually deploy Mezgeb?

### `infrastructure.md`

> What infrastructure does Mezgeb run on?

### `ci-cd.md`

> How does code move from GitHub to production safely?

### `security.md`

> How is the production system protected?

### `monitoring-and-observability.md`

> How do we know whether Mezgeb is working correctly?

### `database-and-backups.md`

> How do we protect and recover user data?

### `release-management.md`

> How do we safely release new versions?

### `incident-response.md`

> What do we do when production breaks?

---

# 33. Final Production Mental Model

The production lifecycle is:

```text id="p3q7m1"
Developer
    ↓
Git
    ↓
CI
    ↓
Tests
    ↓
Build
    ↓
Deploy
    ↓
Production
    ↓
Monitor
    ↓
Detect
    ↓
Recover
    ↓
Improve
```

The central principle is:

> **Production is not simply where the application runs. It is the complete system required to run the application safely, reliably, and repeatably.**
