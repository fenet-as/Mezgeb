import { Link, Outlet } from 'react-router-dom'
import styles from './AuthLayout.module.css'

export function AuthLayout() {
  return (
    <main className={styles.layout}>
      <Link className="appBrand" to="/">
        Mezgeb
      </Link>
      <Outlet />
    </main>
  )
}
