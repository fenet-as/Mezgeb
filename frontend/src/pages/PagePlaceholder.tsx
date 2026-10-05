import styles from './PagePlaceholder.module.css'

interface PagePlaceholderProps {
  title: string
}

export function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <section aria-labelledby="page-title" className={styles.section}>
      <p className={styles.eyebrow}>Mezgeb foundation</p>
      <h1 className={styles.title} id="page-title">
        {title}
      </h1>
      <p className={styles.description}>
        This route is ready for its planned screen. No product behavior is implemented
        yet.
      </p>
    </section>
  )
}
