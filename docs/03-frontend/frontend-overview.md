# Frontend Overview

## 1. Purpose

This document defines the overall frontend direction for Mezgeb.

The frontend is responsible for providing the user-facing learning experience, managing UI state, communicating with the backend API, handling user interactions, and presenting learning data in a clear and accessible way.

The frontend should remain simple enough to support learning React while being structured enough to evolve into a production-quality application.

---

# 2. Frontend Goals

The Mezgeb frontend should:

* Provide a clear learning-focused interface.
* Support the complete core learning flow.
* Communicate reliably with the backend.
* Handle loading, empty, and error states consistently.
* Maintain a predictable component structure.
* Provide responsive layouts.
* Follow accessibility requirements.
* Be easy to test.
* Be maintainable as the application grows.

---

# 3. Frontend Responsibilities

The frontend is responsible for:

### User Interface

Rendering:

* Dashboard
* Goals
* Goal details
* Milestones
* Tasks
* Learning sessions
* Journal
* Progress
* Settings
* Authentication screens

### User Interaction

Handling:

* Form input
* Task completion
* Navigation
* Filtering
* Sorting
* Dialogs
* Menus
* User preferences

### Client-Side State

Managing UI-related state such as:

* Form state
* Modal visibility
* Selected filters
* Navigation state
* Temporary UI state
* Authentication state where appropriate

Server-provided data should be treated separately from purely local UI state.

### API Communication

The frontend communicates with the backend through HTTP APIs.

It should handle:

* Requests
* Responses
* Authentication
* Loading states
* Errors
* Request cancellation where appropriate
* Data transformation where necessary

### Validation

Client-side validation should provide immediate feedback before requests are submitted.

Server-side validation remains authoritative.

---

# 4. Technology Direction

The initial frontend stack is:

| Technology            | Purpose                       |
| --------------------- | ----------------------------- |
| React                 | UI library                    |
| TypeScript            | Static typing                 |
| Vite                  | Development and build tooling |
| React Router          | Client-side routing           |
| CSS Modules / CSS     | Styling                       |
| React Hook Form       | Form state                    |
| Zod                   | Schema validation             |
| TanStack Query        | Server-state management       |
| Vitest                | Unit/component testing        |
| React Testing Library | UI testing                    |
| Playwright            | End-to-end testing later      |

Additional tooling:

| Tool           | Purpose                 |
| -------------- | ----------------------- |
| ESLint         | Code quality            |
| Prettier       | Code formatting         |
| Git            | Version control         |
| GitHub Actions | CI/CD                   |
| Docker         | Environment consistency |

Not every tool needs to be introduced immediately.

The project should adopt tools progressively as the corresponding complexity appears.

---

# 5. Frontend Architecture Direction

The frontend will use a component-based architecture.

At a high level:

```text
React Application
       │
       ├── Routing
       │
       ├── Pages
       │
       ├── Features
       │
       ├── Components
       │
       ├── Hooks
       │
       ├── API / Data Layer
       │
       ├── State
       │
       └── Utilities
```

The architecture should keep responsibilities separated without creating unnecessary abstraction.

---

# 6. Application Layers

The frontend can be viewed as several logical layers.

```text
┌─────────────────────────────┐
│           Pages             │
├─────────────────────────────┤
│        Feature UI           │
├─────────────────────────────┤
│     Shared Components       │
├─────────────────────────────┤
│ Hooks / Client State        │
├─────────────────────────────┤
│ API / Server State          │
├─────────────────────────────┤
│ Utilities / Configuration   │
└─────────────────────────────┘
```

Each layer should have a clear responsibility.

---

# 7. Pages

Pages represent route-level screens.

Examples:

```text
DashboardPage
GoalsPage
GoalDetailsPage
JournalPage
JournalEntryPage
ProgressPage
SettingsPage
LoginPage
RegisterPage
```

Pages should primarily compose feature components rather than contain large amounts of business logic.

---

# 8. Features

Features represent meaningful areas of Mezgeb.

Examples:

```text
auth
goals
milestones
tasks
sessions
journal
progress
dashboard
settings
```

Feature-specific UI and logic should generally live close to the feature that uses it.

For example:

```text
features/
└── goals/
    ├── components/
    ├── hooks/
    ├── api/
    ├── schemas/
    └── types/
```

The exact project structure will be defined in `project-structure.md`.

---

# 9. Shared Components

Shared components provide reusable UI primitives.

Examples:

```text
Button
Input
Modal
Dialog
Card
Badge
Spinner
Skeleton
EmptyState
ErrorState
StatusBadge
ProgressBar
```

Shared components should contain reusable UI behavior rather than feature-specific business logic.

---

# 10. Hooks

Hooks encapsulate reusable React behavior.

Examples:

```text
useAuth()
useGoals()
useGoal()
useCreateGoal()
useJournal()
useDebounce()
```

Hooks should have clear responsibilities.

A hook should not become a general-purpose dumping ground for unrelated logic.

---

# 11. API Layer

API communication should be separated from page components.

Instead of:

```text
Component
   ↓
fetch(...)
```

throughout the application, requests should eventually follow a consistent structure:

```text
Component
   ↓
Hook / Query
   ↓
API Function
   ↓
HTTP Client
   ↓
Backend
```

This makes API behavior easier to maintain and test.

---

# 12. Server State vs UI State

One important architectural distinction is between **server state** and **client/UI state**.

### Server State

Data that comes from the backend:

* Goals
* Milestones
* Tasks
* Sessions
* Journal entries
* Progress

This state may become stale and needs fetching, caching, synchronization, and error handling.

TanStack Query will eventually manage this category.

### UI State

Temporary state belonging to the interface:

* Modal open/closed
* Selected tab
* Form input
* Dropdown state
* Local filters
* Sidebar state

This can generally be handled with React state or local component state.

---

# 13. Authentication

Authentication affects the entire frontend.

The frontend needs to:

* Provide login/register interfaces.
* Store the appropriate authentication information.
* Determine whether a user is authenticated.
* Protect private routes.
* Handle expired sessions.
* Handle unauthorized API responses.
* Provide logout functionality.

Authentication details will be documented separately in:

`03-frontend/authentication.md`

---

# 14. Routing

Routing will be handled by React Router.

The router should distinguish between:

```text
Public Routes
    ↓
Login
Register

Protected Routes
    ↓
Dashboard
Goals
Journal
Progress
Settings
```

Protected routes should not render authenticated application content when the user is not authenticated.

Detailed route definitions will be documented in:

`03-frontend/routing.md`

---

# 15. Forms

Forms are common throughout Mezgeb.

Examples include:

* Registration
* Login
* Create goal
* Edit goal
* Create milestone
* Create task
* Record session
* Create journal entry
* Edit profile

Forms should provide:

* Client-side validation
* Accessible labels
* Clear errors
* Submission states
* Server error handling
* Successful submission feedback

Detailed form architecture will be documented in:

`forms-and-validation.md`

---

# 16. Error Handling

Errors can occur at several levels:

```text
User Input
    ↓
Validation Error

Network
    ↓
Request Failure

Backend
    ↓
API Error

Application
    ↓
Unexpected Error
```

The frontend should provide appropriate recovery behavior for each category.

Users should receive understandable messages rather than raw technical errors.

---

# 17. Loading States

The frontend should explicitly handle loading.

Examples:

* Initial page loading
* Goal list loading
* Goal detail loading
* Journal loading
* Form submission
* Background data refresh

Loading should not cause unnecessary layout shifts when possible.

---

# 18. Empty States

Empty states are part of the normal product experience.

Examples:

```text
No goals yet.
No journal entries yet.
No sessions yet.
No completed tasks yet.
```

Each relevant empty state should explain what is happening and provide a useful next action.

---

# 19. Responsive Design

The frontend should use responsive layouts from the beginning.

Target environments:

* Desktop
* Laptop
* Tablet
* Mobile

The application should not rely on desktop-only interactions.

---

# 20. Accessibility

Accessibility is a first-class frontend concern.

The frontend should follow the requirements defined in:

`02-design/accessibility.md`

This includes:

* Keyboard navigation
* Semantic HTML
* Accessible forms
* Focus management
* Screen-reader support
* Contrast
* Reduced motion
* Accessible dynamic content

---

# 21. Testing Strategy

The frontend will use multiple levels of testing.

### Unit Tests

Used for isolated logic and utilities.

### Component Tests

Used to test React components and user interactions.

### Integration Tests

Used to test multiple frontend pieces working together.

### End-to-End Tests

Used later for complete user journeys.

Example:

```text
Register
   ↓
Create Goal
   ↓
Create Task
   ↓
Complete Task
   ↓
Verify Progress
```

Testing details will be defined in:

`03-frontend/testing.md`

---

# 22. Performance

The initial application should prioritize straightforward implementation.

Performance considerations include:

* Avoid unnecessary re-renders.
* Keep component responsibilities clear.
* Avoid fetching data unnecessarily.
* Use appropriate caching.
* Lazy-load large routes when useful.
* Optimize images.
* Avoid unnecessary dependencies.

Performance optimization should be driven by actual needs rather than premature abstraction.

---

# 23. Security Considerations

The frontend should:

* Avoid exposing secrets.
* Never trust client-side authorization.
* Validate user input.
* Handle authentication safely.
* Avoid rendering unsanitized HTML.
* Use HTTPS in production.
* Avoid storing sensitive information unnecessarily.

The backend remains responsible for authoritative authentication and authorization decisions.

---

# 24. Environment Configuration

Frontend environment-specific configuration should use environment variables.

Examples may include:

```text
VITE_API_URL
VITE_APP_NAME
VITE_APP_ENV
```

Secrets must not be placed in frontend environment variables because Vite-exposed variables can be included in the client bundle.

Environment configuration will be documented in:

`05-development/environment-variables.md`

---

# 25. Development Philosophy

The frontend should follow a **learn → build → abstract** approach.

Instead of immediately introducing complex abstractions:

```text
Learn React concept
       ↓
Implement feature
       ↓
Identify repetition
       ↓
Extract reusable component/hook
```

This keeps the project educational while still allowing the codebase to become maintainable.

---

# 26. Frontend Quality Principles

The frontend should prioritize:

### Correctness

Features should behave according to their requirements.

### Accessibility

The interface should be usable by a broad range of users.

### Maintainability

Code should be understandable and easy to modify.

### Testability

Important behavior should be testable.

### Consistency

Similar interactions should behave similarly.

### Simplicity

Avoid abstractions that do not solve a real problem.

---

# 27. Frontend Architecture Principle

The Mezgeb frontend should be:

> **Simple enough to learn from, structured enough to grow, and disciplined enough to behave like a real production application.**
