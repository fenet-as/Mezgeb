import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { EditGoalPage } from '../pages/goals/EditGoalPage'
import { GoalDetailsPage } from '../pages/goals/GoalDetailsPage'
import { GoalsPage } from '../pages/goals/GoalsPage'
import { JournalEntryPage } from '../pages/journal/JournalEntryPage'
import { JournalPage } from '../pages/journal/JournalPage'
import { NewJournalEntryPage } from '../pages/journal/NewJournalEntryPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProgressPage } from '../pages/progress/ProgressPage'
import { SettingsPage } from '../pages/settings/SettingsPage'

export const appRoutes: RouteObject[] = [
  { path: '/', element: <Navigate to="/login" replace /> },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'goals', element: <GoalsPage /> },
      { path: 'goals/:goalId', element: <GoalDetailsPage /> },
      { path: 'goals/:goalId/edit', element: <EditGoalPage /> },
      { path: 'journal', element: <JournalPage /> },
      { path: 'journal/new', element: <NewJournalEntryPage /> },
      { path: 'journal/:entryId', element: <JournalEntryPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]

export const router = createBrowserRouter(appRoutes)
