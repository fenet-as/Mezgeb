import { Link, NavLink, Outlet } from 'react-router-dom'
import styles from './AppLayout.module.css'

const navigationItems = [
  { label: 'Dashboard', to: '/app/dashboard' },
  { label: 'Goals', to: '/app/goals' },
  { label: 'Journal', to: '/app/journal' },
  { label: 'Progress', to: '/app/progress' },
  { label: 'Settings', to: '/app/settings' },
]

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link className="appBrand" to="/app/dashboard">
          Mezgeb
        </Link>
      </header>
      <div className={styles.body}>
        <nav aria-label="Primary" className={styles.navigation}>
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? `${styles.navigationLink} ${styles.active}`
                  : styles.navigationLink
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
