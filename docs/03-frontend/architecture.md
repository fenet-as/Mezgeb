# Frontend Architecture

## 1. Purpose

This document defines the architecture of the Mezgeb frontend.

It explains:

* How the frontend is organized
* How data moves through the application
* How pages, features, components, hooks, and API code interact
* Where different types of logic belong
* How dependencies should flow
* How the architecture can grow without unnecessary complexity

The architecture should support the main Mezgeb principle:

> **Simple enough to learn from, structured enough to grow, and disciplined enough to behave like a real application.**

---

## 2. Architecture Goals

The frontend architecture should be:

* **Simple** — avoid unnecessary abstractions
* **Feature-oriented** — organize code around product capabilities
* **Maintainable** — related functionality should stay together
* **Testable** — logic and UI should be easy to test independently
* **Scalable** — new features should not require restructuring the entire application
* **Predictable** — developers should know where code belongs
* **Accessible** — architecture should support accessible UI patterns
* **Learning-friendly** — the structure should help reinforce React concepts

---

# 3. Architecture Style

Mezgeb uses a **pragmatic feature-oriented architecture with layered responsibilities**.

The application is divided into several logical layers:

```text
Application
    │
    ├── Routing
    │
    ├── Pages
    │
    ├── Features
    │
    ├── Shared UI
    │
    ├── Hooks
    │
    ├── Server State / API
    │
    └── Utilities / Types / Configuration
```

This is not intended to be a strict enterprise architecture.

The goal is to create clear boundaries without introducing abstractions that the project does not currently need.

---

# 4. High-Level Architecture

```text
┌─────────────────────────────────────┐
│              App Shell              │
│   Header / Sidebar / Global UI      │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│              Routing                │
│     Public / Protected Routes       │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│               Pages                 │
│ Dashboard / Goals / Journal / etc. │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│             Features               │
│ Goals / Tasks / Sessions / Journal │
└───────────────┬─────────┬───────────┘
                │         │
                ▼         ▼
        ┌────────────┐ ┌──────────────┐
        │ Components │ │    Hooks     │
        │ Shared UI  │ │ UI + Data    │
        └────────────┘ └──────┬───────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Server State/API │
                    │ Query + API funcs│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Spring Boot    │
                    │      API         │
                    └──────────────────┘
```

---

# 5. Application Shell

The application shell contains UI that surrounds the main page content.

Examples:

* Header
* Sidebar
* Mobile navigation
* Global notifications/toasts
* Authentication-aware navigation
* Main content container

Conceptually:

```text
App
│
├── AppProviders
│
├── Router
│
└── AppLayout
    ├── Header
    ├── Sidebar
    └── MainContent
        └── CurrentPage
```

The shell should not contain feature-specific business logic.

For example, the sidebar should know that a **Goals** route exists, but it should not contain goal creation logic.

---

# 6. Routing Layer

Routing determines which page should be displayed for a URL.

Responsibilities include:

* Defining routes
* Public routes
* Protected routes
* Route parameters
* Redirects
* Authentication checks
* Not-found handling

Example:

```text
/login
/register

/app/dashboard
/app/goals
/app/goals/:goalId
/app/journal
/app/progress
/app/settings
```

Routing should primarily answer:

> **Which page should be displayed?**

It should not contain feature business logic.

Detailed route definitions will be documented in:

`03-frontend/routing.md`

---

# 7. Page Layer

Pages represent complete route-level screens.

Examples:

```text
DashboardPage
GoalsPage
GoalDetailsPage
JournalPage
JournalEntryPage
ProgressPage
SettingsPage
LoginPage
RegisterPage
```

A page should primarily:

1. Determine what the screen needs
2. Compose feature components
3. Handle page-level states
4. Connect the screen to relevant data

Example:

```text
GoalDetailsPage
│
├── GoalHeader
├── GoalProgress
├── MilestoneList
│   └── MilestoneCard
├── TaskList
│   └── TaskItem
├── LearningSessionList
└── RecentJournalEntries
```

Pages should avoid becoming huge components containing every implementation detail.

---

# 8. Feature Layer

Features represent meaningful product capabilities.

Initial Mezgeb features include:

```text
features/
├── auth/
├── dashboard/
├── goals/
├── milestones/
├── tasks/
├── sessions/
├── journal/
├── progress/
└── settings/
```

A feature may contain:

* Feature components
* Feature hooks
* Feature-specific types
* Feature-specific API functions
* Feature-specific validation
* Feature-specific utilities
* Feature tests

For example:

```text
features/goals/
├── components/
├── hooks/
├── api/
├── schemas/
├── types.ts
└── tests/
```

The exact structure can evolve as the feature becomes more complex.

---

# 9. Shared UI Layer

Shared components are reusable UI elements that are not tied to one specific feature.

Examples:

```text
Button
Input
Card
Modal
Dialog
Badge
StatusBadge
ProgressBar
Spinner
Skeleton
EmptyState
ErrorState
ConfirmDialog
```

Shared components should be generic.

For example:

```tsx
<Button>Save Goal</Button>
```

is appropriate.

But a component such as:

```tsx
<GoalCompletionButton />
```

belongs to the Goals feature rather than the shared UI layer.

### Rule

> If a component represents a reusable UI pattern, it belongs in shared UI.

> If it represents product-specific behavior, it belongs in a feature.

---

# 10. Hooks Layer

Hooks encapsulate reusable React behavior.

Examples:

```text
useAuth()
useGoals()
useGoal()
useCreateGoal()
useJournal()
useDebounce()
```

Hooks can handle:

* Server-state interaction
* UI state
* Reusable behavior
* Subscriptions
* Browser APIs
* Derived behavior

Hooks should not automatically become a place to hide every piece of application logic.

A hook should exist when it improves reuse, organization, or clarity.

---

# 11. Server State and API Layer

Communication with the backend follows this general flow:

```text
Component
    ↓
Feature Hook / Query
    ↓
API Function
    ↓
HTTP Client
    ↓
Spring Boot API
```

For example:

```text
GoalDetailsPage
      ↓
useGoal(goalId)
      ↓
getGoal(goalId)
      ↓
HTTP Client
      ↓
GET /api/v1/goals/:goalId
```

The API layer is responsible for communication with the backend.

Components should not contain repeated raw HTTP requests throughout the application.

Avoid patterns such as:

```tsx
fetch("/api/goals")
```

being duplicated across many components.

Instead:

```text
Component
    ↓
Hook
    ↓
API function
```

This creates a predictable boundary between UI and backend communication.

---

# 12. Server State vs Client State

The architecture distinguishes between **server state** and **client/UI state**.

### Server state

Data that originates from the backend.

Examples:

* Goals
* Milestones
* Tasks
* Learning sessions
* Journal entries
* User profile

This will primarily be managed through TanStack Query.

### Client/UI state

State that exists mainly to control the current interface.

Examples:

* Modal open/closed
* Selected tab
* Sidebar state
* Form input
* Temporary filters
* Dropdown state

This can use React state such as:

```tsx
useState()
```

or local context where appropriate.

### Principle

> Do not put server data into global client state just because it is data.

Server state and UI state have different responsibilities.

---

# 13. Dependency Direction

Dependencies should generally flow from higher-level application code toward lower-level reusable code.

```text
Pages
  ↓
Features
  ↓
Shared Components / Hooks
  ↓
API / Utilities
```

Shared code should not depend on specific features.

For example:

```text
Button
```

should not import:

```text
GoalService
```

But:

```text
GoalForm
```

can use:

```text
Button
```

This prevents circular dependencies and keeps shared components reusable.

---

# 14. Feature Boundaries

Features should own their product-specific behavior.

For example:

```text
features/goals/
```

can contain:

* GoalForm
* GoalCard
* GoalList
* GoalProgress
* goal API functions
* goal validation
* goal hooks
* goal types

The Tasks feature can contain task-specific functionality.

The Journal feature can contain journal-specific functionality.

Features should communicate through clearly defined interfaces rather than importing each other's internal implementation unnecessarily.

---

# 15. Business Logic Placement

Business logic should live as close as possible to the feature that owns it.

Examples:

### UI logic

```text
Should the modal be open?
Which tab is selected?
```

→ Component/local state

### Feature logic

```text
How should a goal form be validated?
How should a task be completed?
```

→ Feature hooks, schemas, or feature utilities

### Server logic

```text
How is a goal stored?
Who is authorized to modify it?
How is progress calculated on the backend?
```

→ Backend

The frontend should not duplicate backend business rules unnecessarily.

---

# 16. Type Boundaries

TypeScript types should describe important data boundaries.

Examples:

```text
User
Goal
Milestone
Task
LearningSession
JournalEntry
```

API-related types should describe request and response structures.

For example:

```text
CreateGoalRequest
GoalResponse
UpdateGoalRequest
```

This makes the API contract explicit and reduces accidental mismatches between frontend and backend.

The frontend should not assume that its internal UI model is automatically identical to the backend database model.

---

# 17. Loading, Empty, and Error Boundaries

Every feature that retrieves data should consider three common states:

```text
Loading
   ↓
Success ──→ Empty
   ↓
Error
```

For example, the Goals page should handle:

```text
Loading goals
       ↓
Goals loaded
   ↙       ↘
Goals     No goals
```

and:

```text
API request failed
       ↓
ErrorState
       ↓
Retry
```

These states should be designed intentionally rather than added as an afterthought.

---

# 18. Authentication Boundary

Authentication is a cross-cutting concern.

The frontend should provide:

```text
AuthProvider
ProtectedRoute
Login
Register
Logout
Session handling
```

Protected application routes should require an authenticated user.

Conceptually:

```text
Public Routes
├── Login
└── Register

Protected Routes
├── Dashboard
├── Goals
├── Journal
├── Progress
└── Settings
```

Authentication implementation details will be documented separately in:

`03-frontend/authentication.md`

---

# 19. Error Handling

Errors should be handled at the appropriate level.

### Component-level errors

Examples:

* Invalid form input
* Failed individual action
* Missing data

### Feature-level errors

Examples:

* Failed to load goals
* Failed to create a journal entry

### Application-level errors

Examples:

* Unexpected application failure
* Unhandled route
* Authentication failure

The frontend should provide useful recovery actions where possible.

Examples:

```text
Try Again
Go Back
Return to Dashboard
Log In Again
```

---

# 20. Avoiding Premature Abstraction

Mezgeb should not create abstractions simply because something might be reusable later.

Prefer:

```text
Build → Observe repetition → Extract
```

rather than:

```text
Predict every future requirement → Build abstraction
```

For example, if two components share similar code, duplication may initially be acceptable.

Once the shared behavior becomes clear, it can be extracted into a reusable component or hook.

This keeps the project easier to understand while learning React.

---

# 21. Global State

Global state should be introduced only when multiple unrelated parts of the application genuinely need to share state.

Potential global concerns include:

* Authentication/session information
* Theme preferences
* Global UI notifications

Global state should **not** automatically contain:

* Every API response
* Every form value
* Every component state
* Every filter
* Every piece of UI state

Prefer local state whenever the state has a local owner.

---

# 22. Data Flow Principle

Data should generally move in a predictable direction:

```text
Backend
   ↓
API Layer
   ↓
Server State
   ↓
Feature Hooks
   ↓
Page
   ↓
Components
   ↓
User Interaction
   ↓
Mutation
   ↓
Backend
```

This makes it easier to understand where data comes from and where changes should happen.

---

# 23. Example: Creating a Goal

A typical goal creation flow looks like:

```text
User
  ↓
GoalForm
  ↓
React Hook Form
  ↓
Zod Validation
  ↓
useCreateGoal()
  ↓
createGoal()
  ↓
HTTP Client
  ↓
POST /api/v1/goals
  ↓
Spring Boot
  ↓
PostgreSQL
```

After a successful mutation:

```text
Backend
  ↓
Mutation Success
  ↓
Update / Invalidate Goal Query
  ↓
Goals UI Refreshes
```

The UI therefore does not need to manually manage a second copy of the backend data.

---

# 24. Architecture Rules

The following rules should guide implementation.

### Rule 1 — Pages compose features

Pages should primarily assemble the screen rather than contain every implementation detail.

### Rule 2 — Features own feature-specific behavior

Goals logic belongs with Goals.

Journal logic belongs with Journal.

Tasks logic belongs with Tasks.

### Rule 3 — Shared components stay generic

Shared UI should not depend on specific business features.

### Rule 4 — Server state is different from UI state

Do not treat API data and modal state as the same kind of state.

### Rule 5 — API communication has a boundary

Components should not scatter raw API requests throughout the application.

### Rule 6 — Prefer local state

Use the smallest state scope that solves the problem.

### Rule 7 — Avoid premature abstraction

Extract reusable code when reuse becomes real and meaningful.

### Rule 8 — Keep dependencies predictable

Higher-level application code can use lower-level reusable code, but shared infrastructure should not depend on individual features.

### Rule 9 — Keep business rules explicit

Do not hide important behavior inside unnecessarily generic utilities.

### Rule 10 — Architecture should serve the product

The structure should make Mezgeb easier to build and understand, not make the project impressive through complexity.

---

# 25. Architecture Summary

The Mezgeb frontend follows a pragmatic feature-oriented architecture:

```text
                    App
                     │
                 Routing
                     │
                   Pages
                     │
                 Features
                ↙    ↓    ↘
          Components Hooks  Types
                │      │
                └──┬───┘
                   ↓
             Server State
                   ↓
                API Layer
                   ↓
             Spring Boot API
```

The architecture intentionally balances **learning, maintainability, and production practices**.

The goal is not to build the most sophisticated architecture possible.

The goal is to build an architecture that remains understandable while Mezgeb grows from a React learning project into a complete full-stack application.
