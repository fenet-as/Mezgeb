# CI/CD

## 1. Purpose

This document defines the Continuous Integration and Continuous Deployment (CI/CD) strategy for Mezgeb.

CI/CD should make the process of validating and deploying Mezgeb:

* automated
* repeatable
* consistent
* traceable
* secure
* easy to understand

The initial CI/CD system will use GitHub Actions unless a different provider is chosen later.

---

# 2. CI vs CD

## Continuous Integration

CI automatically checks changes when developers push code or open pull requests.

Typical checks include:

```text
Code
 ↓
Install
 ↓
Type Check
 ↓
Lint
 ↓
Tests
 ↓
Build
```

The purpose is to detect problems before changes are merged.

---

## Continuous Deployment

CD takes validated code and deploys it to an environment.

Conceptually:

```text
Validated Code
      ↓
Build
      ↓
Deploy
      ↓
Production
```

CI answers:

> "Does this change work?"

CD answers:

> "Can we safely deliver this change?"

---

# 3. CI/CD Goals

Mezgeb's CI/CD system should:

1. Validate pull requests automatically.
2. Prevent broken code from being merged.
3. Build frontend and backend consistently.
4. Run automated tests.
5. Detect type and linting errors.
6. Build production artifacts.
7. Deploy approved changes.
8. Keep deployments traceable to Git commits.
9. Protect production secrets.
10. Provide useful failure logs.

---

# 4. CI/CD Architecture

The initial pipeline is:

```text id="p8m4q2"
Developer
    │
    ▼
Git Push
    │
    ▼
GitHub
    │
    ▼
GitHub Actions
    │
    ├── Type Check
    ├── Lint
    ├── Frontend Tests
    ├── Backend Tests
    ├── Build
    └── Security Checks
             │
             ▼
        Merge to main
             │
             ▼
       Production Build
             │
             ▼
          Deploy
             │
             ▼
       Health Check
```

---

# 5. CI Trigger Events

CI should run on important repository events.

Initial triggers:

```text id="m7q3v8"
Pull Request
Push to main
```

Optional future triggers:

```text id="q4m8x2"
Scheduled security checks
Manual workflow dispatch
Release creation
```

---

# 6. Pull Request CI

Every pull request should run automated validation.

Conceptually:

```text id="7m2q9v"
Pull Request
     ↓
Install Dependencies
     ↓
Frontend Checks
     ↓
Backend Checks
     ↓
Build
     ↓
Status
```

The pull request should not be merged when required checks fail.

---

# 7. Frontend CI

Frontend CI should initially run:

```text id="x3m8q5"
Install dependencies
        ↓
Type check
        ↓
Lint
        ↓
Unit/component tests
        ↓
Production build
```

Example commands:

```bash id="q8m2v4"
npm ci
npm run lint
npm run test:run
npm run build
```

The exact scripts will depend on the final `package.json`.

---

# 8. Type Checking

TypeScript should be checked in CI.

Conceptually:

```bash id="m4q7x9"
tsc --noEmit
```

This verifies that the project has no TypeScript errors without generating output files.

Type checking should be separate from linting because they detect different categories of problems.

---

# 9. Frontend Linting

ESLint should run automatically.

Example:

```bash id="v2m8q3"
npm run lint
```

Linting helps detect:

* incorrect patterns
* unused variables
* problematic React patterns
* accessibility issues where configured
* code-quality problems

---

# 10. Frontend Tests

Vitest and React Testing Library should run in CI.

Example:

```bash id="8q3m7x"
npm run test:run
```

Tests should cover important behavior rather than implementation details.

---

# 11. Backend CI

Backend CI should initially run:

```text id="m9q2v4"
Install dependencies
        ↓
Compile
        ↓
Unit tests
        ↓
Integration tests
        ↓
Package
```

Example:

```bash id="4x8m1q"
./mvnw clean verify
```

On Windows:

```bash id="k7m3v9"
mvnw.cmd clean verify
```

---

# 12. Database-Dependent Tests

Some backend tests may require PostgreSQL or MongoDB.

The CI environment should provide isolated test databases.

Potential approaches:

```text id="3m8q5v"
Testcontainers
```

or:

```text id="q2x7m9"
CI service containers
```

The exact approach will be finalized during implementation.

Production databases must never be used for CI tests.

---

# 13. Integration Tests

Integration tests should verify that multiple layers work together.

Examples:

```text id="7m4q8x"
Controller
   ↓
Service
   ↓
Repository
   ↓
Database
```

Important areas include:

* authentication
* authorization
* goals
* milestones
* tasks
* learning sessions
* journal
* progress

---

# 14. E2E Tests

Playwright can eventually run critical end-to-end journeys.

For example:

```text id="p4m8q2"
Register
  ↓
Login
  ↓
Create Goal
  ↓
Create Milestone
  ↓
Create Task
  ↓
Complete Task
  ↓
Record Session
  ↓
Review Progress
  ↓
Create Journal Entry
```

E2E tests should focus on critical user journeys rather than every possible UI state.

---

# 15. CI Test Pyramid

The pipeline should maintain a sensible testing distribution:

```text id="6q2m9v"
             ┌──────────────┐
             │     E2E      │
             │     Few      │
             ├──────────────┤
             │ Integration  │
             │    Medium    │
             ├──────────────┤
             │    Unit      │
             │     Many     │
             └──────────────┘
```

The goal is fast feedback while still providing meaningful confidence.

---

# 16. Build Verification

CI should verify that both applications can be built.

Frontend:

```text id="m8q3x7"
npm run build
```

Backend:

```text id="v4m9q2"
./mvnw package
```

A successful test suite is not enough if the application cannot produce a production artifact.

---

# 17. Dependency Installation

CI should use deterministic dependency installation.

For npm:

```bash id="q7m3x9"
npm ci
```

rather than:

```bash id="j4m8v2"
npm install
```

for the normal CI installation step.

This uses the lockfile to reproduce the expected dependency tree.

---

# 18. Dependency Caching

GitHub Actions may cache:

```text id="8m2q5v"
npm dependencies
Maven dependencies
```

to reduce build time.

Caching is an optimization.

A cache failure should not prevent the pipeline from working correctly.

---

# 19. CI Jobs

The workflow may be divided into jobs such as:

```text id="m3q8v5"
frontend
backend
integration
build
```

or combined into fewer jobs initially.

The structure should prioritize clarity over excessive workflow complexity.

---

# 20. Example CI Flow

Conceptually:

```text id="x7m2q9"
Pull Request
     │
     ├──────────────┐
     ▼              ▼
 Frontend         Backend
     │              │
 Type Check       Compile
     │              │
 Lint             Unit Tests
     │              │
 Tests            Integration Tests
     │              │
 Build            Package
     └───────┬──────┘
             ▼
        CI Passed
```

---

# 21. Branch Protection

The `main` branch should be protected.

Recommended rules:

```text id="q4m7x2"
Require pull request
Require CI checks
Require successful build
Require review where appropriate
Prevent direct force pushes
```

The exact branch protection settings will depend on repository configuration.

---

# 22. Main Branch

The `main` branch should represent code that is suitable for deployment.

A simplified workflow:

```text id="8m3q7v"
feature branch
      ↓
Pull Request
      ↓
CI
      ↓
Review
      ↓
main
```

Production deployment can then be triggered by changes to `main`.

---

# 23. Deployment Trigger

The initial production deployment strategy may be:

```text id="m2q8v4"
Merge to main
      ↓
CI
      ↓
Production Build
      ↓
Deploy
```

An alternative is:

```text id="7x3m9q"
Create Release
      ↓
Deploy
```

The final strategy should be selected based on the hosting platform and desired release workflow.

---

# 24. Environment Separation in CI/CD

CI/CD should distinguish:

```text id="p5m8q2"
Pull Request
     ↓
Test Environment

main
     ↓
Production
```

Production secrets should not be available to normal pull-request workflows.

This is particularly important for workflows triggered by code from branches that may not be trusted.

---

# 25. Production Secrets

Production secrets should be stored using GitHub's protected secrets or the deployment provider's secret-management system.

Examples:

```text id="3q7m2x"
PRODUCTION_DATABASE_PASSWORD
PRODUCTION_JWT_SECRET
PRODUCTION_MONGODB_URI
```

The actual names depend on implementation.

Secrets must never be written directly into workflow YAML.

---

# 26. Secret Safety in CI

CI workflows must avoid:

```text id="m8q3v7"
echo $SECRET
```

or other commands that expose sensitive values.

Be careful with:

* command output
* error messages
* build logs
* generated files
* test reports
* artifact uploads

---

# 27. Pull Request Security

Pull-request workflows should be designed carefully.

External contributions should not automatically receive access to production secrets.

A safe conceptual model is:

```text id="q2m7x4"
Pull Request
     ↓
Untrusted Code
     ↓
Isolated CI
```

while:

```text id="v8m3q1"
main
 ↓
Trusted Deployment Workflow
 ↓
Production Secrets
```

is handled separately.

---

# 28. Deployment Jobs

A deployment workflow may eventually contain:

```text id="4m7q9x"
build
  ↓
deploy-frontend
  ↓
deploy-backend
  ↓
migration
  ↓
health-check
```

The exact ordering depends on the hosting and database strategy.

---

# 29. Database Migrations in CI/CD

Database migrations require special care.

The deployment system should ensure:

```text id="m2x8q5"
Migration
    ↓
Success
    ↓
Application Deployment
```

or another explicitly tested compatible strategy.

A failed migration should prevent the release from being considered successful.

---

# 30. Migration Safety

CI should test migrations against an isolated database.

For important migrations:

```text id="7q3m8v"
Create migration
      ↓
Run against clean database
      ↓
Run against representative existing schema
      ↓
Run application tests
      ↓
Review
```

This reduces the risk of discovering migration problems in production.

---

# 31. Deployment Health Checks

After deployment, CI/CD should verify application health.

Conceptually:

```text id="m9q4x7"
Deploy
  ↓
Wait for startup
  ↓
Health endpoint
  ↓
HTTP success
  ↓
Deployment successful
```

If the health check fails, the deployment should be marked unsuccessful.

---

# 32. Smoke Tests

After deployment, a lightweight smoke test may verify:

```text id="q8m3v2"
Frontend loads
Backend responds
Authentication endpoint responds
Protected API responds
Database connection works
```

Full E2E testing does not necessarily need to run after every deployment if the cost is too high.

---

# 33. Deployment Failure

If deployment fails:

```text id="x3m7q9"
Build / Deploy Failure
        ↓
Mark deployment failed
        ↓
Preserve logs
        ↓
Investigate
        ↓
Fix
        ↓
Retry
```

The production system should not be reported as healthy when the deployment has not passed its verification checks.

---

# 34. Rollback

A failed application deployment should have a rollback strategy.

Conceptually:

```text id="7m2q4x"
Current Version
      ↓
Failure
      ↓
Previous Known-Good Version
      ↓
Redeploy
      ↓
Health Check
```

Database changes must be handled separately because application rollback does not automatically undo database migrations.

---

# 35. CI/CD Artifacts

Useful artifacts may include:

```text id="q5m8v3"
Frontend production build
Backend JAR
Docker image
Test reports
Coverage reports
Build metadata
```

Artifacts should be retained only as long as they provide useful operational value.

---

# 36. Version Traceability

Every production deployment should be traceable to:

```text id="m7x2q8"
Git commit
+
Build
+
Deployment
+
Application version
```

This allows developers to answer:

> "Which exact version is running in production?"

---

# 37. Notifications

CI/CD should eventually notify developers about:

* failed CI
* failed deployment
* successful deployment
* production health problems

For the initial project, GitHub notifications may be sufficient.

Additional integrations can be added later.

---

# 38. CI/CD Performance

CI should remain reasonably fast.

Possible optimizations:

```text id="3m8q7v"
Dependency caching
Parallel jobs
Test grouping
Build caching
Selective E2E execution
```

Do not optimize CI before measuring actual bottlenecks.

---

# 39. Dependency and Security Checks

CI can eventually include:

```text id="q2m9v4"
Dependency vulnerability scanning
Secret scanning
Static analysis
Outdated dependency checks
```

GitHub's built-in security capabilities may provide some of these.

The exact security tooling should be finalized after the core pipeline works.

---

# 40. Scheduled Checks

Some checks do not need to run on every pull request.

Examples:

```text id="m4x8q2"
Dependency vulnerability scan
Dependency update check
Security audit
```

These can run on a schedule.

---

# 41. CI/CD and Git Workflow

The project workflow becomes:

```text id="p7m3q9"
Create Branch
      ↓
Implement
      ↓
Local Tests
      ↓
Push
      ↓
Pull Request
      ↓
CI
      ↓
Review
      ↓
Merge
      ↓
Production Deployment
      ↓
Monitor
```

This connects development workflow with production operations.

---

# 42. Initial GitHub Actions Structure

The repository may eventually contain:

```text id="8q2m7v"
.github/
└── workflows/
    ├── ci.yml
    └── deploy.yml
```

Initially, a single workflow may be sufficient.

As the project grows, separating CI and deployment can improve clarity.

---

# 43. Example CI Workflow Structure

Conceptually:

```yaml id="f3m8q2"
name: CI

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  frontend:
    # install
    # type check
    # lint
    # test
    # build

  backend:
    # compile
    # test
    # package
```

The actual workflow should be written when the repository structure and package scripts are finalized.

---

# 44. Example Deployment Workflow Structure

Conceptually:

```yaml id="m8q4x7"
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    # build
    # deploy
    # health check
```

The actual deployment steps depend on the selected hosting providers.

---

# 45. What CI/CD Does Not Replace

CI/CD does not replace:

* code review
* application testing
* security review
* monitoring
* backups
* incident response
* good architecture
* developer judgment

Automation reduces repetitive work, but it does not eliminate responsibility.

---

# 46. Initial CI/CD Scope

The first Mezgeb CI/CD implementation should target:

```text id="q3m7v8"
✓ Pull request validation
✓ Type checking
✓ Linting
✓ Frontend tests
✓ Backend tests
✓ Production builds
✓ Main branch protection
✓ Production deployment
✓ Deployment health check
```

---

# 47. Future CI/CD Improvements

Possible future additions:

```text id="m2q8v4"
✓ Preview deployments
✓ Staging environment
✓ E2E tests in CI
✓ Automated database migrations
✓ Security scanning
✓ Dependency automation
✓ Deployment approvals
✓ Automated rollback
✓ Release automation
✓ Infrastructure as Code
```

These should be introduced incrementally.

---

# 48. CI/CD Checklist

## Pull Request

* [ ] Dependencies install successfully
* [ ] Type checking passes
* [ ] Linting passes
* [ ] Frontend tests pass
* [ ] Backend tests pass
* [ ] Build succeeds

## Main

* [ ] Required checks pass
* [ ] Branch protection is active
* [ ] Production build succeeds
* [ ] Deployment starts

## Deployment

* [ ] Correct commit deployed
* [ ] Environment variables available
* [ ] Database migration succeeds
* [ ] Backend starts
* [ ] Frontend deploys
* [ ] Health check succeeds
* [ ] Smoke test succeeds

## Security

* [ ] Production secrets protected
* [ ] Secrets unavailable to untrusted PRs
* [ ] Secrets not printed in logs
* [ ] Deployment permissions restricted

---

# 49. Final CI/CD Mental Model

The complete lifecycle is:

```text id="v4m8q2"
               DEVELOPMENT

                  Code
                   │
                   ▼
              Local Tests
                   │
                   ▼
             Pull Request
                   │
                   ▼
                  CI
          ┌────────┼────────┐
          ▼        ▼        ▼
        Lint     Tests    Build
          └────────┼────────┘
                   ▼
                Review
                   │
                   ▼
                 main
                   │
                   ▼
             Production CD
                   │
                   ▼
               Deploy
                   │
                   ▼
             Health Check
                   │
                   ▼
                Monitor
```

The central principle is:

> **CI/CD should make the safe path the easy path: validate changes automatically, deploy repeatably, and verify that production is actually healthy.**
