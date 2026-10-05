# API Specification

## 1. Purpose

This document defines the REST API conventions and initial endpoint contract for Mezgeb.

It establishes:

* API versioning
* URL conventions
* HTTP methods
* request and response formats
* resource naming
* status codes
* pagination
* filtering
* validation errors
* authentication requirements
* ownership rules
* endpoint organization

The API should provide a predictable contract between the frontend and backend.

---

# 2. API Base URL

All application endpoints use the versioned prefix:

```text
/api/v1
```

Example:

```text
/api/v1/goals
```

In development, the complete URL may look like:

```text
http://localhost:8080/api/v1/goals
```

The frontend should obtain the backend base URL from environment configuration rather than hardcoding it throughout the application.

---

# 3. API Format

The primary API format is JSON.

Requests:

```http
Content-Type: application/json
```

Responses:

```http
Content-Type: application/json
```

Unless an endpoint explicitly requires another format, JSON should be used.

---

# 4. API Design Principles

The API should be:

* predictable
* resource-oriented
* consistent
* explicit
* secure
* versioned
* easy for the frontend to consume
* easy to document
* easy to test

The same operation should follow the same conventions across different resources.

---

# 5. Resource Naming

Use plural nouns for collections.

```text
/goals
/tasks
/milestones
/sessions
/journal
```

Avoid action-oriented collection names such as:

```text
/getGoals
/createGoal
/fetchTasks
```

HTTP methods communicate the operation.

---

# 6. HTTP Methods

Use standard HTTP methods.

| Method | Purpose                                                         |
| ------ | --------------------------------------------------------------- |
| GET    | Retrieve data                                                   |
| POST   | Create a resource or trigger a non-idempotent operation         |
| PATCH  | Partially update a resource                                     |
| PUT    | Replace a resource when full replacement semantics are required |
| DELETE | Remove a resource                                               |

For Mezgeb, `PATCH` will generally be preferred for partial updates.

---

# 7. Basic CRUD Pattern

For a resource such as goals:

```text
GET    /api/v1/goals
GET    /api/v1/goals/{goalId}
POST   /api/v1/goals
PATCH  /api/v1/goals/{goalId}
DELETE /api/v1/goals/{goalId}
```

This pattern should be reused where appropriate.

---

# 8. Authentication Endpoints

Initial authentication endpoints:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

Possible future endpoints:

```text
POST /api/v1/auth/refresh
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
POST /api/v1/auth/verify-email
```

Future endpoints should only be added when the corresponding product feature exists.

---

# 9. User Endpoints

Initial user endpoints:

```text
GET   /api/v1/users/me
PATCH /api/v1/users/me
```

The API should use `/me` for operations involving the currently authenticated user.

The client should not need to send its own user ID for these operations.

---

# 10. Goal Endpoints

Core goal endpoints:

```text
GET    /api/v1/goals
POST   /api/v1/goals
GET    /api/v1/goals/{goalId}
PATCH  /api/v1/goals/{goalId}
DELETE /api/v1/goals/{goalId}
```

Potential future operations:

```text
POST /api/v1/goals/{goalId}/archive
POST /api/v1/goals/{goalId}/restore
```

However, status updates may initially be handled through:

```text
PATCH /api/v1/goals/{goalId}
```

For example:

```json
{
  "status": "ARCHIVED"
}
```

---

# 11. Goal Creation

Endpoint:

```http
POST /api/v1/goals
```

Example request:

```json
{
  "title": "Learn React",
  "description": "Rebuild my React fundamentals",
  "status": "ACTIVE",
  "startDate": "2026-10-05",
  "targetDate": "2026-11-30"
}
```

Possible response:

```http
201 Created
```

```json
{
  "id": "goal-123",
  "title": "Learn React",
  "description": "Rebuild my React fundamentals",
  "status": "ACTIVE",
  "startDate": "2026-10-05",
  "targetDate": "2026-11-30",
  "progress": 0,
  "createdAt": "2026-10-05T10:30:00Z",
  "updatedAt": "2026-10-05T10:30:00Z"
}
```

The exact ID format will be finalized during database design.

---

# 12. Goal Retrieval

Collection:

```http
GET /api/v1/goals
```

Single resource:

```http
GET /api/v1/goals/{goalId}
```

A goal response may contain:

* goal information
* status
* dates
* progress
* timestamps

The detailed goal endpoint may eventually include related information such as:

* milestones
* tasks
* sessions
* recent journal entries

The API should avoid returning unnecessarily large responses.

---

# 13. Goal Update

Endpoint:

```http
PATCH /api/v1/goals/{goalId}
```

Example:

```json
{
  "title": "Learn React + TypeScript",
  "description": "Study React fundamentals and TypeScript",
  "status": "ACTIVE"
}
```

Only supplied fields are changed.

---

# 14. Goal Deletion

Endpoint:

```http
DELETE /api/v1/goals/{goalId}
```

Possible response:

```http
204 No Content
```

Deletion behavior must be explicitly defined because a goal may have:

* milestones
* tasks
* sessions
* journal references
* activity

The database design must establish whether these related records are deleted, archived, or preserved.

---

# 15. Milestone Endpoints

Core endpoints:

```text
GET    /api/v1/goals/{goalId}/milestones
POST   /api/v1/goals/{goalId}/milestones
GET    /api/v1/milestones/{milestoneId}
PATCH  /api/v1/milestones/{milestoneId}
DELETE /api/v1/milestones/{milestoneId}
```

Milestones belong to goals.

Using the goal path for creation makes the relationship explicit:

```text
POST /goals/{goalId}/milestones
```

---

# 16. Milestone Creation

Example:

```http
POST /api/v1/goals/{goalId}/milestones
```

Request:

```json
{
  "title": "React Fundamentals",
  "description": "Learn components, props, state, and effects",
  "position": 1
}
```

The backend must verify that the authenticated user owns the specified goal.

---

# 17. Milestone Ordering

Milestones may have an explicit ordering value:

```text
position
```

For example:

```text
1 → React Fundamentals
2 → State Management
3 → Forms
4 → Advanced Patterns
```

If ordering is supported, the API should provide a predictable way to update it.

Possible future endpoint:

```text
PATCH /api/v1/goals/{goalId}/milestones/reorder
```

This can remain deferred until the UI requires drag-and-drop or explicit ordering.

---

# 18. Task Endpoints

Core endpoints:

```text
GET    /api/v1/milestones/{milestoneId}/tasks
POST   /api/v1/milestones/{milestoneId}/tasks
GET    /api/v1/tasks/{taskId}
PATCH  /api/v1/tasks/{taskId}
DELETE /api/v1/tasks/{taskId}
```

Tasks belong to milestones.

---

# 19. Task Creation

Example:

```http
POST /api/v1/milestones/{milestoneId}/tasks
```

Request:

```json
{
  "title": "Learn useEffect",
  "description": "Understand effects and cleanup",
  "status": "TODO"
}
```

The backend should verify:

1. the milestone exists
2. the milestone belongs to a goal
3. the goal belongs to the authenticated user

---

# 20. Task Completion

Task completion can initially use:

```http
PATCH /api/v1/tasks/{taskId}
```

Request:

```json
{
  "status": "COMPLETED"
}
```

A dedicated action endpoint may be introduced if task state transitions become more complex:

```text
POST /api/v1/tasks/{taskId}/complete
```

The initial implementation should prefer the simpler approach unless business rules require explicit commands.

---

# 21. Task Reopening

A completed task can potentially be reopened:

```http
PATCH /api/v1/tasks/{taskId}
```

```json
{
  "status": "TODO"
}
```

The backend should validate whether the state transition is allowed.

---

# 22. Learning Session Endpoints

Core endpoints:

```text
GET    /api/v1/sessions
POST   /api/v1/sessions
GET    /api/v1/sessions/{sessionId}
PATCH  /api/v1/sessions/{sessionId}
DELETE /api/v1/sessions/{sessionId}
```

Sessions represent actual learning activity.

---

# 23. Learning Session Creation

Example:

```http
POST /api/v1/sessions
```

Request:

```json
{
  "goalId": "goal-123",
  "milestoneId": "milestone-456",
  "date": "2026-10-05",
  "durationMinutes": 90,
  "topic": "React useEffect",
  "description": "Studied effect lifecycle and cleanup",
  "reflection": "I finally understand why effects should synchronize with external systems."
}
```

The milestone can be optional if the product allows sessions to belong only to a goal.

---

# 24. Learning Session Retrieval

All sessions:

```http
GET /api/v1/sessions
```

Potential filters:

```text
GET /api/v1/sessions?goalId=goal-123
```

Future filters may include:

```text
startDate
endDate
```

The API should support pagination if the collection becomes large.

---

# 25. Journal Endpoints

Core endpoints:

```text
GET    /api/v1/journal
POST   /api/v1/journal
GET    /api/v1/journal/{entryId}
PATCH  /api/v1/journal/{entryId}
DELETE /api/v1/journal/{entryId}
```

Journal entries belong to the authenticated user.

They may optionally reference:

* a goal
* a milestone

---

# 26. Journal Entry Creation

Example:

```http
POST /api/v1/journal
```

Request:

```json
{
  "title": "Understanding React Effects",
  "content": "Today I finally understood...",
  "date": "2026-10-05",
  "goalId": "goal-123",
  "milestoneId": "milestone-456",
  "tags": [
    "react",
    "hooks"
  ]
}
```

The exact journal content representation may evolve if richer editing is introduced.

---

# 27. Journal Entry Retrieval

Collection:

```http
GET /api/v1/journal
```

Single entry:

```http
GET /api/v1/journal/{entryId}
```

Possible future filtering:

```text
GET /api/v1/journal?goalId=goal-123
GET /api/v1/journal?tag=react
GET /api/v1/journal?search=effects
```

Search and advanced filtering are not required for the initial MVP.

---

# 28. Progress Endpoints

Progress is a read-oriented domain.

Possible endpoint:

```http
GET /api/v1/progress
```

Goal-specific progress:

```http
GET /api/v1/goals/{goalId}/progress
```

The response may include:

```json
{
  "goalId": "goal-123",
  "taskProgress": 40,
  "completedTasks": 2,
  "totalTasks": 5,
  "learningTimeMinutes": 320,
  "sessionCount": 4
}
```

The exact response will be finalized after the progress calculation rules are defined.

---

# 29. Dashboard Endpoint

The dashboard needs information from several domains.

Rather than forcing the frontend to make many independent requests immediately, a dedicated endpoint may provide dashboard-specific aggregated data:

```http
GET /api/v1/dashboard
```

Possible response sections:

```json
{
  "overview": {},
  "activeGoals": [],
  "recentActivity": [],
  "recentSessions": [],
  "studyTime": {},
  "streak": {}
}
```

This endpoint is presentation-supporting rather than a replacement for the underlying domain APIs.

---

# 30. Activity Endpoint

Possible endpoint:

```http
GET /api/v1/activity
```

Potential filters:

```text
GET /api/v1/activity?goalId=goal-123
```

Activity is primarily read-oriented from the user's perspective.

Activity records are generally created by backend use cases rather than directly by users.

---

# 31. Settings Endpoints

User settings may use:

```text
GET   /api/v1/users/me
PATCH /api/v1/users/me
```

If settings become complex enough, a dedicated endpoint can be introduced:

```text
GET   /api/v1/settings
PATCH /api/v1/settings
```

The MVP should avoid unnecessary endpoints.

---

# 32. Query Parameters

Query parameters should be used for collection operations such as:

* filtering
* sorting
* searching
* pagination

Example:

```text
/api/v1/goals?status=ACTIVE
```

Multiple filters:

```text
/api/v1/sessions?goalId=goal-123&startDate=2026-10-01
```

---

# 33. Pagination

Collection endpoints that can grow substantially should support pagination.

Recommended conceptual format:

```text
?page=0&size=20
```

Example:

```text
GET /api/v1/journal?page=0&size=20
```

The API response may eventually use:

```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 42,
  "totalPages": 3
}
```

The exact pagination contract will be finalized before implementation.

---

# 34. Sorting

Sorting may use:

```text
?sort=createdAt,desc
```

Example:

```text
GET /api/v1/journal?sort=createdAt,desc
```

The backend should whitelist supported sort fields rather than accepting arbitrary database field names.

---

# 35. Filtering

Filtering should use predictable parameter names.

Examples:

```text
/api/v1/goals?status=ACTIVE
/api/v1/sessions?goalId=goal-123
/api/v1/activity?goalId=goal-123
```

Invalid filter values should produce clear validation errors.

---

# 36. Search

Search is a future feature.

A possible convention:

```text
GET /api/v1/journal?search=react
```

Search behavior should be explicitly documented once implemented.

The API should not claim to support search until backend implementation actually exists.

---

# 37. Dates and Times

Dates and timestamps must be represented consistently.

Date-only values:

```text
2026-10-05
```

Timestamp values:

```text
2026-10-05T14:30:00Z
```

The backend should use a consistent timezone strategy.

For timestamps representing actual moments in time, UTC should generally be used for API communication.

---

# 38. Duration

Learning session duration should use an unambiguous representation.

For example:

```json
{
  "durationMinutes": 90
}
```

This is preferable to sending ambiguous strings such as:

```text
"1:30"
```

unless a specific duration format is formally defined.

---

# 39. Enumerations

Enums should use explicit string values.

Example:

```json
{
  "status": "ACTIVE"
}
```

Goal status:

```text
PLANNED
ACTIVE
COMPLETED
ARCHIVED
```

Task status:

```text
TODO
IN_PROGRESS
COMPLETED
```

The backend should validate unsupported enum values.

---

# 40. Request Validation Errors

Invalid requests should produce structured errors.

Example:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "The request contains invalid fields.",
  "status": 400,
  "fieldErrors": {
    "title": "Title is required.",
    "targetDate": "Target date must be after the start date."
  }
}
```

The frontend can use `fieldErrors` to display errors next to the corresponding fields.

---

# 41. Authentication Errors

Unauthenticated requests should return:

```http
401 Unauthorized
```

Example:

```json
{
  "code": "UNAUTHENTICATED",
  "message": "Authentication is required.",
  "status": 401
}
```

The frontend can respond by redirecting the user to login when appropriate.

---

# 42. Authorization Errors

When the user is authenticated but lacks permission:

```http
403 Forbidden
```

Example:

```json
{
  "code": "FORBIDDEN",
  "message": "You do not have permission to access this resource.",
  "status": 403
}
```

---

# 43. Not Found

When a requested resource does not exist:

```http
404 Not Found
```

Example:

```json
{
  "code": "GOAL_NOT_FOUND",
  "message": "The requested goal was not found.",
  "status": 404
}
```

The API should avoid leaking information about resources that belong to other users.

---

# 44. Conflict

Use `409 Conflict` when the request conflicts with the current state.

Possible examples:

* duplicate account information
* conflicting resource state
* uniqueness constraint violation

Example:

```json
{
  "code": "RESOURCE_CONFLICT",
  "message": "A resource with these values already exists.",
  "status": 409
}
```

---

# 45. Successful Responses

Common patterns:

### Retrieve

```http
200 OK
```

### Create

```http
201 Created
```

### Update

```http
200 OK
```

### Delete

```http
204 No Content
```

The exact response should be consistent across the API.

---

# 46. Response Structure

Simple resource endpoints may return the resource directly:

```json
{
  "id": "goal-123",
  "title": "Learn React"
}
```

Avoid wrapping every response unnecessarily:

```json
{
  "success": true,
  "data": {
    "id": "goal-123"
  }
}
```

unless there is a concrete reason to standardize on such a wrapper.

The API should prefer useful consistency over ceremony.

---

# 47. Resource IDs

The backend should use stable unique identifiers.

The final identifier strategy will be decided in database design.

Possible choices include:

* UUID
* numeric IDs

UUIDs may be useful for public-facing identifiers because they are difficult to guess and work well across distributed systems.

However, the project should choose one strategy consistently rather than mixing formats without a reason.

---

# 48. Ownership and IDs

A resource URL such as:

```text
GET /api/v1/goals/{goalId}
```

does not imply that knowing the ID grants access.

The backend must still verify:

```text
authenticatedUser == resourceOwner
```

where applicable.

---

# 49. Nested Resources

Nested routes should represent meaningful ownership or containment.

Good:

```text
/api/v1/goals/{goalId}/milestones
/api/v1/milestones/{milestoneId}/tasks
```

Avoid excessive nesting such as:

```text
/api/v1/users/{userId}/goals/{goalId}/milestones/{milestoneId}/tasks/{taskId}
```

The authenticated user already establishes the user context.

---

# 50. API Route Depth

Prefer manageable URLs.

Instead of:

```text
/users/{userId}/goals/{goalId}/milestones/{milestoneId}/tasks
```

use:

```text
/milestones/{milestoneId}/tasks
```

and enforce ownership through authentication and authorization.

---

# 51. Idempotency

Operations should follow appropriate HTTP semantics.

For example:

```text
GET
```

should not modify data.

A repeated:

```text
DELETE /goals/{id}
```

should have predictable behavior.

For operations where duplicate requests could cause problems, explicit idempotency mechanisms may be introduced later if needed.

---

# 52. Authentication Headers

If token-based authentication is selected, protected requests will conceptually use:

```http
Authorization: Bearer <token>
```

The exact authentication mechanism is intentionally defined in the authentication document rather than here.

---

# 53. CORS

The backend should allow requests only from configured frontend origins.

Development:

```text
http://localhost:5173
```

Production:

```text
configured production frontend origin
```

CORS configuration belongs to backend configuration/security rather than individual controllers.

---

# 54. API Documentation

OpenAPI should document the final implementation.

For each endpoint, document:

* HTTP method
* path
* authentication requirement
* parameters
* request body
* response body
* status codes
* possible errors

Swagger UI may be used during development.

---

# 55. Initial API Map

The initial API can be summarized as:

| Domain     | Method | Endpoint                          |
| ---------- | ------ | --------------------------------- |
| Auth       | POST   | `/auth/register`                  |
| Auth       | POST   | `/auth/login`                     |
| Auth       | POST   | `/auth/logout`                    |
| Auth       | GET    | `/auth/me`                        |
| User       | GET    | `/users/me`                       |
| User       | PATCH  | `/users/me`                       |
| Goals      | GET    | `/goals`                          |
| Goals      | POST   | `/goals`                          |
| Goals      | GET    | `/goals/{goalId}`                 |
| Goals      | PATCH  | `/goals/{goalId}`                 |
| Goals      | DELETE | `/goals/{goalId}`                 |
| Milestones | GET    | `/goals/{goalId}/milestones`      |
| Milestones | POST   | `/goals/{goalId}/milestones`      |
| Milestones | GET    | `/milestones/{milestoneId}`       |
| Milestones | PATCH  | `/milestones/{milestoneId}`       |
| Milestones | DELETE | `/milestones/{milestoneId}`       |
| Tasks      | GET    | `/milestones/{milestoneId}/tasks` |
| Tasks      | POST   | `/milestones/{milestoneId}/tasks` |
| Tasks      | GET    | `/tasks/{taskId}`                 |
| Tasks      | PATCH  | `/tasks/{taskId}`                 |
| Tasks      | DELETE | `/tasks/{taskId}`                 |
| Sessions   | GET    | `/sessions`                       |
| Sessions   | POST   | `/sessions`                       |
| Sessions   | GET    | `/sessions/{sessionId}`           |
| Sessions   | PATCH  | `/sessions/{sessionId}`           |
| Sessions   | DELETE | `/sessions/{sessionId}`           |
| Journal    | GET    | `/journal`                        |
| Journal    | POST   | `/journal`                        |
| Journal    | GET    | `/journal/{entryId}`              |
| Journal    | PATCH  | `/journal/{entryId}`              |
| Journal    | DELETE | `/journal/{entryId}`              |
| Progress   | GET    | `/progress`                       |
| Progress   | GET    | `/goals/{goalId}/progress`        |
| Dashboard  | GET    | `/dashboard`                      |
| Activity   | GET    | `/activity`                       |

The `/api/v1` prefix is omitted from the table for readability.

---

# 56. MVP API Priority

### P0 — Required

```text
/auth/register
/auth/login
/auth/logout
/auth/me

/goals
/goals/{goalId}

/goals/{goalId}/milestones
/milestones/{milestoneId}

/milestones/{milestoneId}/tasks
/tasks/{taskId}

/sessions
/sessions/{sessionId}

/journal
/journal/{entryId}

/progress
/dashboard
```

### P1 — Important after core MVP

```text
/users/me
/activity
Filtering
Pagination
Sorting
More detailed progress endpoints
```

### P2 — Future

```text
Search
Notifications
AI
Integrations
Advanced analytics
Exports
```

---

# 57. API Evolution

The API should evolve deliberately.

When changing an endpoint:

1. determine whether the change is backward-compatible
2. update the OpenAPI documentation
3. update frontend API functions
4. update tests
5. update relevant documentation
6. consider whether API versioning is required

Do not silently change API contracts.

---

# 58. API Security Rules

1. Protected endpoints require authentication.
2. Authorization must be enforced server-side.
3. Users can only access resources they are allowed to access.
4. Request input must be validated.
5. Sensitive information must not appear in errors.
6. Authentication credentials must never be returned unnecessarily.
7. Tokens/secrets must not be logged.
8. CORS must be explicitly configured.
9. Database errors must not be exposed directly.
10. Rate limiting can be introduced later for sensitive endpoints.

---

# 59. API Design Rules

1. Use `/api/v1` for versioning.
2. Use plural resource names.
3. Use HTTP methods consistently.
4. Keep URLs predictable.
5. Use nested resources only when the relationship is meaningful.
6. Use DTOs for request and response contracts.
7. Return meaningful HTTP status codes.
8. Use consistent error structures.
9. Validate request data.
10. Keep authorization on the backend.
11. Keep API contracts documented.
12. Avoid unnecessary response wrappers.
13. Use pagination for potentially large collections.
14. Keep date/time formats consistent.
15. Avoid exposing database implementation details.
16. Prefer simple APIs over clever APIs.
17. Update documentation whenever the contract changes.

---

# 60. Frontend ↔ Backend Contract

The most important mental model is:

```text
React Feature
     │
     ▼
API Function
     │
     │ HTTP/JSON
     ▼
Spring Controller
     │
     ▼
Service
     │
     ▼
Database
```

For example:

```text
CreateGoalForm
      ↓
createGoal()
      ↓
POST /api/v1/goals
      ↓
GoalController
      ↓
GoalService
      ↓
GoalRepository
      ↓
PostgreSQL
      ↓
GoalResponse
      ↓
React
```

This contract should remain explicit and predictable.

---

# 61. Final API Mental Model

```text
                    /api/v1
                       │
       ┌───────────────┼────────────────┐
       │               │                │
      auth            users            goals
                                        │
                              ┌─────────┴─────────┐
                              │                   │
                         milestones            progress
                              │
                            tasks

       sessions ────────────────┐
       journal ─────────────────┤
       dashboard ───────────────┤
       activity ────────────────┘
```

The central principle is:

> **The Mezgeb API should act as a stable, secure contract between the frontend and backend, exposing meaningful learning resources and operations while keeping business rules and persistence details behind the API boundary.**
