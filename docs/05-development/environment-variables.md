# Environment Variables & Configuration

## 1. Purpose

This document defines how Mezgeb manages environment-specific configuration and sensitive values.

Environment variables allow the application to change configuration between:

* development
* testing
* staging, if introduced
* production

without changing application source code.

The primary goals are:

* keep secrets out of source control
* separate environments cleanly
* make local setup reproducible
* avoid hardcoded infrastructure configuration
* provide predictable configuration for frontend and backend
* make deployment configuration explicit

---

# 2. Configuration Principles

Mezgeb follows these principles:

1. **Configuration should not be hardcoded when it varies by environment.**
2. **Secrets must never be committed to Git.**
3. **Frontend environment variables are not secret.**
4. **Backend secrets must remain server-side.**
5. **`.env.example` files document required configuration without containing real secrets.**
6. **Development, testing, and production configurations should be isolated.**
7. **Configuration should be validated when the application starts.**
8. **Environment variables should have clear names and ownership.**

---

# 3. Environment Model

Mezgeb initially uses:

```text
Development
    ↓
Test
    ↓
Production
```

A staging environment may be introduced later if deployment complexity justifies it.

---

# 4. Frontend Configuration

The frontend uses Vite.

Vite exposes client-side environment variables through:

```text id="p4m8xc"
import.meta.env
```

Only variables prefixed with:

```text
VITE_
```

are exposed to frontend code.

Example:

```text id="f8q2md"
VITE_API_URL=http://localhost:8080/api/v1
```

---

# 5. Important Frontend Security Rule

Anything exposed through a Vite `VITE_*` variable must be treated as **public**.

A frontend application is shipped to the user's browser.

Therefore, never put these in frontend environment variables:

```text id="q5j7vn"
Database passwords
JWT signing secrets
Private API keys
Cloud provider secret keys
SMTP passwords
Encryption keys
Service-account credentials
```

Even if a variable is stored in a `.env` file during development, it becomes part of the frontend build if exposed to the client.

---

# 6. Frontend Environment Variables

Initial frontend configuration:

```text id="c2v9mx"
VITE_API_URL
VITE_APP_NAME
VITE_APP_ENV
```

### `VITE_API_URL`

Base URL of the backend API.

Development:

```text
VITE_API_URL=http://localhost:8080/api/v1
```

Production:

```text
VITE_API_URL=https://api.example.com/api/v1
```

The actual production domain will be defined during deployment.

---

### `VITE_APP_NAME`

Application name.

Example:

```text
VITE_APP_NAME=Mezgeb
```

Used for:

* page titles
* application branding
* UI configuration

---

### `VITE_APP_ENV`

Identifies the current frontend environment.

Examples:

```text
VITE_APP_ENV=development
```

or:

```text
VITE_APP_ENV=production
```

This should not be treated as a security mechanism.

---

# 7. Frontend `.env.example`

The repository should contain:

```text id="7m1q4b"
frontend/.env.example
```

Example:

```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_NAME=Mezgeb
VITE_APP_ENV=development
```

The example file contains configuration structure, not secrets.

---

# 8. Frontend Local Environment

Developers can create:

```text id="d9x3kf"
frontend/.env.local
```

or another appropriate local environment file depending on the Vite setup.

Example:

```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_NAME=Mezgeb
VITE_APP_ENV=development
```

Local environment files containing personal configuration should not be committed unless explicitly intended.

---

# 9. Backend Configuration

The Spring Boot backend has access to server-side environment variables.

Backend configuration may include:

```text id="q7m2pc"
Database connection
MongoDB connection
JWT configuration
CORS configuration
Application environment
Server configuration
External service credentials
```

Unlike frontend variables, backend environment variables can contain secrets because they remain on the server.

---

# 10. Backend Environment Variables

Initial configuration may include:

```text id="1x8v5m"
DB_URL
DB_USERNAME
DB_PASSWORD

MONGODB_URI

JWT_SECRET

CORS_ALLOWED_ORIGINS

APP_ENV
```

The exact names may be adjusted during implementation, but naming should remain consistent.

---

# 11. PostgreSQL Configuration

Example:

```env
DB_URL=jdbc:postgresql://localhost:5432/mezgeb
DB_USERNAME=mezgeb
DB_PASSWORD=development-password
```

These values configure the application's PostgreSQL connection.

The development password is only for local development.

Production credentials must never be copied into local configuration.

---

# 12. MongoDB Configuration

Example:

```env
MONGODB_URI=mongodb://localhost:27017/mezgeb
```

For a hosted MongoDB deployment, the URI will be supplied through the production environment.

Example conceptually:

```text
MONGODB_URI=<production-secret>
```

The actual URI must never be committed.

---

# 13. JWT Configuration

The backend requires a secret for signing and validating tokens.

Example:

```env
JWT_SECRET=<local-development-secret>
```

The real secret must:

* be sufficiently random
* be stored outside Git
* differ between environments
* never be exposed to the frontend
* never appear in logs

Production must use a securely generated secret.

---

# 14. CORS Configuration

The backend should allow requests only from approved frontend origins.

Development example:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Production might use:

```env
CORS_ALLOWED_ORIGINS=https://mezgeb.example.com
```

The actual production domain will be determined during deployment.

Avoid:

```text
*
```

for authenticated production traffic unless there is a specific and justified reason.

---

# 15. Application Environment

The backend should know which environment it is running in.

Example:

```env
APP_ENV=development
```

Potential values:

```text
development
test
production
```

Spring profiles may be used alongside this configuration.

---

# 16. Spring Profiles

Spring Boot can separate environment-specific configuration using profiles.

Conceptually:

```text id="c8v4w1"
application.yml
application-dev.yml
application-test.yml
application-prod.yml
```

Common configuration belongs in:

```text
application.yml
```

Environment-specific configuration belongs in the appropriate profile.

Secrets should still be supplied through environment variables or a secure secret-management system rather than committed configuration files.

---

# 17. Configuration Precedence

The exact Spring Boot and Vite configuration precedence should be understood before relying on multiple configuration sources.

Avoid having the same setting defined in many places unnecessarily.

Prefer a clear model:

```text id="5n7q2x"
Environment
     ↓
Application configuration
     ↓
Validated application config
     ↓
Application code
```

---

# 18. Configuration Validation

Required configuration should be validated when the application starts.

For example, the backend should not successfully start if a required production secret is missing.

Potential required values:

```text id="4m9c7p"
Database URL
Database username
Database password
MongoDB URI
JWT secret
CORS origin
```

This is preferable to discovering a missing variable only after a user makes a request.

---

# 19. `.env.example` vs `.env`

### `.env.example`

Purpose:

> Tell developers what configuration is required.

Contains:

```text
variable names
safe example values
development defaults where appropriate
```

It can be committed.

### `.env`

Purpose:

> Store actual local configuration.

May contain:

```text
passwords
local secrets
tokens
private configuration
```

It should normally be ignored by Git.

---

# 20. Git Rules

The repository should generally ignore:

```text id="n4w6cq"
.env
.env.local
.env.*.local
```

while committing:

```text
.env.example
```

The exact ignore patterns should be reviewed against the tools actually used.

---

# 21. Secret Management

For local development:

```text
.env.local
```

may be sufficient.

For CI/CD and production, use the secret-management facilities provided by the deployment platform or CI provider.

Examples of secret categories:

```text id="8j3m5q"
Database credentials
JWT secret
Cloud credentials
External API keys
Email credentials
OAuth secrets
```

Secrets should not be:

* committed to Git
* placed in frontend code
* printed in logs
* included in screenshots
* written in documentation
* shared through public issue trackers

---

# 22. Development Environment

Example:

```text id="x2c8mf"
APP_ENV=development

DB_URL=jdbc:postgresql://localhost:5432/mezgeb
DB_USERNAME=mezgeb
DB_PASSWORD=<local-password>

MONGODB_URI=mongodb://localhost:27017/mezgeb

JWT_SECRET=<development-secret>

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

The development environment may use simple local credentials because it does not contain production data.

---

# 23. Test Environment

The test environment should be isolated from development data.

It should not accidentally connect to the developer's normal database.

Potential approaches include:

```text id="m7x2pv"
Dedicated test database
        or
Testcontainers
        or
In-memory test infrastructure where appropriate
```

The exact strategy will be finalized during implementation.

Example conceptual configuration:

```text
APP_ENV=test
DB_URL=<test-database>
MONGODB_URI=<test-database>
JWT_SECRET=<test-secret>
```

---

# 24. Production Environment

Production configuration must be managed outside the repository.

Conceptually:

```text id="j8p3xq"
Production Hosting
      │
      ├── Database credentials
      ├── MongoDB credentials
      ├── JWT secret
      ├── CORS origins
      └── External service credentials
```

The exact mechanism depends on the hosting provider.

Production values must never be copied into:

```text
README
documentation
Git commits
frontend source
screenshots
public configuration
```

---

# 25. CI/CD Environment Variables

GitHub Actions may require environment variables or secrets for:

* testing
* building
* deployment
* external services

Public configuration can be stored as normal variables where appropriate.

Sensitive values should be stored as CI secrets.

Conceptually:

```text id="4f7z1m"
GitHub Actions
      ↓
Secrets / Variables
      ↓
Build / Test / Deploy
```

CI configuration should never print secrets.

---

# 26. Frontend Build-Time Configuration

Because Vite variables are embedded into the frontend build, changing:

```text
VITE_API_URL
```

normally requires a new frontend build.

Therefore:

```text id="8q2v5m"
Environment Variables
        ↓
Vite Build
        ↓
Static Frontend Assets
```

The production deployment process should supply the correct frontend configuration before building.

---

# 27. Backend Runtime Configuration

Backend configuration can generally be supplied at runtime.

Conceptually:

```text id="m3x7q8"
Production Environment
       ↓
Spring Boot
       ↓
Configuration
       ↓
Application
```

This allows backend infrastructure values to remain outside the application artifact.

---

# 28. Environment Naming

Use clear names.

Prefer:

```text
JWT_SECRET
DB_PASSWORD
MONGODB_URI
CORS_ALLOWED_ORIGINS
```

over vague names such as:

```text
SECRET
PASSWORD
URL
CONFIG
```

Names should communicate:

* what the variable controls
* which service it belongs to
* whether it is sensitive

---

# 29. Do Not Use Secrets as Feature Flags

Environment variables should primarily represent configuration.

Avoid using secrets or arbitrary environment variables as a substitute for application-level feature management.

For example, this is not a good long-term design:

```text
ENABLE_RANDOM_FEATURE=true
```

for every product behavior.

Feature flags should be introduced intentionally if the product eventually needs them.

---

# 30. Configuration Ownership

### Frontend

Owns:

```text
API URL
application name
public UI configuration
public environment information
```

### Backend

Owns:

```text
database configuration
authentication secrets
security configuration
CORS
server configuration
external service credentials
```

### Deployment

Owns:

```text
production values
deployment secrets
hosting configuration
CI/CD secrets
infrastructure credentials
```

---

# 31. Common Mistakes to Avoid

### Mistake 1 — Putting secrets in Vite variables

```env
VITE_JWT_SECRET=...
```

Never do this.

Anything prefixed with `VITE_` can become client-visible.

---

### Mistake 2 — Committing `.env`

Never commit:

```text
.env
```

when it contains actual secrets.

---

### Mistake 3 — Hardcoding production URLs

Avoid:

```ts
const API_URL = "https://api.example.com";
```

Use environment configuration instead.

---

### Mistake 4 — Logging secrets

Avoid:

```text
console.log(jwtSecret)
console.log(databasePassword)
```

and backend equivalents.

---

### Mistake 5 — Reusing production secrets locally

Development, testing, and production should have separate credentials.

---

### Mistake 6 — Using the same JWT secret everywhere

Each environment should have its own secret.

---

### Mistake 7 — Assuming environment variables are automatically safe

Environment variables are only a configuration mechanism.

Their security depends on:

* where they are stored
* who can access them
* whether they are exposed to the client
* whether they appear in logs or build artifacts

---

# 32. Configuration Checklist

## Repository

* [ ] `.gitignore` excludes local secret files
* [ ] `.env.example` exists
* [ ] No secrets are committed
* [ ] Required variables are documented

## Frontend

* [ ] Only public configuration uses `VITE_*`
* [ ] API URL is configurable
* [ ] Application name is configurable
* [ ] No secrets are exposed

## Backend

* [ ] Database configuration is externalized
* [ ] MongoDB configuration is externalized
* [ ] JWT secret is externalized
* [ ] CORS origins are configurable
* [ ] Required configuration is validated

## Testing

* [ ] Test database is isolated
* [ ] Test secrets differ from development
* [ ] Tests do not depend on production configuration

## Production

* [ ] Production secrets are stored securely
* [ ] Production JWT secret is unique
* [ ] Production database credentials are separate
* [ ] Production CORS is restricted
* [ ] Secrets are not logged
* [ ] CI/CD secrets are protected

---

# 33. Configuration Lifecycle

The intended configuration lifecycle is:

```text id="2z7m4q"
Define required variable
        ↓
Document in .env.example
        ↓
Configure local development
        ↓
Validate at startup/build
        ↓
Configure test environment
        ↓
Configure CI/CD
        ↓
Configure production
        ↓
Rotate secrets when necessary
```

---

# 34. Future Configuration

As Mezgeb grows, additional configuration may become necessary for:

```text
Email provider
OAuth providers
AI providers
Object storage
Redis
Monitoring
Analytics
Payment providers
External integrations
```

These should be added only when the corresponding feature is actually introduced.

Each new sensitive variable should be:

1. named clearly
2. documented
3. added to `.env.example` with a safe placeholder
4. excluded from Git secrets
5. configured separately per environment

---

# 35. Final Principle

Environment variables are not simply a way to hide configuration files.

They establish a boundary between:

```text
Application Code
        and
Environment-Specific Configuration
```

The most important rule is:

> **Public frontend configuration may be exposed. Server-side secrets must never be exposed to the client.**

And the second:

> **Every environment should be reproducible without sharing secrets through source control.**
