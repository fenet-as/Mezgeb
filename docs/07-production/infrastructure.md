# Infrastructure

## 1. Purpose

This document defines the infrastructure required to run Mezgeb in production.

Infrastructure refers to the services and resources that support the application, including:

* frontend hosting
* backend runtime
* databases
* networking
* DNS
* TLS/HTTPS
* storage
* secrets
* monitoring
* backups

The goal is to keep the initial infrastructure simple while establishing a foundation that can grow with the application.

---

# 2. Infrastructure Principles

Mezgeb follows these principles:

1. **Prefer managed infrastructure where practical.**
2. **Keep the initial architecture simple.**
3. **Separate application code from infrastructure configuration.**
4. **Do not introduce infrastructure solely for learning purposes when it adds unnecessary complexity.**
5. **Protect production data and credentials.**
6. **Make infrastructure reproducible where practical.**
7. **Monitor important production resources.**
8. **Scale only when actual requirements justify it.**

---

# 3. Initial Production Architecture

The initial infrastructure can be represented as:

```text id="7g4n2p"
                         Internet
                            │
                     ┌──────▼──────┐
                     │     DNS     │
                     └──────┬──────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
       ┌──────▼──────┐             ┌──────▼──────┐
       │  Frontend   │             │   Backend   │
       │   Hosting   │             │   Runtime   │
       └─────────────┘             └──────┬──────┘
                                          │
                              ┌───────────┴───────────┐
                              │                       │
                       ┌──────▼──────┐        ┌──────▼──────┐
                       │ PostgreSQL  │        │   MongoDB   │
                       └─────────────┘        └─────────────┘
```

The actual infrastructure providers will be selected during deployment.

---

# 4. Infrastructure Components

The initial production system consists of:

| Component         | Responsibility                            |
| ----------------- | ----------------------------------------- |
| Frontend hosting  | Serves React production assets            |
| Backend runtime   | Runs Spring Boot                          |
| PostgreSQL        | Stores relational application data        |
| MongoDB           | Stores journal documents initially        |
| DNS               | Maps domains to services                  |
| TLS               | Provides HTTPS                            |
| Secret management | Stores sensitive configuration            |
| Monitoring        | Detects failures and performance problems |
| Backup system     | Protects persistent data                  |

---

# 5. Frontend Hosting

The frontend is a Vite-generated static application.

Its infrastructure responsibility is primarily:

```text id="4p9m1v"
Serve static assets
        +
Support HTTPS
        +
Support SPA routing
        +
Provide CDN/caching where available
```

The frontend does not require a traditional application server unless future requirements introduce server-side rendering or another runtime requirement.

---

# 6. Frontend Deployment Model

The frontend follows:

```text id="8m2q7x"
GitHub
   ↓
CI
   ↓
npm run build
   ↓
Static Assets
   ↓
Frontend Hosting
   ↓
Users
```

The hosting platform should support:

* HTTPS
* custom domains
* SPA fallback
* deployment from Git
* environment configuration
* build logs

---

# 7. Backend Runtime

The backend requires a Java runtime capable of running the chosen Spring Boot version.

The backend may run as:

```text id="v5x8m2"
Spring Boot JAR
```

or:

```text id="n4q7c1"
Docker Container
```

The initial deployment should favor whichever option provides the simplest reliable deployment on the selected platform.

---

# 8. Backend Runtime Responsibilities

The backend infrastructure must provide:

* application runtime
* network access
* environment variables
* database connectivity
* health checks
* logs
* resource limits
* restart behavior
* HTTPS termination or secure connection to the service

---

# 9. Backend Resources

The backend runtime will require resources such as:

```text id="p9w3m6"
CPU
Memory
Disk where necessary
Network
Environment configuration
```

Initial resource allocation should be modest.

Resources should be increased based on observed usage rather than assumptions.

---

# 10. Application Port

The Spring Boot application should use a configurable port.

Conceptually:

```text id="5m8v2q"
SERVER_PORT=8080
```

The actual production platform may provide a port dynamically.

The application should therefore support the hosting platform's expected port configuration rather than assuming a fixed public port.

---

# 11. PostgreSQL Infrastructure

PostgreSQL is the primary relational database.

It stores:

```text id="k3p8m1"
Users
Goals
Milestones
Tasks
Learning Sessions
Activity
```

The production PostgreSQL instance should ideally be managed rather than manually operated.

Managed database infrastructure can provide:

* backups
* upgrades
* monitoring
* connection management
* access controls
* storage management

---

# 12. PostgreSQL Access

The database should not be publicly accessible to arbitrary users.

The intended flow is:

```text id="9x2m7q"
Frontend
   ↓
Backend
   ↓
PostgreSQL
```

Database credentials should only be available to the backend.

---

# 13. PostgreSQL Security

Production PostgreSQL should use:

* strong credentials
* encrypted connections where appropriate
* restricted network access
* least-privilege database users
* backups
* monitoring

The application should not use a database superuser for normal operation.

---

# 14. MongoDB Infrastructure

MongoDB is initially used for journal documents.

The production MongoDB instance should similarly be managed and protected.

The intended flow is:

```text id="3m7q9v"
Frontend
   ↓
Backend
   ↓
MongoDB
```

The frontend never connects directly to MongoDB.

---

# 15. MongoDB Security

Production MongoDB should use:

* authentication
* restricted network access
* encrypted connections where appropriate
* dedicated application credentials
* backups
* monitoring

The MongoDB connection string is a secret and must remain server-side.

---

# 16. Reconsidering MongoDB

The initial architecture uses MongoDB for journal data.

However, the project should periodically evaluate whether this separation remains useful.

If MongoDB introduces significant operational complexity without providing meaningful benefits, journal data could eventually be moved to PostgreSQL.

This is an architectural decision rather than an infrastructure requirement.

The current decision is documented in:

```text id="0k8n3m"
06-project/decisions.md
```

---

# 17. Networking

The basic production network looks like:

```text id="x2m8v4"
Internet
   │
   ├── HTTPS → Frontend
   │
   └── HTTPS → Backend
                  │
                  ├── PostgreSQL
                  └── MongoDB
```

Databases should not need to be directly accessible from the public Internet.

---

# 18. CORS

The backend should allow requests only from approved frontend origins.

Development:

```text id="q8m3z7"
http://localhost:5173
```

Production:

```text id="w4p9x2"
https://mezgeb.example.com
```

The actual production domain will be configured during deployment.

CORS is not a replacement for authentication or authorization.

---

# 19. DNS

DNS maps human-readable domains to infrastructure.

A possible structure is:

```text id="j3m8q1"
mezgeb.example.com
        ↓
Frontend

api.mezgeb.example.com
        ↓
Backend
```

The exact domain structure may change.

---

# 20. TLS / HTTPS

Production traffic should use HTTPS.

TLS protects communication between:

```text id="6v2p9m"
User Browser
     ↕
Production Services
```

HTTPS is especially important because Mezgeb handles:

* authentication credentials
* authentication tokens/cookies
* private learning data
* journal content
* account information

---

# 21. Certificates

TLS certificates should preferably be managed automatically by the hosting or infrastructure provider.

The project should avoid manually managing certificates unless there is a specific reason to do so.

The infrastructure should provide:

```text id="4q7m2x"
Valid certificate
    +
Automatic renewal
    +
HTTPS redirect
```

where supported.

---

# 22. CDN

A CDN may be used for the frontend.

The CDN can improve:

* static asset delivery
* caching
* geographic performance
* availability

However, a CDN is not required as a separate infrastructure project for the initial deployment if the frontend hosting platform already provides one.

---

# 23. Caching

Caching should be introduced deliberately.

Potential layers include:

```text id="8m3v7q"
Browser Cache
     ↓
CDN Cache
     ↓
Application Cache
     ↓
Database
```

The initial backend does not require Redis.

TanStack Query already provides client-side server-state caching in the frontend.

---

# 24. Redis

Redis is intentionally not part of the initial infrastructure.

Potential future uses include:

* distributed caching
* rate limiting
* session-related infrastructure
* temporary data
* background-job coordination

Redis should be introduced only when a concrete requirement exists.

---

# 25. Object Storage

Object storage is not required for the initial MVP.

If Mezgeb later supports:

* profile images
* journal attachments
* uploaded files
* exported data
* media

object storage can be introduced.

The likely architecture would be:

```text id="2m7x9c"
Frontend
   ↓
Backend
   ↓
Object Storage
```

or, where appropriate, controlled direct uploads using signed URLs.

---

# 26. Secrets Infrastructure

Production secrets should be stored using the hosting platform's secret-management functionality or a dedicated secret manager.

Examples:

```text id="q3v7m1"
JWT_SECRET
DB_PASSWORD
MONGODB_URI
External API keys
OAuth secrets
```

The application should retrieve them through its runtime environment.

---

# 27. Infrastructure Access

Production infrastructure access should be restricted.

Access should be granted only to people who need it.

Examples include:

```text id="8x2m5q"
Hosting dashboard
Database dashboard
GitHub repository
CI/CD secrets
DNS management
```

Administrative credentials should never be shared through source code or chat messages.

---

# 28. Infrastructure Credentials

Different infrastructure services should use separate credentials.

For example:

```text id="m7q3v9"
GitHub
≠
Frontend Hosting
≠
Backend Hosting
≠
PostgreSQL
≠
MongoDB
≠
DNS
```

Compromise of one credential should not automatically provide unrestricted access to every system.

---

# 29. Infrastructure as Code

Infrastructure as Code (IaC) means describing infrastructure using version-controlled configuration.

Examples include:

* Terraform
* Pulumi
* provider-specific configuration

IaC is valuable for larger or more complex infrastructure.

It is **not required for the first Mezgeb deployment**.

The project should first understand the actual infrastructure before introducing IaC.

---

# 30. Docker

Docker is useful for making the backend runtime reproducible.

Development:

```text id="x7m3q9"
Docker Compose
├── PostgreSQL
└── MongoDB
```

Production:

```text id="p2m8v4"
Docker Image
└── Spring Boot Backend
```

The production platform may provide its own container runtime.

---

# 31. Container Registry

If Docker-based deployment is used, images may be stored in a container registry.

Conceptually:

```text id="8q4m2z"
GitHub
   ↓
CI
   ↓
Docker Build
   ↓
Container Registry
   ↓
Production Runtime
```

The exact registry depends on the chosen hosting infrastructure.

---

# 32. Resource Scaling

The initial system should use vertical scaling where practical.

For example:

```text id="m5q8x2"
More CPU
More Memory
More Database Storage
```

before introducing complex horizontal scaling.

If usage grows significantly:

```text id="7v2m9q"
Load Balancer
       ↓
Backend Instance 1
Backend Instance 2
Backend Instance 3
```

may become appropriate.

---

# 33. Stateless Backend

The Spring Boot backend should remain as stateless as practical.

Persistent application state belongs in databases or other explicit infrastructure.

This makes it easier to run multiple backend instances later.

For example:

```text id="4m8q2v"
Backend Instance 1 ─┐
Backend Instance 2 ─┼──→ PostgreSQL
Backend Instance 3 ─┘
                     └──→ MongoDB
```

---

# 34. File Storage

The backend should not depend on its local filesystem for permanent user data.

Local container/server storage can disappear during:

* redeployment
* restart
* scaling
* migration

Persistent user files should eventually use dedicated object storage if the feature is introduced.

---

# 35. Monitoring Infrastructure

Production infrastructure should provide visibility into:

```text id="3q7m8v"
Application availability
CPU
Memory
Database health
Error rates
Response times
Deployment status
```

The initial monitoring solution can use built-in hosting metrics.

More advanced monitoring can be introduced later.

---

# 36. Logging Infrastructure

Logs should be collected somewhere accessible to developers.

At minimum:

```text id="2m8q5v"
Backend logs
Deployment logs
Database alerts where available
```

Logs should be retained long enough to investigate recent production issues.

Sensitive information must not be logged.

---

# 37. Backup Infrastructure

Backups should be handled primarily by the database infrastructure.

The backup strategy should define:

```text id="7q3m9x"
What is backed up?
How often?
How long is it retained?
Where is it stored?
How is it protected?
How is restoration tested?
```

This is expanded in:

```text id="v8m2q4"
07-production/database-and-backups.md
```

---

# 38. Availability

The initial target is reasonable availability rather than elaborate high-availability infrastructure.

A simple architecture may have:

```text id="5m7q2x"
Frontend
    +
Backend
    +
Managed Databases
```

Higher availability can be introduced later through:

* multiple backend instances
* load balancing
* database replicas
* multi-zone infrastructure
* failover strategies

These are not initial requirements.

---

# 39. Infrastructure Failure

Potential infrastructure failures include:

```text id="q9m3v7"
Frontend hosting outage
Backend runtime failure
Database outage
Network failure
DNS failure
Certificate failure
Deployment failure
Resource exhaustion
```

Monitoring and incident-response procedures should provide a way to detect and recover from these failures.

---

# 40. Initial Infrastructure Target

The first production environment should aim for:

```text id="x4m8q2"
                     ┌───────────────┐
                     │   Frontend    │
                     │ Static Host   │
                     └───────┬───────┘
                             │
                           HTTPS
                             │
                     ┌───────▼───────┐
                     │    Backend    │
                     │ Spring Boot  │
                     └───────┬───────┘
                             │
                  ┌──────────┴──────────┐
                  │                     │
           ┌──────▼──────┐       ┌──────▼──────┐
           │ PostgreSQL  │       │   MongoDB   │
           └─────────────┘       └─────────────┘
```

with:

```text id="j2m7v4"
HTTPS
+
DNS
+
Secrets
+
Backups
+
Basic Monitoring
```

---

# 41. What We Are Not Adding Yet

The initial production infrastructure does **not** require:

```text id="k9m4q2"
Kubernetes
Microservices
Kafka
RabbitMQ
Redis
Elasticsearch
Terraform
Multi-region deployment
Service mesh
Complex load balancing
Dedicated DevOps platform
```

These technologies may be useful in other systems, but adding them to Mezgeb without a real requirement would increase complexity without necessarily improving the application.

---

# 42. Future Infrastructure Evolution

A possible evolution is:

```text id="m8q3v7"
Phase 1
Simple hosted architecture

        ↓

Phase 2
CI/CD + monitoring + stronger backups

        ↓

Phase 3
Caching + background jobs + object storage

        ↓

Phase 4
Horizontal scaling if required

        ↓

Phase 5
Advanced infrastructure only when justified
```

The architecture should evolve from actual requirements rather than from technology trends.

---

# 43. Infrastructure Ownership

Infrastructure responsibilities should be clearly separated.

### Application

Responsible for:

* business logic
* API
* validation
* application security

### Hosting Platform

Responsible for:

* compute
* networking
* deployment runtime
* platform availability

### Database Provider

Responsible for:

* database infrastructure
* storage
* backups where provided
* database availability

### Developer

Responsible for:

* correct configuration
* secure credentials
* application deployments
* migrations
* monitoring
* recovery procedures

The exact division depends on the selected providers.

---

# 44. Infrastructure Checklist

## Networking

* [ ] Production domains configured
* [ ] HTTPS enabled
* [ ] DNS configured
* [ ] CORS configured
* [ ] Databases not publicly exposed unnecessarily

## Frontend

* [ ] Production build configured
* [ ] SPA fallback configured
* [ ] HTTPS enabled
* [ ] Production API URL configured

## Backend

* [ ] Runtime configured
* [ ] Production environment variables configured
* [ ] Health checks available
* [ ] Logs accessible
* [ ] Restart behavior verified

## Databases

* [ ] PostgreSQL configured
* [ ] MongoDB configured
* [ ] Credentials secured
* [ ] Access restricted
* [ ] Backups configured
* [ ] Migrations configured

## Security

* [ ] Secrets externalized
* [ ] Least-privilege access
* [ ] Administrative access restricted
* [ ] No production secrets in Git

## Operations

* [ ] Monitoring available
* [ ] Deployment logs accessible
* [ ] Recovery process documented
* [ ] Infrastructure ownership understood

---

# 45. Final Infrastructure Mental Model

Think of Mezgeb infrastructure as the environment that allows the application to exist reliably:

```text id="q2m7v8"
                    INFRASTRUCTURE

                         Internet
                            │
                    ┌───────▼───────┐
                    │      DNS      │
                    └───────┬───────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
         ┌────▼─────┐                ┌────▼─────┐
         │ Frontend │                │ Backend   │
         └───────────┘                └────┬──────┘
                                          │
                              ┌───────────┴──────────┐
                              │                      │
                         ┌────▼────┐            ┌────▼────┐
                         │Postgres │            │ MongoDB │
                         └─────────┘            └─────────┘
```

The central principle is:

> **Infrastructure should make Mezgeb reliable and secure without becoming more complicated than the application requires.**
