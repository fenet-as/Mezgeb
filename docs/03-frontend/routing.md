# Frontend Routing

## 1. Purpose

This document defines the routing architecture of the Mezgeb frontend.

It covers:

* URL structure
* Public and protected routes
* Route hierarchy
* Layouts
* Dynamic route parameters
* Navigation
* Redirects
* Authentication guards
* Not-found handling
* Route-level loading and error behavior

Routing should make the application predictable for both users and developers.

---

# 2. Routing Technology

Mezgeb uses **React Router** for client-side routing.

React Router is responsible for:

* Mapping URLs to React components
* Nested routes
* Dynamic parameters
* Navigation
* Redirects
* Protected routes
* Route-level layouts
* Not-found routes

---

# 3. URL Structure

The authenticated application uses `/app` as its root namespace.

The initial route structure is:

```text
/
├── /login
├── /register
│
└── /app
    ├── /dashboard
    ├── /goals
    │   ├── /:goalId
    │   └── /:goalId/edit
    ├── /journal
    │   ├── /new
    │   └── /:entryId
    ├── /progress
    └── /settings
```

Full paths:

```text
/login
/register

/app/dashboard

/app/goals
/app/goals/:goalId
/app/goals/:goalId/edit

/app/journal
/app/journal/new
/app/journal/:entryId

/app/progress
/app/settings
```

---

# 4. Public Routes

Public routes can be accessed without authentication.

```text
/login
/register
```

### Login

```text
/login
```

Displays the login form.

### Register

```text
/register
```

Displays the account registration form.

---

# 5. Protected Routes

All learning-related application routes require authentication.

```text
/app/*
```

Protected routes include:

```text
/app/dashboard
/app/goals
/app/goals/:goalId
/app/goals/:goalId/edit
/app/journal
/app/journal/new
/app/journal/:entryId
/app/progress
/app/settings
```

Unauthenticated users attempting to access these routes should be redirected to:

```text
/login
```

---

# 6. Default Route

The root route:

```text
/
```

should redirect users based on authentication state.

Conceptually:

```text
/
│
├── Authenticated → /app/dashboard
│
└── Unauthenticated → /login
```

This gives users an immediate entry point into the application.

---

# 7. Application Layout

All authenticated routes share the `AppLayout`.

Conceptually:

```text
/app
└── AppLayout
    │
    ├── Header
    ├── Sidebar
    │
    └── Outlet
        ├── Dashboard
        ├── Goals
        ├── Journal
        ├── Progress
        └── Settings
```

This prevents every page from having to recreate:

* Header
* Sidebar
* Main content structure
* Navigation

---

# 8. Authentication Layout

Authentication pages use `AuthLayout`.

```text
/login
/register
```

Conceptually:

```text
AuthLayout
└── Outlet
    ├── LoginPage
    └── RegisterPage
```

The authentication layout should provide a consistent visual environment without displaying the authenticated application's sidebar.

---

# 9. Dashboard Route

```text
/app/dashboard
```

Displays the user's main learning overview.

The dashboard may include:

* Active goals
* Overall progress
* Recent activity
* Recent learning sessions
* Study time
* Streak
* Quick actions

The dashboard is the default authenticated landing page.

---

# 10. Goals Routes

Goals are one of the main resources in Mezgeb.

### Goals list

```text
/app/goals
```

Displays the user's goals.

### Goal details

```text
/app/goals/:goalId
```

Displays one specific goal.

Example:

```text
/app/goals/42
```

The `goalId` identifies the selected goal.

### Edit goal

```text
/app/goals/:goalId/edit
```

Example:

```text
/app/goals/42/edit
```

This displays the edit form for the selected goal.

---

# 11. Goal Route Hierarchy

Conceptually:

```text
/app/goals
│
└── :goalId
    │
    └── edit
```

The hierarchy communicates the relationship:

```text
Goals
  ↓
Specific Goal
  ↓
Edit Specific Goal
```

---

# 12. Journal Routes

### Journal list

```text
/app/journal
```

Displays the user's journal entries.

### Create entry

```text
/app/journal/new
```

Displays the journal entry creation form.

### View entry

```text
/app/journal/:entryId
```

Example:

```text
/app/journal/91
```

Displays one journal entry.

---

# 13. Journal Route Ordering

The static route:

```text
/new
```

must be handled distinctly from:

```text
/:entryId
```

Conceptually:

```text
/journal/new
/journal/:entryId
```

The router configuration should ensure that `/new` is treated as the creation route rather than interpreting `"new"` as an entry ID.

---

# 14. Progress Route

```text
/app/progress
```

Displays learning progress across the user's goals and activity.

Possible content:

* Goal completion
* Task completion
* Learning time
* Session history
* Activity
* Streak information

---

# 15. Settings Route

```text
/app/settings
```

Provides user account and application settings.

Initial sections:

* Profile
* Appearance
* Account

Future sections may include:

* Notifications
* Preferences
* Data export
* Integrations

---

# 16. Route Table

| Route                     | Access    | Page                | Purpose                                |
| ------------------------- | --------- | ------------------- | -------------------------------------- |
| `/`                       | Public    | Redirect            | Send user to appropriate starting page |
| `/login`                  | Public    | LoginPage           | Authenticate                           |
| `/register`               | Public    | RegisterPage        | Create account                         |
| `/app/dashboard`          | Protected | DashboardPage       | Learning overview                      |
| `/app/goals`              | Protected | GoalsPage           | View/manage goals                      |
| `/app/goals/:goalId`      | Protected | GoalDetailsPage     | View a goal                            |
| `/app/goals/:goalId/edit` | Protected | EditGoalPage        | Edit a goal                            |
| `/app/journal`            | Protected | JournalPage         | Browse journal                         |
| `/app/journal/new`        | Protected | NewJournalEntryPage | Create journal entry                   |
| `/app/journal/:entryId`   | Protected | JournalEntryPage    | View journal entry                     |
| `/app/progress`           | Protected | ProgressPage        | Review progress                        |
| `/app/settings`           | Protected | SettingsPage        | Manage settings                        |
| `*`                       | Any       | NotFoundPage        | Handle unknown route                   |

---

# 17. Protected Route Behavior

Protected routes should not immediately render private content before authentication is known.

The authentication state may initially be:

```text
unknown
```

Therefore the flow should be:

```text
Authentication State
        │
        ├── Loading/Unknown
        │       ↓
        │   FullPageLoader
        │
        ├── Authenticated
        │       ↓
        │   Render App
        │
        └── Unauthenticated
                ↓
             /login
```

This prevents incorrect redirects while the application is restoring the user's session.

---

# 18. Authenticated User Visiting Auth Pages

If an already authenticated user navigates to:

```text
/login
```

or:

```text
/register
```

the application should redirect them to:

```text
/app/dashboard
```

Conceptually:

```text
Authenticated + /login
        ↓
/app/dashboard
```

This prevents authenticated users from seeing unnecessary authentication forms.

---

# 19. Redirect After Login

After successful authentication:

```text
/login
   ↓
Successful authentication
   ↓
/app/dashboard
```

The default destination is the dashboard.

A future improvement may preserve the original requested URL.

For example:

```text
User visits /app/goals/42
        ↓
Not authenticated
        ↓
/login?redirect=/app/goals/42
        ↓
Successful login
        ↓
/app/goals/42
```

This behavior is optional for the initial MVP.

---

# 20. Navigation

Navigation should primarily use React Router navigation rather than manually manipulating browser URLs.

Use navigation mechanisms such as:

```tsx
<Link to="/app/goals">
  Goals
</Link>
```

or:

```tsx
navigate("/app/goals");
```

Avoid unnecessary direct use of:

```text
window.location
```

for normal internal application navigation.

---

# 21. Navigation Categories

Mezgeb has three main types of navigation.

### Primary navigation

Persistent application navigation:

```text
Dashboard
Goals
Journal
Progress
Settings
```

### Contextual navigation

Navigation related to the current resource.

Example:

```text
Goals
  ↓
Goal Details
  ↓
Edit Goal
```

### Action navigation

Navigation triggered by an action.

Examples:

```text
Create Goal → /app/goals
New Journal Entry → /app/journal/new
View Goal → /app/goals/:goalId
```

---

# 22. Browser Back/Forward Behavior

Routing should preserve normal browser navigation behavior.

For example:

```text
Goals
  ↓
Goal A
  ↓
Edit Goal
```

Pressing Back should normally return to:

```text
Goal A
```

and then:

```text
Goals
```

The application should not unnecessarily replace browser history when normal navigation is expected.

Use replacement navigation only when appropriate, such as certain authentication redirects.

---

# 23. Dynamic Route Parameters

Dynamic parameters identify resources.

Examples:

```text
:goalId
:entryId
```

A route:

```text
/app/goals/:goalId
```

can match:

```text
/app/goals/42
```

The page retrieves the parameter through React Router and uses it to request the corresponding goal.

Conceptually:

```text
URL
 ↓
goalId
 ↓
useGoal(goalId)
 ↓
API
 ↓
Goal Details
```

---

# 24. Invalid Resource IDs

A valid route does not necessarily mean the resource exists.

For example:

```text
/app/goals/999999
```

may match the route while the goal does not exist.

The application should distinguish:

```text
Route does not exist
```

from:

```text
Route exists, but resource does not exist
```

### Unknown route

```text
NotFoundPage
```

### Missing goal

```text
GoalNotFound / ErrorState
```

with an appropriate action such as:

```text
Back to Goals
```

---

# 25. Not Found Route

Any unmatched route should render a dedicated Not Found page.

Example:

```text
/something-that-does-not-exist
```

→

```text
NotFoundPage
```

The page should provide a useful recovery action:

```text
Return to Dashboard
```

or:

```text
Go Back
```

---

# 26. Route-Level Loading

Routes may display loading UI when the application needs to load:

* Authentication state
* Lazy-loaded page code
* Initial route data

For example:

```text
Route loading
     ↓
FullPageLoader
     ↓
Page
```

Loading indicators should not unnecessarily block the entire application when only a small section is loading.

---

# 27. Route-Level Error Handling

Unexpected route-level errors should display an appropriate error UI rather than leaving the user with a blank screen.

Conceptually:

```text
Route
 │
 ├── Success → Page
 │
 └── Error → Error UI
```

The error UI should provide recovery where possible.

---

# 28. Lazy Loading

Page-level code splitting may be introduced using React Router and dynamic imports.

For example:

```text
Dashboard
Goals
Journal
Progress
Settings
```

can potentially be loaded separately.

Conceptually:

```text
Initial bundle
    ↓
Load required page
    ↓
Render page
```

However, lazy loading should be introduced when it provides a meaningful benefit.

It should not be added everywhere simply because code splitting is possible.

---

# 29. Route Ownership

Each route should have one clear page owner.

Example:

```text
/app/goals
      ↓
GoalsPage
      ↓
Goals feature
```

The router should not contain the implementation of the page itself.

It should only define:

```text
URL → Page/Layout
```

---

# 30. Recommended Route Configuration

Conceptually, the router should follow this hierarchy:

```text
Router
│
├── AuthLayout
│   ├── /login
│   └── /register
│
└── ProtectedRoute
    │
    └── AppLayout
        ├── /app/dashboard
        ├── /app/goals
        │   ├── /:goalId
        │   └── /:goalId/edit
        ├── /app/journal
        │   ├── /new
        │   └── /:entryId
        ├── /app/progress
        └── /app/settings
```

This hierarchy keeps authentication and layout concerns separate from individual pages.

---

# 31. Routing Rules

### Rule 1 — URLs represent resources

Use meaningful URLs such as:

```text
/app/goals/42
```

rather than implementation-specific URLs.

### Rule 2 — Keep route names predictable

Use consistent resource naming:

```text
/goals
/journal
/progress
/settings
```

### Rule 3 — Use dynamic parameters for specific resources

```text
/goals/:goalId
/journal/:entryId
```

### Rule 4 — Keep routing separate from feature logic

The router determines where the user goes.

Features determine what happens inside the page.

### Rule 5 — Protect private routes

All `/app/*` routes require authentication.

### Rule 6 — Handle unknown routes

Every unmatched URL should receive a useful Not Found page.

### Rule 7 — Preserve browser navigation

Normal navigation should work naturally with Back and Forward.

### Rule 8 — Avoid unnecessary redirects

Redirect only when there is a clear reason.

---

# 32. Final Routing Mental Model

Think of routing as three layers:

```text
                    Router
                       │
          ┌────────────┴────────────┐
          │                         │
      Public                    Protected
          │                         │
     AuthLayout                AppLayout
          │                         │
    Login/Register          Dashboard/Goals/...
```

And within a resource:

```text
Goals
  │
  ├── /goals
  │
  ├── /goals/:goalId
  │
  └── /goals/:goalId/edit
```

The routing system should answer one fundamental question:

> **Given the current URL and authentication state, which part of the application should be displayed?**
