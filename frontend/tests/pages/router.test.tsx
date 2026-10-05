import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { appRoutes } from '../../src/app/router'

describe('application routes', () => {
  it('redirects the root route to the sign-in placeholder', async () => {
    const memoryRouter = createMemoryRouter(appRoutes, { initialEntries: ['/'] })

    render(<RouterProvider router={memoryRouter} />)

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('renders nested goal routes inside the application layout', () => {
    const memoryRouter = createMemoryRouter(appRoutes, {
      initialEntries: ['/app/goals/42/edit'],
    })

    render(<RouterProvider router={memoryRouter} />)

    expect(screen.getByRole('heading', { name: 'Edit goal' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
  })

  it('matches the static new-journal route before the entry parameter route', () => {
    const memoryRouter = createMemoryRouter(appRoutes, {
      initialEntries: ['/app/journal/new'],
    })

    render(<RouterProvider router={memoryRouter} />)

    expect(screen.getByRole('heading', { name: 'New journal entry' })).toBeInTheDocument()
  })
})
