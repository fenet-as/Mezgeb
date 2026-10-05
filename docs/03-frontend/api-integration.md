# API Integration

## 1. Purpose

This document defines how the Mezgeb frontend communicates with the Spring Boot backend.

It covers:

* HTTP communication
* API client structure
* endpoints
* request/response types
* authentication
* errors
* loading states
* queries
* mutations
* data transformation
* caching
* pagination
* API versioning
* development configuration
* testing

The goal is to create a predictable boundary between:

```text id="6p2x9m"
React Application
        ↕
     API Layer
        ↕
Spring Boot Backend
```

---

# 2. Core Principle

React components should not directly contain HTTP requests.

Avoid:

```text id="7m4q1x"
Component
  ↓
fetch(...)
  ↓
Backend
```

Prefer:

```text id="9q3p8v"
Component
    ↓
Feature Hook / Query
    ↓
Feature API Function
    ↓
HTTP Client
    ↓
Spring Boot API
```

This keeps UI code focused on UI and gives API communication a clear home.

---

# 3. API Architecture

The frontend API architecture consists of four main layers:

```text id="4x8m2q"
┌──────────────────────────┐
│ React Components / Pages │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Feature Hooks / Queries  │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Feature API Functions    │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Shared HTTP Client       │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Spring Boot REST API     │
└──────────────────────────┘
```

Each layer has a specific responsibility.

---

# 4. HTTP Client

A shared HTTP client should provide common behavior for API requests.

Location:

```text id="8v5m1q"
src/services/api/client.ts
```

It can centralize:

* base URL
* headers
* authentication handling
* JSON parsing
* common error handling
* request configuration
* response handling
* credentials/cookies configuration

For example:

```text id="2p7x9m"
apiClient.get(...)
apiClient.post(...)
apiClient.put(...)
apiClient.patch(...)
apiClient.delete(...)
```

The exact implementation can use `fetch` initially.

A third-party HTTP library is not required unless it provides a clear benefit.

---

# 5. Base API URL

The backend URL should come from environment configuration.

Example:

```text id="m4q8x2"
VITE_API_URL=http://localhost:8080/api/v1
```

Production can use a different value.

The frontend should not hardcode environment-specific backend URLs throughout the codebase.

---

# 6. API Versioning

The API should use a versioned base path.

Example:

```text id="7x2m9p"
/api/v1
```

Then endpoints become:

```text id="q4p8m1"
/api/v1/auth/login
/api/v1/goals
/api/v1/tasks
/api/v1/sessions
```

Versioning allows the backend API to evolve without unexpectedly breaking older clients.

The exact versioning strategy belongs to the backend API specification.

---

# 7. Feature API Modules

Feature-specific API functions should live near the feature.

Example:

```text id="5m8q2x"
features/
├── auth/
│   └── api/
│       └── authApi.ts
│
├── goals/
│   └── api/
│       └── goalsApi.ts
│
├── tasks/
│   └── api/
│       └── tasksApi.ts
│
├── sessions/
│   └── api/
│       └── sessionsApi.ts
│
└── journal/
    └── api/
        └── journalApi.ts
```

This keeps feature-specific API knowledge close to the feature.

---

# 8. API Function Responsibilities

An API function should describe the backend operation.

For example:

```text id="9x3m7q"
getGoals()
getGoal(goalId)
createGoal(data)
updateGoal(goalId, data)
deleteGoal(goalId)
```

It should not:

* render UI
* display toasts
* manipulate components
* decide navigation
* contain page-specific presentation logic

Its job is communication with the backend.

---

# 9. Example Goal API

Conceptually:

```text id="m6p2x8"
GET    /goals
GET    /goals/:goalId
POST   /goals
PATCH  /goals/:goalId
DELETE /goals/:goalId
```

Frontend API functions:

```text id="q8v3m1"
getGoals()
getGoal(goalId)
createGoal(data)
updateGoal(goalId, data)
deleteGoal(goalId)
```

The exact endpoint names should ultimately match `api-specification.md`.

---

# 10. API Hooks

React-specific data behavior belongs in hooks or TanStack Query definitions.

For example:

```text id="4p7m9x"
useGoals()
useGoal(goalId)
useCreateGoal()
useUpdateGoal()
useDeleteGoal()
```

The separation becomes:

```text id="v2m8q5"
goalsApi.ts
    ↓
HTTP communication

useGoals.ts
    ↓
React/TanStack Query behavior

GoalList.tsx
    ↓
UI
```

---

# 11. Query Example

A conceptual data flow:

```text id="6q1x8m"
GoalList
   ↓
useGoals()
   ↓
getGoals()
   ↓
HTTP client
   ↓
GET /api/v1/goals
   ↓
Spring Boot
   ↓
Response
   ↓
TanStack Query
   ↓
GoalList
```

The component only needs to understand the resulting state.

---

# 12. Query States

API-driven UI should account for:

```text id="3m7p9x"
Loading
Success
Empty
Error
Background Fetching
```

For example:

```text id="x8q2m4"
const {
  data,
  isLoading,
  isFetching,
  error
} = useGoals()
```

The exact TanStack Query API may evolve with the installed version.

---

# 13. Mutation Example

Creating a goal:

```text id="5q9m2x"
CreateGoalForm
      ↓
useCreateGoal()
      ↓
createGoal(data)
      ↓
POST /goals
      ↓
Backend
      ↓
Success
      ↓
Invalidate/refetch goals
```

The UI can then display the newly created goal.

---

# 14. Request Types

Frontend request types should describe what the backend expects.

For example:

```text id="m3x7q8"
CreateGoalRequest
UpdateGoalRequest
CreateTaskRequest
CreateSessionRequest
CreateJournalEntryRequest
```

These should not automatically be identical to database entities.

The frontend should model the API contract, not the backend's internal database structure.

---

# 15. Response Types

Response types describe data returned by the API.

Examples:

```text id="7p2m4x"
Goal
Task
Milestone
LearningSession
JournalEntry
User
Activity
```

Responses may also have dedicated types:

```text id="q8x3m1"
GoalSummary
GoalDetails
PaginatedGoals
DashboardSummary
```

depending on the API design.

---

# 16. Request vs Response Models

Do not assume one type should represent everything.

For example:

```text id="4m9q2x"
CreateGoalRequest
```

might contain:

```text
title
description
startDate
targetDate
```

while:

```text
Goal
```

might contain:

```text
id
title
description
status
progress
createdAt
updatedAt
```

These represent different concepts.

---

# 17. Data Transformation

Sometimes the backend representation and UI representation should differ.

Example:

```text id="8q1m6p"
Backend:
startDate = "2026-10-02"

UI:
Date object / formatted date
```

Transformation should happen at a clear boundary.

Avoid spreading backend-specific conversions throughout components.

---

# 18. Dates and Times

Dates require particular care.

The API contract should explicitly define:

* date format
* datetime format
* timezone behavior
* whether a value represents a local date or an instant

For example:

```text id="2x7m9q"
2026-10-02
```

is different conceptually from:

```text
2026-10-02T14:30:00Z
```

The frontend should not guess timezone behavior.

This should be documented in the backend API contract.

---

# 19. JSON

The initial API communication format should generally be JSON.

Example:

```text id="5q8m3x"
POST /api/v1/goals
Content-Type: application/json
```

Request:

```text
{
  "title": "Learn React",
  "description": "Build projects while learning React"
}
```

Response:

```text
{
  "id": "...",
  "title": "Learn React",
  "status": "ACTIVE"
}
```

The exact schemas belong in `api-specification.md`.

---

# 20. HTTP Methods

Use HTTP methods according to the operation.

Typical mapping:

| Operation      | Method |
| -------------- | ------ |
| Retrieve       | GET    |
| Create         | POST   |
| Replace/update | PUT    |
| Partial update | PATCH  |
| Delete         | DELETE |

The final API should consistently follow the chosen backend convention.

---

# 21. HTTP Status Codes

The frontend should understand common API status codes.

| Status | Meaning                       | Typical frontend behavior         |
| ------ | ----------------------------- | --------------------------------- |
| 200    | Successful request            | Use response                      |
| 201    | Resource created              | Show success/use created resource |
| 204    | Success with no response body | Complete operation                |
| 400    | Bad request                   | Show appropriate error            |
| 401    | Unauthenticated               | Handle session/authentication     |
| 403    | Forbidden                     | Show permission feedback          |
| 404    | Resource not found            | Show not-found state              |
| 409    | Conflict                      | Show conflict message             |
| 422    | Validation failure            | Show validation errors            |
| 429    | Too many requests             | Show retry/rate-limit feedback    |
| 500    | Server error                  | Show server error/recovery        |
| 503    | Service unavailable           | Show temporary failure/retry      |

The exact status-code policy should match the backend API specification.

---

# 22. Error Normalization

Different backend failures should be converted into a predictable frontend error shape.

Conceptually:

```text id="9m4x7q"
API Response
    ↓
HTTP Client
    ↓
AppError
```

For example:

```text
AppError {
  status
  code
  message
  fieldErrors?
}
```

The exact structure should be finalized together with the backend.

This allows UI code to handle errors consistently.

---

# 23. Backend Validation Errors

Suppose creating a goal fails because the title is invalid.

The backend may return structured validation information.

The frontend should map that information to:

```text id="m8q2x5"
Goal title
└── Title is required
```

rather than displaying only:

```text
Something went wrong.
```

When field-level information is available, use it.

---

# 24. Authentication Errors

Authentication errors follow the authentication architecture.

For example:

```text id="x7m3q9"
401
 ↓
HTTP client/auth layer
 ↓
Authentication state updated
 ↓
Login flow
```

Do not make every feature independently implement `401` handling.

---

# 25. Authorization Errors

A `403` response should remain distinct from `401`.

Example:

```text id="p5q8m2"
Authenticated
     ↓
Forbidden action
     ↓
403
     ↓
Permission feedback
```

The frontend should not automatically log the user out.

---

# 26. Not Found

Resource-specific `404` responses should be handled differently from unknown application routes.

For example:

```text id="8m2x6q"
GET /goals/123
        ↓
404
        ↓
GoalNotFound / ErrorState
```

while:

```text
/app/something-that-does-not-exist
```

should be handled by the frontend's route-level NotFoundPage.

---

# 27. Network Errors

Sometimes the request never reaches the backend.

Possible causes:

* no internet connection
* backend unavailable
* DNS failure
* CORS/configuration problem
* request timeout

The frontend should distinguish these from a valid HTTP error where practical.

Example:

```text id="4q9m1x"
Unable to connect to Mezgeb.

[Try again]
```

---

# 28. Request Cancellation

Requests should be cancellable when appropriate.

This is particularly useful when:

* navigating away
* changing search terms
* changing filters
* unmounting components

The underlying HTTP mechanism can use `AbortController` where appropriate.

TanStack Query can also coordinate request lifecycle behavior.

---

# 29. Search and Debouncing

When search is introduced:

```text id="7x3m8q"
User types
   ↓
R
   ↓
Re
   ↓
Rea
   ↓
React
```

The frontend should avoid sending a request for every keystroke when unnecessary.

A typical approach is:

```text
Input
 ↓
Debounce
 ↓
Query
 ↓
API
```

Search state should generally be represented in the URL when it needs to be shareable/bookmarkable.

Search is post-MVP, so this behavior can be introduced later.

---

# 30. Pagination

Large collections should eventually support pagination.

Example:

```text id="2m8q5x"
/goals?page=2&limit=20
```

The frontend should represent pagination as server state.

Potential response:

```text
{
  "items": [...],
  "page": 2,
  "pageSize": 20,
  "totalItems": 100,
  "totalPages": 5
}
```

The exact response shape should be defined by the API contract.

---

# 31. URL State and API Requests

Search, filtering, sorting, and pagination should generally be reflected in the URL when they are meaningful navigation state.

For example:

```text id="6p9m3x"
/app/goals?status=ACTIVE&page=2
```

Then:

```text
URL
 ↓
React Router
 ↓
Query parameters
 ↓
TanStack Query key
 ↓
API request
```

This keeps the URL, UI, and server request synchronized.

---

# 32. Query Keys

TanStack Query keys should uniquely represent the requested server data.

Examples:

```text id="4x8m1q"
["goals"]

["goals", goalId]

["goals", { status, page }]

["journal", { page, search }]
```

If query parameters affect the response, they should generally be represented in the query key.

---

# 33. Cache Invalidation

After a mutation, related server state may become stale.

Example:

```text id="8q2m7x"
Create Goal
   ↓
POST /goals
   ↓
Success
   ↓
Invalidate ["goals"]
   ↓
Goals query refreshes
```

For MVP, explicit invalidation is preferred over complicated manual cache manipulation.

---

# 34. Related Query Invalidation

Some actions affect multiple views.

For example, completing a task could affect:

```text id="5m9x2q"
Task list
Goal progress
Dashboard statistics
Recent activity
```

The mutation should invalidate or update the relevant queries.

The exact query relationships should remain understandable rather than creating an overly complex cache system.

---

# 35. Optimistic Updates

Optimistic updates mean updating the UI before the backend confirms success.

Example:

```text id="q7m3x8"
Complete Task
   ↓
Immediately show completed
   ↓
Send API request
   ↓
Backend confirms
```

This can make interactions feel faster.

However, it introduces rollback and synchronization complexity.

For Mezgeb:

> Start with normal server-confirmed mutations.

Introduce optimistic updates only where the UX benefit clearly justifies the added complexity.

---

# 36. Duplicate Requests

The API layer should avoid unnecessary duplicate requests.

TanStack Query can help with request deduplication and caching.

Components should not independently request the same resource simply because they both need it.

---

# 37. Retry Behavior

Not every request should be retried automatically.

Retry can make sense for temporary failures.

It may be inappropriate for:

* validation errors
* authentication failures
* authorization failures
* not-found responses
* certain mutations

Retry behavior should be conservative and predictable.

---

# 38. API Security Responsibilities

The frontend must never assume that hiding a UI control provides security.

For example:

```text id="m4q8x2"
Hide Delete button
```

does not prevent:

```text
DELETE /api/v1/goals/123
```

from being manually requested.

The backend must verify:

* authentication
* ownership
* authorization
* validation
* data integrity

The frontend provides UX; the backend enforces security.

---

# 39. CORS

During development, the frontend and backend may run on different origins.

For example:

```text id="7p2m9x"
Frontend
http://localhost:5173

Backend
http://localhost:8080
```

The backend must be configured to allow the frontend origin according to the authentication and deployment strategy.

CORS configuration belongs primarily to the backend.

The frontend should not attempt to solve a backend CORS configuration problem through application logic.

---

# 40. Development Proxy

Vite can optionally proxy API requests during development.

For example:

```text id="x9m3q7"
/api/v1/goals
      ↓
Vite dev server
      ↓
Spring Boot
```

This can simplify local development and avoid some cross-origin development complexity.

The production architecture may differ.

---

# 41. Environment Configuration

Frontend environment configuration should be centralized.

Example:

```text id="5q2m8x"
VITE_API_URL
VITE_APP_NAME
VITE_APP_ENV
```

Access should go through:

```text
src/config/env.ts
```

rather than directly reading `import.meta.env` throughout the application.

---

# 42. Never Put Secrets in Vite Environment Variables

Frontend environment variables are bundled into client-side code.

Therefore, they should never contain:

* database passwords
* private API keys
* JWT signing secrets
* backend credentials
* other server-only secrets

A value beginning with:

```text
VITE_
```

should be considered potentially public.

---

# 43. API Documentation

The backend should provide a clear API contract.

The frontend API integration should eventually reference:

```text
docs/04-backend/api-specification.md
```

That document should define:

* endpoints
* HTTP methods
* authentication requirements
* request schemas
* response schemas
* status codes
* error formats
* pagination
* filtering
* sorting
* date/time formats

OpenAPI/Swagger can later provide machine-readable API documentation.

---

# 44. API Contract Ownership

The API is a contract between frontend and backend.

When an endpoint changes, both sides need to be considered.

For example:

```text id="9x4m7q"
Backend changes:
POST /goals
```

Before updating the frontend, determine:

* what changed
* why it changed
* which frontend code depends on it
* whether the change is backward compatible

API changes should not be silently guessed around.

---

# 45. Type Synchronization

Frontend TypeScript types should remain aligned with the API contract.

For example:

```text id="2q8m5x"
Backend:
status = "ACTIVE"

Frontend:
type GoalStatus =
  | "PLANNED"
  | "ACTIVE"
  | "COMPLETED"
  | "ARCHIVED"
```

If the backend introduces a new status, the frontend type and UI behavior may need to change.

This is one reason API contracts should be documented clearly.

---

# 46. Runtime Validation

TypeScript provides compile-time guarantees, but API responses are runtime data.

For important boundaries, runtime validation can be introduced using Zod.

Conceptually:

```text id="6m3x9q"
Backend JSON
    ↓
Zod schema
    ↓
Validated data
    ↓
Application
```

This is especially useful when:

* APIs evolve independently
* external data is involved
* response correctness is critical

It does not need to be added to every endpoint immediately.

---

# 47. API Layer Testing

API functions can be tested independently from UI components.

Tests can verify:

* correct HTTP method
* correct URL
* request body
* query parameters
* response parsing
* error handling

For example:

```text id="8q4m2x"
createGoal(data)
    ↓
POST /api/v1/goals
    ↓
JSON body
```

The exact testing approach can use mocked HTTP requests.

---

# 48. Integration Testing

Integration tests should verify that multiple layers work together.

Example:

```text id="m7x2q9"
Goal Form
   ↓
Mutation
   ↓
API function
   ↓
Mock backend
   ↓
Success
   ↓
UI updates
```

This is more representative of real application behavior than testing each function in isolation.

---

# 49. API Mocking

During frontend development, the backend may not always be available.

A mock API layer can help frontend development continue.

Possible approaches include:

* MSW (Mock Service Worker)
* controlled test mocks
* a local development backend

If mocking is introduced, mocks should reflect the documented API contract rather than inventing a separate API.

---

# 50. Feature API Example

A goal feature may eventually look conceptually like:

```text id="3q8m1x"
features/goals/
├── api/
│   └── goalsApi.ts
├── hooks/
│   ├── useGoals.ts
│   ├── useGoal.ts
│   ├── useCreateGoal.ts
│   └── useUpdateGoal.ts
├── components/
├── schemas/
├── types.ts
└── ...
```

The exact folder structure can evolve.

The important boundary is:

```text id="7m4p9q"
UI
 ↓
React Query / Hook
 ↓
API Function
 ↓
HTTP Client
 ↓
Backend
```

---

# 51. Complete Goal Creation Example

The complete flow looks like:

```text id="5x9q2m"
User fills Create Goal form
          ↓
React Hook Form
          ↓
Zod validation
          ↓
useCreateGoal()
          ↓
createGoal(request)
          ↓
HTTP client
          ↓
POST /api/v1/goals
          ↓
Spring Boot
          ↓
Validate + authorize
          ↓
Create database record
          ↓
201 Created
          ↓
Frontend receives Goal
          ↓
Invalidate goals query
          ↓
UI updates
```

If something fails:

```text id="8m3q7x"
Backend error
      ↓
HTTP client
      ↓
Normalized AppError
      ↓
Mutation state
      ↓
Form/page feedback
      ↓
User can recover
```

---

# 52. API Integration Rules

1. React components should not directly perform arbitrary HTTP requests.
2. Use a shared HTTP client for common request behavior.
3. Keep feature-specific API functions near their features.
4. Keep API functions separate from React-specific query logic.
5. Use TanStack Query for server state.
6. Keep backend data as the source of truth.
7. Define request and response types explicitly.
8. Do not model API types directly from database entities without considering the API contract.
9. Normalize API errors into a predictable frontend shape.
10. Handle `401` and `403` differently.
11. Keep authentication behavior centralized.
12. Represent relevant query parameters in query keys.
13. Invalidate related queries after mutations.
14. Start with straightforward server-confirmed mutations.
15. Avoid unnecessary duplicate requests.
16. Use conservative retry behavior.
17. Centralize environment configuration.
18. Never put secrets in frontend environment variables.
19. Do not treat frontend route protection as security.
20. Keep the API contract documented and synchronized with the backend.
21. Add runtime response validation where it provides meaningful value.
22. Test API behavior independently and through integration tests.
23. Prefer simple abstractions until the application demonstrates a real need for more complexity.

---

# 53. API Integration Mental Model

The entire architecture can be remembered as:

```text id="q2m7x4"
             USER
               │
               ▼
        React Components
               │
               ▼
       React Hook / Query
               │
               ▼
        Feature API Function
               │
               ▼
          HTTP Client
               │
               ▼
        Spring Boot REST API
               │
               ▼
       Authentication /
       Authorization /
          Validation
               │
               ▼
           Database
```

And data comes back through the same boundary:

```text id="m8q3x7"
Database
   ↓
Spring Boot
   ↓
HTTP Response
   ↓
HTTP Client
   ↓
TanStack Query
   ↓
React
   ↓
User
```

The central principle is:

> **Keep the API boundary explicit: components handle presentation, hooks handle React/server-state behavior, API functions handle backend operations, and the HTTP client handles shared communication concerns.**
