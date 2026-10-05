# Release Management

## 1. Purpose

This document defines how Mezgeb changes move from development into production releases.

Release management exists to make releases:

* predictable
* traceable
* reviewable
* reversible where practical
* understandable
* safe for users

A release is more than pushing code to a server.

It represents a known version of Mezgeb containing a specific set of changes.

---

# 2. Deployment vs Release

These concepts should be distinguished.

### Deployment

Moves application artifacts into an environment.

```text
Build
  ↓
Deploy
  ↓
Production Environment
```

### Release

Makes a specific version available as a meaningful product change.

```text
Changes
  ↓
Version
  ↓
Release
  ↓
Users
```

A deployment can happen without a user-visible release.

For example, infrastructure or configuration changes may be deployed without changing application functionality.

---

# 3. Release Principles

Mezgeb follows these principles:

1. Releases should be traceable to source code.
2. Production should contain known versions.
3. Important changes should be reviewed before release.
4. Releases should be tested before reaching users.
5. Database changes must be considered alongside application releases.
6. Failed releases should have a recovery strategy.
7. Release history should be documented.
8. Release complexity should remain proportional to the project.

---

# 4. Release Lifecycle

The general lifecycle is:

```text id="m8q3v7"
Development
     ↓
Local Testing
     ↓
Pull Request
     ↓
CI
     ↓
Code Review
     ↓
Merge to Main
     ↓
Release Candidate
     ↓
Production Deployment
     ↓
Smoke Tests
     ↓
Release
     ↓
Monitor
```

The exact automation may evolve over time.

---

# 5. Source of Truth

Git is the source of truth for application source code.

A production release should be traceable to:

* Git commit
* branch
* release version
* build artifact
* deployment

For example:

```text id="q4m7x2"
Release v0.4.0
      ↓
Commit abc1234
      ↓
Production Deployment
```

---

# 6. Versioning

Mezgeb may use Semantic Versioning:

```text id="7m3q8v"
MAJOR.MINOR.PATCH
```

For example:

```text
1.4.2
```

where:

* `1` = major version
* `4` = minor version
* `2` = patch version

Versioning should communicate meaningful changes rather than every individual Git commit.

---

# 7. Major Versions

A major version may represent breaking changes.

Examples:

```text id="m3q8v7"
Breaking API contract
Major authentication changes
Significant data model changes
Breaking frontend behavior
```

Major versions should be used intentionally.

An early project may remain in `0.x` while the product is still evolving.

---

# 8. Minor Versions

A minor version generally represents new backward-compatible functionality.

Examples:

```text id="q8m2v4"
New journal functionality
New progress feature
New dashboard capability
New filtering feature
```

---

# 9. Patch Versions

Patch releases generally contain fixes that do not introduce significant new functionality.

Examples:

```text id="m7q3v8"
Bug fix
Security patch
UI correction
Small performance improvement
```

---

# 10. Pre-1.0 Releases

During active development, Mezgeb may use versions such as:

```text id="q4m8v2"
0.1.0
0.2.0
0.3.0
```

Before `1.0.0`, breaking changes can occur more frequently.

Once the product reaches a stable public stage, versioning can transition to `1.x`.

---

# 11. Git Commits vs Releases

Not every commit requires a release.

For example:

```text id="m8q3v7"
20 commits
     ↓
1 feature
     ↓
1 release
```

Git history records development activity.

Release history records meaningful product versions.

Both serve different purposes.

---

# 12. Release Branching

The initial workflow should remain simple.

Preferred flow:

```text id="q7m2v8"
feature branch
      ↓
Pull Request
      ↓
main
      ↓
Production
```

A dedicated release branch is not required initially.

It can be introduced later if the project needs more controlled release preparation.

---

# 13. Release Candidates

For larger releases, a release candidate can represent a version believed to be ready for production.

Example:

```text id="m3q8v7"
0.5.0-rc.1
```

The project does not need release candidates for every small change.

They become useful when releases become larger or riskier.

---

# 14. Pull Request Requirements

Before merging significant changes:

* code should be reviewed
* tests should pass
* linting should pass
* type checking should pass
* builds should pass
* security-sensitive changes should be reviewed carefully
* documentation should be updated where necessary

---

# 15. CI Validation

CI should validate the release candidate before it reaches production.

Typical checks:

```text id="q8m4v2"
Install dependencies
      ↓
Type check
      ↓
Lint
      ↓
Unit/component tests
      ↓
Backend tests
      ↓
Build
      ↓
Optional E2E tests
```

See:

`07-production/ci-cd.md`

for the detailed CI/CD strategy.

---

# 16. Release Readiness

Before production release, verify:

### Code

* [ ] Intended changes merged
* [ ] No accidental changes
* [ ] Code reviewed

### Tests

* [ ] Frontend tests pass
* [ ] Backend tests pass
* [ ] Build succeeds
* [ ] Critical E2E tests pass when applicable

### Database

* [ ] Required migrations reviewed
* [ ] Migration compatibility considered
* [ ] Backup strategy verified for risky changes

### Configuration

* [ ] Production environment variables available
* [ ] No secrets committed
* [ ] Production API configuration correct

### Documentation

* [ ] Changelog updated
* [ ] Important decisions documented
* [ ] Known issues updated if necessary

---

# 17. Release Notes

Meaningful releases should have release notes.

Release notes should explain:

* what changed
* what was fixed
* important technical changes
* security changes when appropriate
* migration requirements
* known limitations

Example:

```text id="m7q3v8"
## v0.5.0

### Added
- Learning session tracking
- Session history on goal pages

### Changed
- Dashboard activity layout

### Fixed
- Goal progress calculation

### Database
- Added learning_sessions table
```

---

# 18. Changelog

The project's `06-project/changelog.md` records meaningful project history.

The changelog should not simply duplicate every Git commit.

It should provide a human-readable history of important changes.

---

# 19. Release Metadata

A release should ideally identify:

```text id="q4m8v2"
Version
Git commit
Release date
Major changes
Database changes
Known issues
```

This makes production debugging easier.

---

# 20. Release Tags

Git tags can identify release commits.

For example:

```text id="m8q2v7"
v0.1.0
v0.2.0
v0.2.1
```

A release tag should point to the exact commit represented by that release.

---

# 21. Release Artifacts

Production deployments should use known build artifacts.

For example:

```text id="q7m3v8"
Source Commit
      ↓
CI Build
      ↓
Production Artifact
      ↓
Deployment
```

This improves reproducibility.

---

# 22. Frontend Release

A frontend release generally involves:

```text id="m3q8v7"
Source
  ↓
npm ci
  ↓
Type Check
  ↓
Lint
  ↓
Tests
  ↓
npm run build
  ↓
Production Assets
  ↓
Deployment
```

The production frontend must use the correct production API configuration.

---

# 23. Backend Release

A backend release generally involves:

```text id="q8m2v4"
Source
  ↓
Maven Build
  ↓
Tests
  ↓
Package
  ↓
Production Artifact / Container
  ↓
Deployment
```

If Docker is used:

```text id="m7q3v8"
Source
  ↓
Docker Build
  ↓
Container Image
  ↓
Registry
  ↓
Production Runtime
```

---

# 24. Database Release

Database changes must be coordinated with application changes.

For example:

```text id="q4m8v2"
Application v0.6
        +
Migration V6
```

The release process must verify that the application and schema are compatible.

---

# 25. Safe Migration Sequence

A safer migration sequence is often:

```text id="m8q3v7"
Add compatible schema
        ↓
Deploy compatible application
        ↓
Migrate/backfill data
        ↓
Switch behavior
        ↓
Remove obsolete schema later
```

This is preferable to combining multiple destructive changes into one release when avoidable.

---

# 26. Configuration Releases

Not every production change requires an application release.

For example:

```text id="q7m2v8"
Environment variable change
Infrastructure configuration
Monitoring configuration
```

However, configuration changes should still be tracked and documented when they materially affect the application.

---

# 27. Feature Flags

Feature flags can separate deployment from release.

Conceptually:

```text id="m3q8v7"
Code deployed
      ↓
Feature OFF
      ↓
Testing
      ↓
Feature ON
      ↓
Released
```

Feature flags are not required for the initial MVP.

They may become useful for larger or higher-risk features.

---

# 28. Rollout Strategy

The initial rollout strategy can be simple:

```text id="q8m4v2"
Deploy
  ↓
Health Check
  ↓
Smoke Test
  ↓
Monitor
```

More advanced strategies can be introduced later.

---

# 29. Blue-Green Deployment

Blue-green deployment maintains two environments:

```text id="m7q3v8"
Blue → Current
Green → New
```

Traffic can switch between them.

This is useful for reducing deployment downtime but adds infrastructure complexity.

It is not required initially.

---

# 30. Canary Deployment

Canary deployment releases a new version to a small portion of users first.

Conceptually:

```text id="q4m8v2"
New Version
    ↓
Small Traffic
    ↓
Monitor
    ↓
Expand
```

This can reduce risk for large systems.

It is not required for the initial Mezgeb deployment.

---

# 31. Rollback

Every production release should have a recovery strategy.

For application code:

```text id="m8q3v7"
Current
  ↓
New Release
  ↓
Problem
  ↓
Previous Release
```

Rollback should be possible where the deployment platform supports it.

---

# 32. Database Rollback Warning

Application rollback does not guarantee database rollback.

For example:

```text id="q7m3v8"
Release A
  ↓
Migration A
  ↓
Release B
  ↓
Migration B
  ↓
Problem
```

Deploying Release A again may not work if Migration B changed the schema incompatibly.

Database migrations therefore require separate rollback/recovery planning.

---

# 33. Release Failure

If a release fails:

```text id="m3q8v7"
Stop
 ↓
Identify failure
 ↓
Protect user data
 ↓
Determine whether rollback is safe
 ↓
Rollback or fix forward
 ↓
Verify
 ↓
Monitor
```

Do not automatically roll back database changes without understanding their consequences.

---

# 34. Rollback vs Fix Forward

Sometimes rollback is safer.

Sometimes a forward fix is safer.

The decision depends on:

* type of failure
* database changes
* data integrity
* severity
* availability
* complexity of rollback

The goal is restoring a correct, stable system—not blindly returning to an older version.

---

# 35. Smoke Testing

After deployment, perform a small set of critical checks.

Example:

```text id="q8m2v4"
Open application
      ↓
Login
      ↓
Open dashboard
      ↓
Create goal
      ↓
Create task
      ↓
Complete task
      ↓
Record learning session
      ↓
Verify progress
```

This verifies that the core learning loop still works.

---

# 36. Post-Release Monitoring

Immediately after release, monitor:

```text id="m7q3v8"
5xx errors
Authentication failures
Response time
Database connectivity
Frontend runtime errors
Health checks
```

Compare behavior with the previous version when useful.

---

# 37. Release Windows

Early Mezgeb releases do not require formal release windows.

As the application grows, release timing may become important.

Potential considerations:

* user activity
* maintenance windows
* database migrations
* team availability
* rollback capability

---

# 38. Emergency Releases

Security fixes or severe production bugs may require an expedited release.

Emergency releases should still include:

* focused testing
* review when practical
* deployment traceability
* monitoring
* documentation afterward

Speed should not mean abandoning all safeguards.

---

# 39. Security Releases

Security fixes should be treated with appropriate priority.

A security release may require:

```text id="q3m8v7"
Identify vulnerability
      ↓
Develop fix
      ↓
Test
      ↓
Deploy
      ↓
Verify
      ↓
Rotate credentials if necessary
      ↓
Document
```

Sensitive vulnerability details should not necessarily be publicly disclosed before the issue is fixed.

---

# 40. Release Ownership

Every release should have a clear person responsible for confirming:

* release readiness
* deployment completion
* smoke tests
* monitoring
* rollback decision if required

For a solo project, this may simply be the developer maintaining Mezgeb.

---

# 41. Release Documentation

Important release information should be recorded in:

```text id="m8q2v7"
06-project/changelog.md
06-project/decisions.md
```

and, when appropriate:

```text id="q7m3v8"
Known issues
Security documentation
Database migration history
```

---

# 42. Release Checklist

## Before Release

* [ ] Changes reviewed
* [ ] Tests pass
* [ ] Type checking passes
* [ ] Lint passes
* [ ] Production build succeeds
* [ ] Database migrations reviewed
* [ ] Environment variables verified
* [ ] Release version chosen
* [ ] Changelog updated
* [ ] Known issues reviewed

## During Release

* [ ] Build/artifact identified
* [ ] Database migration executed safely
* [ ] Application deployed
* [ ] Health check passes
* [ ] Smoke test performed

## After Release

* [ ] Logs checked
* [ ] Error rate checked
* [ ] Database health checked
* [ ] Frontend checked
* [ ] Core learning flow verified
* [ ] Release marked complete

---

# 43. Release History

A release history might eventually look like:

```text id="m3q8v7"
v0.1.0
Initial application foundation

v0.2.0
Authentication

v0.3.0
Goals and milestones

v0.4.0
Tasks

v0.5.0
Learning sessions

v0.6.0
Journal

v0.7.0
Dashboard and progress

v1.0.0
Initial stable release
```

These versions are illustrative rather than a fixed schedule.

---

# 44. Initial Release Strategy

The initial Mezgeb release process is intentionally lightweight:

```text id="q8m4v2"
Feature Branch
      ↓
Pull Request
      ↓
CI
      ↓
Review
      ↓
main
      ↓
Build
      ↓
Deploy
      ↓
Smoke Test
      ↓
Monitor
      ↓
Release Tag
```

The process can become more sophisticated as the application grows.

---

# 45. Future Release Improvements

Potential future additions include:

* staging environment
* preview deployments
* release candidates
* feature flags
* automated release notes
* automated semantic versioning
* canary releases
* blue-green deployments
* approval gates
* automated rollback
* progressive delivery

None are required simply because they exist.

---

# 46. Final Release Mental Model

Think of release management as controlling the path from code to users:

```text id="m7q3v8"
                Code
                  │
                  ▼
               Review
                  │
                  ▼
                 CI
                  │
                  ▼
             Build Version
                  │
                  ▼
              Deploy
                  │
                  ▼
            Smoke Test
                  │
                  ▼
              Release
                  │
                  ▼
              Monitor
                  │
             ┌────┴────┐
             ▼         ▼
          Healthy    Problem
             │         │
             ▼         ▼
         Continue   Recover
```

The central principle is:

> **A release is a controlled, traceable change from one known application state to another—not simply a deployment command.**
