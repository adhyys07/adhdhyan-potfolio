import { projects } from "@/lib/projects";
import styles from "./page.module.css";

export const metadata = {
  title: "Shipped Projects",
  description: "A dedicated page for projects and products that have launched.",
};

export default function ShippedPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.label}>02 - things i've shipped</p>
            <h1 className={styles.title}>Launched work, products, and experiments.</h1>
          </div>
          <p className={styles.lead}>
            This page collects the things that have shipped — games, open source tools, startup products, and writing projects that made it into the world.
            If you want the current work, head back home to see what i'm building now.
          </p>
        </header>

        <section className={styles.projectGrid}>
          {projects.map((project) => (
            <article key={project.name} className={styles.projectCard}>
              <div className={styles.projectHeading}>
                <div className={styles.projectName}>{project.name}</div>
                <div className={styles.projectType}>{project.type}</div>
              </div>
              <p className={styles.projectDesc}>{project.desc}</p>
              <div className={styles.projectMeta}>
                <span className={styles.projectYear}>{project.year}</span>
              </div>
            </article>
          ))}
        </section>

        <a href="/" className={styles.backLink}>
          ← Back to portfolio
        </a>
      </div>
    </main>
  );
}
