# Authentication

## 1. Purpose

This document defines how authentication works in the Mezgeb frontend.

It covers:

* registration
* login
* logout
* authentication state
* protected routes
* session persistence
* token handling
* authenticated API requests
* authentication failures
* session expiration
* loading states
* frontend security responsibilities

The backend remains the authority for authentication and authorization.

The frontend is responsible for representing the authentication state and providing the user interface around it.

---

# 2. Authentication Goals

Mezgeb authentication should be:

* secure
* predictable
* easy to understand
* persistent across page refreshes
* integrated with protected routing
* consistent across API requests
* accessible
* testable

The frontend should not implement its own security rules that contradict the backend.

---

# 3. Authentication Model

The basic flow is:

```text
User
 ↓
React Authentication UI
 ↓
API Client
 ↓
Spring Boot Authentication API
 ↓
Authentication / Database
```

After successful authentication:

```text
Spring Boot
 ↓
Authentication response
 ↓
Frontend stores appropriate session information
 ↓
Auth state becomes authenticated
 ↓
Protected application becomes accessible
```

---

# 4. Authentication States

The frontend should distinguish at least three states:

```text
Unknown / Loading
Authenticated
Unauthenticated
```

Example:

```text
Auth state
    │
    ├── Loading
    │
    ├── Authenticated
    │
    └── Unauthenticated
```

The application should not immediately assume the user is logged out while authentication is still being resolved.

---

# 5. Why an Initial Auth Check Is Needed

When the browser loads Mezgeb, React initially does not automatically know whether the user has an active session.

For example:

```text
Browser opens /app/dashboard
        ↓
React starts
        ↓
Auth status unknown
        ↓
Check existing session
        ↓
Authenticated / Unauthenticated
```

During this process, the application may display a loading state.

This prevents incorrect redirects such as:

```text
Authenticated user
        ↓
Temporary unknown state
        ↓
Redirect to /login
```

---

# 6. Authentication Provider

Authentication state should be available throughout the application.

A provider can expose information such as:

```text
user
isAuthenticated
isLoading
login()
register()
logout()
```

Conceptually:

```text
<AuthProvider>
    <App />
</AuthProvider>
```

Components can then consume authentication state through a hook such as:

```text
useAuth()
```

The exact implementation can evolve as the application is built.

---

# 7. Authentication Responsibilities

The frontend authentication layer is responsible for:

* displaying login/register forms
* collecting credentials
* submitting credentials
* storing the appropriate session information
* maintaining authentication state
* restoring authentication after refresh
* logging out
* protecting application routes
* handling authentication failures
* redirecting users appropriately

The backend is responsible for:

* verifying credentials
* creating authenticated sessions/tokens
* validating authentication
* enforcing authorization
* protecting user data
* determining whether a request is allowed

---

# 8. Registration Flow

The registration flow is:

```text
Register Page
      ↓
Validate form
      ↓
Submit registration
      ↓
POST /auth/register
      ↓
Backend validates and creates account
      ↓
Success
      ↓
Continue according to authentication design
```

Possible outcomes:

### Success

The user proceeds to the appropriate next step.

### Validation failure

Display field-level or form-level errors.

### Account already exists

Display a clear message.

### Network/server failure

Display an appropriate recovery message.

---

# 9. Login Flow

The login flow is:

```text
Login Page
    ↓
User enters credentials
    ↓
Client validation
    ↓
Submit
    ↓
POST /auth/login
    ↓
Backend authenticates
    ↓
Authentication established
    ↓
Update auth state
    ↓
Navigate to application
```

For example:

```text
/login
  ↓
successful login
  ↓
/app/dashboard
```

The exact post-login destination can later account for the user's intended destination.

---

# 10. Preserving Intended Destination

If an unauthenticated user visits:

```text
/app/goals/123
```

the application may redirect them to:

```text
/login
```

while preserving the original destination.

After successful authentication:

```text
/login
   ↓
successful login
   ↓
/app/goals/123
```

This provides a smoother navigation experience.

The implementation should avoid creating open redirects from arbitrary external URLs.

---

# 11. Logout Flow

Logout should be explicit and predictable.

```text
User clicks Logout
       ↓
Frontend performs logout operation
       ↓
Backend/session is invalidated as required
       ↓
Local authentication state is cleared
       ↓
User becomes unauthenticated
       ↓
Navigate to /login
```

After logout, protected user data should no longer remain accessible through the frontend.

---

# 12. Session Persistence

Authentication should normally survive a normal browser refresh when the user's session is still valid.

For example:

```text
Login
  ↓
Close/refresh page
  ↓
Open Mezgeb again
  ↓
Existing session detected
  ↓
Authenticated
```

The exact persistence mechanism depends on the backend authentication design.

The frontend should not assume that a token stored somewhere is valid forever.

---

# 13. Token Handling

If Mezgeb uses token-based authentication, the frontend must follow the backend's authentication contract.

Possible approaches include:

* secure HTTP-only cookies
* access token + refresh token
* another backend-defined session mechanism

The authentication mechanism should be decided jointly with the backend architecture.

The frontend should not independently invent a token lifecycle.

---

# 14. HTTP-Only Cookies

If authentication uses HTTP-only cookies, JavaScript cannot directly read the authentication cookie.

Conceptually:

```text
Browser
   │
   │ Cookie
   ▼
Spring Boot
```

The browser automatically sends the cookie according to its cookie/security rules.

This can reduce exposure of authentication credentials to client-side JavaScript.

The exact cookie configuration belongs to the backend/security design.

---

# 15. Token-Based Client Storage

If the backend requires tokens to be handled by the frontend, storage strategy must be chosen carefully.

Avoid treating:

```text
localStorage
```

as automatically secure simply because it is convenient.

Authentication storage has security implications, particularly around XSS.

The final mechanism should be documented in the backend authentication design as well.

---

# 16. API Client Authentication

Authenticated requests should be handled centrally.

Instead of every feature manually handling authentication:

```text
Goal API
Journal API
Task API
Session API
```

the shared HTTP client should handle common authentication behavior.

Conceptually:

```text
Feature API
    ↓
HTTP Client
    ↓
Authentication handling
    ↓
Spring Boot API
```

This avoids duplicated authentication logic.

---

# 17. Unauthorized Responses

The frontend should distinguish authentication failures from authorization failures.

### `401 Unauthorized`

Usually means:

> The request does not have valid authentication.

Possible frontend behavior:

```text
401
 ↓
Clear/refresh authentication state as appropriate
 ↓
Redirect to login
```

The exact behavior depends on the authentication mechanism.

---

# 18. Forbidden Responses

### `403 Forbidden`

Usually means:

> The user is authenticated but is not permitted to perform the requested action.

This should generally **not** automatically log the user out.

For example:

```text
Authenticated user
      ↓
Attempts unauthorized action
      ↓
403
      ↓
Show permission-related feedback
```

---

# 19. Authentication vs Authorization

These concepts must remain separate.

### Authentication

> Who are you?

Example:

```text
Is this user logged in?
```

### Authorization

> Are you allowed to do this?

Example:

```text
Can this user modify this resource?
```

The frontend can hide or disable inappropriate UI, but the backend must enforce authorization.

---

# 20. Protected Routes

Authenticated pages live under:

```text
/app/*
```

Examples:

```text
/app/dashboard
/app/goals
/app/journal
/app/progress
/app/settings
```

These routes require authentication.

Conceptually:

```text
ProtectedRoute
      ↓
Is authentication known?
      │
      ├── Loading → show loader
      │
      ├── Authenticated → render route
      │
      └── Unauthenticated → redirect to /login
```

---

# 21. Public Routes

Public routes include:

```text
/login
/register
```

Authenticated users generally should not need to access these pages.

For example:

```text
Authenticated user
      ↓
/login
      ↓
redirect to /app/dashboard
```

This prevents unnecessary access to authentication forms after login.

---

# 22. Route Protection Is Not Security

Frontend route protection improves UX.

It is **not** the actual security boundary.

A malicious user can bypass frontend code and call the API directly.

Therefore:

```text
Frontend protection
        ≠
Backend authorization
```

Spring Security must protect the API independently.

---

# 23. Authentication Loading

During authentication initialization:

```text
Auth state = loading
```

the application should avoid rendering protected content prematurely.

A typical sequence is:

```text
App starts
   ↓
Auth loading
   ↓
Session check
   ↓
Authenticated?
   ├── Yes → App
   └── No  → Public/auth pages
```

A `FullPageLoader` may be appropriate here because the application may not yet know which application shell to render.

---

# 24. Form Validation

Login and registration forms should use the project's standard form architecture:

```text
React Hook Form
      ↓
Zod
      ↓
Client validation
      ↓
API mutation
      ↓
Backend validation
```

Client validation improves UX.

Backend validation remains authoritative.

---

# 25. Login Errors

Login failures should provide useful feedback without exposing sensitive information.

Avoid overly specific messages that reveal whether an account exists when the backend's security policy does not permit that distinction.

Examples of frontend categories:

```text
Invalid credentials
Account-related issue
Network error
Server error
Unexpected error
```

The exact user-facing message should follow the backend's authentication contract.

---

# 26. Registration Errors

Registration can encounter:

* invalid input
* existing account
* weak/invalid password
* server validation failure
* network failure
* unexpected server error

The frontend should map predictable backend errors to appropriate form or form-level feedback.

---

# 27. Password Handling

The frontend should:

* never log passwords
* never include passwords in analytics
* never display passwords in error messages
* use password input semantics
* provide show/hide functionality if appropriate
* preserve accessibility
* submit credentials only over secure connections in production

Password policy enforcement ultimately belongs to the backend.

---

# 28. Sensitive Data

Authentication-related sensitive information should not be unnecessarily stored in:

* console logs
* URLs
* analytics events
* error messages
* application state longer than necessary

For example, credentials should never become part of:

```text
/login?password=...
```

---

# 29. Session Expiration

A valid session can eventually expire.

For example:

```text
Authenticated
     ↓
Session expires
     ↓
API request
     ↓
401
```

The frontend should respond consistently according to the authentication strategy.

Possible behavior:

```text
401
 ↓
Attempt session/token renewal if supported
 ↓
If successful → retry appropriate request
 ↓
If unsuccessful → clear auth state
 ↓
Redirect to login
```

The exact refresh-token behavior should be defined with the backend.

---

# 30. Avoiding Infinite Authentication Loops

Authentication handling should avoid situations such as:

```text
401
 ↓
Refresh
 ↓
401
 ↓
Refresh
 ↓
401
 ↓
...
```

The HTTP client should have a clear limit and failure path.

If authentication cannot be restored:

```text
Clear session
 ↓
Unauthenticated
 ↓
Login
```

---

# 31. Auth State and Server State

Authentication state and application server data are related but should not be treated as the same thing.

For example:

```text
Auth state
├── user
├── authenticated
└── auth loading

Server state
├── goals
├── tasks
├── sessions
└── journal
```

TanStack Query can manage server data.

The authentication provider can manage the application's current authentication/session state.

---

# 32. User Data After Login

Once authentication succeeds:

```text
Login
 ↓
Auth state updated
 ↓
Application loads user-specific data
 ↓
Dashboard
```

Queries for protected resources should only run when authentication is sufficiently established.

This avoids unnecessary requests from an unauthenticated state.

---

# 33. User Data After Logout

Logout should clear or invalidate user-specific client state.

Otherwise, a previous user's cached information could potentially remain visible to another user using the same browser.

Conceptually:

```text
Logout
 ↓
Clear authentication
 ↓
Clear/invalidate user-specific server state
 ↓
Navigate to login
```

The exact TanStack Query cache strategy should be implemented consistently.

---

# 34. Multi-Tab Considerations

If the user logs out in one browser tab, other tabs may still have stale authentication state.

The authentication architecture should eventually consider cross-tab synchronization where necessary.

Possible mechanisms include browser storage events or another session synchronization strategy.

This can be deferred until the basic authentication flow is working.

---

# 35. Authentication Components

Potential feature components:

```text
features/auth/
├── components/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── ...
├── hooks/
│   └── useAuth.ts
├── api/
│   └── authApi.ts
├── schemas/
│   └── authSchemas.ts
├── types.ts
└── ...
```

Not every file needs to exist immediately.

Create files when their responsibility becomes necessary.

---

# 36. Auth-Related Shared Components

Some UI components should remain shared rather than auth-specific.

Examples:

```text
components/forms/Input
components/forms/FormMessage
components/forms/FormRootError
components/forms/SubmitButton
components/feedback/ErrorState
components/layout/AuthLayout
```

Authentication owns the meaning.

Shared components own reusable presentation.

---

# 37. Authentication and Layouts

The application uses:

```text
AuthLayout
AppLayout
```

Conceptually:

```text
Public
└── AuthLayout
    ├── Login
    └── Register

Protected
└── AppLayout
    ├── Dashboard
    ├── Goals
    ├── Journal
    ├── Progress
    └── Settings
```

The authentication boundary determines which layout is appropriate.

---

# 38. Authentication Flow

The complete frontend flow can be represented as:

```text
                    Application Starts
                           │
                           ▼
                    Resolve Auth State
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
           Authenticated       Unauthenticated
                 │                   │
                 ▼                   ▼
             AppLayout           AuthLayout
                 │                   │
                 ▼                   ▼
           Protected App       Login / Register
                 │
                 ▼
          User-specific Data
```

---

# 39. Login Sequence

```text
LoginForm
   ↓
React Hook Form
   ↓
Zod validation
   ↓
authApi.login()
   ↓
HTTP client
   ↓
Spring Boot
   ↓
Authentication succeeds
   ↓
Update auth state
   ↓
Load user data
   ↓
Navigate to application
```

---

# 40. Logout Sequence

```text
User clicks Logout
        ↓
auth.logout()
        ↓
Backend/session cleanup
        ↓
Clear auth state
        ↓
Clear/invalidate user data
        ↓
Navigate to /login
```

---

# 41. Error Handling Integration

Authentication errors follow the general error architecture.

```text
HTTP Client
    ↓
Normalize error
    ↓
Auth API / Query
    ↓
Auth feature
    ↓
Form/Page
    ↓
User feedback
```

Authentication-specific behavior should not be scattered throughout unrelated components.

---

# 42. Testing Authentication

Authentication should be tested at multiple levels.

### Login form

Test:

* required fields
* invalid input
* submission
* loading state
* successful login
* failed login

### Register form

Test:

* required fields
* validation
* password rules
* successful registration
* server errors

### Protected routes

Test:

```text
Authenticated → access allowed
Unauthenticated → redirect to login
Auth loading → loader
```

### Logout

Test:

```text
Logout
 ↓
Auth state cleared
 ↓
Protected route inaccessible
```

### Session expiration

Test the relevant `401` behavior once the authentication strategy is implemented.

---

# 43. Authentication Security Rules

1. Backend authentication is authoritative.
2. Backend authorization is mandatory.
3. Frontend route protection is not a security boundary.
4. Never log credentials or sensitive authentication data.
5. Never place passwords in URLs.
6. Use HTTPS in production.
7. Centralize authenticated API behavior.
8. Handle `401` and `403` differently.
9. Do not assume stored authentication information is valid forever.
10. Clear user-specific state after logout.
11. Avoid exposing unnecessary authentication details through error messages.
12. Keep authentication logic out of unrelated feature components.
13. Prevent duplicate submissions during authentication actions.
14. Avoid infinite token-refresh loops.
15. Follow the backend's defined session/token contract.

---

# 44. Authentication Mental Model

Think of Mezgeb authentication as four layers:

```text
┌─────────────────────────────┐
│        Authentication UI    │
│ Login / Register / Logout   │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│        Auth State            │
│ user / status / session     │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│        API / HTTP Client     │
│ authenticated requests      │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│        Spring Boot Backend   │
│ authentication + security   │
└─────────────────────────────┘
```

The central principle is:

> **The frontend manages the user's authentication experience and state; the backend remains the authority for identity, sessions, and access control.**
