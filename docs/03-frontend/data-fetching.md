# Data Fetching

## 1. Purpose

This document defines how the Mezgeb frontend retrieves, creates, updates, and deletes data from the backend.

The goal is to make data fetching:

* predictable
* reusable
* type-safe
* easy to test
* easy to debug
* efficient without unnecessary complexity
* consistent across features

The frontend should treat backend data as **server state**, not as ordinary local React state.

---

## 2. Core Principle

Mezgeb follows this data flow:

```text
React Component
      ↓
Feature Hook / Query
      ↓
API Function
      ↓
HTTP Client
      ↓
Spring Boot API
      ↓
Database
```

For example:

```text
GoalsPage
   ↓
useGoals()
   ↓
getGoals()
   ↓
apiClient.get("/goals")
   ↓
GET /api/v1/goals
```

Components should generally **not make raw HTTP requests directly**.

---

## 3. HTTP Client Boundary

All HTTP communication should go through a shared HTTP client.

Example conceptual structure:

```text
services/
└── api/
    ├── client.ts
    └── ...
```

`client.ts` is responsible for common HTTP behavior such as:

* base API URL
* headers
* authentication information
* JSON handling
* common error handling
* request configuration
* request cancellation

Feature-specific API functions should use this client instead of duplicating request configuration.

Example:

```text
features/
└── goals/
    ├── api.ts
    ├── hooks.ts
    ├── components/
    └── types.ts
```

The goal API might contain:

```text
getGoals()
getGoal(id)
createGoal(data)
updateGoal(id, data)
deleteGoal(id)
```

---

## 4. API Functions vs React Hooks

These responsibilities should remain separate.

### API functions

API functions know **how to communicate with the backend**.

```text
getGoals()
createGoal()
updateGoal()
deleteGoal()
```

They should not know about React components.

### React hooks

Hooks connect API functions to React and server-state management.

```text
useGoals()
useGoal(id)
useCreateGoal()
useUpdateGoal()
useDeleteGoal()
```

This separation gives us:

```text
UI
 ↓
Hook
 ↓
API Function
 ↓
HTTP Client
 ↓
Backend
```

This makes the system easier to test and maintain.

---

# 5. TanStack Query

Mezgeb will use **TanStack Query** for server-state management.

It handles concerns such as:

* fetching
* caching
* stale data
* refetching
* loading states
* errors
* mutations
* query invalidation
* request deduplication
* background updates

Without a server-state library, we would repeatedly need to manage:

```text
loading
error
data
refetch
cache
synchronization
```

manually.

TanStack Query centralizes these concerns.

---

# 6. Queries

A **query** retrieves data.

Examples:

```text
GET /goals
GET /goals/:id
GET /journal
GET /journal/:id
GET /progress
```

Conceptually:

```text
useGoals()
     ↓
getGoals()
     ↓
GET /goals
```

A query should have a stable **query key**.

Example:

```text
["goals"]
```

For a specific goal:

```text
["goals", goalId]
```

For journal entries filtered by goal:

```text
["journal", { goalId, page }]
```

The query key identifies the data being requested.

---

# 7. Query Key Conventions

Query keys should be:

* predictable
* consistent
* specific enough to identify the data
* structured rather than arbitrary strings

Example:

```text
["goals"]
["goals", goalId]
["goals", { status: "ACTIVE" }]
["journal"]
["journal", entryId]
["progress"]
```

A query key should contain values that affect the returned data.

For example, these should represent different queries:

```text
["journal", { page: 1 }]
["journal", { page: 2 }]
```

because they request different pages.

---

# 8. Query Lifecycle

A typical query follows this lifecycle:

```text
Component renders
      ↓
Query executes
      ↓
Loading state
      ↓
Request sent
      ↓
Backend responds
      ↓
Success / Error
      ↓
Data cached
      ↓
Component renders with data
```

The UI should explicitly handle these states.

```text
Loading
Success
Empty
Error
```

These are different states and should not be treated as the same thing.

---

# 9. Loading States

A query may be loading for the first time:

```text
No data yet
    ↓
Request running
    ↓
Show skeleton/loading UI
```

For example, when opening the Goals page for the first time:

```text
GoalsPage
   ↓
Loading skeleton
   ↓
Goals loaded
   ↓
Goal cards
```

We should avoid displaying an empty-state message such as:

> "You have no goals."

while the request is still loading.

That would incorrectly suggest that the user has no goals.

---

# 10. Empty States

A successful request can still return no data.

Example:

```text
Request succeeded
      ↓
goals = []
      ↓
Show empty state
```

For example:

> No learning goals yet. Create your first goal to get started.

This is different from:

```text
Request failed
```

and different from:

```text
Request still loading
```

---

# 11. Error States

If the request fails, the UI should show an appropriate error state.

Example:

```text
GET /goals
     ↓
Request fails
     ↓
ErrorState
```

The UI should provide a useful recovery action when possible:

```text
Unable to load your goals.

[Try again]
```

Errors should not expose raw backend errors or technical implementation details to users.

---

# 12. Stale Data and Caching

TanStack Query caches server data.

A cached result can be reused instead of immediately making another request.

Two important concepts are:

### `staleTime`

How long data is considered fresh.

Conceptually:

```text
Fresh → no need to refetch immediately
Stale → may be refetched
```

### `gcTime`

How long unused cached data remains available before being garbage collected.

These values should be chosen based on the type of data rather than blindly applying the same aggressive settings everywhere.

For example:

* current user's goals may remain fresh for a short period
* relatively stable profile information may remain fresh longer
* progress information may become stale after task/session changes

Exact values can be adjusted during implementation based on actual application behavior.

---

# 13. Mutations

A **mutation** changes server data.

Examples:

```text
POST   /goals
PATCH  /goals/:id
DELETE /goals/:id

POST   /tasks
PATCH  /tasks/:id

POST   /sessions
POST   /journal
```

Typical flow:

```text
User action
    ↓
Mutation
    ↓
API request
    ↓
Backend changes data
    ↓
Mutation succeeds
    ↓
Relevant queries updated/invalidate
    ↓
UI shows current data
```

---

# 14. Query Invalidation

After changing server data, related cached queries may no longer represent the latest backend state.

Example:

```text
Create Goal
    ↓
POST /goals
    ↓
Success
    ↓
Invalidate ["goals"]
    ↓
Goals query refetches
```

Similarly:

```text
Complete Task
    ↓
PATCH /tasks/:id
    ↓
Success
    ↓
Invalidate relevant task/goal/progress queries
```

A task completion could affect:

```text
["goals"]
["goals", goalId]
["progress"]
```

The exact invalidation strategy should match the data relationships.

---

# 15. Updating Cached Data

Invalidation is the simplest default strategy.

However, sometimes the returned mutation response already contains the updated resource.

For example:

```text
PATCH /goals/:id
       ↓
Updated Goal returned
```

The frontend may update the corresponding cached query directly.

This can avoid an unnecessary request.

However, Mezgeb should prefer **simple invalidation first**.

Direct cache manipulation should be introduced when there is a clear benefit and the behavior remains easy to understand.

---

# 16. Optimistic Updates

An optimistic update changes the UI before the backend confirms the request.

Example:

```text
User checks task
      ↓
UI immediately shows completed
      ↓
Request sent
      ↓
Backend confirms
```

This can make interactions feel faster.

However, optimistic updates introduce additional complexity:

* rollback
* failed requests
* stale data
* cache synchronization

Therefore:

> Mezgeb will not use optimistic updates by default.

They can be introduced later for interactions where the UX benefit clearly justifies the additional complexity.

---

# 17. Dependent Queries

Sometimes one request depends on another.

Example:

```text
Get Goal
   ↓
Get Goal's milestones
```

or:

```text
Get authenticated user
   ↓
Load user-specific data
```

A dependent query should only execute when its required information exists.

Conceptually:

```text
goalId exists
    ↓
fetch goal
    ↓
fetch dependent data
```

The frontend should avoid sending requests with incomplete identifiers.

---

# 18. Parallel Queries

Some pieces of data do not depend on each other.

For example, the dashboard might need:

```text
Active Goals
Recent Sessions
Recent Activity
Progress Summary
```

These can potentially be requested independently rather than waiting for one request to finish before starting another.

Conceptually:

```text
Dashboard
 ├── Goals query
 ├── Sessions query
 ├── Activity query
 └── Progress query
```

TanStack Query can manage these independently.

The UI should still define what happens when one request fails while others succeed.

---

# 19. Pagination

Large collections should not necessarily be loaded all at once.

Potential paginated resources include:

* journal entries
* activity history
* tasks
* sessions

A request could look conceptually like:

```text
GET /journal?page=2&limit=20
```

Pagination state belongs naturally in the URL when it represents navigable user state.

Example:

```text
/journal?page=2
```

The backend should define the pagination contract, including:

* page/index
* page size
* total items
* total pages
* next/previous information where appropriate

---

# 20. Search, Filtering, and Sorting

Search and filtering are server-state concerns when the backend performs the filtering.

Examples:

```text
/journal?search=react
/journal?goalId=123
/goals?status=ACTIVE
```

These values should generally live in the URL when they are useful to preserve, share, bookmark, or navigate with.

The data flow becomes:

```text
URL state
    ↓
Query parameters
    ↓
TanStack Query key
    ↓
API request
    ↓
Filtered backend response
```

For example:

```text
["journal", { search, goalId, page }]
```

---

# 21. Avoiding Duplicate Fetching

The application should avoid unnecessary requests.

Common causes include:

* fetching the same data in multiple components independently
* incorrect query keys
* unnecessary effects
* manually refetching after every render
* duplicating server state in local state

TanStack Query should be the primary source for server data.

Components should consume the existing query rather than creating their own independent copy of the same server state.

---

# 22. Request Cancellation

Some requests may become unnecessary.

For example:

```text
User searches:
"rea"
"reac"
"react"
```

If requests are being made while the user types, older requests may become irrelevant.

Request cancellation and/or debouncing can prevent unnecessary work.

For search inputs:

```text
User types
    ↓
Debounce
    ↓
Send request
    ↓
Return results
```

Search behavior will be introduced when search becomes part of the product scope.

---

# 23. Authentication and Requests

Authenticated API requests may require authentication credentials.

The shared HTTP client should be responsible for common authentication-related request behavior.

Conceptually:

```text
Feature API function
       ↓
HTTP client
       ↓
Attach authentication information
       ↓
Backend
```

Authentication details belong primarily in:

```text
03-frontend/authentication.md
```

The data-fetching layer should not duplicate authentication logic throughout individual API functions.

---

# 24. Response Types

API responses should have TypeScript types.

Example:

```text
Goal
Milestone
Task
LearningSession
JournalEntry
ProgressSummary
```

Feature-specific types should generally remain inside their feature.

For example:

```text
features/
└── goals/
    ├── api.ts
    ├── hooks.ts
    └── types.ts
```

Only genuinely shared types should be placed in:

```text
src/types/
```

---

# 25. Runtime Validation

TypeScript types protect the frontend during development, but they do not validate actual runtime data received from the backend.

Where useful, Zod can validate important external data.

Conceptually:

```text
Backend response
      ↓
Runtime validation
      ↓
Typed application data
```

This is especially useful for:

* authentication responses
* important API contracts
* external data
* complex responses

However, validation should be introduced where it provides meaningful protection rather than wrapping every trivial response unnecessarily.

---

# 26. Example: Loading Goals

A typical Goals page flow:

```text
GoalsPage
    ↓
useGoals()
    ↓
TanStack Query
    ↓
getGoals()
    ↓
HTTP Client
    ↓
GET /api/v1/goals
    ↓
Spring Boot
    ↓
PostgreSQL
```

Possible UI states:

```text
Loading
   ↓
Skeleton

Success + goals
   ↓
Goal cards

Success + no goals
   ↓
Empty state

Error
   ↓
Error state + retry
```

---

# 27. Example: Creating a Goal

```text
CreateGoalForm
      ↓
useCreateGoal()
      ↓
createGoal(data)
      ↓
POST /api/v1/goals
      ↓
Backend
      ↓
Success
      ↓
Invalidate ["goals"]
      ↓
Goals list updates
```

The form should manage its own input state.

The mutation should manage the server operation.

The Goals query should manage the resulting server data.

These are separate responsibilities.

---

# 28. Example: Completing a Task

```text
Task checkbox
      ↓
useCompleteTask()
      ↓
PATCH /tasks/:id
      ↓
Backend
      ↓
Success
      ↓
Invalidate:
  ["goals", goalId]
  ["progress"]
  relevant task query
      ↓
UI refreshes from server state
```

This ensures that completing a task can update related progress without manually maintaining several duplicated pieces of state.

---

# 29. Error Handling Strategy

Errors should be handled at the appropriate level.

### API layer

Understand the HTTP response and convert it into a predictable error representation.

### Query/mutation layer

Expose the request state:

```text
isPending
isError
error
data
```

### UI layer

Decide how the user should experience the error.

For example:

```text
Form submission failure
→ show form-level error

Page loading failure
→ show ErrorState

Minor action failure
→ show toast/feedback
```

Not every error should produce the same UI.

---

# 30. Retries

Automatic retries can be useful for temporary network failures.

However, not every error should be retried.

For example:

```text
Temporary network problem
→ retry may make sense

Invalid request
→ retry does not fix the problem

Unauthorized request
→ retrying repeatedly is unnecessary
```

Retry behavior should therefore be configured deliberately rather than blindly retrying every failed request.

---

# 31. Data Fetching Rules

Mezgeb follows these rules:

1. Components should not make raw HTTP requests.
2. All requests go through the shared HTTP client.
3. API functions handle backend communication.
4. Hooks connect API functions to React/TanStack Query.
5. TanStack Query owns server-state caching and synchronization.
6. Query keys must be consistent and meaningful.
7. URL state should represent navigable filters/search/pagination where appropriate.
8. Loading, empty, success, and error states must be handled explicitly.
9. Mutations should update or invalidate affected queries.
10. Start with straightforward invalidation before optimizing cache updates.
11. Avoid duplicating server state in local React state.
12. Avoid unnecessary manual refetching.
13. Use optimistic updates only when their complexity is justified.
14. Use pagination for potentially large collections.
15. Keep authentication behavior centralized.
16. Keep feature-specific API code inside the relevant feature.
17. Validate important external responses when runtime validation provides value.
18. Keep data fetching predictable and easy to test.

---

# 32. Mezgeb Data-Fetching Mental Model

The main mental model is:

```text
                SERVER
                  │
                  ▼
             Spring Boot API
                  │
                  ▼
             HTTP Client
                  │
                  ▼
          API Functions
                  │
                  ▼
           TanStack Query
                  │
                  ▼
        React Components
                  │
                  ▼
                  UI
```

For reads:

```text
Component
   → Query
   → API
   → Backend
   → Cache
   → UI
```

For writes:

```text
User action
   → Mutation
   → API
   → Backend
   → Update/Invalidate Query
   → UI
```

The key principle is:

> **The backend is the source of truth for persistent learning data; TanStack Query is the frontend's manager for that server state.**
