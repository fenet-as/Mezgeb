# Project Development Roadmap

## 1. Purpose

This roadmap defines the development phases for building Mezgeb from an empty repository into a complete, tested, deployable application.

It answers:

> **What should we build, and in what order?**

This roadmap is different from:

```text
01-product/roadmap.md
```

The product roadmap describes the evolution of Mezgeb as a product.

This roadmap describes the implementation process.

---

# 2. Development Philosophy

Mezgeb will be built incrementally.

The project should move through:

```text
Plan
 ↓
Foundation
 ↓
Core infrastructure
 ↓
Core features
 ↓
Integration
 ↓
Testing
 ↓
Deployment
 ↓
Polish
```

The goal is not to build everything at once.

Each phase should leave the project in a working state whenever practical.

---

# 3. High-Level Development Phases

```text
Phase 0  → Project Foundation
Phase 1  → Frontend Foundation
Phase 2  → Backend Foundation
Phase 3  → Authentication
Phase 4  → Goals & Milestones
Phase 5  → Tasks
Phase 6  → Learning Sessions
Phase 7  → Journal
Phase 8  → Dashboard & Activity
Phase 9  → Progress
Phase 10 → Full Integration
Phase 11 → Testing & Hardening
Phase 12 → Deployment
Phase 13 → Polish & Portfolio
```

The exact phase boundaries may change during implementation.

---

# 4. Phase 0 — Project Foundation

## Goal

Create the repository structure and development environment before implementing application functionality.

### Tasks

```text id="j2p8xs"
- [ ] Create Git repository
- [ ] Create frontend directory
- [ ] Create backend directory
- [ ] Create docs directory
- [ ] Add README
- [ ] Add .gitignore
- [ ] Initialize Git workflow
- [ ] Create .env.example files
- [ ] Configure development documentation
- [ ] Decide initial package versions
```

### Expected result

The repository should have a clean structure:

```text id="l5r9v0"
mezgeb/
├── frontend/
├── backend/
├── docs/
└── README.md
```

No product features are required yet.

---

# 5. Phase 1 — Frontend Foundation

## Goal

Create the React application and establish the frontend architecture.

### Tasks

```text id="d8zq1h"
- [ ] Initialize Vite + React + TypeScript
- [ ] Configure ESLint
- [ ] Configure Prettier
- [ ] Configure CSS Modules
- [ ] Create global styles
- [ ] Create design tokens
- [ ] Configure path aliases
- [ ] Create application shell
- [ ] Create layouts
- [ ] Configure React Router
- [ ] Create shared UI foundation
- [ ] Add loading state
- [ ] Add empty state
- [ ] Add error state
- [ ] Configure Vitest
- [ ] Configure React Testing Library
```

### Expected result

The application should run locally with:

```text id="m4z7bx"
React
TypeScript
Vite
Routing
Basic layout
Design system foundation
Testing foundation
```

---

# 6. Phase 2 — Backend Foundation

## Goal

Create the Spring Boot backend and establish the backend architecture.

### Tasks

```text id="9f1mce"
- [ ] Initialize Spring Boot application
- [ ] Configure Maven
- [ ] Configure application profiles
- [ ] Configure PostgreSQL
- [ ] Configure MongoDB
- [ ] Configure JPA
- [ ] Configure Flyway
- [ ] Create package structure
- [ ] Create global exception handling
- [ ] Create DTO conventions
- [ ] Create validation configuration
- [ ] Configure CORS
- [ ] Configure OpenAPI
- [ ] Create health endpoint
- [ ] Configure backend tests
```

### Expected result

The backend should:

```text id="2y3qgz"
Start successfully
       ↓
Connect to databases
       ↓
Run migrations
       ↓
Expose health endpoint
       ↓
Run tests
```

---

# 7. Phase 3 — Authentication

## Goal

Create a secure identity system before implementing user-owned learning data.

### Backend

```text id="3j8y5m"
- [ ] Create User entity
- [ ] Create UserRepository
- [ ] Create authentication DTOs
- [ ] Create registration service
- [ ] Create login service
- [ ] Configure password hashing
- [ ] Configure Spring Security
- [ ] Implement token authentication
- [ ] Implement current-user resolution
- [ ] Implement /auth/me
- [ ] Implement logout behavior
- [ ] Add authentication tests
```

### Frontend

```text id="y4m0zq"
- [ ] Create LoginPage
- [ ] Create RegisterPage
- [ ] Create authentication forms
- [ ] Create AuthProvider
- [ ] Create authentication hook
- [ ] Configure protected routes
- [ ] Handle authentication initialization
- [ ] Handle unauthorized responses
- [ ] Add authentication tests
```

### Expected result

A user can:

```text id="q0v7gd"
Register
 ↓
Login
 ↓
Access protected application
 ↓
Refresh page
 ↓
Remain correctly authenticated
 ↓
Logout
```

---

# 8. Phase 4 — Goals & Milestones

## Goal

Build the core learning structure.

```text id="i8t0cu"
Goal
 ↓
Milestones
```

### Backend

```text id="j4m6va"
- [ ] Create Goal entity
- [ ] Create GoalRepository
- [ ] Create Goal DTOs
- [ ] Create GoalService
- [ ] Create GoalController
- [ ] Implement ownership checks
- [ ] Create Milestone entity
- [ ] Create MilestoneRepository
- [ ] Create Milestone DTOs
- [ ] Create MilestoneService
- [ ] Create MilestoneController
- [ ] Add validation
- [ ] Add database constraints
- [ ] Add tests
```

### Frontend

```text id="4gk7fe"
- [ ] Create GoalsPage
- [ ] Create GoalCard
- [ ] Create GoalList
- [ ] Create GoalForm
- [ ] Create GoalDetailsPage
- [ ] Create MilestoneList
- [ ] Create MilestoneForm
- [ ] Add goal API functions
- [ ] Add milestone API functions
- [ ] Add queries/mutations
- [ ] Add loading states
- [ ] Add empty states
- [ ] Add error states
- [ ] Add tests
```

### Expected result

The user can:

```text id="3sj5kq"
Create Goal
 ↓
Open Goal
 ↓
Create Milestones
 ↓
Edit Goal
 ↓
Edit Milestones
 ↓
Delete/Archive where appropriate
```

---

# 9. Phase 5 — Tasks

## Goal

Add actionable learning tasks underneath milestones.

```text id="b1f2vp"
Goal
 ↓
Milestone
 ↓
Task
```

### Backend

```text id="x3s8e1"
- [ ] Create Task entity
- [ ] Create TaskRepository
- [ ] Create Task DTOs
- [ ] Create TaskService
- [ ] Create TaskController
- [ ] Implement task ownership through parent relationships
- [ ] Implement status changes
- [ ] Implement task completion
- [ ] Create activity integration
- [ ] Add tests
```

### Frontend

```text id="d3n5yk"
- [ ] Create TaskList
- [ ] Create TaskItem
- [ ] Create TaskForm
- [ ] Add task status UI
- [ ] Add completion interaction
- [ ] Add edit/delete behavior
- [ ] Add API integration
- [ ] Add loading/error states
- [ ] Add tests
```

### Expected result

The user can:

```text id="qv8s5f"
Create Task
 ↓
Work on Task
 ↓
Mark Task Complete
 ↓
Reopen Task
```

---

# 10. Phase 6 — Learning Sessions

## Goal

Allow users to record the actual time and activity spent learning.

### Backend

```text id="x4e9jv"
- [ ] Create LearningSession entity
- [ ] Create repository
- [ ] Create DTOs
- [ ] Create service
- [ ] Create controller
- [ ] Validate duration
- [ ] Associate session with goal
- [ ] Optionally associate milestone
- [ ] Record activity
- [ ] Add tests
```

### Frontend

```text id="b2v8xq"
- [ ] Create session form
- [ ] Create session list/history
- [ ] Add duration input
- [ ] Add topic
- [ ] Add description
- [ ] Add reflection
- [ ] Connect to API
- [ ] Add loading/error states
- [ ] Add tests
```

### Expected result

The user can:

```text id="98f6wq"
Study
 ↓
Record Session
 ↓
Describe What They Learned
 ↓
See Learning History
```

---

# 11. Phase 7 — Journal

## Goal

Add reflection and long-form learning records.

### Backend

```text id="z7b3qc"
- [ ] Configure MongoDB journal persistence
- [ ] Create Journal document
- [ ] Create journal repository
- [ ] Create DTOs
- [ ] Create JournalService
- [ ] Create JournalController
- [ ] Implement ownership validation
- [ ] Add create/read/update/delete
- [ ] Add validation
- [ ] Add tests
```

### Frontend

```text id="3u6p8k"
- [ ] Create JournalPage
- [ ] Create JournalEntryPage
- [ ] Create NewJournalEntryPage
- [ ] Create journal editor
- [ ] Add journal list
- [ ] Add entry details
- [ ] Add edit/delete
- [ ] Add optional goal association
- [ ] Add optional milestone association
- [ ] Add API integration
- [ ] Add tests
```

### Expected result

The user can:

```text id="w6c4qj"
Create Reflection
 ↓
Connect it to Learning
 ↓
Read It Later
 ↓
Edit/Delete It
```

---

# 12. Phase 8 — Dashboard & Activity

## Goal

Bring the individual features together into a useful learning workspace.

### Backend

```text id="q1x7se"
- [ ] Create activity service
- [ ] Implement activity queries
- [ ] Implement dashboard aggregation
- [ ] Create dashboard endpoint
- [ ] Add recent activity
- [ ] Add recent sessions
- [ ] Add active goals
- [ ] Add study-time summary
```

### Frontend

```text id="5f0z9c"
- [ ] Build DashboardPage
- [ ] Add welcome section
- [ ] Add summary statistics
- [ ] Add active goals
- [ ] Add recent activity
- [ ] Add recent sessions
- [ ] Add quick actions
- [ ] Add responsive layout
- [ ] Add loading state
- [ ] Add empty state
- [ ] Add error state
```

### Expected result

The dashboard answers:

```text id="1k8t3e"
What am I learning?
Where am I?
What did I do recently?
How much have I studied?
What should I continue with?
```

---

# 13. Phase 9 — Progress

## Goal

Make learning progress visible without turning Mezgeb into a competitive productivity system.

### Backend

```text id="q4m7yd"
- [ ] Create progress service
- [ ] Calculate goal completion
- [ ] Calculate task completion
- [ ] Calculate study time
- [ ] Calculate session statistics
- [ ] Calculate streak where defined
- [ ] Create progress endpoints
- [ ] Add tests
```

### Frontend

```text id="5z1fqp"
- [ ] Create ProgressPage
- [ ] Add goal progress
- [ ] Add task completion statistics
- [ ] Add study-time statistics
- [ ] Add session statistics
- [ ] Add activity history
- [ ] Add charts where useful
- [ ] Add accessible alternatives to charts
- [ ] Add tests
```

### Expected result

The user can understand:

```text id="j3k8as"
What have I completed?
How much have I studied?
How consistently have I learned?
How has each goal progressed?
```

---

# 14. Phase 10 — Full Integration

## Goal

Connect the complete learning journey and remove gaps between features.

The target flow is:

```text id="8r3h4c"
Register
   ↓
Login
   ↓
Create Goal
   ↓
Create Milestone
   ↓
Create Task
   ↓
Study
   ↓
Complete Task
   ↓
Record Session
   ↓
Write Reflection
   ↓
Review Progress
   ↓
Continue Learning
```

### Tasks

```text id="9c7m2v"
- [ ] Verify complete user journey
- [ ] Verify navigation
- [ ] Verify API contracts
- [ ] Verify authentication
- [ ] Verify authorization
- [ ] Verify activity generation
- [ ] Verify progress calculations
- [ ] Verify dashboard data
- [ ] Verify error handling
- [ ] Verify loading states
- [ ] Verify empty states
- [ ] Verify responsive behavior
- [ ] Fix integration issues
```

---

# 15. Phase 11 — Testing & Hardening

## Goal

Move from "it works" to "it is reliable."

### Frontend

```text id="q3v6ke"
- [ ] Run complete test suite
- [ ] Add missing component tests
- [ ] Add missing integration tests
- [ ] Add accessibility checks
- [ ] Add E2E tests
- [ ] Test responsive behavior
- [ ] Test error recovery
```

### Backend

```text id="y8c2mn"
- [ ] Run complete test suite
- [ ] Add service tests
- [ ] Add controller tests
- [ ] Add repository/integration tests
- [ ] Test authorization
- [ ] Test validation
- [ ] Test error responses
- [ ] Test database constraints
```

### System

```text id="1f8p5r"
- [ ] Test core user journey
- [ ] Test unauthorized access
- [ ] Test invalid data
- [ ] Test failure recovery
- [ ] Review logs
- [ ] Review security
- [ ] Review environment configuration
```

---

# 16. Phase 12 — Deployment

## Goal

Make Mezgeb accessible outside the local development environment.

### Frontend

```text id="w4k9se"
- [ ] Create production build
- [ ] Configure production environment variables
- [ ] Configure frontend hosting
- [ ] Configure SPA routing
- [ ] Configure HTTPS
- [ ] Test production API communication
```

### Backend

```text id="c2n7vf"
- [ ] Create production build
- [ ] Create backend container
- [ ] Configure production environment
- [ ] Configure production database
- [ ] Configure MongoDB
- [ ] Configure CORS
- [ ] Configure security settings
- [ ] Configure health checks
- [ ] Configure logging
```

### Database

```text id="x8q4hd"
- [ ] Run migrations
- [ ] Verify PostgreSQL
- [ ] Verify MongoDB
- [ ] Verify backups where applicable
```

---

# 17. Phase 13 — Polish & Portfolio

## Goal

Turn the completed application into a polished project that demonstrates engineering ability.

### Product polish

```text id="s6p2kj"
- [ ] Review visual consistency
- [ ] Improve responsive behavior
- [ ] Improve accessibility
- [ ] Improve loading states
- [ ] Improve empty states
- [ ] Improve error messages
- [ ] Remove unnecessary UI
```

### Engineering polish

```text id="g5r1ax"
- [ ] Review architecture
- [ ] Remove dead code
- [ ] Remove unnecessary dependencies
- [ ] Review database indexes
- [ ] Review API contracts
- [ ] Review security
- [ ] Review test coverage
- [ ] Review CI
```

### Portfolio polish

```text id="p8c3mx"
- [ ] Improve README
- [ ] Add architecture diagram
- [ ] Add screenshots
- [ ] Document important decisions
- [ ] Document technical challenges
- [ ] Document deployment
- [ ] Add demo link
- [ ] Prepare project description
```

---

# 18. Feature Completion Model

A feature is not complete when its main code works.

A feature should move through:

```text id="h4j8zn"
Design
  ↓
Frontend
  ↓
Backend
  ↓
Database
  ↓
API Integration
  ↓
Validation
  ↓
Loading / Empty / Error
  ↓
Authorization
  ↓
Tests
  ↓
Accessibility
  ↓
Documentation
```

Not every feature requires every step at the same depth, but important behavior should not be considered complete prematurely.

---

# 19. Vertical Slice Development

Where practical, build features as vertical slices.

For example, instead of building:

```text id="v0p2qa"
ALL frontend
 ↓
ALL backend
 ↓
ALL database
```

build:

```text id="2m6k9s"
Goal creation
 ↓
Frontend
 ↓
API
 ↓
Backend
 ↓
Database
 ↓
Tests
```

Then move to:

```text id="j7q3we"
Milestones
 ↓
Frontend
 ↓
API
 ↓
Backend
 ↓
Database
 ↓
Tests
```

This allows the application to become useful earlier and exposes integration problems sooner.

---

# 20. Recommended Implementation Order

The practical order is:

```text id="7h2m5p"
1. Repository foundation
2. Frontend foundation
3. Backend foundation
4. Authentication
5. Goals
6. Milestones
7. Tasks
8. Learning Sessions
9. Journal
10. Activity
11. Dashboard
12. Progress
13. Full integration
14. Testing hardening
15. Deployment
16. Polish
```

This order follows the product's natural dependency graph.

---

# 21. Dependency Logic

The ordering is intentional.

For example:

```text id="5q8v0e"
User
 ↓
Goal
 ↓
Milestone
 ↓
Task
```

Therefore:

```text id="v5q1j6"
Authentication
      ↓
Goals
      ↓
Milestones
      ↓
Tasks
```

Similarly:

```text id="0d8x6m"
Goal
  ├── Learning Session
  └── Journal Entry
```

And:

```text id="j2n9xc"
Tasks + Sessions + Activity
          ↓
       Progress
```

This reduces unnecessary rework.

---

# 22. MVP Completion Criteria

The Mezgeb MVP is complete when a user can successfully complete the core learning loop:

```text id="h9f1r3"
Register
 ↓
Login
 ↓
Create Goal
 ↓
Create Milestone
 ↓
Create Task
 ↓
Record Learning Session
 ↓
Complete Task
 ↓
Write Reflection
 ↓
Review Progress
```

And the system reliably handles:

```text id="r7x4qm"
Authentication
Authorization
Validation
Loading
Empty states
Errors
Responsive UI
Accessibility
Testing
```

---

# 23. What Does Not Block MVP?

The following should not delay the initial MVP unless they become necessary:

```text id="s3k6yp"
Advanced analytics
AI features
Social features
Calendar integration
Notifications
GitHub integration
Advanced search
Complex gamification
Mobile application
Redis
Kubernetes
Microservices
Advanced observability
```

These belong to later stages.

---

# 24. Definition of Project Completion

The first major version of Mezgeb can be considered complete when:

### Product

* [ ] Core learning loop works
* [ ] Core requirements implemented
* [ ] MVP scope respected

### Frontend

* [ ] Routes work
* [ ] UI is responsive
* [ ] Accessibility requirements addressed
* [ ] Loading/empty/error states implemented
* [ ] API integration is stable

### Backend

* [ ] Authentication works
* [ ] Authorization works
* [ ] Business rules are enforced
* [ ] API is documented
* [ ] Validation and errors are consistent

### Database

* [ ] Schema is version-controlled
* [ ] Relationships are correct
* [ ] Constraints are present
* [ ] Migrations work

### Testing

* [ ] Core behavior tested
* [ ] Security tested
* [ ] Integration tested
* [ ] Core E2E journey tested

### Infrastructure

* [ ] Production build works
* [ ] Deployment works
* [ ] Environment variables are configured safely
* [ ] CI passes

### Documentation

* [ ] README is complete
* [ ] Architecture documented
* [ ] API documented
* [ ] Important decisions recorded
* [ ] Known issues documented

---

# 25. Post-MVP Development

After the MVP is stable, development should return to the product roadmap.

Potential next sequence:

```text id="4m7x2c"
Search & Filtering
       ↓
Better Analytics
       ↓
Goal Templates
       ↓
Roadmaps
       ↓
Improved Journal
       ↓
AI Assistance
       ↓
Integrations
```

The product roadmap determines which features are actually worth building.

---

# 26. Development Loop

After MVP, new features should follow:

```text id="x5j9k3"
Idea
 ↓
Requirement
 ↓
User Flow
 ↓
Design
 ↓
Technical Decision
 ↓
Implementation
 ↓
Testing
 ↓
Documentation
 ↓
Review
 ↓
Merge
 ↓
Release
```

This creates a repeatable development process.

---

# 27. Avoiding Scope Creep

During implementation, new ideas will inevitably appear.

When a new idea appears, classify it:

```text id="z2q8pd"
Required for MVP?
      │
   ┌──┴──┐
  Yes    No
   │      │
 Build   Roadmap
         later
```

Do not automatically interrupt the current feature to build every interesting idea.

Record useful ideas for later.

---

# 28. Technical Debt

Technical debt should be tracked rather than ignored.

Examples:

```text id="7r4n1x"
temporary workaround
simplified implementation
missing test
temporary mock
deferred abstraction
known performance issue
```

Important technical debt should be recorded in:

```text id="j9w3kc"
06-project/known-issues.md
```

or an appropriate issue/task.

---

# 29. Architectural Decisions

When a significant technical decision is made, record:

```text id="x3f7pm"
Problem
Context
Options considered
Decision
Reason
Consequences
```

These decisions belong in:

```text id="q8n5vw"
06-project/decisions.md
```

This prevents important reasoning from being lost.

---

# 30. Roadmap Maintenance

This roadmap is not immutable.

Update it when:

* requirements change
* architecture changes
* a feature is removed
* implementation order changes
* a major technical discovery changes the plan

However, changes should be intentional.

Do not constantly rewrite the roadmap based on tiny implementation details.

---

# 31. Final Development Mental Model

Mezgeb should be built as:

```text
Plan
  ↓
Build a small vertical slice
  ↓
Test it
  ↓
Integrate it
  ↓
Document it
  ↓
Move to the next slice
```

The complete journey is:

```text
Foundation
    ↓
Authentication
    ↓
Learning Structure
    ↓
Learning Activity
    ↓
Reflection
    ↓
Progress
    ↓
Integration
    ↓
Reliability
    ↓
Deployment
    ↓
Polish
```

The core principle is:

> **Build the smallest complete learning experience first, then expand Mezgeb based on real needs.**
