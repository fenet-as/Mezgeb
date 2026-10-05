# Project Decisions

## 1. Purpose

This document records important technical, architectural, and product-development decisions made during the development of Mezgeb.

The goal is to preserve the reasoning behind decisions, not just the decisions themselves.

A future developer should be able to answer:

> **Why was Mezgeb built this way?**

without having to reconstruct the reasoning from old commits or conversations.

---

# 2. What Belongs Here?

A decision should be recorded when it has meaningful consequences for the project.

Examples include:

* architecture choices
* database choices
* authentication strategy
* API design decisions
* frontend state-management decisions
* technology choices
* security decisions
* major UX decisions
* decisions to defer or reject significant technologies
* changes to previously established architecture

Small implementation choices do not need to be recorded.

For example:

```text
Good decision to record:
"Use PostgreSQL as the primary relational database."

Not necessary:
"Use map() instead of a for loop in this component."
```

---

# 3. Decision Format

Each decision should follow:

```text id="6x0tby"
## ADR-XXX — Decision Title

**Status:** Accepted

**Date:** YYYY-MM-DD

### Context

What problem or situation led to the decision?

### Decision

What did we decide?

### Alternatives Considered

What other reasonable options existed?

### Reasoning

Why was this option selected?

### Consequences

What benefits, costs, and trade-offs does this create?

### Related Documentation

Which project documents are affected?
```

---

# 4. Decision Statuses

Use one of:

### Proposed

The decision is being considered but has not been finalized.

### Accepted

The decision is currently active.

### Superseded

A newer decision replaced it.

### Rejected

The option was considered but intentionally not selected.

### Deprecated

The decision is no longer recommended but may still exist in the codebase temporarily.

---

# 5. ADR-001 — Use React for the Frontend

**Status:** Accepted

**Date:** 2026-10-02

### Context

Mezgeb is a web application with multiple interactive screens, forms, dashboards, lists, progress views, and reusable UI components.

The project is also intended to deepen practical React knowledge.

### Decision

Use **React** as the frontend framework.

### Alternatives Considered

* Vue
* Angular
* Svelte
* Next.js
* Vanilla JavaScript

### Reasoning

React provides:

* component-based UI development
* reusable components
* a large ecosystem
* strong TypeScript support
* practical experience with modern frontend architecture
* useful experience for future professional development

The project is intentionally designed to teach React fundamentals rather than hide them behind excessive abstractions.

### Consequences

Positive:

* Strong component model.
* Large ecosystem.
* Good learning opportunity.
* Easy separation between pages, features, and shared UI.

Trade-offs:

* More libraries need to be selected for routing, forms, server state, and testing.
* React itself does not define the complete application architecture.

### Related Documentation

* `03-frontend/frontend-overview.md`
* `03-frontend/architecture.md`
* `05-development/tech-stack.md`

---

# 6. ADR-002 — Use TypeScript

**Status:** Accepted

**Date:** 2026-10-02

### Context

Mezgeb has many structured objects shared conceptually between frontend and backend:

* users
* goals
* milestones
* tasks
* sessions
* journal entries
* progress data
* API responses

JavaScript would allow these structures to remain largely unchecked during development.

### Decision

Use **TypeScript** for the frontend.

### Alternatives Considered

* JavaScript
* Flow

### Reasoning

TypeScript provides:

* static type checking
* safer API integration
* better editor support
* clearer component contracts
* easier refactoring
* earlier detection of common mistakes

### Consequences

Positive:

* Safer frontend development.
* Better documentation through types.
* Easier maintenance as the application grows.

Trade-offs:

* Additional type definitions.
* Developers must understand TypeScript's type system.

### Related Documentation

* `03-frontend/frontend-overview.md`
* `03-frontend/frontend-conventions.md`

---

# 7. ADR-003 — Use Vite for Frontend Tooling

**Status:** Accepted

**Date:** 2026-10-02

### Context

The frontend needs a modern development server and production build system.

### Decision

Use **Vite** for the React application.

### Reasoning

Vite provides:

* fast development startup
* fast hot module replacement
* straightforward configuration
* modern TypeScript/React support
* simple production builds

It also keeps the project focused on learning React rather than framework-specific complexity.

### Consequences

The frontend follows Vite's application structure and environment-variable conventions.

### Related Documentation

* `03-frontend/frontend-overview.md`
* `05-development/tech-stack.md`

---

# 8. ADR-004 — Use CSS Modules and Standard CSS

**Status:** Accepted

**Date:** 2026-10-02

### Context

Mezgeb needs a consistent styling system while the project is also intended to strengthen fundamental CSS knowledge.

### Decision

Use standard CSS and **CSS Modules** rather than Tailwind as the primary styling approach.

### Alternatives Considered

* Tailwind CSS
* styled-components
* Emotion
* CSS-in-JS

### Reasoning

CSS Modules provide:

* locally scoped styles
* normal CSS syntax
* reduced global naming conflicts
* direct experience with CSS fundamentals
* compatibility with the project's design-token approach

### Consequences

Positive:

* Better understanding of CSS.
* Predictable component-level styling.
* Less global CSS pollution.

Trade-offs:

* More CSS must be written manually.
* Some UI patterns require more repetitive styling than utility CSS.

### Related Documentation

* `02-design/design-system.md`
* `03-frontend/styling.md`
* `05-development/tech-stack.md`

---

# 9. ADR-005 — Use React Router

**Status:** Accepted

**Date:** 2026-10-02

### Context

Mezgeb has multiple application areas and protected routes.

### Decision

Use **React Router** for client-side routing.

### Reasoning

It provides the routing capabilities required for:

* public pages
* protected pages
* nested routes
* dynamic resource IDs
* navigation
* redirects
* route-level boundaries

### Consequences

The application follows the routing structure defined in:

```text id="x5z3nk"
03-frontend/routing.md
```

---

# 10. ADR-006 — Use a Modular Monolith for the Backend

**Status:** Accepted

**Date:** 2026-10-02

### Context

Mezgeb contains several domains but is initially a single application.

Splitting these domains into independent microservices would introduce infrastructure and operational complexity that is unnecessary for the project's current scale.

### Decision

Build the backend as a **modular monolith**.

### Structure

```text id="5x6w1r"
Spring Boot Application
        │
        ├── auth
        ├── user
        ├── goal
        ├── milestone
        ├── task
        ├── session
        ├── journal
        ├── progress
        └── activity
```

### Alternatives Considered

* Microservices
* Serverless functions
* A less structured monolithic application

### Reasoning

A modular monolith provides:

* simple deployment
* simple local development
* clear domain boundaries
* easier debugging
* lower operational complexity
* a foundation that could theoretically be split later

### Consequences

Positive:

* Easier development.
* Easier testing.
* Easier deployment.
* Clear domain organization.

Trade-offs:

* Domains share one application/runtime.
* Some boundaries must be enforced through project conventions rather than separate services.

### Related Documentation

* `04-backend/architecture.md`
* `04-backend/backend-overview.md`

---

# 11. ADR-007 — Use Layered Backend Responsibilities

**Status:** Accepted

**Date:** 2026-10-02

### Context

The backend needs predictable separation of concerns.

### Decision

Use:

```text id="f1p7yk"
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

### Responsibilities

**Controller**

HTTP concerns and request/response handling.

**Service**

Business rules, ownership checks, transactions, and application behavior.

**Repository**

Persistence operations.

### Reasoning

This structure makes responsibilities easier to understand and test.

### Consequences

The project avoids placing business logic directly in controllers or database access directly in controllers.

### Related Documentation

* `04-backend/architecture.md`
* `05-development/coding-conventions.md`

---

# 12. ADR-008 — Use DTOs Instead of Exposing Entities Directly

**Status:** Accepted

**Date:** 2026-10-02

### Context

Database entities represent persistence concerns while API contracts represent external communication.

Exposing entities directly couples these two concerns.

### Decision

Use separate request/response DTOs.

```text id="h4v8wp"
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
Entity
    ↓
Response DTO
    ↓
HTTP Response
```

### Reasoning

DTOs provide:

* API stability
* controlled data exposure
* validation boundaries
* separation between persistence and API models

### Consequences

More classes/types are required, but the application gains clearer boundaries.

---

# 13. ADR-009 — Use PostgreSQL as the Primary Database

**Status:** Accepted

**Date:** 2026-10-02

### Context

Most Mezgeb data is structured and relational.

Examples:

```text id="2v9q0m"
User
 ↓
Goals
 ↓
Milestones
 ↓
Tasks
```

Sessions, activities, and progress calculations also have strong relationships with users and goals.

### Decision

Use **PostgreSQL** as the primary relational database.

### Reasoning

PostgreSQL provides:

* relational integrity
* foreign keys
* transactions
* constraints
* indexing
* strong SQL support
* mature Java/Spring integration

### Consequences

Structured application data will primarily live in PostgreSQL.

---

# 14. ADR-010 — Use MongoDB for Journal Documents

**Status:** Accepted — Initial Architecture

**Date:** 2026-10-02

### Context

Journal entries contain flexible, document-oriented content and may evolve independently from the relational learning structure.

The project also intentionally provides an opportunity to learn both relational and document databases.

### Decision

Initially store journal entries in **MongoDB**.

### Reasoning

MongoDB provides:

* document-oriented storage
* flexible document structure
* natural representation of journal content
* practical experience with a NoSQL database

### Important Trade-off

A PostgreSQL-only architecture would be simpler.

MongoDB introduces:

* a second database
* separate operational concerns
* cross-database reference management
* additional testing complexity
* no shared relational transactions

Therefore this decision should be reconsidered if MongoDB does not provide sufficient practical value.

### Consequences

Cross-database relationships are logical rather than foreign-key enforced.

MVP operations should avoid requiring atomic transactions across PostgreSQL and MongoDB.

### Related Documentation

* `04-backend/database-design.md`
* `05-development/tech-stack.md`

---

# 15. ADR-011 — Use UUIDs for Application Resource IDs

**Status:** Accepted

**Date:** 2026-10-02

### Context

Mezgeb exposes resource identifiers through APIs and URLs.

Sequential numeric IDs are predictable and expose ordering information.

### Decision

Use UUIDs for application-level resource IDs.

### Reasoning

UUIDs provide:

* globally unique identifiers
* less predictable public identifiers
* easier distributed generation
* compatibility with future system expansion

### Consequences

UUIDs are larger than simple integers and can require more storage/index space.

For Mezgeb's scale, this trade-off is acceptable.

---

# 16. ADR-012 — Derive Progress Instead of Storing It Initially

**Status:** Accepted

**Date:** 2026-10-02

### Context

Goal progress can be calculated from underlying learning data.

For example:

```text id="x7v2m1"
completed tasks
----------------
total tasks
```

Storing progress separately could introduce synchronization problems.

### Decision

Calculate core progress from source data rather than storing redundant progress values initially.

### Reasoning

This prevents situations such as:

```text id="r4p6z8"
Tasks say: 8 completed
Stored progress says: 70%
```

The underlying data remains the source of truth.

### Consequences

Progress calculations may require database queries.

If performance becomes a real problem, derived/cached values can be introduced later.

---

# 17. ADR-013 — Use JWT-Based Stateless Authentication Initially

**Status:** Accepted — Initial Architecture

**Date:** 2026-10-02

### Context

The frontend and backend communicate through a REST API.

The application needs authenticated requests without maintaining traditional server-side session state.

### Decision

Use JWT-based stateless authentication initially.

### Reasoning

JWTs work naturally with REST APIs and provide a useful learning opportunity around:

* token creation
* token validation
* Spring Security
* authentication filters
* authorization

### Consequences

Positive:

* Stateless request authentication.
* Straightforward frontend/API interaction.
* Good fit for the application's REST architecture.

Trade-offs:

* Token lifecycle must be handled carefully.
* Token revocation is more complicated than traditional sessions.
* Storage strategy requires security consideration.

The exact token storage and refresh-token strategy should be finalized during implementation based on the chosen security model.

---

# 18. ADR-014 — Backend Is the Security Authority

**Status:** Accepted

**Date:** 2026-10-02

### Context

The frontend can hide UI elements and protect routes, but client-side restrictions can be bypassed.

### Decision

All security-sensitive authorization decisions are enforced by the backend.

### Example

A frontend might hide:

```text id="4j6p1q"
Delete Goal
```

for another user.

But the backend must still reject:

```text id="c5w9az"
DELETE /api/v1/goals/{otherUserGoal}
```

### Reasoning

The backend is the trusted boundary.

### Consequences

Every user-owned resource must be checked server-side.

Frontend route protection is treated as a UX mechanism, not a security mechanism.

---

# 19. ADR-015 — Use Feature-Oriented Frontend Architecture

**Status:** Accepted

**Date:** 2026-10-02

### Context

The application contains multiple product domains.

A completely type-based structure such as:

```text
components/
services/
hooks/
pages/
```

can become difficult to navigate as the application grows.

### Decision

Organize product-specific frontend code primarily around features.

```text id="5v0g9a"
features/
├── auth/
├── goals/
├── milestones/
├── tasks/
├── sessions/
├── journal/
├── progress/
└── settings/
```

Shared UI remains separate.

### Reasoning

Feature boundaries make it easier to locate related behavior.

### Consequences

Feature folders should remain focused and should not become miniature applications with unnecessary internal complexity.

---

# 20. ADR-016 — Use TanStack Query for Server State

**Status:** Accepted

**Date:** 2026-10-02

### Context

Mezgeb communicates frequently with the backend and needs:

* fetching
* caching
* loading states
* mutations
* invalidation
* refetching

### Decision

Use **TanStack Query** for server state.

### Reasoning

Server state has different characteristics from local UI state.

TanStack Query handles many server-state concerns without requiring a general-purpose global state library.

### Consequences

The application should not duplicate server data unnecessarily in React state.

Local UI state remains local.

---

# 21. ADR-017 — Do Not Introduce a Global State Library Initially

**Status:** Accepted

**Date:** 2026-10-02

### Context

Mezgeb has several categories of state, but most application data belongs to the server.

Introducing Redux or another global state library immediately would add complexity before a real need exists.

### Decision

Start with:

```text id="m5x7vc"
useState
useReducer
Context
React Hook Form
TanStack Query
React Router URL state
```

Introduce a dedicated global state library only if the application develops a concrete requirement.

### Reasoning

The goal is to use the smallest state scope that correctly represents the data.

### Consequences

The architecture remains simpler.

If complex cross-feature client state emerges, the decision can be revisited.

---

# 22. ADR-018 — Use React Hook Form + Zod for Forms

**Status:** Accepted

**Date:** 2026-10-02

### Context

Mezgeb contains multiple forms:

* registration
* login
* goals
* milestones
* tasks
* sessions
* journal entries
* settings

### Decision

Use:

```text id="9z4m1k"
React Hook Form
        +
      Zod
```

### Reasoning

React Hook Form manages form state efficiently while Zod provides explicit validation schemas.

### Consequences

Client-side validation becomes consistent.

Backend validation remains authoritative.

---

# 23. ADR-019 — Use REST for the Initial API

**Status:** Accepted

**Date:** 2026-10-02

### Context

The application needs communication between the React frontend and Spring Boot backend.

### Decision

Use a REST API with JSON.

### Alternatives Considered

* GraphQL
* gRPC
* WebSockets as the primary API

### Reasoning

REST is sufficient for Mezgeb's current requirements and provides useful experience with:

* HTTP methods
* status codes
* resource-oriented URLs
* authentication headers
* request/response contracts
* API documentation

### Consequences

The API follows the conventions defined in:

```text id="3m7v9x"
04-backend/api-specification.md
```

More specialized protocols can be introduced later if a real requirement emerges.

---

# 24. ADR-020 — Use Flyway for PostgreSQL Migrations

**Status:** Accepted

**Date:** 2026-10-02

### Context

Database schema changes must be reproducible across development, testing, and production.

### Decision

Use **Flyway** for PostgreSQL schema migrations.

### Reasoning

Flyway provides version-controlled database changes that can be applied consistently.

### Consequences

Schema changes should be committed as migrations rather than manually applied only through database tools.

---

# 25. ADR-021 — Use Docker Compose for Local Infrastructure

**Status:** Accepted

**Date:** 2026-10-02

### Context

Mezgeb uses PostgreSQL and MongoDB.

Installing and configuring both databases manually on every machine makes development less reproducible.

### Decision

Use Docker Compose for local infrastructure where practical.

### Example

```text id="1w6n8f"
Docker Compose
 ├── PostgreSQL
 └── MongoDB
```

### Reasoning

This provides:

* reproducible local infrastructure
* easier setup
* isolated services
* consistent versions

### Consequences

Developers need Docker installed.

Database volumes must be managed carefully because removing volumes can delete local development data.

---

# 26. ADR-022 — Use Progressive Technology Adoption

**Status:** Accepted

**Date:** 2026-10-02

### Context

Mezgeb is both a real project and a learning project.

Installing every planned technology immediately would make the project harder to understand and debug.

### Decision

Introduce technologies when the project reaches the point where they solve a real problem or teach a relevant concept.

### Example

```text id="6p0w8d"
React + TypeScript
      ↓
Routing
      ↓
Testing
      ↓
Forms
      ↓
Backend API
      ↓
Server State
      ↓
Databases
      ↓
Docker
      ↓
CI/CD
```

### Reasoning

This keeps complexity proportional to the project's current needs.

### Consequences

Some tools planned for the project will intentionally not be installed at the beginning.

---

# 27. ADR-023 — Keep AI Features Out of the Initial MVP

**Status:** Accepted

**Date:** 2026-10-02

### Context

AI features are part of Mezgeb's potential future direction, including:

* reflection assistance
* progress insights
* learning assistance
* semantic search over learning history

However, AI is not necessary for the core learning-tracking experience.

### Decision

Do not make AI functionality a dependency of the initial MVP.

### Reasoning

The fundamental product value should work without AI:

```text id="s3y7m9"
Goal
 ↓
Learning
 ↓
Record
 ↓
Reflect
 ↓
Review
```

AI can later improve this experience rather than define it.

### Consequences

The initial architecture should leave reasonable extension points without prematurely introducing:

* LLM providers
* vector databases
* embeddings
* RAG infrastructure
* AI orchestration frameworks

---

# 28. ADR-024 — Build the Core Learning Loop Before Advanced Features

**Status:** Accepted

**Date:** 2026-10-02

### Context

Mezgeb could easily expand into:

* project management
* social networking
* calendars
* AI assistants
* habit tracking
* gamification
* course management

This creates a risk of losing the original product focus.

### Decision

Prioritize the core learning loop:

```text id="j5f9xc"
Goal
 ↓
Milestone
 ↓
Task
 ↓
Learning Session
 ↓
Reflection
 ↓
Progress
```

### Reasoning

This is the fundamental behavior Mezgeb exists to support.

### Consequences

Features outside this loop should be evaluated against whether they meaningfully improve the learning experience.

---

# 29. ADR-025 — Prefer Simple Architecture Until Complexity Is Justified

**Status:** Accepted

**Date:** 2026-10-02

### Context

Modern development offers many sophisticated tools and architectures.

Using them prematurely can make a project harder to understand without providing proportional benefits.

### Decision

Use the simplest architecture that satisfies current requirements.

### Examples

Prefer:

```text id="0k7q2m"
Modular monolith
```

over microservices.

Prefer:

```text id="p8f4va"
TanStack Query + Context
```

over immediately introducing multiple global state libraries.

Prefer:

```text id="d1j6xz"
PostgreSQL
```

when relational data is sufficient, while MongoDB is included only where its learning/architectural value justifies the additional complexity.

### Consequences

The project remains understandable while retaining room for future evolution.

---

# 30. Revisiting Decisions

Accepted decisions are not permanent laws.

A decision should be revisited when:

* requirements change
* the current solution creates significant problems
* a new constraint appears
* scale changes
* security requirements change
* development experience exposes a flaw
* a simpler solution becomes available

When replacing a decision:

```text id="y4r8ne"
Old decision
    ↓
Explain why it no longer works
    ↓
Create new decision
    ↓
Mark old decision as Superseded
    ↓
Update affected documentation
```

Do not silently change major architectural decisions.

---

# 31. Decision Checklist

Before making a significant technical decision, ask:

```text id="2q9m7f"
- [ ] What problem are we solving?
- [ ] Is this actually a problem right now?
- [ ] What alternatives exist?
- [ ] What are the trade-offs?
- [ ] Does this increase unnecessary complexity?
- [ ] Does it fit Mezgeb's current architecture?
- [ ] Does it support the product requirements?
- [ ] Does it create security implications?
- [ ] Does it affect the database or API?
- [ ] Does it affect future extensibility?
- [ ] Should the decision be documented?
```

---

# 32. Decision Principles

The following principles should guide future decisions:

### 1. Understand before abstracting

Do not introduce abstractions that hide concepts we are still learning.

### 2. Solve real problems

A technology should have a reason to exist in the project.

### 3. Keep boundaries clear

Frontend, backend, database, and infrastructure should have clear responsibilities.

### 4. Prefer reversible decisions early

When two options are reasonable, prefer the option that is easier to change later when appropriate.

### 5. Security is not optional

Convenience should not override authentication, authorization, validation, or data protection.

### 6. Optimize for learning and maintainability

Mezgeb is both a real application and an engineering learning project.

### 7. Avoid complexity theater

Using more technologies does not automatically make the project more professional.

---

# 33. Current Architecture Summary

The decisions currently lead to this architecture:

```text id="m2x7qd"
                    ┌──────────────────────┐
                    │       Browser        │
                    │ React + TypeScript   │
                    │      Vite            │
                    └──────────┬───────────┘
                               │
                          REST / JSON
                               │
                    ┌──────────▼───────────┐
                    │     Spring Boot      │
                    │   Modular Monolith   │
                    └──────────┬───────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
      ┌───────▼────────┐               ┌────────▼───────┐
      │   PostgreSQL   │               │    MongoDB     │
      │ Structured     │               │ Journal Docs   │
      │ Learning Data  │               │                │
      └────────────────┘               └────────────────┘
```

Frontend state:

```text id="q6w1kc"
Local UI      → React state
Forms         → React Hook Form
Validation    → Zod
Server state  → TanStack Query
URL state     → React Router
Auth          → Context / Auth Provider
```

Backend:

```text id="w8p3za"
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Security:

```text id="4j7v2n"
Authentication
      ↓
Current User
      ↓
Authorization
      ↓
Ownership Check
      ↓
Business Rules
      ↓
Operation
```

---

# 34. Final Principle

Every important technical decision should answer:

> **What problem are we solving, why did we choose this approach, and what trade-off are we accepting?**

The purpose of this document is not to prove that every decision is perfect.

It is to make Mezgeb's engineering reasoning visible, reviewable, and changeable.
