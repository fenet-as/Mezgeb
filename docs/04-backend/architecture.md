# Backend Architecture

## 1. Purpose

This document defines the architecture of the Mezgeb backend.

It explains:

* how backend responsibilities are separated
* how requests move through the system
* how features are organized
* where business logic belongs
* how controllers, services, repositories, and databases interact
* how authentication and authorization fit into the architecture
* how the backend can grow without becoming unnecessarily complex

The architecture should be practical for the MVP while leaving room for future features.

---

# 2. Architectural Approach

Mezgeb will use a:

> **Modular monolith with layered responsibilities and feature-oriented organization.**

This combines two useful ideas:

### Modular

The backend is organized around product domains such as:

* authentication
* users
* goals
* milestones
* tasks
* sessions
* journal
* progress
* activity

### Layered

Within those domains, responsibilities are separated between:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

This gives the project structure without introducing distributed-system complexity.

---

# 3. High-Level Architecture

```text
                    React Frontend
                          │
                          │ HTTP/JSON
                          ▼
                ┌─────────────────────┐
                │   Spring Boot API   │
                └─────────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
        Security Layer          Request Handling
              │                       │
              └───────────┬───────────┘
                          ▼
                    Controllers
                          │
                          ▼
                      Services
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
       Repositories              Other Services
              │
       ┌──────┴──────┐
       ▼             ▼
 PostgreSQL       MongoDB
```

Cross-cutting concerns operate across these layers:

```text
Validation
Exception Handling
Logging
Configuration
Security
Transactions
```

---

# 4. Architectural Goals

The architecture should optimize for:

* clear responsibilities
* easy navigation through the codebase
* strong security boundaries
* testability
* predictable data flow
* maintainability
* reasonable scalability
* learning value
* low unnecessary complexity

It should avoid:

* giant controllers
* business logic inside repositories
* database entities exposed directly as API responses
* duplicated business rules
* unnecessary global state
* premature microservices
* excessive abstraction

---

# 5. Feature-Oriented Organization

Instead of organizing the entire project only by technical layer:

```text
controllers/
services/
repositories/
entities/
dtos/
```

the backend will primarily organize code around features.

For example:

```text
goal/
    GoalController
    GoalService
    GoalRepository
    Goal
    GoalStatus
    CreateGoalRequest
    UpdateGoalRequest
    GoalResponse
```

This keeps related code together.

---

# 6. Why Feature-Oriented Structure?

Imagine the project grows to:

```text
30 controllers
40 services
25 repositories
60 DTOs
```

A purely layer-based structure can make finding related code harder.

With feature-oriented organization:

```text
goal/
journal/
task/
session/
progress/
```

the developer can enter the relevant domain and find most of what they need.

This becomes especially useful as Mezgeb grows.

---

# 7. Recommended Backend Structure

Initial structure:

```text
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── mezgeb/
│   │   │           │
│   │   │           ├── MezgebApplication.java
│   │   │           │
│   │   │           ├── auth/
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── AuthService.java
│   │   │           │   ├── dto/
│   │   │           │   └── ...
│   │   │           │
│   │   │           ├── user/
│   │   │           │   ├── User.java
│   │   │           │   ├── UserRepository.java
│   │   │           │   ├── UserService.java
│   │   │           │   └── ...
│   │   │           │
│   │   │           ├── goal/
│   │   │           │   ├── Goal.java
│   │   │           │   ├── GoalController.java
│   │   │           │   ├── GoalService.java
│   │   │           │   ├── GoalRepository.java
│   │   │           │   ├── dto/
│   │   │           │   └── ...
│   │   │           │
│   │   │           ├── milestone/
│   │   │           ├── task/
│   │   │           ├── session/
│   │   │           ├── journal/
│   │   │           ├── progress/
│   │   │           ├── activity/
│   │   │           │
│   │   │           ├── security/
│   │   │           ├── config/
│   │   │           └── common/
│   │   │
│   │   └── resources/
│   │       ├── application.yml
│   │       └── ...
│   │
│   └── test/
│       └── java/
│
├── pom.xml
├── Dockerfile
└── README.md
```

This structure can evolve as the project grows.

---

# 8. Application Entry Point

The application starts from:

```text
MezgebApplication.java
```

Responsibilities should remain minimal.

It primarily bootstraps Spring Boot.

It should not contain application business logic.

---

# 9. Controller Layer

Controllers define the HTTP API.

Example:

```text
GoalController
```

may expose:

```text
GET    /api/v1/goals
GET    /api/v1/goals/{goalId}
POST   /api/v1/goals
PATCH  /api/v1/goals/{goalId}
DELETE /api/v1/goals/{goalId}
```

Controllers handle HTTP concerns such as:

* request mapping
* path parameters
* query parameters
* request bodies
* response status
* request validation

---

# 10. Thin Controller Principle

Controllers should be thin.

Bad:

```text
Controller
 ├── find goal
 ├── check ownership
 ├── calculate progress
 ├── update task
 ├── create activity
 ├── send notification
 └── build response
```

Better:

```text
Controller
    ↓
GoalService
    ↓
Business Logic
```

The controller should primarily translate HTTP requests into application-service calls.

---

# 11. Service Layer

The service layer contains application behavior.

For example:

```text
GoalService
```

may handle:

* creating goals
* retrieving goals
* updating goals
* archiving goals
* validating goal operations
* checking ownership
* coordinating related operations

Services represent **use cases**, not merely database operations.

---

# 12. Service Example

Conceptually:

```text
createGoal(userId, request)
```

might perform:

```text
1. Validate request
2. Find authenticated user
3. Validate business rules
4. Create Goal entity
5. Save goal
6. Record activity
7. Convert result to response DTO
8. Return response
```

The controller should not manually perform these steps.

---

# 13. Repository Layer

Repositories handle persistence.

For PostgreSQL entities, Spring Data JPA repositories may look conceptually like:

```text
GoalRepository
TaskRepository
MilestoneRepository
UserRepository
LearningSessionRepository
```

Their primary responsibility is database interaction.

---

# 14. Repository Principle

A repository should answer questions such as:

```text
Find this goal.
Find this user's goals.
Save this goal.
Delete this goal.
```

It should not answer:

```text
Should this goal be allowed to change status?
Should this task completion create an activity?
Should this user be allowed to modify this resource?
```

Those are application/business concerns.

---

# 15. Entity Layer

Entities represent persistent relational data.

For example:

```text
User
Goal
Milestone
Task
LearningSession
```

An entity maps to a PostgreSQL table or participates in a relational mapping.

Entities should represent persistence structure rather than automatically becoming API contracts.

---

# 16. DTO Layer

DTOs define communication across the API boundary.

Example:

```text
CreateGoalRequest
UpdateGoalRequest
GoalResponse
```

This creates a separation:

```text
Database Model
      ≠
API Model
```

This is important because database structure may change without necessarily changing the public API.

---

# 17. DTO Direction

The normal flow is:

```text
Request
  ↓
Request DTO
  ↓
Service
  ↓
Entity
  ↓
Repository
```

and:

```text
Repository
  ↓
Entity
  ↓
Service
  ↓
Response DTO
  ↓
HTTP Response
```

---

# 18. Mapping

Mapping converts between internal entities and API DTOs.

For example:

```text
Goal
 ↓
GoalResponse
```

and:

```text
CreateGoalRequest
 ↓
Goal
```

For simple mappings, explicit mapping code may be preferable initially because it makes the transformation easy to understand.

A mapping library can be introduced later if repetitive mappings justify it.

---

# 19. Validation Layer

Validation happens at multiple levels.

### Request validation

Examples:

```text
title is required
description length is valid
date is valid
status is a supported value
```

### Business validation

Examples:

```text
user owns goal
goal exists
task belongs to goal
operation is allowed in current state
```

Both are necessary.

---

# 20. Request Validation Flow

```text
HTTP Request
     ↓
Request DTO
     ↓
Bean Validation
     ↓
Controller
     ↓
Service Business Validation
     ↓
Repository
```

Validation failures should produce consistent API errors.

---

# 21. Security Architecture

Security sits across the request-processing pipeline.

Conceptually:

```text
HTTP Request
     ↓
Security Filters
     ↓
Authentication
     ↓
Authorization
     ↓
Controller
     ↓
Service
```

Security should prevent unauthenticated or unauthorized requests from reaching protected operations.

---

# 22. Authentication vs Authorization

Authentication:

> Establishes the identity of the caller.

Authorization:

> Determines whether that identity may perform an operation.

For example:

```text
Authenticated User
        ↓
Request goal 123
        ↓
Does goal 123 belong to this user?
        ↓
Yes → continue
No  → reject
```

---

# 23. Resource Ownership

Ownership checks are critical.

A user should not be able to access another user's:

* goals
* milestones
* tasks
* sessions
* journal entries
* progress data

Ownership must be enforced server-side.

The frontend cannot be trusted to provide this protection.

---

# 24. Authorization Placement

Authentication is generally handled by Spring Security.

Resource-specific authorization may be enforced in the service layer.

Example:

```text
GoalService.updateGoal(userId, goalId, request)
```

The service can verify that:

```text
goal.ownerId == userId
```

before modifying the resource.

---

# 25. Method-Level Authorization

Spring Security may also be used for method-level authorization.

For example:

```text
@PreAuthorize(...)
```

can protect specific operations.

However, annotations should not replace understanding the underlying ownership/business rules.

Use them where they make authorization clearer.

---

# 26. Exception Architecture

Errors should be handled centrally.

Recommended structure:

```text
common/
└── exception/
    ├── GlobalExceptionHandler
    ├── ResourceNotFoundException
    ├── UnauthorizedException
    ├── ForbiddenException
    ├── ConflictException
    └── ...
```

The exact exceptions will evolve with the API.

---

# 27. Global Exception Handler

Instead of manually handling exceptions in every controller:

```text
Controller A → custom error
Controller B → custom error
Controller C → custom error
```

use a centralized handler:

```text
Exception
   ↓
GlobalExceptionHandler
   ↓
Standard Error Response
```

This gives the frontend predictable errors.

---

# 28. Standard Error Response

The backend should eventually define a consistent error structure.

For example:

```json
{
  "code": "GOAL_NOT_FOUND",
  "message": "The requested goal was not found.",
  "status": 404,
  "timestamp": "...",
  "path": "/api/v1/goals/123"
}
```

The exact schema belongs in:

```text
04-backend/api-specification.md
```

This example is illustrative rather than a final contract.

---

# 29. Common Package

The `common/` package should contain genuinely shared backend infrastructure.

Potential examples:

```text
common/
├── exception/
├── response/
├── validation/
└── utility/
```

However, `common/` must not become a dumping ground.

If something belongs clearly to a feature, keep it inside that feature.

---

# 30. Configuration Package

The `config/` package contains application configuration.

Potential examples:

```text
SecurityConfig
CorsConfig
OpenApiConfig
MongoConfig
JacksonConfig
```

Configuration should be separated from business logic.

---

# 31. Security Package

The `security/` package contains cross-cutting security infrastructure.

Potential responsibilities:

```text
Security configuration
Authentication filters
Authentication principal
Token/session handling
Password encoding
Security utilities
```

The exact implementation will be defined in:

```text
04-backend/authentication.md
04-backend/authorization.md
```

---

# 32. Database Architecture

The backend has two persistence systems:

```text
                 Backend
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
     PostgreSQL            MongoDB
          │                   │
 Structured data       Document data
```

PostgreSQL is the primary relational store.

MongoDB is reserved for document-oriented journal/reflection data if the final design confirms that separation is useful.

---

# 33. PostgreSQL Domain Model

The relational model is expected to include relationships such as:

```text
User
 │
 ├── Goal
 │    ├── Milestone
 │    │     └── Task
 │    │
 │    └── LearningSession
 │
 └── Activity
```

The exact schema and relationships will be documented in:

```text
04-backend/database-design.md
```

---

# 34. MongoDB Domain Model

Journal entries may be represented as documents:

```text
JournalEntry
 ├── userId
 ├── goalId
 ├── milestoneId
 ├── title
 ├── content
 ├── tags
 ├── createdAt
 └── updatedAt
```

This is a conceptual model only.

The final journal schema should be decided after evaluating actual requirements.

---

# 35. Cross-Database Operations

Because Mezgeb may use PostgreSQL and MongoDB, operations spanning both databases require care.

For example:

```text
Create Journal Entry
        ↓
MongoDB
        ↓
Activity
        ↓
PostgreSQL
```

A normal relational transaction cannot automatically guarantee atomicity across both systems.

Therefore:

> Avoid designing MVP operations that require strict cross-database atomic transactions unless there is a clear need.

This is one reason to keep cross-database workflows simple.

---

# 36. Progress Architecture

Progress may be derived from underlying learning data.

For example:

```text
Tasks
  ↓
Completed Tasks
  ↓
Goal Progress
```

and:

```text
Learning Sessions
  ↓
Total Learning Time
  ↓
Progress Statistics
```

The backend should establish authoritative calculations.

The frontend should display those results rather than independently maintaining competing business rules.

---

# 37. Derived Data

Not every value needs to be stored.

For example:

```text
completedTasks / totalTasks
```

can potentially be calculated from tasks.

Similarly:

```text
totalLearningTime
```

can potentially be calculated from sessions.

Whether values are calculated dynamically, cached, or persisted should be decided based on performance and consistency requirements.

Start with the simplest correct approach.

---

# 38. Activity Architecture

Activity can act as an event-like record of meaningful learning actions.

Example:

```text
Task completed
       ↓
ActivityService
       ↓
Activity record
```

The activity system should record meaningful product events rather than every internal method call.

---

# 39. Transaction Boundaries

Transactions should normally align with business operations.

Example:

```text
Complete Task
    │
    ├── update task
    └── create activity
```

If both are stored in PostgreSQL, they may belong to one transaction.

The exact boundaries depend on the final persistence model.

---

# 40. Request Lifecycle

A typical request follows:

```text
1. Browser sends HTTP request
              ↓
2. Security filters process request
              ↓
3. Authentication established
              ↓
4. Controller receives request
              ↓
5. Request DTO validated
              ↓
6. Service executes use case
              ↓
7. Repository accesses database
              ↓
8. Entity returned
              ↓
9. Service maps entity to DTO
              ↓
10. Controller returns HTTP response
              ↓
11. Browser receives JSON
```

This is the core backend mental model.

---

# 41. Example: Create Goal

Request:

```text
POST /api/v1/goals
```

Body:

```json
{
  "title": "Learn React",
  "description": "Rebuild my React fundamentals",
  "status": "ACTIVE"
}
```

Flow:

```text
React
 ↓
GoalController
 ↓
CreateGoalRequest validation
 ↓
GoalService
 ↓
Verify authenticated user
 ↓
Create Goal entity
 ↓
GoalRepository
 ↓
PostgreSQL
 ↓
GoalResponse
 ↓
HTTP 201
```

---

# 42. Example: Complete Task

Request:

```text
PATCH /api/v1/tasks/{taskId}/complete
```

Flow:

```text
React
 ↓
TaskController
 ↓
TaskService
 ↓
Find Task
 ↓
Verify ownership
 ↓
Validate state transition
 ↓
Mark task completed
 ↓
Record activity
 ↓
Commit transaction
 ↓
TaskResponse
 ↓
HTTP response
```

This is an example of why business logic belongs in services rather than controllers.

---

# 43. Example: Record Learning Session

```text
POST /api/v1/sessions
```

Flow:

```text
Request
 ↓
SessionController
 ↓
Validate request
 ↓
SessionService
 ↓
Verify goal ownership
 ↓
Create session
 ↓
Save session
 ↓
Record activity
 ↓
Return SessionResponse
```

---

# 44. Example: Journal Entry

If MongoDB is used:

```text
POST /api/v1/journal
        ↓
JournalController
        ↓
JournalService
        ↓
Verify authenticated user
        ↓
Verify referenced goal/milestone
        ↓
Create journal document
        ↓
MongoDB
        ↓
JournalResponse
```

Any PostgreSQL/MongoDB cross-database behavior should be kept explicit.

---

# 45. API Boundary

The backend should expose stable API contracts rather than exposing internal implementation details.

For example, the frontend should know:

```text
GET /api/v1/goals/{id}
```

but should not need to know:

```text
which repository implementation
which JPA query
which PostgreSQL table
```

This separation allows internal implementation to evolve.

---

# 46. Domain Boundary

A feature should own its own rules.

For example:

```text
goal/
```

owns goal behavior.

```text
task/
```

owns task behavior.

If a task completion affects progress or activity, the task use case may coordinate with those domains rather than directly manipulating unrelated persistence details.

---

# 47. Avoid Circular Dependencies

Be careful with dependencies such as:

```text
GoalService
    ↓
TaskService
    ↓
GoalService
```

Circular dependencies make systems harder to understand and maintain.

When cross-domain workflows become complex, introduce a higher-level application service/use case rather than allowing domains to depend on each other indefinitely.

---

# 48. Domain Communication

Cross-feature communication should happen through explicit application operations.

For example:

```text
TaskService
    ↓
ActivityService
```

is clearer than directly manipulating:

```text
ActivityRepository
```

from the task feature.

The goal is to preserve ownership of business behavior.

---

# 49. API and Domain Independence

The internal domain model should not be designed solely around frontend screens.

For example, avoid creating a backend model simply because the dashboard happens to display a particular card.

Instead:

```text
Domain Model
      ↓
API Contract
      ↓
Frontend Presentation
```

The frontend can combine API data to create UI-specific views.

---

# 50. Backend and Frontend Responsibilities

A useful boundary is:

| Responsibility                 | Frontend | Backend |
| ------------------------------ | -------: | ------: |
| Render UI                      |        ✓ |         |
| Form interaction               |        ✓ |         |
| Client validation              |        ✓ |         |
| API requests                   |        ✓ |         |
| Authentication state UI        |        ✓ |       ✓ |
| Authentication enforcement     |          |       ✓ |
| Authorization                  |          |       ✓ |
| Business rules                 |          |       ✓ |
| Persistent data                |          |       ✓ |
| Database access                |          |       ✓ |
| Loading states                 |        ✓ |         |
| Error presentation             |        ✓ |       ✓ |
| Progress calculation authority |          |       ✓ |
| Responsive layout              |        ✓ |         |
| Security enforcement           |          |       ✓ |

Some concerns are shared, but the backend remains the authority for security and persistent business rules.

---

# 51. Testing Architecture

Each architectural layer should be testable.

### Controller/API tests

Verify:

* endpoint behavior
* validation
* status codes
* serialization
* authentication
* authorization

### Service tests

Verify:

* business rules
* use cases
* ownership
* state transitions
* calculations

### Repository tests

Verify:

* queries
* persistence behavior
* database mappings

The exact testing strategy will be expanded separately.

---

# 52. Dependency Injection

Spring's dependency injection should be used to connect components.

Conceptually:

```text
Controller
   ↓
inject Service

Service
   ↓
inject Repository
```

Prefer constructor injection.

This makes dependencies explicit and improves testability.

---

# 53. Avoid Static Global State

Backend components should not depend on mutable static state for application behavior.

Instead use:

* Spring-managed beans
* dependency injection
* request-scoped data where appropriate
* database persistence

This makes behavior more predictable and testable.

---

# 54. Configuration Through Environment

Configuration should flow through:

```text
Environment
     ↓
Spring Configuration
     ↓
Application Components
```

Examples:

```text
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
MONGODB_URI
FRONTEND_URL
SECURITY_SECRET
```

Exact names will be finalized in the development/environment configuration.

Secrets must never be committed to Git.

---

# 55. API Documentation

OpenAPI should describe:

```text
Endpoints
Request DTOs
Response DTOs
Authentication
Errors
Parameters
Schemas
```

This creates a shared contract between frontend and backend developers.

---

# 56. Logging Architecture

Logging should be centralized through the application's logging framework.

Logs should help answer:

```text
What happened?
Where did it happen?
When did it happen?
Why did it fail?
```

Sensitive information should not be logged.

---

# 57. Observability

The MVP only requires basic logging and error visibility.

Future observability may include:

```text
Metrics
Tracing
Error tracking
Health checks
Dashboards
```

Potential future technologies include:

* Spring Boot Actuator
* Prometheus
* Grafana
* Sentry

These should be introduced when operational complexity justifies them.

---

# 58. Scalability Strategy

The initial strategy is:

```text
Simple architecture
        ↓
Measure real problems
        ↓
Optimize bottlenecks
        ↓
Introduce infrastructure when needed
```

Not:

```text
Build distributed infrastructure first
        ↓
Hope it becomes necessary
```

This keeps Mezgeb appropriate for its current scale.

---

# 59. Future Evolution

The architecture leaves room for future additions:

```text
Redis
AI services
Background jobs
Notifications
Search
External integrations
Advanced analytics
```

These should be added as separate concerns rather than forcing the MVP to depend on them.

---

# 60. Architecture Rules

1. Use a modular monolith for the MVP.
2. Organize code around product domains.
3. Keep controllers thin.
4. Put application behavior in services.
5. Keep persistence logic in repositories.
6. Use DTOs at API boundaries.
7. Do not expose database entities directly by default.
8. Enforce authorization on the backend.
9. Keep business rules server-side.
10. Keep cross-domain dependencies explicit.
11. Avoid circular dependencies.
12. Use constructor dependency injection.
13. Keep configuration separate from business logic.
14. Handle errors centrally.
15. Keep transactions aligned with business operations.
16. Keep cross-database operations simple.
17. Do not introduce infrastructure without a real requirement.
18. Prefer explicit code over premature abstraction.
19. Keep API contracts stable and documented.
20. Let the architecture evolve with actual product requirements.

---

# 61. Backend Mental Model

The entire architecture can be summarized as:

```text
                         CLIENT
                           │
                           ▼
                    REST API / HTTP
                           │
                           ▼
                    ┌─────────────┐
                    │  Security   │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Controllers │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Services   │
                    │             │
                    │  Business   │
                    │    Rules    │
                    └──────┬──────┘
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
          ┌────────────┐      ┌────────────┐
          │Repositories│      │ Other      │
          │            │      │ Services   │
          └─────┬──────┘      └────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
   PostgreSQL         MongoDB
        │                │
        └───────┬────────┘
                ▼
          Persistent Data
```

The central principle is:

> **Organize the backend around Mezgeb's domains, keep responsibilities separated, enforce business rules and security on the server, and use the simplest architecture that can support the current product.**
