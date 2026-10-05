# Backend Overview

## 1. Purpose

This document defines the overall backend direction for Mezgeb.

The backend is responsible for:

* authentication
* authorization
* user management
* learning data
* business rules
* data persistence
* API endpoints
* validation
* progress calculations
* security
* communication with the frontend

The backend should provide a reliable API that allows the React frontend to focus primarily on the user interface and user experience.

---

# 2. Backend Goals

The Mezgeb backend should be:

* secure
* maintainable
* testable
* predictable
* well-structured
* scalable enough for the project's expected growth
* easy to understand
* suitable for learning production backend development

The backend should not be unnecessarily complex.

The architecture should provide enough structure to support real-world development while remaining understandable to a student building the system.

---

# 3. Backend Technology Stack

The initial backend stack is:

| Area              | Technology                         |
| ----------------- | ---------------------------------- |
| Language          | Java                               |
| Framework         | Spring Boot                        |
| Security          | Spring Security                    |
| API               | REST                               |
| ORM               | Spring Data JPA                    |
| Primary database  | PostgreSQL                         |
| Document database | MongoDB                            |
| Validation        | Jakarta Bean Validation            |
| API documentation | OpenAPI / Swagger                  |
| Testing           | JUnit + Mockito + Spring Boot Test |
| Build tool        | Maven                              |
| Containerization  | Docker                             |
| API format        | JSON                               |

Additional infrastructure should be introduced only when justified by the application.

---

# 4. Why Java + Spring Boot?

Java and Spring Boot provide a strong backend learning environment for Mezgeb.

They allow the project to practice:

* REST API design
* dependency injection
* layered architecture
* authentication
* authorization
* database relationships
* transactions
* validation
* exception handling
* testing
* production configuration

The goal is not simply to make the application work.

The backend should also help develop practical backend engineering skills.

---

# 5. Backend Responsibilities

The backend owns the application's persistent business data.

Major responsibilities include:

### Authentication

* registration
* login
* logout/session handling
* authentication state
* credential management
* authentication-related errors

### Authorization

* determining what authenticated users can access
* enforcing ownership of learning data
* protecting resources

### User management

* user profile
* account information
* settings

### Learning management

* goals
* milestones
* tasks
* learning sessions
* journal entries

### Progress

* task completion
* goal progress
* learning time
* activity
* streak calculations where supported

---

# 6. Backend Does Not Own UI Behavior

The backend should not determine presentation-specific behavior.

For example, the frontend decides:

```text id="3m8q2x"
Which component to render
Which layout to use
How a loading state looks
How a dialog behaves
How a button is styled
```

The backend provides the data and business rules required to support those experiences.

---

# 7. High-Level Architecture

The backend follows a layered architecture:

```text id="7q2m9x"
                React Frontend
                      │
                      ▼
                REST Controllers
                      │
                      ▼
                   Services
                      │
                      ▼
                Repositories
                 /         \
                ▼           ▼
          PostgreSQL      MongoDB
```

Supporting the layers are:

```text id="5m8x3q"
Security
Validation
Exception Handling
Configuration
Logging
Testing
```

---

# 8. Layer Responsibilities

## Controller Layer

Responsible for:

* receiving HTTP requests
* reading path/query/body parameters
* validating request DTOs
* calling application services
* returning HTTP responses

Controllers should remain thin.

They should not contain substantial business logic.

---

## Service Layer

Responsible for:

* business rules
* coordinating operations
* authorization checks where appropriate
* transactions
* calling repositories
* transforming domain data into response models

The service layer represents the application's core behavior.

---

## Repository Layer

Responsible for:

* database access
* querying data
* saving entities
* updating entities
* deleting entities

Repositories should not contain business workflows.

---

# 9. Supporting Layers

The backend will also contain supporting concerns.

### Security

Handles:

* authentication
* authorization
* password security
* security filters
* token/session validation

### DTOs

Define API request and response structures.

### Exception Handling

Provides consistent API errors.

### Configuration

Centralizes environment-specific settings.

### Mapping

Converts between:

```text id="8m4q2x"
Request DTO
     ↓
Entity / Domain Model
     ↓
Response DTO
```

---

# 10. API Architecture

The frontend communicates with the backend through REST APIs.

Conceptually:

```text id="2q7m9x"
React
  │
  │ HTTP
  ▼
Spring Boot REST API
  │
  ▼
Business Logic
  │
  ▼
Database
```

JSON is the primary request/response format.

---

# 11. API Versioning

The initial API will use a versioned path:

```text id="6m3x8q"
/api/v1
```

For example:

```text id="9q4m2x"
/api/v1/auth/login
/api/v1/goals
/api/v1/journal
```

Versioning allows future API changes without immediately breaking existing clients.

---

# 12. Domain Areas

The backend is organized around Mezgeb's main domains:

```text id="4x8m2q"
Authentication
Users
Goals
Milestones
Tasks
Learning Sessions
Journal
Progress
Activity
```

Not every domain necessarily requires its own independent microservice.

For the MVP, Mezgeb will be a modular monolith.

---

# 13. Modular Monolith

The initial backend will use a **modular monolith**.

Conceptually:

```text id="7m2q9x"
                Mezgeb Backend
                      │
       ┌──────────────┼──────────────┐
       │              │              │
      Auth          Goals          Journal
       │              │              │
       ├── Users      ├── Tasks      └── Entries
       │              ├── Milestones
       │              └── Sessions
       │
       └──────────── Progress / Activity
```

All modules run inside one Spring Boot application.

This keeps deployment and development relatively simple while maintaining domain boundaries.

---

# 14. Why Not Microservices?

Microservices are not required for the initial Mezgeb architecture.

They would introduce additional complexity such as:

* service discovery
* network communication
* distributed transactions
* separate deployments
* more infrastructure
* observability requirements
* additional failure modes

Mezgeb does not currently require that complexity.

The architecture should leave room for future extraction if a genuine need appears.

---

# 15. Domain Boundaries

Even though the application is a monolith, domains should remain conceptually separated.

For example:

```text id="5q8m3x"
GoalService
```

should not become responsible for unrelated journal behavior.

Similarly:

```text id="2m7x9q"
JournalService
```

should own journal-specific behavior.

This keeps the system easier to understand and evolve.

---

# 16. Authentication Flow

A simplified authentication flow:

```text id="8q3m6x"
User
 ↓
Login Form
 ↓
POST /api/v1/auth/login
 ↓
Spring Security
 ↓
Credential Verification
 ↓
Authentication Established
 ↓
Authenticated User
```

The exact authentication mechanism will be defined in:

```text id="4m9x2q"
04-backend/authentication.md
```

Security-sensitive implementation details should not be duplicated across unrelated documents.

---

# 17. Authorization

Authentication answers:

> Who are you?

Authorization answers:

> What are you allowed to access?

For example:

```text id="7x2m8q"
User A
 ↓
GET /api/v1/goals/123
 ↓
Goal 123 belongs to User A
 ↓
Allow
```

But:

```text id="3q9m5x"
User A
 ↓
GET /api/v1/goals/456
 ↓
Goal 456 belongs to User B
 ↓
Reject
```

The backend must enforce ownership.

The frontend must never be trusted to enforce authorization.

---

# 18. Data Ownership

A user's learning data belongs to that user.

Resources such as:

* goals
* milestones
* tasks
* learning sessions
* journal entries

must be associated with an authenticated user either directly or through their owning resource.

Authorization checks should prevent cross-user access.

---

# 19. Validation

The backend validates all client input.

Validation may include:

* required fields
* string length
* valid enum values
* valid dates
* numeric ranges
* valid relationships
* business constraints

Example:

```text id="8m3q7x"
Create Goal
 ↓
Validate request
 ↓
Validate business rules
 ↓
Save
```

Frontend validation improves UX but does not replace backend validation.

---

# 20. DTOs

The API should use DTOs rather than exposing database entities directly.

For example:

```text id="4q9m2x"
CreateGoalRequest
UpdateGoalRequest
GoalResponse
```

This provides a clear API boundary.

Benefits include:

* preventing accidental field exposure
* controlling request structure
* separating API contracts from database structure
* easier API evolution
* better validation

---

# 21. Entity vs DTO

A useful mental model:

```text id="7m3x8q"
HTTP Request
     ↓
Request DTO
     ↓
Service
     ↓
Entity
     ↓
Repository
     ↓
Database
     ↓
Entity
     ↓
Response DTO
     ↓
HTTP Response
```

Entities represent persistence.

DTOs represent API contracts.

They should not automatically be treated as the same object.

---

# 22. Database Strategy

Mezgeb uses two database technologies:

### PostgreSQL

Primary relational database for structured application data.

Potential data:

* users
* goals
* milestones
* tasks
* learning sessions

### MongoDB

Document-oriented storage for journal/reflection content where document flexibility may be useful.

Potential data:

* journal entries
* reflections
* future rich learning documents

The exact division should be finalized in the database design document after evaluating the actual data relationships.

---

# 23. Why PostgreSQL?

PostgreSQL is well suited to relationships such as:

```text id="5x8m3q"
User
 ↓
Goal
 ↓
Milestone
 ↓
Task
```

and:

```text id="9m2q7x"
Goal
 ↓
Learning Sessions
```

Relational constraints and transactions are useful for this structured data.

---

# 24. Why MongoDB?

MongoDB may be useful for document-oriented content where the structure can evolve more freely.

For example, journal entries may eventually support:

* rich content
* blocks
* embedded metadata
* structured reflections
* future document extensions

However, MongoDB should not be used merely because the project contains unstructured text.

The database design should justify the separation.

---

# 25. Database Abstraction

The service layer should not depend directly on database-specific implementation details wherever practical.

Conceptually:

```text id="6q4m8x"
Controller
   ↓
Service
   ↓
Repository
   ↓
Database
```

This keeps persistence concerns separated from application behavior.

---

# 26. Transactions

Operations that require multiple related database changes should use transactions where appropriate.

For example:

```text id="8m3q7x"
Complete Task
 ↓
Update Task
 ↓
Update related progress/activity
 ↓
Commit
```

If an operation fails in the middle, the system should avoid leaving inconsistent data.

Transaction boundaries will be defined more precisely in backend architecture and database design.

---

# 27. REST Resource Design

API resources should use predictable REST conventions.

Examples:

```text id="4m7x2q"
GET    /api/v1/goals
GET    /api/v1/goals/{goalId}
POST   /api/v1/goals
PATCH  /api/v1/goals/{goalId}
DELETE /api/v1/goals/{goalId}
```

Nested resources should only be used when the relationship makes the endpoint clearer.

---

# 28. HTTP Status Codes

The backend should use meaningful HTTP status codes.

Examples:

| Status | Meaning                                            |
| ------ | -------------------------------------------------- |
| 200    | Successful request                                 |
| 201    | Resource created                                   |
| 204    | Successful request with no response body           |
| 400    | Malformed request                                  |
| 401    | Unauthenticated                                    |
| 403    | Forbidden                                          |
| 404    | Resource not found                                 |
| 409    | Conflict                                           |
| 422    | Validation/business-rule failure where appropriate |
| 500    | Unexpected server error                            |

The exact API error contract will be defined in the API specification.

---

# 29. Error Handling

The backend should provide consistent error responses.

Instead of allowing every controller to produce different formats:

```text id="9q2m5x"
Controller A → error format A
Controller B → error format B
Controller C → error format C
```

use centralized exception handling.

Conceptually:

```text id="7m3x8q"
Exception
 ↓
Global Exception Handler
 ↓
Standard Error Response
 ↓
Frontend
```

---

# 30. Business Rules

Business rules belong primarily in the service/domain layer.

Examples:

* only the owner can modify a goal
* completed goals cannot accept new tasks under certain rules
* task completion affects progress
* sessions must belong to valid goals
* journal entries may optionally reference a goal
* archived goals have restricted operations

These rules should not be duplicated across controllers.

---

# 31. Progress Calculation

Progress is a product concept rather than merely a UI calculation.

For example:

```text id="2q8m3x"
Goal
 ├── Task A ✓
 ├── Task B ✓
 ├── Task C ✗
 ├── Task D ✗
 └── Task E ✗
```

could result in:

```text id="6m4x9q"
2 / 5 completed
= 40%
```

The authoritative calculation strategy will be documented in the database/API design.

The frontend should not independently invent a conflicting calculation.

---

# 32. Activity

Activity records important learning events.

Examples:

```text id="8q3m7x"
Goal created
Milestone completed
Task completed
Learning session recorded
Journal entry created
```

Activity can support:

* dashboard history
* progress views
* streaks
* future analytics

Activity should not necessarily duplicate every database mutation.

The project should define which events are meaningful enough to record.

---

# 33. Streaks

A learning streak is derived from learning activity over time.

Potential inputs include:

* learning sessions
* completed tasks
* journal entries

The exact definition should be explicitly documented before implementation.

For example:

```text id="5m2q8x"
A day counts as active when
the user records at least one learning session.
```

The application should use one consistent definition rather than allowing each screen to calculate streaks differently.

---

# 34. API Documentation

OpenAPI/Swagger should document the public API.

Documentation should include:

* endpoints
* methods
* parameters
* request bodies
* response bodies
* authentication requirements
* error responses
* schemas

The API specification becomes the contract between:

```text id="7x4m9q"
Frontend ↔ Backend
```

---

# 35. Configuration

Environment-specific configuration should not be hardcoded.

Examples:

```text id="3m8q2x"
Database URL
Database credentials
JWT/security configuration
MongoDB connection
Allowed frontend origin
Application environment
```

Sensitive values belong in environment variables or secure secret management.

---

# 36. Profiles

The backend may use environment-specific profiles such as:

```text id="9q2m7x"
development
test
production
```

Each environment can have appropriate:

* database configuration
* logging
* CORS settings
* external services
* security configuration

Production configuration should not accidentally inherit development-only behavior.

---

# 37. CORS

The backend must explicitly configure which frontend origins may communicate with it.

During development this may include the local Vite server.

Production should allow only the intended frontend origin(s).

CORS is not an authorization mechanism.

Backend authentication and authorization must still protect resources.

---

# 38. Security Principles

The backend should:

* hash passwords securely
* authenticate requests
* authorize resource access
* validate input
* protect sensitive endpoints
* avoid leaking sensitive information
* use secure configuration
* protect against common web vulnerabilities
* enforce ownership at the server

Security should be implemented centrally rather than relying on individual controllers to remember every rule.

---

# 39. Testing Strategy

Backend testing should cover multiple levels.

### Unit tests

For:

* services
* business rules
* utility logic

### Integration tests

For:

* repositories
* database behavior
* Spring configuration
* API behavior

### API tests

For:

* HTTP status codes
* request validation
* authentication
* authorization
* response structures

### End-to-end

Potentially test:

```text id="6q9m3x"
Frontend
 ↓
Backend
 ↓
Database
```

for critical application journeys.

---

# 40. Logging

Backend logs should help diagnose problems without exposing sensitive information.

Useful information may include:

* request context
* important application events
* unexpected exceptions
* processing failures

Avoid logging:

* passwords
* authentication tokens
* sensitive personal information
* unnecessary request bodies

Production logging strategy can become more sophisticated later.

---

# 41. Performance

The initial goal is correctness and maintainability.

Potential future performance concerns include:

* inefficient database queries
* N+1 queries
* unnecessary API requests
* large journal documents
* expensive progress calculations
* pagination
* indexing

Performance improvements should be driven by actual requirements and measurement.

---

# 42. Pagination

Large collections should eventually support pagination.

Potential resources include:

```text id="4m8x2q"
Goals
Journal Entries
Activity
Learning Sessions
```

A conceptual API might use:

```text id="7q3m9x"
/api/v1/journal?page=0&size=20
```

The exact pagination contract will be defined in the API specification.

---

# 43. Filtering and Sorting

Future endpoints may support:

```text id="8m2x5q"
status
date
goal
search
sort
```

For example:

```text id="3q7m9x"
/api/v1/goals?status=ACTIVE
```

Filtering rules should be implemented on the backend rather than downloading large datasets and filtering everything in the browser.

---

# 44. Search

Search is not an MVP requirement.

When introduced, search should be designed according to the data being searched.

Potential search areas:

* goals
* journal entries
* activity
* learning history

The initial implementation should remain simple unless search requirements become more advanced.

---

# 45. Caching

Caching is not required for the initial MVP.

If performance later requires it, possible technologies include:

* Redis
* HTTP caching
* application-level caching

Caching should only be introduced after identifying a real caching need.

---

# 46. Background Processing

Background jobs are not required for the initial MVP.

Future candidates might include:

* AI journal analysis
* reminders
* scheduled summaries
* notification processing
* analytics aggregation

These should be introduced only when the corresponding features are implemented.

---

# 47. AI Integration

AI is intentionally not a core backend dependency for the MVP.

Future AI features may include:

* journal summaries
* learning insights
* reflection assistance
* personalized recommendations
* semantic search over learning history

AI integrations should be isolated behind clear service boundaries rather than spreading AI-specific logic throughout the application.

---

# 48. External Integrations

Potential future integrations include:

* GitHub
* calendar services
* learning platforms
* notification services

External integrations should be treated as separate boundaries.

The core learning tracker should remain functional without them.

---

# 49. Backend Project Structure

A possible initial structure:

```text id="5m8q3x"
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/mezgeb/
│   │   │       ├── auth/
│   │   │       ├── user/
│   │   │       ├── goal/
│   │   │       ├── milestone/
│   │   │       ├── task/
│   │   │       ├── session/
│   │   │       ├── journal/
│   │   │       ├── progress/
│   │   │       ├── activity/
│   │   │       ├── config/
│   │   │       ├── security/
│   │   │       └── common/
│   │   └── resources/
│   │       ├── application.yml
│   │       └── ...
│   └── test/
│       └── java/
├── pom.xml
├── Dockerfile
└── README.md
```

The exact structure will be refined in:

```text id="9q4m2x"
04-backend/architecture.md
```

---

# 50. Common Backend Package Responsibilities

A feature such as `goal` may eventually contain:

```text id="7m3x8q"
goal/
├── GoalController
├── GoalService
├── GoalRepository
├── Goal
├── GoalStatus
├── CreateGoalRequest
├── UpdateGoalRequest
├── GoalResponse
└── GoalMapper
```

This keeps the feature's related code together.

The exact package organization should remain pragmatic.

---

# 51. Dependency Direction

The backend should generally follow:

```text id="4q8m2x"
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Supporting components may be used by multiple layers:

```text id="6m2q9x"
Security
Validation
Exception Handling
Mapping
Configuration
```

Controllers should not bypass the service layer to directly manipulate repositories for normal business operations.

---

# 52. Thin Controllers

Controllers should primarily coordinate HTTP concerns.

Avoid putting logic such as:

```text id="8m4x3q"
if user owns goal
and goal is active
and task count...
and update progress...
```

inside controllers.

Instead:

```text id="2q7m9x"
Controller
 ↓
Service
 ↓
Business Rules
```

This keeps controllers predictable and testable.

---

# 53. Service Responsibilities

Services coordinate application behavior.

For example:

```text id="5x8m2q"
completeTask(userId, taskId)
```

may:

1. find the task
2. verify ownership
3. verify allowed state transition
4. update the task
5. update relevant activity
6. update/invalidate derived information
7. commit the transaction
8. return the result

The service should represent the use case rather than merely forwarding every repository method.

---

# 54. Repository Responsibilities

Repositories should focus on persistence.

Examples:

```text id="9m3q7x"
findById(...)
findByUserId(...)
save(...)
delete(...)
```

Complex business workflows should not live inside repository methods.

Repository queries should remain focused on retrieving or persisting data.

---

# 55. Backend Quality Principles

The backend should prioritize:

```text id="4m8q2x"
Correctness
    ↓
Security
    ↓
Clear API contracts
    ↓
Maintainability
    ↓
Testability
    ↓
Performance
    ↓
Scalability
```

This order is not a ranking of the product; it is the engineering sequence for building a reliable foundation.

---

# 56. Backend Development Philosophy

The backend should follow:

```text id="7q2m5x"
Understand requirement
        ↓
Define API contract
        ↓
Define data model
        ↓
Implement business logic
        ↓
Persist data
        ↓
Test
        ↓
Connect frontend
        ↓
Observe and improve
```

Avoid starting with database tables or controllers before understanding the actual use case.

---

# 57. Backend Rules

1. Keep controllers thin.
2. Put business logic in services/domain logic.
3. Keep persistence logic in repositories.
4. Use DTOs for API boundaries.
5. Validate all client input.
6. Never trust frontend authorization.
7. Enforce resource ownership on the backend.
8. Use consistent HTTP status codes.
9. Use centralized exception handling.
10. Keep API contracts explicit.
11. Use transactions where consistency requires them.
12. Keep domain boundaries clear.
13. Prefer a modular monolith for the MVP.
14. Avoid premature microservices.
15. Avoid premature caching.
16. Avoid unnecessary infrastructure.
17. Keep security centralized and explicit.
18. Test business rules and API behavior.
19. Document important architectural decisions.
20. Introduce complexity only when the application needs it.

---

# 58. Backend Mental Model

The backend can be remembered as:

```text id="3m9q7x"
                HTTP Request
                     │
                     ▼
                Controller
                     │
                     ▼
                  Service
              ┌──────┴──────┐
              │             │
          Business       Security
           Rules
              │
              ▼
          Repository
          /         \
         ▼           ▼
   PostgreSQL      MongoDB
         │           │
         └─────┬─────┘
               ▼
          Response DTO
               │
               ▼
          HTTP Response
```

The central principle is:

> **The Mezgeb backend should provide a secure, predictable, well-structured API that owns the application's business rules and persistent learning data without introducing complexity before it is needed.**
