# State Management

## 1. Purpose

This document defines how state is managed in the Mezgeb frontend.

The goal is to make state:

* Predictable
* Easy to understand
* Easy to update
* Easy to test
* Appropriately scoped
* Separate between UI state and backend data

Mezgeb should avoid treating every piece of data as the same kind of state.

Instead, state is categorized according to **where it comes from and who needs it**.

---

# 2. State Categories

Mezgeb primarily has five types of state:

```text id="6j3q0p"
State
│
├── Local UI State
├── Form State
├── Server State
├── URL State
└── Global Client State
```

Each type should have a different owner.

---

# 3. State Ownership Principle

The most important rule is:

> **Keep state as close as possible to the components that need it.**

For example, if only a dialog needs to know whether it is open:

```tsx id="jzqk7f"
const [isOpen, setIsOpen] = useState(false);
```

There is no reason to put that state into a global store.

State should move upward or outward only when multiple parts of the application genuinely need access to it.

---

# 4. Local UI State

Local UI state controls temporary interface behavior.

Examples:

* Modal open/closed
* Dropdown open/closed
* Selected tab
* Expanded section
* Temporary toggle
* Hover-related UI state
* Sidebar visibility

Example:

```tsx id="c4m3x7"
const [isOpen, setIsOpen] = useState(false);
```

This state belongs to the component that controls the interaction.

---

# 5. When to Use Local State

Use React `useState` or `useReducer` when:

* Only one component needs the state
* The state is temporary
* The state represents UI behavior
* The state does not need to survive navigation
* The state does not originate from the backend

Example:

```text id="1u5j3s"
GoalCard
    ↓
Delete dialog open?
    ↓
useState()
```

---

# 6. Form State

Form state is a separate category because forms often have their own lifecycle.

Examples:

```text id="f0r7j2"
Goal title
Goal description
Goal dates
Journal title
Journal content
Login email
Login password
```

Mezgeb will use **React Hook Form** for forms that benefit from structured form management.

Example:

```text id="o5r5go"
GoalForm
   ↓
React Hook Form
   ↓
Zod validation
   ↓
Submit
```

Simple forms do not need unnecessary complexity.

---

# 7. Why Form State Should Be Separate

Form state is temporary.

For example:

```text id="9o1t4b"
User types:

"Learn React"
```

This value does not automatically need to become:

* Global state
* Server state
* Context state

It belongs to the form until submission.

After successful submission, the server becomes the source of truth.

---

# 8. Server State

Server state represents data that comes from the backend.

Examples:

```text id="5omlqi"
User
Goals
Milestones
Tasks
Learning Sessions
Journal Entries
Progress
```

Server state has characteristics that make it different from ordinary React state.

It can be:

* Loaded asynchronously
* Cached
* Refetched
* Stale
* Shared between components
* Updated by mutations
* Invalidated after changes

---

# 9. TanStack Query

Mezgeb will use **TanStack Query** for server-state management once the API layer is introduced.

It will handle concerns such as:

* Fetching
* Caching
* Loading states
* Error states
* Refetching
* Mutations
* Query invalidation
* Synchronization with backend data

Conceptually:

```text id="g05s9j"
Component
    ↓
useQuery()
    ↓
API Function
    ↓
Backend
```

---

# 10. Server State Example

For goals:

```text id="z6ihxq"
useGoals()
     ↓
GET /api/v1/goals
     ↓
Spring Boot
     ↓
PostgreSQL
```

The returned goals are server state.

The component should not create another unnecessary global copy of them.

---

# 11. Mutations

Changes to server state should use mutations.

Examples:

```text id="7yhlqg"
Create Goal
Update Goal
Delete Goal
Complete Task
Create Journal Entry
Record Learning Session
```

Conceptually:

```text id="49m9cg"
User Action
    ↓
Mutation
    ↓
API Request
    ↓
Backend
    ↓
Success
    ↓
Update / Invalidate Query
    ↓
UI Refresh
```

---

# 12. Query Invalidation

When a mutation changes backend data, related queries should be updated or invalidated.

Example:

```text id="7b5tq9"
Create Goal
    ↓
POST /goals
    ↓
Success
    ↓
Invalidate ["goals"]
    ↓
Goals query refetches
```

This avoids manually maintaining multiple copies of the same server data.

---

# 13. URL State

Some state belongs in the URL because it should be:

* Shareable
* Bookmarkable
* Preserved by navigation
* Represented by the current page

Examples:

```text id="02z4pv"
/app/goals/42
```

Here:

```text id="x5l4dk"
goalId = 42
```

is URL state.

Other possible URL state:

```text id="8q8k4g"
/app/goals?status=active
/app/journal?search=react
/app/journal?page=2
```

---

# 14. When to Use URL State

Use URL state when the state represents the current navigable view.

Good examples:

* Resource ID
* Search query
* Filter
* Sort order
* Pagination
* Selected resource

For example:

```text id="4ujf7h"
/app/journal?search=react
```

allows the search state to survive:

* Refresh
* Copy/paste
* Browser navigation

---

# 15. Global Client State

Global client state is state that genuinely needs to be accessed across unrelated parts of the application.

Potential examples:

```text id="8a0k3r"
Authentication/session state
Theme preference
Global notification state
```

Global state should remain small.

---

# 16. Authentication State

Authentication is a cross-cutting concern.

The application may need to know:

```text id="7a7l8c"
Is the user authenticated?
Who is the current user?
Is authentication still loading?
```

This can be exposed through an authentication provider/hook.

For example:

```tsx id="2o6qf1"
const { user, isAuthenticated, isLoading } = useAuth();
```

The implementation will be defined in:

`03-frontend/authentication.md`

---

# 17. Theme State

Theme preference may eventually be global because multiple unrelated components need to respond to it.

Example:

```text id="e6h1pf"
light
dark
system
```

A theme provider can expose this state.

However, the project should not introduce a global state library solely for theme switching.

React context is sufficient if the requirements remain simple.

---

# 18. Global Notifications

Global notifications are another reasonable use of shared state.

Example:

```text id="r6n9e8"
Goal created successfully.
```

A notification system may need to be triggered from different features.

Conceptually:

```text id="k2x6tb"
Feature
  ↓
Notification
  ↓
Global Toast UI
```

---

# 19. What Should NOT Be Global State

The following should generally remain local:

```text id="a6b0qk"
❌ Modal visibility
❌ Individual form fields
❌ Temporary input
❌ One page's selected tab
❌ Hover state
❌ One component's expanded/collapsed state
```

Unless multiple unrelated components genuinely need them.

---

# 20. State Decision Tree

When creating a piece of state, ask:

```text id="0j8jsk"
Where does this data come from?
          │
          ├── Backend
          │     ↓
          │  Server State
          │
          ├── URL
          │     ↓
          │  URL State
          │
          ├── Form
          │     ↓
          │  Form State
          │
          └── UI interaction
                ↓
             Local State
```

Then ask:

```text id="3j4r0k"
Does multiple unrelated application areas need it?
          │
          ├── No → Keep it local
          │
          └── Yes → Consider shared/global state
```

---

# 21. State Hierarchy

The preferred state hierarchy is:

```text id="q5e8v4"
1. Local State
       ↓
2. Form State
       ↓
3. URL State
       ↓
4. Server State
       ↓
5. Global Client State
```

This is not a strict ranking.

It represents a preference for using the **smallest appropriate scope**.

Do not jump directly to global state.

---

# 22. React Context

React Context should be used selectively.

Good candidates:

```text id="ap2g94"
Authentication
Theme
Global application configuration
```

Poor candidates:

```text id="7b9gq8"
Every goal
Every task
Every journal entry
Every form
```

Server data should generally be handled by TanStack Query rather than being placed into Context.

---

# 23. Global State Library

A dedicated global state library is **not required for the initial MVP**.

The project should first use:

```text id="1n0y9c"
useState
useReducer
Context
TanStack Query
React Hook Form
URL state
```

If genuine requirements later appear that these tools cannot handle cleanly, a state library can be evaluated.

This keeps the initial architecture simpler and reinforces understanding of React's built-in state model.

---

# 24. Derived State

Avoid storing values that can be calculated from existing state.

For example, if:

```text id="x4a7kd"
completedTasks = 8
totalTasks = 10
```

then:

```text id="m8q7c4"
progress = 80%
```

does not necessarily need to be stored separately in React state.

It can be derived:

```text id="v72b2h"
progress = completedTasks / totalTasks
```

This prevents multiple sources of truth.

---

# 25. Avoid Duplicated State

Avoid having:

```text id="9xj6lq"
goals
   ↓
selectedGoal
   ↓
goalDetails
```

when `selectedGoal` can be determined from:

```text id="7rc6l2"
/goals/:goalId
```

and the server query:

```text id="xw1v8r"
useGoal(goalId)
```

A useful principle is:

> **Store the source of truth, derive the rest.**

---

# 26. State Synchronization

The backend is the source of truth for persistent learning data.

For example:

```text id="c2r9a8"
Goal
Task
Journal Entry
Learning Session
```

The frontend may temporarily hold these values, but it should not assume that its local copy is permanently authoritative.

The general model is:

```text id="o8p4q7"
Frontend
   ↕
Backend
   ↓
Database
```

---

# 27. Optimistic Updates

Optimistic updates may be introduced for interactions where immediate feedback is valuable.

For example:

```text id="2h9g5b"
Complete Task
    ↓
Immediately show completed
    ↓
Send request
    ↓
Server confirms
```

However, optimistic updates add complexity.

They should only be introduced when the UX benefit justifies:

* Rollback handling
* Error handling
* Cache synchronization
* Race-condition considerations

The initial implementation can use straightforward mutations first.

---

# 28. Persistence

Not all frontend state should survive page refreshes.

### Usually temporary

```text id="m4k6s0"
Modal state
Form state
Selected tab
```

### Potentially persisted

```text id="aj1f8x"
Theme preference
Authentication/session information
User preferences
```

### Persisted by backend

```text id="x7b3hm"
Goals
Tasks
Sessions
Journal entries
Progress
```

The backend remains responsible for durable learning data.

---

# 29. State and Navigation

Navigation can naturally change state ownership.

For example:

```text id="6nt2b5"
Goals page
    ↓
Goal 42
```

The selected goal should be represented by:

```text id="8o6kna"
/app/goals/42
```

rather than a global variable such as:

```text id="2f1k4n"
selectedGoalId
```

The URL is the natural source of truth for the selected resource.

---

# 30. State and Forms

A typical Goal form may look like:

```text id="8u8a7k"
GoalForm
   │
   ├── React Hook Form
   │
   ├── Zod validation
   │
   └── useCreateGoal()
             ↓
          API
```

The form values exist locally until submission.

After submission:

```text id="6f6g8g"
Backend
    ↓
Goal created
    ↓
Query updated
    ↓
UI displays new goal
```

---

# 31. Example: Completing a Task

Suppose the user clicks:

```text id="n5a8qa"
Complete Task
```

The state flow should be:

```text id="k0j4c8"
User click
    ↓
TaskItem
    ↓
useCompleteTask()
    ↓
Mutation
    ↓
POST/PATCH API
    ↓
Backend
    ↓
Success
    ↓
Invalidate task/goal queries
    ↓
UI updates
```

The component should not maintain a second permanent copy of the task's completion state independently from the backend.

---

# 32. State and Loading/Error States

Server state naturally has multiple states:

```text id="t6r0f3"
Loading
Fetching
Success
Empty
Error
```

The UI should reflect these states intentionally.

For example:

```text id="9k2z5q"
useGoals()
    │
    ├── isPending → Skeleton
    │
    ├── isError → ErrorState
    │
    └── success
          ├── goals.length > 0 → GoalList
          └── goals.length === 0 → EmptyState
```

---

# 33. State Management by Feature

| State               | Example         | Preferred Tool             |
| ------------------- | --------------- | -------------------------- |
| Local UI            | Modal open      | `useState`                 |
| Local UI            | Selected tab    | `useState`                 |
| Form                | Goal title      | React Hook Form            |
| Validation          | Goal fields     | Zod                        |
| Server              | Goals           | TanStack Query             |
| Server              | Journal entries | TanStack Query             |
| URL                 | `goalId`        | React Router               |
| URL                 | Search/filter   | URL search params          |
| Auth                | Current user    | Auth context/provider      |
| Theme               | Light/dark      | Context/local storage      |
| Global notification | Toast           | Shared notification system |

---

# 34. State Management Rules

### Rule 1 — Start local

Use local state unless there is a reason not to.

### Rule 2 — Server data belongs to server-state management

Do not create unnecessary global copies of API responses.

### Rule 3 — Forms own their temporary values

Use React Hook Form where appropriate.

### Rule 4 — URLs own navigable state

Resource IDs, filters, search, and pagination can belong in the URL.

### Rule 5 — Keep global state small

Global state is for genuinely cross-cutting concerns.

### Rule 6 — Avoid duplicated state

Prefer deriving values from a single source of truth.

### Rule 7 — Avoid premature state libraries

Do not introduce a state-management library until actual requirements justify it.

### Rule 8 — Prefer predictable data flow

```text
User
 ↓
UI
 ↓
Mutation
 ↓
Backend
 ↓
Server State
 ↓
UI
```

### Rule 9 — Use optimistic updates selectively

Start with simple reliable mutations.

### Rule 10 — Scope state according to ownership

The component or system that owns the concern should own its state.

---

# 35. Final Mental Model

When deciding where state belongs, think:

```text id="8x7q7x"
"Is it backend data?"
        ↓
    TanStack Query

"Is it part of the URL?"
        ↓
    React Router

"Is it form input?"
        ↓
    React Hook Form

"Is it temporary UI behavior?"
        ↓
      useState

"Does the whole app need it?"
        ↓
    Context / shared state
```

The central principle is:

> **Use the smallest state scope that correctly represents the data.**

This keeps Mezgeb's state predictable while still giving the application room to grow.
