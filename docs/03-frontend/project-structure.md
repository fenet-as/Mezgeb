# Frontend Project Structure

## 1. Purpose

This document defines the folder and file structure of the Mezgeb frontend.

The structure should make it easy to answer:

* Where does this code belong?
* Is this code feature-specific or shared?
* Where should API calls live?
* Where should reusable components live?
* Where should tests live?
* How should the project grow without becoming difficult to navigate?

The structure follows the frontend architecture defined in `architecture.md`.

---

# 2. Initial Project Structure

The initial React application will use the following structure:

```text
frontend/
│
├── public/
│   ├── favicon.svg
│   └── ...
│
├── src/
│   │
│   ├── app/
│   │   ├── App.tsx
│   │   ├── providers.tsx
│   │   └── router.tsx
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── ...
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── feedback/
│   │   ├── forms/
│   │   └── layout/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── goals/
│   │   ├── milestones/
│   │   ├── tasks/
│   │   ├── sessions/
│   │   ├── journal/
│   │   ├── progress/
│   │   └── settings/
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── ...
│   │
│   ├── layouts/
│   │   ├── AppLayout.tsx
│   │   └── AuthLayout.tsx
│   │
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── goals/
│   │   ├── journal/
│   │   ├── progress/
│   │   └── settings/
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── ...
│   │   └── storage/
│   │       └── ...
│   │
│   ├── types/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── goal.ts
│   │   ├── journal.ts
│   │   └── ...
│   │
│   ├── utils/
│   │   ├── date.ts
│   │   ├── format.ts
│   │   └── ...
│   │
│   ├── config/
│   │   └── env.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   │
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── tests/
│   ├── components/
│   ├── features/
│   ├── pages/
│   └── setup.ts
│
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── ...
```

The structure is intentionally organized around **application responsibility and feature ownership**.

---

# 3. `src/app/`

The `app` directory contains application-level configuration and composition.

```text
src/app/
├── App.tsx
├── providers.tsx
└── router.tsx
```

### `App.tsx`

The main application component.

Its responsibility should remain small.

Example:

```tsx
function App() {
  return <RouterProvider router={router} />;
}
```

### `providers.tsx`

Contains application-wide providers.

Potential providers include:

* Authentication provider
* TanStack Query provider
* Theme provider
* Toast/notification provider

Example conceptual structure:

```text
AppProviders
├── QueryClientProvider
├── AuthProvider
├── ThemeProvider
└── Application
```

### `router.tsx`

Contains React Router configuration.

Detailed routing rules are documented separately in:

`03-frontend/routing.md`

---

# 4. `src/assets/`

Contains assets imported through the application module graph.

```text
src/assets/
├── images/
├── icons/
└── ...
```

Examples:

* Logo
* Illustrations
* Imported SVGs
* Local images

Assets used directly by React components should generally live here.

---

# 5. `src/components/`

Contains reusable components shared across multiple features.

```text
src/components/
├── ui/
├── feedback/
├── forms/
└── layout/
```

## `components/ui/`

Generic UI building blocks:

```text
Button
Input
Textarea
Select
Card
Badge
Dialog
Dropdown
ProgressBar
```

## `components/feedback/`

Components that communicate application state to users:

```text
Spinner
Skeleton
EmptyState
ErrorState
Toast
```

## `components/forms/`

Reusable form-related components:

```text
FormField
FormError
SubmitButton
```

## `components/layout/`

Reusable layout primitives:

```text
Container
PageHeader
Section
```

Feature-specific components should not be placed here.

---

# 6. `src/features/`

This is one of the most important directories in the project.

Each directory represents a product feature.

```text
features/
├── auth/
├── dashboard/
├── goals/
├── milestones/
├── tasks/
├── sessions/
├── journal/
├── progress/
└── settings/
```

A feature owns its feature-specific implementation.

For example:

```text
features/goals/
├── components/
│   ├── GoalCard.tsx
│   ├── GoalForm.tsx
│   ├── GoalList.tsx
│   └── GoalProgress.tsx
│
├── hooks/
│   ├── useGoals.ts
│   └── useCreateGoal.ts
│
├── api/
│   └── goals.api.ts
│
├── schemas/
│   └── goal.schema.ts
│
├── types.ts
└── tests/
```

The same general pattern can be used for other complex features.

---

# 7. Feature Size Should Determine Structure

Not every feature needs every folder.

For example, a small feature might simply contain:

```text
features/dashboard/
├── components/
└── types.ts
```

A larger feature might contain:

```text
features/goals/
├── components/
├── hooks/
├── api/
├── schemas/
├── utils/
├── types.ts
└── tests/
```

Do not create empty directories simply because the structure looks symmetrical.

> **Structure should reflect complexity, not predict it.**

---

# 8. `src/hooks/`

Contains hooks that are genuinely shared across multiple unrelated features.

Examples:

```text
src/hooks/
├── useDebounce.ts
├── useMediaQuery.ts
├── useLocalStorage.ts
└── ...
```

Feature-specific hooks belong inside their feature.

For example:

```text
features/goals/hooks/useGoals.ts
```

rather than:

```text
hooks/useGoals.ts
```

This makes ownership clear.

---

# 9. `src/layouts/`

Contains major application layouts.

```text
src/layouts/
├── AppLayout.tsx
└── AuthLayout.tsx
```

### `AppLayout`

Used for authenticated pages.

Conceptually:

```text
AppLayout
├── Header
├── Sidebar
└── Main Content
```

### `AuthLayout`

Used for authentication screens.

Conceptually:

```text
AuthLayout
└── Login / Register
```

Layouts provide structural composition rather than feature-specific behavior.

---

# 10. `src/pages/`

Pages represent route-level screens.

```text
src/pages/
├── auth/
├── dashboard/
├── goals/
├── journal/
├── progress/
└── settings/
```

Example:

```text
pages/goals/
├── GoalsPage.tsx
├── GoalDetailsPage.tsx
└── EditGoalPage.tsx
```

Pages should primarily compose feature components.

For example:

```tsx
function GoalDetailsPage() {
  return (
    <>
      <GoalHeader />
      <GoalProgress />
      <MilestoneList />
      <TaskList />
      <LearningSessionList />
    </>
  );
}
```

The detailed implementation belongs in the relevant feature directories.

---

# 11. `src/services/`

Contains infrastructure used to communicate with external systems.

```text
src/services/
├── api/
│   ├── client.ts
│   └── ...
│
└── storage/
    └── ...
```

### API

The API layer provides the HTTP boundary between React and Spring Boot.

Example:

```text
services/api/client.ts
```

can configure:

* Base URL
* Headers
* Authentication
* Request handling
* Response handling
* Common error handling

Feature-specific API functions remain inside their feature when appropriate.

Example:

```text
features/goals/api/goals.api.ts
```

uses:

```text
services/api/client.ts
```

### Storage

Used for browser storage abstractions when needed.

Examples:

* Local storage
* Session storage

---

# 12. `src/types/`

Contains types shared across multiple parts of the application.

Possible structure:

```text
types/
├── api.ts
├── auth.ts
├── goal.ts
├── milestone.ts
├── task.ts
├── session.ts
└── journal.ts
```

However, types that are only relevant to one feature should stay inside that feature.

For example:

```text
features/goals/types.ts
```

is preferable to putting a goal-form-only type into global `types/`.

### Rule

> Global types should be genuinely shared.

---

# 13. `src/utils/`

Contains small, reusable, framework-independent utilities.

Examples:

```text
utils/
├── date.ts
├── format.ts
├── validation.ts
└── ...
```

Possible utilities:

```text
formatDuration()
formatDate()
truncateText()
capitalize()
```

Utilities should not become a dumping ground for unrelated logic.

If a function belongs specifically to Goals, it should usually remain inside the Goals feature.

---

# 14. `src/config/`

Contains application configuration.

Example:

```text
config/
└── env.ts
```

Environment variables should be accessed through a controlled configuration layer rather than scattered throughout components.

Example:

```ts
export const env = {
  apiUrl: import.meta.env.VITE_API_URL,
  appName: import.meta.env.VITE_APP_NAME,
};
```

Only public frontend configuration should be exposed through Vite environment variables.

Secrets must never be placed in frontend environment variables.

---

# 15. `src/styles/`

Contains global styling and design tokens.

```text
styles/
├── globals.css
└── variables.css
```

### `globals.css`

Global styles such as:

* CSS reset
* Base typography
* Body styles
* Global accessibility defaults

### `variables.css`

Design tokens such as:

* Colors
* Spacing
* Typography
* Radius
* Shadows
* Breakpoints

Component-specific styles should generally remain close to the component, using CSS Modules where appropriate.

---

# 16. `main.tsx`

The entry point of the React application.

Responsibilities include:

* Finding the root DOM element
* Rendering the application
* Loading global styles
* Applying application providers

Conceptually:

```text
main.tsx
   ↓
AppProviders
   ↓
App
   ↓
Router
   ↓
Page
```

It should remain small.

---

# 17. Tests

Tests initially live in:

```text
tests/
├── components/
├── features/
├── pages/
└── setup.ts
```

Tests may also eventually live beside the code they test.

For example:

```text
features/goals/
├── components/
│   ├── GoalCard.tsx
│   └── GoalCard.test.tsx
```

The project will use the approach that keeps tests easiest to locate and maintain.

The exact testing organization will be defined in:

`03-frontend/testing.md`

---

# 18. Public vs Source Assets

There is an intentional distinction between:

```text
public/
```

and:

```text
src/assets/
```

### `public/`

For files that need to be served directly without being processed by the module system.

Example:

```text
public/favicon.svg
```

### `src/assets/`

For assets imported by React components.

Example:

```tsx
import logo from "@/assets/images/logo.svg";
```

General rule:

> Use `src/assets` for application assets and `public` for files that need direct public URLs.

---

# 19. Naming Conventions

### Components

Use PascalCase:

```text
GoalCard.tsx
GoalForm.tsx
EmptyState.tsx
```

### Hooks

Use `use` + PascalCase:

```text
useAuth.ts
useGoals.ts
useDebounce.ts
```

### Utilities

Use camelCase:

```text
formatDate.ts
formatDuration.ts
```

### API files

Use descriptive feature names:

```text
goals.api.ts
journal.api.ts
auth.api.ts
```

### Schemas

Use descriptive names:

```text
goal.schema.ts
login.schema.ts
journal.schema.ts
```

---

# 20. Import Rules

Imports should follow clear dependency boundaries.

Example:

```text
pages
  ↓
features
  ↓
shared components
```

A feature may use shared components:

```tsx
import { Button } from "@/components/ui/Button";
```

A shared component should not import a feature:

```text
components/ui/Button
        ✕
features/goals
```

This prevents architectural coupling.

---

# 21. Path Aliases

The project should use path aliases for important application imports.

Instead of:

```ts
import { Button } from "../../../components/ui/Button";
```

prefer:

```ts
import { Button } from "@/components/ui/Button";
```

The alias will be configured consistently across:

* TypeScript
* Vite
* Testing tools

This makes imports easier to read and reduces fragile relative paths.

---

# 22. Example Feature: Goals

A mature Goals feature could look like:

```text
features/goals/
│
├── components/
│   ├── GoalCard.tsx
│   ├── GoalForm.tsx
│   ├── GoalHeader.tsx
│   ├── GoalList.tsx
│   └── GoalProgress.tsx
│
├── hooks/
│   ├── useGoals.ts
│   ├── useGoal.ts
│   ├── useCreateGoal.ts
│   └── useUpdateGoal.ts
│
├── api/
│   └── goals.api.ts
│
├── schemas/
│   └── goal.schema.ts
│
├── types.ts
│
└── tests/
    ├── GoalCard.test.tsx
    └── GoalForm.test.tsx
```

The corresponding page remains simple:

```text
pages/goals/GoalDetailsPage.tsx
```

and composes the feature components.

---

# 23. Example Feature: Journal

The Journal feature may eventually look like:

```text
features/journal/
│
├── components/
│   ├── JournalCard.tsx
│   ├── JournalList.tsx
│   ├── JournalEditor.tsx
│   └── JournalFilters.tsx
│
├── hooks/
│   ├── useJournalEntries.ts
│   └── useCreateJournalEntry.ts
│
├── api/
│   └── journal.api.ts
│
├── schemas/
│   └── journal.schema.ts
│
├── types.ts
│
└── tests/
```

Again, the structure grows only when the feature actually needs it.

---

# 24. What Should NOT Go in `utils/`

Avoid turning `utils/` into a miscellaneous folder.

Do not put feature-specific code there simply because it is a function.

For example:

```text
❌ utils/goalProgress.ts
```

is usually better as:

```text
✅ features/goals/utils/goalProgress.ts
```

Likewise:

```text
❌ utils/journalFormatting.ts
```

could belong in:

```text
✅ features/journal/utils/journalFormatting.ts
```

The goal is to preserve ownership.

---

# 25. What Should NOT Go in Global State

Do not create a global store simply because a piece of state exists.

Avoid placing things like:

```text
❌ current form values
❌ modal visibility
❌ temporary input
❌ one page's selected tab
❌ server responses
```

into global state unnecessarily.

Prefer the narrowest appropriate scope.

---

# 26. Growth Strategy

The project should grow incrementally.

### Early project

```text
src/
├── app/
├── components/
├── features/
├── pages/
├── hooks/
├── services/
├── types/
└── utils/
```

### As complexity increases

Features gain their own:

```text
components/
hooks/
api/
schemas/
tests/
```

### Later

Additional infrastructure may be introduced:

```text
lib/
config/
providers/
analytics/
monitoring/
```

Only when there is a real need.

---

# 27. Structure Principles

The project structure follows these principles:

1. **Organize around features.**
2. **Keep pages focused on composition.**
3. **Keep reusable UI generic.**
4. **Keep feature-specific code with its feature.**
5. **Keep shared infrastructure independent of features.**
6. **Use the smallest appropriate state scope.**
7. **Avoid unnecessary global folders.**
8. **Avoid premature abstractions.**
9. **Make ownership obvious from the file location.**
10. **Let the structure evolve with the application.**

---

# 28. Final Mental Model

When creating a new piece of code, ask:

```text
Is it a complete screen?
        ↓
      pages/

Is it product-specific behavior?
        ↓
     features/

Is it reusable UI?
        ↓
   components/

Is it reusable React behavior?
        ↓
      hooks/

Is it backend communication?
        ↓
   api / services/

Is it shared data modeling?
        ↓
      types/

Is it a generic helper?
        ↓
      utils/
```

The most important rule is:

> **Put code where its responsibility and ownership are obvious.**

This keeps Mezgeb understandable as the project grows.
