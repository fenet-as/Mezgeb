# Component Architecture

## 1. Purpose

This document defines how React components should be designed, organized, composed, and reused throughout Mezgeb.

The goal is to make components:

* Easy to understand
* Reusable where appropriate
* Focused on one responsibility
* Easy to test
* Accessible
* Consistent with the design system
* Flexible enough to support future growth

The architecture should avoid two common problems:

```text
Too little structure
→ Giant components with everything inside them

Too much structure
→ Hundreds of tiny abstractions that make simple UI difficult to understand
```

The goal is a practical middle ground.

---

# 2. Component Philosophy

A component should have a clear reason to exist.

A useful mental model is:

```text
Component
├── Receives data
├── Displays UI
├── Handles relevant interaction
└── Communicates changes upward or outward
```

Components should generally avoid owning responsibilities that belong elsewhere.

For example:

```text
Component
    ↓
User interaction
    ↓
Hook / mutation
    ↓
API
```

rather than:

```text
Component
    ├── UI
    ├── validation
    ├── API calls
    ├── data transformation
    ├── authentication
    └── business rules
```

---

# 3. Component Categories

Mezgeb uses several categories of components.

```text
Components
│
├── Application Components
├── Layout Components
├── Page Components
├── Feature Components
├── Shared UI Components
└── Feedback Components
```

Each category has a different responsibility.

---

# 4. Application Components

Application-level components compose the application itself.

Examples:

```text
App
AppProviders
Router
ProtectedRoute
```

These components deal with application infrastructure rather than individual features.

They should remain relatively small.

---

# 5. Layout Components

Layout components define the structural arrangement of the application.

Examples:

```text
AppLayout
AuthLayout
Header
Sidebar
PageContainer
```

A layout determines **where things go**.

It should not generally determine **how a specific feature works**.

For example:

```text
AppLayout
├── Header
├── Sidebar
└── Main
    └── Current Page
```

---

# 6. Page Components

Page components represent complete route-level screens.

Examples:

```text
DashboardPage
GoalsPage
GoalDetailsPage
JournalPage
ProgressPage
SettingsPage
LoginPage
RegisterPage
```

A page should primarily compose components.

Example:

```text
GoalDetailsPage
│
├── GoalHeader
├── GoalProgress
├── MilestoneList
├── TaskList
├── LearningSessionList
└── RecentJournalEntries
```

The page should not contain the implementation of every section.

---

# 7. Feature Components

Feature components implement product-specific UI.

Examples:

```text
GoalCard
GoalForm
MilestoneCard
TaskItem
SessionForm
JournalCard
JournalEditor
ProgressSummary
```

These components belong inside their respective feature directories.

For example:

```text
features/goals/components/GoalCard.tsx
```

rather than:

```text
components/GoalCard.tsx
```

because `GoalCard` represents Mezgeb's Goals feature rather than a generic UI pattern.

---

# 8. Shared UI Components

Shared UI components are generic and reusable.

Examples:

```text
Button
Input
Textarea
Card
Dialog
Badge
ProgressBar
Select
```

A shared component should not know about Mezgeb's business concepts unless that concept is itself a generic UI pattern.

For example:

```tsx
<Button variant="primary">
  Create Goal
</Button>
```

is appropriate.

But:

```tsx
<GoalButton />
```

would usually belong to the Goals feature.

---

# 9. Feedback Components

Feedback components communicate application state.

Examples:

```text
LoadingSpinner
Skeleton
EmptyState
ErrorState
Toast
Alert
```

They can be shared because the underlying UI pattern is not specific to one feature.

For example:

```tsx
<EmptyState
  title="No goals yet"
  description="Create your first learning goal to get started."
/>
```

The component provides the presentation while the Goals feature provides the content.

---

# 10. Component Composition

Mezgeb should favor **composition over large configurable components**.

For example, instead of creating:

```tsx
<UniversalCard
  type="goal"
  showProgress
  showActions
  showDescription
  showSessionCount
  ...
/>
```

prefer:

```text
GoalCard
├── Card
├── GoalStatusBadge
├── GoalProgress
└── GoalActions
```

The generic `Card` provides structure.

The Goals feature provides meaning.

This keeps components easier to understand.

---

# 11. Component Responsibility

A component should have a reasonably focused responsibility.

For example:

### `GoalCard`

Responsible for displaying a goal summary.

It may show:

* Title
* Description
* Status
* Progress
* Dates

It should not also:

* Fetch unrelated journal entries
* Manage authentication
* Control application routing globally
* Calculate unrelated dashboard statistics

---

# 12. Container vs Presentational Thinking

Mezgeb does not need a strict container/presentational architecture.

However, the distinction is useful.

### Presentational component

Primarily displays data:

```text
GoalCard
TaskItem
JournalCard
ProgressBar
```

### Data-aware component

Retrieves or mutates data:

```text
GoalsPage
GoalDetailsPage
GoalListContainer
```

A practical pattern is:

```text
Page / Feature Container
        ↓
Data / Hook
        ↓
Presentational Components
```

This keeps data-fetching concerns separate from reusable UI where useful.

---

# 13. Props

Props should communicate what a component needs.

Example:

```tsx
<GoalCard
  title={goal.title}
  status={goal.status}
  progress={goal.progress}
/>
```

Props should be:

* Explicit
* Meaningful
* Type-safe
* As small as reasonably practical

Avoid passing large unrelated objects when only a few fields are needed.

---

# 14. Avoid Excessive Prop Drilling

Prop drilling occurs when data is passed through many components that do not actually use it.

For example:

```text
Page
 ↓
Section
 ↓
Container
 ↓
Card
 ↓
Button
```

where every layer only forwards the same prop.

If this becomes common, consider:

* Better component composition
* Context
* A feature hook
* Server-state access
* A more appropriate state boundary

Do not introduce global state immediately just because props are being passed through two or three levels.

A small amount of prop passing is normal React.

---

# 15. Component State

Local UI state should generally live in the component that owns the interaction.

Example:

```tsx
const [isOpen, setIsOpen] = useState(false);
```

For a confirmation dialog:

```text
GoalCard
└── ConfirmDialog
```

the dialog's open/closed state can remain local if nothing else needs it.

State should move upward only when another component genuinely needs to control it.

---

# 16. Controlled Components

Forms and reusable inputs should generally support controlled usage when appropriate.

Example:

```tsx
<Input
  value={title}
  onChange={handleChange}
/>
```

The component owns the presentation of the input.

The parent owns the value when the parent needs to control it.

Form libraries such as React Hook Form may later handle this relationship for more complex forms.

---

# 17. Component Events

Child components should communicate user actions through callbacks.

Example:

```tsx
<TaskItem
  task={task}
  onComplete={handleComplete}
/>
```

The child reports:

```text
User clicked Complete
        ↓
onComplete()
        ↓
Parent / Hook
        ↓
Mutation
```

This keeps the component reusable and avoids coupling it directly to a specific API implementation.

---

# 18. Avoid API Calls Inside Generic UI

A generic component such as:

```text
Button
Modal
Input
Card
Dropdown
```

should not make API requests.

For example, avoid:

```text
Button
  ↓
POST /goals
```

Instead:

```text
GoalForm
  ↓
useCreateGoal()
  ↓
API
```

The Button should simply communicate that the user clicked it.

---

# 19. Component Variants

Reusable components may support controlled variants.

For example:

```tsx
<Button variant="primary" />
<Button variant="secondary" />
<Button variant="destructive" />
```

This is appropriate because the variations represent the same underlying UI concept.

Avoid adding a variant for every individual feature.

Bad:

```text
Button variant="goal"
Button variant="journal"
Button variant="task"
Button variant="dashboard"
```

These represent product concepts rather than reusable UI variants.

---

# 20. Component Size

There is no universal line-count limit for a React component.

Instead, look for signs that a component is doing too much.

Extract a component when:

* A section has a clear responsibility
* A section is reused
* The component becomes difficult to navigate
* A section has independent state
* A section needs independent testing
* The component mixes several unrelated concerns

Do not extract a component simply because it has 20–30 lines.

---

# 21. When NOT to Extract

Avoid creating unnecessary components such as:

```text
GoalTitle
GoalDescription
GoalDate
GoalIcon
```

if each is only:

```tsx
<span>{value}</span>
```

and provides no meaningful reuse or responsibility.

This can make the code harder to follow.

Prefer extracting meaningful UI sections.

---

# 22. Feature Component Example

A Goal Details screen could be structured as:

```text
GoalDetailsPage
│
├── GoalHeader
│   ├── GoalStatusBadge
│   └── GoalActions
│
├── GoalOverview
│
├── GoalProgress
│
├── MilestoneSection
│   ├── MilestoneCard
│   └── MilestoneCard
│
├── TaskSection
│   ├── TaskItem
│   ├── TaskItem
│   └── TaskItem
│
├── LearningSessionSection
│   └── SessionCard
│
└── JournalPreview
    └── JournalCard
```

Each section has a meaningful purpose.

---

# 23. Feature vs Shared Component Decision

When deciding where a component belongs, ask:

### Question 1

Is it generic UI?

```text
Button
Card
Input
Dialog
```

→ `components/`

### Question 2

Does it represent a Mezgeb feature?

```text
GoalCard
TaskItem
JournalCard
```

→ `features/<feature>/components/`

### Question 3

Is it a complete route-level screen?

```text
GoalsPage
DashboardPage
```

→ `pages/`

### Question 4

Does it define application structure?

```text
AppLayout
AuthLayout
```

→ `layouts/`

---

# 24. Component Dependencies

The preferred dependency direction is:

```text
Pages
  ↓
Feature Components
  ↓
Shared Components
```

For example:

```text
GoalDetailsPage
    ↓
G
```
