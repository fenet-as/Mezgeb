# Tech Stack

## 1. Purpose

This document defines the technologies used by Mezgeb and the role each technology plays in the system.

The goal is not simply to list dependencies.

Each technology should have a clear purpose:

```text
Problem
   ↓
Technology
   ↓
Reason for choosing it
```

Mezgeb is also a learning project, so the stack should balance:

* practical industry relevance
* learning value
* maintainability
* simplicity
* scalability
* realistic full-stack development

---

# 2. Stack Overview

The initial stack is:

| Area                 | Technology                         |
| -------------------- | ---------------------------------- |
| Frontend             | React                              |
| Frontend Language    | TypeScript                         |
| Frontend Tooling     | Vite                               |
| Routing              | React Router                       |
| Styling              | CSS Modules + CSS                  |
| Forms                | React Hook Form                    |
| Validation           | Zod                                |
| Server State         | TanStack Query                     |
| Frontend Testing     | Vitest + React Testing Library     |
| E2E Testing          | Playwright                         |
| Backend              | Java                               |
| Backend Framework    | Spring Boot                        |
| Security             | Spring Security                    |
| ORM / Persistence    | Spring Data JPA                    |
| Relational Database  | PostgreSQL                         |
| Document Database    | MongoDB                            |
| API Style            | REST                               |
| API Documentation    | OpenAPI / Swagger                  |
| Backend Validation   | Jakarta Bean Validation            |
| Backend Testing      | JUnit + Mockito + Spring Boot Test |
| Build Tool           | Maven                              |
| Containerization     | Docker                             |
| Local Infrastructure | Docker Compose                     |
| Version Control      | Git + GitHub                       |
| CI/CD                | GitHub Actions                     |
| Code Quality         | ESLint + Prettier                  |
| Database Migrations  | Flyway                             |
| API Client           | Custom HTTP client                 |
| Development DB Tools | DBeaver + MongoDB Compass          |

---

# 3. Architecture Stack

At a high level:

```text
┌─────────────────────────────────────┐
│              Browser                │
│                                     │
│       React + TypeScript            │
│       React Router                  │
│       CSS Modules                   │
│       TanStack Query                │
└────────────────┬────────────────────┘
                 │
                 │ REST / JSON
                 ▼
┌─────────────────────────────────────┐
│          Spring Boot API            │
│                                     │
│ Spring Security                     │
│ Controllers                         │
│ Services                            │
│ Repositories                        │
│ DTOs / Validation                   │
└──────────────┬───────────┬──────────┘
               │           │
               ▼           ▼
        PostgreSQL       MongoDB
        Structured       Documents
           data            data
```

---

# 4. Frontend

## React

React is the frontend framework.

It is responsible for:

* rendering the UI
* component composition
* user interaction
* local UI state
* frontend application behavior

Example:

```text
Dashboard
 ├── Stats
 ├── ActiveGoals
 ├── RecentSessions
 └── RecentActivity
```

React is central to Mezgeb because the project is also intended to strengthen frontend development skills.

---

# 5. Why React?

React provides:

* component-based architecture
* reusable UI
* large ecosystem
* strong TypeScript support
* practical industry relevance
* good support for complex interactive applications

Mezgeb's UI naturally maps to reusable components and feature-based organization.

---

# 6. TypeScript

TypeScript is used throughout the frontend.

It provides:

* static type checking
* safer refactoring
* explicit API contracts
* better editor support
* fewer common runtime mistakes

Example:

```ts
type GoalStatus =
  | "PLANNED"
  | "ACTIVE"
  | "COMPLETED"
  | "ARCHIVED";
```

This makes application states explicit.

---

# 7. Why TypeScript?

Mezgeb has multiple related domains:

```text
Goals
Milestones
Tasks
Sessions
Journal
Progress
```

TypeScript helps keep data structures consistent across these features.

It also provides a useful bridge between:

```text
Frontend
      ↕
API contracts
```

---

# 8. Vite

Vite is the frontend build and development tool.

Responsibilities include:

* development server
* fast Hot Module Replacement
* production builds
* environment variable handling
* frontend bundling

Typical commands:

```bash
npm run dev
npm run build
```

---

# 9. Why Vite?

Vite provides a fast and relatively simple development experience.

It also keeps the frontend setup lightweight compared with introducing a full-stack framework when the application does not require one.

Mezgeb's backend is already provided by Spring Boot, so the frontend does not need a second server framework.

---

# 10. React Router

React Router handles client-side navigation.

It provides:

* route definitions
* nested routes
* URL parameters
* protected routes
* navigation
* redirects

Example:

```text
/app/goals
/app/goals/:goalId
/app/journal
/app/progress
```

The routing design is defined in:

```text
03-frontend/routing.md
```

---

# 11. CSS Modules + CSS

Mezgeb uses standard CSS and CSS Modules for styling.

Example:

```text
GoalCard.tsx
GoalCard.module.css
```

CSS Modules provide:

* scoped styles
* predictable naming
* component-level ownership
* standard CSS capabilities

Global CSS is reserved for:

* design tokens
* resets
* typography
* global accessibility rules
* application-wide styles

---

# 12. Why Not Tailwind?

Tailwind is a valid technology, but Mezgeb intentionally uses CSS Modules/CSS.

Reasons include:

* stronger CSS fundamentals
* clearer separation of styling and markup
* easier connection to the project's design-system documentation
* less dependence on utility classes
* useful practice for production CSS architecture

The project can still adopt another styling strategy later if a real requirement emerges.

---

# 13. React Hook Form

React Hook Form handles complex form state.

It will be used for:

* registration
* login
* goal creation
* goal editing
* milestone forms
* task forms
* learning session forms
* journal forms
* settings forms

It helps avoid manually managing every field with separate React state.

---

# 14. Zod

Zod provides runtime validation schemas.

For example:

```ts
const goalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});
```

This can be integrated with React Hook Form.

---

# 15. Client vs Server Validation

Zod validates data on the frontend.

The backend must still validate the request.

The flow is:

```text
Frontend
   ↓
Zod
   ↓
HTTP request
   ↓
Spring Boot
   ↓
Backend validation
   ↓
Database
```

Frontend validation improves UX.

Backend validation provides security and data integrity.

---

# 16. TanStack Query

TanStack Query manages server state.

It handles:

* fetching
* caching
* refetching
* loading states
* errors
* mutations
* invalidation

Example:

```text
useGoals()
useGoal(goalId)
useCreateGoal()
useCompleteTask()
```

---

# 17. Why TanStack Query?

Mezgeb has significant server-owned data:

```text
Goals
Tasks
Sessions
Journal
Progress
Activity
```

This data should not be copied unnecessarily into global React state.

TanStack Query provides a dedicated model for server state.

---

# 18. Server State vs UI State

Server state:

```text
Goals
Tasks
Sessions
Journal entries
```

Use:

```text
TanStack Query
```

UI state:

```text
Modal open
Selected tab
Sidebar expanded
```

Use:

```text
useState
```

This separation is an important architectural principle.

---

# 19. Vitest

Vitest is the frontend test runner.

It will be used for:

* unit tests
* component tests
* utility tests
* feature tests

Typical command:

```bash
npm run test
```

---

# 20. React Testing Library

React Testing Library tests React components through user-visible behavior.

Instead of testing:

```text
"Did this internal state variable change?"
```

test:

```text
"Does the user see the updated task status?"
```

This keeps tests aligned with product behavior.

---

# 21. Playwright

Playwright will handle end-to-end testing.

The main E2E flow is:

```text
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
```

Playwright can be introduced after the core application is functional.

---

# 22. ESLint

ESLint checks JavaScript/TypeScript code for problematic patterns.

It helps detect:

* unused variables
* invalid patterns
* React issues
* accessibility issues
* inconsistent code practices

ESLint is a code-quality tool, not a formatter.

---

# 23. Prettier

Prettier handles code formatting.

It standardizes:

* indentation
* line wrapping
* quotes
* spacing
* formatting

The distinction is:

```text
ESLint
→ Code quality

Prettier
→ Code formatting
```

---

# 24. Backend Language: Java

Java is used for the backend.

Reasons:

* strong type system
* mature ecosystem
* excellent Spring ecosystem
* strong enterprise/backend adoption
* excellent tooling
* useful for learning large-scale backend architecture

Java also complements the user's existing Spring Boot experience.

---

# 25. Spring Boot

Spring Boot is the primary backend framework.

It provides infrastructure for:

* REST APIs
* dependency injection
* configuration
* web applications
* validation
* database integration
* testing
* security integration

The backend architecture is:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

---

# 26. Spring Security

Spring Security handles:

* authentication
* authorization
* password security integration
* request security
* security context
* protected endpoints

The authentication design is described in:

```text
04-backend/authentication.md
```

Authorization is described in:

```text
04-backend/authorization.md
```

---

# 27. Spring Data JPA

Spring Data JPA handles PostgreSQL persistence.

It provides:

* repository abstractions
* entity mapping
* query methods
* transaction integration

Example:

```text
GoalRepository
TaskRepository
LearningSessionRepository
```

---

# 28. PostgreSQL

PostgreSQL is the primary relational database.

It stores:

```text
Users
Goals
Milestones
Tasks
Learning Sessions
Activity
```

PostgreSQL was chosen because these entities have clear relationships and benefit from:

* foreign keys
* transactions
* constraints
* relational queries
* indexing

---

# 29. MongoDB

MongoDB stores journal/document-oriented data.

Initial responsibility:

```text
Journal Entries
```

MongoDB provides flexible document structures useful for journal content that may evolve over time.

However, MongoDB is deliberately limited in scope rather than becoming the application's default database.

---

# 30. REST API

The backend exposes a REST API.

Base path:

```text
/api/v1
```

Examples:

```text
GET    /api/v1/goals
POST   /api/v1/goals
GET    /api/v1/goals/{goalId}
PATCH  /api/v1/goals/{goalId}
DELETE /api/v1/goals/{goalId}
```

REST provides a straightforward contract between React and Spring Boot.

---

# 31. JSON

JSON is the primary API representation.

Example:

```json
{
  "id": "123",
  "title": "Learn React",
  "status": "ACTIVE"
}
```

JSON works naturally with:

```text
React
TypeScript
Spring Boot
```

---

# 32. Jakarta Bean Validation

Backend request validation uses Jakarta Bean Validation.

Examples:

```java
@NotBlank
@Email
@Size
@Valid
```

This provides consistent validation for incoming API requests.

---

# 33. OpenAPI / Swagger

OpenAPI documents the REST API.

It helps developers understand:

* endpoints
* parameters
* request bodies
* responses
* authentication
* status codes

Swagger UI provides an interactive interface for exploring the API during development.

---

# 34. JUnit

JUnit is the primary backend testing framework.

It will be used for:

* service tests
* business logic tests
* integration tests
* controller tests

---

# 35. Mockito

Mockito is used to isolate dependencies in unit tests.

For example:

```text
GoalService
    ↓
mock GoalRepository
```

This allows service logic to be tested independently.

Mocking should be used intentionally rather than for every test.

---

# 36. Spring Boot Test

Spring Boot Test provides integration-oriented testing support.

It can test:

```text
Spring context
Controllers
Repositories
Security
Database integration
```

The project should combine isolated unit tests with realistic integration tests.

---

# 37. Maven

Maven manages the backend project.

Responsibilities include:

* dependencies
* compilation
* tests
* packaging
* plugins
* build lifecycle

The Maven Wrapper should be committed so developers can use the expected Maven version.

---

# 38. Flyway

Flyway manages PostgreSQL database migrations.

Example:

```text
V1__initial_schema.sql
V2__add_activity.sql
V3__add_goal_target_date.sql
```

This makes database evolution version-controlled and reproducible.

---

# 39. Docker

Docker provides consistent application environments.

Initially, Docker will primarily be useful for:

* PostgreSQL
* MongoDB
* backend containerization
* eventually frontend production serving

Docker helps reduce:

```text
"It works on my machine."
```

problems.

---

# 40. Docker Compose

Docker Compose manages multiple local services.

Conceptually:

```text
Docker Compose
├── PostgreSQL
└── MongoDB
```

Later it can include:

```text
Backend
Redis
Monitoring
```

if those services become necessary.

---

# 41. Git

Git provides version control.

It is used for:

* feature branches
* commits
* history
* collaboration
* reverting changes
* code review

Git conventions are defined separately in:

```text
05-development/git-workflow.md
```

---

# 42. GitHub

GitHub will host the repository and support:

* remote Git repository
* pull requests
* issue tracking
* code review
* CI/CD
* project documentation

The repository should contain the project's important technical documentation.

---

# 43. GitHub Actions

GitHub Actions will eventually automate CI/CD.

Initial CI pipeline:

```text
Push / Pull Request
        ↓
Install dependencies
        ↓
Frontend type check
        ↓
Frontend lint
        ↓
Frontend tests
        ↓
Frontend build
        ↓
Backend tests
        ↓
Backend build
```

E2E tests can be added once the application has a stable test environment.

---

# 44. DBeaver

DBeaver is a development tool for inspecting PostgreSQL.

It is useful for:

* viewing tables
* inspecting rows
* running SQL
* understanding relationships
* debugging database state

It is a developer tool, not an application dependency.

---

# 45. MongoDB Compass

MongoDB Compass provides a graphical interface for MongoDB.

It is useful for:

* viewing collections
* inspecting journal documents
* running queries
* debugging document structure

Again, it is a development tool rather than part of the application runtime.

---

# 46. Custom HTTP Client

The frontend will have a centralized HTTP client:

```text
src/services/api/client.ts
```

Responsibilities include:

* base URL
* request configuration
* authentication headers
* response parsing
* common error normalization
* request behavior

Feature-specific API functions remain separate.

Example:

```text
services/api/client.ts
features/goals/api.ts
features/journal/api.ts
```

---

# 47. Why Not Add Axios Immediately?

The application can use the browser's native `fetch` API initially.

This provides a useful understanding of:

* HTTP requests
* headers
* JSON
* status codes
* authentication
* errors

A library such as Axios can be introduced if the project develops a real need for its features.

The goal is to avoid adding abstractions simply because they are common.

---

# 48. Tooling Philosophy

Mezgeb follows:

```text
Need
 ↓
Understand problem
 ↓
Use simplest suitable tool
 ↓
Add abstraction only when useful
```

Not:

```text
Popular tool
 ↓
Install it
 ↓
Find a reason to use it
```

---

# 49. Progressive Adoption

The stack should be introduced progressively.

### Phase 1

```text
React
TypeScript
Vite
CSS
```

### Phase 2

```text
React Router
ESLint
Prettier
```

### Phase 3

```text
Vitest
React Testing Library
React Hook Form
Zod
```

### Phase 4

```text
Spring Boot
Spring Security
PostgreSQL
JPA
```

### Phase 5

```text
TanStack Query
MongoDB
Docker
```

### Phase 6

```text
GitHub Actions
Playwright
Flyway
```

The exact order can change during implementation.

---

# 50. Technologies Explicitly Deferred

The following are not required for the MVP:

```text
Redis
Elasticsearch/OpenSearch
Kafka
RabbitMQ
Kubernetes
Terraform
Prometheus
Grafana
Sentry
AWS-specific infrastructure
AI frameworks
Vector databases
```

Some may become useful later.

They should not be introduced simply to make the project appear more sophisticated.

---

# 51. Future AI Stack

AI features are part of the longer-term roadmap rather than the core MVP.

Potential future technologies include:

```text
LLM APIs
Embeddings
RAG
Vector database
AI evaluation
Prompt management
```

Possible use cases:

```text
Journal summaries
Progress insights
Learning recommendations
Search over learning history
```

The AI architecture should be designed separately when these features become real requirements.

---

# 52. Future Observability

Possible future tools:

```text
Sentry
Prometheus
Grafana
OpenTelemetry
```

These can provide:

* error tracking
* metrics
* tracing
* performance monitoring

They are not necessary for the initial local application.

---

# 53. Security Stack Summary

Security responsibilities are distributed across the stack:

```text
Spring Security
      ↓
Authentication + Authorization

BCrypt
      ↓
Password hashing

Jakarta Validation
      ↓
Input validation

PostgreSQL constraints
      ↓
Data integrity

HTTPS
      ↓
Transport security
```

Additional security controls will be added as the application grows.

---

# 54. Testing Stack Summary

```text
Frontend
├── Vitest
├── React Testing Library
├── MSW
└── Playwright

Backend
├── JUnit
├── Mockito
└── Spring Boot Test

Quality
├── TypeScript
├── ESLint
└── Prettier

Database
└── Testcontainers later
```

---

# 55. Complete Technology Map

```text
MEZGEB
│
├── Frontend
│   ├── React
│   ├── TypeScript
│   ├── Vite
│   ├── React Router
│   ├── CSS Modules
│   ├── React Hook Form
│   ├── Zod
│   └── TanStack Query
│
├── Backend
│   ├── Java
│   ├── Spring Boot
│   ├── Spring Security
│   ├── Spring Data JPA
│   ├── Jakarta Validation
│   └── REST
│
├── Databases
│   ├── PostgreSQL
│   └── MongoDB
│
├── Testing
│   ├── Vitest
│   ├── React Testing Library
│   ├── Playwright
│   ├── JUnit
│   ├── Mockito
│   └── Spring Boot Test
│
├── Development
│   ├── Git
│   ├── GitHub
│   ├── Maven
│   ├── ESLint
│   ├── Prettier
│   └── Flyway
│
└── Infrastructure
    ├── Docker
    ├── Docker Compose
    └── GitHub Actions
```

---

# 56. Stack Decision Principles

Every technology should satisfy at least one meaningful requirement:

### 1. Product need

Does the application actually need it?

### 2. Learning value

Does it teach an important engineering concept?

### 3. Maintainability

Does it make the code easier to maintain?

### 4. Industry relevance

Does it represent a useful real-world engineering practice?

### 5. Complexity cost

Does its benefit justify the additional complexity?

---

# 57. Final Technology Principle

Mezgeb is intentionally not trying to use every modern technology.

The stack should evolve like this:

```text
Simple foundation
       ↓
Real requirements
       ↓
Measured complexity
       ↓
Appropriate tooling
```

The core principle is:

> **Choose technologies because they solve a real problem or teach an important engineering concept—not because they are popular.**
