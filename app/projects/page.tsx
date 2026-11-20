import Link from "next/link";

import ChromaticHaze from "@/components/chromatic-haze";
import { projects } from "@/lib/projects";

import styles from "./page.module.css";

export const metadata = {
  title: "Projects",
  description: "Everything built — games, tools, hardware, open source, and startup work.",
};

const featured = projects.slice(0, 6);
const rest = projects.slice(6);

function Rule({ n, label }: { n: string; label: string }) {
  return (
    <div className={styles.rule}>
      <span aria-hidden className={styles.ruleDash}>──</span>
      <span className={styles.ruleNum}>{n}</span>
      <span aria-hidden className={styles.ruleDash}>┤</span>
      <h2 className={styles.ruleLabel}>{label}</h2>
      <span aria-hidden className={styles.ruleDash}>├</span>
      <span aria-hidden className={styles.ruleLine} />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <main className={styles.page}>
      <ChromaticHaze />

      <header className={styles.nav}>
        <Link href="/" className={styles.navLogo}>
          <span aria-hidden>&lt;</span>adhyys<span aria-hidden>&gt;</span>
        </Link>
        <nav aria-label="Primary" className={styles.navLinks}>
          <Link href="/">home</Link>
          <Link href="/shipped">shipped</Link>
          <Link href="/blogs">writing</Link>
        </nav>
        <a href="mailto:me@adhyys.cc" className={styles.navCta}>$ contact</a>
      </header>

      <div className={styles.container}>
        <section className={styles.hero}>
          <p className={styles.tag}>
            <span aria-hidden>$</span> ls ~/projects
          </p>
          <h1 className={styles.title}>things i&apos;ve built</h1>
          <p className={styles.lead}>
            some of these are finished, most are not. the unfinished ones are usually the
            interesting ones. nearly every repo is public.
          </p>
        </section>

        <Rule n="01" label="the main ones" />
        <div className={styles.grid}>
          {featured.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              className={styles.card}
            >
              <span className={styles.cardHead}>
                <span className={styles.cardName}>{project.name}</span>
                <span className={styles.cardYear}>{project.year}</span>
              </span>
              <span className={styles.cardDesc}>{project.desc}</span>
              <span className={styles.cardTags}>
                <span className={styles.tagChip}>{project.type}</span>
                {project.tags?.slice(0, 3).map((tag) => (
                  <span key={tag} className={styles.tagChip}>{tag}</span>
                ))}
              </span>
            </a>
          ))}
        </div>

        {rest.length > 0 && (
          <>
            <Rule n="02" label="everything else" />
            <ul className={styles.list}>
              {rest.map((project) => (
                <li key={project.name} className={styles.listRow}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={styles.listName}
                  >
                    {project.name}
                  </a>
                  <span className={styles.listDesc}>{project.desc}</span>
                  <span className={styles.listMeta}>{project.year}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className={styles.outro}>
          <span aria-hidden className={styles.comment}>{"//"}</span> the rest lives on{" "}
          <a href="https://github.com/adhyys07" target="_blank" rel="noreferrer noopener">github</a>
        </p>
      </div>
    </main>
  );
}
