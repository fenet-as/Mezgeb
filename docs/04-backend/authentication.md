# Authentication

## 1. Purpose

This document defines authentication for the Mezgeb backend.

It covers:

* user registration
* login
* logout
* authenticated requests
* authentication state
* password security
* session/token strategy
* authentication failures
* frontend/backend interaction
* security-related data handling

Authorization is documented separately in:

```text
04-backend/authorization.md
```

---

# 2. Authentication vs Authorization

These concepts are related but different.

### Authentication

Answers:

> Who is this user?

Example:

```text
User enters email + password
        ↓
Backend verifies credentials
        ↓
User is authenticated
```

### Authorization

Answers:

> What is this authenticated user allowed to do?

Example:

```text
User requests Goal #123
        ↓
Backend checks ownership
        ↓
Allow or reject
```

Authentication comes first.

---

# 3. Authentication Goals

Mezgeb authentication should be:

* secure
* predictable
* simple enough to understand
* compatible with the React frontend
* resistant to common authentication mistakes
* easy to test
* suitable for future expansion

The MVP should avoid unnecessary authentication complexity.

---

# 4. Authentication Flow

The basic flow is:

```text
┌──────────────┐
│    User      │
└──────┬───────┘
       │
       │ email + password
       ▼
┌──────────────┐
│   React      │
└──────┬───────┘
       │
       │ POST /auth/login
       ▼
┌──────────────┐
│ Spring Boot  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Authentication│
│   Manager    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ User Details │
│   + Password │
└──────┬───────┘
       │
       ▼
 Authentication
       │
       ▼
 Authenticated Client
```

---

# 5. Authentication Strategy

The initial architecture will use:

> **Stateless authentication with access tokens.**

The preferred implementation is JWT-based authentication.

Conceptually:

```text
Login
 ↓
Credentials verified
 ↓
Access token issued
 ↓
Frontend stores authentication state
 ↓
Frontend sends token with protected requests
 ↓
Backend validates token
```

The exact token storage strategy must be chosen carefully because storing tokens in browser storage has security tradeoffs.

---

# 6. Why Stateless Authentication?

With stateless authentication, the backend does not need to maintain a traditional server-side login session for every user.

Instead, each protected request carries authentication information.

Conceptually:

```text
Request
  ↓
Bearer Token
  ↓
Validate Token
  ↓
Identify User
  ↓
Process Request
```

Benefits include:

* straightforward REST API model
* easy frontend/backend separation
* no server-side session store required for the basic case
* easier horizontal scaling later

---

# 7. JWT

A JSON Web Token can contain claims representing the authenticated user and token metadata.

Conceptually:

```text
JWT
├── Header
├── Payload
└── Signature
```

The backend signs the token.

The client cannot modify the token without invalidating its signature.

A JWT should **not** contain sensitive information such as:

* passwords
* password hashes
* private personal information
* secrets

A token should contain only the information required for authentication.

---

# 8. Access Token

The access token represents authenticated access.

Example conceptual request:

```http
GET /api/v1/goals
Authorization: Bearer <access-token>
```

The backend:

1. extracts the token
2. validates it
3. verifies its signature
4. checks expiration
5. identifies the user
6. establishes the authenticated security context
7. continues processing

---

# 9. Token Expiration

Access tokens should have a limited lifetime.

For example:

```text
Access token
     │
     ├── issued
     │
     ├── valid
     │
     └── expires
```

Short-lived access tokens reduce the impact of a leaked token.

The exact expiration duration should be configurable rather than hardcoded.

---

# 10. Refresh Tokens

A refresh-token mechanism may be introduced to allow users to remain logged in without making access tokens long-lived.

Conceptually:

```text
Access Token
     ↓
expires
     ↓
Refresh Token
     ↓
New Access Token
```

Possible future endpoint:

```text
POST /api/v1/auth/refresh
```

Refresh tokens introduce additional security and lifecycle considerations.

They should not be added simply because JWT tutorials commonly include them.

For the initial MVP, the simplest secure approach should be used.

---

# 11. Password Handling

Passwords must never be stored as plaintext.

The backend should use a strong password hashing algorithm supported by Spring Security.

A suitable default is:

> BCrypt

Conceptually:

```text
User password
      ↓
Password encoder
      ↓
Password hash
      ↓
Database
```

During login:

```text
Submitted password
      ↓
Password encoder
      ↓
Compare against stored hash
```

The original password cannot be recovered from the stored hash.

---

# 12. Password Hashing

The database should store something like:

```text
passwordHash
```

not:

```text
password
```

Example conceptual database record:

```text
email: user@example.com
passwordHash: $2a$...
```

The actual password should never be returned through an API response.

---

# 13. Registration

Endpoint:

```http
POST /api/v1/auth/register
```

Example request:

```json
{
  "name": "Fenet",
  "email": "user@example.com",
  "password": "example-password"
}
```

The backend should:

1. validate the request
2. normalize appropriate fields
3. check whether the account already exists
4. hash the password
5. create the user
6. persist the user
7. establish the appropriate authentication state
8. return a safe response

The exact registration response will be defined by the final API contract.

---

# 14. Registration Validation

The backend should validate:

* name requirements
* email format
* email length
* password requirements
* required fields

Example conceptual rules:

```text
name → required
email → required + valid format
password → required + minimum security requirements
```

The exact password policy should be documented rather than scattered throughout the code.

---

# 15. Duplicate Registration

If the email is already associated with an account, registration should not create another account.

Possible response:

```http
409 Conflict
```

Example:

```json
{
  "code": "EMAIL_ALREADY_EXISTS",
  "message": "An account with this email already exists.",
  "status": 409
}
```

The exact information exposed should be evaluated against account-enumeration risks.

---

# 16. Login

Endpoint:

```http
POST /api/v1/auth/login
```

Example request:

```json
{
  "email": "user@example.com",
  "password": "example-password"
}
```

Successful flow:

```text
Credentials
    ↓
Find user
    ↓
Verify password
    ↓
Authenticate
    ↓
Generate access token
    ↓
Return authentication response
```

---

# 17. Login Response

A token-based response may conceptually look like:

```json
{
  "accessToken": "<token>",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "user": {
    "id": "user-123",
    "name": "Fenet",
    "email": "user@example.com"
  }
}
```

The exact structure is not final until the API contract is implemented.

---

# 18. Failed Login

Invalid credentials should produce an authentication failure.

Conceptually:

```http
401 Unauthorized
```

The response should not reveal unnecessary information such as:

```text
"The email exists but the password was wrong."
```

A generic authentication error is safer.

Example:

```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password.",
  "status": 401
}
```

---

# 19. Authentication Endpoint Map

Initial endpoints:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

Future:

```text
POST /api/v1/auth/refresh
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
POST /api/v1/auth/verify-email
```

Future endpoints should only be implemented when their product requirements are defined.

---

# 20. Current User

The frontend needs a reliable way to determine the currently authenticated user.

Endpoint:

```http
GET /api/v1/auth/me
```

Example response:

```json
{
  "id": "user-123",
  "name": "Fenet",
  "email": "user@example.com"
}
```

The backend determines the identity from the authentication mechanism.

The frontend should not simply trust a user ID stored in client state.

---

# 21. Authenticated Request

A protected request follows:

```text
React
  ↓
Authorization: Bearer <token>
  ↓
Spring Security
  ↓
Validate token
  ↓
Identify user
  ↓
SecurityContext
  ↓
Controller
```

The authenticated user can then be accessed by backend code through Spring Security mechanisms.

---

# 22. Security Context

Spring Security maintains an authenticated principal for the request.

Conceptually:

```text
HTTP Request
     ↓
Authentication Filter
     ↓
Authentication
     ↓
SecurityContext
     ↓
Controller / Service
```

Application code should use the authenticated principal rather than trusting a user ID supplied by the client.

---

# 23. Never Trust Client User IDs

Avoid endpoints that rely on a client-provided user ID for ownership.

For example, avoid:

```http
GET /api/v1/users/{userId}/goals
```

for normal authenticated operations.

Prefer:

```http
GET /api/v1/goals
```

The backend derives the user from authentication.

---

# 24. Authentication and Resource Ownership

For:

```http
GET /api/v1/goals/{goalId}
```

the backend should conceptually perform:

```text
Authenticate request
       ↓
Identify current user
       ↓
Find goal
       ↓
Verify goal ownership
       ↓
Return goal
```

Knowing a valid goal ID should not be enough to access it.

---

# 25. Logout

Logout behavior depends on the authentication architecture.

With purely stateless access tokens, logout cannot necessarily invalidate an already-issued token unless additional server-side state is introduced.

Therefore the MVP logout behavior must be defined explicitly.

A simple approach is:

```text
User clicks Logout
       ↓
Frontend removes authentication state
       ↓
User returns to login
```

If refresh tokens or token revocation are introduced later, logout can additionally invalidate server-side authentication credentials.

---

# 26. Token Storage

Token storage is a security-sensitive design decision.

Possible approaches include:

### Browser storage

Examples:

```text
localStorage
sessionStorage
```

Advantages:

* easy to implement
* easy to access from JavaScript

Risks:

* JavaScript-accessible tokens can be exposed if an XSS vulnerability exists

### HttpOnly cookies

Advantages:

* JavaScript cannot directly read HttpOnly cookies
* can reduce token exposure to JavaScript

Additional considerations:

* CSRF protection
* cookie configuration
* SameSite behavior
* cross-origin deployment

The final implementation should choose one strategy deliberately rather than following a tutorial blindly.

---

# 27. Recommended Cookie Security Properties

If authentication uses cookies, production cookies should generally use appropriate security attributes such as:

```text
HttpOnly
Secure
SameSite
```

The exact SameSite and domain configuration depends on the frontend/backend deployment architecture.

---

# 28. CORS and Authentication

CORS and authentication are separate concerns.

CORS answers:

> Which origins may make browser requests?

Authentication answers:

> Who is making this request?

Authorization answers:

> What may this authenticated user do?

All three must be configured correctly.

---

# 29. Authentication Flow With Cookies

If the final implementation uses secure cookies:

```text
Login
 ↓
Backend authenticates
 ↓
Set secure authentication cookie
 ↓
Browser stores cookie
 ↓
Browser sends cookie with appropriate requests
 ↓
Backend authenticates request
```

If cross-origin cookies are required, frontend/backend CORS and credential configuration must be aligned.

---

# 30. Authentication Flow With Bearer Tokens

If the final implementation uses bearer tokens:

```text
Login
 ↓
Backend returns access token
 ↓
Frontend manages token
 ↓
API client adds Authorization header
 ↓
Backend validates token
```

The HTTP client should centralize token attachment rather than manually adding it throughout every component.

---

# 31. Frontend Authentication Boundary

The React application should have a centralized authentication mechanism.

Conceptually:

```text
AuthProvider
     │
     ├── currentUser
     ├── isAuthenticated
     ├── login()
     ├── logout()
     └── refresh/load session
```

Components should consume authentication state rather than implementing authentication logic individually.

---

# 32. Protected Routes

Frontend routing should distinguish:

```text
Public
├── /login
└── /register

Protected
└── /app/*
```

If the user is unauthenticated:

```text
/app/dashboard
       ↓
/login
```

However, frontend route protection is primarily a UX mechanism.

The backend remains responsible for actual security.

---

# 33. Backend Protected Endpoints

Endpoints should be explicitly classified.

Public:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
```

Protected:

```text
GET /api/v1/auth/me
GET /api/v1/goals
POST /api/v1/goals
GET /api/v1/journal
POST /api/v1/sessions
...
```

Only explicitly public authentication endpoints should bypass authentication requirements.

---

# 34. Authentication Middleware

Spring Security filters should process incoming requests before protected controllers.

Conceptually:

```text
Request
 ↓
Security Filter Chain
 ↓
Authentication
 ↓
Authorization
 ↓
Controller
```

This centralizes authentication instead of requiring each controller to manually verify tokens.

---

# 35. Password Reset

Password reset is not required for the initial MVP unless account recovery is part of the first release.

Future flow:

```text
Forgot Password
       ↓
Email / identity verification
       ↓
Reset token
       ↓
New password
       ↓
Invalidate reset token
```

Reset tokens should:

* expire
* be single-use
* be securely generated
* never contain the user's password

---

# 36. Email Verification

Email verification is also optional for the initial MVP.

Future flow:

```text
Registration
     ↓
Verification email
     ↓
User clicks link
     ↓
Backend verifies token
     ↓
Account marked verified
```

Verification tokens should expire and be single-use.

---

# 37. Account Enumeration

Authentication endpoints should avoid revealing unnecessary information about whether an account exists.

For example, password reset requests should not necessarily respond:

```text
"This email is not registered."
```

Instead, the system can provide a generic response such as:

```text
"If an account exists for this email, further instructions will be sent."
```

This reduces account-enumeration risk.

---

# 38. Brute-Force Protection

Repeated login attempts can become a security risk.

The MVP should at minimum consider:

* rate limiting
* monitoring repeated failures
* sensible password requirements
* generic authentication errors

More sophisticated protection can be introduced later.

---

# 39. Password Policy

Password requirements should balance security and usability.

The backend should define:

* minimum length
* maximum accepted length
* whether common-password checks are used
* whether additional complexity rules are actually necessary

Avoid relying only on rules such as:

```text
uppercase + lowercase + number + symbol
```

without considering password length and usability.

---

# 40. Sensitive Data

The backend must never expose:

* plaintext passwords
* password hashes
* authentication secrets
* private tokens
* internal security configuration

User responses should contain only information necessary for the client.

---

# 41. Authentication Logging

Do not log:

```text
passwords
access tokens
refresh tokens
authorization headers
```

Useful authentication logs may include:

```text
authentication failure
security event
unexpected authentication error
```

Logs should not make credentials recoverable.

---

# 42. Token Secrets

JWT signing secrets or private keys must not be committed to Git.

Use environment configuration or secure secret management.

Example:

```text
JWT_SECRET=<environment-provided-secret>
```

The actual production secret must never appear in:

* source code
* Git history
* README examples
* frontend environment variables
* screenshots
* public repositories

---

# 43. Token Claims

A minimal token might contain claims such as:

```text
sub
iat
exp
```

where:

```text
sub → authenticated user identifier
iat → issued-at time
exp → expiration time
```

Additional claims should only be added when they provide a real benefit.

Avoid putting large amounts of user data into the token.

---

# 44. Token Validation

Every protected request must validate the token.

Validation should include:

* signature
* expiration
* expected token structure
* appropriate issuer/audience where configured
* authentication context

A token should never be trusted merely because it is syntactically valid.

---

# 45. Refresh Token Security

If refresh tokens are introduced:

* use longer but limited lifetimes
* protect them carefully
* rotate them where appropriate
* support revocation
* avoid exposing them to unnecessary JavaScript
* detect suspicious reuse where appropriate

Refresh-token infrastructure should not be added until it is actually required.

---

# 46. Authentication State

The frontend should distinguish between:

```text
Loading authentication state
Authenticated
Unauthenticated
Authentication error
```

For example:

```text
App starts
   ↓
Check authentication
   ↓
Loading
   ↓
Authenticated → App
Unauthenticated → Login
```

This prevents the application from briefly showing protected content before authentication is resolved.

---

# 47. Initial App Load

A typical React flow:

```text
Application starts
       ↓
AuthProvider initializes
       ↓
Check existing authentication
       ↓
GET /api/v1/auth/me
       ↓
200 → current user
401 → unauthenticated
       ↓
Render appropriate application state
```

The frontend should avoid treating the existence of client-side state alone as proof of authentication.

---

# 48. Expired Authentication

When authentication expires:

```text
API Request
   ↓
401 Unauthorized
   ↓
Authentication client logic
   ↓
Attempt refresh if supported
        OR
Clear authentication state
   ↓
Redirect to login
```

The exact refresh behavior depends on the final authentication mechanism.

---

# 49. Avoid Infinite Authentication Loops

The API client should not repeatedly retry authentication failures indefinitely.

For example:

```text
401
 ↓
retry
 ↓
401
 ↓
retry
 ↓
401
 ↓
...
```

Authentication recovery must have a clear termination condition.

---

# 50. Authentication Error Handling

The backend should distinguish:

```text
Invalid credentials
Expired authentication
Missing authentication
Malformed authentication
Forbidden resource
```

The frontend can then provide the appropriate user experience.

---

# 51. Security Boundaries

Authentication establishes:

```text
Who is the caller?
```

Authorization establishes:

```text
What can the caller access?
```

The database establishes:

```text
What data actually exists?
```

The frontend establishes:

```text
How should the user interact with the system?
```

These responsibilities should not be mixed.

---

# 52. Authentication Testing

Authentication should have comprehensive tests.

### Registration

Test:

* valid registration
* missing fields
* invalid email
* invalid password
* duplicate account
* password hashing

### Login

Test:

* valid credentials
* invalid password
* unknown account
* malformed request
* token/session creation

### Protected requests

Test:

* no authentication
* valid authentication
* expired authentication
* malformed token
* authenticated user accessing own data
* authenticated user accessing another user's data

---

# 53. Security Integration Tests

At minimum, verify:

```text
Unauthenticated → protected endpoint → 401
Authenticated → protected endpoint → allowed
Authenticated → another user's resource → rejected
```

These tests are critical because authentication that works in isolation is not enough.

---

# 54. Authentication Development Checklist

### Registration

* [ ] Define registration request DTO
* [ ] Validate registration input
* [ ] Check account uniqueness
* [ ] Hash password
* [ ] Persist user
* [ ] Return safe response

### Login

* [ ] Define login DTO
* [ ] Authenticate credentials
* [ ] Generate authentication credential
* [ ] Return safe response
* [ ] Handle invalid credentials

### Protected Requests

* [ ] Configure Spring Security
* [ ] Validate authentication
* [ ] Establish security context
* [ ] Protect application routes
* [ ] Enforce ownership

### Security

* [ ] Secure password hashing
* [ ] No plaintext credentials
* [ ] No secrets in source code
* [ ] No sensitive information in logs
* [ ] Token expiration
* [ ] Appropriate CORS configuration

---

# 55. Authentication Rules

1. Never store plaintext passwords.
2. Use Spring Security for authentication infrastructure.
3. Keep authentication centralized.
4. Do not trust user IDs supplied by the frontend.
5. Derive the current user from the authenticated security context.
6. Keep access tokens short-lived where practical.
7. Never place secrets in frontend code.
8. Never log credentials or tokens.
9. Return generic authentication failure messages where appropriate.
10. Validate all authentication input.
11. Protect all non-public API endpoints.
12. Keep frontend route protection separate from backend security.
13. Test authentication and ownership together.
14. Add refresh tokens only when their complexity is justified.
15. Keep password-reset and email-verification features separate from basic login until required.

---

# 56. Authentication Mental Model

```text
                    USER
                      │
                      ▼
                 Login Form
                      │
                      ▼
              POST /auth/login
                      │
                      ▼
              Spring Security
                      │
                Verify Password
                      │
                      ▼
              Authentication
                      │
                      ▼
               Access Token
                      │
                      ▼
               React API Client
                      │
             Authorization Header
                      │
                      ▼
              Spring Security
                      │
                Validate Token
                      │
                      ▼
              Current User
                      │
                      ▼
                Controller
                      │
                      ▼
                 Service
                      │
                      ▼
               User's Data
```

The central principle is:

> **Authentication establishes a trusted identity for each request; authorization then determines what that identity is allowed to access.**
