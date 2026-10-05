# Development Setup

## 1. Purpose

This document defines how to set up the Mezgeb development environment locally.

The goal is for a developer to be able to:

* clone the project
* install dependencies
* configure environment variables
* start PostgreSQL and MongoDB
* run the backend
* run the frontend
* verify the application works
* run tests
* understand the basic development workflow

The setup should be reproducible and documented well enough that a new contributor can get started without guessing.

---

# 2. Project Structure

Mezgeb is organized as a full-stack application:

```text
mezgeb/
├── frontend/
├── backend/
├── docs/
└── README.md
```

The major responsibilities are:

```text
frontend/
    ↓
React application

backend/
    ↓
Spring Boot REST API

PostgreSQL
    ↓
Core structured data

MongoDB
    ↓
Journal documents
```

---

# 3. Required Software

The development environment should include:

| Tool            | Purpose                             |
| --------------- | ----------------------------------- |
| Git             | Version control                     |
| Node.js         | Frontend runtime/tooling            |
| npm             | Frontend package management         |
| Java            | Backend runtime                     |
| Maven           | Backend build/dependency management |
| PostgreSQL      | Relational database                 |
| MongoDB         | Document database                   |
| Docker          | Containerization                    |
| Docker Compose  | Local infrastructure                |
| IDE/editor      | Development                         |
| DBeaver         | PostgreSQL database inspection      |
| MongoDB Compass | MongoDB inspection                  |

Not every tool needs to be installed separately if Docker is used for the databases.

---

# 4. Recommended Versions

The project should use stable LTS versions where practical.

Initial targets:

```text
Node.js → current LTS
Java → 21 LTS
Spring Boot → project-selected stable version
PostgreSQL → project-selected supported version
MongoDB → project-selected supported version
```

Exact versions should be pinned in the repository once implementation begins.

The project should avoid silently changing major runtime versions during development.

---

# 5. Node.js

The frontend requires Node.js.

Verify installation:

```bash
node --version
```

and:

```bash
npm --version
```

The repository should eventually define its expected Node.js version using a mechanism such as:

```text
.nvmrc
```

or:

```text
package.json
engines
```

This reduces environment inconsistencies.

---

# 6. Java

The backend uses Java.

Verify:

```bash
java --version
```

Expected major version:

```text
Java 21
```

The backend should use the same Java version locally and in CI.

---

# 7. Maven

The backend uses Maven.

Verify:

```bash
mvn --version
```

Prefer the Maven Wrapper included in the project:

```text
./mvnw
mvnw.cmd
```

This allows developers to use the project's configured Maven version without requiring a matching global installation.

On Windows:

```bash
mvnw.cmd
```

On macOS/Linux:

```bash
./mvnw
```

---

# 8. Git

Verify:

```bash
git --version
```

Clone the repository:

```bash
git clone <repository-url>
```

Then:

```bash
cd mezgeb
```

The exact repository URL will be added once the project repository is created.

---

# 9. Repository Setup

After cloning:

```text
mezgeb/
├── frontend/
├── backend/
├── docs/
└── README.md
```

The first setup steps should be:

```bash
git status
```

Then inspect:

```bash
README.md
docs/
frontend/
backend/
```

The documentation should remain the source of truth for architectural decisions.

---

# 10. Frontend Installation

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide a local development URL, typically similar to:

```text
http://localhost:5173
```

The exact port can be configured if necessary.

---

# 11. Frontend Scripts

The frontend should provide predictable scripts.

Example:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

Additional scripts can be added later for:

```text
test:coverage
test:e2e
format
typecheck
```

The exact commands should match the actual project configuration.

---

# 12. Backend Installation

Navigate to the backend:

```bash
cd backend
```

Build the project:

```bash
./mvnw clean install
```

On Windows:

```bash
mvnw.cmd clean install
```

Run the application:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

The backend will expose the API on its configured local port.

A common initial choice is:

```text
http://localhost:8080
```

---

# 13. Backend Scripts

The backend should support common development operations through Maven.

Examples:

```bash
./mvnw test
```

```bash
./mvnw clean verify
```

```bash
./mvnw spring-boot:run
```

The exact Maven configuration should remain centralized in:

```text
pom.xml
```

---

# 14. Local Databases

Mezgeb requires:

```text
PostgreSQL
MongoDB
```

There are two possible local approaches.

### Option A — Local installation

Install both databases directly on the development machine.

### Option B — Docker

Run databases using Docker Compose.

Docker is preferred for reproducibility because developers do not need to manually configure different database installations.

---

# 15. Docker Compose

A development Compose setup can eventually look like:

```text
docker-compose.yml
```

with services conceptually similar to:

```text
services:
  postgres:
    image: postgres

  mongodb:
    image: mongo
```

The exact images, versions, ports, credentials, volumes, and health checks should be committed once implementation begins.

---

# 16. PostgreSQL Development Database

The local PostgreSQL database should have a dedicated development database.

Conceptually:

```text
Database:
mezgeb
```

Possible local connection:

```text
Host: localhost
Port: 5432
Database: mezgeb
Username: mezgeb
Password: development-only-password
```

These values are examples only and should be configured through environment variables.

---

# 17. MongoDB Development Database

MongoDB should similarly use a dedicated development database.

Conceptually:

```text
Database:
mezgeb
```

Possible local connection:

```text
Host: localhost
Port: 27017
Database: mezgeb
```

Authentication configuration can be added depending on the Docker/local setup.

---

# 18. Environment Variables

Environment-specific configuration should not be hardcoded.

The project should use:

```text
.env
```

or equivalent environment configuration.

A template should be committed:

```text
.env.example
```

The real `.env` should not be committed.

---

# 19. Frontend Environment Variables

Frontend variables can include:

```text
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_NAME=Mezgeb
VITE_APP_ENV=development
```

Because Vite exposes `VITE_*` variables to browser code, these values must never contain secrets.

Do not put:

```text
DATABASE_PASSWORD
JWT_SECRET
API_PRIVATE_KEY
```

in frontend environment variables.

---

# 20. Backend Environment Variables

Backend configuration may include:

```text
DB_URL
DB_USERNAME
DB_PASSWORD

MONGODB_URI

JWT_SECRET

CORS_ALLOWED_ORIGINS
```

The exact property names can be chosen during implementation.

Sensitive values must remain outside source control.

---

# 21. Example Environment Template

The repository can provide:

```text
.env.example
```

with placeholders such as:

```text
DB_URL=jdbc:postgresql://localhost:5432/mezgeb
DB_USERNAME=mezgeb
DB_PASSWORD=

MONGODB_URI=mongodb://localhost:27017/mezgeb

JWT_SECRET=

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Developers create their own local environment file from this template.

---

# 22. Environment Separation

The application should distinguish environments such as:

```text
development
test
production
```

Conceptually:

```text
application.yml
application-dev.yml
application-test.yml
application-prod.yml
```

Development configuration should never accidentally point to production databases.

---

# 23. Development Profile

When running locally:

```text
Spring profile = dev
```

The development environment can provide:

* local PostgreSQL
* local MongoDB
* development logging
* local CORS configuration
* development API settings

Production configuration should remain separate.

---

# 24. Test Environment

Tests should not depend on a developer's normal development database whenever possible.

The test environment should provide isolated data.

Possible approaches include:

```text
H2
Testcontainers
Dedicated test PostgreSQL/MongoDB
```

For realistic integration tests, Testcontainers can eventually provide temporary PostgreSQL and MongoDB instances.

This can be introduced after the basic application is working.

---

# 25. Starting the Full Application

A typical development session will involve:

### Terminal 1 — Databases

```bash
docker compose up -d
```

### Terminal 2 — Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Terminal 3 — Frontend

```bash
cd frontend
npm run dev
```

Then:

```text
Browser
   ↓
React frontend
   ↓
Spring Boot API
   ↓
PostgreSQL / MongoDB
```

---

# 26. Verifying PostgreSQL

Use DBeaver or another PostgreSQL client.

Verify:

```text
Host: localhost
Port: 5432
Database: mezgeb
```

After the backend starts and migrations run, expected tables should eventually include:

```text
users
goals
milestones
tasks
learning_sessions
activity
```

---

# 27. Verifying MongoDB

Use MongoDB Compass.

Verify:

```text
Host: localhost
Port: 27017
Database: mezgeb
```

The journal collection should eventually appear after journal data is created.

Conceptually:

```text
mezgeb
└── journal_entries
```

---

# 28. Database Migrations

PostgreSQL schema changes should be managed through migrations.

The project should use a migration tool such as:

```text
Flyway
```

Instead of manually creating tables, migrations should define the schema.

Example:

```text
V1__initial_schema.sql
```

Later:

```text
V2__add_activity.sql
V3__add_goal_target_date.sql
```

---

# 29. First-Time Database Setup

A new developer should not need to manually create every table.

The intended flow is:

```text
Start PostgreSQL
       ↓
Start MongoDB
       ↓
Start Spring Boot
       ↓
Flyway migrations
       ↓
Database ready
```

This is one of the reasons database migrations are important.

---

# 30. API Verification

Once the backend starts, verify that the API is reachable.

For example:

```text
GET /api/v1/...
```

The application should eventually expose health information through an appropriate health endpoint.

Spring Boot Actuator may be introduced for this purpose.

---

# 31. OpenAPI / Swagger

The backend should expose API documentation during development.

A typical setup may provide:

```text
Swagger UI
OpenAPI specification
```

This allows developers to inspect:

* endpoints
* request bodies
* response bodies
* authentication requirements
* status codes

The exact URL will depend on the OpenAPI configuration.

---

# 32. Frontend-to-Backend Connection

The frontend should obtain the API base URL from configuration:

```text
VITE_API_URL
```

For example:

```text
VITE_API_URL=http://localhost:8080/api/v1
```

The frontend API client should build requests from this base URL.

Avoid scattering:

```text
http://localhost:8080
```

throughout the codebase.

---

# 33. CORS

During local development:

```text
Frontend
http://localhost:5173
        ↓
Backend
http://localhost:8080
```

These are different origins.

Spring Security/backend configuration must therefore allow the development frontend origin.

For example:

```text
http://localhost:5173
```

Production origins should be configured separately.

---

# 34. Authentication During Development

The frontend should eventually communicate with the backend using the authentication mechanism defined in:

```text
04-backend/authentication.md
```

The development environment should allow the full flow:

```text
Register
   ↓
Login
   ↓
Authenticated request
   ↓
Protected endpoint
```

Do not create a permanent fake authentication mechanism just to make development easier.

Temporary development mocks may be used while a feature is being built, but they should be clearly isolated.

---

# 35. Development Seed Data

A development environment may eventually provide seed data.

For example:

```text
Demo User
 ├── React Goal
 │    ├── React Fundamentals
 │    └── Hooks
 ├── DSA Goal
 ├── Learning Sessions
 └── Journal Entries
```

Seed data should be clearly marked as development data.

It should never accidentally be inserted into production.

---

# 36. Resetting Development Data

The development environment should eventually document how to reset local data.

For example:

```bash
docker compose down -v
```

may remove development database volumes depending on the Compose configuration.

This is destructive.

The documentation should clearly warn developers before using commands that remove data.

---

# 37. Running Frontend Tests

Run:

```bash
npm test
```

or:

```bash
npm run test:run
```

The frontend testing strategy is defined in:

```text
03-frontend/testing.md
```

Tests should not require a running production backend unless specifically testing end-to-end behavior.

---

# 38. Running Backend Tests

Run:

```bash
./mvnw test
```

Backend tests should cover:

* services
* controllers
* validation
* authorization
* repositories
* authentication
* API behavior

Integration tests may use isolated databases.

---

# 39. Running the Build

Frontend:

```bash
npm run build
```

Backend:

```bash
./mvnw clean verify
```

A successful build should be part of the normal development workflow.

---

# 40. Recommended Local Workflow

A typical feature workflow:

```text
1. Pull latest changes
2. Read relevant documentation
3. Start databases
4. Start backend
5. Start frontend
6. Implement feature
7. Run focused tests
8. Run lint/type checks
9. Run full tests
10. Build application
11. Review changes
12. Commit
```

This should remain lightweight for small changes.

---

# 41. Documentation-First Development

Before implementing a significant feature:

```text
Product requirement
        ↓
User flow
        ↓
UI/API design
        ↓
Implementation
        ↓
Testing
```

This prevents the implementation from drifting away from the product design.

The documentation does not need to predict every implementation detail in advance.

---

# 42. Working on Frontend Only

A developer working on frontend UI may initially use:

```text
Mock API
```

or:

```text
MSW
```

for isolated development.

This can allow UI work without waiting for the backend feature to be completed.

However, mock behavior should match the documented API contract.

---

# 43. Working on Backend Only

Backend development can use:

```text
Swagger/OpenAPI
Postman
curl
```

to test API behavior before the frontend is connected.

The API contract should remain consistent with:

```text
04-backend/api-specification.md
```

---

# 44. Useful Development Tools

Recommended tools:

### Frontend

```text
VS Code
React DevTools
Browser DevTools
```

### Backend

```text
IntelliJ IDEA
VS Code
Spring Boot tooling
```

### Databases

```text
DBeaver
MongoDB Compass
```

### API

```text
Swagger UI
Postman
curl
```

Developers may use different IDEs; the repository should not depend on a particular editor.

---

# 45. Logging

Development logging should help developers understand application behavior.

Useful information includes:

```text
startup
database connection
request failures
authentication failures
unexpected exceptions
```

Avoid logging:

```text
passwords
tokens
secrets
private user content
```

Production logging should be more carefully controlled.

---

# 46. Debugging Order

When something doesn't work, debug from the outside inward.

Example:

```text
Browser
 ↓
Network request
 ↓
Frontend API client
 ↓
Backend endpoint
 ↓
Service
 ↓
Repository
 ↓
Database
```

Check each boundary rather than immediately changing multiple parts of the system.

---

# 47. Common Frontend Problems

If the UI cannot load data, check:

```text
1. Is frontend running?
2. Is VITE_API_URL correct?
3. Is backend running?
4. Is the request reaching the backend?
5. Is CORS configured?
6. Is authentication valid?
7. What status code was returned?
8. What does the response body contain?
```

---

# 48. Common Backend Problems

If the API fails, check:

```text
1. Is Java configured correctly?
2. Is Spring Boot starting?
3. Are environment variables loaded?
4. Is PostgreSQL running?
5. Is MongoDB running?
6. Did migrations succeed?
7. Is the endpoint mapped correctly?
8. Is authentication configured?
9. Is the exception visible in logs?
```

---

# 49. Common Database Problems

If database operations fail, check:

```text
1. Database running?
2. Correct host/port?
3. Correct database name?
4. Correct credentials?
5. Migration successful?
6. Table/collection exists?
7. Query correct?
8. Ownership condition correct?
```

Do not immediately modify application code before confirming the database connection and schema.

---

# 50. Git and Local Changes

Before starting work:

```bash
git status
```

Pull/rebase according to the project's Git workflow.

Avoid committing:

```text
.env
database credentials
generated files
IDE-specific files
node_modules
build artifacts
```

The `.gitignore` file should protect common generated and sensitive files.

---

# 51. Dependency Installation

When adding a dependency:

```text
1. Confirm it solves a real problem.
2. Check whether the existing stack already provides the functionality.
3. Add the dependency.
4. Document important architectural reasons.
5. Run tests/build.
```

Avoid adding packages simply because they are popular.

---

# 52. Dependency Philosophy

Mezgeb is also a learning project.

Therefore:

> Prefer understanding the underlying concept before adding a library that hides it.

For example:

```text
React state
```

should be understood before introducing a large state-management library.

Similarly:

```text
HTTP requests
```

should be understood before introducing multiple abstraction layers.

Libraries should reduce meaningful complexity, not hide concepts the project is intended to teach.

---

# 53. Local Development Checklist

### Initial setup

* [ ] Clone repository
* [ ] Install Node.js
* [ ] Install/enable Java 21
* [ ] Verify Maven Wrapper
* [ ] Install Docker
* [ ] Start PostgreSQL
* [ ] Start MongoDB
* [ ] Create local environment configuration
* [ ] Install frontend dependencies
* [ ] Build backend
* [ ] Run migrations

### Verify

* [ ] Frontend starts
* [ ] Backend starts
* [ ] PostgreSQL connects
* [ ] MongoDB connects
* [ ] API is reachable
* [ ] Swagger/OpenAPI works
* [ ] Frontend can communicate with backend
* [ ] Authentication works

### Development

* [ ] Run tests
* [ ] Run lint
* [ ] Run type checks
* [ ] Run backend verification
* [ ] Build frontend
* [ ] Review Git changes

---

# 54. First-Time Setup Summary

The shortest intended setup is:

```text
Clone repository
      ↓
Install prerequisites
      ↓
Configure .env
      ↓
Start databases
      ↓
Install frontend dependencies
      ↓
Run backend
      ↓
Run frontend
      ↓
Open application
      ↓
Register
      ↓
Create first goal
```

A developer should be able to reach the actual learning workflow without manually configuring dozens of unrelated services.

---

# 55. Development Environment Mental Model

```text
                 Developer
                     │
              ┌──────┴──────┐
              │             │
           Frontend       Backend
           React          Spring Boot
              │             │
              └──────┬──────┘
                     │
              ┌──────┴──────┐
              │             │
          PostgreSQL      MongoDB
          structured      journal
             data          data
```

Docker provides reproducible local infrastructure.

Environment variables provide environment-specific configuration.

Migrations provide reproducible database schemas.

Tests provide confidence in changes.

---

# 56. Development Principle

The development environment should optimize for:

```text
Reproducibility
     ↓
Understandability
     ↓
Fast feedback
     ↓
Reliable testing
```

The goal is not to recreate a large production infrastructure locally.

It is to create a development environment that is:

> **Simple enough to understand, reproducible enough to trust, and complete enough to develop Mezgeb realistically.**
