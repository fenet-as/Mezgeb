# Testing

## 1. Purpose

This document defines the frontend testing strategy for Mezgeb.

Testing should help verify that:

* components behave correctly
* user interactions work
* forms validate correctly
* API interactions behave as expected
* loading/empty/error states work
* authentication flows behave correctly
* routing works
* important user journeys remain functional

The goal is not to test every implementation detail.

The goal is to give confidence that the application behaves correctly from the user's perspective.

---

# 2. Testing Philosophy

Mezgeb follows this principle:

> **Test behavior, not implementation details.**

Prefer:

```text
User clicks "Create Goal"
        ↓
Goal is created
        ↓
Success feedback appears
```

over testing:

```text
setState() was called
```

The first verifies something meaningful to the user.

The second tests an implementation detail that may change without affecting behavior.

---

# 3. Testing Pyramid

The frontend will use multiple levels of testing:

```text
                 ┌───────────────┐
                 │   E2E Tests   │
                 │   Playwright  │
                 └───────┬───────┘
                         │
                ┌────────┴────────┐
                │  Integration    │
                │     Tests       │
                └────────┬────────┘
                         │
              ┌──────────┴──────────┐
              │ Component / Unit     │
              │ Tests                │
              └──────────────────────┘
```

Most frontend tests should live at the component and integration levels.

End-to-end tests should cover the most important complete user journeys rather than every possible interaction.

---

# 4. Testing Tools

Initial frontend testing stack:

| Tool                        | Purpose                            |
| --------------------------- | ---------------------------------- |
| Vitest                      | Test runner                        |
| React Testing Library       | Component/user interaction testing |
| `@testing-library/jest-dom` | DOM assertions                     |
| MSW                         | API mocking when needed            |
| Playwright                  | End-to-end testing                 |
| ESLint                      | Static code-quality checks         |
| TypeScript                  | Compile-time type checking         |

The tools should be introduced progressively.

Do not install every testing tool before there is a use for it.

---

# 5. Test Levels

Mezgeb uses three primary levels.

### Unit tests

Test small pieces of logic independently.

Examples:

* utility functions
* data transformations
* validation helpers

### Component/integration tests

Test React components and interactions.

Examples:

* forms
* goal lists
* dialogs
* pages
* API-driven UI

### End-to-end tests

Test complete user journeys in a browser.

Examples:

```text
Register
→ Create Goal
→ Create Task
→ Complete Task
```

---

# 6. What Should Be Tested?

Important areas include:

### Shared components

* buttons
* inputs
* dialogs
* badges
* loading states
* empty states
* error states

### Features

* authentication
* goals
* milestones
* tasks
* sessions
* journal
* progress

### Pages

* dashboard
* goals
* goal details
* journal
* progress
* settings

### Application behavior

* routing
* authentication guards
* API interactions
* loading/error states

---

# 7. What Should Not Be Tested Excessively?

Avoid tests that simply duplicate implementation details.

For example, don't test every:

```text
<div>
```

or internal state variable.

Avoid testing:

* React itself
* third-party libraries' internal behavior
* CSS implementation details
* trivial getters/setters
* private implementation details that have no observable effect

The test should provide useful confidence.

---

# 8. Test Organization

The project can initially use:

```text
frontend/
├── src/
└── tests/
    ├── components/
    ├── features/
    ├── pages/
    ├── integration/
    ├── utils/
    └── setup.ts
```

As the project grows, colocating tests next to their implementation can also be considered.

The important rule is consistency rather than one universally correct folder structure.

---

# 9. Test Naming

Test names should describe observable behavior.

Prefer:

```text
shows validation error when goal title is empty
```

over:

```text
calls validateGoal()
```

Good test names answer:

> What behavior should remain true?

---

# 10. Arrange → Act → Assert

Tests should generally follow:

```text id="6q3m8x"
Arrange
   ↓
Act
   ↓
Assert
```

Example:

```text id="4m7p2q"
Arrange:
Render Create Goal form.

Act:
Submit without a title.

Assert:
Display title validation error.
```

This makes tests easier to read.

---

# 11. Shared Component Testing

Shared components should be tested according to their public behavior.

For example, a Button might test:

* renders its label
* handles clicks
* disabled state works
* loading state works
* keyboard interaction works when applicable

Avoid testing its internal CSS classes unless a class itself represents meaningful behavior.

---

# 12. Form Testing

Forms are important because they contain user input and validation.

A goal form should test:

```text id="8p2m6q"
User enters valid data
      ↓
Submit
      ↓
Mutation called with expected data
```

and:

```text id="3x7m9q"
User submits invalid data
      ↓
Validation errors appear
      ↓
Request is not submitted
```

Also test:

* required fields
* invalid values
* server validation errors
* submission loading
* successful submission
* error recovery
* accessible labels

---

# 13. Authentication Testing

Login tests should cover:

```text id="m4q8x2"
Valid credentials
    ↓
Login succeeds
    ↓
User becomes authenticated
```

and:

```text id="7p3m9x"
Invalid credentials
    ↓
Error appears
    ↓
User remains on login page
```

Registration should similarly test validation, success, and failure.

---

# 14. Protected Route Testing

Protected routes should verify:

### Authenticated

```text id="q8m2x5"
Authenticated
   ↓
/app/dashboard
   ↓
Dashboard renders
```

### Unauthenticated

```text id="6p9m3x"
Unauthenticated
   ↓
/app/dashboard
   ↓
Redirect to /login
```

### Authentication loading

```text id="m2x7q8"
Auth status unknown
   ↓
Loading UI
```

This prevents accidental redirects while authentication is still being resolved.

---

# 15. Goal Feature Testing

Important goal behavior includes:

* goal list renders
* empty state appears when appropriate
* loading state appears
* error state appears
* goal creation works
* goal editing works
* goal deletion works
* goal details render
* invalid goal ID produces appropriate feedback
* progress displays correctly

A complete goal test might look conceptually like:

```text id="5q8m3x"
Create Goal
   ↓
Goal appears in list
   ↓
Open Goal
   ↓
Goal details appear
```

---

# 16. Task Testing

Task tests should cover important user behavior:

* task renders
* task can be completed
* completed task can be reopened
* mutation loading is shown
* errors are communicated
* related progress updates appropriately

The test should focus on what the user sees and can do.

---

# 17. Learning Session Testing

Tests should verify:

* session form renders
* required fields are validated
* duration is handled correctly
* goal association works
* optional milestone association works
* successful submission works
* errors are displayed
* session appears in the relevant UI

---

# 18. Journal Testing

Important behavior includes:

* journal list renders
* empty journal state works
* new entry form works
* validation works
* entry content renders
* editing works if supported
* deletion works if supported
* associated goal/milestone information appears correctly

Rich text or Markdown behavior should be tested according to the actual editor implementation once chosen.

---

# 19. Loading State Testing

Every important server-driven component should consider its loading behavior.

Example:

```text id="9m3x7q"
Mock pending request
        ↓
Render component
        ↓
Loading indicator/skeleton appears
```

Test that actual content does not incorrectly appear as empty while the request is still pending.

---

# 20. Empty State Testing

Example:

```text id="4x8m2q"
Mock successful response with []
        ↓
Render Goals
        ↓
"No learning goals yet"
        ↓
"Create Goal" action
```

This verifies that empty data is correctly distinguished from loading.

---

# 21. Error State Testing

Example:

```text id="7q2m9x"
Mock API failure
        ↓
Render Goals
        ↓
ErrorState appears
        ↓
Try Again
        ↓
Request is retried
```

Recovery behavior should be tested when the UI provides recovery actions.

---

# 22. Background Fetching Testing

If existing data remains visible during a background refetch:

```text id="m8p3q6"
Existing goals
      ↓
Refetch
      ↓
Goals remain visible
      ↓
Updated data arrives
```

the test should verify that behavior.

This prevents regressions where a refetch accidentally replaces useful content with a full-page loader.

---

# 23. API Testing

API functions should be tested independently where useful.

For example:

```text id="2q7m8x"
createGoal(data)
```

should be verified to make the expected request.

Test:

* method
* endpoint
* request body
* query parameters
* response handling
* error handling

Mock the network rather than depending on a real production backend for frontend unit tests.

---

# 24. MSW

Mock Service Worker can provide realistic API mocking.

Conceptually:

```text id="8m4q2x"
React
  ↓
API request
  ↓
MSW
  ↓
Mock response
```

This allows components and pages to behave as though they are communicating with a real backend.

It is particularly useful for testing:

* loading
* success
* empty
* validation errors
* authentication errors
* server errors

---

# 25. Avoid Mocking Too Much

Mocking every internal function can make tests unrealistic.

For example, instead of mocking:

```text id="q3m7x9"
useCreateGoal()
```

just to verify that a component calls it, an integration-style test can allow the form to perform the request against a mocked API.

This tests more of the actual application behavior.

Mock boundaries rather than implementation details where practical.

---

# 26. Page Testing

Pages should test important user-visible behavior.

For example, Dashboard tests might verify:

* page heading appears
* active goals appear
* recent sessions appear
* empty states appear when appropriate
* loading behavior works
* errors are handled

A page test does not need to test every child component again.

---

# 27. Avoid Duplicate Tests

If `Button` already has thorough behavior tests, a page does not need to repeat every Button test.

Instead:

```text id="9q4m2x"
Button tests
→ Button behavior

Page tests
→ Page behavior involving the button
```

This keeps the suite maintainable.

---

# 28. Accessibility Testing

Accessibility should be tested alongside functionality.

Useful tools include:

* `eslint-plugin-jsx-a11y`
* `axe-core`
* browser accessibility tools
* keyboard testing
* manual screen-reader checks where appropriate

Examples:

```text id="5m8q3x"
Form
→ labels accessible

Dialog
→ focus managed correctly

Button
→ accessible name available

Navigation
→ keyboard accessible
```

Automated accessibility tools are useful but do not replace manual testing.

---

# 29. Keyboard Testing

Important flows should be usable without a mouse.

Test interactions such as:

```text id="x7m2q9"
Tab
 ↓
Focus
 ↓
Enter / Space
 ↓
Action
```

Pay particular attention to:

* dialogs
* menus
* forms
* navigation
* custom controls
* icon-only buttons

---

# 30. Responsive Testing

Important screens should be checked at:

* desktop
* tablet
* mobile

Testing should verify that:

* navigation works
* content remains readable
* forms remain usable
* dialogs fit the viewport
* buttons remain accessible
* important actions remain discoverable

Not every possible screen size needs a separate automated test.

---

# 31. End-to-End Testing

Playwright should be introduced after the core application flow is working.

E2E tests should focus on critical user journeys.

Example:

```text id="4p8m2x"
Register
 ↓
Login
 ↓
Create Goal
 ↓
Create Milestone
 ↓
Create Task
 ↓
Complete Task
 ↓
Record Learning Session
 ↓
Review Progress
```

This represents Mezgeb's central product loop.

---

# 32. E2E Test Scope

Do not create E2E tests for every small UI detail.

Prioritize journeys where a failure would affect the core application.

Potential E2E flows:

### Authentication

```text
Register → Login → Logout
```

### Core learning loop

```text
Create Goal
→ Milestone
→ Task
→ Complete Task
→ Record Session
→ Review Progress
```

### Journal

```text
Create Journal Entry
→ View Entry
```

Additional flows can be added as the product grows.

---

# 33. Test Data

Tests should use predictable test data.

Avoid relying on personal or production data.

Examples:

```text id="7m3q8x"
Test User
Test Goal
Test Milestone
Test Task
```

E2E environments should have controlled test data and a predictable backend state.

---

# 34. Test Isolation

Tests should not depend on the order in which other tests run.

Bad:

```text id="2x8m4q"
Test A creates goal
Test B assumes Test A already ran
```

Better:

```text id="9q3m7x"
Each test creates or prepares its required state
```

This makes failures easier to diagnose.

---

# 35. Test Cleanup

Tests should clean up after themselves where necessary.

This may include:

* resetting mocks
* clearing client state
* resetting MSW handlers
* resetting browser state
* cleaning test data

The exact cleanup strategy depends on the testing level.

---

# 36. Deterministic Tests

Tests should produce consistent results.

Avoid depending on:

* real network availability
* current time unless explicitly controlled
* random values without control
* production databases
* external services
* test execution order

If time matters, use controlled test dates.

---

# 37. Testing Dates and Time

Mezgeb contains:

* learning session dates
* journal dates
* goal dates
* study duration
* streak calculations

These can produce timezone-related bugs.

Tests should explicitly define dates and times rather than depending on the machine's current timezone.

For example:

```text id="m5x8q2"
Expected:
2026-10-02
```

rather than:

```text id="7q3p9x"
new Date()
```

when deterministic behavior is required.

---

# 38. Testing Derived Data

Some values are calculated from other data.

Examples:

* goal progress
* completion percentage
* total learning time
* streak

If calculation logic is implemented on the frontend, test the calculation independently.

For example:

```text id="4m7x2q"
Completed tasks = 3
Total tasks = 5
        ↓
Progress = 60%
```

However, if the backend is the authoritative source for a value, the frontend should primarily test that the returned value is displayed correctly.

---

# 39. Testing Error Recovery

A good test should not stop at:

```text id="8q2m5x"
Error appears
```

when the UI provides a recovery action.

Also test:

```text id="6m9x3q"
Error
 ↓
Try Again
 ↓
Successful request
 ↓
Content appears
```

This verifies the complete interaction.

---

# 40. Testing Navigation

Important navigation should be tested.

Examples:

```text id="3x8m7q"
/goals
 ↓
click goal
 ↓
/goals/:goalId
```

and:

```text id="9m2q5x"
/app/goals/invalid
 ↓
appropriate not-found state
```

Also test browser navigation behavior where relevant.

---

# 41. Testing URL State

When filters/search/pagination are introduced, test that:

```text id="7q4m8x"
URL
 ↓
UI state
```

and:

```text id="2x9m3q"
UI interaction
 ↓
URL
```

remain synchronized.

For example:

```text id="6p8m2q"
/app/goals?status=ACTIVE
```

should result in the Active filter being selected.

---

# 42. Type Checking

TypeScript itself is part of the quality process.

The project should regularly run:

```text id="4m9q7x"
tsc
```

or the appropriate project type-check command.

Type errors should not be ignored simply because runtime tests pass.

---

# 43. Linting

ESLint should run as part of development and CI.

It helps detect:

* unused variables
* problematic React patterns
* accessibility issues
* invalid hooks usage
* code-quality problems

Linting complements tests but does not replace them.

---

# 44. Formatting

Prettier should provide consistent formatting.

Formatting should not require developers to manually debate:

* indentation
* quote style
* line wrapping
* spacing

Automated formatting keeps attention focused on behavior and architecture.

---

# 45. CI Testing

GitHub Actions should eventually run the important quality checks.

A frontend CI pipeline may include:

```text id="8q3m6x"
Install dependencies
        ↓
Type check
        ↓
Lint
        ↓
Unit/component tests
        ↓
Build
        ↓
E2E tests
```

E2E tests may run in a separate job depending on infrastructure.

---

# 46. Pull Request Expectations

A frontend pull request should generally:

* pass TypeScript checks
* pass linting
* pass relevant tests
* include tests for meaningful new behavior
* avoid unrelated test changes
* update tests when behavior changes

Not every tiny change requires a large test suite.

The level of testing should match the risk and behavior being changed.

---

# 47. Testing New Features

When adding a feature:

```text id="m7q2x8"
Define behavior
      ↓
Implement
      ↓
Test important states
      ↓
Run existing suite
      ↓
Review
```

For a server-driven feature, consider at minimum:

```text id="p4m8x2"
Loading
Empty
Success
Error
User interaction
```

---

# 48. Testing Bug Fixes

When fixing a meaningful bug:

```text id="6x9q3m"
Reproduce bug
    ↓
Write regression test
    ↓
Fix implementation
    ↓
Test passes
```

This prevents the same bug from returning later.

---

# 49. Test Coverage

Coverage can be useful as a signal, but it should not become the primary goal.

For example:

```text id="3m7q8x"
100% coverage
```

does not automatically mean:

```text id="8p2m4q"
100% confidence
```

A small number of meaningful behavioral tests can be more valuable than many tests that only execute lines.

Coverage should help identify untested areas rather than encourage meaningless tests.

---

# 50. Testing Priorities

For Mezgeb, prioritize:

### Highest priority

* authentication
* protected routes
* goal creation
* task completion
* learning session recording
* journal creation
* core progress behavior
* important error handling

### Medium priority

* dashboard sections
* settings
* secondary interactions
* less critical UI variations

### Lower priority

* purely visual implementation details
* trivial wrappers
* third-party library internals

---

# 51. Testing During React Learning

Because Mezgeb is also a React learning project, tests should reinforce understanding.

When learning a concept:

```text id="9q3m7x"
Learn React concept
      ↓
Build feature
      ↓
Observe behavior
      ↓
Write test
      ↓
Understand why it passes
```

Testing should be part of learning the architecture rather than a separate activity added at the very end.

---

# 52. Example: Create Goal Test

A realistic integration test might follow:

```text id="5x8m2q"
Arrange
  Render Create Goal form
  Mock POST /goals

Act
  Enter "Learn React"
  Enter description
  Click "Create Goal"

Assert
  Request contains expected data
  Success behavior occurs
  Goal appears / navigation occurs
```

A separate test can cover:

```text id="7m4q9x"
Empty title
 ↓
Validation error
 ↓
Request is not sent
```

---

# 53. Example: Task Completion Test

```text id="2q8m3x"
Arrange
  Render task
  Mock completion request

Act
  Click complete

Assert
  Loading state appears
  Completion request is sent
  Task becomes completed
  Relevant UI updates
```

This verifies behavior across several layers without testing implementation details.

---

# 54. Testing Rules

1. Test user-visible behavior.
2. Prefer integration-style tests over excessive isolated mocks.
3. Keep unit tests for genuinely isolated logic.
4. Test important loading, empty, success, and error states.
5. Test forms and validation.
6. Test authentication and protected routes.
7. Test important API interactions.
8. Test recovery actions.
9. Keep tests deterministic.
10. Keep tests independent.
11. Avoid testing third-party internals.
12. Avoid excessive implementation-detail assertions.
13. Use accessibility testing alongside functional testing.
14. Use E2E tests for critical user journeys.
15. Add regression tests for meaningful bugs.
16. Run type checking and linting alongside tests.
17. Treat test failures as useful information rather than something to bypass.
18. Do not chase coverage percentages at the expense of meaningful tests.
19. Add complexity to the testing setup only when the application needs it.
20. Keep the test suite understandable to the developer maintaining it.

---

# 55. Testing Mental Model

Think of Mezgeb testing as:

```text id="8m3q7x"
             USER BEHAVIOR
                   │
                   ▼
          Component / Page Tests
                   │
                   ▼
           Feature Integration
                   │
                   ▼
              API Boundary
                   │
                   ▼
             E2E User Flow
```

And the development loop:

```text id="4q9m2x"
Learn
 ↓
Build
 ↓
Test
 ↓
Find problems
 ↓
Fix
 ↓
Refactor
 ↓
Repeat
```

The central principle is:

> **Tests should give us confidence that Mezgeb works for its users, while remaining simple enough that the tests themselves are easy to understand and maintain.**
