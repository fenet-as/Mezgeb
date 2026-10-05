# Testing Strategy

## 1. Purpose

This document defines how Mezgeb will be tested across the frontend, backend, database, API, and complete user journeys.

The goal is not to maximize test count.

The goal is to build confidence that:

* features work correctly
* important user journeys work end-to-end
* business rules are protected
* authorization is enforced
* regressions are caught
* refactoring is safe
* the codebase remains understandable

The guiding principle is:

> **Test behavior that matters to users and protect business rules that matter to the system.**

---

# 2. Testing Philosophy

Mezgeb follows a layered testing strategy.

```text
                    E2E Tests
                       ▲
                       │
             Integration Tests
                       ▲
                       │
              Component Tests
                       ▲
                       │
                 Unit Tests
```

The lower levels should provide fast feedback.

The higher levels should verify that the major pieces work together.

Testing should not mean writing a test for every line of code.

---

# 3. Testing Pyramid

The project follows a practical testing pyramid:

```text
              ┌───────────────┐
              │      E2E      │
              │   Few tests  │
              └───────────────┘
             ┌─────────────────┐
             │   Integration   │
             │   More tests    │
             └─────────────────┘
          ┌───────────────────────┐
          │  Component / Service  │
          │     Many tests        │
          └───────────────────────┘
       ┌─────────────────────────────┐
       │          Unit Tests         │
       │        Fast + focused       │
       └─────────────────────────────┘
```

The exact distribution can evolve.

The important idea is:

> The more expensive a test is to run, the more selectively it should be used.

---

# 4. Test Layers

Mezgeb uses several complementary levels.

| Layer         | Main purpose                | Examples                           |
| ------------- | --------------------------- | ---------------------------------- |
| Unit          | Isolated logic              | formatters, calculations, services |
| Component     | UI behavior                 | forms, buttons, cards              |
| Integration   | Multiple application layers | API + service + database           |
| API           | HTTP contract               | endpoints, validation, auth        |
| E2E           | Complete user journey       | register → learn → review progress |
| Accessibility | Inclusive behavior          | keyboard, labels, focus            |
| Static checks | Code quality                | TypeScript, ESLint                 |
| Build checks  | Deployment confidence       | frontend/backend builds            |

---

# 5. Frontend Testing Stack

The frontend uses:

```text
React
TypeScript
Vitest
React Testing Library
MSW
Playwright
ESLint
TypeScript compiler
```

Responsibilities:

* Vitest → test runner
* React Testing Library → component behavior
* MSW → API mocking
* Playwright → end-to-end browser testing
* ESLint → code quality
* TypeScript → type safety

---

# 6. Backend Testing Stack

The backend uses:

```text
JUnit
Mockito
Spring Boot Test
MockMvc
Testcontainers later
```

Responsibilities:

* JUnit → test framework
* Mockito → isolated dependency mocking
* Spring Boot Test → application integration
* MockMvc → HTTP/controller testing
* Testcontainers → realistic database/service testing when introduced

---

# 7. What Should Be Tested?

Prioritize behavior involving:

### Core product functionality

* authentication
* goals
* milestones
* tasks
* learning sessions
* journal entries
* progress
* dashboard
* activity

### Security

* authentication
* authorization
* ownership
* protected endpoints
* invalid credentials

### Data integrity

* validation
* relationships
* transactions
* database constraints

### User experience

* loading
* empty states
* errors
* navigation
* form validation
* accessibility

---

# 8. What Should Not Be Over-Tested?

Avoid spending large amounts of time testing:

* React internals
* browser internals
* framework internals
* third-party libraries
* trivial getters/setters
* static CSS implementation
* implementation details
* components that contain no meaningful behavior

For example, do not test whether React's `useState` itself works.

Test how Mezgeb behaves when the state changes.

---

# 9. Unit Tests

Unit tests verify small pieces of logic independently.

Examples:

```text
formatDuration()
formatDate()
calculateGoalProgress()
calculateStudyTime()
validateGoalData()
```

Backend examples:

```text
GoalService
ProgressCalculator
SessionService
validation logic
mapping logic
```

A unit test should generally be:

* fast
* focused
* deterministic
* easy to understand

---

# 10. Frontend Unit Test Example

Suppose Mezgeb formats study duration.

Input:

```text
90 minutes
```

Expected:

```text
1h 30m
```

The test should verify the observable result of the formatting function.

It does not need React.

---

# 11. Backend Unit Tests

Backend business rules should have focused tests.

For example:

```text
GoalService
```

might test:

```text
creates a goal for the current user
rejects invalid goal data
does not allow access to another user's goal
updates an owned goal
does not update an unowned goal
```

Dependencies such as repositories can be mocked when isolation is useful.

---

# 12. Component Tests

Component tests verify UI behavior.

Examples:

```text
GoalCard
GoalForm
TaskItem
JournalForm
StatusBadge
ProgressBar
ConfirmDialog
```

Test what users can observe.

For example:

```text
Given a completed task,
When the task is displayed,
Then the completed state is visible.
```

---

# 13. Form Tests

Forms are important because they combine:

* user input
* validation
* submission
* loading state
* server errors
* success behavior

Test:

```text
empty required field
invalid input
valid input
submission
loading state
server validation error
successful submission
```

---

# 14. Goal Form Testing

The goal form should verify:

```text
Title required
Description optional
Valid data can be submitted
Invalid data cannot be submitted
Submit button reflects loading state
Server errors are displayed
Successful creation navigates appropriately
```

---

# 15. Task Testing

Task behavior should verify:

```text
task is displayed
task can be completed
completed state is visible
task can be reopened
server errors are handled
loading state is shown
```

The important concern is behavior rather than the exact component implementation.

---

# 16. Journal Testing

Journal functionality should verify:

```text
journal entries load
empty state appears when no entries exist
entry can be created
entry can be edited
entry can be deleted
validation works
server errors are handled
entry content is displayed correctly
```

Because journal content is user-generated, security and rendering behavior should also be tested.

---

# 17. Progress Testing

Progress is derived from learning activity.

Test important calculations such as:

```text
completed tasks
total tasks
goal completion percentage
total study time
session count
streak calculation
```

These calculations should be tested independently where possible.

---

# 18. Dashboard Testing

The dashboard combines multiple sources of information.

Test:

```text
active goals displayed
recent activity displayed
recent sessions displayed
study time displayed
empty states displayed
loading state displayed
error state displayed
```

The dashboard does not need a test for every child component if those components already have focused tests.

---

# 19. Loading State Tests

Every important asynchronous screen should have a loading test.

Example:

```text
Given goals are loading,
Then the goals page shows its loading state.
```

The test should also verify that misleading empty content is not displayed while the request is still pending.

---

# 20. Empty State Tests

Empty states should be tested because they are meaningful product states.

Examples:

```text
No goals yet
No journal entries yet
No learning sessions yet
No recent activity
```

Tests should verify:

* useful explanation
* appropriate next action
* correct navigation/action

---

# 21. Error State Tests

Test meaningful failure scenarios.

Examples:

```text
network failure
server error
unauthorized request
forbidden request
resource not found
validation error
conflict
```

The UI should provide an understandable recovery path.

---

# 22. Routing Tests

Routing behavior should be verified.

Important cases:

```text
/ → correct destination
/login → login
/register → register
/app/dashboard → dashboard
/app/goals → goals
/app/goals/:goalId → goal details
/app/journal/new → new journal entry
/app/journal/:entryId → journal entry
unknown route → not found
```

---

# 23. Protected Route Tests

Protected routes are particularly important.

Test:

```text
Unauthenticated user
      ↓
/app/dashboard
      ↓
redirect to login
```

And:

```text
Authenticated user
      ↓
/login
      ↓
redirect to dashboard
```

Frontend protection is a UX mechanism.

The backend must still enforce authorization.

---

# 24. Authentication Tests

Test:

### Registration

```text
valid registration succeeds
invalid input is rejected
duplicate email is handled
password rules are enforced
```

### Login

```text
valid credentials succeed
invalid credentials fail
authentication state is established
```

### Logout

```text
session/auth state is cleared
protected UI becomes inaccessible
```

### Session initialization

```text
application starts
 ↓
authentication state is restored/verified
 ↓
correct route is shown
```

---

# 25. Authorization Tests

Authorization is one of the highest-priority backend test areas.

For a user-owned goal:

```text
User A → own goal → allowed
User A → User B goal → denied
```

Test this for:

```text
Goals
Milestones
Tasks
Learning Sessions
Journal Entries
Activity
Progress
```

---

# 26. Backend Controller Tests

Controller tests verify HTTP behavior.

Test:

```text
correct status code
request validation
response shape
authentication requirements
authorization behavior
error responses
```

Examples:

```text
POST /api/v1/goals
GET /api/v1/goals
PATCH /api/v1/goals/{goalId}
DELETE /api/v1/goals/{goalId}
```

---

# 27. Service Integration Tests

Service-level integration tests verify that application behavior works across multiple layers.

For example:

```text
HTTP request
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Database
```

These tests provide more confidence than isolated unit tests alone.

---

# 28. Repository Tests

Repository tests verify persistence behavior when it is important.

Examples:

```text
goal saved correctly
goal retrieved by owner
tasks linked to milestone
sessions linked to goal
queries respect ownership
```

Do not write a separate test for every trivial framework-generated repository method unless it protects meaningful custom behavior.

---

# 29. Database Integration Testing

The application should eventually test against realistic databases.

Possible approach:

```text
Test
 ↓
Testcontainers
 ↓
PostgreSQL container
 ↓
Real repository/database interaction
```

For MongoDB-related behavior:

```text
Test
 ↓
MongoDB container
 ↓
Journal repository
```

Testcontainers can be introduced after the basic backend is working.

---

# 30. Database Constraints

Important database constraints should be protected.

Examples:

```text
unique user email
foreign key relationships
required fields
valid status values
ownership relationships
```

Database constraints provide a final layer of data integrity.

---

# 31. API Contract Testing

The frontend and backend communicate through an API contract.

Tests should verify:

```text
request shape
response shape
status codes
error format
field names
enum values
pagination structure
```

OpenAPI can serve as the documented source of truth.

---

# 32. Mock Service Worker

MSW can mock API requests during frontend tests.

Conceptually:

```text
React component
      ↓
API request
      ↓
MSW
      ↓
Mock response
```

This allows frontend tests to behave more like real application requests without depending on a running backend.

---

# 33. Avoid Excessive API Mocking

Mocking should simplify isolated frontend tests.

It should not replace integration tests.

A healthy balance is:

```text
Frontend tests
→ mocked API where appropriate

Backend tests
→ real application behavior

Integration tests
→ real database where appropriate

E2E tests
→ real frontend + backend + database
```

---

# 34. End-to-End Testing

E2E tests verify the application as a real user would experience it.

Primary tool:

```text
Playwright
```

E2E tests should cover only the most important flows because they are slower and more expensive.

---

# 35. Core E2E Journey

The highest-value journey is:

```text
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
Complete Task
   ↓
Record Learning Session
   ↓
Write Reflection
   ↓
Review Progress
```

This verifies the complete learning loop.

---

# 36. Additional E2E Flows

Other important journeys may include:

### Authentication

```text
Login
Logout
Protected route
```

### Goals

```text
Create
Edit
Archive
Delete
```

### Tasks

```text
Create
Complete
Reopen
```

### Journal

```text
Create
View
Edit
Delete
```

### Progress

```text
Complete activity
 ↓
Progress changes
 ↓
Dashboard reflects activity
```

---

# 37. Accessibility Testing

Accessibility should be tested throughout development.

Automated checks can use:

```text
eslint-plugin-jsx-a11y
axe-core
```

Manual testing should include:

```text
keyboard navigation
focus visibility
screen reader checks
zoom
reduced motion
form accessibility
dialog behavior
```

Automated accessibility tools do not detect every accessibility problem.

---

# 38. Responsive Testing

Important screens should be checked at:

```text
mobile
tablet
desktop
```

Test especially:

```text
navigation
forms
goal cards
goal details
journal editor
dashboard
dialogs
tables/charts
```

Responsive behavior should be part of feature completion, not a final afterthought.

---

# 39. Security Testing

Security testing should cover:

### Authentication

```text
invalid credentials
expired/invalid tokens
protected endpoints
```

### Authorization

```text
cross-user access
unauthorized mutations
```

### Input validation

```text
invalid fields
unexpected values
malformed requests
```

### Sensitive information

Ensure responses and logs do not expose:

```text
password hashes
tokens
secrets
private data
```

---

# 40. User-Generated Content

Journal entries contain user-provided content.

Testing should consider:

```text
HTML injection
unsafe rendering
unexpected markup
large content
special characters
```

If rich text is introduced later, sanitization becomes especially important.

---

# 41. Date and Time Testing

Time-related functionality is prone to subtle bugs.

Test:

```text
goal dates
journal dates
session timestamps
activity timestamps
streak calculations
timezone behavior
```

Use deterministic test dates where possible.

Avoid tests that depend on the machine's current time.

---

# 42. Progress Calculation Testing

Progress should be derived consistently.

Example:

```text
Total tasks = 10
Completed tasks = 6

Progress = 60%
```

Tests should cover:

```text
0 tasks
all tasks incomplete
some tasks complete
all tasks complete
```

Also test behavior when milestones or goals have no tasks.

---

# 43. Streak Testing

If streak functionality is implemented in the MVP, test boundary conditions.

Examples:

```text
one study day
consecutive study days
gap between sessions
multiple sessions on same day
timezone boundaries
```

The exact streak definition must be documented before implementation.

---

# 44. Activity Testing

Important events should generate the expected activity.

Examples:

```text
Goal created
Milestone created
Task completed
Session recorded
Journal created
Goal completed
```

If activity creation is part of a transaction, test that:

```text
operation succeeds → activity exists
operation fails → activity is not incorrectly recorded
```

---

# 45. Error Recovery Testing

Test not only that an error appears, but that the user can recover.

Examples:

```text
Request fails
 ↓
Error shown
 ↓
User clicks Retry
 ↓
Request succeeds
 ↓
Content appears
```

For forms:

```text
Submission fails
 ↓
Error shown
 ↓
User input preserved
 ↓
User fixes issue
 ↓
Submission succeeds
```

---

# 46. Test Data

Test data should be:

* predictable
* minimal
* readable
* isolated
* easy to reset

Avoid enormous fixtures when a small object is enough.

Example:

```ts id="7f0l3w"
const goal = {
  id: "goal-1",
  title: "Learn React",
  status: "ACTIVE",
};
```

---

# 47. Test Isolation

Tests should not depend on execution order.

Bad:

```text
Test A creates user
Test B assumes user still exists
```

Prefer:

```text
Test A → creates its own data
Test B → creates its own data
```

This makes tests reliable and parallelizable.

---

# 48. Deterministic Tests

Avoid tests depending on:

* current date
* random values
* external APIs
* production services
* local machine configuration
* previous tests

Use controlled values and mocks where appropriate.

---

# 49. External Services

External services should not normally be required for ordinary automated tests.

For example:

```text
LLM API
Email provider
GitHub API
Cloud storage
```

Future integrations should use controlled mocks/test environments.

---

# 50. Test Environments

Mezgeb should eventually have separate environments:

```text
development
test
production
```

Tests must never accidentally use production databases.

---

# 51. CI Testing Pipeline

GitHub Actions should eventually run:

```text
Pull Request
      ↓
Install dependencies
      ↓
Type check
      ↓
Lint
      ↓
Frontend unit/component tests
      ↓
Backend tests
      ↓
Build frontend
      ↓
Build backend
      ↓
Integration tests
      ↓
E2E tests
```

The exact pipeline can evolve as the project grows.

---

# 52. Test Execution Strategy

During development, run focused tests first.

Example:

```text
Changed GoalForm
      ↓
Run GoalForm tests
      ↓
Run Goals feature tests
      ↓
Run full frontend tests
```

Do not wait until the end of a feature to discover a broken test.

---

# 53. Local Test Commands

Typical frontend commands:

```bash id="h7n6a8"
npm test
npm run test:run
npm run build
```

Backend:

```bash id="2t5yl4"
./mvnw test
./mvnw verify
```

The exact scripts may change when the project is initialized.

---

# 54. Coverage

Code coverage is useful as a signal.

It is not the primary goal.

A project can have high coverage and still contain poorly tested behavior.

Prioritize coverage of:

```text
business rules
security
important user flows
complex calculations
data transformations
error handling
```

---

# 55. Testing Priority

When time is limited, prioritize:

### P0

* authentication
* authorization
* goals
* tasks
* learning sessions
* core progress
* critical API behavior
* main user journey

### P1

* journal
* dashboard
* activity
* secondary UI behavior
* edge cases

### P2

* advanced analytics
* future AI features
* uncommon UI variations
* non-critical optimizations

---

# 56. Testing New Features

Every new feature should consider:

```text
Requirement
 ↓
Happy path
 ↓
Validation
 ↓
Loading
 ↓
Empty
 ↓
Error
 ↓
Authorization
 ↓
Accessibility
 ↓
Responsive behavior
 ↓
Tests
```

Not every feature needs every category equally, but each should be consciously evaluated.

---

# 57. Bug Fix Testing

When a bug is discovered:

```text
Bug
 ↓
Reproduce
 ↓
Write failing test
 ↓
Fix implementation
 ↓
Verify test passes
 ↓
Run related tests
```

This prevents the same bug from silently returning.

---

# 58. Regression Testing

Regression tests protect previously working functionality.

After a change:

```text
Focused tests
      ↓
Feature tests
      ↓
Full suite
```

CI provides an additional regression safety net.

---

# 59. Testing Documentation

If a testing approach changes significantly, update the relevant documentation.

Examples:

```text
New testing tool
→ tech-stack.md

New test architecture
→ testing.md / testing-strategy.md

New CI test
→ GitHub Actions configuration

New E2E journey
→ testing documentation
```

---

# 60. Definition of Done

A feature should not be considered complete merely because its UI works.

A practical definition of done is:

* [ ] Requirement implemented
* [ ] User flow works
* [ ] Validation implemented
* [ ] Loading state handled
* [ ] Empty state handled where applicable
* [ ] Error state handled
* [ ] Authorization verified
* [ ] Accessibility considered
* [ ] Responsive behavior checked
* [ ] Relevant tests added
* [ ] Existing tests pass
* [ ] Lint passes
* [ ] Type checking passes
* [ ] Build passes
* [ ] Documentation updated if necessary

---

# 61. Example: Goal Creation

A complete test strategy for goal creation looks like:

```text
             Goal Creation
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
   Frontend    Backend    Database
       │          │          │
    Form test   Service    Constraints
    Validation  test       Foreign key
    Error UI    Auth       Required fields
       │        test
       └──────────┼──────────┘
                  ▼
                E2E
                  │
                  ▼
       User creates a goal
```

This is much stronger than only testing whether the button works.

---

# 62. Example: Complete Task

For completing a task:

### Frontend

Test:

```text
Complete button appears
 ↓
Click
 ↓
Loading state
 ↓
Success
 ↓
Task shows COMPLETED
```

### Backend

Test:

```text
Authenticated owner
 ↓
Task completion allowed
 ↓
Task updated
 ↓
Activity created
```

Also:

```text
Different user
 ↓
Request rejected
```

### Database

Verify:

```text
task status updated
activity persisted
```

### E2E

Verify:

```text
User completes task
 ↓
Goal progress changes
 ↓
Dashboard/progress reflects activity
```

---

# 63. Testing Mental Model

Think about tests in four levels:

```text
Does the function work?
        ↓
Does the component work?
        ↓
Does the system work?
        ↓
Does the user journey work?
```

These questions correspond roughly to:

```text
Unit
Component / Integration
Backend / API Integration
E2E
```

No single testing layer can answer all four questions.

---

# 64. Final Testing Principle

Mezgeb should not aim to have the most tests.

It should aim to have the **right tests**.

The testing strategy is:

```text
Fast feedback
     +
Meaningful behavior
     +
Protected business rules
     +
Security verification
     +
Real user journeys
     +
Continuous regression protection
```

The core principle is:

> **Tests should give us confidence to change the code without being afraid of breaking Mezgeb.**
