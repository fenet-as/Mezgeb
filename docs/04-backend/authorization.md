# Authorization

## 1. Purpose

This document defines authorization for the Mezgeb backend.

Authentication establishes:

> Who is the user?

Authorization establishes:

> What is this user allowed to do?

Mezgeb is a personal learning tracker, so the central authorization rule is:

> **A user may access and modify only the learning data they are authorized to access.**

This document covers:

* resource ownership
* access rules
* role-based authorization where applicable
* method-level security
* ownership checks
* nested resources
* authorization failures
* service-layer authorization
* security testing

---

# 2. Authentication vs Authorization

These should remain separate concepts.

### Authentication

```text id="7x3m2p"
Credentials
    ↓
Authentication
    ↓
Identify User
```

### Authorization

```text id="8q4m1z"
Authenticated User
       ↓
Requested Resource
       ↓
Permission Check
       ↓
Allow / Reject
```

A user can be successfully authenticated but still not be authorized to access a particular resource.

---

# 3. Authorization Goals

Mezgeb authorization should be:

* secure
* explicit
* centralized where possible
* difficult to bypass accidentally
* easy to test
* consistent across resources
* understandable to developers

Authorization must be enforced by the backend.

Frontend restrictions are not security boundaries.

---

# 4. Primary Authorization Model

The primary authorization model is:

> **User owns their learning resources.**

The ownership hierarchy is approximately:

```text id="5k8m2q"
User
 │
 ├── Goals
 │    │
 │    ├── Milestones
 │    │      │
 │    │      └── Tasks
 │    │
 │    └── Learning Sessions
 │
 ├── Journal Entries
 │
 └── Activity
```

A user therefore gains access to resources through their relationship with the owning user.

---

# 5. Ownership Hierarchy

Conceptually:

```text id="3q7m9x"
User
  │
  └── Goal
       │
       ├── Milestone
       │      └── Task
       │
       └── Learning Session
```

Journal entries are associated directly with the user and may optionally reference:

```text id="8m2q5x"
Goal
Milestone
```

Authorization should follow these relationships.

---

# 6. Ownership Rule

For a resource directly owned by the user:

```text id="6x9m3q"
resource.userId == authenticatedUser.id
```

For a nested resource:

```text id="4q8m2x"
task
 ↓
milestone
 ↓
goal
 ↓
user
```

the backend must resolve the ownership chain before allowing access.

---

# 7. Example: Goal Authorization

Request:

```http id="3m7q9x"
GET /api/v1/goals/123
```

The backend should:

```text id="8x2m5q"
1. Authenticate user
2. Find goal 123
3. Determine goal owner
4. Compare owner with current user
5. Allow or reject
```

If:

```text id="7q3m9x"
goal.ownerId == currentUser.id
```

then access is allowed.

Otherwise, access is rejected.

---

# 8. Example: Task Authorization

A task may not directly contain enough information to establish ownership without following its relationship.

Conceptually:

```text id="5m8q2x"
Task
 ↓
Milestone
 ↓
Goal
 ↓
User
```

For:

```http id="9q2m7x"
PATCH /api/v1/tasks/456
```

the backend should verify:

```text id="4x8m3q"
Task 456
    ↓
belongs to Milestone A
    ↓
belongs to Goal B
    ↓
Goal B belongs to current user
```

Only then should the update be allowed.

---

# 9. Example: Journal Authorization

Journal entries are directly owned by the user.

Conceptually:

```text id="2m7q9x"
JournalEntry
    ↓
userId
```

For:

```http id="8q3m5x"
GET /api/v1/journal/789
```

the backend checks:

```text id="6m2q8x"
journalEntry.userId == currentUser.id
```

If not, the request is rejected.

---

# 10. Example: Learning Session Authorization

A learning session may reference a goal.

Conceptually:

```text id="7m4q9x"
LearningSession
       ↓
Goal
       ↓
User
```

When accessing or modifying a session, the backend should verify that the referenced goal belongs to the authenticated user.

---

# 11. Authorization Must Be Server-Side

This is insecure:

```text id="x7m3q8"
Frontend:
"If the user shouldn't see this goal,
don't display it."
```

The user can bypass the frontend by directly sending:

```http id="2q8m4x"
GET /api/v1/goals/123
```

Therefore the backend must enforce:

```text id="9m3q7x"
Request
 ↓
Authentication
 ↓
Authorization
 ↓
Resource
```

---

# 12. Never Trust Client Ownership Data

A request such as:

```json id="4m8q2x"
{
  "userId": "123"
}
```

should not determine who owns the resource.

The backend should derive the current user from authentication.

For example:

```text id="7q2m9x"
SecurityContext
      ↓
Authenticated Principal
      ↓
Current User ID
```

This prevents a client from simply changing:

```text id="5m8x3q"
"userId": "another-user"
```

to access someone else's data.

---

# 13. Resource Ownership vs User Roles

Mezgeb's primary authorization model is ownership rather than complex roles.

For example:

```text id="2q7m5x"
User A
 └── owns Goal A

User B
 └── owns Goal B
```

User A does not automatically have access to Goal B.

---

# 14. Roles

The application may still have a basic user role if required.

For example:

```text id="8m3q7x"
USER
ADMIN
```

However, roles should not be introduced merely because role-based authorization is common in tutorials.

The MVP does not require multiple user roles for ordinary learning data.

---

# 15. Role-Based Authorization

If administrative functionality is introduced later:

```text id="4q9m2x"
ADMIN
   ↓
Administrative operations

USER
   ↓
Own learning data
```

An administrator's capabilities should be explicitly defined.

Being an `ADMIN` should not automatically grant access to every piece of private user content unless the product and privacy requirements explicitly establish that behavior.

---

# 16. Method-Level Security

Spring Security can provide method-level authorization.

For example:

```java
@PreAuthorize(...)
```

can protect certain methods.

This can be useful for:

* role checks
* coarse-grained permissions
* administrative operations

However, resource ownership usually still requires resource-specific checks.

---

# 17. Ownership Checks in Services

For personal resources, ownership checks should generally be close to the use case.

Example:

```text id="9m3q7x"
GoalService.updateGoal(userId, goalId, request)
```

Conceptually:

```text id="5q8m2x"
Find goal
   ↓
Check owner
   ↓
If owner → continue
If not → reject
```

This makes the authorization requirement explicit in the business operation.

---

# 18. Why Not Only Check in Controllers?

If ownership is checked only in controllers:

```text id="7x2m9q"
GoalController
   ↓
ownership check
```

another path might accidentally bypass the check:

```text id="4m8q3x"
AnotherController
   ↓
GoalService
   ↓
GoalRepository
```

Keeping important authorization rules in the application/service layer provides stronger protection.

---

# 19. Repository-Level Ownership Queries

Sometimes ownership can be included directly in database queries.

For example, conceptually:

```text id="8q3m7x"
findGoalByIdAndUserId(goalId, userId)
```

This can be useful because the database query itself restricts the resource.

Instead of:

```text id="2m9q5x"
findGoalById(goalId)
        ↓
check owner in Java
```

the query can ensure:

```text id="6q4m8x"
goal.id == goalId
AND
goal.user.id == userId
```

Both approaches can be useful depending on the use case.

---

# 20. Defense in Depth

Authorization should not depend on one accidental safeguard.

A strong architecture can use several layers:

```text id="5m7q2x"
Authentication
      ↓
Controller security
      ↓
Service authorization
      ↓
Ownership-aware data access
```

Not every endpoint needs every layer.

The goal is to ensure there is no easy authorization bypass.

---

# 21. Authorization Decision Flow

For a protected resource:

```text id="9q3m8x"
HTTP Request
      ↓
Is user authenticated?
      │
      ├── No → 401
      │
      ▼
Identify user
      ↓
Find requested resource
      │
      ├── Not found → 404
      │
      ▼
Check ownership/permission
      │
      ├── Not allowed → reject
      │
      ▼
Execute operation
      ↓
Return response
```

---

# 22. 401 vs 403

These statuses represent different situations.

### 401 Unauthorized

The request is not authenticated.

Examples:

```text id="7m2q9x"
No token
Invalid token
Expired authentication
```

### 403 Forbidden

The user is authenticated but does not have permission for the requested operation.

Examples:

```text id="4q8m3x"
Authenticated User
        ↓
Attempts administrative-only operation
        ↓
403
```

However, for private resources, the application may intentionally return `404` rather than revealing that a resource belonging to another user exists.

---

# 23. Preventing Resource Enumeration

Consider:

```http id="3m8q7x"
GET /api/v1/goals/100
GET /api/v1/goals/101
GET /api/v1/goals/102
```

If the API responds differently depending on whether another user's goal exists, an attacker might infer private information.

For sensitive private resources, returning:

```text id="8q2m5x"
404 Not Found
```

for an inaccessible resource can avoid revealing its existence.

The exact behavior should be consistent and documented.

---

# 24. Collection Authorization

Collection endpoints must also be scoped to the authenticated user.

For:

```http id="5m7q3x"
GET /api/v1/goals
```

the backend should effectively query:

```text id="9q2m8x"
WHERE owner_id = current_user_id
```

It must not return all goals and rely on the frontend to filter them.

---

# 25. User's Goals

Expected behavior:

```text id="2m8q5x"
GET /goals
       ↓
currentUser = User A
       ↓
return User A's goals
```

Not:

```text id="6q3m9x"
GET /goals
       ↓
return every user's goals
       ↓
frontend filters
```

---

# 26. User's Journal

Similarly:

```text id="7q2m8x"
GET /api/v1/journal
```

must return only journal entries accessible to the current user.

The frontend should never need to download another user's journal entries and filter them out.

---

# 27. User's Activity

Activity is also user-scoped.

```text id="4m9q2x"
GET /api/v1/activity
```

should return the authenticated user's activity.

Administrative access, if introduced later, should be explicitly separated.

---

# 28. Create Operations

Create operations must associate the new resource with the authenticated user.

For example:

```text id="8q3m7x"
POST /api/v1/goals
```

Request:

```json id="2m9q5x"
{
  "title": "Learn React"
}
```

The client does not need to send:

```json id="5q7m3x"
{
  "userId": "123"
}
```

The backend obtains the user from authentication.

---

# 29. Update Operations

For:

```http id="9m4q8x"
PATCH /api/v1/goals/{goalId}
```

the backend must:

1. authenticate the user
2. find the goal
3. verify ownership
4. validate the update
5. apply the change
6. persist it

---

# 30. Delete Operations

For:

```http id="3q7m9x"
DELETE /api/v1/goals/{goalId}
```

the backend must verify authorization before deletion.

Never implement:

```text id="8m2q5x"
repository.deleteById(goalId)
```

without ensuring that the resource belongs to the requesting user.

---

# 31. Nested Resource Authorization

Consider:

```http id="6m8q3x"
POST /api/v1/goals/123/milestones
```

The backend must verify:

```text id="4q9m2x"
Goal 123 exists
        ↓
Goal 123 belongs to current user
        ↓
Create milestone
```

The fact that the user is authenticated is not enough.

---

# 32. Deeply Nested Resource Authorization

For:

```http id="2m7q9x"
PATCH /api/v1/tasks/456
```

the backend can follow:

```text id="8q3m5x"
Task 456
 ↓
Milestone
 ↓
Goal
 ↓
Owner
 ↓
Current User
```

The application should centralize this ownership logic so every task operation does not implement a completely different version.

---

# 33. Authorization Helper Methods

Useful service methods might conceptually include:

```text id="5m9q2x"
getOwnedGoal(userId, goalId)
getOwnedTask(userId, taskId)
getOwnedSession(userId, sessionId)
getOwnedJournalEntry(userId, entryId)
```

These methods can provide consistent access patterns.

They should not become an excuse for hiding complicated business logic.

---

# 34. Ownership Helper Example

Conceptually:

```text id="7q3m8x"
getOwnedGoal(userId, goalId)
        ↓
Find goal
        ↓
Does it belong to user?
        │
        ├── Yes → return goal
        │
        └── No → inaccessible
```

This makes resource access explicit.

---

# 35. Authorization and Progress

Progress endpoints must also be user-scoped.

For:

```http id="4m8q2x"
GET /api/v1/goals/123/progress
```

the backend must verify that Goal 123 belongs to the current user before returning progress.

Otherwise a user could potentially inspect another user's learning progress.

---

# 36. Authorization and Dashboard

The dashboard endpoint:

```http id="9q2m7x"
GET /api/v1/dashboard
```

must generate its data from the authenticated user's resources.

Conceptually:

```text id="5m8q3x"
Current User
     ↓
Their goals
Their sessions
Their activity
Their journal information
     ↓
Dashboard response
```

No client-provided user ID should be necessary.

---

# 37. Authorization and Search

When search is eventually implemented:

```http id="3q7m9x"
GET /api/v1/journal?search=react
```

search must happen within the user's authorized data set.

The backend should conceptually perform:

```text id="8m2q5x"
Search
  +
Current User Scope
```

not:

```text id="6q9m3x"
Search entire database
  ↓
Filter results in frontend
```

---

# 38. Authorization and Pagination

Pagination must preserve authorization.

For:

```http id="2m7q8x"
GET /api/v1/journal?page=0&size=20
```

the database query should first be scoped to the authenticated user.

Then pagination should be applied.

Conceptually:

```text id="5q3m9x"
User's journal entries
        ↓
Filter
        ↓
Sort
        ↓
Paginate
        ↓
Return
```

---

# 39. Authorization and Sorting

Sorting should not allow a user to bypass ownership restrictions.

The query should always preserve:

```text id="8m2q7x"
user scope
```

regardless of:

```text id="4q9m3x"
sort
filter
page
search
```

---

# 40. Authorization and MongoDB

If journal entries are stored in MongoDB, the same ownership rule applies.

Queries should include the authenticated user's identity.

Conceptually:

```text id="7m3q8x"
find({
    _id: entryId,
    userId: currentUserId
})
```

rather than:

```text id="2q8m5x"
find({
    _id: entryId
})
```

followed by potentially inconsistent authorization handling.

---

# 41. Authorization and PostgreSQL

For PostgreSQL resources, ownership can be represented through relationships.

For example:

```text id="9m4q7x"
goals
-----
id
user_id
title
status
```

Then queries can be scoped using `user_id`.

Related entities can derive ownership through their relationships.

---

# 42. Data Ownership Model

The expected ownership structure is:

```text id="5q8m2x"
users
  │
  ├── goals
  │    │
  │    ├── milestones
  │    │      └── tasks
  │    │
  │    └── learning_sessions
  │
  ├── journal_entries
  │
  └── activity
```

The database design document will define the exact foreign keys and references.

---

# 43. Soft Delete and Authorization

If soft deletion is introduced later, authorization must still account for deleted resources.

For example:

```text id="7m2q9x"
Goal
 ├── active
 └── archived/deleted
```

A deleted resource should not accidentally become accessible simply because an ownership query finds it.

Deletion semantics will be defined in the database design.

---

# 44. Archived Resources

Goal status includes:

```text id="4q8m3x"
PLANNED
ACTIVE
COMPLETED
ARCHIVED
```

Authorization and business rules are different.

A user may own an archived goal but still be restricted from certain operations.

Therefore:

```text id="9m2q7x"
Ownership
    ≠
Operation allowed
```

Both may need to be checked.

---

# 45. Authorization vs Business Rules

Consider:

```text id="3q8m5x"
User owns Goal
```

This establishes authorization.

But:

```text id="7m2q9x"
Goal is ARCHIVED
```

may establish a business restriction.

So the service may perform:

```text id="5m8q3x"
1. Is user authenticated?
2. Does user own resource?
3. Is requested operation valid for current state?
4. Execute operation.
```

---

# 46. State-Based Authorization

Some actions may depend on resource state.

For example:

```text id="8q2m7x"
ARCHIVED goal
     ↓
Maybe cannot add new tasks
```

This is primarily a business rule, not a role permission.

Keep the distinction clear.

---

# 47. Future Sharing

Mezgeb is initially a personal learning tracker.

If collaboration or sharing is introduced later, the ownership model can evolve into permissions such as:

```text id="4m9q2x"
OWNER
VIEWER
EDITOR
```

For example:

```text id="7q3m8x"
Goal
 ├── Owner
 ├── Viewer
 └── Editor
```

This should not be implemented in the MVP unless sharing becomes a real requirement.

---

# 48. Future Collaboration Model

If collaboration is eventually introduced, authorization may become:

```text id="2m8q5x"
User
  ↓
Membership
  ↓
Resource
  ↓
Permission
```

This is significantly more complex than the current ownership model.

The current architecture should not prematurely implement it.

---

# 49. Admin Authorization

If an admin interface is introduced, administrative endpoints should be clearly separated.

For example:

```text id="9q4m7x"
/api/v1/admin/users
/api/v1/admin/metrics
```

These endpoints should have explicit role checks.

Ordinary user endpoints should not quietly become admin endpoints.

---

# 50. Sensitive Administrative Data

Even if an admin role exists later, access to sensitive user data should follow explicit privacy requirements.

Authorization should answer:

```text id="3m8q2x"
Who?
What resource?
What operation?
Why is access permitted?
```

Do not treat `ADMIN` as a universal bypass for every privacy boundary without a documented requirement.

---

# 51. Authorization Testing

Authorization tests are essential.

### Goal tests

* [ ] User can access own goal
* [ ] User cannot access another user's goal
* [ ] User can update own goal
* [ ] User cannot update another user's goal
* [ ] User can delete own goal
* [ ] User cannot delete another user's goal

### Milestone tests

* [ ] User can access own milestone
* [ ] User cannot access another user's milestone
* [ ] User cannot create milestone under another user's goal

### Task tests

* [ ] User can access own task
* [ ] User cannot access another user's task
* [ ] User cannot modify another user's task

### Session tests

* [ ] User can access own session
* [ ] User cannot access another user's session

### Journal tests

* [ ] User can access own journal entry
* [ ] User cannot access another user's journal entry

---

# 52. Collection Authorization Tests

Test that:

```text id="7q3m9x"
User A → GET /goals
```

returns only:

```text id="2m8q5x"
User A's goals
```

and never:

```text id="9m4q7x"
User B's goals
```

Repeat this principle for:

* journal
* sessions
* activity
* progress

---

# 53. Nested Authorization Tests

Test cases such as:

```text id="5m8q3x"
User A
  ↓
POST /goals/User-B-Goal/milestones
```

Expected:

```text id="4q9m2x"
Rejected
```

Likewise:

```text id="7m2q8x"
User A
  ↓
POST /milestones/User-B-Milestone/tasks
```

must be rejected.

---

# 54. Authorization Test Matrix

| Resource  | Read Own | Read Others | Update Own | Update Others | Delete Others |
| --------- | -------: | ----------: | ---------: | ------------: | ------------: |
| Goal      |        ✓ |           ✗ |          ✓ |             ✗ |             ✗ |
| Milestone |        ✓ |           ✗ |          ✓ |             ✗ |             ✗ |
| Task      |        ✓ |           ✗ |          ✓ |             ✗ |             ✗ |
| Session   |        ✓ |           ✗ |          ✓ |             ✗ |             ✗ |
| Journal   |        ✓ |           ✗ |          ✓ |             ✗ |             ✗ |
| Activity  |        ✓ |           ✗ |          — |             — |             — |
| Progress  |        ✓ |           ✗ |          — |             — |             — |

The table represents the initial personal-data model.

---

# 55. Authorization Checklist

### Authentication

* [ ] Identify current user from security context
* [ ] Reject unauthenticated requests

### Ownership

* [ ] Scope collection queries to current user
* [ ] Verify ownership before single-resource operations
* [ ] Verify ownership through relationships for nested resources
* [ ] Never trust client-supplied user IDs

### Business Rules

* [ ] Check resource state
* [ ] Validate allowed state transitions
* [ ] Separate ownership from business rules

### Security

* [ ] Protect admin endpoints if introduced
* [ ] Avoid leaking existence of private resources
* [ ] Do not expose sensitive data
* [ ] Test unauthorized access

---

# 56. Authorization Rules

1. Authentication must happen before protected operations.
2. The backend must derive the current user from authentication.
3. Never trust a client-provided user ID for ownership.
4. Collection endpoints must be user-scoped.
5. Single-resource endpoints must verify ownership or permission.
6. Nested resources must verify ownership through their parent relationships.
7. Authorization must be enforced server-side.
8. Frontend route protection is not a security boundary.
9. Ownership and business-state rules are separate concerns.
10. Use `401` for missing/invalid authentication.
11. Use `403` where the authenticated user lacks required permission.
12. Consider `404` for private resources where revealing existence would leak information.
13. Keep authorization logic consistent across features.
14. Test cross-user access explicitly.
15. Do not introduce complex role/permission systems until product requirements justify them.

---

# 57. Authorization Mental Model

```text id="9m4q7x"
                 HTTP Request
                       │
                       ▼
                Authentication
                       │
                 Who is this?
                       │
                       ▼
               Current User ID
                       │
                       ▼
              Find Requested Data
                       │
                       ▼
              Ownership / Permission
                       │
              ┌────────┴────────┐
              │                 │
           Allowed           Rejected
              │                 │
              ▼                 ▼
          Business            403/404
            Rules
              │
              ▼
          Operation
              │
              ▼
          Response
```

The central principle is:

> **Authentication identifies the user; authorization scopes every operation to what that user is allowed to access; business rules then determine whether the requested operation is valid.**
