# Mezgeb Documentation Structure

```text
docs/
│
├── 01-product/
│   ├── product-overview.md
│   ├── requirements.md
│   ├── user-personas.md
│   ├── user-stories.md
│   ├── scope.md
│   └── roadmap.md
│
├── 02-design/
│   ├── information-architecture.md
│   ├── user-flows.md
│   ├── ui-design.md
│   ├── design-system.md
│   └── accessibility.md
│
├── 03-frontend/
│   ├── frontend-overview.md
│   ├── architecture.md
│   ├── project-structure.md
│   ├── routing.md
│   ├── component-architecture.md
│   ├── state-management.md
│   ├── data-fetching.md
│   ├── forms-and-validation.md
│   ├── styling.md
│   ├── error-handling.md
│   ├── loading-and-empty-states.md
│   ├── authentication.md
│   ├── api-integration.md
│   ├── testing.md
│   └── frontend-conventions.md
│
├── 04-backend/
│   ├── backend-overview.md
│   ├── architecture.md
│   ├── api-specification.md
│   ├── authentication.md
│   ├── authorization.md
│   └── database-design.md
│
├── 05-development/
│   ├── development-setup.md
│   ├── tech-stack.md
│   ├── coding-conventions.md
│   ├── git-workflow.md
│   ├── testing-strategy.md
│   └── environment-variables.md
│
│── 06-project/
│    ├── roadmap.md
│    ├── changelog.md
│    ├── decisions.md
│    └── known-issues.md
│
└── 07-production/
    ├── production-overview.md
    ├── deployment.md
    ├── infrastructure.md
    ├── ci-cd.md
    ├── security.md
    ├── monitoring-and-observability.md
    ├── database-and-backups.md
    ├── release-management.md
    └── incident-response.md
```

## Documentation Responsibilities

### 01 — Product

Defines **what Mezgeb is and what it should accomplish**.

```text
product-overview
requirements
user-personas
user-stories
scope
roadmap
```

### 02 — Design

Defines **how users interact with and experience Mezgeb**.

```text
information-architecture
user-flows
ui-design
design-system
accessibility
```

### 03 — Frontend

Defines **how the React application is structured and implemented**.

```text
frontend-overview
architecture
project-structure
routing
component-architecture
state-management
data-fetching
forms-and-validation
styling
error-handling
loading-and-empty-states
authentication
api-integration
testing
frontend-conventions
```

This is intentionally the most detailed section because **Mezgeb is also your React learning project**.

### 04 — Backend

Defines **how the server, API, authentication, authorization, and databases work**.

```text
backend-overview
architecture
api-specification
authentication
authorization
database-design
```

### 05 — Development

Defines **how we develop the project**.

```text
development-setup
tech-stack
coding-conventions
git-workflow
testing-strategy
environment-variables
```

### 06 — Project

Defines **how the project evolves over time**.

```text
roadmap
changelog
decisions
known-issues
```

---

# Documentation Dependency

We should not write these randomly.

The order will be:

```text
01-product
    │
    ├── product-overview
    ├── requirements
    ├── user-personas
    ├── user-stories
    └── scope
          │
          ▼
02-design
    │
    ├── information-architecture
    ├── user-flows
    ├── ui-design
    ├── design-system
    └── accessibility
          │
          ▼
03-frontend
    │
    ├── frontend-overview
    ├── architecture
    ├── project-structure
    ├── routing
    ├── component-architecture
    ├── state-management
    ├── data-fetching
    ├── forms-and-validation
    ├── styling
    ├── error-handling
    ├── loading-and-empty-states
    ├── authentication
    ├── api-integration
    ├── testing
    └── frontend-conventions
          │
          ▼
04-backend
          │
          ▼
05-development
          │
          ▼
06-project
```

## Important distinction

There are **two roadmap-related documents**:

### `01-product/roadmap.md`

Defines the **product roadmap**:

```text
MVP
→ Post-MVP
→ Future features
```

### `06-project/roadmap.md`

Defines the **actual development roadmap**:

```text
Phase 1 — Project setup
Phase 2 — Authentication
Phase 3 — Goals
Phase 4 — Tasks
...
```

Keeping these separate prevents the product roadmap from becoming mixed with implementation tasks.

---

# Current Progress

We've already created:

```text
01-product/
├── product-overview.md       ✓
├── requirements.md           ✓
├── user-personas.md          ← next
├── user-stories.md           ✓
├── scope.md                  ✓
└── roadmap.md                ← later
```

And:

```text
02-design/
├── information-architecture.md ✓
├── user-flows.md               ← next
├── ui-design.md
├── design-system.md
└── accessibility.md
```

So **we should not jump straight to frontend yet**.

We still need to complete:

**User Personas → Product Roadmap → User Flows → UI Design → Design System → Accessibility**

Then we'll have enough product/design context to make the frontend architecture decisions properly.
