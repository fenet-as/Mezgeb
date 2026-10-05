# Database & Backups

## 1. Purpose

This document defines how Mezgeb's production data is stored, protected, backed up, restored, and migrated.

The primary goals are:

* protect user data
* prevent accidental data loss
* make database changes repeatable
* support reliable deployments
* enable recovery from failures
* understand what happens when a database becomes unavailable

---

# 2. Production Data

Mezgeb's persistent data includes:

```text id="m8q3v7"
Users
Goals
Milestones
Tasks
Learning Sessions
Activity
Journal Entries
Progress-related data
```

The initial architecture uses:

```text id="q4m7x2"
PostgreSQL
    ↓
Primary relational application data

MongoDB
    ↓
Journal / reflection documents
```

The MongoDB decision remains subject to future review.

---

# 3. Database Architecture

The initial production architecture is:

```text id="7m3q8v"
                    Backend
                   /       \
                  /         \
                 ▼           ▼
          PostgreSQL       MongoDB
             │                │
             ▼                ▼
       Structured Data    Journal Data
```

The backend is responsible for controlling access to both databases.

The frontend must never connect directly to either production database.

---

# 4. Database Hosting

Production databases should preferably use managed database services.

Managed databases can provide:

* automated backups
* monitoring
* patching
* replication options
* recovery tooling
* security controls

The exact provider should be chosen during deployment planning.

The application should remain as provider-agnostic as reasonably possible.

---

# 5. Database Network Security

Production databases should not be publicly accessible without a strong reason.

Preferred architecture:

```text id="m3q8v7"
Internet
    │
    ▼
Frontend
    │
    ▼
Backend
    │
    ├────► PostgreSQL
    │
    └────► MongoDB
```

Not:

```text id="q8m2v4"
Internet
   ├────► Backend
   ├────► PostgreSQL
   └────► MongoDB
```

Database access should be restricted to trusted infrastructure.

---

# 6. Database Credentials

Production database credentials must:

* be stored securely
* never be committed to Git
* be different from development credentials
* have appropriate permissions
* be rotated when necessary

The backend receives database credentials through environment/runtime configuration.

---

# 7. Least-Privilege Database Access

The application should use a database account with only the permissions required by the application.

Avoid using administrative database accounts for normal application traffic.

For example:

```text id="m7q3v8"
Application
     ↓
Application DB User
     ↓
Required Database Permissions
```

Administrative operations should use separate privileged credentials.

---

# 8. PostgreSQL Responsibilities

PostgreSQL is responsible for structured relational data such as:

* users
* goals
* milestones
* tasks
* learning sessions
* activity

Relationships and ownership constraints should be enforced at the database level wherever practical.

---

# 9. MongoDB Responsibilities

MongoDB initially stores document-oriented journal/reflection data.

Journal documents may contain:

```text id="q3m8v7"
id
userId
title
content
date
goalId
milestoneId
tags
createdAt
updatedAt
```

The exact document structure may evolve.

---

# 10. Cross-Database References

MongoDB journal documents may reference PostgreSQL entities logically.

For example:

```text id="m8q2v7"
Journal Entry
    │
    ├── userId
    ├── goalId
    └── milestoneId
```

These references are not traditional foreign keys across the two databases.

The application must therefore validate their ownership and existence appropriately.

---

# 11. Cross-Database Consistency

Because PostgreSQL and MongoDB are separate systems, a single transaction cannot automatically guarantee atomic changes across both.

For example:

```text id="q7m3v8"
PostgreSQL update
       ↓
MongoDB update
       ↓
MongoDB fails
```

The system could be left in a partially updated state.

Therefore, cross-database operations should be minimized.

---

# 12. Prefer Simple Data Boundaries

The initial architecture should avoid workflows that require frequent atomic updates across both databases.

Each database should primarily own its own data.

This reduces:

* transaction complexity
* failure modes
* debugging difficulty
* consistency problems

---

# 13. Data Integrity

Database integrity should be protected through multiple layers.

### Application

Validation and business rules.

### Database

Constraints and indexes.

### Infrastructure

Backups, access control, and monitoring.

Conceptually:

```text id="8m4q7v"
User Input
    ↓
Backend Validation
    ↓
Business Rules
    ↓
Database Constraints
    ↓
Persistent Data
```

---

# 14. PostgreSQL Constraints

Where appropriate, use:

* primary keys
* foreign keys
* unique constraints
* not-null constraints
* check constraints

For example:

```text id="m2q8v7"
users.id
   ↓
goals.user_id
   ↓
milestones.goal_id
   ↓
tasks.milestone_id
```

This helps prevent invalid relational data.

---

# 15. Referential Integrity

Foreign keys should enforce relationships where practical.

For example:

```text id="q3m7v8"
Goal
 └── belongs to User

Milestone
 └── belongs to Goal

Task
 └── belongs to Milestone
```

Delete behavior must be intentionally defined.

For example, deleting a goal may require deleting or archiving its milestones and tasks.

---

# 16. Deletion Strategy

Destructive operations should be carefully designed.

Possible approaches include:

### Hard deletion

Data is permanently removed.

### Soft deletion

The record remains but is marked as deleted/archived.

The correct choice depends on the resource.

The initial implementation should not introduce soft deletion everywhere without a concrete requirement.

---

# 17. User Account Deletion

Account deletion requires special consideration because user data may exist in both databases.

Conceptually:

```text id="m7q2v8"
Delete Account
      ↓
Delete / anonymize PostgreSQL data
      ↓
Delete / anonymize MongoDB data
      ↓
Verify cleanup
```

Because this crosses database boundaries, the operation should be designed explicitly rather than treated as an ordinary single-table delete.

---

# 18. UUIDs

The project plans to use UUIDs for identifiers.

Benefits include:

* less predictable identifiers
* easier distributed generation
* reduced dependence on sequential IDs

UUIDs are not a replacement for authorization.

A user must still be prevented from accessing another user's resource.

---

# 19. Database Indexes

Indexes should support actual query patterns.

Likely indexes include fields such as:

```text id="q8m3v7"
userId
goalId
milestoneId
createdAt
date
status
```

Indexes should be introduced based on expected access patterns and real query performance.

---

# 20. Avoid Over-Indexing

Indexes improve some reads but increase:

* storage usage
* write cost
* maintenance cost

Therefore, every important index should have a reason to exist.

---

# 21. Database Migrations

Schema changes must be version-controlled.

The project will use Flyway for PostgreSQL migrations.

Conceptually:

```text id="m4q7v2"
Migration V1
     ↓
Migration V2
     ↓
Migration V3
     ↓
Current Schema
```

A fresh environment should be able to recreate the database schema from migration history.

---

# 22. Migration Rules

Migrations should:

* be committed to Git
* have predictable ordering
* be reviewed
* be tested
* avoid destructive changes unless intentional
* be compatible with the application deployment strategy

Never manually modify production schema and leave the change undocumented.

---

# 23. Backward-Compatible Migrations

When possible, database changes should be compatible with both the old and new application versions.

A common pattern is:

```text id="q7m3v8"
1. Add new column
2. Deploy code that can use both versions
3. Backfill data if necessary
4. Switch application behavior
5. Remove old column later
```

This reduces deployment risk.

---

# 24. Destructive Migrations

Changes such as:

```text id="m8q2v7"
DROP COLUMN
DROP TABLE
DELETE DATA
```

require special care.

Before destructive migrations:

* verify backups
* test migration
* understand affected data
* confirm rollback/recovery strategy
* coordinate application changes

---

# 25. Migration Failure

If a migration fails:

```text id="q3m7v8"
Stop Deployment
      ↓
Inspect Failure
      ↓
Determine Database State
      ↓
Recover / Correct
      ↓
Retry Safely
```

Do not automatically run another migration without understanding the current state.

---

# 26. Backup Strategy

Production databases should have automated backups.

The backup strategy should protect against:

```text id="m7q4v8"
Accidental deletion
Application bugs
Failed migrations
Database corruption
Infrastructure failure
Operational mistakes
```

Backups are part of the production system, not an optional extra.

---

# 27. Backup Types

Potential backup mechanisms include:

### Automated snapshots

Periodic database snapshots.

### Point-in-time recovery

Ability to restore the database to a particular time within the supported retention window.

### Logical backups

Exported database contents that can be restored independently.

The exact combination depends on the chosen database provider.

---

# 28. PostgreSQL Backups

PostgreSQL should have an automated backup strategy appropriate for the production environment.

At minimum:

```text id="q8m2v7"
Automated backups
+
Retention
+
Restore capability
```

Point-in-time recovery should be considered when the application reaches a stage where losing a large interval of user activity would be unacceptable.

---

# 29. MongoDB Backups

MongoDB journal data requires its own backup strategy.

The MongoDB backup system should be tested independently from PostgreSQL.

Do not assume that backing up PostgreSQL automatically protects MongoDB.

---

# 30. Backup Retention

Backups should have a defined retention policy.

For example:

```text id="m3q7v8"
Recent backups
     ↓
Short-term retention

Older backups
     ↓
Longer-term retention
```

The exact retention period should depend on:

* cost
* storage
* recovery requirements
* data importance

---

# 31. Backup Encryption

Backups should be protected against unauthorized access.

Where supported, use encryption at rest and secure access controls.

Backup credentials should be treated as sensitive production credentials.

---

# 32. Backup Access

Only authorized operators should be able to:

* create
* delete
* download
* restore

production backups.

Backup access can effectively provide access to the application's entire data set.

---

# 33. Backup Verification

A backup is not considered reliable simply because the provider reports that it completed.

Backups should periodically be tested by restoring them.

The goal is to verify:

```text id="q4m8v2"
Backup exists
    ↓
Backup is readable
    ↓
Database can be restored
    ↓
Application can use restored data
```

---

# 34. Restore Testing

A restore test should ideally occur in a separate environment.

Example:

```text id="m7q3v8"
Production Backup
      ↓
Temporary Database
      ↓
Restore
      ↓
Run Integrity Checks
      ↓
Verify Application Access
```

This avoids experimenting directly on production.

---

# 35. Recovery Point Objective

RPO answers:

> "How much data can we afford to lose?"

Example:

```text id="q8m2v7"
RPO = 24 hours
```

means losing up to roughly a day's worth of changes may be acceptable.

The actual Mezgeb RPO should be defined based on real requirements and backup capabilities.

---

# 36. Recovery Time Objective

RTO answers:

> "How quickly should the service be restored?"

Example:

```text id="m3q7v8"
RTO = 4 hours
```

means the target is to restore service within roughly four hours.

This is an operational target, not a guarantee.

---

# 37. Initial Recovery Strategy

For an early production application, the recovery process can remain simple:

```text id="q7m4v8"
Database Failure
      ↓
Identify Cause
      ↓
Provision / Recover Database
      ↓
Restore Backup
      ↓
Run Migrations if Required
      ↓
Verify Data
      ↓
Reconnect Backend
      ↓
Smoke Test
```

---

# 38. Application Recovery

Database recovery alone is not enough.

After restoring the database, verify:

* backend connectivity
* authentication
* goals
* tasks
* sessions
* journal entries
* dashboard
* progress
* critical API endpoints

---

# 39. Disaster Recovery

Potential disasters include:

```text id="m8q2v7"
Database outage
Hosting outage
Accidental deletion
Credential compromise
Failed migration
Data corruption
Infrastructure failure
```

The response should prioritize:

1. Protect remaining data.
2. Identify the failure.
3. Restore the affected component.
4. Verify integrity.
5. Resume service.
6. Document the incident.

---

# 40. Backup and Deployment Relationship

Deployments can change database schemas.

Therefore:

```text id="q3m7v8"
Deployment
    ↓
Database Migration
    ↓
Application
```

must be considered together.

For risky schema changes, a verified backup should exist before the migration.

---

# 41. Database Rollback

Application rollback is relatively straightforward:

```text id="m7q8v2"
Version B
   ↓
Problem
   ↓
Deploy Version A
```

Database rollback can be much harder.

A migration may have permanently changed or deleted data.

Therefore:

> **Never assume an application rollback automatically means a database rollback is safe.**

---

# 42. Data Recovery vs Application Rollback

These are separate operations.

```text id="q8m3v7"
Application Rollback
→ Restore previous application version

Data Recovery
→ Restore or reconstruct database state
```

They may sometimes be needed together.

---

# 43. Data Integrity Checks

After a restore, migration, or major database operation, verify important invariants.

Examples:

```text id="m4q7v2"
Goals belong to valid users
Milestones belong to valid goals
Tasks belong to valid milestones
Sessions reference valid users/goals
Journal entries reference valid users
```

The exact checks should match the database model.

---

# 44. Production Data Changes

Direct manual edits to production data should be minimized.

If a manual correction is necessary:

1. Understand the issue.
2. Verify the affected records.
3. Back up if appropriate.
4. Execute a controlled change.
5. Record what changed.
6. Verify the result.

---

# 45. Database Credentials During Recovery

Recovery operations may require elevated privileges.

Those credentials should:

* be separate from normal application credentials
* be stored securely
* be used only when necessary
* not be embedded in scripts committed to Git

---

# 46. Database Monitoring

Production databases should be monitored for:

```text id="q7m3v8"
Availability
Storage
Connections
Query performance
CPU
Memory
Backup status
Replication status, if used
```

See:

`07-production/monitoring-and-observability.md`

for the broader observability strategy.

---

# 47. Database Security

Database protection includes:

* restricted network access
* strong credentials
* least privilege
* encryption
* backups
* monitoring
* controlled migrations

See:

`07-production/security.md`

for the broader security strategy.

---

# 48. Database Growth

As Mezgeb grows, data volume may increase.

Potential growth areas include:

```text id="m8q2v7"
Journal entries
Learning sessions
Activity records
Tasks
Goals
```

The system should eventually monitor database size and query performance.

Optimization should be driven by actual usage.

---

# 49. Pagination

Large collections should not be loaded entirely into memory.

For example:

```text id="q3m7v8"
GET /api/v1/activity?page=0&size=20
```

Pagination becomes increasingly important as activity and journal history grow.

---

# 50. Archiving

If historical activity becomes very large, older data may eventually be archived.

This is not required for the initial MVP.

Possible future strategies include:

```text id="m7q4v8"
Cold storage
Archive tables
Data retention policies
Historical partitions
```

Only introduce these when actual scale requires them.

---

# 51. Testing Database Changes

Database changes should be tested before production.

Testing may include:

```text id="q8m2v7"
Migration runs successfully
Fresh database builds successfully
Existing database upgrades successfully
Data remains valid
Application starts successfully
Queries continue working
```

Testcontainers can eventually provide realistic database integration tests.

---

# 52. Local Development vs Production

Development databases and production databases must remain separate.

```text id="m3q7v8"
Development
PostgreSQL → Local
MongoDB → Local

Production
PostgreSQL → Managed Production DB
MongoDB → Managed Production DB
```

Never point local development directly at production databases.

---

# 53. Test Data

Automated tests should use isolated test data.

Tests should not depend on real production data.

Preferred approaches include:

* temporary databases
* Testcontainers
* fixtures
* generated test data

---

# 54. No Production Data in Development

Production user data should not be copied into development environments casually.

If production data must ever be used for debugging, it should be carefully sanitized and access-controlled.

---

# 55. Database Documentation

Important database changes should be reflected in:

```text id="q7m3v8"
04-backend/database-design.md
06-project/decisions.md
06-project/changelog.md
```

Migrations remain the authoritative executable history for PostgreSQL schema changes.

---

# 56. Production Database Checklist

## Security

* [ ] Database not publicly exposed unnecessarily
* [ ] Strong credentials
* [ ] Least-privilege application account
* [ ] Credentials stored securely
* [ ] Encryption enabled where appropriate

## PostgreSQL

* [ ] Production database created
* [ ] Migrations configured
* [ ] Constraints configured
* [ ] Required indexes created
* [ ] Backups enabled
* [ ] Restore process tested

## MongoDB

* [ ] Production database created
* [ ] Access restricted
* [ ] Backup strategy configured
* [ ] Restore process tested

## Operations

* [ ] Database monitoring
* [ ] Storage monitoring
* [ ] Backup monitoring
* [ ] Migration process
* [ ] Recovery process documented

## Recovery

* [ ] RPO defined
* [ ] RTO defined
* [ ] Restore procedure documented
* [ ] Disaster recovery process documented

---

# 57. Initial Production Strategy

The initial Mezgeb database strategy is intentionally simple:

```text id="m8q3v7"
Managed PostgreSQL
        +
Managed MongoDB
        +
Restricted Access
        +
Flyway Migrations
        +
Automated Backups
        +
Restore Testing
        +
Monitoring
```

There is no initial need for:

* database clusters managed manually
* complex replication
* multi-region databases
* custom backup infrastructure
* distributed database architecture

Those can be introduced only if actual requirements justify them.

---

# 58. Future Evolution

As Mezgeb grows, database infrastructure may evolve toward:

```text id="q4m7v2"
Initial
Managed DB + Backups

        ↓

Growth
Better indexes + Query optimization

        ↓

Higher reliability requirements
Point-in-time recovery + Replication

        ↓

Large scale
Partitioning / Archiving / Specialized infrastructure
```

The architecture should evolve from observed requirements rather than theoretical scale.

---

# 59. Final Database Mental Model

Think of production data protection as:

```text id="m7q3v8"
             Application
                  │
          ┌───────┴────────┐
          ▼                ▼
     PostgreSQL         MongoDB
          │                │
          └───────┬────────┘
                  ▼
              Backups
                  │
                  ▼
           Restore Testing
                  │
                  ▼
          Disaster Recovery
```

The central principle is:

> **A database is not protected simply because the application can write to it. Production data is protected when access is controlled, changes are managed, backups are reliable, and restoration has actually been tested.**
