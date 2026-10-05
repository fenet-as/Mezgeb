# Error Handling

## 1. Purpose

This document defines how the Mezgeb frontend detects, represents, handles, and displays errors.

The goal is to make errors:

* understandable
* recoverable
* consistent
* accessible
* useful for debugging
* safe to expose to users
* predictable across the application

Errors are expected in a real application. The goal is not to eliminate every error, but to make failures understandable and recoverable.

---

# 2. Core Principle

An error should be handled at the layer where the application has enough context to respond appropriately.

The general flow is:

```text
Backend / Browser
       ↓
HTTP Client
       ↓
API / Query Layer
       ↓
Feature / Page
       ↓
User-facing feedback
```

Different layers have different responsibilities.

---

# 3. Types of Errors

Mezgeb will distinguish between several categories.

### Validation errors

The submitted data is invalid.

Example:

```text
Goal title is required.
```

### Authentication errors

The user's authentication state is invalid.

Example:

```text
Your session has expired.
Please log in again.
```

### Authorization errors

The user is authenticated but does not have permission.

Example:

```text
You don't have permission to perform this action.
```

### Not-found errors

A requested resource does not exist.

Example:

```text
Goal not found.
```

### Network errors

The browser cannot communicate with the backend.

Example:

```text
Unable to connect to Mezgeb.
```

### Server errors

The backend encountered an unexpected problem.

Example:

```text
Something went wrong on our side.
Please try again.
```

### Unexpected client errors

Something unexpected occurs inside the frontend itself.

Example:

```text
Unexpected rendering or JavaScript error.
```

---

# 4. Error Handling Layers

Errors should be handled at different levels.

```text
┌──────────────────────────┐
│ Global / App-level       │
│ Unexpected application   │
│ failures                 │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Page / Feature           │
│ API and resource errors  │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Form                     │
│ Validation/submission    │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Component                │
│ Local interaction errors │
└──────────────────────────┘
```

The goal is to avoid both extremes:

* handling every error globally
* making every component independently reinvent error handling

---

# 5. HTTP Client Error Boundary

The shared HTTP client should normalize common HTTP failures.

For example:

```text id="x8k4m2"
HTTP 400
HTTP 401
HTTP 403
HTTP 404
HTTP 409
HTTP 422
HTTP 429
HTTP 500
HTTP 503
```

The client should convert these responses into a predictable application error representation.

Conceptually:

```text id="p5v2q9"
HTTP Response
     ↓
HTTP Client
     ↓
Application Error
```

This prevents every API function from having to understand raw HTTP behavior independently.

---

# 6. Error Object

The frontend should have a predictable representation of API errors.

Conceptually:

```text id="4r7n1x"
AppError
├── message
├── status
├── code
├── fieldErrors
└── details
```

Not every property needs to exist for every error.

For example:

```text id="q9m3v7"
{
  status: 422,
  message: "Validation failed",
  fieldErrors: {
    title: "Title is required"
  }
}
```

The exact structure should align with the backend API contract.

---

# 7. User-Facing vs Developer-Facing Errors

Users and developers need different information.

### User

Needs:

* what happened
* whether their action succeeded
* what they can do next

### Developer

May need:

* HTTP status
* backend error code
* request information
* stack trace
* technical details

Do not expose sensitive technical information to users.

For example, avoid displaying:

```text
NullPointerException in GoalService.java:87
```

to the user.

Instead:

```text
Something went wrong while loading this goal.
```

Development logs can contain more technical information when appropriate.

---

# 8. Validation Errors

Validation errors should be handled close to the form.

Example:

```text id="7m2p8c"
User submits form
      ↓
Validation fails
      ↓
Field error
```

Example:

```text
Title
[________________]

Title is required.
```

These errors should generally prevent the request from being sent when they can be detected locally.

---

# 9. Server-Side Validation Errors

The backend may reject a request even when frontend validation passes.

Example:

```text id="3x9k4m"
Frontend validation
      ↓
Valid
      ↓
Backend
      ↓
422 Validation Error
```

The frontend should map structured backend errors to fields when possible.

For example:

```text id="v6q1s8"
title → "A goal with this title already exists."
```

If the error cannot be associated with a specific field:

```text
Unable to save your goal.
Please review the information and try again.
```

---

# 10. HTTP Status Handling

Common statuses should have predictable behavior.

| Status | Meaning             | Frontend behavior                   |
| ------ | ------------------- | ----------------------------------- |
| `400`  | Bad request         | Show appropriate request/form error |
| `401`  | Unauthenticated     | Handle session/authentication state |
| `403`  | Forbidden           | Show permission error               |
| `404`  | Resource not found  | Show not-found state                |
| `409`  | Conflict            | Explain the conflict when possible  |
| `422`  | Validation failure  | Map field/form errors               |
| `429`  | Rate limited        | Show retry guidance                 |
| `500`  | Server error        | Show generic server error           |
| `503`  | Service unavailable | Show temporary availability error   |

The exact backend contract may refine this behavior.

---

# 11. Authentication Errors

A `401 Unauthorized` response generally means the frontend can no longer treat the current authentication state as valid.

Possible flow:

```text id="4k7p1m"
API request
   ↓
401
   ↓
Authentication handling
   ↓
Clear invalid session if appropriate
   ↓
Redirect to login
```

The application should avoid redirect loops.

Authentication-specific behavior belongs primarily in:

```text id="v2n8q5"
03-frontend/authentication.md
```

---

# 12. Authorization Errors

A `403 Forbidden` response means the user is authenticated but the requested operation is not allowed.

Example:

```text id="j6m3w8"
Delete resource
     ↓
Backend
     ↓
403
```

The UI should communicate the lack of permission without exposing unnecessary implementation details.

Example:

> You don't have permission to perform this action.

The frontend should not attempt to bypass authorization restrictions.

---

# 13. Not Found Errors

A requested resource may no longer exist.

For example:

```text id="2q8v4m"
GET /goals/123
      ↓
404
```

The page should show a resource-specific not-found state.

Example:

```text
Goal not found

This goal may have been deleted or the link may be incorrect.

[Back to Goals]
```

This is different from an unknown application route.

---

# 14. Unknown Routes

An invalid application URL should produce a general Not Found page.

Example:

```text id="x5k9p2"
/app/something-that-does-not-exist
```

should render:

```text
Page not found
```

rather than pretending that a backend resource is missing.

---

# 15. Network Errors

The browser may be unable to communicate with the backend.

Possible causes include:

* no internet connection
* backend unavailable
* DNS failure
* request timeout
* browser/network restrictions

The UI should avoid exposing technical network details.

Instead:

```text
Unable to connect.

Please check your connection and try again.
```

Where appropriate, provide:

```text
[Try again]
```

---

# 16. Server Errors

For unexpected backend failures:

```text id="8q3m6v"
500 / 503
   ↓
Generic user-facing message
```

Example:

> Something went wrong while loading your goals.

The user should not receive backend stack traces, database errors, or internal infrastructure details.

---

# 17. Retry Behavior

Retry behavior should depend on the type of error.

Reasonable retry:

```text id="m4x7p2"
Temporary network failure
Temporary service availability
```

Usually not useful:

```text id="c8k1q5"
Invalid request
Permission denied
Malformed data
```

For user actions, a clear manual retry option can be useful.

Example:

```text
Unable to load your sessions.

[Try again]
```

---

# 18. Query Errors

For a page-level query:

```text id="1v9k3m"
GoalsPage
   ↓
useGoals()
   ↓
Error
```

the page should display an appropriate error state.

Example:

```text
Unable to load your goals.

Please try again.

[Try again]
```

The rest of the application shell should remain usable whenever possible.

---

# 19. Mutation Errors

Mutation errors occur when a user performs an action.

Examples:

* create goal
* edit goal
* complete task
* delete milestone
* save journal entry

The error should appear close to the action.

For example:

```text id="7p2m8q"
Create Goal
   ↓
Request fails
   ↓
Form-level error
```

For smaller actions, a toast or inline feedback may be appropriate.

---

# 20. Error Placement

The UI should communicate errors where the user needs them.

### Field error

```text
Title is required.
```

### Form error

```text
Unable to create this goal.
```

### Page error

```text
Unable to load your goals.
[Try again]
```

### Global error

```text
Something went wrong.
Please refresh the application.
```

Avoid showing a global notification for every small field error.

---

# 21. Toasts

Toasts can be useful for short-lived feedback.

Good examples:

```text
Goal deleted.
Journal entry saved.
Changes saved.
```

Error examples:

```text
Unable to delete goal.
```

Toasts should not be the only place where important errors appear.

For example, a form validation error should remain visible in the form rather than disappearing after a few seconds.

---

# 22. Error Boundaries

React error boundaries should be used to catch unexpected rendering/runtime errors.

Conceptually:

```text id="5f8q2m"
Application
   ↓
Error Boundary
   ↓
Unexpected rendering error
   ↓
Fallback UI
```

Example fallback:

```text
Something went wrong.

Please refresh the page and try again.

[Refresh]
```

Error boundaries are a safety net.

They are not a replacement for normal API or validation error handling.

---

# 23. Route-Level Errors

A route may fail while loading its data.

The route should be able to display a useful fallback without crashing the entire application.

For example:

```text id="9x4m7k"
Goal Details
      ↓
Goal request fails
      ↓
Goal ErrorState
```

The application shell can remain available.

---

# 24. Error Recovery

A good error state should provide a path forward whenever possible.

Examples:

### Load failure

```text
[Try again]
```

### Resource not found

```text
[Back to Goals]
```

### Unauthorized

```text
[Log in]
```

### Form validation

```text
Fix highlighted fields
```

### Unexpected application error

```text
[Refresh]
```

Error handling should answer:

> "What can I do now?"

---

# 25. Preserve User Input

When a mutation fails, the frontend should preserve user-entered values whenever possible.

Example:

```text id="8m1q5r"
Journal entry
   ↓
Save
   ↓
Server error
```

The user's writing should remain in the editor.

The user should not have to reconstruct the entire entry.

This is especially important for longer forms.

---

# 26. Delete Errors

Deletion is particularly important because users may assume the action completed.

Example:

```text id="4p7x2m"
Delete Goal
   ↓
Request fails
   ↓
Goal remains visible
   ↓
Show:
"Unable to delete this goal."
```

The UI should not permanently remove the item before the server confirms success unless an intentional optimistic strategy is implemented.

---

# 27. Error and Cache Consistency

If a mutation fails:

```text id="2k9m5v"
Do not treat the operation as successful.
```

For example:

```text
Delete task
   ↓
Server rejects
   ↓
Task should remain present
```

The frontend's server-state cache should remain consistent with the backend.

This is another reason to prefer straightforward server-confirmed updates initially.

---

# 28. Logging

Development logging can help diagnose unexpected failures.

Useful information may include:

* error type
* request endpoint
* HTTP status
* error code
* relevant development context

Avoid logging sensitive information such as:

* passwords
* authentication tokens
* private user content unnecessarily
* secrets

Production logging/monitoring can later be integrated with a service such as Sentry.

---

# 29. Error Messages

Good user-facing errors should be:

* clear
* short
* specific when possible
* actionable
* non-technical

Prefer:

> Unable to save your journal entry. Try again.

over:

> POST /api/v1/journal returned 500.

Prefer:

> This goal could not be found.

over:

> Resource ID 123 returned 404.

---

# 30. Avoiding Error Overload

Not every error needs a large error page.

For example:

```text id="7m3q9x"
Minor action failure
→ toast

Form validation
→ field/form message

Page data failure
→ page error state

Application crash
→ error boundary
```

The response should match the severity and scope of the failure.

---

# 31. Error Handling Example

Consider completing a task:

```text id="x8m4q2"
User clicks "Complete"
       ↓
useCompleteTask()
       ↓
PATCH /tasks/:id
       ↓
       ├── Success
       │      ↓
       │  invalidate queries
       │      ↓
       │  UI updates
       │
       └── Error
              ↓
          show feedback
```

If the backend returns `403`:

```text
You don't have permission to update this task.
```

If it returns `500`:

```text
Unable to update the task.
Please try again.
```

If the network is unavailable:

```text
Unable to connect.
Check your connection and try again.
```

The user receives a useful message without needing to understand HTTP.

---

# 32. Error Handling Rules

Mezgeb follows these rules:

1. Normalize API errors at the HTTP boundary.
2. Keep error representation predictable.
3. Distinguish validation, authentication, authorization, not-found, network, server, and unexpected errors.
4. Show field errors near the relevant fields.
5. Show form errors at the form level.
6. Show page-level failures at the page level.
7. Use global error boundaries for unexpected React/runtime failures.
8. Never expose stack traces or sensitive backend details to users.
9. Preserve user input when mutations fail.
10. Provide recovery actions whenever possible.
11. Do not retry errors blindly.
12. Keep authentication error handling centralized.
13. Keep authorization enforced by the backend.
14. Keep server state consistent after failed mutations.
15. Use toasts for short-lived feedback, not as the only channel for important errors.
16. Log useful development information without exposing secrets.
17. Make error messages accessible.
18. Match the error UI to the scope and severity of the failure.
19. Prefer simple recovery paths.
20. Treat errors as expected application states rather than exceptional situations that the UI ignores.

---

# 33. Mezgeb Error Mental Model

```text id="3v7m2k"
                 ERROR
                   │
                   ▼
             Identify type
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
     Client      API        Runtime
     validation  failure    failure
        │          │          │
        ▼          ▼          ▼
      Form      Feature/    Error
      error       Page      Boundary
                   │
                   ▼
              User feedback
                   │
                   ▼
              Recovery path
```

The central principle is:

> **An error should be understandable, shown at the right level, and give the user a reasonable path forward whenever possible.**
