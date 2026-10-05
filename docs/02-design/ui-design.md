# UI Design

## 1. Purpose

This document defines the user interface structure and layout principles for Mezgeb.

It describes the main screens, their sections, primary actions, and interaction patterns.

The goal is to create an interface that feels focused on learning rather than generic task management.

Visual tokens such as colors, typography, spacing, borders, shadows, and component states are defined separately in `design-system.md`.

---

# 2. Overall UI Structure

Mezgeb uses a consistent application shell for authenticated users.

```text
┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│ Sidebar       │              Main Content                    │
│               │                                              │
│ Dashboard     │                                              │
│ Goals         │                                              │
│ Journal       │                                              │
│ Progress      │                                              │
│ Settings      │                                              │
│               │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

The layout should adapt to smaller screens.

On mobile:

```text
┌─────────────────────────────┐
│ Header                      │
├─────────────────────────────┤
│                             │
│ Main Content                │
│                             │
│                             │
├─────────────────────────────┤
│ Mobile Navigation           │
└─────────────────────────────┘
```

---

# 3. Global Navigation

## Primary Navigation

The authenticated application should provide access to:

* Dashboard
* Goals
* Journal
* Progress
* Settings

The current page should have a clear active state.

## Global Create Action

Creation actions should be easy to access.

Depending on the page, the primary action may be:

* Create Goal
* Add Milestone
* Add Task
* Record Session
* New Journal Entry

The interface should avoid presenting too many competing primary actions at once.

---

# 4. Header

The global header provides application-level controls.

### Possible contents

* Mezgeb logo/name
* Current page context when useful
* Create action
* Notifications in future versions
* User/profile menu

Example:

```text
┌──────────────────────────────────────────────────────────────┐
│ MEZGEB                         + Create              Avatar ▾ │
└──────────────────────────────────────────────────────────────┘
```

The header should remain visually lightweight so that the main content receives most of the user's attention.

---

# 5. Sidebar

The sidebar provides primary navigation.

```text
MEZGEB

Dashboard
Goals
Journal
Progress

────────────

Settings

────────────

Profile
```

On smaller screens, the sidebar may collapse into a mobile navigation pattern.

The navigation should remain consistent across authenticated pages.

---

# 6. Dashboard

The dashboard is the user's learning overview.

## Structure

```text
Dashboard
────────────────────────────────────

Good morning, Hana.

Here's your learning overview.

┌──────────┐ ┌──────────┐ ┌──────────┐
│ Goals    │ │ Study    │ │ Streak   │
│ 3 Active │ │ 8h 20m   │ │ 7 days   │
└──────────┘ └──────────┘ └──────────┘

Active Goals
────────────────────────────────────

React
████████░░ 80%

System Design
█████░░░░░ 50%

DSA
███░░░░░░░ 30%

Recent Activity
────────────────────────────────────

✓ Completed "React Events"
◷ Studied React for 90 minutes
✎ Added journal entry

Recent Sessions
────────────────────────────────────

React          90 min
System Design  60 min
DSA            45 min
```

## Dashboard priorities

The dashboard should answer:

1. What am I learning?
2. How am I progressing?
3. What have I done recently?
4. What can I continue with?

---

# 7. Goals Page

The Goals page provides an overview of all learning goals.

```text
Goals                              + Create Goal

[All] [Active] [Completed] [Archived]

┌─────────────────────────────────────┐
│ Learn React                         │
│ Build strong React fundamentals.   │
│                                     │
│ ████████░░ 80%                     │
│ 8 / 10 tasks                        │
│                                     │
│ Active                              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Learn System Design                 │
│                                     │
│ █████░░░░░ 50%                     │
│ 5 / 10 tasks                        │
│                                     │
│ Active                              │
└─────────────────────────────────────┘
```

## Goal card information

A goal card may display:

* Title
* Description
* Status
* Progress
* Task completion
* Optional dates
* Last activity

The card should provide enough information to decide whether to open the goal.

---

# 8. Create Goal

The Create Goal interface should be intentionally simple.

```text
Create Goal

Title
[____________________________]

Description
[____________________________]
[____________________________]

Start Date
[____________]

Target Date
[____________]

                    Cancel   Create Goal
```

Required information should be minimal.

The user should not have to configure every possible property before beginning a learning goal.

---

# 9. Goal Details

The Goal Details page is the primary workspace for an individual goal.

```text
← Back to Goals

Learn React                         Edit

Build strong React fundamentals.

████████░░ 80%
8 / 10 tasks completed

────────────────────────────────────

Milestones

1. React Fundamentals       ✓
2. Hooks                    ████████░░
3. Routing                  ░░░░░░░░░░
4. State Management         ░░░░░░░░░░

────────────────────────────────────

Current Tasks

□ Learn useReducer
□ Build a custom hook
□ Practice React Router

────────────────────────────────────

Recent Sessions

Today      React Hooks       90 min
Yesterday  React State       60 min

────────────────────────────────────

Recent Reflections

"What I finally understood..."
```

## Goal actions

The user should be able to:

* Edit goal
* Archive goal
* Delete goal
* Add milestone
* Add task
* Record session
* Add journal entry

---

# 10. Milestone UI

Milestones should visually group related tasks.

```text
React Fundamentals                    4 / 5

████████░░ 80%

✓ JSX
✓ Components
✓ Props
✓ Events
□ Conditional Rendering
```

Milestones should support:

* Expand/collapse
* Completion
* Editing
* Deletion
* Reordering

The UI should make the relationship between milestones and tasks visually obvious.

---

# 11. Task UI

Tasks should remain lightweight.

Example:

```text
Current Tasks

□ Learn useReducer
□ Build a custom hook
◉ Learn component composition
```

Possible task information:

* Task title
* Status
* Milestone
* Completion state
* Optional due date
* Optional description

The task interaction should make completing a task quick.

---

# 12. Record Learning Session

The session form should prioritize speed.

```text
Record Learning Session

Goal
[ Learn React             ▾ ]

Milestone
[ Hooks                   ▾ ]

Date
[ Oct 2, 2026             ]

Duration
[ 90 ] minutes

Topic
[ useEffect and cleanup    ]

Notes / Reflection
[___________________________]
[___________________________]

                    Cancel   Save Session
```

The user should be able to record a session without filling in unnecessary fields.

---

# 13. Journal Page

The Journal page focuses on reflection.

```text
Journal                         + New Entry

[ Search journal... ]

────────────────────────────────────

Today

What I finally understood about useEffect
React · Hooks
Oct 2, 2026

────────────────────────────────────

Yesterday

Understanding component composition
React
Oct 1, 2026
```

Journal entries should be visually distinct from tasks.

The journal should feel more reflective and less like a checklist.

---

# 14. Journal Entry

A journal entry should prioritize readability.

```text
← Back to Journal

What I finally understood about useEffect

React · Hooks
October 2, 2026

────────────────────────────────────

Today I finally understood the difference
between effects and derived values...

I had previously been using useEffect for
things that could simply be calculated during
render.

────────────────────────────────────

Edit        Delete
```

The reading experience should be comfortable for longer reflections.

---

# 15. New Journal Entry

```text
New Journal Entry

Title
[____________________________]

Goal
[ Learn React             ▾ ]

Milestone
[ Hooks                   ▾ ]

Tags
[ react ] [ hooks ]

Content

┌──────────────────────────────┐
│                              │
│ Write about what you learned │
│                              │
│                              │
└──────────────────────────────┘

                    Cancel   Save Entry
```

The editor can initially use a simple text area.

A richer editor can be introduced later without making it a requirement for the MVP.

---

# 16. Progress Page

The Progress page provides a deeper view of the user's learning activity.

```text
Progress

Overview
────────────────────────────────────

Total Learning Time
24h 35m

Sessions
18

Tasks Completed
42

Current Streak
7 days

────────────────────────────────────

Goal Progress

React
████████░░ 80%

System Design
█████░░░░░ 50%

DSA
███░░░░░░░ 30%

────────────────────────────────────

Learning Activity

Mon  ███
Tue  █████
Wed  ██
Thu  ████
Fri  ██████
Sat  ███
Sun  █

────────────────────────────────────

Recent Activity
```

Charts should support understanding rather than simply decorating the page.

---

# 17. Settings

Settings should be divided into clear sections.

```text
Settings

Profile
────────────────
Name
Email
Profile information

Appearance
────────────────
Theme
Display preferences

Account
────────────────
Password
Logout
Delete account
```

Future settings may include:

* Notifications
* Integrations
* Data export
* Learning preferences

---

# 18. Forms

Forms throughout Mezgeb should follow consistent patterns.

### Structure

```text
Form Title

Field Label
Input
Helper Text
Error Message

Field Label
Input
Helper Text
Error Message

Cancel    Submit
```

### Principles

* Labels should be visible.
* Required fields should be clear.
* Validation errors should appear near the relevant field.
* Submit buttons should clearly communicate the action.
* Destructive actions should require confirmation when appropriate.

---

# 19. Modals and Dialogs

Modals should be used only when they help maintain context.

Appropriate uses include:

* Confirming deletion
* Confirming destructive actions
* Small quick-create forms
* Important confirmations

Example:

```text
Delete Goal?

Are you sure you want to delete
"Learn React"?

This action cannot be undone.

Cancel        Delete
```

Large or complex workflows should generally use dedicated pages rather than large modal dialogs.

---

# 20. Loading States

Loading states should communicate that content is being retrieved.

Possible patterns:

### Page loading

```text
┌─────────────────────────────┐
│                             │
│        Loading...           │
│                             │
└─────────────────────────────┘
```

### Content loading

Skeleton placeholders may be used for:

* Goal cards
* Dashboard statistics
* Activity lists
* Journal entries

Loading states should preserve the approximate layout of the eventual content when possible.

---

# 21. Empty States

Empty states should explain the situation and provide a useful next action.

Example:

```text
No learning goals yet.

Create your first goal and start
tracking your learning journey.

        + Create Goal
```

An empty state should answer:

* What is missing?
* Why does it matter?
* What should the user do next?

---

# 22. Error States

Errors should be understandable and actionable.

Example:

```text
Something went wrong.

We couldn't load your goals.

            Try Again
```

Errors should avoid exposing technical implementation details to users.

For example, avoid displaying raw server errors such as:

```text
500 Internal Server Error
NullPointerException
```

unless technical details are specifically useful to the user.

---

# 23. Responsive Design

Mezgeb should work across:

* Desktop
* Laptop
* Tablet
* Mobile

### Desktop

Use the full application shell with sidebar and main content.

### Tablet

The sidebar may become collapsible.

### Mobile

Navigation should become compact and touch-friendly.

Content should generally stack vertically.

Example:

```text
Desktop:

Sidebar | Content | Content


Mobile:

Header
Content
Content
Content
Bottom Navigation
```

Tables and wide data visualizations should have appropriate responsive behavior rather than simply overflowing the screen.

---

# 24. Accessibility

UI design should support accessible interaction from the beginning.

Important considerations include:

* Keyboard navigation
* Visible focus states
* Semantic HTML
* Proper form labels
* Accessible buttons
* Sufficient text contrast
* Meaningful error messages
* Accessible dialogs
* Screen-reader-friendly navigation
* Do not rely on color alone to communicate status

Accessibility requirements are defined further in `accessibility.md`.

---

# 25. Interaction Principles

### 25.1 Clear hierarchy

Important information should be visually prioritized.

### 25.2 Consistent actions

Similar actions should behave and look consistently throughout the application.

### 25.3 Preserve context

Users should understand which goal, milestone, or task they are working with.

### 25.4 Minimize friction

Common learning actions such as completing a task or recording a session should require minimal effort.

### 25.5 Progressive disclosure

Advanced information should appear when needed rather than overwhelming the user initially.

### 25.6 Feedback

Important actions should provide immediate feedback.

Examples:

* Task completed
* Goal created
* Session saved
* Journal entry saved
* Goal archived

---

# 26. UI Design Principle

The interface should feel like a **personal learning workspace**, not a generic project-management dashboard.

The visual and interaction hierarchy should continuously reinforce:

```text
What am I learning?
        ↓
Where am I?
        ↓
What did I do?
        ↓
What did I learn?
        ↓
What should I do next?
```

The UI should make the learner's journey understandable at a glance while keeping individual learning actions simple.
