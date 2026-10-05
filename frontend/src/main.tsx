import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { env } from './config/env'
import './styles/globals.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element was not found.')
}

document.title = env.appName

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
