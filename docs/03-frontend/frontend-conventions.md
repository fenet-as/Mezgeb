# Frontend Conventions

## 1. Purpose

This document defines the coding and development conventions for the Mezgeb frontend.

The goal is to make the codebase:

* readable
* consistent
* predictable
* maintainable
* accessible
* testable
* easy to learn from
* easy to extend

These conventions are guidelines for everyday development.

They should reduce unnecessary decisions without preventing reasonable engineering judgment.

---

# 2. Core Principle

Mezgeb follows:

> **Prefer the simplest solution that clearly communicates the intent of the code.**

Do not introduce abstractions, libraries, patterns, or architecture simply because they are considered "industry standard."

Use them when they solve an actual problem.

---

# 3. Technology Conventions

The frontend uses:

| Area         | Choice                         |
| ------------ | ------------------------------ |
| UI           | React                          |
| Language     | TypeScript                     |
| Build tool   | Vite                           |
| Routing      | React Router                   |
| Styling      | CSS Modules + CSS              |
| Forms        | React Hook Form                |
| Validation   | Zod                            |
| Server state | TanStack Query                 |
| Testing      | Vitest + React Testing Library |
| E2E          | Playwright                     |
| Linting      | ESLint                         |
| Formatting   | Prettier                       |

Additional tools may be introduced when there is a demonstrated need.

---

# 4. TypeScript

Use TypeScript throughout the application.

Prefer explicit types for:

* API boundaries
* component props
* shared data structures
* function parameters where inference is insufficient
* reusable hooks
* complex state

Avoid unnecessary explicit typing when TypeScript can infer the type clearly.

For example, this is unnecessary:

```text id="7m2x8q"
const name: string = "React";
```

Prefer:

```text id="3q9m5x"
const name = "React";
```

when the type is obvious.

---

# 5. Avoid `any`

Avoid:

```text id="8p4q2m"
any
```

unless there is a genuinely justified reason.

Prefer:

* proper interfaces/types
* generics
* `unknown`
* type narrowing

If external data is unknown:

```text id="6m9x3q"
unknown
```

is safer than immediately treating it as `any`.

---

# 6. Type Naming

Use PascalCase for types and interfaces.

Examples:

```text id="4q7m2x"
Goal
GoalStatus
CreateGoalRequest
UpdateGoalRequest
JournalEntry
```

Avoid unnecessary prefixes such as:

```text id="9m3x7q"
IGoal
IUser
```

unless a specific library or convention requires them.

---

# 7. Interfaces vs Type Aliases

Both are allowed.

Use whichever makes the model clearer.

For example:

```text id="2m8q5x"
type GoalStatus =
  | "PLANNED"
  | "ACTIVE"
  | "COMPLETED"
  | "ARCHIVED";
```

is appropriate for a union.

An object structure can use either:

```text id="7x4m9q"
interface Goal {
  id: string;
  title: string;
}
```

or:

```text id="5q8m2x"
type Goal = {
  id: string;
  title: string;
};
```

Consistency within a particular area matters more than enforcing one syntax everywhere.

---

# 8. Naming Variables

Use descriptive names.

Prefer:

```text id="3m7q9x"
goal
activeGoals
learningSession
journalEntry
isLoading
isAuthenticated
```

Avoid:

```text id="8q2m4x"
x
data1
thing
temp
foo
```

unless the variable's meaning is genuinely obvious from a very small scope.

---

# 9. Boolean Naming

Boolean variables should communicate that they represent a condition.

Prefer:

```text id="6m3x8q"
isLoading
isOpen
isAuthenticated
hasError
canEdit
```

This makes conditional code easier to understand.

---

# 10. Event Handler Naming

Use `handle` for functions that respond to events.

Examples:

```text id="q8m2x5"
handleSubmit
handleDelete
handleTaskComplete
handleClose
handleChange
```

For callback props, use `on`.

Examples:

```text id="4p7m9x"
onSubmit
onDelete
onClose
onChange
```

Mental model:

```text id="m3q8x2"
handleSomething
→ implementation

onSomething
→ callback interface
```

---

# 11. React Component Naming

React components use PascalCase.

Examples:

```text id="7x2m9q"
GoalCard
GoalList
GoalDetails
JournalEntry
ProgressChart
EmptyState
```

Avoid vague names such as:

```text id="8m4q2x"
Box
Thing
Component
Container
Stuff
```

unless the component genuinely represents that concept.

---

# 12. File Naming

React component files should generally use PascalCase:

```text id="5q9m3x"
GoalCard.tsx
GoalList.tsx
LoginForm.tsx
AppLayout.tsx
```

Non-component modules can use appropriate descriptive naming.

Examples:

```text id="2m8x7q"
goalsApi.ts
useGoals.ts
authSchemas.ts
formatDate.ts
```

Follow the existing directory's naming pattern consistently.

---

# 13. One Main Component Per File

A file should generally have one primary React component.

Small supporting components can exist in the same file when they are:

* tightly coupled
* small
* not reusable elsewhere

If a component becomes independently useful or substantial, extract it.

---

# 14. Component Size

There is no strict maximum line count.

Instead, look for responsibilities.

A component may need to be split when it:

* handles unrelated concerns
* contains many independent sections
* has difficult-to-follow conditional logic
* manages too much state
* becomes difficult to test
* is reused in multiple places

Do not split components merely because a file is long.

---

# 15. Pages vs Components

Pages represent routes.

For example:

```text id="6q3m8x"
GoalsPage
GoalDetailsPage
JournalPage
ProgressPage
```

Pages should primarily compose the screen.

They should not become enormous containers for every piece of feature logic.

Prefer:

```text id="9m4x2q"
GoalsPage
 ├── GoalsHeader
 ├── GoalFilters
 ├── GoalList
 │    └── GoalCard
 └── EmptyState
```

---

# 16. Feature Ownership

Feature-specific behavior should stay inside the relevant feature.

For example:

```text id="8m2q7x"
features/goals/
```

can own:

* goal components
* goal hooks
* goal API functions
* goal schemas
* goal-specific types

Avoid placing all application logic into generic folders.

---

# 17. Shared Components

A component should become shared when multiple areas genuinely need the same UI concept.

Examples:

```text id="3q8m5x"
Button
Input
Dialog
Card
Badge
EmptyState
ErrorState
ProgressBar
```

Do not create generic components merely because they might be reused someday.

---

# 18. Avoid Premature Abstraction

Do not create:

```text id="7m4x9q"
UniversalDataComponent
GenericFeatureManager
MegaForm
UniversalModal
```

just because several components currently look somewhat similar.

First understand the repeated behavior.

Then extract the smallest abstraction that actually helps.

---

# 19. Props

Props should be explicit and meaningful.

Prefer:

```text id="5x8m2q"
<GoalCard
  goal={goal}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

Avoid passing large unrelated objects when only a small part is needed.

Also avoid excessive prop drilling.

---

# 20. Prop Drilling

Passing props through one or two levels is perfectly acceptable.

For example:

```text id="9q3m7x"
Page
 ↓
Section
 ↓
Card
```

Do not immediately introduce global state or Context just because a prop travels through a couple of components.

Consider a different solution when:

* many levels are involved
* unrelated components need the same state
* the data is genuinely global

---

# 21. State Placement

Keep state as close as possible to where it is needed.

Prefer:

```text id="4m8x2q"
TaskCard
└── local open/close state
```

rather than placing every piece of UI state in a global store.

Use the project's state categories:

```text id="7q2m9x"
Local UI → useState/useReducer
Forms → React Hook Form
Server → TanStack Query
URL → React Router
Global → Context/shared state
```

---

# 22. Derived State

Do not store information that can be calculated from existing state.

Avoid:

```text id="6m3q8x"
tasks
completedTasks
```

when `completedTasks` can simply be derived from `tasks`.

Prefer:

```text id="9x2m7q"
const completedTasks = tasks.filter(...);
```

This reduces synchronization bugs.

---

# 23. Effects

Use `useEffect` for synchronization with external systems.

Good examples:

* browser APIs
* subscriptions
* external libraries
* synchronization with systems outside React

Do not use `useEffect` merely to calculate derived values that can be computed during rendering.

Avoid effect chains such as:

```text id="5q8m3x"
state A
 ↓
useEffect
 ↓
state B
 ↓
useEffect
 ↓
state C
```

when the values can be derived directly.

---

# 24. Hooks

Custom hooks should encapsulate reusable React behavior.

Examples:

```text id="2m7x9q"
useAuth
useGoals
useGoal
useCreateGoal
useDebounce
```

A hook should have a clear responsibility.

Avoid hooks that become massive collections of unrelated logic.

---

# 25. API Calls

Do not make API calls directly inside arbitrary UI components.

Avoid:

```text id="8q4m2x"
useEffect(() => {
  fetch(...)
}, [])
```

inside every page.

Use the documented API architecture:

```text id="7m3x9q"
Component
 ↓
Query/Hook
 ↓
API function
 ↓
HTTP client
 ↓
Backend
```

---

# 26. Server State

Do not copy server data unnecessarily into local React state.

Avoid:

```text id="4x8m2q"
const [goals, setGoals] = useState(...)
```

when TanStack Query already manages the server data.

Use local state for temporary UI concerns.

---

# 27. Forms

Forms should follow the project form architecture:

```text id="9m2q7x"
React Hook Form
      ↓
Zod
      ↓
Mutation
      ↓
API
```

Forms should handle:

* validation
* submission
* loading
* errors
* success
* accessibility

Avoid manually managing every input with separate `useState` variables when React Hook Form is appropriate.

---

# 28. Validation

Use Zod for client-side validation.

Keep schemas close to the feature when they are feature-specific.

For example:

```text id="3q8m5x"
features/goals/schemas/
```

The backend remains the final authority.

Never rely on frontend validation for security.

---

# 29. Styling

Use CSS Modules for component-specific styles.

Use global CSS for:

* resets
* base typography
* global layout rules
* design tokens
* truly global styles

Avoid large global stylesheets containing feature-specific rules.

---

# 30. Design Tokens

Use CSS variables for shared visual values.

Examples:

```text id="7m4x2q"
--color-primary
--color-success
--color-danger
--spacing-md
--radius-md
--shadow-sm
```

Components should use tokens rather than repeatedly hardcoding the same design values.

---

# 31. Conditional Styling

Use clear conditional class logic.

Avoid constructing huge strings manually throughout components.

If a small utility helps readability, use one.

Do not introduce a class-name library unless the project actually benefits from it.

---

# 32. Accessibility

Accessibility is part of implementation, not a final cleanup step.

Prefer semantic HTML:

```text id="5q8m3x"
<button>
<nav>
<main>
<section>
<form>
<label>
```

instead of recreating native behavior with generic elements.

---

# 33. Buttons vs Links

Use:

```text id="2m7x9q"
<button>
```

for actions.

Use:

```text id="8q3m4x"
<Link>
```

for navigation.

Do not use a clickable `<div>` when a button is appropriate.

---

# 34. Images and Icons

Images should have appropriate alternative text.

Decorative images should not create unnecessary screen-reader noise.

Icon-only buttons need accessible names.

For example:

```text id="6m9x2q"
<button aria-label="Delete goal">
```

The exact implementation may vary depending on the icon component.

---

# 35. Loading and Error States

Every important server-driven UI should consciously handle:

```text id="4x7m2q"
Loading
Empty
Success
Error
```

Do not leave these states as accidental behavior.

Use the shared components defined in the design architecture where appropriate.

---

# 36. Error Messages

User-facing errors should be:

* understandable
* concise
* actionable when possible
* free of sensitive technical information

Avoid exposing:

```text id="9q3m8x"
stack traces
database errors
internal service names
tokens
```

in the UI.

Detailed technical information belongs in appropriate developer logs.

---

# 37. Accessibility of Errors

Form errors should be associated with the relevant field.

Page-level errors should be visible and understandable.

Important dynamic error messages should be communicated appropriately to assistive technologies.

Follow the accessibility requirements defined in:

```text id="7m2x5q"
docs/02-design/accessibility.md
```

---

# 38. Imports

Keep imports organized and readable.

A typical grouping may be:

```text id="3q8m7x"
React / external libraries
↓
internal components
↓
hooks
↓
types
↓
utilities
↓
styles
```

The exact formatting should be enforced by tooling where possible.

Avoid deep, fragile relative imports when aliases make the code clearer.

---

# 39. Path Aliases

The project may use:

```text id="8m4q2x"
@/
```

for imports from `src`.

Example:

```text id="5q9m3x"
import { Button } from "@/components/ui/Button";
```

This avoids long relative paths such as:

```text id="2x7m8q"
../../../../components/ui/Button
```

The alias must be configured consistently in TypeScript and Vite.

---

# 40. Constants

Use constants when a value has meaningful shared meaning.

For example:

```text id="6m3x8q"
GOAL_STATUSES
TASK_STATUSES
API_TIMEOUT
```

Do not create constants for every literal value.

The goal is clarity, not abstraction for its own sake.

---

# 41. Magic Numbers and Strings

Avoid unexplained values.

Instead of:

```text id="9q2m7x"
if (progress > 80)
```

consider whether the number has a meaningful domain concept.

If it does:

```text id="4x8m3q"
const COMPLETION_THRESHOLD = 80;
```

However, don't create a constant if the meaning is already obvious and the value is only used once.

---

# 42. Utility Functions

Use `utils/` for genuinely reusable, generic functions.

Examples:

```text id="7m2q9x"
formatDate()
formatDuration()
calculatePercentage()
```

Do not use `utils/` as a dumping ground.

If a function is specific to goals, keep it in the goals feature.

---

# 43. Comments

Write comments when they explain **why**, not merely **what**.

Weak:

```text id="3q8m5x"
// Set loading to true
setLoading(true);
```

Useful:

```text id="8m4x2q"
// Keep the previous dashboard visible while the refresh is in progress.
```

Prefer clear code over comments that explain obvious syntax.

---

# 44. TODOs

TODO comments should represent real future work.

Good:

```text id="5q7m2x"
// TODO: Replace with server-side search once search is introduced.
```

Avoid leaving vague TODOs such as:

```text id="9m3x8q"
// TODO: fix this
```

If a TODO becomes important, record it in the appropriate project documentation or issue tracker.

---

# 45. Console Logging

Temporary debugging logs are fine during development.

Do not leave unnecessary:

```text id="7x2m4q"
console.log(...)
```

in production code.

Never log:

* passwords
* authentication tokens
* sensitive user information
* private API responses unnecessarily

---

# 46. Environment Variables

Use:

```text id="4m8q2x"
import.meta.env
```

through the centralized environment configuration.

Never commit secrets.

`.env.example` should document required public configuration without containing real secrets.

---

# 47. Git Conventions

Frontend changes should use meaningful commits.

Examples:

```text id="8q3m7x"
feat: add goal creation form
fix: handle expired authentication
test: add goal form validation tests
refactor: simplify goal API hook
style: update dashboard spacing
docs: document API integration
```

The exact Git workflow is defined more broadly in:

```text id="2m9x5q"
docs/05-development/git-workflow.md
```

---

# 48. Pull Request Conventions

A frontend PR should generally communicate:

* what changed
* why it changed
* important implementation notes
* tests performed
* screenshots when visual changes are significant

Keep PR descriptions focused.

Do not include unrelated changes merely because they happen to be convenient.

---

# 49. Component Review Checklist

Before considering a component complete, ask:

```text id="6x8m2q"
□ Does it have one clear responsibility?
□ Are its props understandable?
□ Is state placed appropriately?
□ Is accessibility handled?
□ Are loading/error/empty states needed?
□ Is styling consistent?
□ Is it reusable for a real reason?
□ Is the component testable?
```

---

# 50. Feature Review Checklist

For a feature:

```text id="3m7q9x"
□ Requirements are understood
□ User flow is defined
□ API contract is understood
□ Types are defined
□ Loading state exists
□ Empty state exists where needed
□ Error handling exists
□ Validation exists where needed
□ Accessibility is considered
□ Tests cover important behavior
□ No unnecessary abstraction was introduced
```

---

# 51. Before Merging

Before merging a frontend change:

```text id="9q4m2x"
□ TypeScript passes
□ ESLint passes
□ Tests pass
□ Build succeeds
□ Relevant E2E tests pass
□ No debugging logs remain
□ No secrets are committed
□ Accessibility concerns were considered
□ Documentation is updated when architecture changes
```

Not every small change requires every possible check locally, but CI should enforce the project's required checks.

---

# 52. Code Review Principles

When reviewing code, prioritize:

1. correctness
2. security
3. accessibility
4. maintainability
5. clarity
6. testability
7. performance
8. stylistic consistency

Avoid requesting changes solely because another coding style is personally preferred when both approaches are clear and consistent.

---

# 53. Performance

Do not optimize prematurely.

First make the application:

```text id="4m8q2x"
Correct
 ↓
Clear
 ↓
Maintainable
```

Then optimize measured bottlenecks.

Potential future optimizations include:

* route lazy loading
* image optimization
* memoization
* virtualization
* query caching
* bundle analysis

Use them when actual application behavior justifies them.

---

# 54. React Performance Rules

Do not automatically add:

```text id="7x3m9q"
useMemo
useCallback
React.memo
```

to everything.

They introduce complexity and are not automatically beneficial.

First write straightforward React code.

Optimize when:

* profiling shows a problem
* rendering is measurably expensive
* referential stability is actually needed

---

# 55. Security

Frontend security conventions include:

* never trust client-side authorization
* never expose secrets
* never log credentials
* validate user input
* safely render user-generated content
* avoid unsafe HTML injection
* use secure authentication mechanisms
* protect sensitive routes through backend authorization

Journal content and other user-generated data deserve particular attention if Markdown or rich content is rendered.

---

# 56. User-Generated Content

Mezgeb may eventually render:

* journal entries
* Markdown
* reflections
* notes

User-generated HTML or Markdown must be sanitized appropriately before rendering unsafe HTML.

Never assume that content is safe merely because it came from the application's own database.

---

# 57. Naming Consistency

Use the same domain terminology throughout the codebase.

For example, use:

```text id="5m8q2x"
Goal
Milestone
Task
LearningSession
JournalEntry
```

rather than switching between:

```text id="2q7m9x"
Goal / Project / Objective
```

for the same concept.

Consistent vocabulary makes both code and documentation easier to understand.

---

# 58. Product Language

UI terminology should match the product documentation.

For example:

```text id="8x3m7q"
Learning Session
```

should not randomly become:

```text id="6m2q9x"
Study Activity
```

unless the product intentionally changes the terminology.

If terminology changes, update documentation and code consistently.

---

# 59. Avoid Generic Project-Management Language

Mezgeb is a learning tracker.

Prefer language centered on learning:

```text id="4q8m2x"
Learning Goal
Learning Session
Reflection
Progress
```

rather than automatically adopting generic project-management terminology.

The UI should reinforce Mezgeb's identity.

---

# 60. Documentation

When an implementation changes architecture or an important convention, update the relevant documentation.

Examples:

```text id="7m3x9q"
New state-management approach
→ state-management.md

New API behavior
→ api-integration.md / api-specification.md

New design rule
→ design-system.md

New architectural decision
→ decisions.md
```

Do not allow documentation and implementation to drift indefinitely.

---

# 61. When to Add a Dependency

Before adding a package, ask:

```text id="9q2m7x"
What problem does it solve?
Can the existing stack solve it?
Will it reduce or increase complexity?
Is it actively maintained?
Does the project actually need it?
```

Avoid adding a dependency for a problem that can be solved simply with existing tools.

---

# 62. Dependency Philosophy

The project should remain intentionally lightweight.

For example:

```text id="5m8x3q"
React
+ React Router
+ TanStack Query
+ React Hook Form
+ Zod
```

is enough for many frontend requirements.

A new library should have a clear reason to exist.

---

# 63. Learning-First Development

Because Mezgeb is also a React learning project, do not hide important React concepts behind excessive abstractions.

For example, before introducing a complex state library, understand:

```text id="2q7m8x"
useState
useReducer
Context
effects
props
hooks
server state
```

The architecture should support learning rather than obscure it.

---

# 64. Progressive Complexity

Mezgeb should grow progressively.

```text id="8m3q9x"
Simple React
      ↓
Reusable Components
      ↓
Routing
      ↓
Forms
      ↓
API Integration
      ↓
Server State
      ↓
Testing
      ↓
Authentication
      ↓
Performance / Advanced Patterns
```

Do not build the most complicated version of the architecture before the application needs it.

---

# 65. General Rules

1. Prefer clarity over cleverness.
2. Prefer simple solutions over premature abstraction.
3. Keep responsibilities clear.
4. Keep state as local as practical.
5. Keep server state in TanStack Query.
6. Keep forms in React Hook Form.
7. Keep validation in Zod plus backend validation.
8. Keep feature-specific logic inside features.
9. Keep shared components genuinely generic.
10. Use semantic HTML.
11. Treat accessibility as part of implementation.
12. Test user-visible behavior.
13. Keep API communication behind the API layer.
14. Never trust the frontend for security.
15. Never expose secrets.
16. Keep naming consistent with the product domain.
17. Document meaningful architectural decisions.
18. Add dependencies only when they solve real problems.
19. Optimize based on evidence.
20. Keep the codebase understandable to the person learning from it.

---

# 66. Frontend Mental Model

The overall frontend structure can be remembered as:

```text id="6q4m8x"
                    APP
                     │
        ┌────────────┴────────────┐
        │                         │
     Routing                   Auth
        │                         │
        ▼                         ▼
      Pages                  Auth State
        │
        ▼
     Features
        │
   ┌────┴─────┐
   │          │
Components   Hooks
   │          │
   └────┬─────┘
        │
        ▼
   Server State
   / API Layer
        │
        ▼
   Spring Boot
```

And the development mindset is:

```text id="9m3x7q"
Understand
   ↓
Build simply
   ↓
Test behavior
   ↓
Observe real problems
   ↓
Refactor
   ↓
Document
```

The central principle is:

> **Mezgeb's frontend should be simple enough to learn from, structured enough to grow, and disciplined enough to behave like a real production application.**
