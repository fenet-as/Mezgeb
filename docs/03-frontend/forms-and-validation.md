# Forms and Validation

## 1. Purpose

This document defines how forms are built, validated, submitted, and handled across the Mezgeb frontend.

The goal is to make forms:

* predictable
* accessible
* type-safe
* easy to maintain
* consistent across features
* resistant to invalid input
* clear when something goes wrong

Forms are a major part of Mezgeb because users will frequently create and modify:

* goals
* milestones
* tasks
* learning sessions
* journal entries
* profile information
* account information

---

# 2. Form Stack

Mezgeb will use:

| Concern           | Tool                     |
| ----------------- | ------------------------ |
| Form state        | React Hook Form          |
| Schema validation | Zod                      |
| TypeScript types  | TypeScript               |
| UI inputs         | Shared form components   |
| Server submission | TanStack Query mutations |
| Server validation | Spring Boot backend      |

The frontend and backend both validate data.

The frontend provides fast user feedback.

The backend remains the final authority for data accepted by the system.

---

# 3. Core Form Flow

A typical form follows:

```text id="2sp4hv"
User enters data
       ↓
React Hook Form
       ↓
Client-side validation
       ↓
Display field errors
       ↓
Submit
       ↓
API mutation
       ↓
Backend validation
       ↓
Success / server error
       ↓
Update UI
```

Example:

```text id="3m8z5h"
Create Goal
    ↓
Validate title
    ↓
Validate description
    ↓
Submit
    ↓
POST /goals
    ↓
Goal created
```

---

# 4. Why React Hook Form

React Hook Form will manage form state and form behavior.

It provides:

* field registration
* submission handling
* validation integration
* error tracking
* touched/dirty state
* submission state
* reduced unnecessary rerenders

Instead of manually maintaining:

```text id="xk6rpo"
title
description
titleError
descriptionError
isSubmitting
...
```

we can let the form library manage these concerns.

---

# 5. Why Zod

Zod will define the validation rules.

For example, a goal might require:

```text id="g8j5bw"
title:
  required
  minimum length

description:
  optional
  maximum length

status:
  one of allowed values
```

A schema provides a single place to describe these rules.

Conceptually:

```text id="0vuwg5"
Form Input
     ↓
Zod Schema
     ↓
Valid / Invalid
```

---

# 6. Client vs Server Validation

Validation exists at two levels.

### Client-side validation

Purpose:

* immediate feedback
* better UX
* prevent obviously invalid submissions
* reduce unnecessary requests

### Server-side validation

Purpose:

* security
* data integrity
* enforcing business rules
* protecting the database
* handling clients other than Mezgeb's frontend

The frontend must never assume that client-side validation is sufficient.

```text id="k5ceqk"
Frontend validation
        ↓
UX protection

Backend validation
        ↓
System protection
```

---

# 7. Validation Rules

Validation rules should reflect actual product requirements.

Examples:

### Goal

```text id="1x8h75"
title
→ required

description
→ optional

startDate
→ valid date when provided

endDate
→ valid date when provided
→ should not violate product rules
```

### Task

```text id="e2y7s1"
title
→ required

description
→ optional
```

### Journal Entry

```text id="2j1j9q"
title
→ required

content
→ required

tags
→ optional
```

The exact rules should be defined according to the backend API contract and product requirements.

---

# 8. Form Types

Form values should have explicit TypeScript types.

For example:

```text id="x1c0fb"
CreateGoalFormValues
CreateTaskFormValues
CreateSessionFormValues
CreateJournalEntryFormValues
```

These types describe what the form collects.

They should not automatically be treated as identical to backend response types.

For example:

```text id="3t3m4v"
GoalFormValues
        ≠
GoalResponse
```

A form may contain values that are transformed before being sent to the API.

---

# 9. Form Data vs API Data

The form should collect data in a user-friendly format.

The API layer should send data in the format expected by the backend.

Example:

```text id="v8tq4n"
Form:
"2026-10-05"

      ↓ transformation

API:
startDate: "2026-10-05"
```

For more complex cases:

```text id="qv8hsy"
Form values
    ↓
validation
    ↓
transform
    ↓
API request DTO
```

Transformations should be explicit rather than hidden inside generic utilities.

---

# 10. Field-Level Errors

When a field is invalid, the error should appear close to that field.

Example:

```text id="u1y0tu"
Goal title
[________________]

Title is required.
```

The error should:

* clearly identify the problem
* be associated with the input
* not rely only on color
* remain understandable to screen readers

A shared form field component can standardize this behavior.

---

# 11. Form-Level Errors

Some errors do not belong to a specific field.

Examples:

* server unavailable
* request failed
* permission denied
* unexpected backend error
* business rule violation involving multiple fields

These should be displayed as a form-level error.

Example:

```text id="1gqj47"
Unable to create your goal.
Please try again.
```

For important forms, the error should be visible near the form's beginning so users can understand that submission failed.

---

# 12. Server Validation Errors

The backend may reject data even when the frontend considers the form valid.

For example:

```text id="4d3p8u"
Frontend validation
      ↓
Valid
      ↓
POST /goals
      ↓
Backend
      ↓
Rejected
```

The frontend should interpret structured backend validation errors when available.

Example:

```text id="5wq7z4"
{
  "errors": {
    "title": "A goal with this title already exists."
  }
}
```

The frontend can then associate the error with the relevant field.

If the error cannot be mapped to a field, it should become a form-level error.

---

# 13. Submission State

Forms should clearly represent submission state.

Typical states:

```text id="6o0x2s"
Idle
 ↓
Submitting
 ↓
Success
```

or:

```text id="r1j5q8"
Idle
 ↓
Submitting
 ↓
Error
 ↓
Editable again
```

While submitting:

* prevent accidental duplicate submissions
* disable the relevant submit action
* show appropriate loading feedback
* preserve the user's entered values

Example:

```text id="8y7q4m"
[ Creating goal... ]
```

instead of allowing repeated clicks.

---

# 14. Successful Submission

After a successful mutation, the application should perform the appropriate next action.

Possible behaviors:

### Create Goal

```text id="2e5k0w"
Create
 ↓
Success
 ↓
Invalidate goals query
 ↓
Navigate to Goal Details
```

### Edit Goal

```text id="1m7w2x"
Save
 ↓
Success
 ↓
Update/invalidate goal data
 ↓
Return to Goal Details
```

### Journal Entry

```text id="4g8n2p"
Save
 ↓
Success
 ↓
Update journal data
 ↓
Navigate to entry
```

The correct behavior depends on the user's flow and context.

---

# 15. Resetting Forms

After successful creation, the form may be reset when appropriate.

For example:

```text id="6n0j5b"
Create Task
    ↓
Success
    ↓
Close dialog
    ↓
Reset form
```

However, a form should not automatically reset when submission fails.

Users should not lose the data they already entered.

---

# 16. Dirty State

A form can track whether the user has changed any values.

Example:

```text id="9g7c2k"
Edit Goal
    ↓
User changes description
    ↓
Form becomes dirty
```

Dirty state can be used to prevent accidental data loss.

For example, if the user tries to leave an edit form with unsaved changes, the application may warn them.

This should only be introduced where it meaningfully improves the experience.

---

# 17. Controlled vs Uncontrolled Inputs

React Hook Form should generally use its efficient uncontrolled approach for ordinary HTML inputs.

Use controlled components when necessary, particularly for complex custom inputs.

Examples of potentially controlled components:

* rich text editor
* custom date picker
* complex select
* specialized editor

The project should not force every input into a controlled pattern unnecessarily.

---

# 18. Shared Form Components

Reusable form components should provide consistent behavior.

Potential shared components:

```text id="8wq4f1"
FormField
FormLabel
FormDescription
FormMessage
Input
Textarea
Select
Checkbox
DateInput
SubmitButton
FormRootError
```

These should primarily provide reusable UI and accessibility behavior.

Feature-specific validation and business rules should remain in the feature.

---

# 19. Accessibility

Forms must follow the accessibility requirements defined in:

```text id="t3y7mx"
02-design/accessibility.md
```

Important rules include:

* every input has an accessible label
* required fields are clearly identified
* errors are associated with their fields
* keyboard navigation works
* focus is visible
* error messages are understandable
* submission errors are announced appropriately
* buttons have meaningful accessible names
* form controls do not rely only on color

Example structure:

```text id="g1z2pk"
<label>
  Goal title
</label>

<input />

<p>
  Choose a short name for your learning goal.
</p>

<p>
  Goal title is required.
</p>
```

---

# 20. Focus Management

When validation fails, the form should help the user find the problem.

For example:

```text id="5e9r2w"
Submit
  ↓
Validation fails
  ↓
Focus first invalid field
```

For server-level errors, focus may move to an appropriate error summary when necessary.

The behavior should remain predictable and accessible.

---

# 21. Forms in Dialogs

Some small forms may appear in dialogs.

Examples:

* create milestone
* create task
* quick record session
* confirm/edit small pieces of data

Dialog forms should:

* trap focus appropriately
* have an accessible name
* support keyboard interaction
* preserve validation behavior
* prevent accidental duplicate submission
* clearly communicate success/failure

Large or complex forms should generally use a dedicated page rather than forcing everything into a modal.

---

# 22. Validation Timing

Validation should provide useful feedback without becoming annoying.

Possible strategies:

### On submit

Useful for:

* simple forms
* forms where premature errors are distracting

### On blur

Useful for:

* fields where users benefit from immediate feedback

### On change

Useful for:

* specific fields where live validation is meaningful

Mezgeb should not blindly validate every field on every keystroke.

Validation timing should be chosen based on the form and the user experience.

---

# 23. Cross-Field Validation

Some rules involve multiple fields.

Example:

```text id="q5c3w2"
Start Date
End Date
```

A valid start date alone does not guarantee a valid date range.

The schema can validate the relationship:

```text id="m6p4v9"
startDate <= endDate
```

Other examples could include:

* password confirmation
* mutually dependent fields
* conditional fields

Cross-field validation belongs in the validation schema or appropriate business logic rather than scattered throughout components.

---

# 24. Conditional Fields

Some fields may only apply under certain conditions.

Example:

```text id="6w1x7q"
Goal status = ACTIVE
       ↓
Additional active-goal settings appear
```

When using conditional fields:

* make the relationship obvious
* validate only relevant values
* avoid submitting stale hidden values when inappropriate
* keep the form understandable

---

# 25. Date and Time Inputs

Mezgeb contains several date/time concepts:

* goal start/end dates
* learning session date
* learning session duration
* journal entry date

The frontend should use consistent representations.

Important considerations:

* date-only values should not accidentally become timezone-shifted timestamps
* timestamps should be handled consistently
* user-visible dates should be formatted for humans
* API formats should follow the backend contract

Date/time transformation should be explicit.

---

# 26. Textareas and Journal Content

Journal entries may contain significantly more content than ordinary forms.

The journal editor should therefore be treated differently from simple inputs.

Potential future capabilities include:

* Markdown
* rich text
* previews
* formatting tools

For the MVP, the simplest reliable editor should be preferred.

The form architecture should allow a richer editor to be introduced later without redesigning the entire form system.

---

# 27. Drafts and Unsaved Data

Automatic drafts are not required for the initial MVP.

However, long journal entries may eventually benefit from draft persistence.

Possible future behavior:

```text id="8q1f3k"
User writes
   ↓
Local draft
   ↓
User returns later
   ↓
Restore draft
```

This should be introduced only when there is a clear product need.

---

# 28. Security Considerations

Frontend validation is not a security boundary.

The backend must independently validate:

* authentication
* authorization
* data ownership
* allowed values
* business rules
* data constraints

The frontend should never assume:

> "The user cannot do this because the button is hidden."

The backend must enforce permissions.

---

# 29. Testing Forms

Forms should be tested through observable user behavior.

Examples:

### Create Goal

```text id="p5c8s0"
Render form
 ↓
Enter title
 ↓
Submit
 ↓
Verify API mutation
```

### Validation

```text id="7y4w2n"
Submit empty form
 ↓
Verify validation message
 ↓
Verify request was not sent
```

### Server error

```text id="1s5d7k"
Submit valid form
 ↓
Backend returns error
 ↓
Verify error appears
```

### Successful submission

```text id="3z8k4q"
Submit
 ↓
Mutation succeeds
 ↓
Verify expected navigation/update
```

Tests should focus on what the user experiences rather than React Hook Form or Zod's internal implementation.

---

# 30. Form Organization

A feature can organize its forms like:

```text id="9k5v2d"
features/
└── goals/
    ├── components/
    │   ├── GoalForm.tsx
    │   └── GoalCard.tsx
    ├── schemas.ts
    ├── types.ts
    ├── api.ts
    └── hooks.ts
```

For larger features:

```text id="q4y1b8"
goals/
├── components/
├── forms/
├── hooks/
├── api.ts
├── schemas.ts
└── types.ts
```

The structure should grow with the feature instead of being created prematurely.

---

# 31. Example: Create Goal

Conceptual flow:

```text id="f6q2v9"
GoalForm
    │
    ├── React Hook Form
    │
    ├── Zod schema
    │
    └── Submit
          ↓
     useCreateGoal()
          ↓
      createGoal()
          ↓
      POST /goals
          ↓
       Backend
          ↓
      Success/Error
```

Validation:

```text id="0n7p4a"
Title
→ required

Description
→ optional

Start date
→ valid date

End date
→ valid date
→ not before start date
```

---

# 32. Example: Edit Goal

```text id="c8m4s2"
Goal Details
    ↓
Edit
    ↓
Load existing goal
    ↓
Populate form
    ↓
User edits values
    ↓
Validate
    ↓
PATCH /goals/:id
    ↓
Success
    ↓
Update/invalidate goal queries
    ↓
Return to Goal Details
```

The form should preserve the user's values while editing and should not silently discard unsaved changes.

---

# 33. Form Rules

Mezgeb follows these rules:

1. Use React Hook Form for form state.
2. Use Zod for client-side schema validation.
3. Validate on the frontend for UX.
4. Validate again on the backend for correctness and security.
5. Keep API requests outside form components.
6. Use TanStack Query mutations for server submissions.
7. Show field-level errors near the relevant fields.
8. Show form-level errors for non-field-specific failures.
9. Preserve user input when submission fails.
10. Prevent duplicate submissions while a mutation is pending.
11. Keep form types separate from API response types when appropriate.
12. Make data transformations explicit.
13. Make forms accessible by default.
14. Use shared form UI components for consistency.
15. Avoid excessive live validation.
16. Handle cross-field validation in schemas or appropriate business logic.
17. Prefer simple forms before introducing complex editors or draft systems.
18. Test forms through observable user behavior.
19. Never treat frontend validation as a security boundary.
20. Keep business rules enforced by the backend.

---

# 34. Mezgeb Form Mental Model

The main mental model is:

```text id="6h0x1n"
                FORM
                  │
                  ▼
          React Hook Form
                  │
                  ▼
             Zod Schema
                  │
          ┌───────┴───────┐
          │               │
       Invalid          Valid
          │               │
          ▼               ▼
      Show errors      Mutation
                          │
                          ▼
                         API
                          │
                          ▼
                     Spring Boot
                          │
                    ┌─────┴─────┐
                    │           │
                 Success       Error
                    │           │
                    ▼           ▼
             Update UI      Show error
```

The central principle is:

> **Forms collect user input, validation checks whether that input is acceptable, mutations send it to the backend, and the backend remains the final authority.**
