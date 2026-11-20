import { projects } from "@/lib/projects";
import Link from "next/link";
import styles from "./page.module.css";
import ChromaticHaze from "@/components/chromatic-haze";

export const metadata = {
  title: "Shipped Projects",
  description: "A dedicated page for projects and products that have launched.",
};

export default function ShippedPage() {
  return (
    <main className={styles.page}>
      <ChromaticHaze />
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <div className={styles.rule}>
              <span aria-hidden className={styles.ruleDash}>──</span>
              <span className={styles.ruleNum}>02</span>
              <span aria-hidden className={styles.ruleDash}>┤</span>
              <h2 className={styles.ruleLabel}>things i&apos;ve shipped</h2>
              <span aria-hidden className={styles.ruleDash}>├</span>
              <span aria-hidden className={styles.ruleLine} />
            </div>
            <h1 className={styles.title}>Launched work, products, and experiments.</h1>
          </div>
          <p className={styles.lead}>
            This page collects the things that have shipped - games, open source tools, startup products, and writing projects that made it into the world.
            If you want the current work, head back home to see what i&apos;m building now.
          </p>
        </header>

        <section className={styles.projectGrid}>
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              className={styles.projectCard}
            >
              <div className={styles.projectHeading}>
                <div className={styles.projectName}>{project.name}</div>
                <div className={styles.projectType}>{project.type}</div>
              </div>
              <p className={styles.projectDesc}>{project.desc}</p>
              <div className={styles.projectMeta}>
                <span className={styles.projectYear}>{project.year}</span>
              </div>
            </a>
          ))}
        </section>

        <Link href="/" className={styles.backLink}>
          Back to portfolio
        </Link>
      </div>
    </main>
  );
}
