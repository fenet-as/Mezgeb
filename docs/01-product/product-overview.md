# Mezgeb — መዝገብ

> **Your learning, recorded.**

## 1. Product Overview

Mezgeb is a personal learning progress tracker designed to help learners organize what they are studying, track their progress, record learning sessions, and reflect on what they have learned.

Unlike a traditional todo application, Mezgeb focuses on the **learning journey**, not simply whether a task was completed.

A user can create a learning goal such as:

* React
* Data Structures & Algorithms
* System Design
* Java
* Machine Learning

They can then break that goal into milestones and tasks, record study sessions, write reflections, and monitor their overall progress over time.

---

## 2. Problem

Learning independently can become difficult to organize.

Learners often:

* Study multiple subjects simultaneously.
* Lose track of what they have already learned.
* Create tasks without understanding their larger learning goal.
* Forget what they learned during previous study sessions.
* Have difficulty seeing their progress over weeks or months.
* Use multiple disconnected tools for tasks, notes, journals, and progress tracking.

Most productivity tools focus on **task completion**.

Mezgeb focuses on:

> **What am I learning? How far have I progressed? What have I learned? And how has my learning developed over time?**

---

## 3. Target Users

The primary users are independent learners, particularly:

* University students
* Self-taught developers
* Programming students
* People learning technical skills
* Learners following structured courses or roadmaps
* People working toward long-term learning goals

The initial product is designed primarily for an individual user rather than teams or classrooms.

---

## 4. Core Concept

The fundamental structure of Mezgeb is:

```text
Learning Goal
      ↓
Milestones
      ↓
Tasks
      ↓
Learning Sessions
      ↓
Journal / Reflections
      ↓
Progress
```

### Example

```text
Goal: Learn React
│
├── Milestone: React Fundamentals
│   ├── JSX
│   ├── Components
│   ├── Props
│   └── State
│
├── Milestone: React Hooks
│   ├── useState
│   ├── useEffect
│   └── Custom Hooks
│
└── Milestone: Build a Project
    ├── Design UI
    ├── Build components
    └── Connect API
```

The learner can then record:

```text
Study Session
→ 2 hours
→ React Hooks
→ Learned useEffect cleanup
→ Practiced with a small example
```

And later write:

```text
Reflection
→ "I finally understand why effects need cleanup..."
```

---

## 5. Core Features

### 5.1 Learning Goals

Users can create and manage learning goals.

Each goal can contain:

* Title
* Description
* Category
* Start date
* Target date
* Status
* Progress
* Milestones
* Tasks

Example:

```text
React
Frontend Development
Started: September 2026
Target: December 2026
Progress: 42%
```

---

### 5.2 Milestones

Milestones divide a large learning goal into meaningful stages.

Example:

```text
React
│
├── Fundamentals        ✓
├── Hooks                70%
├── Routing              20%
├── State Management     0%
└── Project              0%
```

Milestones should represent meaningful learning stages rather than simply collections of random tasks.

---

### 5.3 Tasks

Users can create tasks inside milestones.

Tasks can be:

* Not started
* In progress
* Completed

Example:

```text
□ Learn useState
□ Learn useEffect
✓ Learn props
✓ Learn component composition
```

Tasks provide the actionable layer of the learning system.

---

### 5.4 Learning Sessions

Users can record individual study sessions.

A session may contain:

* Date
* Duration
* Goal
* Milestone
* Topic
* Description
* Optional reflection

Example:

```text
September 28

React Hooks
Duration: 1h 45m

Studied:
- useState
- useEffect
- dependency arrays

Reflection:
"I understand state better now, but effects
still need more practice."
```

---

### 5.5 Learning Journal

The journal allows users to record thoughts, discoveries, difficulties, and reflections.

Journal entries are not necessarily associated with a specific task.

They can capture things such as:

* What was learned
* What was difficult
* Important discoveries
* Questions
* Lessons from mistakes
* General reflections

The journal should feel more like a **learning log** than a traditional notes application.

---

### 5.6 Progress Tracking

Mezgeb should make learning progress visible.

The application can track:

* Goal completion
* Milestone completion
* Task completion
* Study time
* Study sessions
* Activity over time
* Learning streaks

The purpose is not to gamify everything, but to help users understand their learning history.

---

### 5.7 Dashboard

The dashboard provides a high-level view of the learner's current activity.

Potential sections:

```text
Good evening, Fenet.

Today's Progress
────────────────────────
Tasks completed       3
Study time            2h 15m
Current streak        6 days


Active Goals
────────────────────────
React                  62%
DSA                    35%
System Design          18%


Recent Activity
────────────────────────
Completed "useEffect"
Studied React Hooks
Added journal entry
Completed DSA session
```

The dashboard should answer:

> **"What is happening with my learning right now?"**

---

## 6. Core User Experience

The primary learning loop is:

```text
Create Goal
     ↓
Define Milestones
     ↓
Create Tasks
     ↓
Study
     ↓
Record Session
     ↓
Complete Tasks
     ↓
Reflect
     ↓
Review Progress
     ↓
Continue Learning
```

This loop is the core experience of Mezgeb.

---

## 7. Product Philosophy

### Learning over productivity

Mezgeb is not primarily a productivity application.

Its purpose is to help users understand and maintain their learning journey.

### Progress over perfection

Progress should be visible even when the learner does not study every day.

### Reflection over simple completion

Completing a task tells the system **what happened**.

A learning session or journal entry can capture **what was actually learned**.

### Simple first

The initial version should avoid unnecessary complexity.

Features should be introduced when they provide meaningful value to the learning experience.

---

## 8. What Makes Mezgeb Different from a Todo App?

A todo application answers:

> "What do I need to do?"

Mezgeb answers:

> "What am I learning, how am I progressing, and what have I learned?"

For example:

### Todo App

```text
□ Learn React
□ Learn Hooks
□ Build project
```

### Mezgeb

```text
GOAL
Learn React

MILESTONE
React Hooks — 60%

TASKS
✓ Learn useState
✓ Learn useEffect
□ Build custom hook

LEARNING
7 sessions
11h 30m studied

JOURNAL
"I finally understand why effects
run after rendering..."
```

The second model represents a **learning journey**, rather than a simple checklist.

---

## 9. Initial Application Areas

The initial application will contain:

```text
Dashboard
Goals
Goal Details
Tasks
Learning Sessions
Journal
Progress
Settings
```

The exact navigation and screen structure will be defined in the Information Architecture and User Flows documentation.

---

## 10. Initial Platform

The first version of Mezgeb will be a web application.

The initial focus is:

* Desktop-friendly experience
* Responsive interface
* Modern web application architecture
* Accessible UI
* Personal single-user learning workflow

Mobile-specific functionality can be considered later.

---

## 11. Future Possibilities

Potential future features include:

* Advanced analytics
* Progress charts
* Activity heatmaps
* Learning streaks
* Goal templates
* Learning roadmaps
* Reminders
* Calendar integration
* Search
* Tags
* Rich journal editor
* AI-assisted reflections
* AI learning summaries
* Personalized learning insights
* Import/export
* Social or community features

These features are **not part of the initial scope** unless explicitly added later.

---

## 12. Product Success

The initial version should successfully allow a learner to:

1. Create a learning goal.
2. Break the goal into milestones.
3. Create tasks.
4. Track task progress.
5. Record learning sessions.
6. Write journal entries.
7. View their learning progress.
8. Understand their recent learning activity.

If these workflows are clear and useful, the core product is working.

---

## 13. Product Principle

> **Mezgeb records the journey of learning, not just the completion of tasks.**
