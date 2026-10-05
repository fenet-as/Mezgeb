# Deployment

## 1. Purpose

This document defines how Mezgeb is deployed from source code to a production environment.

The deployment process should be:

* repeatable
* automated where practical
* secure
* observable
* reversible
* documented

The initial deployment architecture should remain simple. Infrastructure should only become more complex when the project has a real requirement for it.

---

# 2. Deployment Architecture

The initial production deployment consists of:

```text
                    ┌─────────────────┐
                    │     GitHub      │
                    │   Source Code   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    CI Pipeline  │
                    │ Test + Build    │
                    └────────┬────────┘
                             │
                 ┌───────────┴───────────┐
                 ▼                       ▼
        ┌─────────────────┐     ┌─────────────────┐
        │    Frontend     │     │     Backend     │
        │ React/Vite      │     │  Spring Boot   │
        └────────┬────────┘     └────────┬────────┘
                 │                       │
                 │                       │
                 │                ┌──────┴───────┐
                 │                ▼              ▼
                 │        ┌─────────────┐ ┌─────────────┐
                 │        │ PostgreSQL  │ │   MongoDB   │
                 │        └─────────────┘ └─────────────┘
                 │
                 ▼
               Users
```

The actual hosting providers will be selected during implementation.

---

# 3. Deployment Units

Mezgeb initially has three primary deployment concerns:

### Frontend

```text
React + TypeScript + Vite
```

Built into optimized static assets.

### Backend

```text
Java + Spring Boot
```

Packaged as a deployable application, potentially as a Docker image.

### Databases

```text
PostgreSQL
MongoDB
```

These should be managed separately from the application deployment.

---

# 4. Deployment Environments

The application should distinguish between:

```text
Development
Test
Production
```

An optional staging environment may be introduced later.

### Development

Used by developers locally.

### Test

Used for automated validation.

### Production

Used by real users and contains real persistent data.

The same production database must never be used as a development or test database.

---

# 5. Deployment Flow

The intended deployment lifecycle is:

```text
Developer
    ↓
Create branch
    ↓
Implement change
    ↓
Run local checks
    ↓
Open Pull Request
    ↓
CI validation
    ↓
Merge to main
    ↓
Production build
    ↓
Deploy
    ↓
Health check
    ↓
Monitor
```

The exact trigger may change depending on the selected hosting platform.

---

# 6. Frontend Deployment

The frontend deployment process is:

```text
Frontend Source
      ↓
Install Dependencies
      ↓
Type Check
      ↓
Lint
      ↓
Tests
      ↓
Vite Production Build
      ↓
Static Assets
      ↓
Frontend Hosting
```

The build should use the production API configuration.

For example:

```text
VITE_API_URL=https://api.example.com/api/v1
```

The actual URL will be configured during deployment.

---

# 7. Frontend Build

The production build should be generated with:

```bash
npm run build
```

The resulting build output is the artifact deployed to the frontend hosting platform.

The deployment process should verify that:

* the build succeeds
* assets are generated
* environment configuration is correct
* client-side routing works
* API requests target the production backend

---

# 8. Client-Side Routing

Because Mezgeb uses React Router, the frontend hosting platform must support SPA fallback behavior.

For example:

```text
/app/dashboard
/app/goals
/app/journal
/app/progress
```

should still load the React application when accessed directly.

Without SPA fallback configuration, refreshing a nested route may produce a server-side `404`.

---

# 9. Backend Deployment

The backend deployment process is:

```text
Backend Source
      ↓
Compile
      ↓
Run Tests
      ↓
Package
      ↓
Build Docker Image
      ↓
Deploy
      ↓
Start Spring Boot
      ↓
Health Check
```

The exact packaging strategy can be:

```text
JAR
```

or:

```text
Docker Image
```

Docker is preferred when the selected hosting environment benefits from containerized deployment.

---

# 10. Backend Build

The backend should be built using the Maven wrapper.

Example:

```bash
./mvnw clean package
```

On Windows:

```bash
mvnw.cmd clean package
```

The build should fail if required tests or compilation checks fail.

---

# 11. Docker Deployment

If the backend is containerized:

```text
Dockerfile
    ↓
docker build
    ↓
Docker Image
    ↓
Container Registry / Hosting Platform
    ↓
Production Container
```

The Docker image should contain the application and its runtime dependencies, but not production secrets.

Secrets are supplied at runtime.

---

# 12. Production Configuration

The deployment environment supplies production configuration such as:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
MONGODB_URI
JWT_SECRET
CORS_ALLOWED_ORIGINS
APP_ENV
```

These values must not be baked into the Docker image.

---

# 13. Database Deployment

Application deployment and database deployment are separate concerns.

The production databases should normally be created and managed independently.

Conceptually:

```text
Application Deployment
        │
        ├── Frontend
        └── Backend

Database Infrastructure
        │
        ├── PostgreSQL
        └── MongoDB
```

This prevents an application redeployment from unnecessarily destroying or recreating persistent data.

---

# 14. Database Migrations

Database schema changes must use Flyway migrations.

Deployment flow:

```text
New Version
    ↓
Migration Files
    ↓
CI Tests
    ↓
Migration Review
    ↓
Production Migration
    ↓
Application Deployment
```

Migration ordering must be considered carefully for changes that affect both old and new application versions.

---

# 15. Backward-Compatible Migrations

Where possible, database changes should be compatible with the currently deployed application.

For example, when adding a field:

```text
1. Add nullable/new column
2. Deploy compatible application
3. Populate data if necessary
4. Start using the field
5. Apply stricter constraints later
```

Avoid combining destructive database changes with application changes that still depend on the old schema unless the deployment process guarantees compatibility.

---

# 16. Deployment Order

For database-affecting releases, the preferred sequence is generally:

```text
1. Prepare migration
2. Validate migration
3. Deploy compatible schema
4. Deploy application
5. Verify health
6. Monitor
```

The exact ordering may change depending on the migration.

---

# 17. Health Checks

After deployment, the system should verify that the application is healthy.

A health endpoint should be available through the backend.

Conceptually:

```text
GET /health
```

or an appropriate Spring Boot Actuator endpoint.

Deployment should not be considered successful simply because the process started.

The application must actually be able to serve requests.

---

# 18. Post-Deployment Verification

After deployment:

```text
- [ ] Frontend loads
- [ ] Backend health check succeeds
- [ ] API requests succeed
- [ ] Authentication works
- [ ] Database connection works
- [ ] Journal/database connection works
- [ ] CORS works correctly
- [ ] Protected routes work
- [ ] Production logs contain no startup errors
```

A small smoke test should verify the core application flow.

---

# 19. Production Smoke Test

A minimal smoke test can be:

```text
Open Mezgeb
    ↓
Register / Login
    ↓
Open Dashboard
    ↓
Create Goal
    ↓
Create Milestone
    ↓
Create Task
    ↓
Complete Task
    ↓
Record Learning Session
    ↓
Open Progress
    ↓
Open Journal
```

This does not replace automated testing.

It verifies that the deployed system is functioning as an integrated application.

---

# 20. Environment Variables During Deployment

Environment-specific values should be supplied by the deployment platform.

### Frontend

Public build-time variables:

```text
VITE_API_URL
VITE_APP_NAME
VITE_APP_ENV
```

### Backend

Server-side variables:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
MONGODB_URI
JWT_SECRET
CORS_ALLOWED_ORIGINS
APP_ENV
```

See:

```text
05-development/environment-variables.md
```

for the configuration rules.

---

# 21. Secret Handling

Production deployment must never require committing secrets to Git.

Bad:

```text
git commit .env
```

Bad:

```text
ENV JWT_SECRET=real-secret
```

inside a committed Dockerfile.

Good:

```text
Production Platform
        ↓
Secure Environment Variable
        ↓
Application Runtime
```

---

# 22. Deployment Artifacts

A deployment artifact is the output that is actually deployed.

For the frontend:

```text
Vite production build
```

For the backend:

```text
JAR
```

or:

```text
Docker image
```

Artifacts should be reproducible from a known source revision.

---

# 23. Version Identification

Each production deployment should be traceable to a Git commit.

For example:

```text
Production
Version: v0.4.0
Commit: abc1234
```

The exact versioning strategy is defined in:

```text
07-production/release-management.md
```

This makes debugging and rollback easier.

---

# 24. Deployment Logs

Deployment logs should be retained by the CI/CD or hosting platform.

Useful information includes:

* build status
* dependency installation
* test results
* build output
* deployment status
* startup errors
* health-check results

Secrets must not appear in deployment logs.

---

# 25. Failed Deployment

If deployment fails:

```text
Deployment
    ↓
Failure
    ↓
Inspect CI / hosting logs
    ↓
Identify cause
    ↓
Fix
    ↓
Run validation
    ↓
Retry
```

Do not manually modify production infrastructure as the first response unless necessary for recovery.

The goal is to make the normal deployment process reproducible.

---

# 26. Failed Application Startup

If the application deploys but fails to start, investigate:

```text
Configuration
Database connectivity
Environment variables
Migration errors
Port configuration
Dependency failures
Application startup logs
```

Common causes include:

* missing environment variable
* incorrect database URL
* invalid credentials
* failed migration
* incompatible dependency
* incorrect server port

---

# 27. Rollback

The application should have a documented rollback strategy.

For an application-only failure:

```text
Current Version
      ↓
Previous Known-Good Version
      ↓
Redeploy
      ↓
Health Check
```

Database rollback requires additional care.

Never assume that an application rollback automatically rolls back database changes.

---

# 28. Database Rollback

Database migrations should preferably be designed so that application rollback is safe.

Avoid relying heavily on destructive rollback migrations.

For important production changes:

```text
Backup
  +
Migration
  +
Compatible Application
```

should be considered together.

---

# 29. Zero-Downtime Deployment

Zero-downtime deployment is not an initial requirement.

For an early Mezgeb deployment, a short restart during deployment may be acceptable.

As usage grows, deployment can evolve toward:

```text
Old Instance
     +
New Instance
     ↓
Health Check
     ↓
Traffic Switch
     ↓
Old Instance Removed
```

This should only be introduced when necessary.

---

# 30. Deployment Frequency

The goal is not to deploy as frequently as possible.

The goal is to make deployments:

* predictable
* small
* tested
* traceable
* recoverable

Small changes are generally easier to debug and roll back than large batches of unrelated changes.

---

# 31. Production Deployment Checklist

## Before Deployment

```text
- [ ] Feature complete
- [ ] Tests pass
- [ ] Type checking passes
- [ ] Lint passes
- [ ] Production build succeeds
- [ ] Database migration reviewed
- [ ] Environment variables verified
- [ ] Security-sensitive changes reviewed
- [ ] Changelog updated
```

## During Deployment

```text
- [ ] Correct commit deployed
- [ ] Database migration succeeds
- [ ] Backend starts
- [ ] Frontend deploys
- [ ] Health check succeeds
```

## After Deployment

```text
- [ ] Frontend accessible
- [ ] API accessible
- [ ] Authentication works
- [ ] Core user flow works
- [ ] Database operations work
- [ ] Logs reviewed
- [ ] No unexpected errors
```

---

# 32. Initial Deployment Strategy

For the first production release, prefer:

```text
Simple hosting
+
Managed databases
+
HTTPS
+
Environment variables
+
Automated CI checks
+
Simple rollback
+
Basic monitoring
```

Avoid introducing infrastructure solely because it appears in a typical production architecture diagram.

---

# 33. Future Deployment Improvements

As Mezgeb grows, deployment may evolve to include:

```text
Staging environment
Preview deployments
Container registry
Automated database migrations
Blue/green deployment
Canary deployment
Zero-downtime releases
Infrastructure as Code
Automated rollback
Advanced release strategies
```

These should be introduced when justified by project requirements.

---

# 34. Deployment Mental Model

The deployment system should follow:

```text
Code
  ↓
Validate
  ↓
Build
  ↓
Package
  ↓
Deploy
  ↓
Health Check
  ↓
Smoke Test
  ↓
Monitor
```

The central principle is:

> **A deployment is not complete when the application starts. It is complete when the deployed system has been verified to work correctly and can be monitored and recovered if something goes wrong.**
