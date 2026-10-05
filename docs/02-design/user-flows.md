# User Flows

## 1. Purpose

This document defines the primary user journeys through Mezgeb.

User flows describe how users move through the application to accomplish specific goals. They provide a bridge between product requirements and the eventual UI, routing, and frontend architecture.

The flows focus on the core learning experience rather than implementation details.

---

# 2. Core Learning Flow

The central Mezgeb experience is:

```text
Create Goal
     ↓
Create Milestones
     ↓
Create Tasks
     ↓
Study
     ↓
Record Learning Session
     ↓
Complete Tasks
     ↓
Write Reflection
     ↓
Review Progress
     ↓
Continue Learning
```

This loop is the foundation of the product.

---

# 3. Authentication Flows

## 3.1 Registration

```text
Landing / Register
       ↓
Enter Name
       ↓
Enter Email
       ↓
Enter Password
       ↓
Submit
       ↓
Validate Input
       ↓
Create Account
       ↓
Success
       ↓
Redirect to Dashboard
```

### Error paths

```text
Invalid input
    ↓
Display field errors
    ↓
User corrects input
    ↓
Submit again
```

```text
Email already exists
    ↓
Display account error
    ↓
User returns to login
```

---

## 3.2 Login

```text
Login
  ↓
Enter Email
  ↓
Enter Password
  ↓
Submit
  ↓
Validate Credentials
  ↓
Successful?
  ├── No → Display Error
  │          ↓
  │       Try Again
  │
  └── Yes
       ↓
   Create Authenticated Session
       ↓
   Dashboard
```

---

## 3.3 Logout

```text
Authenticated User
       ↓
Open Account / Settings
       ↓
Logout
       ↓
Clear Authentication State
       ↓
Redirect to Login
```

---

# 4. Dashboard Flow

The dashboard is the user's main entry point after authentication.

```text
Login
  ↓
Dashboard
  ↓
View Current Learning State
```

The dashboard may show:

* Active goals
* Goal progress
* Recent sessions
* Recent activity
* Learning time
* Streak
* Quick actions

### Quick actions

```text
Dashboard
   ├── Create Goal
   ├── Record Session
   ├── Create Journal Entry
   └── View Goals
```

The dashboard should allow the user to quickly continue an existing learning journey without requiring unnecessary navigation.

---

# 5. Goal Creation Flow

```text
Goals
  ↓
Create Goal
  ↓
Enter Goal Information
  ↓
Title
  ↓
Description
  ↓
Optional Dates
  ↓
Create
  ↓
Goal Created
  ↓
Goal Details
```

### Example

```text
Learn React
     ↓
Description:
"Build strong React fundamentals."
     ↓
Create
```

After creation, the user can begin defining the structure of the goal.

---

# 6. Goal Management Flow

```text
Goals
  ↓
Select Goal
  ↓
Goal Details
  ├── View Progress
  ├── Manage Milestones
  ├── Manage Tasks
  ├── View Sessions
  ├── View Journal Entries
  └── Edit Goal
```

The goal details page acts as the central workspace for an individual learning goal.

---

# 7. Milestone Creation Flow

```text
Goal Details
     ↓
Add Milestone
     ↓
Enter Milestone Name
     ↓
Optional Description
     ↓
Create
     ↓
Milestone Appears
     ↓
Add Tasks
```

### Milestone example

```text
Goal: Learn React

Milestone:
React Fundamentals

Tasks:
├── JSX
├── Components
├── Props
├── State
└── Events
```

---

# 8. Task Creation Flow

```text
Goal / Milestone
       ↓
Add Task
       ↓
Enter Task Information
       ↓
Assign to Milestone
       ↓
Create
       ↓
Task Appears
```

Tasks should represent concrete learning actions.

Examples:

* Learn JSX
* Build a counter with `useState`
* Read about React effects
* Build a small form

---

# 9. Task Completion Flow

```text
Goal Details
     ↓
View Task
     ↓
Start / Work on Task
     ↓
Complete Task
     ↓
Task Status → COMPLETED
     ↓
Recalculate Progress
     ↓
Update Goal / Milestone Progress
```

If a user completes a task accidentally or wants to revisit it:

```text
Completed Task
     ↓
Reopen
     ↓
Task Status → TODO / IN_PROGRESS
     ↓
Progress Updates
```

---

# 10. Learning Session Flow

A learning session represents actual time spent learning.

```text
Dashboard / Goal
       ↓
Record Session
       ↓
Select Goal
       ↓
Optional Milestone
       ↓
Enter Date
       ↓
Enter Duration
       ↓
Enter Topic
       ↓
Optional Description / Reflection
       ↓
Save
       ↓
Session Recorded
       ↓
Progress Updated
```

### Example

```text
Goal: Learn React
Milestone: Hooks
Duration: 90 minutes
Topic: useEffect
Reflection:
"Learned when effects run and how cleanup works."
```

The session becomes part of the user's learning history.

---

# 11. Journal Entry Flow

```text
Journal
  ↓
New Entry
  ↓
Enter Title
  ↓
Write Reflection
  ↓
Optional Goal
  ↓
Optional Milestone
  ↓
Optional Tags
  ↓
Save
  ↓
Journal Entry Created
```

### Example reflection

```text
Title:
What I finally understood about useEffect

Reflection:
"I was confusing effects with derived values.
Today I understood that effects are mainly for
synchronizing with external systems."
```

---

# 12. Journal Review Flow

```text
Journal
   ↓
Browse Entries
   ↓
Select Entry
   ↓
Read Reflection
   ↓
Edit / Delete
```

In future versions, users may also be able to search and filter their journal.

---

# 13. Progress Review Flow

```text
Dashboard / Navigation
       ↓
Progress
       ↓
View Overall Learning Activity
       ↓
Review:
├── Goal Progress
├── Task Completion
├── Learning Time
├── Sessions
├── Activity
└── Streak
```

The user should be able to move from a high-level overview into more detailed progress information.

---

# 14. Goal Progress Flow

```text
Progress
   ↓
Select Goal
   ↓
Goal Progress
   ↓
View
├── Completed Tasks
├── Remaining Tasks
├── Milestone Progress
├── Learning Sessions
└── Learning Time
```

Progress should provide context rather than only displaying a percentage.

For example:

```text
React
████████░░ 80%

8 / 10 Tasks Completed
6 Learning Sessions
7h 30m Learning Time
```

---

# 15. Continue Learning Flow

A major purpose of Mezgeb is helping users continue where they left off.

```text
Open Mezgeb
     ↓
Dashboard
     ↓
View Active Goal
     ↓
See Current Milestone
     ↓
See Remaining Tasks
     ↓
Choose Next Task
     ↓
Study
     ↓
Record Session
     ↓
Complete Task
     ↓
Reflect
     ↓
Return Later
```

The next time the user opens Mezgeb, their previous activity provides context for continuing the learning journey.

---

# 16. Settings Flow

```text
Settings
  ├── Profile
  │     ↓
  │   Edit Profile
  │
  ├── Appearance
  │     ↓
  │   Change Preferences
  │
  └── Account
        ↓
      Account Actions
```

Future settings may include:

* Notifications
* Learning preferences
* Data export
* Integrations

---

# 17. Error Flow

Errors should provide a clear recovery path.

### Form Error

```text
Submit
  ↓
Validation Error
  ↓
Display Error Near Field
  ↓
User Corrects Input
  ↓
Submit Again
```

### API Error

```text
Request
  ↓
Server Error
  ↓
Display User-Friendly Error
  ↓
Retry / Return
```

### Not Found

```text
Requested Resource
       ↓
Resource Not Found
       ↓
Not Found State
       ↓
Return to Relevant Section
```

---

# 18. Empty State Flow

Empty states should help users understand what to do next.

### No Goals

```text
Goals
  ↓
No Goals Yet
  ↓
Explain Purpose
  ↓
Create Your First Goal
```

### No Journal Entries

```text
Journal
  ↓
No Entries Yet
  ↓
Explain Journal
  ↓
Write Your First Reflection
```

### No Learning Sessions

```text
Sessions
  ↓
No Sessions Yet
  ↓
Explain Session Tracking
  ↓
Record First Session
```

Empty states should provide a meaningful next action rather than simply displaying "No data."

---

# 19. Navigation Flow

The main authenticated navigation is:

```text
Dashboard
   │
   ├── Goals
   │     └── Goal Details
   │           ├── Milestones
   │           ├── Tasks
   │           ├── Sessions
   │           └── Journal
   │
   ├── Journal
   │     └── Journal Entry
   │
   ├── Progress
   │
   └── Settings
```

Contextual actions should allow users to move naturally between related areas.

For example:

```text
Goal Details
     ↓
Record Session
     ↓
Session Saved
     ↓
Return to Goal
```

---

# 20. Core User Journey

The most important complete journey is:

```text
Register
   ↓
Create Goal
   ↓
Create Milestones
   ↓
Create Tasks
   ↓
Study
   ↓
Record Session
   ↓
Complete Tasks
   ↓
Write Reflection
   ↓
Review Progress
   ↓
Continue Learning
```

Every major feature should contribute to this journey.

---

# 21. Flow Design Principles

### Keep the primary path simple

Users should be able to complete common actions without unnecessary screens.

### Preserve context

When users perform an action related to a goal, Mezgeb should maintain that goal's context whenever possible.

### Make the next action clear

After important actions, the interface should provide a sensible next step.

### Support recovery

Users should be able to recover from validation errors, failed requests, accidental actions, and missing resources.

### Avoid unnecessary interruption

Recording learning activity should be quick enough that it does not become a burden.

### Keep learning at the center

Every major flow should reinforce the relationship between:

**Goal → Learning Activity → Reflection → Progress**
