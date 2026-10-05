# Mezgeb — Project Scope

## 1. Purpose

This document defines what is included in the initial Mezgeb application, what is intentionally deferred, and what is outside the project's current direction.

The purpose of defining scope is to keep the project focused while leaving room for future expansion.

---

# 2. Project Vision

Mezgeb is a personal learning tracker that helps users:

* Define what they want to learn.
* Break learning goals into manageable milestones.
* Track tasks.
* Record learning sessions.
* Reflect through a learning journal.
* Understand their progress over time.

The initial version should focus on making this core learning loop useful and easy to understand.

---

# 3. MVP Scope

The MVP is the first complete version of Mezgeb that supports the core learning workflow.

The MVP includes:

```text
Authentication
      ↓
Dashboard
      ↓
Learning Goals
      ↓
Milestones
      ↓
Tasks
      ↓
Learning Sessions
      ↓
Journal
      ↓
Progress
```

---

# 4. In Scope

## 4.1 Authentication

The application will support:

* User registration
* Login
* Logout
* Session management
* Basic profile information

Authentication is primarily relevant once the backend is implemented.

---

## 4.2 Dashboard

The dashboard will provide a summary of the user's current learning activity.

It will include information such as:

* Active goals
* Goal progress
* Recent activity
* Recent learning sessions
* Recently completed tasks
* Study time
* Learning streak

The dashboard should remain focused on useful information rather than becoming a page containing every available metric.

---

## 4.3 Learning Goals

Users will be able to:

* Create goals
* View goals
* Edit goals
* Delete/archive goals
* Change goal status
* View goal progress

Example:

```text
Learn React
──────────────
Status: Active
Progress: 58%
Target: December 2026
```

---

## 4.4 Milestones

Users will be able to organize goals into milestones.

Example:

```text
React
│
├── Fundamentals
├── Hooks
├── Routing
├── State Management
└── Project
```

Milestones will support:

* Creation
* Editing
* Deletion
* Ordering
* Progress tracking

---

## 4.5 Tasks

Tasks provide the smallest actionable unit of a learning goal.

Users will be able to:

* Create tasks
* Edit tasks
* Delete tasks
* Complete tasks
* Reopen tasks
* Change task status

Tasks will belong to milestones.

---

## 4.6 Learning Sessions

Users will be able to record individual study sessions.

A session can contain:

* Date
* Duration
* Goal
* Milestone
* Topic
* Description
* Reflection

The application will use sessions to calculate learning activity and study time.

---

## 4.7 Learning Journal

Users will be able to create personal learning reflections.

Journal entries will support:

* Title
* Content
* Date
* Optional goal
* Optional milestone
* Tags

The journal is intended for reflection and learning documentation rather than task management.

---

## 4.8 Progress

The MVP will provide basic progress information.

Examples:

* Goal completion percentage
* Milestone progress
* Completed tasks
* Total study time
* Number of learning sessions
* Activity over time
* Current streak

Advanced analytics are outside the initial scope.

---

## 4.9 Activity

The MVP will maintain basic learning activity.

Examples:

```text
Completed "Learn useEffect"
Recorded a 90-minute React session
Created "React Hooks" milestone
Added a journal entry
Completed "React Fundamentals"
```

Recent activity can appear on the dashboard.

---

## 4.10 Responsive UI

The application will support:

* Desktop
* Laptop
* Tablet
* Mobile

The primary development and design focus may initially be desktop.

---

# 5. Frontend Scope

The frontend will initially include the following application areas:

```text
/auth
    /login
    /register

/dashboard

/goals
/goals/:goalId

/journal
/journal/:entryId

/progress

/settings
```

The exact routes will be finalized in the frontend routing documentation.

---

## 5.1 Core Frontend Components

The application will eventually require reusable components such as:

```text
Layout
Navigation
Sidebar
Header
Button
Input
Modal
Dialog
Form
Card
ProgressBar
StatusBadge
TaskItem
GoalCard
MilestoneItem
SessionCard
JournalEntryCard
EmptyState
LoadingState
ErrorState
```

The exact component hierarchy will be defined later.

---

# 6. Backend Scope

The backend will provide:

* Authentication
* User management
* Goal management
* Milestone management
* Task management
* Learning session management
* Journal management
* Progress-related data
* Activity data

The backend will expose a REST API consumed by the React frontend.

The exact API contract will be defined separately.

---

# 7. Data Scope

The initial application will manage two primary categories of data.

### Structured learning data

```text
User
Goal
Milestone
Task
Learning Session
```

### Reflection-oriented data

```text
Journal Entry
```

The initial architecture will use PostgreSQL for structured relational data and MongoDB for document-oriented journal data.

The final data model and justification will be documented separately.

---

# 8. Deferred Features

These features are intentionally **not part of the first implementation**.

They may be introduced after the MVP.

## P1 — Near-Future

```text
Search
Filtering
Advanced charts
Tags across the application
Detailed activity history
Goal templates
Learning roadmaps
More profile customization
```

## P2 — Future

```text
AI-assisted reflections
AI learning summaries
AI learning recommendations
Reminders
Calendar integration
Notifications
Import/export
```

---

# 9. Social Features

Social functionality is not part of the initial product.

The MVP will not include:

* Public profiles
* Following users
* Followers
* Likes
* Comments
* Public journals
* Communities
* Messaging
* Social feeds
* Leaderboards

The core experience remains personal.

---

# 10. Gamification Scope

Mezgeb may use lightweight progress indicators, but gamification will not be a primary product feature.

The MVP will avoid:

* Points systems
* XP
* Complex badges
* Competitive rankings
* Achievement systems
* Reward economies

Simple concepts such as **progress percentages and streaks** may be used because they directly communicate learning activity.

---

# 11. AI Scope

AI is intentionally excluded from the core MVP.

Future AI functionality may include:

```text
Journal summarization
Learning summaries
Reflection suggestions
Goal breakdown suggestions
Learning recommendations
Progress insights
```

AI should only be introduced when it provides meaningful value to the learning workflow.

---

# 12. Integrations

The MVP will not depend on external integrations.

The following are deferred:

* Google Calendar
* Notion
* GitHub
* Google Drive
* Discord
* Slack
* External learning platforms

---

# 13. Mobile Application

A native mobile application is outside the initial scope.

The first version will be a responsive web application.

A mobile application may be considered later if the web product demonstrates a need for it.

---

# 14. Deployment Scope

The application should eventually support:

```text
Frontend
    ↓
Production hosting

Backend
    ↓
Production server

Database
    ↓
Managed database
```

Development should also support local execution.

Docker and CI/CD may be introduced during development, but they should not block initial React learning.

---

# 15. Explicitly Out of Scope

The following are not part of Mezgeb's current product direction:

* General-purpose project management
* Team project management
* Enterprise task management
* Full note-taking platform
* Full calendar application
* Social media platform
* Online course platform
* Learning marketplace
* Real-time collaboration
* Native mobile application
* Complex AI assistant
* Cryptocurrency/Web3 functionality

Mezgeb should remain centered on:

> **Personal learning progress and reflection.**

---

# 16. Scope Rules

New features should be evaluated using these questions:

### Question 1

Does this directly support the user's learning journey?

### Question 2

Does it solve a real problem for the target user?

### Question 3

Does it improve the core learning loop?

```text
Goal
→ Milestone
→ Task
→ Study
→ Record
→ Reflect
→ Progress
```

### Question 4

Can the feature wait until after the MVP?

If the answer is yes, the feature should normally be deferred.

---

# 17. MVP Completion Criteria

The MVP is considered functionally complete when a user can perform the following journey:

```text
1. Create an account
        ↓
2. Create a learning goal
        ↓
3. Create milestones
        ↓
4. Add tasks
        ↓
5. Complete tasks while learning
        ↓
6. Record learning sessions
        ↓
7. Write reflections
        ↓
8. View progress
        ↓
9. Review recent learning activity
```

If this complete loop works reliably, the core Mezgeb experience has been implemented.

---

# 18. Scope Principle

> **Build the smallest complete learning tracker first. Expand only after the core learning loop works well.**
