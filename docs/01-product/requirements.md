# Mezgeb — Product Requirements

## 1. Purpose

This document defines the functional and non-functional requirements for Mezgeb.

The requirements describe **what the system must provide**, while implementation details such as React components, API architecture, and database technology are documented separately.

---

# 2. Functional Requirements

## FR-01 — User Account

The system shall allow users to create and manage a personal account.

Users shall be able to:

* Register an account.
* Log in.
* Log out.
* View their profile.
* Update their profile information.

Authentication will be implemented when the backend is introduced.

---

## FR-02 — Learning Goals

The system shall allow users to create learning goals.

A goal shall contain at minimum:

* Title
* Description
* Status
* Start date
* Target date
* Progress

Users shall be able to:

* Create a goal.
* View their goals.
* View a specific goal.
* Edit a goal.
* Archive or delete a goal.
* Change a goal's status.

Possible goal statuses:

```text
PLANNED
ACTIVE
COMPLETED
ARCHIVED
```

---

## FR-03 — Goal Progress

The system shall calculate and display progress for each learning goal.

Progress should be based primarily on completed tasks.

Example:

```text
10 total tasks
6 completed

Progress = 60%
```

The progress calculation should be consistent throughout the application.

---

## FR-04 — Milestones

Users shall be able to divide a learning goal into milestones.

Users shall be able to:

* Create milestones.
* Edit milestones.
* Delete milestones.
* Reorder milestones.
* Mark milestones as completed.
* View milestone progress.

A milestone belongs to exactly one learning goal.

---

## FR-05 — Tasks

Users shall be able to create tasks within milestones.

Users shall be able to:

* Create tasks.
* Edit tasks.
* Delete tasks.
* Mark tasks as completed.
* Reopen completed tasks.
* Change task status.
* Reorder tasks where appropriate.

Possible task statuses:

```text
TODO
IN_PROGRESS
COMPLETED
```

A task belongs to one milestone.

---

## FR-06 — Learning Sessions

Users shall be able to record learning sessions.

A learning session shall support:

* Date
* Duration
* Goal
* Optional milestone
* Topic
* Description
* Optional reflection

Users shall be able to:

* Create a session.
* View sessions.
* Edit a session.
* Delete a session.

The system shall calculate total learning time from recorded sessions.

---

## FR-07 — Learning Journal

Users shall be able to create journal entries.

A journal entry shall support:

* Title
* Content
* Date
* Optional goal
* Optional milestone
* Tags

Users shall be able to:

* Create entries.
* View entries.
* Edit entries.
* Delete entries.
* Browse previous entries.

Journal entries should support longer-form reflection than task descriptions.

---

## FR-08 — Dashboard

The system shall provide a dashboard summarizing the user's learning activity.

The dashboard should display relevant information such as:

* Active goals
* Goal progress
* Recently completed tasks
* Recent learning sessions
* Total recent study time
* Current learning streak
* Recent journal activity

The dashboard should prioritize information that helps users understand their **current learning state**.

---

## FR-09 — Progress

The system shall provide a dedicated progress view.

The progress view should allow users to understand their learning activity over time.

Potential metrics include:

* Goal completion
* Task completion
* Study time
* Number of sessions
* Activity frequency
* Learning streak

The initial implementation should prioritize useful metrics rather than displaying every possible statistic.

---

## FR-10 — Activity

The system shall maintain a record of important learning activity.

Examples include:

```text
Completed a task
Created a goal
Recorded a learning session
Created a journal entry
Completed a milestone
```

Recent activity may be displayed on the dashboard and progress pages.

---

## FR-11 — Search and Filtering

The system should eventually allow users to search and filter their learning information.

Potential searchable content:

* Goals
* Tasks
* Journal entries
* Learning sessions

Potential filters include:

* Goal
* Status
* Date
* Tags

This feature is not required for the first MVP unless needed by the final UI.

---

## FR-12 — Settings

Users shall be able to manage application preferences.

Initial settings may include:

* Profile information
* Appearance preferences
* Account settings

Additional preferences can be introduced later.

---

# 3. User Experience Requirements

## UX-01 — Clear Navigation

Users should be able to move between major application areas without confusion.

The primary areas should include:

```text
Dashboard
Goals
Journal
Progress
Settings
```

---

## UX-02 — Consistent Interactions

Similar actions should behave consistently throughout the application.

For example:

* Create actions should use consistent UI patterns.
* Delete actions should require appropriate confirmation.
* Loading states should behave consistently.
* Errors should be communicated consistently.

---

## UX-03 — Feedback

The application should provide feedback when an important action occurs.

Examples:

```text
Goal created successfully.
Task completed.
Journal entry saved.
Unable to save changes.
```

---

## UX-04 — Empty States

Pages without data should provide useful empty states rather than appearing broken.

Example:

```text
No learning goals yet.

Start by creating your first learning goal.
[Create Goal]
```

---

## UX-05 — Loading States

The application should communicate when data is being loaded.

Loading states should be appropriate to the context.

Examples:

* Page-level loading
* Skeleton content
* Button loading state
* Inline loading

---

## UX-06 — Error States

The application should clearly communicate errors.

Errors should:

* Explain what happened when possible.
* Avoid exposing technical implementation details.
* Provide an appropriate next action when possible.

---

# 4. Non-Functional Requirements

## NFR-01 — Performance

The application should provide a responsive user experience.

The frontend should:

* Avoid unnecessary renders.
* Load only necessary resources.
* Avoid unnecessarily large bundles.
* Handle increasing amounts of user data efficiently.

Performance optimization should be based on actual needs rather than premature optimization.

---

## NFR-02 — Responsiveness

The application should work across common screen sizes.

The initial design should support:

* Desktop
* Laptop
* Tablet
* Mobile

The primary development experience may focus on desktop while maintaining responsive behavior.

---

## NFR-03 — Accessibility

The application should follow accessible web development practices.

The frontend should include:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Accessible form controls
* Appropriate labels
* Meaningful error messages
* Sufficient color contrast
* Appropriate ARIA usage where necessary

Accessibility should be considered during component development rather than added at the end.

---

## NFR-04 — Maintainability

The codebase should be structured so that it remains understandable as Mezgeb grows.

The project should use:

* Clear folder organization
* Consistent naming
* Reusable components
* Defined component responsibilities
* Consistent coding conventions
* Type safety
* Automated testing for important behavior

---

## NFR-05 — Reliability

Important user actions should not silently fail.

The system should properly handle:

* Network failures
* Invalid input
* Authentication failures
* Server errors
* Missing data
* Unexpected application states

---

## NFR-06 — Security

The system should protect user data.

The application should:

* Authenticate users securely.
* Authorize access to user-owned resources.
* Validate user input.
* Avoid exposing sensitive information.
* Protect authentication credentials and tokens.
* Use secure communication in production.

Specific authentication and security architecture will be documented separately.

---

## NFR-07 — Testability

Important application behavior should be testable.

Testing should eventually cover:

### Frontend

* Components
* User interactions
* Forms
* Validation
* Routing
* Important application flows

### Backend

* Business logic
* API endpoints
* Authentication
* Authorization
* Data access

End-to-end testing may be introduced after the core application is stable.

---

## NFR-08 — Scalability

The initial system does not need to support massive traffic.

However, the architecture should avoid decisions that unnecessarily prevent future growth.

The system should be designed so that additional functionality can be introduced without restructuring the entire application.

---

# 5. Data Ownership Rules

A user's learning data belongs to that user.

For authenticated users:

```text
User
 ├── Goals
 │    ├── Milestones
 │    │    └── Tasks
 │    └── Learning Sessions
 │
 └── Journal Entries
```

Users must not be able to access or modify another user's private learning data.

---

# 6. MVP Requirements

The first usable version of Mezgeb should focus on the following:

### Required

* User account
* Dashboard
* Learning goals
* Milestones
* Tasks
* Learning sessions
* Journal entries
* Basic progress tracking
* Basic navigation
* Loading states
* Empty states
* Error handling
* Responsive UI

### Deferred

The following should not be required for the initial MVP:

* Advanced analytics
* AI features
* Social features
* Calendar integration
* Complex gamification
* Advanced search
* Notifications
* External integrations
* Mobile application

These can be considered after the core learning workflow is stable.

---

# 7. Requirement Priority

Requirements will be prioritized using:

```text
P0 — Required for MVP
P1 — Important but can follow MVP
P2 — Future enhancement
```

### P0

```text
Authentication
Goals
Milestones
Tasks
Learning Sessions
Journal
Dashboard
Basic Progress
Navigation
Loading / Empty / Error states
Responsive UI
```

### P1

```text
Search
Filtering
Advanced progress visualization
Tags
More detailed activity history
Additional settings
```

### P2

```text
AI features
Social features
Calendar integration
Notifications
Advanced analytics
External integrations
Mobile application
```

---

# 8. Requirement Principles

The following principles should guide future requirements:

1. **Learning comes before gamification.**
2. **Core workflows should remain simple.**
3. **Every feature should have a clear purpose.**
4. **Features should support the learning journey rather than distract from it.**
5. **MVP scope should remain manageable.**
6. **Technical complexity should be introduced only when it solves a real problem.**
