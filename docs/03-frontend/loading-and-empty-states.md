# Loading and Empty States

## 1. Purpose

This document defines how Mezgeb handles:

* initial loading
* background fetching
* submitting/loading actions
* empty collections
* empty sections
* partially loaded pages
* skeletons
* placeholders
* retry states

Loading and empty states are part of the normal UI, not edge cases.

A user should always be able to understand:

> What is happening?

and, when there is no data:

> What can I do next?

---

# 2. Core Principle

Mezgeb distinguishes between:

```text id="7v3q1m"
Loading
Empty
Error
Success
```

These states must not be confused.

For example:

```text id="8x4p2k"
Loading
→ "We're still getting your goals."

Empty
→ "You don't have any goals yet."

Error
→ "We couldn't load your goals."

Success
→ Show the goals.
```

An empty state must never be used as a substitute for a loading state.

---

# 3. Standard Data Lifecycle

Most server-driven UI follows:

```text id="m9q2r7"
Initial
   ↓
Loading
   ↓
Success
   ├── Has data
   └── Empty

or

Loading
   ↓
Error
```

A later refetch may look different:

```text id="f5k8w3"
Existing data
      ↓
Background refetch
      ↓
Existing data remains visible
      ↓
Fresh data arrives
```

The UI should not unnecessarily disappear every time data is refreshed.

---

# 4. Types of Loading

Mezgeb will distinguish between several loading situations.

### Initial page loading

No data has been loaded yet.

### Background fetching

Existing data is displayed while newer data is being requested.

### Action loading

A user-triggered action is currently being processed.

Examples:

* saving a goal
* deleting a task
* recording a session

### Route loading

A new page or route is being loaded.

### Component loading

Only one section of a page is waiting for data.

These states can require different UI treatments.

---

# 5. Initial Loading

When a page has no data yet:

```text id="g4m1p8"
No data
   ↓
Request
   ↓
Loading UI
   ↓
Data
```

For example, when opening Goals:

```text id="9c2x7v"
Goals
────────────────
Loading goal cards...
```

The UI should avoid showing:

> No goals yet.

until the request has successfully completed.

---

# 6. Skeleton Loading

Skeletons can represent the approximate shape of content before it arrives.

Example:

```text id="p6k3q9"
┌─────────────────────────────┐
│ ██████████████              │
│ ███████████████████         │
│ ███████                     │
└─────────────────────────────┘
```

Skeletons are useful for:

* goal cards
* dashboard cards
* journal entries
* progress sections
* profile information

They should resemble the structure of the actual content.

---

# 7. Skeleton Rules

Skeletons should:

* match the approximate content structure
* remain visually simple
* avoid excessive animation
* not imply content that doesn't exist
* respect reduced-motion preferences
* disappear when the actual content is ready

Avoid creating elaborate skeleton animations merely for visual effect.

---

# 8. Spinner Usage

Spinners are useful when the waiting period is short and the UI already has meaningful context.

Good examples:

```text id="2w8m4p"
[ Save changes... ]
```

or:

```text id="q6v1r9"
Loading...
```

Spinners are less useful for large page layouts where skeletons can better communicate what is being loaded.

---

# 9. Loading Buttons

Buttons that trigger mutations should communicate their loading state.

Example:

```text id="8m3q7x"
Before:
[ Save Goal ]

During:
[ Saving... ]
```

During submission:

* prevent duplicate submissions
* preserve form values
* maintain the button's accessible name
* provide appropriate visual feedback

---

# 10. Background Fetching

Suppose the Goals page already has data:

```text id="1p6k9v"
Goal A
Goal B
Goal C
```

A background refresh occurs.

The existing data should generally remain visible:

```text id="x4q8m2"
Goal A
Goal B
Goal C

      ↻ updating
```

The page should not unnecessarily become:

```text id="r7n2c5"
Loading...
```

every time a background request occurs.

This distinction improves perceived stability.

---

# 11. Loading Indicators for Background Fetching

Background fetching can be communicated subtly.

Possible approaches:

* small loading indicator
* subtle "Updating..." text
* refresh indicator
* disabled refresh button while fetching

The indicator should not dominate the page.

---

# 12. Partial Loading

A page can contain multiple independent pieces of data.

For example:

```text id="w5m8q2"
Dashboard
├── Overview Stats
├── Active Goals
├── Recent Sessions
└── Recent Activity
```

These sections may load independently.

Instead of blocking the entire dashboard:

```text id="k3v9p1"
Dashboard
Loading everything...
```

the page can progressively display available sections.

For example:

```text id="9q2m5x"
Overview Stats     ✓
Active Goals       Loading...
Recent Sessions    ✓
Recent Activity    Loading...
```

This is useful when different queries are independent.

---

# 13. When to Use Full-Page Loading

A full-page loader is appropriate when the application cannot safely render the requested screen without some required information.

Examples:

* initial authentication resolution
* critical route-level data
* application bootstrapping

It should not be used simply because one small section is loading.

---

# 14. When to Use Local Loading

Local loading is preferable when only one part of the interface is affected.

Examples:

```text id="m7x4q8"
Goal Details
├── Goal information     ✓
├── Milestones           Loading...
└── Recent sessions      ✓
```

The rest of the page remains useful.

---

# 15. Empty States

An empty state occurs when a successful request returns no relevant data.

Example:

```text id="4k8p2m"
GET /goals
   ↓
200 OK
   ↓
[]
```

This means:

> There are currently no goals.

It does **not** mean:

> The request failed.

---

# 16. Empty State Structure

A useful empty state usually contains:

```text id="8q3m7v"
Title
Short explanation
Primary action
Optional secondary action
```

Example:

```text id="1x6p9k"
No learning goals yet.

Create a goal to start organizing your learning journey.

[Create Goal]
```

---

# 17. Empty States Should Guide Action

An empty state should answer:

> What should I do next?

For example:

### No goals

```text id="m4q7x2"
No goals yet.

Start by creating your first learning goal.

[Create Goal]
```

### No journal entries

```text id="p8k2v5"
Your journal is empty.

Record what you learned today.

[Write Entry]
```

### No sessions

```text id="q3m9x1"
No learning sessions recorded yet.

Record your first study session.

[Record Session]
```

---

# 18. Avoid Generic Empty Messages

Avoid:

```text id="5x8m2q"
No data.
```

It does not explain:

* what is empty
* why the user is seeing it
* what they can do next

Prefer a contextual message.

---

# 19. Empty vs First-Time Empty

A completely new user may see an empty state because they haven't used the feature yet.

This can be different from a user who previously had data but currently has none.

For example:

```text id="7q4m8x"
First-time:
"Create your first learning goal."

Existing user:
"No active goals right now."
```

The product can introduce this distinction when it becomes useful.

For the MVP, a simple contextual empty state is sufficient.

---

# 20. Search Empty States

Search can produce a different type of empty state.

Example:

```text id="2m7q9v"
Search:
"React"

Results:
0
```

This should not say:

> Your journal is empty.

because the journal may contain entries.

Instead:

```text id="4x8p1m"
No journal entries match "React".

Try another search.
```

This distinction becomes important when search is introduced.

---

# 21. Filtered Empty States

Similarly, filters may produce zero results even though data exists.

Example:

```text id="9v3m6q"
Status: Completed

No goals match this filter.
```

The user should have a way to:

```text id="7p2x5m"
Clear filters
```

when appropriate.

---

# 22. Empty Sections

A page can have data overall but one section may be empty.

Example:

```text id="3q8m1v"
Goal Details

Goal information       ✓
Milestones             ✓
Learning Sessions      Empty
Journal Entries        Empty
```

The empty section should not necessarily make the entire page look empty.

Instead, provide a compact contextual state.

Example:

> No learning sessions recorded for this goal yet.

[Record Session]

---

# 23. Dashboard Empty States

The dashboard is especially important for new users.

A new user might have:

```text id="p4x7m2"
0 Goals
0 Sessions
0 Journal Entries
```

Instead of showing a dashboard full of zeros, the UI should guide the first action.

For example:

```text id="9m3q8v"
Welcome to Mezgeb.

Start by creating a learning goal.

[Create Goal]
```

Other sections can still display their appropriate empty states.

---

# 24. Empty State Hierarchy

Not every empty state should have a large illustration or large call-to-action.

Use hierarchy based on importance.

### Primary empty state

Entire page has no content.

→ Larger explanation + primary action.

### Section empty state

One section has no content.

→ Compact explanation + contextual action.

### Minor empty state

Small optional area has no content.

→ Short text may be enough.

---

# 25. Error vs Empty

This distinction should remain explicit.

```text id="c7m4x9"
Loading
→ Request hasn't finished.

Empty
→ Request succeeded but there is no data.

Error
→ Request failed.

Success
→ Request succeeded and data exists.
```

This simple mental model prevents many UI bugs.

---

# 26. Loading and Empty State Components

Shared components can standardize common patterns.

Potential components:

```text id="8q5m2r"
Spinner
Skeleton
PageLoader
FullPageLoader
EmptyState
ErrorState
LoadingButton
```

These components should remain generic.

Feature-specific messages and actions belong to the feature.

For example:

```text id="m7x3p8"
<EmptyState
  title="No learning goals yet"
  description="Create your first goal..."
  action={...}
/>
```

The shared component controls presentation.

The feature controls meaning.

---

# 27. Accessibility

Loading states should be accessible.

Important considerations include:

* don't rely only on animation
* communicate important state changes appropriately
* ensure loading indicators have meaningful accessible labels where necessary
* preserve keyboard accessibility
* don't trap users in loading states
* ensure empty-state actions are keyboard accessible

For example:

```text id="5n8q2m"
Loading goals...
```

is more useful than an unlabeled spinning icon.

---

# 28. Reduced Motion

Skeleton animations and spinners should respect:

```text id="7m2x9q"
prefers-reduced-motion
```

For users who prefer reduced motion:

* reduce animation
* remove unnecessary movement
* preserve the information conveyed by the loading state

Loading should remain understandable without animation.

---

# 29. Avoiding Layout Shift

Loading placeholders should approximate the size of the content they replace when practical.

For example:

```text id="4p8m3q"
Skeleton card
      ↓
Actual card
```

should have similar dimensions.

This reduces sudden movement of content when data arrives.

---

# 30. Preserving Context

When loading new data, the application should preserve useful context.

For example, when navigating between journal entries:

```text id="x3q7m9"
Journal
  ↓
Entry selected
  ↓
Entry content loading
```

The surrounding application shell and navigation should remain stable where possible.

---

# 31. Loading During Navigation

When navigating to a new route:

```text id="2v8m4p"
Current page
    ↓
Navigation
    ↓
New route
    ↓
Data loading
```

the application should provide enough feedback that users know the navigation occurred.

The exact strategy may include:

* route-level loader
* skeleton page
* loading indicator

The UI should avoid feeling frozen.

---

# 32. Loading and Mutations

Mutations should communicate progress without unnecessarily blocking the entire interface.

Example:

```text id="8m1q7v"
Deleting task...
```

Only the relevant action should generally be disabled.

There is usually no reason to turn the entire application into:

```text id="6q4p2m"
Loading...
```

because one task is being deleted.

---

# 33. Retry from Loading/Error States

If loading fails, the error state should provide recovery.

Example:

```text id="p7m3x9"
Unable to load your goals.

[Try again]
```

Pressing retry should initiate the appropriate query again.

Retry should not require a full page refresh when the application can recover locally.

---

# 34. Testing Loading States

Loading and empty states should be tested explicitly.

### Loading

```text id="x8q2m4"
Mock pending request
 ↓
Render page
 ↓
Verify loading UI
```

### Empty

```text id="m5p9v1"
Mock successful empty response
 ↓
Verify empty state
 ↓
Verify primary action
```

### Success

```text id="4q7x3m"
Mock data
 ↓
Verify content
```

### Error

```text id="9m2p6v"
Mock failed request
 ↓
Verify ErrorState
 ↓
Verify retry action
```

These states are part of the component's observable behavior.

---

# 35. Loading and Empty State Rules

Mezgeb follows these rules:

1. Never show an empty state while data is still loading.
2. Distinguish loading, empty, error, and success states.
3. Use skeletons for larger content areas when appropriate.
4. Use spinners for short contextual loading states.
5. Keep existing data visible during background fetching when appropriate.
6. Use local loading indicators for local actions.
7. Avoid blocking the entire page for small operations.
8. Empty states should explain what is missing.
9. Empty states should provide a useful next action when appropriate.
10. Search/filter empty states should explain that no results match the current criteria.
11. Use shared loading and empty-state components for consistency.
12. Keep feature-specific meaning outside generic components.
13. Make loading and empty states accessible.
14. Respect reduced-motion preferences.
15. Avoid unnecessary layout shifts.
16. Preserve application context during loading.
17. Provide retry actions for recoverable failures.
18. Test loading, empty, success, and error states independently.

---

# 36. Mezgeb State Mental Model

```text id="6p4x8m"
                 REQUEST
                    │
                    ▼
                 Loading
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
       Success              Error
          │                   │
     ┌────┴────┐              ▼
     ▼         ▼           ErrorState
   Data      Empty
     │         │
     ▼         ▼
  Content   EmptyState
```

For an already-loaded page:

```text id="q7m3x9"
Existing Data
     │
     ▼
Background Fetch
     │
     ▼
Keep Existing Data Visible
     │
     ▼
Fresh Data
```

The central principle is:

> **Loading tells users what is happening, empty states tell them what is missing and what to do next, and neither should be confused with an error.**
