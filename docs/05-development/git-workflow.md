# Git Workflow

## 1. Purpose

This document defines how Git and GitHub are used during Mezgeb development.

The goal is to maintain a history that is:

* understandable
* reviewable
* reversible
* organized
* safe for collaboration
* suitable for a real production-style project

The workflow should remain simple enough for a solo learning project while following professional development practices.

---

# 2. Repository Structure

Mezgeb uses a single repository containing the main application and documentation.

```text
mezgeb/
├── frontend/
├── backend/
├── docs/
├── README.md
└── ...
```

This is a monorepo-style structure.

The frontend and backend remain separate applications inside the same repository.

---

# 3. Git Repository Responsibilities

Git tracks:

* source code
* tests
* configuration templates
* database migrations
* documentation
* CI/CD configuration
* Docker configuration
* project metadata

Git must **not** track:

* secrets
* real environment files
* passwords
* access tokens
* generated build output
* dependency directories
* local database data
* IDE-specific files

---

# 4. Main Branch

The primary branch is:

```text
main
```

`main` should represent code that is considered stable.

It should generally:

* build successfully
* pass the required automated checks
* contain reviewed changes
* remain deployable when deployment is configured

---

# 5. Feature Branches

New work should normally happen on a separate branch.

Example:

```text
main
  │
  └── feature/goal-creation
```

Avoid developing significant features directly on `main`.

---

# 6. Branch Naming

Use descriptive branch names.

Recommended prefixes:

```text
feature/
fix/
refactor/
test/
docs/
chore/
```

Examples:

```text
feature/goal-creation
feature/journal-entry
fix/task-completion
fix/auth-redirect
refactor/api-client
test/goal-service
docs/update-api-spec
chore/docker-setup
```

---

# 7. Branch Naming Rules

Branch names should:

* be lowercase
* use hyphens
* describe the work
* avoid unnecessary ticket numbers unless the project introduces issue IDs
* avoid vague names

Prefer:

```text
feature/journal-entry
```

over:

```text
feature/my-new-feature
```

Avoid:

```text
fenet-branch
test123
stuff
final-version
new-new
```

---

# 8. One Branch, One Purpose

A branch should ideally represent one logical piece of work.

For example:

```text
feature/create-goal
```

should focus on goal creation.

Avoid combining unrelated work:

```text
feature/goals-journal-auth-dashboard-css
```

If multiple changes are tightly related and required for one feature, keeping them together is reasonable.

---

# 9. Starting New Work

Before starting a new feature:

```bash
git switch main
git pull origin main
```

Then create a branch:

```bash
git switch -c feature/goal-creation
```

This ensures the branch starts from the latest `main`.

---

# 10. Keeping a Branch Updated

If `main` changes while working:

```bash
git fetch origin
git rebase origin/main
```

Rebasing keeps the feature branch history linear.

However, if a branch is already shared with other developers, coordinate before rewriting its history.

---

# 11. Merge vs Rebase

For local feature branches, rebase can be useful:

```text
main:       A ── B ── C
                  \
feature:           D ── E

after rebase:

main:       A ── B ── C
                       \
                        D' ── E'
```

The important rule is:

> Do not rewrite history that other developers are actively depending on without coordination.

---

# 12. Commit Philosophy

A commit should represent one logical change.

Good:

```text
feat: add goal creation form
```

Then:

```text
test: add goal creation validation tests
```

Then:

```text
fix: handle duplicate goal error
```

Avoid combining unrelated changes into one commit.

---

# 13. Commit Message Format

Use Conventional Commit-style prefixes.

```text
type: description
```

Common types:

```text
feat
fix
refactor
test
docs
chore
style
perf
build
ci
```

Examples:

```text
feat: add goal creation form
fix: handle expired authentication token
refactor: extract goal API client
test: add goal service tests
docs: document journal API
chore: update dependencies
ci: add frontend test workflow
```

---

# 14. Commit Message Rules

Commit messages should:

* start with a recognized type
* use imperative/clear wording
* describe the actual change
* remain concise

Prefer:

```text
feat: add journal entry editor
```

over:

```text
added some stuff for journal
```

---

# 15. Small Commits

Prefer several meaningful commits over one enormous commit.

Example:

```text
feat: add goal form
test: add goal form validation tests
feat: connect goal form to API
fix: display server validation errors
```

This makes debugging and reviewing easier.

---

# 16. Do Not Over-Split Commits

Small commits are useful, but do not create meaningless commits.

Avoid:

```text
fix: typo
fix: another typo
fix: another small thing
fix: save file
```

when all changes belong to one logical change.

A commit should have a meaningful unit of work.

---

# 17. Before Committing

Review the changes:

```bash
git status
```

Then inspect the diff:

```bash
git diff
```

For staged changes:

```bash
git diff --cached
```

Ask:

* Did I change what I intended?
* Did I accidentally modify unrelated files?
* Did I add secrets?
* Are generated files included?
* Are tests included where necessary?

---

# 18. Staging Changes

Stage intentionally:

```bash
git add path/to/file
```

or, when all current changes are known to be correct:

```bash
git add .
```

Then verify:

```bash
git status
```

before committing.

---

# 19. Never Commit Secrets

Never commit:

```text
.env
.env.local
.env.production
private keys
passwords
JWT secrets
database credentials
API keys
access tokens
```

Use:

```text
.env.example
```

for required variable names without real secret values.

Example:

```text
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
```

---

# 20. `.gitignore`

The repository should ignore common local/generated files.

Examples:

```text
node_modules/
dist/
build/
.env
.env.*
!.env.example
target/
.idea/
.vscode/
*.log
```

The exact `.gitignore` should reflect the actual tools used by the project.

---

# 21. If a Secret Is Accidentally Committed

Do not simply delete the file in a later commit and assume the secret is safe.

If a real credential was committed:

1. revoke/rotate the credential immediately
2. remove it from the repository
3. clean Git history if necessary
4. verify the credential can no longer be used

The credential itself should be considered compromised.

---

# 22. Pull Requests

Even when working alone, use pull requests for meaningful changes when practical.

Typical flow:

```text
feature branch
      ↓
push branch
      ↓
open Pull Request
      ↓
automated checks
      ↓
review
      ↓
merge
      ↓
delete branch
```

This creates a useful review checkpoint.

---

# 23. Pull Request Titles

PR titles should communicate the main change.

Examples:

```text
Add goal creation flow
Implement journal entry CRUD
Add authentication API
Add PostgreSQL database migrations
```

Avoid:

```text
Changes
Update
Final
Finished
```

---

# 24. Pull Request Description

A PR should briefly explain:

### What changed?

### Why was it needed?

### How was it tested?

Example:

```text
## Summary

- Added goal creation form
- Added client-side validation
- Connected form to goal creation API

## Testing

- Goal form tests
- Validation tests
- Frontend build
```

Keep the description proportional to the change.

---

# 25. PR Review Checklist

Before merging:

### Functionality

* Does the feature work?
* Are edge cases handled?

### Tests

* Are relevant tests present?
* Do existing tests still pass?

### UI

* Loading state?
* Empty state?
* Error state?
* Responsive behavior?

### Accessibility

* Keyboard usable?
* Labels present?
* Focus behavior correct?

### Security

* Authentication?
* Authorization?
* Input validation?
* Sensitive information?

### Code quality

* Clear naming?
* No unnecessary abstraction?
* No debugging logs?
* No unrelated changes?

### Documentation

* Does an architectural/documentation change need to be recorded?

---

# 26. Automated Checks

Pull requests should eventually run CI checks.

Conceptually:

```text
Pull Request
     ↓
Install
     ↓
Type Check
     ↓
Lint
     ↓
Frontend Tests
     ↓
Backend Tests
     ↓
Build
     ↓
Optional E2E Tests
```

A PR should not be merged if required checks fail.

---

# 27. Merge Strategy

For a small project, the preferred merge strategy is:

> **Squash merge for feature branches when the individual development commits do not provide useful long-term history.**

For example:

```text
feature branch:

A ── B ── C ── D

        ↓ squash

main:

A ── B ── S
```

where `S` represents the complete feature.

This keeps `main` relatively clean.

If individual commits represent meaningful historical steps, preserving them can also be appropriate.

---

# 28. Deleting Merged Branches

After a feature is merged:

```bash
git branch -d feature/goal-creation
```

Remove the remote branch when appropriate through GitHub or:

```bash
git push origin --delete feature/goal-creation
```

Keeping the repository free of obsolete branches makes navigation easier.

---

# 29. Working on Multiple Features

If two features are being developed independently:

```text
main
├── feature/goals
└── feature/journal
```

Each branch should have a clear scope.

Do not base one feature on another unless there is an actual dependency.

---

# 30. Dependent Branches

Sometimes a feature genuinely depends on unfinished work.

Example:

```text
feature/auth
      ↓
feature/protected-routes
```

In this case, make the dependency explicit.

Once the base feature is merged, rebase the dependent branch onto `main` if appropriate.

---

# 31. Handling Merge Conflicts

When conflicts occur:

1. identify conflicting files
2. understand both changes
3. resolve intentionally
4. run tests
5. inspect the final diff
6. continue the merge/rebase

Never blindly choose:

```text
ours
```

or:

```text
theirs
```

without understanding the changes.

---

# 32. Abort a Problematic Rebase

If a rebase becomes confusing:

```bash
git rebase --abort
```

This returns the branch to its previous state.

Understanding Git recovery commands is preferable to guessing.

---

# 33. Useful Git Recovery Commands

View history:

```bash
git log --oneline --graph --decorate
```

View branches:

```bash
git branch
```

View remote branches:

```bash
git branch -r
```

Fetch remote information:

```bash
git fetch origin
```

See current state:

```bash
git status
```

Inspect changes:

```bash
git diff
```

---

# 34. Undoing Changes

For unstaged changes to a file:

```bash
git restore path/to/file
```

For staged changes:

```bash
git restore --staged path/to/file
```

Be careful with destructive commands.

Always inspect the current state first:

```bash
git status
```

---

# 35. Amending a Commit

If a commit was just created and needs a small correction:

```bash
git commit --amend
```

This should generally be used before the commit has been shared.

Avoid rewriting shared history casually.

---

# 36. Force Push

Force pushing rewrites remote history.

Prefer:

```bash
git push --force-with-lease
```

over:

```bash
git push --force
```

when force pushing is genuinely necessary.

Force pushing should normally be limited to personal/unshared branches or coordinated situations.

---

# 37. Main Branch Protection

Once GitHub CI is configured, `main` should ideally have branch protection.

Potential requirements:

* pull request required
* CI checks required
* direct pushes restricted
* branch must be up to date when appropriate
* force pushes restricted

The exact settings can evolve with the project's collaboration needs.

---

# 38. Release Tags

When the application reaches meaningful milestones, Git tags may be used.

Example:

```text
v0.1.0
v0.2.0
v1.0.0
```

Tags should represent meaningful project versions rather than every minor change.

---

# 39. Versioning Philosophy

During development:

```text
0.x
```

can represent an evolving product.

A stable public release may eventually use:

```text
1.0.0
```

Versioning should communicate meaningful changes rather than become unnecessary administrative work.

---

# 40. Documentation and Git

Documentation changes should be committed with the code changes they describe when possible.

Example:

```text
feat: add journal API
docs: document journal endpoints
```

If the implementation and documentation are tightly coupled, they may be included in one commit.

The important requirement is that documentation does not intentionally remain outdated.

---

# 41. Database Migrations and Git

Flyway migrations must be version-controlled.

Example:

```text
backend/src/main/resources/db/migration/
├── V1__initial_schema.sql
├── V2__add_activity.sql
└── V3__add_goal_target_date.sql
```

Never silently modify an already-applied migration in a shared environment.

Create a new migration for schema changes.

---

# 42. Git Workflow for a Typical Feature

Example: adding goal creation.

### Step 1 — Update main

```bash
git switch main
git pull origin main
```

### Step 2 — Create branch

```bash
git switch -c feature/goal-creation
```

### Step 3 — Implement

Work through:

```text
UI
 ↓
Validation
 ↓
API
 ↓
Backend
 ↓
Database
 ↓
Tests
```

### Step 4 — Check changes

```bash
git status
git diff
```

### Step 5 — Run checks

```text
typecheck
lint
tests
build
```

### Step 6 — Commit

```bash
git add .
git commit -m "feat: add goal creation flow"
```

### Step 7 — Push

```bash
git push -u origin feature/goal-creation
```

### Step 8 — Open PR

Review the change and CI results.

### Step 9 — Merge

Use the agreed merge strategy.

### Step 10 — Clean up

```bash
git switch main
git pull origin main
git branch -d feature/goal-creation
```

---

# 43. Commit Frequency

Commit when you reach a meaningful logical checkpoint.

Good checkpoints include:

```text
component implemented
API connected
validation added
tests added
bug fixed
documentation updated
```

Do not wait until an entire month of work is complete.

---

# 44. Working Tree Discipline

Try to keep the working tree understandable.

Before switching tasks:

```bash
git status
```

If unfinished work exists, either:

* commit it if it is a meaningful checkpoint
* continue the branch
* use a temporary stash when appropriate

Avoid accumulating huge amounts of unrelated uncommitted work.

---

# 45. Stashing

Stash can temporarily store unfinished changes:

```bash
git stash
```

Restore:

```bash
git stash pop
```

Use stash as a temporary tool, not as a permanent storage mechanism.

Important work should eventually become a meaningful commit or be deliberately discarded.

---

# 46. Git as a Learning Tool

Git should not only be used to upload code.

Use it to understand:

* branching
* history
* collaboration
* conflict resolution
* rollback
* code review
* release management

Useful commands to understand deeply include:

```text
git log
git diff
git status
git switch
git branch
git fetch
git pull
git rebase
git merge
git restore
git reset
git revert
```

The goal is to understand what these commands do rather than memorize commands blindly.

---

# 47. Git Safety Rules

Before destructive operations:

```text
STOP
 ↓
Check git status
 ↓
Check current branch
 ↓
Check recent commits
 ↓
Understand the command
 ↓
Execute
```

Especially before:

```text
reset
rebase
force push
branch deletion
history rewriting
```

---

# 48. Solo Development

Even though Mezgeb may initially be developed primarily by one person, use professional habits where they provide learning value.

Recommended:

```text
main
  ↓
feature branch
  ↓
implementation
  ↓
tests
  ↓
PR
  ↓
merge
```

However, do not create unnecessary process overhead for tiny changes.

For a one-line typo fix, a feature branch and PR may not provide meaningful value.

---

# 49. Collaboration

If additional developers join later:

* do not rewrite shared branch history casually
* communicate branch dependencies
* keep commits focused
* resolve conflicts carefully
* review PRs
* protect `main`
* document architectural decisions
* avoid committing directly to protected branches

The workflow should scale without requiring a complete Git process redesign.

---

# 50. Git Workflow Checklist

## Before starting

* [ ] `main` is up to date
* [ ] Create an appropriately named branch
* [ ] Understand the task

## During development

* [ ] Keep changes focused
* [ ] Commit logical checkpoints
* [ ] Do not commit secrets
* [ ] Keep documentation updated
* [ ] Run relevant tests

## Before PR

* [ ] Review `git diff`
* [ ] Check `git status`
* [ ] Run lint/type checks
* [ ] Run tests
* [ ] Run build
* [ ] Review changed files
* [ ] Write a clear PR description

## Before merge

* [ ] CI passes
* [ ] Review completed
* [ ] Conflicts resolved
* [ ] No unrelated changes
* [ ] Documentation is current

## After merge

* [ ] Update local `main`
* [ ] Delete merged branch
* [ ] Start next task from updated `main`

---

# 51. Final Git Mental Model

The complete workflow is:

```text
Issue / Requirement
       ↓
main
       ↓
Feature Branch
       ↓
Implementation
       ↓
Tests
       ↓
Commit
       ↓
Pull Request
       ↓
CI + Review
       ↓
Merge
       ↓
Updated main
       ↓
Next Feature
```

The core principle is:

> **Git history should tell the story of how Mezgeb evolved.**

A developer should be able to look at the repository history and understand what changed, why it changed, and when it changed.
