import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.description}>The address does not match a Mezgeb route.</p>
      <Link to="/">Return to the start</Link>
    </main>
  )
}
