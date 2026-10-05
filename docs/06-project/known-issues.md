# Known Issues

## 1. Purpose

This document tracks known problems, limitations, technical debt, unresolved questions, and intentionally incomplete areas in Mezgeb.

It prevents known issues from being forgotten and makes the current state of the project visible.

This document should answer:

> **What do we currently know is incomplete, imperfect, uncertain, or worth revisiting?**

---

# 2. Issue Categories

Known issues can be categorized as:

### Bug

Something does not behave as intended.

### Technical Debt

The application works, but the implementation should eventually be improved.

### Limitation

A deliberate limitation of the current version.

### Design Question

A decision that still needs investigation or validation.

### Deferred Feature

Something intentionally postponed to a later phase.

### Performance

A known or suspected performance concern.

### Security

A known security concern or area requiring further hardening.

### Documentation

Something that needs to be documented or clarified.

---

# 3. Issue Format

Each significant issue should use:

```text id="9g2m4x"
## KI-XXX — Short Description

**Status:** Open

**Category:** Technical Debt

**Priority:** Medium

**Discovered:** YYYY-MM-DD

### Description

What is the issue?

### Impact

Why does it matter?

### Current Workaround

If one exists, describe it.

### Planned Resolution

How might it eventually be resolved?

### Related

Relevant documentation, issue, feature, or decision.
```

---

# 4. Statuses

Use one of:

### Open

The issue exists and has not been resolved.

### In Progress

Work is currently being done.

### Blocked

Resolution depends on another decision, feature, or external factor.

### Deferred

Intentionally postponed.

### Resolved

The issue has been fixed or otherwise addressed.

### Won't Fix

The issue is understood and intentionally will not be addressed.

---

# 5. Priority Levels

### High

Could affect:

* security
* data integrity
* core functionality
* production reliability

Should be addressed before the affected functionality is considered complete.

### Medium

Meaningful issue that should be addressed but does not block the core application.

### Low

Minor improvement or cleanup.

---

# 6. Current Known Issues

At the beginning of development, there are no confirmed implementation bugs because the application has not yet been fully implemented.

However, several **known architectural considerations and deferred areas** already exist.

---

## KI-001 — MongoDB Adds Architectural Complexity

**Status:** Open

**Category:** Design Question

**Priority:** Medium

### Description

Journal entries are currently planned to use MongoDB while the rest of the structured learning system uses PostgreSQL.

This creates a multi-database architecture.

### Impact

It introduces:

* additional infrastructure
* separate persistence logic
* separate testing
* logical cross-database references
* no shared transactions between the two databases

### Current Workaround

Keep MVP operations independent between the two databases wherever possible.

Do not design core operations that require distributed transactions.

### Planned Resolution

Evaluate the MongoDB decision after the initial implementation.

If the additional complexity does not provide sufficient value, the journal may be moved to PostgreSQL.

### Related

* `04-backend/database-design.md`
* `05-development/tech-stack.md`
* `06-project/decisions.md`

---

# 7. KI-002 — Exact Authentication Token Strategy Needs Finalization

**Status:** Open

**Category:** Security / Design Question

**Priority:** High

### Description

The project has selected JWT-based authentication as the initial direction, but the exact token lifecycle and browser storage strategy still need to be finalized during implementation.

Questions include:

* access-token lifetime
* refresh tokens
* token storage
* logout behavior
* token expiration handling
* revocation strategy

### Impact

Authentication is a security-critical part of the application.

### Current Workaround

Use the authentication architecture defined in:

```text id="q4v8jz"
04-backend/authentication.md
```

and finalize implementation details before production deployment.

### Planned Resolution

Make and document the final authentication decision during implementation.

### Related

* `04-backend/authentication.md`
* `04-backend/authorization.md`
* `06-project/decisions.md`

---

# 8. KI-003 — Progress Calculation May Become Expensive

**Status:** Open

**Category:** Performance

**Priority:** Low

### Description

Progress is initially derived from tasks and learning activity instead of being stored redundantly.

As the amount of user data grows, calculating complex progress metrics may require increasingly expensive queries.

### Impact

Potentially affects:

* dashboard performance
* progress page performance
* analytics queries

### Current Workaround

Start with straightforward database queries and measure actual performance before optimizing.

### Planned Resolution

If real performance problems emerge, consider:

* optimized queries
* indexes
* caching
* materialized/derived data
* background aggregation

Do not introduce these prematurely.

### Related

* `04-backend/database-design.md`
* `06-project/decisions.md`

---

# 9. KI-004 — Advanced Analytics Are Not Yet Defined

**Status:** Deferred

**Category:** Deferred Feature

**Priority:** Low

### Description

The MVP includes basic progress information, but advanced learning analytics have not been fully defined.

Potential future metrics include:

* learning trends
* goal velocity
* study-time trends
* consistency patterns
* long-term learning history

### Impact

The first version of the Progress page may remain intentionally simple.

### Planned Resolution

Define advanced analytics after the core learning loop has been validated.

### Related

* `01-product/roadmap.md`
* `02-design/ui-design.md`

---

# 10. KI-005 — Search and Filtering Are Deferred

**Status:** Deferred

**Category:** Deferred Feature

**Priority:** Low

### Description

The initial MVP does not require comprehensive search and filtering across all learning data.

### Impact

Users may eventually have difficulty navigating a large history of:

* goals
* tasks
* sessions
* journal entries

### Planned Resolution

Introduce search/filtering once enough data exists to make the problem meaningful.

Potential future implementation:

```text id="v5j8q0"
Search
 ↓
Filters
 ↓
URL state
 ↓
Backend query parameters
 ↓
Indexed database queries
```

---

# 11. KI-006 — Journal Editing Experience Is Initially Basic

**Status:** Deferred

**Category:** Limitation

**Priority:** Low

### Description

The initial journal implementation is expected to prioritize reliable CRUD functionality rather than a sophisticated writing environment.

### Impact

Advanced writing features may initially be unavailable.

Potential future improvements:

* Markdown
* rich text
* autosave
* drafts
* attachments
* tags
* backlinks
* search

### Planned Resolution

Improve the journal experience after the basic learning loop is stable.

---

# 12. KI-007 — No Offline Mode

**Status:** Deferred

**Category:** Limitation

**Priority:** Low

### Description

The initial application is expected to require an active connection to the backend for persistent operations.

### Impact

Users cannot reliably create or edit learning records while completely offline.

### Planned Resolution

Offline support can be evaluated later through:

* local persistence
* optimistic interactions
* synchronization
* PWA functionality

This is not an MVP requirement.

---

# 13. KI-008 — No Native Mobile Application

**Status:** Deferred

**Category:** Deferred Feature

**Priority:** Low

### Description

The initial product is a responsive web application.

A dedicated Android/iOS application is outside MVP scope.

### Planned Resolution

Evaluate a PWA or native application only after the web experience is stable.

---

# 14. KI-009 — AI Features Are Not Implemented

**Status:** Deferred

**Category:** Deferred Feature

**Priority:** Low

### Description

Potential AI capabilities have been identified but are intentionally excluded from the MVP.

Potential features include:

* journal assistance
* reflection summaries
* learning insights
* personalized recommendations
* semantic search
* RAG over learning history

### Impact

The initial application does not provide AI-powered learning assistance.

### Planned Resolution

Evaluate AI features after the core learning workflow works reliably.

AI should enhance the learning experience rather than become a requirement for basic functionality.

### Related

* `01-product/roadmap.md`
* `06-project/decisions.md`

---

# 15. KI-010 — No External Integrations

**Status:** Deferred

**Category:** Deferred Feature

**Priority:** Low

### Description

The MVP does not integrate with external services such as:

* GitHub
* Google Calendar
* learning platforms
* notification services

### Planned Resolution

Add integrations only when there is a clear product benefit.

---

# 16. KI-011 — Observability Is Minimal Initially

**Status:** Open

**Category:** Limitation

**Priority:** Medium

### Description

The initial project will use basic application logging and health checks rather than a complete observability stack.

Advanced tools such as:

* Prometheus
* Grafana
* Sentry
* distributed tracing

are deferred.

### Impact

Diagnosing some production issues may be harder.

### Planned Resolution

Add appropriate observability once the application is deployed and actual operational needs become clearer.

---

# 17. KI-012 — Rate Limiting Is Not Yet Fully Defined

**Status:** Open

**Category:** Security

**Priority:** Medium

### Description

The backend needs protection against excessive requests, especially for authentication endpoints.

### Potentially Affected Areas

```text id="8k2m4q"
Login
Registration
Password-related endpoints
Future search
Future AI endpoints
```

### Planned Resolution

Define and implement rate limiting before exposing sensitive production endpoints to significant traffic.

The implementation may use infrastructure-level or application-level controls depending on the deployment environment.

---

# 18. KI-013 — Email Verification Is Deferred

**Status:** Deferred

**Category:** Deferred Feature

**Priority:** Medium

### Description

The initial authentication flow may allow registration without a complete email-verification system.

### Impact

Account ownership cannot initially be verified through email.

### Planned Resolution

Add email verification when account-management requirements justify it.

Potential future flow:

```text id="v1r5c8"
Register
 ↓
Send verification email
 ↓
Verify token
 ↓
Activate verified account
```

---

# 19. KI-014 — Password Reset Is Deferred

**Status:** Deferred

**Category:** Deferred Feature

**Priority:** Medium

### Description

Password-reset functionality is not required for the earliest development stages.

### Impact

Users who forget their password may not have a self-service recovery flow initially.

### Planned Resolution

Implement password reset before treating authentication as production-complete.

---

# 20. KI-015 — Cross-Database References Are Not Enforced by Foreign Keys

**Status:** Accepted Limitation

**Category:** Database

**Priority:** Medium

### Description

Journal entries stored in MongoDB may contain references such as:

```text id="2n9v4m"
userId
goalId
milestoneId
```

MongoDB cannot enforce PostgreSQL foreign-key constraints across databases.

### Impact

Application code must validate referenced resources.

### Planned Resolution

Ownership and existence checks should be performed in the service layer.

Avoid operations that require atomic changes across both databases.

### Related

* `04-backend/database-design.md`
* `04-backend/authorization.md`

---

# 21. KI-016 — Streak Definition Needs Careful Product Definition

**Status:** Open

**Category:** Design Question

**Priority:** Medium

### Description

The product may display learning streaks, but the exact definition of a "learning day" has not yet been finalized.

Possible interpretations include:

```text id="7m2q9c"
Any recorded session
Completed task
Journal entry
Any meaningful learning activity
```

### Impact

Different definitions produce different streak results.

### Planned Resolution

Define one explicit rule before implementing streak calculations.

The rule should also account for:

* timezone
* dates
* multiple sessions on one day
* missed days
* historical data

---

# 22. KI-017 — Timezone Handling Requires Care

**Status:** Open

**Category:** Data

**Priority:** Medium

### Description

Learning sessions and activity timestamps represent moments in time, while some product concepts represent calendar dates.

These should not be treated identically.

### Risk

Incorrect timezone handling could cause:

* sessions to appear on the wrong day
* incorrect streaks
* incorrect daily study totals
* confusing activity history

### Planned Resolution

Use UTC for stored timestamps and explicitly apply the user's relevant timezone when calculating calendar-based metrics.

---

# 23. KI-018 — Rich Journal Content May Require Content-Safety Handling

**Status:** Open

**Category:** Security / Design

**Priority:** Medium

### Description

Journal content is user-generated content.

If the application eventually supports rich text or HTML-like content, rendering it directly could introduce security problems.

### Planned Resolution

Prefer safe rendering strategies and sanitize untrusted content where necessary.

Do not render arbitrary user-provided HTML without appropriate protection.

---

# 24. KI-019 — Notification System Is Not Implemented

**Status:** Deferred

**Category:** Deferred Feature

**Priority:** Low

### Description

The MVP does not include:

* reminders
* study notifications
* goal deadlines
* inactivity notifications

### Planned Resolution

Evaluate notifications after the core learning experience is stable.

---

# 25. KI-020 — Advanced Goal Templates Are Deferred

**Status:** Deferred

**Category:** Deferred Feature

**Priority:** Low

### Description

Users cannot initially create goals from reusable templates or predefined learning roadmaps.

### Planned Resolution

Potential future functionality:

```text id="m6p2q8"
Goal Template
      ↓
Milestones
      ↓
Tasks
      ↓
Personalized Goal
```

---

# 26. KI-021 — API Pagination Strategy Will Expand With Data Growth

**Status:** Open

**Category:** Performance

**Priority:** Low

### Description

Initial list endpoints may use straightforward page-based pagination.

As datasets grow, certain endpoints may benefit from more advanced strategies.

### Current Approach

Use conventional pagination:

```text id="f8j3q0"
?page=0&size=20
```

### Planned Resolution

Evaluate cursor-based pagination for high-volume activity or journal history if required.

---

# 27. KI-022 — Caching Is Intentionally Minimal

**Status:** Deferred

**Category:** Performance

**Priority:** Low

### Description

The initial architecture relies primarily on TanStack Query caching on the frontend and database queries on the backend.

A dedicated Redis cache is not initially required.

### Planned Resolution

Introduce caching only after measuring a real performance problem.

---

# 28. KI-023 — No Background Job System Initially

**Status:** Deferred

**Category:** Infrastructure

**Priority:** Low

### Description

The MVP does not require a dedicated background job system.

Future features such as:

* AI processing
* notifications
* email
* analytics aggregation
* scheduled tasks

may eventually require asynchronous processing.

### Planned Resolution

Introduce a background-job mechanism only when an actual asynchronous workload exists.

---

# 29. KI-024 — Deployment Architecture Will Evolve

**Status:** Open

**Category:** Infrastructure

**Priority:** Low

### Description

The local development architecture is well defined, but the final production infrastructure may change based on hosting requirements, cost, reliability, and learning goals.

### Planned Resolution

Document the final production architecture when deployment is implemented.

---

# 30. KI-025 — Production Security Hardening Is Still Required

**Status:** Open

**Category:** Security

**Priority:** High

### Description

Development security configuration should not automatically be considered production-ready.

Before production, the application needs a dedicated security review covering:

```text id="6m3x9r"
Authentication
Authorization
CORS
CSRF where applicable
Token handling
Password hashing
Rate limiting
Input validation
Error exposure
Secrets
HTTPS
Security headers
Database credentials
Logging
User-generated content
```

### Planned Resolution

Perform a production security review before public deployment.

---

# 31. Technical Debt Rules

Technical debt should not automatically be treated as failure.

Some debt is intentional.

For example:

```text id="q9k2w7"
MVP:
Simple progress calculation
        ↓
Measure actual performance
        ↓
Optimize if necessary
```

This is preferable to:

```text id="a6p4z1"
MVP:
Complex caching infrastructure
        ↓
No actual performance problem
```

The project should distinguish between:

### Intentional simplicity

A conscious choice to avoid unnecessary complexity.

### Unintentional debt

A shortcut that creates a known problem.

### Necessary future work

A feature or improvement deliberately postponed.

---

# 32. When to Create a New Known Issue

Create an entry when:

* a real bug is discovered
* an important limitation becomes apparent
* technical debt is intentionally introduced
* a security concern is identified
* an architectural question remains unresolved
* a feature is intentionally deferred
* a performance concern is discovered
* documentation is incomplete in a meaningful way

Do not create an entry for every tiny inconvenience.

---

# 33. When to Remove an Issue

Do not simply delete resolved issues.

For meaningful issues:

```text id="c7m1x4"
Open
 ↓
In Progress
 ↓
Resolved
```

The changelog can then record the actual fix.

Historical issue context can be preserved when it helps explain why the system evolved.

---

# 34. Known-Issue Review

Before major releases, review:

```text id="p4w8y2"
- [ ] High-priority issues
- [ ] Security issues
- [ ] Database issues
- [ ] Authentication issues
- [ ] Performance concerns
- [ ] Deferred functionality
- [ ] Production limitations
- [ ] Documentation gaps
```

A release should not automatically require every low-priority issue to be resolved.

---

# 35. Current Development Priorities

At the beginning of implementation, the main focus should remain:

```text id="z8q4mc"
1. Core functionality
2. Correct architecture
3. Authentication & authorization
4. Data integrity
5. Testing
6. Accessibility
7. Deployment reliability
8. Performance optimization
9. Advanced features
```

This order prevents premature optimization and feature expansion.

---

# 36. Final Principle

Known issues are not evidence that a project is poorly built.

A professional project can contain unresolved issues.

The important distinction is whether those issues are:

```text id="r3m7xq"
Unknown
   ↓
Known
   ↓
Documented
   ↓
Prioritized
   ↓
Intentionally handled
```

The purpose of this document is therefore not to make Mezgeb look perfect.

It is to make the project's limitations **visible and manageable**.

> **A known limitation can be managed. An undocumented limitation can become a surprise.**
