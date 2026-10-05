# Database Design

## 1. Purpose

This document defines the database architecture and data model for Mezgeb.

It covers:

* database responsibilities
* PostgreSQL and MongoDB usage
* entities
* relationships
* ownership
* fields
* constraints
* indexes
* IDs
* timestamps
* status values
* transactions
* data integrity
* MongoDB document structure
* database access patterns
* future evolution

The database design should support the core Mezgeb learning loop:

```text
Goal
 ↓
Milestones
 ↓
Tasks
 ↓
Learning Sessions
 ↓
Journal / Reflection
 ↓
Progress
```

The design should remain simple enough to understand while being realistic enough for a production-style application.

---

# 2. Database Strategy

Mezgeb uses a polyglot persistence approach:

```text
PostgreSQL
    ↓
Structured relational application data

MongoDB
    ↓
Document-oriented journal/reflection data
```

However, using two databases introduces additional complexity.

Therefore:

> **PostgreSQL is the primary database. MongoDB is introduced only where its document model provides a meaningful benefit.**

The MVP should not create unnecessary cross-database operations.

---

# 3. PostgreSQL Responsibilities

PostgreSQL is responsible for the application's core structured data:

* users
* goals
* milestones
* tasks
* learning sessions
* activity
* relationships between these entities

Conceptually:

```text
PostgreSQL
│
├── users
├── goals
├── milestones
├── tasks
├── learning_sessions
└── activity
```

These entities have clear relationships and benefit from:

* foreign keys
* transactions
* constraints
* joins
* indexing
* relational integrity

---

# 4. MongoDB Responsibilities

MongoDB is intended for:

```text
Journal Entries
Reflections
```

Journal content is more document-oriented and may evolve over time.

A journal entry could contain:

```json
{
  "title": "What I learned about React state",
  "content": "...",
  "tags": ["react", "state"],
  "reflection": "...",
  "metadata": {}
}
```

MongoDB can accommodate this kind of evolving document structure naturally.

However, the exact journal model should remain simple in the MVP.

---

# 5. Why Not Put Everything in MongoDB?

The core Mezgeb data has strong relationships.

For example:

```text
User
 ↓
Goal
 ↓
Milestone
 ↓
Task
```

These relationships are naturally represented using relational constraints.

PostgreSQL provides:

* foreign keys
* unique constraints
* transactions
* relational queries
* referential integrity

Therefore, using MongoDB for everything would not provide a clear advantage for the core model.

---

# 6. Why Not Put Everything in PostgreSQL?

PostgreSQL could absolutely store journal entries.

In fact, a PostgreSQL-only architecture would be simpler.

MongoDB is included primarily as a learning and architectural exploration opportunity.

The project therefore intentionally demonstrates:

```text
Relational data
+
Document data
```

without making MongoDB responsible for the application's core relational model.

If implementation complexity becomes disproportionate to the learning value, a PostgreSQL-only design remains a valid simplification.

---

# 7. Database Architecture

High-level structure:

```text
                    Spring Boot
                        │
             ┌──────────┴──────────┐
             │                     │
       PostgreSQL              MongoDB
             │                     │
       Structured data       Journal documents
```

The service layer decides which persistence mechanism is appropriate.

Controllers should not communicate directly with either database.

---

# 8. Data Ownership

Every persistent user-owned resource must have a clear ownership path.

Conceptually:

```text
User
 │
 ├── Goals
 │    ├── Milestones
 │    │    └── Tasks
 │    └── Learning Sessions
 │
 ├── Journal Entries
 │
 └── Activity
```

This supports the authorization model defined in `authorization.md`.

---

# 9. ID Strategy

The initial design should use UUIDs for application-level resource IDs.

Example:

```text
550e8400-e29b-41d4-a716-446655440000
```

UUIDs provide:

* globally unique identifiers
* safer public identifiers than sequential integers
* easier distributed generation
* compatibility across PostgreSQL and MongoDB

The backend should generate IDs rather than trusting client-provided IDs.

---

# 10. UUID Considerations

UUIDs are larger than numeric IDs.

For Mezgeb's expected scale, this tradeoff is acceptable.

The application should use UUIDs consistently across major resources.

MongoDB documents may use their own internal `_id`, but if the document is exposed through the API, the application can maintain a UUID-style identifier for consistency.

The exact MongoDB ID implementation can be finalized during implementation.

---

# 11. Timestamp Strategy

Persistent entities should generally track:

```text
createdAt
updatedAt
```

For time-specific events such as learning sessions:

```text
startedAt
durationMinutes
```

or an equivalent representation.

All timestamps representing moments in time should use UTC.

The frontend converts timestamps to the user's local timezone for display.

---

# 12. Date vs Timestamp

Use a date when only the calendar day matters.

Example:

```text
goal target date
journal date
```

Use a timestamp when the exact moment matters.

Example:

```text
createdAt
updatedAt
session startedAt
activity occurredAt
```

This distinction avoids unnecessary timezone problems.

---

# 13. Users

The `users` table represents authenticated application users.

Conceptually:

```text
users
-----
id
name
email
password_hash
role
created_at
updated_at
```

### Important fields

| Field           | Purpose                              |
| --------------- | ------------------------------------ |
| `id`            | User identifier                      |
| `name`          | Display name                         |
| `email`         | Login/account identifier             |
| `password_hash` | Securely hashed password             |
| `role`          | Authorization role if roles are used |
| `created_at`    | Account creation time                |
| `updated_at`    | Last update                          |

Never store plaintext passwords.

---

# 14. User Constraints

Important constraints include:

```text
email NOT NULL
email UNIQUE
password_hash NOT NULL
name NOT NULL
```

Email uniqueness must be enforced by the database, not only by application code.

Application-level checks improve user experience, while the database constraint provides the final integrity guarantee.

---

# 15. Goals

The `goals` table represents a user's learning goals.

Conceptually:

```text
goals
-----
id
user_id
title
description
status
start_date
target_date
created_at
updated_at
```

Relationship:

```text
users 1 ──────── N goals
```

---

# 16. Goal Fields

| Field         | Type Concept | Purpose              |
| ------------- | ------------ | -------------------- |
| `id`          | UUID         | Goal identifier      |
| `user_id`     | UUID         | Owner                |
| `title`       | String       | Goal title           |
| `description` | Text         | Goal description     |
| `status`      | Enum         | Goal lifecycle state |
| `start_date`  | Date         | Optional start date  |
| `target_date` | Date         | Optional target      |
| `created_at`  | Timestamp    | Creation time        |
| `updated_at`  | Timestamp    | Last update          |

---

# 17. Goal Status

Initial statuses:

```text
PLANNED
ACTIVE
COMPLETED
ARCHIVED
```

These should be represented consistently between backend, frontend, and API contracts.

The database representation can use a PostgreSQL enum or a constrained string depending on migration strategy and flexibility requirements.

For a learning project, a constrained application enum backed by a stable database representation is often easier to evolve.

---

# 18. Milestones

Milestones break a goal into meaningful stages.

Conceptually:

```text
goals
  │
  └── milestones
```

Table:

```text
milestones
----------
id
goal_id
title
description
position
status
created_at
updated_at
```

Relationship:

```text
goals 1 ──────── N milestones
```

---

# 19. Milestone Ordering

The `position` field allows milestones to be reordered.

Example:

```text
position = 1
position = 2
position = 3
```

This avoids relying on database row order.

The API can later support:

```text
PATCH /milestones/{milestoneId}
```

with a new position.

---

# 20. Milestone Status

The initial milestone model can use a simple status such as:

```text
TODO
IN_PROGRESS
COMPLETED
```

Alternatively, completion can be derived from tasks.

The final implementation should avoid storing both:

```text
milestone.completed
```

and a conflicting calculated state unless there is a clear reason.

---

# 21. Tasks

Tasks represent concrete learning actions.

Conceptually:

```text
milestones
    │
    └── tasks
```

Table:

```text
tasks
-----
id
milestone_id
title
description
status
position
due_date
created_at
updated_at
```

Relationship:

```text
milestones 1 ──────── N tasks
```

---

# 22. Task Status

Initial statuses:

```text
TODO
IN_PROGRESS
COMPLETED
```

A task can move through these states according to business rules.

Example:

```text
TODO
 ↓
IN_PROGRESS
 ↓
COMPLETED
```

A completed task may also be reopened:

```text
COMPLETED
 ↓
IN_PROGRESS
```

if the product allows it.

---

# 23. Learning Sessions

Learning sessions record actual study activity.

Table:

```text
learning_sessions
-----------------
id
user_id
goal_id
milestone_id
topic
description
reflection
duration_minutes
started_at
created_at
updated_at
```

Relationships:

```text
users 1 ──────── N learning_sessions

goals 1 ──────── N learning_sessions

milestones 1 ─── N learning_sessions
```

`goal_id` should be required.

`milestone_id` can be optional.

---

# 24. Why Sessions Belong to the User

Although a session may reference a goal, it should also have a direct relationship with the user.

This makes ownership explicit.

Conceptually:

```text
learning_session
      │
      ├── user_id
      └── goal_id
```

The backend can verify that:

```text
session.user_id == currentUser.id
```

and that the referenced goal is also owned by that user.

---

# 25. Session Duration

Store duration as:

```text
duration_minutes
```

rather than storing arbitrary formatted strings such as:

```text
"1h 35m"
```

This makes calculations straightforward.

For example:

```text
95 minutes
```

can be displayed as:

```text
1h 35m
```

by the frontend.

---

# 26. Session Validation

The backend should enforce sensible constraints.

For example:

```text
duration_minutes > 0
```

if zero-length sessions are not meaningful.

It should also validate:

```text
goal belongs to user
milestone belongs to goal
milestone belongs to user
```

before creating the session.

---

# 27. Journal Entries

Journal entries are the primary MongoDB document.

Conceptually:

```text
journal_entries
```

A document may look like:

```json
{
  "_id": "uuid",
  "userId": "uuid",
  "title": "What I learned about React",
  "content": "Today I learned...",
  "date": "2026-10-02",
  "goalId": "uuid",
  "milestoneId": "uuid",
  "tags": ["react", "hooks"],
  "createdAt": "2026-10-02T12:00:00Z",
  "updatedAt": "2026-10-02T13:00:00Z"
}
```

---

# 28. Journal Document Design

The journal should remain flexible without becoming an unstructured dumping ground.

Core fields:

```text
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

Future fields may include:

```text
reflection
mood
resources
attachments
metadata
```

but these should not be added until required.

---

# 29. Journal Ownership

Every journal document must contain:

```text
userId
```

This is essential for authorization and querying.

Conceptually:

```text
find({
    userId: currentUserId
})
```

---

# 30. Journal and Goal References

A journal entry can optionally reference:

```text
goalId
milestoneId
```

These references are application-level references.

MongoDB cannot provide the same relational foreign-key enforcement as PostgreSQL.

Therefore, the backend must validate that referenced resources belong to the current user.

---

# 31. Cross-Database References

Example:

```text
MongoDB
JournalEntry
   │
   ├── userId ──────→ PostgreSQL User
   │
   ├── goalId ──────→ PostgreSQL Goal
   │
   └── milestoneId ─→ PostgreSQL Milestone
```

These are logical references rather than database-enforced foreign keys.

The application must maintain their validity.

---

# 32. Cross-Database Transaction Warning

Avoid operations that require an atomic transaction across PostgreSQL and MongoDB in the MVP.

For example, avoid workflows like:

```text
PostgreSQL update
       +
MongoDB update
       ↓
Both must succeed atomically
```

Distributed transactions add significant complexity.

Instead, keep cross-database operations simple and independently recoverable.

---

# 33. Activity

Activity represents meaningful actions in the learning journey.

Possible table:

```text
activity
--------
id
user_id
type
goal_id
entity_id
description
occurred_at
```

Example activity types:

```text
GOAL_CREATED
MILESTONE_CREATED
TASK_COMPLETED
SESSION_RECORDED
JOURNAL_CREATED
GOAL_COMPLETED
```

---

# 34. Activity as a Derived Record

Activity is different from core learning data.

For example:

```text
Task
 ↓
COMPLETED
 ↓
Activity record
```

The task remains the source of truth.

Activity is a historical record useful for:

* dashboard
* recent activity
* progress history
* future analytics

---

# 35. Activity Consistency

Activity creation should occur as part of the same PostgreSQL transaction when possible.

For example:

```text
Complete Task
    ↓
Update task
    ↓
Create activity
    ↓
Commit transaction
```

This prevents the system from recording a task completion without its corresponding activity when both are expected to succeed together.

---

# 36. Progress

Progress should generally be derived from existing learning data rather than stored redundantly.

For example:

```text
Goal Progress
=
completed tasks / total tasks
```

Conceptually:

```text
Total Tasks = 10
Completed = 7

Progress = 70%
```

The exact formula can evolve as product requirements become clearer.

---

# 37. Avoid Storing Derived Progress Prematurely

Avoid immediately storing:

```text
goals.progress = 70
```

if the value can be reliably calculated from tasks.

Otherwise the system must keep:

```text
tasks
+
stored progress
```

synchronized.

This creates opportunities for inconsistent data.

---

# 38. When Stored Progress Might Be Useful

Later, storing precomputed progress may become useful if:

* datasets become large
* calculations become expensive
* analytics become complex
* historical snapshots are required

For MVP, calculate progress from source data.

---

# 39. User-to-Goal Relationship

```text
users
  │
  │ 1:N
  ▼
goals
```

A user can have many goals.

Each goal belongs to exactly one user.

---

# 40. Goal-to-Milestone Relationship

```text
goals
  │
  │ 1:N
  ▼
milestones
```

A goal can contain multiple milestones.

Each milestone belongs to one goal.

---

# 41. Milestone-to-Task Relationship

```text
milestones
    │
    │ 1:N
    ▼
tasks
```

A milestone can contain multiple tasks.

Each task belongs to one milestone.

---

# 42. Goal-to-Session Relationship

```text
goals
  │
  │ 1:N
  ▼
learning_sessions
```

A goal can have many learning sessions.

Each session should reference the user as well.

---

# 43. Goal-to-Journal Relationship

A goal may have many journal entries:

```text
Goal
 │
 └── Journal Entries
```

But the relationship is optional.

A user should be able to write a journal entry without attaching it to a goal.

---

# 44. Milestone-to-Journal Relationship

A journal entry may optionally reference a milestone.

This allows:

```text
Goal
 ↓
Milestone
 ↓
Journal reflection
```

but does not require every reflection to belong to a specific milestone.

---

# 45. Relational Model

The core PostgreSQL relationship graph is:

```text
                    users
                      │
             ┌────────┼─────────┐
             │        │         │
             ▼        ▼         ▼
           goals   sessions   activity
             │
             ▼
        milestones
             │
             ▼
           tasks
```

Journal entries live in MongoDB and reference relevant PostgreSQL IDs where necessary.

---

# 46. Foreign Keys

PostgreSQL relationships should use foreign keys.

For example:

```text
goals.user_id
    → users.id
```

```text
milestones.goal_id
    → goals.id
```

```text
tasks.milestone_id
    → milestones.id
```

```text
learning_sessions.user_id
    → users.id
```

```text
learning_sessions.goal_id
    → goals.id
```

This provides database-level referential integrity.

---

# 47. Delete Behavior

Deletion behavior must be intentional.

For example, deleting a goal raises the question:

```text
What happens to:
- milestones?
- tasks?
- sessions?
- activity?
```

Possible strategies include:

```text
CASCADE
RESTRICT
SOFT DELETE
```

The MVP should choose deliberately rather than relying on database defaults.

---

# 48. Recommended Initial Delete Strategy

Because Mezgeb is a learning tracker, accidental destructive operations should be treated carefully.

A reasonable initial approach is:

```text
User deletion
    ↓
Delete/handle owned data intentionally

Goal deletion
    ↓
Explicitly handle dependent milestones/tasks/sessions
```

The exact behavior should be finalized during implementation based on the product's deletion requirements.

The API should never accidentally delete large amounts of data through an unintended cascade.

---

# 49. Archive vs Delete

Goals support:

```text
ARCHIVED
```

This provides a non-destructive alternative to deletion.

Therefore:

```text
Archive
```

can mean:

> Keep the learning history but remove the goal from active workflows.

Whereas:

```text
Delete
```

means:

> Permanently remove the resource according to the application's deletion rules.

These should not be treated as identical operations.

---

# 50. Indexing Strategy

Indexes should support actual query patterns.

Initial important indexes include:

### Users

```text
UNIQUE(email)
```

### Goals

```text
(user_id)
(user_id, status)
```

### Milestones

```text
(goal_id)
(goal_id, position)
```

### Tasks

```text
(milestone_id)
(milestone_id, status)
```

### Sessions

```text
(user_id)
(goal_id)
(user_id, started_at)
```

### Activity

```text
(user_id, occurred_at)
```

Indexes should be added based on actual access patterns rather than indexing every column.

---

# 51. Why User-Scoped Indexes Matter

A common query is:

```text
Get current user's goals
```

An index on:

```text
goals(user_id)
```

helps the database efficiently locate that user's records.

Similarly:

```text
journal(userId)
```

should be indexed in MongoDB.

---

# 52. MongoDB Indexes

Initial MongoDB indexes:

```text
{ userId: 1, date: -1 }
```

and potentially:

```text
{ userId: 1, createdAt: -1 }
```

This supports queries such as:

```text
Get my journal entries
ordered by newest
```

Additional indexes should be introduced when actual query patterns justify them.

---

# 53. Search Indexes

Full-text search does not need to be part of the initial database design.

Later, journal search could use:

* MongoDB text indexes
* PostgreSQL full-text search
* Elasticsearch/OpenSearch

The choice should depend on actual requirements.

Do not introduce a search engine simply because the project may eventually need search.

---

# 54. Constraints

Database constraints provide a final layer of data integrity.

Examples:

```text
users.email UNIQUE
goals.user_id NOT NULL
goals.title NOT NULL
milestones.goal_id NOT NULL
tasks.milestone_id NOT NULL
learning_sessions.user_id NOT NULL
learning_sessions.goal_id NOT NULL
```

Additional constraints can enforce valid ranges where appropriate.

---

# 55. Application Validation vs Database Constraints

Both are necessary.

### Application validation

Provides:

* friendly error messages
* request validation
* early feedback

### Database constraints

Provide:

* final integrity guarantee
* protection against unexpected application bugs
* protection against invalid persistence

Conceptually:

```text
Request
 ↓
DTO validation
 ↓
Business validation
 ↓
Database constraints
```

---

# 56. Nullability

Fields should be nullable only when the product actually allows them to be absent.

For example:

```text
Goal.title
```

should not be nullable.

But:

```text
Goal.description
Goal.targetDate
```

may be optional.

This should be reflected consistently in:

* DTOs
* entities
* database schema
* API documentation
* frontend forms

---

# 57. Normalization

The relational model should avoid unnecessary duplication.

For example, do not store:

```text
goal.user_name
```

inside every goal when the user already exists in:

```text
users
```

Instead:

```text
goals.user_id
    ↓
users.id
```

This keeps user information centralized.

---

# 58. Denormalization

Denormalization can be introduced later if performance requires it.

For example, a future analytics system might store precomputed:

```text
totalStudyMinutes
completedTaskCount
```

But this should be introduced only when there is a demonstrated reason.

---

# 59. Transactions

PostgreSQL transactions should be used for operations that modify multiple related records.

Example:

```text
Complete Task
     ↓
Update task status
     ↓
Create activity
     ↓
Commit
```

If one operation fails:

```text
Rollback
```

This preserves consistency.

---

# 60. Transaction Boundaries

Transactions should generally live at the service/use-case level.

Conceptually:

```text
Controller
    ↓
Service @Transactional
    ↓
Repository
    ↓
Database
```

The controller should not manually manage database transactions.

---

# 61. Cross-Database Transactions

Avoid:

```text
@Transactional
PostgreSQL operation
+
MongoDB operation
```

as a default architecture.

The two databases have different transaction models and coordinating them adds complexity.

For MVP, design operations so that PostgreSQL and MongoDB changes do not require distributed atomicity.

---

# 62. Database Migrations

PostgreSQL schema changes should be managed through migrations.

A migration system such as:

```text
Flyway
```

can be used with Spring Boot.

Instead of manually changing production databases, schema evolution becomes versioned:

```text
V1__initial_schema.sql
V2__add_goal_target_date.sql
V3__add_activity.sql
```

This makes database changes reproducible.

---

# 63. MongoDB Schema Evolution

MongoDB is flexible, but flexibility does not mean schema should be uncontrolled.

Journal documents should still have an expected structure.

When fields evolve:

```text
old document
+
new application version
```

the application should handle missing optional fields safely.

If migrations become necessary, explicit migration scripts can be introduced.

---

# 64. Entity vs Database Model

The JPA entity should represent persistence concerns.

It should not automatically become the API response.

For example:

```text
Database Entity
      ↓
Mapper
      ↓
Response DTO
```

This prevents persistence details from leaking into the API.

---

# 65. DTOs and Database Entities

For example:

```text
GoalEntity
```

may contain:

```text
id
user
status
createdAt
updatedAt
```

while:

```text
GoalResponse
```

might contain:

```text
id
title
description
status
startDate
targetDate
progress
```

The API contract should be designed for clients rather than exposing the database schema directly.

---

# 66. Database Security

Database credentials must never be hardcoded.

Use environment configuration such as:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
MONGODB_URI
```

Secrets should remain outside source control.

---

# 67. Database Access

The application should access databases through repository/data-access abstractions.

Conceptually:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Do not scatter raw database queries throughout controllers and business logic.

---

# 68. PostgreSQL Repository Model

For example:

```text
GoalRepository
MilestoneRepository
TaskRepository
LearningSessionRepository
ActivityRepository
UserRepository
```

Repositories should expose queries required by the application's use cases.

Ownership-aware queries are particularly useful.

Example:

```text
findByIdAndUserId(...)
```

---

# 69. MongoDB Repository Model

A journal repository can expose operations such as:

```text
findByIdAndUserId(...)
findAllByUserId(...)
save(...)
deleteByIdAndUserId(...)
```

This keeps user ownership visible at the persistence boundary.

---

# 70. Database Access Mental Model

```text
HTTP
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
Database
```

The database should not determine business behavior.

The service layer determines what the application means by an operation.

The repository determines how the data is persisted.

---

# 71. Example: Creating a Goal

Request:

```http
POST /api/v1/goals
```

Flow:

```text
Request
 ↓
Authentication
 ↓
GoalController
 ↓
GoalService
 ↓
Create GoalEntity
 ↓
Set current user
 ↓
GoalRepository.save()
 ↓
PostgreSQL
 ↓
GoalResponse
```

---

# 72. Example: Completing a Task

Flow:

```text
PATCH /api/v1/tasks/{taskId}
          ↓
Authentication
          ↓
TaskController
          ↓
TaskService
          ↓
Find task
          ↓
Verify ownership
          ↓
Validate state transition
          ↓
Update task
          ↓
Create activity
          ↓
Transaction commit
          ↓
Response
```

---

# 73. Example: Creating a Journal Entry

Flow:

```text
POST /api/v1/journal
          ↓
Authentication
          ↓
JournalController
          ↓
JournalService
          ↓
Validate referenced goal/milestone
          ↓
Create journal document
          ↓
MongoDB
          ↓
Response
```

The PostgreSQL references are validated before storing the document.

---

# 74. Data Integrity Rules

Important integrity rules include:

1. Every user has a unique account identity.
2. Every goal belongs to one user.
3. Every milestone belongs to one goal.
4. Every task belongs to one milestone.
5. Every learning session belongs to one user and goal.
6. Journal entries belong to one user.
7. Optional goal/milestone references must belong to the same user.
8. Activity belongs to one user.
9. IDs are generated by the server.
10. Timestamps are generated consistently.
11. Database constraints enforce critical relationships.
12. Business rules are enforced by services.

---

# 75. Initial Data Model

### PostgreSQL

```text
users
goals
milestones
tasks
learning_sessions
activity
```

### MongoDB

```text
journal_entries
```

This is intentionally small.

---

# 76. Conceptual Schema

```text
┌──────────────┐
│    users     │
├──────────────┤
│ id           │
│ name         │
│ email        │
│ passwordHash │
│ role         │
│ createdAt    │
│ updatedAt    │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│    goals     │
├──────────────┤
│ id           │
│ userId       │
│ title        │
│ description  │
│ status       │
│ startDate    │
│ targetDate   │
│ createdAt    │
│ updatedAt    │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│  milestones  │
├──────────────┤
│ id           │
│ goalId       │
│ title        │
│ description  │
│ position     │
│ status       │
│ createdAt    │
│ updatedAt    │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│    tasks     │
├──────────────┤
│ id           │
│ milestoneId  │
│ title        │
│ description  │
│ status       │
│ position     │
│ dueDate      │
│ createdAt    │
│ updatedAt    │
└──────────────┘


┌────────────────────┐
│ learning_sessions  │
├────────────────────┤
│ id                 │
│ userId             │
│ goalId             │
│ milestoneId        │
│ topic              │
│ description        │
│ reflection         │
│ durationMinutes    │
│ startedAt          │
│ createdAt          │
│ updatedAt          │
└────────────────────┘


┌────────────────────┐
│      activity      │
├────────────────────┤
│ id                 │
│ userId             │
│ type               │
│ goalId             │
│ entityId           │
│ description        │
│ occurredAt         │
└────────────────────┘
```

MongoDB:

```text
┌─────────────────────────────┐
│       journal_entries       │
├─────────────────────────────┤
│ id                          │
│ userId                      │
│ title                       │
│ content                     │
│ date                        │
│ goalId                      │
│ milestoneId                 │
│ tags                        │
│ createdAt                   │
│ updatedAt                   │
└─────────────────────────────┘
```

---

# 77. Initial Index Summary

| Database   | Entity     | Index                 |
| ---------- | ---------- | --------------------- |
| PostgreSQL | users      | unique email          |
| PostgreSQL | goals      | user_id               |
| PostgreSQL | goals      | user_id + status      |
| PostgreSQL | milestones | goal_id               |
| PostgreSQL | milestones | goal_id + position    |
| PostgreSQL | tasks      | milestone_id          |
| PostgreSQL | tasks      | milestone_id + status |
| PostgreSQL | sessions   | user_id               |
| PostgreSQL | sessions   | goal_id               |
| PostgreSQL | sessions   | user_id + started_at  |
| PostgreSQL | activity   | user_id + occurred_at |
| MongoDB    | journal    | userId + date         |
| MongoDB    | journal    | userId + createdAt    |

Indexes should be reviewed as the application develops.

---

# 78. Database Design Principles

1. PostgreSQL is the primary database.
2. Core relational data belongs in PostgreSQL.
3. MongoDB is limited initially to journal/document-oriented data.
4. Every user-owned resource has an explicit ownership path.
5. Use UUIDs consistently at the application level.
6. Store timestamps consistently in UTC.
7. Use dates when exact time is unnecessary.
8. Use foreign keys for PostgreSQL relationships.
9. Validate cross-database references in application logic.
10. Avoid distributed transactions in the MVP.
11. Do not store derived data unless there is a clear reason.
12. Index real query patterns.
13. Use database constraints for important integrity rules.
14. Use migrations for PostgreSQL schema changes.
15. Keep database entities separate from API DTOs.
16. Keep database access behind repositories.
17. Treat archive and delete as different operations.
18. Prefer the simplest data model that supports the product.

---

# 79. Future Database Evolution

Potential future additions include:

```text
notifications
goal_templates
tags
roadmaps
search
analytics
AI insights
reminders
integrations
```

These should be added only when the corresponding product requirements become real.

Possible future infrastructure:

```text
Redis
Elasticsearch/OpenSearch
Data warehouse
Analytics pipeline
```

None are required for the MVP.

---

# 80. Final Database Mental Model

```text
                         Mezgeb
                            │
                 ┌──────────┴──────────┐
                 │                     │
           PostgreSQL               MongoDB
                 │                     │
        Structured learning      Journal documents
               data
                 │                     │
        ┌────────┼────────┐            │
        │        │        │            │
      Users    Goals   Sessions     Journals
                 │
             Milestones
                 │
               Tasks
```

The most important principle is:

> **PostgreSQL owns the structured learning system and its relationships; MongoDB stores flexible journal documents; the service layer connects the two without creating unnecessary cross-database complexity.**

The database should support the learning journey, not become the architecture's center of complexity.
