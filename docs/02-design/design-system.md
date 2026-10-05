# Design System

## 1. Purpose

This document defines the visual language and reusable UI foundations for Mezgeb.

The design system establishes consistent rules for:

* Colors
* Typography
* Spacing
* Layout
* Borders
* Border radius
* Shadows
* Icons
* Buttons
* Forms
* Status indicators
* Feedback states
* Responsive behavior

The goal is to make Mezgeb feel like one coherent product rather than a collection of independently designed screens.

---

# 2. Design Principles

The Mezgeb design system follows several principles.

### 2.1 Calm

The interface should feel focused and comfortable for long learning sessions.

### 2.2 Clear

Information hierarchy should be immediately understandable.

### 2.3 Focused

Visual elements should support learning rather than compete for attention.

### 2.4 Consistent

The same interaction should look and behave the same throughout the application.

### 2.5 Accessible

The design should remain usable across different devices and abilities.

### 2.6 Minimal

The MVP should avoid unnecessary visual complexity.

---

# 3. Color System

The color palette should establish a calm learning environment while still providing enough contrast for important actions and states.

## 3.1 Primary Colors

| Token            | Purpose                               |
| ---------------- | ------------------------------------- |
| `primary`        | Main interactive elements             |
| `primary-hover`  | Hover state                           |
| `primary-active` | Active/pressed state                  |
| `primary-subtle` | Light background for primary elements |

The exact color values should be defined as CSS variables once the final visual direction is selected.

---

# 4. Semantic Colors

Semantic colors communicate system states.

| Semantic | Purpose                               |
| -------- | ------------------------------------- |
| Success  | Completed actions and positive states |
| Warning  | Attention required                    |
| Error    | Failed actions and destructive states |
| Info     | Informational messages                |

Semantic colors should not be used purely for decoration.

For example:

```text
✓ Completed      → Success
! Needs attention → Warning
× Failed         → Error
i Information    → Info
```

Color should never be the only way a state is communicated.

---

# 5. Neutral Colors

Neutral colors provide the foundation of the interface.

Recommended neutral categories:

```text
Background
Surface
Surface Elevated
Border
Border Strong
Text Primary
Text Secondary
Text Muted
Text Disabled
```

These should be used consistently instead of introducing one-off gray values throughout the application.

---

# 6. Status Colors

Mezgeb uses status indicators for goals and tasks.

## Goal Status

| Status    | Meaning                           |
| --------- | --------------------------------- |
| Planned   | Goal has not started              |
| Active    | Goal is currently being worked on |
| Completed | Goal has been completed           |
| Archived  | Goal is no longer active          |

## Task Status

| Status      | Meaning                   |
| ----------- | ------------------------- |
| TODO        | Not started               |
| IN_PROGRESS | Currently being worked on |
| COMPLETED   | Finished                  |

Status indicators should combine:

* Color
* Text
* Optional icon

Example:

```text
● Active
✓ Completed
○ Planned
▣ Archived
```

---

# 7. Typography

Typography should prioritize readability.

## Font Hierarchy

### Display

Used for major page titles when appropriate.

### Heading 1

Used for primary page titles.

### Heading 2

Used for major sections.

### Heading 3

Used for subsections and cards.

### Body

Used for normal content.

### Small

Used for supporting information.

### Caption

Used for metadata and secondary information.

Example hierarchy:

```text
Dashboard                 → H1

Active Goals              → H2

Learn React               → H3

Build strong React...     → Body

Last studied 2 hours ago  → Small

Updated Oct 2             → Caption
```

The final font family should prioritize:

* Readability
* Good browser support
* Clear distinction between headings and body text

---

# 8. Font Weights

Use a limited number of weights.

Recommended:

| Weight   | Use                             |
| -------- | ------------------------------- |
| Regular  | Body text                       |
| Medium   | Labels and secondary emphasis   |
| Semibold | Headings and important UI       |
| Bold     | Strong emphasis where necessary |

Avoid using many different font weights on the same page.

---

# 9. Spacing System

Spacing should use a consistent scale.

A base spacing unit can be used to create predictable distances.

Example:

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
```

Common usage:

| Size  | Typical Use               |
| ----- | ------------------------- |
| 4px   | Very small gaps           |
| 8px   | Icon/text spacing         |
| 12px  | Compact component spacing |
| 16px  | Standard element spacing  |
| 24px  | Card/content spacing      |
| 32px  | Section spacing           |
| 48px  | Major section spacing     |
| 64px+ | Page-level spacing        |

The application should avoid arbitrary spacing values when an existing spacing token can be used.

---

# 10. Layout

The application should use a consistent content width.

Example:

```text
┌──────────────────────────────────────────────┐
│                                              │
│          Main Content Container              │
│                                              │
│   ┌──────────────────────────────────────┐   │
│   │ Content                              │   │
│   └──────────────────────────────────────┘   │
│                                              │
└──────────────────────────────────────────────┘
```

Long text content should have a narrower readable width than dashboards or data-heavy pages.

---

# 11. Border Radius

Use a small set of radius tokens.

Example:

```text
Small
Medium
Large
Full
```

Suggested usage:

| Radius | Usage                  |
| ------ | ---------------------- |
| Small  | Inputs, small controls |
| Medium | Cards, buttons         |
| Large  | Larger panels          |
| Full   | Pills, avatars, badges |

The design should avoid excessive rounding that makes the interface feel overly playful.

---

# 12. Borders

Borders should provide structure without creating visual noise.

Use borders primarily for:

* Cards
* Inputs
* Separators
* Navigation boundaries
* Tables
* Dialogs

Avoid adding borders to every element.

---

# 13. Shadows

Shadows should be subtle.

Use them primarily to establish hierarchy.

Appropriate uses:

* Dialogs
* Dropdown menus
* Elevated cards
* Floating navigation elements

The default interface should rely primarily on spacing, surfaces, and borders rather than heavy shadows.

---

# 14. Buttons

Buttons should clearly communicate actions.

## Primary Button

Used for the main action.

Examples:

```text
Create Goal
Save Session
New Journal Entry
```

## Secondary Button

Used for supporting actions.

Examples:

```text
Cancel
Edit
View Details
```

## Destructive Button

Used for actions such as deletion.

Examples:

```text
Delete Goal
Delete Entry
Delete Account
```

Destructive actions should generally require confirmation when they cannot easily be undone.

---

# 15. Button States

Every interactive button should have appropriate states.

```text
Default
Hover
Focus
Active
Disabled
Loading
```

Example:

```text
[ Save Session ]

        ↓

[ Saving... ]
```

The loading state prevents users from accidentally submitting the same action multiple times.

---

# 16. Form Inputs

Form controls should use a consistent structure.

```text
Label

[ Input                         ]

Helper text
```

When invalid:

```text
Email

[ invalid@email ]

Please enter a valid email address.
```

Inputs should support:

* Default
* Hover
* Focus
* Filled
* Disabled
* Error

Focus states must remain clearly visible for keyboard users.

---

# 17. Cards

Cards group related information.

Common card types include:

* Goal card
* Session card
* Journal card
* Statistics card
* Activity card

A card should generally contain:

```text
Title
Supporting information
Primary content
Optional action
```

Cards should not be used simply because a design looks cleaner with more boxes. They should represent meaningful groups of information.

---

# 18. Progress Indicators

Progress is a central concept in Mezgeb.

Progress can be represented using:

* Progress bars
* Percentages
* Completed/total counts
* Charts
* Activity summaries

Example:

```text
React

████████░░ 80%

8 / 10 tasks completed
```

Progress indicators should always provide context.

Avoid displaying:

```text
80%
```

without explaining what the 80% represents.

---

# 19. Badges

Badges should communicate compact metadata or status.

Examples:

```text
ACTIVE
COMPLETED
PLANNED
ARCHIVED
```

Badges should remain visually secondary to the main content.

---

# 20. Icons

Icons should support understanding rather than replace labels.

Potential icon categories:

* Navigation
* Create
* Edit
* Delete
* Search
* Calendar
* Clock
* Check
* Arrow
* Settings
* User
* Menu

Icon-only buttons must provide accessible labels.

For example:

```text
[ 🗑 ]
```

should have an accessible label such as:

```text
Delete goal
```

---

# 21. Avatars

User avatars may appear in:

* Header
* Settings
* Profile areas

If a user has no uploaded image, an initial-based avatar can be used.

Example:

```text
┌─────┐
│  H  │
└─────┘
```

Avatars should remain secondary to learning content.

---

# 22. Toasts and Feedback

Temporary feedback may be used after successful actions.

Examples:

```text
✓ Goal created successfully.
```

```text
✓ Learning session recorded.
```

```text
✓ Journal entry saved.
```

Toasts should not be the only way important information is communicated.

---

# 23. Dialogs

Dialogs should be used for focused decisions.

Common examples:

* Confirm deletion
* Confirm account deletion
* Confirm archive
* Small quick actions

Dialogs should include:

```text
Title
Explanation
Cancel
Confirm
```

Destructive actions should be clearly distinguished from cancellation.

---

# 24. Loading Components

The design system should provide reusable loading patterns.

### Spinner

For short operations.

### Skeleton

For page/content loading.

### Full-page loader

For application initialization when necessary.

### Button loading state

For form submissions.

Different loading patterns should not be mixed randomly.

---

# 25. Empty State Components

A reusable empty-state pattern should contain:

```text
Optional Icon / Illustration

Title

Short explanation

Primary action
```

Example:

```text
No goals yet

Create a learning goal to begin
tracking your progress.

[ Create Goal ]
```

---

# 26. Error Components

Reusable error patterns should include:

```text
Error title

Short explanation

Recovery action
```

Example:

```text
Couldn't load your goals.

Something went wrong while retrieving
your learning goals.

[ Try Again ]
```

---

# 27. Responsive Design Tokens

The design system should support responsive layouts rather than separate desktop and mobile designs.

General behavior:

### Large screens

* Persistent sidebar
* Multi-column layouts
* More dashboard information visible simultaneously

### Medium screens

* Reduced spacing
* Collapsible navigation
* Fewer columns

### Small screens

* Single-column content
* Compact navigation
* Touch-friendly controls
* Full-width forms where appropriate

---

# 28. Accessibility Rules

The design system should follow these principles:

* Maintain sufficient text/background contrast.
* Never communicate meaning through color alone.
* Provide visible keyboard focus.
* Use semantic HTML.
* Provide accessible labels for icon-only controls.
* Maintain usable touch targets.
* Ensure forms have associated labels.
* Support zoom and text resizing.
* Respect reduced-motion preferences where animations are introduced.

Detailed accessibility requirements will be defined in `accessibility.md`.

---

# 29. Component Consistency

Reusable components should be preferred over creating visually similar one-off components.

For example, instead of creating separate button styles for:

```text
Create Goal
Save Session
Save Entry
```

they should use the same button component with different labels.

Similarly:

```text
GoalCard
SessionCard
JournalCard
```

should share common visual foundations while allowing content-specific differences.

---

# 30. Design Tokens

The frontend should eventually represent the design system through centralized tokens.

Example:

```css
:root {
  --color-primary: ...;
  --color-background: ...;
  --color-surface: ...;
  --color-border: ...;

  --color-text-primary: ...;
  --color-text-secondary: ...;

  --space-1: ...;
  --space-2: ...;
  --space-3: ...;

  --radius-sm: ...;
  --radius-md: ...;
  --radius-lg: ...;
}
```

The actual values should live in one centralized location rather than being repeatedly hardcoded throughout components.

---

# 31. Design System Principle

The Mezgeb design system should make the interface feel:

**Calm → Clear → Focused → Consistent → Learn-centered**

The design should support the user's learning journey without turning the application into a visually overwhelming productivity dashboard.
