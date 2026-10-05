# Changelog

## 1. Purpose

This document records meaningful changes made to Mezgeb over the course of development.

It provides a human-readable history of:

* new features
* important changes
* bug fixes
* architectural changes
* database changes
* breaking changes
* removed or deprecated functionality

The changelog should describe **what changed from the project's perspective**, not simply repeat Git commit messages.

---

# 2. Changelog Principles

The changelog should be:

* concise
* chronological
* user/developer meaningful
* easy to scan
* consistent
* independent of individual commit messages

Not every commit needs a changelog entry.

For example:

```text
git commit:
fix: correct goal card spacing

```

does not necessarily need to appear here.

But:

```text
Added goal archiving so users can remove inactive goals from their active learning workspace.
```

is meaningful enough to record.

---

# 3. Format

Each release or significant development milestone should use:

```text
## [Version or Milestone] — YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Removed
- ...

### Security
- ...

### Database
- ...
```

Only sections that contain relevant changes need to be included.

---

# 4. Change Categories

## Added

Use for new functionality.

Examples:

```text
- Added learning goal creation.
- Added milestone management.
- Added journal entries.
- Added progress dashboard.
```

---

## Changed

Use for modifications to existing behavior.

Examples:

```text
- Changed goal progress calculation to use completed tasks.
- Updated dashboard layout.
- Changed authentication error handling.
```

---

## Fixed

Use for bug fixes.

Examples:

```text
- Fixed tasks appearing under the wrong milestone.
- Fixed expired authentication tokens not redirecting correctly.
- Fixed incorrect study-time totals.
```

---

## Removed

Use when functionality is removed.

Examples:

```text
- Removed unused calendar integration.
- Removed deprecated endpoint.
```

---

## Security

Use for meaningful security changes.

Examples:

```text
- Added ownership checks for journal entries.
- Improved authentication token validation.
- Prevented users from accessing another user's goals.
```

Do not include secrets, tokens, credentials, or sensitive implementation details.

---

## Database

Use for meaningful schema or persistence changes.

Examples:

```text
- Added milestones table.
- Added task status field.
- Added index for user activity queries.
- Migrated journal documents to a new structure.
```

Database migrations should also exist in the backend migration system; the changelog is only the human-readable record.

---

# 5. Initial Project Entry

## [Unreleased]

The project is currently under active development.

### Added

* Defined Mezgeb as a personal learning progress tracker.
* Defined the core learning model:
  `Goal → Milestone → Task → Learning Session → Reflection → Progress`.
* Defined MVP requirements.
* Defined target users and product scope.
* Defined information architecture and user flows.
* Defined UI design and design system.
* Defined frontend architecture.
* Defined backend architecture.
* Defined REST API structure.
* Defined authentication and authorization strategy.
* Defined PostgreSQL and MongoDB data architecture.
* Defined development workflow.
* Defined testing strategy.
* Defined development roadmap.

---

# 6. Development Milestones

Major project milestones can also be recorded separately from releases.

Example:

## Milestone — Project Foundation

### Added

* Repository structure.
* Frontend project.
* Backend project.
* Documentation structure.
* Development environment configuration.

---

## Milestone — Frontend Foundation

### Added

* React + TypeScript application.
* Vite configuration.
* React Router.
* CSS architecture.
* Design tokens.
* Shared UI foundation.
* Frontend testing setup.

---

## Milestone — Backend Foundation

### Added

* Spring Boot application.
* PostgreSQL integration.
* MongoDB integration.
* Flyway migrations.
* API error handling.
* Validation.
* OpenAPI documentation.

---

## Milestone — Authentication

### Added

* User registration.
* User login.
* Authentication state.
* Protected routes.
* Backend authorization foundation.

---

## Milestone — Core Learning Structure

### Added

* Goals.
* Milestones.
* Tasks.
* Task completion.
* Ownership checks.

---

## Milestone — Learning Activity

### Added

* Learning sessions.
* Session history.
* Activity tracking.
* Learning reflections.

---

## Milestone — Journal

### Added

* Journal entries.
* Journal browsing.
* Journal editing.
* Goal/milestone associations.

---

## Milestone — Dashboard & Progress

### Added

* Dashboard.
* Recent activity.
* Study statistics.
* Goal progress.
* Task completion statistics.
* Progress visualization.

---

## Milestone — MVP

### Added

* Complete core learning journey.
* Responsive application.
* Authentication and authorization.
* Loading, empty, and error states.
* Core automated tests.
* Production deployment.

---

# 7. Versioning

Mezgeb may use semantic versioning once public releases become meaningful:

```text
MAJOR.MINOR.PATCH
```

For example:

```text
1.0.0
```

### MAJOR

Used for breaking changes.

Examples:

```text
1.0.0 → 2.0.0
```

when a major API or application behavior changes incompatibly.

### MINOR

Used for backward-compatible feature additions.

Example:

```text
1.0.0 → 1.1.0
```

when a new feature is introduced without breaking existing behavior.

### PATCH

Used for backward-compatible fixes.

Example:

```text
1.1.0 → 1.1.1
```

for bug fixes or small corrections.

During early development, `Unreleased` can be used instead of assigning a version to every milestone.

---

# 8. What Should Be Recorded?

Record changes that affect one or more of:

### Users

```text
new feature
changed behavior
bug fix
UX change
```

### Developers

```text
architecture change
API change
database change
development workflow change
testing infrastructure change
```

### Operations

```text
deployment change
environment change
security change
infrastructure change
```

---

# 9. What Should Usually Not Be Recorded?

Avoid filling the changelog with:

```text
- typo fixes
- formatting-only changes
- dependency patch updates with no meaningful impact
- renamed local variables
- minor CSS adjustments
- every individual commit
```

Unless the change has a meaningful effect on the project.

---

# 10. Relationship With Git

Git and the changelog serve different purposes.

### Git

Answers:

> What exactly changed in the code?

### Changelog

Answers:

> What meaningful change happened to Mezgeb?

For example:

```text
Git history

feat: add GoalController
feat: add GoalService
feat: add GoalRepository
feat: add goal form
test: add goal service tests
fix: handle duplicate goal title
```

The changelog might simply say:

```text
### Added
- Added goal creation and management.

### Fixed
- Added validation for duplicate/invalid goal data.
```

The changelog is therefore a **curated project history**, not a second Git log.

---

# 11. Breaking Changes

Breaking changes should be clearly identified.

Examples:

```text
### Changed

- Changed the goal API response structure.

### Breaking

- Clients using the previous goal response structure must update to the new API contract.
```

Breaking changes should also be reflected in:

* API documentation
* frontend integration
* tests
* migration notes where necessary
* relevant architectural decision records

---

# 12. Database Changes

Database changes should mention the conceptual change.

Example:

```text
## [Unreleased]

### Database

- Added `milestones` table.
- Added foreign key from milestones to goals.
- Added `position` field for milestone ordering.
- Added index on `goal_id`.
```

The actual migration should live in:

```text
backend/src/main/resources/db/migration/
```

The changelog should not replace database migrations.

---

# 13. API Changes

Meaningful API changes should be recorded.

Example:

```text
### Added

- Added `POST /api/v1/goals`.

### Changed

- Updated goal response to include progress information.

### Breaking

- Removed the previous goal creation request field.
```

API changes should also update:

```text
04-backend/api-specification.md
```

and relevant frontend API types/functions.

---

# 14. Security Changes

Security-related changes should be explicitly recorded.

Examples:

```text
### Security

- Added ownership validation for goal resources.
- Added authorization checks for journal entries.
- Improved invalid-token handling.
```

Never record:

```text
JWT_SECRET=...
password=...
API_KEY=...
```

or any other secret.

---

# 15. Release Workflow

When preparing a meaningful release:

```text
Review changes
      ↓
Review Git history
      ↓
Identify user-facing changes
      ↓
Identify technical changes
      ↓
Update changelog
      ↓
Run tests
      ↓
Build
      ↓
Create release/tag
```

The changelog should be reviewed before release rather than generated blindly from commits.

---

# 16. Keeping the Changelog Useful

The changelog should answer three questions quickly:

### What was added?

```text
New capabilities.
```

### What changed?

```text
Important behavior or architecture changes.
```

### What was fixed?

```text
Meaningful bugs and regressions.
```

A reader should be able to understand the evolution of Mezgeb without reading the entire Git history.

---

# 17. Maintenance Rules

When making a meaningful project change:

```text
1. Implement the change.
2. Test the change.
3. Update relevant documentation.
4. Add a changelog entry if the change is meaningful.
```

Do not wait until the end of the project to reconstruct the history.

For major milestones, update the changelog while the context is still fresh.

---

# 18. Final Principle

The changelog should tell the story of Mezgeb's evolution:

```text
Idea
 ↓
Foundation
 ↓
First working features
 ↓
Core learning experience
 ↓
MVP
 ↓
Improvements
 ↓
Future versions
```

The goal is not to document every line of code.

The goal is to preserve the **meaningful evolution of the product and engineering system**.
