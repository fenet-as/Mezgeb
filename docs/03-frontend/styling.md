# Styling

## 1. Purpose

This document defines how styling is organized and implemented in the Mezgeb frontend.

The goals are to make the UI:

* consistent
* responsive
* accessible
* maintainable
* easy to modify
* visually cohesive
* simple enough to support learning React and CSS properly

Mezgeb will use **CSS Modules and standard CSS** rather than making a utility-first CSS framework the foundation of the project.

---

# 2. Styling Stack

The initial styling approach is:

| Concern           | Approach                       |
| ----------------- | ------------------------------ |
| Component styling | CSS Modules                    |
| Global styles     | `globals.css`                  |
| Design tokens     | CSS variables                  |
| Responsive design | CSS media queries              |
| Layout            | CSS Flexbox + Grid             |
| Typography        | CSS                            |
| Theme             | CSS variables                  |
| Animations        | CSS transitions/keyframes      |
| Icons             | Dedicated icon library or SVGs |
| Utility classes   | Minimal, only when useful      |

The goal is to understand and use CSS directly rather than hiding the entire styling system behind abstractions.

---

# 3. Styling Structure

The frontend will initially contain:

```text id="f2x8k1"
src/
├── styles/
│   ├── globals.css
│   └── variables.css
│
├── components/
│   └── ui/
│       ├── Button/
│       │   ├── Button.tsx
│       │   └── Button.module.css
│       └── Card/
│           ├── Card.tsx
│           └── Card.module.css
│
└── features/
    └── goals/
        └── components/
            ├── GoalCard.tsx
            └── GoalCard.module.css
```

A component's styling should generally live close to the component.

---

# 4. CSS Modules

CSS Modules will be the default approach for component-specific styling.

Example:

```text id="n7c5v3"
GoalCard.tsx
GoalCard.module.css
```

The component imports its stylesheet:

```text id="w8m4q2"
import styles from "./GoalCard.module.css";
```

Then:

```text id="q6d1s9"
<div className={styles.card}>
```

CSS Modules provide locally scoped class names.

This reduces accidental style conflicts between unrelated components.

---

# 5. Why CSS Modules

CSS Modules provide a useful balance for Mezgeb.

They allow:

* normal CSS syntax
* local class scoping
* readable stylesheets
* component-level ownership
* easy browser debugging
* reusable CSS patterns
* straightforward responsive styles

They also allow the project to practice actual CSS rather than relying entirely on a framework's class system.

---

# 6. Global CSS

Global CSS should be kept small.

`globals.css` should contain things that genuinely apply across the application, such as:

* CSS reset/base styles
* body styles
* global typography defaults
* link defaults
* box-sizing
* focus defaults
* root-level layout behavior

It should **not** become a giant collection of feature-specific classes.

---

# 7. Design Tokens

Shared visual values should be defined using CSS variables.

Example:

```text id="8f4p2m"
:root {
  --color-primary: ...;
  --color-background: ...;
  --color-surface: ...;
  --color-text: ...;
  --color-text-muted: ...;

  --spacing-xs: ...;
  --spacing-sm: ...;
  --spacing-md: ...;

  --radius-sm: ...;
  --radius-md: ...;

  --shadow-sm: ...;
}
```

The actual values are defined by:

```text id="v5z8q3"
02-design/design-system.md
```

Components should consume these tokens instead of repeatedly hardcoding the same values.

---

# 8. Why Design Tokens Matter

Without tokens, components can gradually become inconsistent:

```text id="3x1k8v"
Card A → 12px radius
Card B → 10px radius
Card C → 14px radius
```

With tokens:

```text id="6m2q7d"
Card A → var(--radius-md)
Card B → var(--radius-md)
Card C → var(--radius-md)
```

Changing the design system becomes much easier.

Tokens also make future theme support easier.

---

# 9. Color Usage

Colors should have semantic meaning.

For example:

```text id="2y8v5k"
Primary
Success
Warning
Error
Info
Background
Surface
Text
Muted text
Border
```

Components should avoid inventing random colors.

For example, instead of:

```text id="0m6p4x"
color: #3a8...
```

repeated throughout the codebase, use semantic variables.

```text id="9r2w7c"
color: var(--color-success);
```

This keeps the interface consistent.

---

# 10. Status Colors

Mezgeb uses status colors for concepts such as:

### Goal

```text id="3n8q1f"
PLANNED
ACTIVE
COMPLETED
ARCHIVED
```

### Task

```text id="h5w2z7"
TODO
IN_PROGRESS
COMPLETED
```

Color should reinforce the status but should **not be the only way the status is communicated**.

For example:

```text id="p3k8s4"
✓ Completed
```

is better than showing only a green dot.

This follows the accessibility requirements.

---

# 11. Typography

Typography should follow the hierarchy defined in the design system.

Typical hierarchy:

```text id="r2f6m8"
Page title
Section heading
Card heading
Body text
Secondary text
Caption
```

Typography should remain consistent across the application.

Avoid creating a new font size every time a component needs slightly different text.

Use the established type scale whenever possible.

---

# 12. Layout

Mezgeb will primarily use:

* CSS Grid
* CSS Flexbox
* normal document flow

### Flexbox

Use for one-dimensional layouts.

Examples:

```text id="6q1p9d"
Navigation
Button groups
Header
Card actions
Form rows
```

### Grid

Use for two-dimensional layouts.

Examples:

```text id="8c3m7y"
Dashboard cards
Goal card collections
Responsive content layouts
```

The layout method should be chosen based on the actual relationship between elements rather than personal preference.

---

# 13. Container Width

Main content should have a consistent maximum width where appropriate.

Conceptually:

```text id="m7x4q2"
Viewport
┌───────────────────────────────┐
│                               │
│     Main content container    │
│                               │
└───────────────────────────────┘
```

This prevents very wide screens from producing uncomfortable reading widths.

The exact values come from the design system.

---

# 14. Spacing

Spacing should follow the project's spacing scale.

For example:

```text id="x5k2r8"
4
8
12
16
20
24
32
40
48
64
80
```

The exact scale is already defined in:

```text id="j4p7v3"
02-design/design-system.md
```

The goal is to create rhythm and consistency rather than choosing arbitrary values.

---

# 15. Responsive Design

Mezgeb should be responsive from the beginning.

The primary layouts are:

```text id="4f8q2n"
Desktop
Tablet
Mobile
```

The UI should adapt based on available space rather than targeting a huge list of individual devices.

---

# 16. Desktop Layout

The desktop application uses:

```text id="n3m7x1"
┌──────────┬──────────────────────────┐
│ Sidebar  │ Main Content             │
│          │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

The sidebar provides primary navigation.

The main content area contains the current page.

---

# 17. Mobile Layout

On smaller screens, the sidebar should transform into a mobile-friendly navigation pattern.

Conceptually:

```text id="k8q2v5"
┌──────────────────────┐
│ Header               │
├──────────────────────┤
│                      │
│ Main Content         │
│                      │
├──────────────────────┤
│ Mobile Navigation    │
└──────────────────────┘
```

The exact implementation will be determined during UI implementation.

---

# 18. Responsive Components

Components should respond to available space.

For example, a dashboard grid might change from:

```text id="1v6p3m"
Desktop:
[ Card ][ Card ][ Card ][ Card ]
```

to:

```text id="2x8k4q"
Tablet:
[ Card ][ Card ]
[ Card ][ Card ]
```

to:

```text id="7m3r9d"
Mobile:
[ Card ]
[ Card ]
[ Card ]
[ Card ]
```

CSS Grid is useful for this type of layout.

---

# 19. Mobile-First Consideration

The project should generally avoid designing desktop-only components and attempting to shrink them later.

Styles should work at smaller widths and progressively enhance for larger screens where practical.

For example:

```text id="q5z1m8"
Base styles
    ↓
Tablet adjustments
    ↓
Desktop adjustments
```

This also encourages simpler layouts.

---

# 20. Component Styling Ownership

A component should generally own its visual styles.

For example:

```text id="d8k4p2"
Button
 ├── Button.tsx
 └── Button.module.css
```

A feature component:

```text id="r5m9x1"
GoalCard
 ├── GoalCard.tsx
 └── GoalCard.module.css
```

This makes it easier to understand where a style comes from.

---

# 21. Shared UI Components

Shared components should expose meaningful visual variants.

For example:

```text id="w3q7n5"
Button
├── primary
├── secondary
└── destructive
```

The variants should represent genuinely different states or semantic purposes.

Avoid creating variants for every small visual difference.

Bad direction:

```text id="0f5k8x"
Button
├── blue
├── blueSmall
├── blueLarge
├── slightlyBlue
├── blueRounded
└── blueRoundedSmall
```

Better:

```text id="2r8m4q"
Button
├── primary
├── secondary
└── destructive
```

with size or other differences represented only when they are meaningful and reusable.

---

# 22. Conditional Classes

Components may need to change styles based on state.

Examples:

```text id="9k3v6p"
isActive
isDisabled
hasError
isCompleted
isLoading
```

The implementation should keep conditional styling readable.

A class-name utility may be introduced if conditional class combinations become sufficiently complex.

A utility should not be added prematurely for simple cases.

---

# 23. State Styling

Interactive components should define relevant states.

For example:

```text id="x2q8m4"
Default
Hover
Focus
Active
Disabled
Loading
Error
```

Not every component needs every state.

States should reflect actual interaction behavior.

---

# 24. Focus Styles

Focus indicators must remain visible.

Avoid CSS such as:

```text id="6n4p2y"
outline: none;
```

unless an equivalent accessible focus treatment is provided.

Keyboard users must be able to identify the currently focused element.

Focus styling should follow the accessibility requirements.

---

# 25. Forms and Input Styling

Inputs should have consistent visual states:

```text id="c5r8w1"
Default
Focus
Filled
Disabled
Error
Read-only
```

Error styling should include more than color.

For example:

```text id="8q2m5v"
[ Invalid input ]
Goal title is required.
```

rather than relying only on a red border.

---

# 26. Buttons

Buttons should have consistent:

* height
* padding
* typography
* border radius
* focus behavior
* disabled behavior
* loading behavior

Example semantic variants:

```text id="h4x7p2"
Primary
Secondary
Destructive
Ghost
```

Only variants actually needed by the application should be implemented.

---

# 27. Cards

Cards are common in Mezgeb.

Examples:

* Goal Card
* Session Card
* Journal Entry Card
* Progress Summary Card

Cards should share consistent:

* padding
* border
* radius
* background
* spacing
* hover behavior where appropriate

Not every card needs a hover animation.

---

# 28. Progress Indicators

Progress bars and indicators should use the design system.

For example:

```text id="3f7k2m"
React
████████████░░░░ 75%
```

The progress value should also be communicated textually where appropriate.

Do not make color or visual width the only source of information.

---

# 29. Icons

Icons should support the meaning of the interface rather than decorate every element unnecessarily.

Examples:

* edit
* delete
* add
* search
* settings
* navigation

Icon-only buttons must have accessible names.

For example:

```text id="5m9q3r"
[ ✎ ]
```

must have an accessible label such as:

```text id="8x1k6p"
"Edit goal"
```

---

# 30. Images and Assets

Static assets belong in the appropriate location:

```text id="j8v4q2"
src/assets/
```

when they are imported through the application.

Public assets that must be served directly can use:

```text id="z3m7w5"
public/
```

The distinction follows:

```text id="q1f8k4"
03-frontend/project-structure.md
```

Images should have appropriate alternative text when they convey information.

Decorative images should not create unnecessary screen-reader noise.

---

# 31. Animation

Animation should be subtle and purposeful.

Good uses include:

* opening/closing dialogs
* expanding sections
* loading transitions
* small interaction feedback
* navigation transitions where useful

Avoid animation that:

* delays basic interactions
* distracts from learning content
* creates excessive movement
* exists only for decoration

---

# 32. Reduced Motion

Users who prefer reduced motion should not be forced to experience unnecessary animation.

Use the appropriate media query:

```text id="m5r2x8"
@media (prefers-reduced-motion: reduce) {
  ...
}
```

Animations and transitions should be reduced or disabled where appropriate.

---

# 33. Dark Mode / Theme

Theme support should use CSS variables rather than duplicating entire stylesheets.

Conceptually:

```text id="v7q3m1"
:root {
  --color-background: ...;
  --color-surface: ...;
}

[data-theme="dark"] {
  --color-background: ...;
  --color-surface: ...;
}
```

Components continue using:

```text id="k2f8p4"
var(--color-background)
var(--color-surface)
```

rather than hardcoding theme-specific colors.

The initial MVP may support a single theme if that keeps implementation focused. Theme switching can be added when the product requires it.

---

# 34. Avoiding CSS Duplication

Before writing a new style, consider:

1. Is this a shared design token?
2. Is this a reusable UI pattern?
3. Does an existing component already solve this?
4. Is this truly feature-specific?

For example, if several components need the same button appearance, use the shared `Button` component instead of recreating it.

However, do not create a global abstraction just because two components happen to look similar once.

---

# 35. Avoiding Global CSS Pollution

Avoid turning `globals.css` into:

```text id="4k8n2p"
.goal-card {}
.journal-card {}
.dashboard-title {}
.task-button {}
...
```

Feature-specific styles should remain local.

Global CSS should contain only genuinely global behavior.

This prevents unrelated features from becoming coupled through CSS.

---

# 36. CSS Naming

CSS Module class names can describe the component structure clearly.

Example:

```text id="9x5m2q"
.card
.header
.title
.description
.actions
.progress
```

Avoid unnecessarily verbose class names when the CSS Module already provides local scoping.

---

# 37. Responsive Tables and Dense Data

If Mezgeb eventually displays tables or dense progress information, they should remain usable on smaller screens.

Possible strategies:

* horizontal scrolling
* responsive column reduction
* card transformation
* prioritizing important fields

The solution should preserve the information rather than simply shrinking text until it becomes unreadable.

---

# 38. Styling and Accessibility

Styling decisions must respect:

* color contrast
* visible focus
* readable text
* sufficient touch targets
* reduced motion
* responsive layouts
* non-color indicators
* accessible states

The styling system should support the accessibility requirements rather than treating accessibility as a later patch.

---

# 39. Performance Considerations

Styling should remain simple.

Avoid:

* excessive runtime style generation
* unnecessarily large global stylesheets
* duplicated CSS
* huge animation systems
* unnecessary visual effects

CSS Modules and normal CSS are sufficient for the initial application.

Performance optimization should be driven by actual problems rather than assumptions.

---

# 40. Styling Rules

Mezgeb follows these rules:

1. Use CSS Modules for component-specific styling.
2. Keep global CSS minimal.
3. Use CSS variables for shared design tokens.
4. Follow the established design system.
5. Prefer semantic colors over arbitrary color values.
6. Use Flexbox and Grid according to layout needs.
7. Design responsively.
8. Keep component styles close to their components.
9. Avoid unnecessary global classes.
10. Avoid creating abstractions for one-off styles.
11. Reuse shared UI components when the underlying concept is genuinely shared.
12. Provide visible focus states.
13. Do not rely on color alone to communicate meaning.
14. Support reduced motion.
15. Keep animations purposeful.
16. Keep styling readable and easy to debug.
17. Prefer simple CSS over unnecessary styling libraries.
18. Optimize styling when there is evidence of a performance problem.
19. Keep accessibility requirements part of the styling process.
20. Let the design system guide visual consistency.

---

# 41. Mezgeb Styling Mental Model

```text id="6p3x9m"
Design System
      │
      ▼
CSS Variables / Tokens
      │
      ▼
Shared UI Components
      │
      ▼
Feature Components
      │
      ▼
Pages
```

For example:

```text id="q8m2v5"
Design token
   ↓
Button component
   ↓
Goal form
   ↓
Goal page
```

The central principle is:

> **Use simple, local CSS for components, shared design tokens for consistency, and responsive/accessibility rules as part of the styling system—not as afterthoughts.**
