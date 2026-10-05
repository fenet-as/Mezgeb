# Security

## 1. Purpose

This document defines the production security strategy for Mezgeb.

Security is treated as a system-wide responsibility covering:

* application code
* authentication
* authorization
* user data
* API security
* frontend security
* database security
* infrastructure
* secrets
* dependencies
* CI/CD
* monitoring
* incident response

The goal is not to eliminate every possible security risk. The goal is to identify important risks, reduce unnecessary exposure, and establish secure defaults.

---

# 2. Security Principles

Mezgeb follows these principles:

1. **Never trust client-controlled data.**
2. **The backend is the security boundary.**
3. **Users can access only resources they are authorized to access.**
4. **Secrets remain server-side.**
5. **Use least privilege wherever practical.**
6. **Collect and expose only necessary data.**
7. **Validate input at the backend.**
8. **Use secure defaults.**
9. **Do not expose internal implementation details to users.**
10. **Security-sensitive behavior should be tested.**
11. **Dependencies and infrastructure must be kept reasonably up to date.**
12. **Security decisions should be documented.**

---

# 3. Threat Model

Mezgeb is a web application that stores private learning data.

Important assets include:

```text id="m7q3v9"
User accounts
Passwords
Authentication credentials/tokens
Goals
Tasks
Learning sessions
Journal entries
Progress history
Profile information
Database credentials
JWT secrets
Infrastructure credentials
```

Potential attackers include:

```text id="x2m8q4"
Unauthenticated Internet users
Malicious authenticated users
Compromised accounts
Automated bots
Malicious clients
Compromised dependencies
```

---

# 4. Security Boundaries

The major security boundaries are:

```text id="q8m3v7"
Browser
   │
   │ HTTPS
   ▼
Frontend
   │
   │ HTTPS / REST
   ▼
Backend
   │
   ├──────────────► PostgreSQL
   │
   └──────────────► MongoDB
```

The browser is considered untrusted.

The frontend is considered untrusted.

The backend enforces security.

---

# 5. Authentication vs Authorization

These are separate concerns.

### Authentication

Answers:

> Who is this user?

### Authorization

Answers:

> What is this authenticated user allowed to access?

For example:

```text id="v4m8q2"
Authentication:
User 123 is logged in.

Authorization:
User 123 may access Goal 456
because Goal 456 belongs to User 123.
```

Both must be enforced by the backend.

---

# 6. Password Security

Passwords must never be stored as plaintext.

The backend should use a strong password-hashing algorithm such as BCrypt.

Conceptually:

```text id="3q7m8v"
User Password
      ↓
Password Hashing
      ↓
Stored Hash
```

During login:

```text id="m2x8q5"
Entered Password
      ↓
Hash Verification
      ↓
Match / Reject
```

The original password must never be recoverable from the database.

---

# 7. Password Policy

The application should establish reasonable password requirements.

The policy should balance:

* security
* usability
* accessibility

Avoid unnecessarily restrictive rules such as requiring arbitrary combinations of symbols unless there is a documented security reason.

Longer passwords/passphrases should be supported.

---

# 8. Authentication Tokens

The initial authentication architecture uses JWT-based authentication.

Tokens should have:

* an expiration time
* a user identity
* appropriate claims
* secure signing
* validation on every protected request

The JWT signing secret must remain server-side.

---

# 9. Token Storage

Token storage is a security-sensitive design decision.

Possible approaches include:

### HttpOnly secure cookie

Advantages:

* JavaScript cannot directly read the token
* reduces exposure to token theft through some XSS scenarios

Requires careful CSRF considerations.

### Browser storage

Examples:

```text id="x8m3q2"
localStorage
sessionStorage
```

These are accessible to JavaScript and therefore more exposed if malicious JavaScript executes in the application.

The final token-storage strategy must be explicitly chosen before production deployment.

---

# 10. HTTPS

All production authentication and application traffic must use HTTPS.

HTTPS protects:

```text id="q7m3v8"
Credentials
Authentication tokens/cookies
Journal content
Goals
Tasks
API requests
```

HTTP should redirect to HTTPS where appropriate.

---

# 11. Session and Token Expiration

Authentication credentials should not remain valid indefinitely.

Tokens should have appropriate expiration.

Future authentication improvements may include:

```text id="m4q8v2"
Short-lived access tokens
Refresh tokens
Token rotation
Session revocation
```

The exact strategy will be finalized during authentication implementation.

---

# 12. Logout

Logout behavior depends on the authentication strategy.

For client-managed credentials, logout should remove the client's authentication state.

For stateless JWTs, simply deleting a token from the client does not inherently invalidate a previously issued token.

If stronger server-side revocation becomes necessary, a session or token-revocation mechanism can be introduced.

---

# 13. Authorization Model

The initial authorization model is ownership-based.

```text id="8m3q7v"
User
 ├── Goals
 │    └── Milestones
 │         └── Tasks
 │
 ├── Learning Sessions
 │
 ├── Journal Entries
 │
 └── Activity
```

A user should be able to access only their own private resources.

---

# 14. Ownership Checks

Every protected resource request should verify ownership.

Example:

```text id="q2m8v4"
GET /api/v1/goals/{goalId}
```

The backend must verify:

```text id="m7x3q9"
Authenticated User
       ↓
Owns Requested Goal?
       ↓
Yes → Continue
No  → Reject
```

The frontend must never be responsible for this security decision.

---

# 15. Insecure Authorization Pattern

Never rely on:

```text id="8q4m2v"
if (userId === requestedUserId)
```

from the browser.

A malicious user can modify client-side requests.

The backend must determine the authenticated user from the authentication context.

---

# 16. API Authentication

Protected endpoints should require authentication.

For example:

```text id="m3q8v7"
GET /api/v1/goals
```

should reject unauthenticated requests.

Public endpoints should be intentionally identified.

For example:

```text id="x7m2q9"
POST /api/v1/auth/register
POST /api/v1/auth/login
```

---

# 17. HTTP Status Codes

Security-related responses should use appropriate HTTP statuses.

Common cases:

```text id="q8m4v2"
401 Unauthorized
→ Authentication missing or invalid

403 Forbidden
→ Authenticated but not permitted

404 Not Found
→ Resource does not exist or may intentionally be hidden
```

The exact response should avoid unnecessarily revealing private resource existence.

---

# 18. IDOR Prevention

Insecure Direct Object Reference vulnerabilities occur when a user can access another user's resource simply by changing an ID.

For example:

```text id="m7q3x8"
GET /api/v1/goals/123
```

Changing:

```text id="v2m8q4"
123 → 124
```

must not allow access to another user's goal.

Ownership must be verified server-side.

This applies to:

* goals
* milestones
* tasks
* sessions
* journal entries
* other private resources

---

# 19. Input Validation

All user-controlled input must be validated on the backend.

Examples:

```text id="q3m7v8"
Email
Password
Goal title
Goal description
Task title
Session duration
Journal content
Dates
Tags
IDs
Query parameters
```

Frontend validation improves UX.

Backend validation provides the security boundary.

---

# 20. SQL Injection

Database queries must use safe parameterized mechanisms.

Spring Data JPA and parameterized queries should be preferred over manually concatenating user input into SQL.

Avoid patterns such as:

```text id="m8q2v7"
"SELECT * FROM goals WHERE title = '" + userInput + "'"
```

Use framework-supported parameterization instead.

---

# 21. NoSQL Injection

MongoDB queries must also avoid blindly interpreting user-controlled objects as query operators.

Input should be validated and transformed into expected application types before constructing queries.

Do not accept arbitrary query structures directly from clients.

---

# 22. Cross-Site Scripting (XSS)

XSS occurs when malicious content is interpreted as executable browser code.

Mezgeb may store user-generated content, especially journal entries.

Important protections include:

* safe rendering
* output escaping
* avoiding unsafe HTML injection
* sanitizing rich HTML if HTML is intentionally supported
* Content Security Policy where appropriate

---

# 23. Journal Content Security

Journal entries are user-generated content.

If the journal initially supports plain text or Markdown, rendering must be handled safely.

If raw HTML is eventually supported, it must be sanitized before being rendered.

Never assume stored user content is safe simply because it came from Mezgeb's own database.

---

# 24. React and XSS

React escapes normal text content by default.

However, APIs such as:

```text id="7m3q8v"
dangerouslySetInnerHTML
```

require special care.

Avoid using them unless there is a documented requirement.

If used, content must be sanitized appropriately.

---

# 25. Cross-Site Request Forgery

CSRF protection depends partly on authentication architecture.

If authentication uses cookies, CSRF protections become important.

Possible protections include:

* SameSite cookie settings
* CSRF tokens where required
* origin checks
* secure cookie configuration

If authentication uses Authorization headers with tokens that are not automatically attached by the browser, the CSRF threat model differs.

The final strategy should be documented with the chosen authentication mechanism.

---

# 26. CORS

CORS should allow only trusted application origins.

Development:

```text id="q2m8v7"
http://localhost:5173
```

Production:

```text id="m4x7q9"
https://mezgeb.example.com
```

Avoid:

```text id="8q3m2v"
Access-Control-Allow-Origin: *
```

for authenticated production APIs unless there is a specific reason.

CORS does not replace authorization.

---

# 27. Security Headers

The production frontend/backend infrastructure should consider appropriate security headers.

Examples include:

```text id="m7q2v8"
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
Strict-Transport-Security
```

The exact configuration depends on the hosting architecture and application requirements.

Security headers should be tested rather than copied blindly.

---

# 28. Content Security Policy

A Content Security Policy can reduce the impact of certain XSS attacks by restricting what resources the browser can execute or load.

A future production configuration may define allowed:

* scripts
* styles
* images
* fonts
* API connections
* frames

CSP should be introduced carefully because an overly restrictive policy can break legitimate application functionality.

---

# 29. Rate Limiting

Rate limiting should eventually protect sensitive endpoints.

Especially:

```text id="q3m8v7"
Login
Registration
Password reset
Email verification
Expensive API operations
```

Potential responses include:

```text id="m8x2q4"
429 Too Many Requests
```

The initial implementation may rely partly on hosting infrastructure before introducing application-level distributed rate limiting.

---

# 30. Brute-Force Protection

Authentication endpoints should be protected against repeated automated attempts.

Possible protections:

* rate limiting
* progressive delays
* account protection
* monitoring
* generic authentication errors

Avoid revealing whether an email address is registered through overly specific error messages.

---

# 31. Account Enumeration

Avoid responses that allow attackers to determine which accounts exist.

For example, registration or password-reset responses should avoid unnecessarily revealing:

```text id="7m4q8x"
"This email belongs to an existing account."
```

when that information is not required.

---

# 32. Sensitive Error Messages

Production errors should not expose:

```text id="q8m3v2"
Stack traces
SQL queries
Database credentials
File paths
Internal class names
JWT secrets
Infrastructure details
```

Users should receive safe messages.

Developers can receive detailed information through protected logs.

---

# 33. Logging Security

Logs should never contain:

```text id="m7x3q9"
Passwords
JWT secrets
Access tokens
Database passwords
Private API keys
```

Be cautious with logging:

* request bodies
* journal content
* authentication headers
* cookies
* personal information

---

# 34. Database Security

Production databases should:

* require authentication
* use strong credentials
* restrict network access
* use encrypted connections where appropriate
* use least-privilege accounts
* have backups
* be monitored

The application should not connect using a database superuser.

---

# 35. Database Credentials

Database credentials must be:

```text id="q4m8v2"
Stored securely
Different per environment
Rotatable
Unavailable to frontend code
Unavailable in Git
```

Database credentials should be supplied through secure runtime configuration.

---

# 36. Least Privilege

Each service should have only the permissions it needs.

For example:

```text id="m8q3v7"
Backend
  ↓
Application DB User
  ↓
Required tables/collections
```

The backend does not need unrestricted administrative access during normal operation.

---

# 37. Data Privacy

Mezgeb stores personal learning information.

The application should minimize unnecessary collection of personal data.

Only collect information required for product functionality.

Potentially sensitive user-generated content such as journal entries should be treated as private user data.

---

# 38. Data Access

Users should only be able to access their own private data.

Administrative access, if introduced later, should be explicitly designed and audited.

There should not be an implicit assumption that an authenticated user can access arbitrary records.

---

# 39. Data Transmission

Sensitive application data should travel over HTTPS.

Avoid transmitting sensitive information through:

```text id="7q2m8v"
URL query parameters
```

when it should be placed in a request body or secure header.

For example, credentials should not appear in URLs.

---

# 40. Dependency Security

Third-party dependencies can introduce vulnerabilities.

The project should periodically review:

```text id="m3q8v7"
npm dependencies
Maven dependencies
Docker base images
Build tools
Infrastructure dependencies
```

Automated vulnerability scanning can be introduced into CI.

---

# 41. Dependency Updates

Dependencies should not be blindly updated in production.

Updates should follow:

```text id="q7m2v4"
Update
  ↓
Test
  ↓
Review
  ↓
Build
  ↓
Deploy
```

Security patches should receive appropriate priority.

---

# 42. Secrets Management

Production secrets include:

```text id="m8q3x7"
JWT_SECRET
DB_PASSWORD
MONGODB_URI
OAuth client secrets
External API keys
Cloud credentials
```

Secrets must:

* remain outside Git
* remain outside frontend builds
* not be logged
* be rotated when necessary
* have restricted access

---

# 43. Environment Separation

Each environment should have separate secrets.

```text id="q2m7v8"
Development
   ↓
Development Secrets

Test
   ↓
Test Secrets

Production
   ↓
Production Secrets
```

Never reuse production secrets for development or testing.

---

# 44. CI/CD Security

CI/CD pipelines can have access to sensitive credentials.

Therefore:

* production secrets should be restricted
* pull-request workflows should not receive production secrets unnecessarily
* deployment permissions should be limited
* workflow changes should be reviewed
* dependencies used by workflows should be trusted
* secrets should not be printed

---

# 45. Git Security

The repository must not contain:

```text id="m4x8q2"
.env files containing secrets
Private keys
Database passwords
JWT secrets
Cloud credentials
API keys
Access tokens
```

If a secret is accidentally committed, removing the file from Git history is not sufficient.

The secret itself should be considered compromised and rotated.

---

# 46. Secret Rotation

When a secret is compromised or needs scheduled rotation:

```text id="7q3m8v"
Generate New Secret
       ↓
Update Secure Configuration
       ↓
Deploy
       ↓
Verify
       ↓
Invalidate Old Secret
```

The exact process depends on the credential type.

---

# 47. Authentication Security Testing

Authentication tests should cover:

```text id="m8q2v7"
Valid registration
Invalid registration
Duplicate account
Valid login
Invalid password
Unknown account
Expired token
Invalid token
Missing token
Logout
Protected endpoints
```

---

# 48. Authorization Security Testing

Authorization tests should verify:

```text id="q3m7x8"
User A can access User A's goal
User A cannot access User B's goal
User A cannot modify User B's task
User A cannot delete User B's journal entry
```

These tests are particularly important because authorization bugs can expose private user data.

---

# 49. Security Testing in CI

Security-sensitive tests should run automatically.

Initial priority:

```text id="m7q4v2"
Authentication
Authorization
Ownership
Input validation
API access control
```

Later:

```text id="8x2m9q"
Dependency scanning
Static security analysis
E2E security flows
Container scanning
```

---

# 50. Frontend Security

The frontend should:

* avoid storing secrets
* safely render user content
* validate user input for UX
* avoid unsafe HTML
* use HTTPS in production
* avoid leaking sensitive information
* handle authentication state securely
* avoid exposing internal backend details

Frontend validation does not replace backend validation.

---

# 51. Backend Security

The backend should:

* authenticate protected requests
* authorize resource access
* validate input
* sanitize where required
* use safe database access
* handle errors safely
* protect sensitive configuration
* log securely
* apply appropriate security headers and policies
* restrict CORS

---

# 52. Infrastructure Security

Infrastructure should:

* restrict database access
* use HTTPS
* protect administrative interfaces
* restrict credentials
* keep services updated
* use secure networking
* maintain backups
* monitor failures

Managed services can reduce infrastructure-management burden but do not remove application security responsibilities.

---

# 53. Security Monitoring

Important security events may include:

```text id="q8m3v7"
Repeated failed logins
Unexpected authentication failures
Abnormal request rates
Repeated authorization failures
Database connectivity failures
Deployment anomalies
Unexpected application errors
```

Monitoring should focus on signals that can lead to actionable investigation.

---

# 54. Security Incident

A security incident may include:

```text id="m2q7v8"
Compromised account
Leaked secret
Unauthorized data access
Vulnerability exploitation
Compromised dependency
Database exposure
Infrastructure credential compromise
```

The response process is documented in:

```text id="x7m3q9"
07-production/incident-response.md
```

---

# 55. Security Response Priority

When a security issue is discovered:

```text id="q4m8v2"
1. Contain
2. Protect users/data
3. Rotate compromised credentials
4. Investigate
5. Fix vulnerability
6. Verify fix
7. Restore normal operation
8. Document the incident
```

The exact response depends on the incident.

---

# 56. Production Security Checklist

## Authentication

* [ ] Passwords hashed securely
* [ ] Authentication tokens protected
* [ ] Token expiration configured
* [ ] Logout behavior defined
* [ ] Brute-force protection considered

## Authorization

* [ ] Protected endpoints require authentication
* [ ] Ownership checks enforced
* [ ] Cross-user access tests exist
* [ ] Admin permissions explicitly defined if needed

## API

* [ ] Input validation enabled
* [ ] Safe database queries used
* [ ] CORS restricted
* [ ] Rate limiting considered
* [ ] Errors sanitized

## Frontend

* [ ] No secrets exposed
* [ ] Unsafe HTML avoided
* [ ] User content rendered safely
* [ ] HTTPS enabled

## Database

* [ ] Strong credentials
* [ ] Restricted access
* [ ] Least privilege
* [ ] Backups
* [ ] Encrypted connections where appropriate

## Infrastructure

* [ ] HTTPS
* [ ] Secure DNS
* [ ] Restricted administrative access
* [ ] Monitoring
* [ ] Secure secrets management

## CI/CD

* [ ] Production secrets protected
* [ ] Untrusted PRs cannot access production secrets
* [ ] Dependency scanning considered
* [ ] Build/deployment permissions restricted

---

# 57. Security Review Before Public Launch

Before Mezgeb becomes publicly available, review:

```text id="m8q3v7"
Authentication
Authorization
Token storage
CORS
CSRF
XSS
Input validation
SQL/NoSQL injection
Rate limiting
Secrets
Database access
HTTPS
Security headers
Dependencies
Logging
Backups
CI/CD permissions
```

Security should be reviewed again whenever major architectural changes are introduced.

---

# 58. Security Is Continuous

Security is not a one-time checklist.

The application changes over time:

```text id="q7m2v4"
New Feature
    ↓
New Data
    ↓
New Endpoint
    ↓
New Attack Surface
```

Every significant feature should therefore consider:

* authentication
* authorization
* input validation
* data privacy
* logging
* error handling
* abuse scenarios

---

# 59. Final Security Mental Model

Think of Mezgeb security as multiple layers:

```text id="8m3q7v"
             ┌───────────────────┐
             │     Users         │
             └─────────┬─────────┘
                       │
                    HTTPS
                       │
             ┌─────────▼─────────┐
             │    Frontend       │
             │ Safe Rendering    │
             └─────────┬─────────┘
                       │
                    HTTPS
                       │
             ┌─────────▼─────────┐
             │     Backend       │
             │ AuthN + AuthZ     │
             │ Validation        │
             │ Business Rules    │
             └─────────┬─────────┘
                       │
               ┌───────┴────────┐
               ▼                ▼
         ┌───────────┐    ┌───────────┐
         │ PostgreSQL│    │  MongoDB  │
         └───────────┘    └───────────┘
               │                │
               └───────┬────────┘
                       ▼
                  Backups
                  Monitoring
```

The central principle is:

> **Security must be enforced at the boundaries where trust changes, especially between the client and backend and between the application and persistent data.**
