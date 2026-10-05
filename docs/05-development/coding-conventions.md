# Coding Conventions

## 1. Purpose

This document defines the coding standards and implementation conventions for Mezgeb.

The goal is not to enforce rules for the sake of rules.

The goal is to make the codebase:

* readable
* predictable
* maintainable
* testable
* consistent
* easy to learn from
* easy for another developer to understand

The guiding principle is:

> **Prefer the simplest implementation that clearly communicates intent.**

---

# 2. General Principles

Mezgeb follows these principles:

1. Write code that is easy to understand before optimizing it.
2. Keep responsibilities separated.
3. Prefer explicit behavior over clever abstractions.
4. Keep components and functions focused.
5. Avoid premature abstraction.
6. Keep business rules out of UI components.
7. Keep API calls out of generic UI components.
8. Validate data at system boundaries.
9. Treat backend data as the source of truth.
10. Write tests around meaningful behavior.
11. Keep naming consistent across the entire project.
12. Remove unnecessary code instead of accumulating it.

---

# 3. TypeScript Conventions

## 3.1 Prefer TypeScript Types

Use explicit types when they improve clarity.

```ts
type GoalStatus =
  | "PLANNED"
  | "ACTIVE"
  | "COMPLETED"
  | "ARCHIVED";
```

Avoid using `any` unless there is a genuinely unavoidable reason.

Prefer:

```ts
unknown
```

when the type is not known.

---

# 4. Type Naming

Use PascalCase for types and interfaces.

```ts
type Goal = {};

interface UserProfile {}
```

Use descriptive names.

Prefer:

```ts
type CreateGoalRequest = {};
```

over:

```ts
type Data = {};
```

---

# 5. Interfaces vs Types

Both `type` and `interface` are allowed.

Use whichever communicates the model clearly.

For example:

```ts
interface User {
  id: string;
  name: string;
  email: string;
}
```

For unions:

```ts
type GoalStatus =
  | "PLANNED"
  | "ACTIVE"
  | "COMPLETED"
  | "ARCHIVED";
```

Do not create a complicated rule requiring one to always be used.

Consistency within a feature is more important.

---

# 6. Avoid Unnecessary Explicit Types

TypeScript should infer obvious types.

Prefer:

```ts
const goals = [];
```

when the surrounding context provides the correct type.

Avoid unnecessarily repeating information:

```ts
const name: string = "Fenet";
```

unless the explicit type provides useful clarity.

---

# 7. Naming Variables

Use descriptive names.

Prefer:

```ts
const activeGoals = ...
const completedTasks = ...
const learningSessions = ...
```

Avoid:

```ts
const x = ...
const data = ...
const thing = ...
```

unless the variable is genuinely temporary and obvious.

---

# 8. Boolean Naming

Boolean variables should communicate a yes/no condition.

Prefer:

```ts
isLoading
isAuthenticated
isCompleted
hasError
canEdit
```

Avoid:

```ts
loading
auth
complete
error
edit
```

when the meaning becomes ambiguous.

---

# 9. Function Naming

Functions should describe what they do.

Prefer:

```ts
createGoal()
updateGoal()
deleteGoal()
completeTask()
recordLearningSession()
```

Avoid vague names:

```ts
process()
handleData()
doThing()
```

---

# 10. Event Handler Naming

React event handlers should normally use:

```text
handle + Action
```

Examples:

```ts
handleSubmit
handleDelete
handleComplete
handleOpenDialog
handleSearch
```

Callback props should normally use:

```text
on + Event
```

Examples:

```ts
onSubmit
onDelete
onComplete
onClose
```

Example:

```tsx
<GoalCard onDelete={handleDelete} />
```

---

# 11. Component Naming

React components use PascalCase.

```text
GoalCard.tsx
GoalDetails.tsx
ProgressBar.tsx
EmptyState.tsx
```

Avoid vague component names such as:

```text
Thing.tsx
Box.tsx
Component.tsx
```

unless the component genuinely represents that concept.

---

# 12. File Naming

Use descriptive names.

Examples:

```text
GoalCard.tsx
GoalCard.module.css
goalsApi.ts
useGoals.ts
goal.types.ts
```

The project should avoid inconsistent naming patterns.

Within a feature, related files should follow a predictable structure.

---

# 13. One Main Component Per File

A file should normally contain one primary React component.

For example:

```text
GoalCard.tsx
GoalList.tsx
GoalDetails.tsx
```

Small helper components may remain in the same file when they are tightly coupled and not reusable elsewhere.

Do not split every five lines into a separate file.

---

# 14. Page Responsibilities

Pages represent route-level screens.

For example:

```text
GoalsPage
GoalDetailsPage
JournalPage
ProgressPage
```

Pages should primarily:

* compose feature components
* connect route parameters
* coordinate page-level state
* handle page-level loading/error/empty states

Pages should not become giant business-logic containers.

---

# 15. Feature Responsibilities

Features own product-specific behavior.

Example:

```text
features/goals/
├── components/
├── hooks/
├── api.ts
├── types.ts
└── ...
```

Goal-specific logic belongs here.

For example:

```text
createGoal
updateGoal
completeGoal
goal validation
goal-specific components
```

---

# 16. Shared Component Responsibilities

Shared components should remain generic.

Good:

```text
Button
Input
Modal
Card
Badge
ProgressBar
EmptyState
ErrorState
```

Avoid making shared components know about product-specific business logic.

Bad:

```text
GoalButton
```

inside a generic `components/ui/` folder if the button is actually only useful to the Goals feature.

---

# 17. Dependency Direction

Dependencies should generally flow toward more reusable layers:

```text
Pages
  ↓
Features
  ↓
Shared UI / Hooks
  ↓
Utilities / Infrastructure
```

Avoid circular dependencies.

For example:

```text
GoalCard → Button
```

is reasonable.

But:

```text
Button → GoalCard
```

would create the wrong dependency direction.

---

# 18. React State Placement

Keep state as close as possible to where it is needed.

Use:

```ts
useState()
```

for local UI state.

Example:

```ts
const [isDialogOpen, setIsDialogOpen] = useState(false);
```

Do not put every piece of state into global state.

---

# 19. Derived State

Do not store values that can be calculated from existing state.

Avoid:

```ts
const [completedCount, setCompletedCount] = useState(0);
```

when it can be derived from tasks.

Prefer:

```ts
const completedCount = tasks.filter(
  task => task.status === "COMPLETED"
).length;
```

This prevents duplicated state from becoming inconsistent.

---

# 20. React Effects

`useEffect` should primarily synchronize React with external systems.

Examples:

* browser APIs
* subscriptions
* timers
* external libraries
* network synchronization when appropriate

Do not automatically use `useEffect` whenever something changes.

Avoid effect chains such as:

```text
State A changes
 ↓
Effect updates State B
 ↓
Effect updates State C
 ↓
Effect triggers API call
```

Prefer explicit event-driven logic when possible.

---

# 21. Hooks

Hooks should have focused responsibilities.

Good:

```text
useGoals()
useGoal()
useCreateGoal()
useAuth()
useDebounce()
```

Avoid a massive hook such as:

```text
useEverything()
```

A hook can coordinate multiple operations, but its purpose should remain clear.

---

# 22. API Calls

Components should not directly contain scattered `fetch()` calls.

Prefer:

```text
Component
    ↓
Hook
    ↓
API function
    ↓
HTTP client
    ↓
Backend
```

Example:

```text
GoalDetails
    ↓
useGoal(goalId)
    ↓
getGoal(goalId)
    ↓
apiClient
```

This keeps HTTP behavior centralized and testable.

---

# 23. API Functions

API functions should represent backend operations.

Examples:

```ts
getGoals()
getGoal(goalId)
createGoal(data)
updateGoal(goalId, data)
deleteGoal(goalId)
```

They should not contain React-specific behavior.

For example, an API function should not call:

```text
useState
useEffect
useQuery
```

---

# 24. Server State

Server-owned data should be managed through TanStack Query once it is introduced.

Examples:

```text
Goals
Tasks
Sessions
Journal entries
Progress
Activity
```

Avoid copying server data into a separate global state store without a clear reason.

---

# 25. Forms

Forms should generally use:

```text
React Hook Form
        +
Zod
        +
TanStack Query mutation
```

Conceptually:

```text
User input
   ↓
React Hook Form
   ↓
Zod validation
   ↓
Mutation
   ↓
API
   ↓
Backend validation
```

---

# 26. Form Error Handling

Distinguish between:

### Field errors

Example:

```text
Title is required.
```

### Form-level errors

Example:

```text
Unable to create the goal.
```

### Server errors

Example:

```text
A goal with this information already exists.
```

Do not show every error as a generic toast.

Place errors where they are most useful.

---

# 27. Styling

Use:

```text
CSS Modules
+
global CSS
+
design tokens
```

Component-specific styles should normally live next to the component.

Example:

```text
GoalCard.tsx
GoalCard.module.css
```

Global design tokens belong in:

```text
styles/variables.css
```

---

# 28. CSS Naming

CSS Modules reduce naming collisions, so class names can remain simple.

Example:

```css
.card {}
.title {}
.status {}
```

Avoid unnecessarily complicated naming systems when CSS Modules already provide isolation.

---

# 29. Avoid Inline Style Overuse

Inline styles are acceptable for genuinely dynamic values.

For example:

```tsx
style={{ width: `${progress}%` }}
```

But reusable visual styling should generally live in CSS.

Avoid turning large components into collections of inline style objects.

---

# 30. Accessibility Conventions

Use semantic HTML.

Prefer:

```html
<button>
<a>
<nav>
<main>
<header>
<section>
<form>
```

over generic elements with click handlers.

For example:

```tsx
<button onClick={handleDelete}>
  Delete
</button>
```

is preferable to:

```tsx
<div onClick={handleDelete}>
  Delete
</div>
```

---

# 31. Buttons vs Links

Use a button when performing an action:

```text
Create
Delete
Save
Complete
Open modal
```

Use a link when navigating:

```text
Goals
Journal
Progress
Goal details
```

This improves semantics, accessibility, and expected browser behavior.

---

# 32. Images and Icons

Images should have meaningful alternative text when the image conveys information.

Decorative images should not create unnecessary screen-reader noise.

Icon-only buttons must have an accessible name.

Example:

```tsx
<button aria-label="Delete goal">
  <TrashIcon />
</button>
```

---

# 33. Loading States

Every asynchronous UI should have an intentional loading state when appropriate.

Examples:

```text
Skeleton
Spinner
Disabled submit button
Loading text
```

Avoid displaying blank content while data is being loaded.

---

# 34. Empty States

An empty state should explain:

1. What is empty?
2. Why might it be empty?
3. What can the user do next?

Example:

```text
No learning goals yet.

Create your first goal to start tracking your learning journey.

[Create Goal]
```

---

# 35. Error States

Errors should tell users:

* what went wrong
* whether their data was preserved
* what they can do next

Good:

```text
We couldn't load your goals.

Please check your connection and try again.

[Try Again]
```

Avoid exposing raw exceptions or technical stack traces.

---

# 36. Constants

Avoid unexplained magic values.

Instead of:

```ts
if (duration > 120)
```

prefer:

```ts
const MAX_SESSION_DURATION_MINUTES = 120;
```

when the value represents a meaningful domain rule.

Do not create constants for values that are obvious and local.

---

# 37. Utility Functions

Utilities should be genuinely reusable and generic.

Good:

```text
formatDate()
formatDuration()
debounce()
```

Avoid turning `utils/` into a dumping ground.

If logic belongs specifically to Goals, keep it inside the Goals feature.

---

# 38. Comments

Comments should explain **why**, not simply repeat **what** the code does.

Bad:

```ts
// Increment count
count++;
```

Good:

```ts
// Keep the optimistic update temporary until the server confirms the mutation.
```

If code requires a large comment to explain what it does, first consider whether the implementation can be simplified.

---

# 39. TODO Comments

TODOs should be meaningful.

Good:

```text
TODO: Replace manual pagination with cursor pagination if journal volume requires it.
```

Bad:

```text
TODO: fix this
```

Temporary TODOs should not accumulate indefinitely.

---

# 40. Logging

Do not leave unnecessary debugging logs in production code.

Avoid logging:

* passwords
* access tokens
* refresh tokens
* database credentials
* sensitive personal information
* journal content unnecessarily

Development logging should still respect privacy.

---

# 41. Environment Variables

Never hardcode secrets.

Frontend variables may include:

```text
VITE_API_URL
VITE_APP_NAME
VITE_APP_ENV
```

Frontend environment variables are publicly exposed after building.

Therefore:

> **Never put secrets in Vite environment variables.**

Backend secrets belong in the backend environment.

Examples:

```text
DB_PASSWORD
JWT_SECRET
MONGODB_URI
```

---

# 42. Backend Package Conventions

Backend packages follow feature/domain organization:

```text
com.mezgeb
├── auth
├── user
├── goal
├── milestone
├── task
├── session
├── journal
├── progress
├── activity
├── security
├── config
└── common
```

This keeps related behavior close together.

---

# 43. Controller Conventions

Controllers handle HTTP concerns.

They should:

* receive requests
* validate request DTOs
* call services
* return responses
* map HTTP-level concerns

Controllers should not contain complex business logic.

Avoid:

```java
@PostMapping
public ResponseEntity<?> createGoal(...) {
    // 100 lines of business logic
}
```

Prefer:

```text
Controller
    ↓
GoalService
```

---

# 44. Service Conventions

Services contain application behavior and business rules.

Examples:

```text
GoalService
TaskService
LearningSessionService
JournalService
```

Services handle:

* ownership checks
* business rules
* transactions
* coordinating repositories
* application workflows

---

# 45. Repository Conventions

Repositories handle persistence.

They should not contain business workflows.

Example:

```text
GoalRepository
TaskRepository
LearningSessionRepository
```

Prefer repository methods that naturally enforce ownership where appropriate.

Example:

```java
findByIdAndUserId(...)
```

This can reduce accidental access to another user's resources.

---

# 46. DTO Conventions

Do not expose JPA entities directly as API contracts.

Use DTOs.

Example:

```text
GoalEntity
      ↓
GoalResponse
```

Request and response DTOs should reflect API needs rather than database structure.

---

# 47. Entity Conventions

Entities represent persistence models.

They should contain:

* persistence fields
* relationships
* persistence-specific configuration

Avoid turning entities into the application's entire business layer.

---

# 48. Dependency Injection

Prefer constructor injection.

Example:

```java
@Service
public class GoalService {

    private final GoalRepository goalRepository;

    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }
}
```

Avoid unnecessary field injection.

Constructor injection makes dependencies explicit and improves testability.

---

# 49. Validation

Validate at multiple appropriate boundaries.

```text
HTTP request
   ↓
DTO validation
   ↓
Business validation
   ↓
Database constraints
```

Each layer has a different responsibility.

Validation should not rely exclusively on the frontend.

---

# 50. Exceptions

Do not scatter response-building logic for every exception throughout controllers.

Use centralized exception handling.

Conceptually:

```text
Exception
    ↓
GlobalExceptionHandler
    ↓
Standard API error
```

This keeps error responses consistent.

---

# 51. Transactions

Transactions should be applied around operations that must succeed or fail together.

Example:

```text
Complete Task
     ↓
Update task
     ↓
Create activity
```

If both are stored in PostgreSQL, the operation can be transactional.

Avoid trying to create distributed transactions between PostgreSQL and MongoDB during the MVP.

---

# 52. API Response Conventions

Use consistent HTTP semantics.

Examples:

```text
GET    → 200
POST   → 201
PATCH  → 200
DELETE → 204
```

Errors should use appropriate status codes.

Examples:

```text
400 → invalid request
401 → unauthenticated
403 → forbidden
404 → not found
409 → conflict
500 → unexpected server error
```

---

# 53. Database Conventions

Use:

* UUID application IDs
* UTC timestamps
* foreign keys
* meaningful constraints
* indexes based on actual access patterns
* Flyway migrations

Avoid manually modifying production schemas outside the migration process.

---

# 54. Date and Time Conventions

Distinguish between:

### Date

Use when time of day is irrelevant.

Example:

```text
Goal target date
Journal date
```

### Timestamp

Use when the exact moment matters.

Example:

```text
Session startedAt
Activity occurredAt
createdAt
updatedAt
```

Moments should be stored and communicated consistently using UTC.

---

# 55. Product Terminology

Use consistent terminology throughout the codebase.

For example:

```text
Goal
Milestone
Task
Learning Session
Journal Entry
Progress
Activity
```

Do not call the same concept different names in different parts of the application.

Avoid:

```text
Goal
Project
Objective
Target
```

being used interchangeably unless they represent genuinely different concepts.

---

# 56. Testing Conventions

Tests should describe behavior.

Prefer:

```text
shows an error when goal creation fails
```

over:

```text
calls setError()
```

Test observable behavior rather than implementation details.

---

# 57. Test Naming

Test names should explain the scenario and expected behavior.

Example:

```text
should display validation error when title is empty
```

Good tests answer:

> What behavior does this test protect?

---

# 58. Avoid Over-Mocking

Mock dependencies when isolation is valuable.

Do not mock everything simply because mocking is available.

A test that mocks the entire application may technically pass while providing little confidence.

Prefer realistic integration tests where appropriate.

---

# 59. Git Conventions

Commits should communicate intent.

Examples:

```text
feat: add goal creation form
fix: handle expired access token
test: add goal validation tests
refactor: extract goal API client
docs: update database design
```

Avoid commits such as:

```text
stuff
changes
update
final
final2
```

Detailed Git workflow rules are defined separately.

---

# 60. Code Review Expectations

Before considering a feature complete, check:

### Correctness

* Does it implement the requirement?
* Are edge cases handled?

### UX

* Are loading states handled?
* Are empty states handled?
* Are errors understandable?

### Accessibility

* Can it be used with a keyboard?
* Are labels and accessible names present?

### Security

* Is authorization enforced on the backend?
* Are sensitive values protected?

### Testing

* Is important behavior covered?

### Maintainability

* Is the implementation understandable?
* Is there unnecessary abstraction?

---

# 61. Avoid Premature Optimization

Do not automatically introduce:

```text
useMemo
useCallback
React.memo
Redis
caching layers
complex state management
microservices
```

because they are popular.

First establish that a real performance or architectural problem exists.

Then measure and address it.

---

# 62. Dependency Philosophy

Before adding a dependency, ask:

1. Do we actually need it?
2. Can the platform already solve the problem?
3. Does it meaningfully simplify the code?
4. Does it introduce significant complexity?
5. Will we understand how it works?
6. Is it maintained and appropriate for the project?

Dependencies should solve problems, not create them.

---

# 63. Security by Default

Every feature should consider:

```text
Authentication
Authorization
Input validation
Data ownership
Sensitive data
Error disclosure
User-generated content
Environment secrets
```

The frontend should never be treated as a security boundary.

---

# 64. Documentation Updates

When an implementation changes an important architectural decision, update the relevant documentation.

Examples:

```text
API changed
→ api-specification.md

Database changed
→ database-design.md

Routing changed
→ routing.md

Architecture changed
→ architecture.md

Technology changed
→ tech-stack.md

Known bug discovered
→ known-issues.md
```

Documentation should describe the actual system, not an outdated idealized version.

---

# 65. Definition of Clean Code for Mezgeb

Clean code does **not** mean:

* maximum abstraction
* maximum number of files
* maximum number of design patterns
* maximum number of dependencies
* shortest possible code

For Mezgeb, clean code means:

```text
Easy to read
     +
Easy to understand
     +
Easy to test
     +
Easy to change
     +
Consistent with the architecture
```

---

# 66. Implementation Mental Model

When adding a new feature, think:

```text
Requirement
    ↓
User flow
    ↓
UI
    ↓
Component
    ↓
State
    ↓
API
    ↓
Backend
    ↓
Business rules
    ↓
Database
    ↓
Tests
```

Then ask:

> Where does this responsibility actually belong?

That question should guide implementation more than any individual framework rule.

---

# 67. Final Coding Principle

Mezgeb's codebase should feel:

```text
Simple
   ↓
Predictable
   ↓
Consistent
   ↓
Testable
   ↓
Maintainable
```

The central rule is:

> **Write code for the next developer who has to understand it—including yourself three months from now.**
