# Accessibility

## 1. Purpose

This document defines accessibility requirements for Mezgeb.

Accessibility should be considered throughout development rather than added after the interface is complete.

The goal is to make Mezgeb usable by people with different abilities, devices, input methods, and browsing preferences.

---

# 2. Accessibility Goals

Mezgeb should aim to provide:

* Keyboard-accessible navigation
* Screen-reader-friendly content
* Clear visual hierarchy
* Sufficient color contrast
* Accessible forms
* Accessible interactive components
* Clear error and success feedback
* Responsive layouts
* Support for zoom and text resizing
* Reduced reliance on color or visual cues alone

The implementation should generally follow **WCAG 2.2 Level AA** as a practical accessibility target.

---

# 3. Semantic HTML

Use semantic HTML elements whenever appropriate.

Examples:

```html
<header>
<nav>
<main>
<section>
<article>
<footer>
<button>
<form>
<label>
```

Avoid using generic elements such as `<div>` or `<span>` when a semantic element provides the appropriate meaning.

For example:

```html
<button>Save Session</button>
```

should be preferred over:

```html
<div onClick={saveSession}>Save Session</div>
```

---

# 4. Keyboard Navigation

All interactive functionality must be accessible using a keyboard.

Users should be able to navigate through:

* Navigation links
* Buttons
* Forms
* Dropdowns
* Dialogs
* Tabs
* Checkboxes
* Menus
* Search fields

Expected interaction:

```text
Tab
 ↓
Next interactive element

Shift + Tab
 ↓
Previous interactive element

Enter / Space
 ↓
Activate control
```

Keyboard focus should always remain visible.

---

# 5. Focus Management

Interactive elements must have a clearly visible focus state.

Example:

```text
Normal

[ Save Session ]


Focused

[ ▣ Save Session ]
```

The actual focus indicator should provide sufficient visual distinction from the surrounding interface.

Focus should never be removed simply for aesthetic reasons.

---

# 6. Navigation Accessibility

The primary navigation should:

* Use semantic navigation elements.
* Provide descriptive link names.
* Clearly indicate the current page.
* Support keyboard navigation.
* Work correctly with screen readers.

The current route should be programmatically identifiable where appropriate.

For example:

```html
<a aria-current="page">
  Dashboard
</a>
```

---

# 7. Headings

Pages should use a logical heading hierarchy.

Example:

```text
H1 — Dashboard

H2 — Active Goals
H2 — Recent Activity

H3 — Learn React
H3 — System Design
```

Heading levels should not be chosen solely because of their visual size.

CSS should control visual appearance while HTML heading levels communicate structure.

---

# 8. Forms

Forms are a major part of Mezgeb and must be accessible.

## Labels

Every input should have a programmatically associated label.

Correct:

```html
<label htmlFor="title">Goal title</label>
<input id="title" />
```

Avoid relying only on placeholders.

---

# 9. Required Fields

Required fields should be clearly communicated.

For example:

```text
Goal title *
```

The required state should also be available programmatically when appropriate.

---

# 10. Form Errors

Errors should:

* Clearly identify the problem.
* Appear near the relevant field.
* Use understandable language.
* Be accessible to assistive technologies.
* Explain how to fix the problem when possible.

Example:

```text
Email

[ fenet@ ]

Please enter a valid email address.
```

Avoid vague messages such as:

```text
Invalid input.
```

when more useful information can be provided.

---

# 11. Error Summary

For forms with multiple validation errors, an error summary may be displayed near the top of the form.

Example:

```text
Please correct the following:

• Email address is invalid
• Password must contain at least 8 characters
• Goal title is required
```

The summary should allow users to quickly identify and navigate to problematic fields.

---

# 12. Color

Color must not be the only method of communicating information.

For example, this is insufficient:

```text
🟢 Active
🔴 Completed
```

if the meaning depends entirely on the colors.

Instead, combine:

* Color
* Text
* Icons or other visual indicators when useful

Example:

```text
● Active
✓ Completed
```

---

# 13. Color Contrast

Text and important interface elements should have sufficient contrast against their backgrounds.

Contrast should be checked during implementation rather than estimated visually.

Special attention should be given to:

* Body text
* Muted text
* Placeholder text
* Buttons
* Form controls
* Status indicators
* Focus indicators
* Links

Muted text should still remain readable.

---

# 14. Links

Links should have descriptive text.

Prefer:

```text
View React goal
```

over:

```text
Click here
```

Links should be visually distinguishable from surrounding text where appropriate.

---

# 15. Buttons

Buttons should describe the action they perform.

Good:

```text
Create Goal
Save Session
Delete Entry
```

Avoid vague labels:

```text
Submit
Click
Go
```

when a more descriptive label is possible.

Icon-only buttons must have accessible names.

Example:

```text
[ 🗑 ]
```

should expose an accessible name such as:

```text
Delete journal entry
```

---

# 16. Images and Icons

Informative images should have appropriate alternative text.

Example:

```html
<img
  src="..."
  alt="Learning progress chart"
/>
```

Decorative images should not unnecessarily add information to the accessibility tree.

Decorative icons can generally be hidden from assistive technology when the accompanying text already communicates their meaning.

---

# 17. Charts and Data Visualization

Progress charts should provide accessible alternatives.

A visual chart such as:

```text
Mon ███
Tue █████
Wed ██
Thu ████
```

should not be the only way the information can be understood.

Important information should also be available through:

* Text summaries
* Accessible labels
* Data tables when appropriate

For example:

```text
This week:
12 sessions
8 hours 30 minutes
6 active days
```

---

# 18. Dialogs

Dialogs must be accessible to keyboard and screen-reader users.

When a dialog opens:

1. Focus should move into the dialog.
2. The dialog should have a meaningful title.
3. The user should be able to interact with its controls.
4. Escape should close it when appropriate.
5. Focus should return to the triggering element after closing.

Example:

```text
Delete Goal?

Are you sure you want to delete
"Learn React"?

Cancel     Delete
```

---

# 19. Dropdowns and Menus

Dropdown menus should:

* Be keyboard accessible.
* Have clear focus behavior.
* Provide appropriate labels.
* Close when appropriate.
* Maintain logical focus order.

Native HTML controls should be preferred when they provide the required behavior.

Custom controls should only be created when necessary.

---

# 20. Modals and Destructive Actions

Destructive actions such as deleting a goal or journal entry should be clearly identified.

Example:

```text
Delete Goal?

This action cannot be undone.

Cancel      Delete
```

The destructive action should not be visually or interactively confused with the safe action.

---

# 21. Loading States

Loading states should communicate that the application is working.

For longer operations, assistive technologies should receive appropriate status information where necessary.

Example:

```text
Saving session...
```

After completion:

```text
Session saved successfully.
```

Users should not be left wondering whether their action succeeded.

---

# 22. Dynamic Content

Mezgeb frequently updates information without navigating to a new page.

Examples:

* Completing a task
* Updating progress
* Saving a session
* Creating a journal entry
* Displaying a toast

Important updates should be communicated appropriately to assistive technologies when necessary.

For example:

```text
Task completed successfully.
```

can be exposed as a status message.

---

# 23. Motion and Animation

Animations should remain subtle and functional.

Avoid unnecessary motion that could distract users.

Where animations are introduced, respect the user's reduced-motion preference.

For example:

```css
@media (prefers-reduced-motion: reduce) {
  /* Reduce or disable non-essential animation */
}
```

Animations should never be required to understand or operate the application.

---

# 24. Touch Targets

Interactive elements should be large enough to use comfortably on touch devices.

This applies especially to:

* Buttons
* Checkboxes
* Navigation controls
* Icon buttons
* Menu controls
* Close buttons

Small icons should not require extremely precise tapping.

---

# 25. Responsive Accessibility

Accessibility must remain intact across screen sizes.

Mobile layouts should preserve:

* Keyboard accessibility
* Readable text
* Logical navigation
* Visible focus
* Accessible forms
* Usable touch targets

Responsive design should not remove important functionality from smaller screens.

---

# 26. Text and Readability

Users should be able to enlarge text without losing important functionality.

Avoid:

* Text embedded inside images
* Extremely small text
* Long lines of difficult-to-read content
* Excessive uppercase text
* Low-contrast metadata

Journal content should receive particular attention because users may read longer reflections.

---

# 27. Authentication Accessibility

Login and registration should support:

* Keyboard navigation
* Proper labels
* Password visibility controls with accessible names
* Clear validation errors
* Accessible error feedback
* Clear success/failure states

Authentication errors should not expose unnecessary technical information.

---

# 28. Screen Reader Considerations

The application should provide meaningful information when read without visual styling.

For example, a goal should communicate something similar to:

```text
Learn React.
Active.
80 percent complete.
8 of 10 tasks completed.
```

rather than exposing only disconnected visual elements.

---

# 29. Testing

Accessibility should be tested throughout development.

## Automated Testing

Potential tools include:

* ESLint accessibility rules
* `eslint-plugin-jsx-a11y`
* `axe-core`
* `vitest-axe` or equivalent testing utilities

Automated testing can detect many common issues but cannot verify everything.

## Manual Testing

The application should also be tested using:

* Keyboard-only navigation
* Browser zoom
* Screen readers
* Different viewport sizes
* Reduced-motion settings

---

# 30. Accessibility Checklist

Before considering a major feature complete:

* [ ] All interactive elements are keyboard accessible
* [ ] Focus states are visible
* [ ] Forms have proper labels
* [ ] Validation errors are clear
* [ ] Buttons have descriptive names
* [ ] Icon-only buttons have accessible labels
* [ ] Images have appropriate alternatives
* [ ] Color is not the only source of meaning
* [ ] Text has sufficient contrast
* [ ] Headings follow a logical hierarchy
* [ ] Dialogs manage focus correctly
* [ ] Dynamic updates are communicated appropriately
* [ ] Charts have accessible alternatives
* [ ] Reduced motion is respected
* [ ] Mobile interactions remain usable
* [ ] Text remains readable when enlarged
* [ ] Keyboard-only navigation has been tested

---

# 31. Accessibility Principle

Accessibility is part of Mezgeb's product quality, not a separate feature.

The goal is:

> **Anyone who can use the web should be able to use Mezgeb to organize, record, and understand their learning journey.**
