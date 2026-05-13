"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { projects } from "@/lib/projects";

import styles from "./portfolio-index.module.css";

type Props = {
  fontClassName: string;
};

const featuredProjects = projects.slice(0, 5);

const skills = [
  {
    icon: "⬡",
    name: "Game Development",
    desc: "from systems design to graphics pipelines. shipped indie games, engine plugins, and multiplayer backends. ECS is life.",
    tags: ["Unity", "Godot", "GDScript"],
    tone: styles.green,
  },
  {
    icon: "◈",
    name: "Full-Stack Engineering",
    desc: "i build products end-to-end. frontends that feel fast, backends that scale, databases that do not catch fire at 3am.",
    tags: ["TypeScript", "Next.js", "Rust", "Postgres", "Redis"],
    tone: styles.blue,
  },
  {
    icon: "◎",
    name: "Startup Building",
    desc: "not just code - i have done the full loop. idea, mvp, fundraising, launch, growth. failed fast, learned faster.",
    tags: ["product", "fundraising", "growth"],
    tone: styles.pink,
  },
  {
    icon: "⚙",
    name: "Systems & Infra",
    desc: "devops when it is needed, linux when it is fun. managed clusters, written custom allocators, debugged race conditions at 2am.",
    tags: ["Docker", "K8s", "Linux", "Terraform"],
    tone: styles.red,
  },
];

export default function PortfolioIndex({ fontClassName }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    root.classList.remove(styles.noJs);
    root.classList.add(styles.jsReady);

    const cursor = root.querySelector<HTMLElement>("[data-cursor]");
    if (!cursor) return;

    const moveCursor = (event: MouseEvent) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    };

    const hoverTargets = root.querySelectorAll<HTMLElement>("a, [data-hover]");
    const onEnter = () => cursor.classList.add(styles.big);
    const onLeave = () => cursor.classList.remove(styles.big);

    hoverTargets.forEach((target) => {
      target.addEventListener("mouseenter", onEnter);
      target.addEventListener("mouseleave", onLeave);
    });

    document.addEventListener("mousemove", moveCursor);

    const revealTargets = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    revealTargets.forEach((node) => observer.observe(node));

    // Smooth scrolling for nav links
    const handleNavClick = (e: Event) => {
      e.preventDefault();
      const link = e.target as HTMLAnchorElement;
      const targetId = link.getAttribute("href")?.substring(1);
      const targetElement = document.getElementById(targetId || "");
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    };

    const navLinks = root.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]');
    navLinks.forEach((link) => {
      link.addEventListener("click", handleNavClick);
    });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      hoverTargets.forEach((target) => {
        target.removeEventListener("mouseenter", onEnter);
        target.removeEventListener("mouseleave", onLeave);
      });
      observer.disconnect();
      navLinks.forEach((link) => {
        link.removeEventListener("click", handleNavClick);
      });
    };
  }, []);

  return (
    <main ref={rootRef} className={`${styles.page} ${fontClassName} ${styles.noJs}`}>
      <div data-cursor className={styles.cursor} />

      <nav className={styles.nav}>
        <div className={styles.navLogo}>.Adhyys</div>
        <ul className={styles.navLinks}>
          <li><a href="#skills">skills</a></li>
          <li><a href="#projects">projects</a></li>
          <li><a href="/shipped">shipped</a></li>
          <li><a href="#startups">startups</a></li>
          <li><a href="#blog">blog</a></li>
          <li><a href="#contact">contact</a></li>
        </ul>
        <div className={styles.navStatus}>
          <span className={styles.statusDot} />
          open to collabs
        </div>
      </nav>

      <section className={`${styles.section} ${styles.hero}`}>
        <div className={styles.heroTag}>{"// full-stack · game dev · founder"}</div>
        <h1 className={styles.heroGreeting}>
          heyo,<br />
          i&apos;m <em>Adhdhyan</em><br />
          <span>i build things.</span>
        </h1>
        <p className={styles.heroBio}>
          a <strong>developer</strong> who ships games at midnight and pitches startups in the morning.
          i write code that runs in browsers, engines, and production servers simultaneously.
          obsessed with clean architecture, weird game mechanics, and <strong>building startup from scratch</strong>.
        </p>
        <div className={styles.heroChips}>
          <span className={`${styles.chip} ${styles.a}`}>Unity / Godot</span>
          <span className={`${styles.chip} ${styles.b}`}>TypeScript</span>
          <span className={`${styles.chip} ${styles.b}`}>React / Next.js</span>
          <span className={`${styles.chip} ${styles.c}`}>open source</span>
          <span className={`${styles.chip} ${styles.c}`}>game jams</span>
          <span className={styles.chip}>Building Cucumbu</span>
        </div>
        <div className={styles.scrollHint}>
          <div className={styles.scrollLine} />
          scroll to explore
        </div>
      </section>

      <hr className={styles.divider} />


      <section id="skills" className={styles.section}>
        <div className={styles.sectionLabel}>01 - what i do</div>
        <div className={styles.skillsGrid}>
          {skills.map((skill) => (
            <div key={skill.name} className={`${styles.skillCard} ${skill.tone}`} data-hover data-reveal>
              <span className={styles.skillIcon}>{skill.icon}</span>
              <div className={styles.skillName}>{skill.name}</div>
              <div className={styles.skillDesc}>{skill.desc}</div>
              <div className={styles.skillTags}>
                {skill.tags.map((tag) => (
                  <span key={tag} className={styles.skillTag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className={styles.divider} />

      <section className={styles.terminalSection}>
        <div className={styles.terminal} data-reveal>
          <div className={styles.terminalBar}>
            <span className={styles.tDotRed} />
            <span className={styles.tDotYellow} />
            <span className={styles.tDotGreen} />
            <span className={styles.tTitle}>~/portfolio - zsh</span>
          </div>
          <div className={styles.terminalBody}>
            <div><span className={styles.tPrompt}>~/dev $</span> <span className={styles.tCmd}>cat about.txt</span></div>
            <div className={styles.tOut}>name: Adhdhyan</div>
            <div className={styles.tOut}>location: building from a bedroom somewhere</div>
            <div className={styles.tOut}>current: working on a physics-based puzzle game + a B2B SaaS</div>
            <div className={styles.tOut}>previously: shipped 3 games, started a <u><a href="https://ysws.hackclub.com" target="_blank">You Ship,We Ship</a></u>,organized a game jam</div>
            <div className={styles.tOut}>favourite lang: Python (but TypeScript pays the bills)</div>
            <div className={styles.tOut}>vibe: chaotic good</div>
            <br />
            <div><span className={styles.tPrompt}>~/dev $</span> <span className={styles.tCmd}>cat now.txt</span></div>
            <div className={styles.tOut}>-&gt; volunteering and shipping projects at Hack Club</div>
            <div className={styles.tOut}>-&gt; working on a custom firmware and OS for a dedicated game console</div>
            <div className={styles.tOut}>-&gt; building Cucumbu, an AI based startup from scratch </div>
            <br />
            <div><span className={styles.tPrompt}>~/dev $</span> <span className={styles.tCursor} /></div>
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      <section id="projects" className={styles.section}>
        <div className={styles.sectionLabel}>02 - things i&apos;ve shipped</div>
        <p className={styles.sectionIntro} data-reveal>
          a short list of the products and projects that made it into the world — games, tools, open source, and publisher-ready experiments.
        </p>
        <div className={styles.projectsList}>
          {featuredProjects.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              className={styles.projectRow}
              data-hover
              data-reveal
            >
              <div>
                <div className={styles.projectName}>{project.name}</div>
                <div className={styles.projectDesc}>{project.desc}</div>
              </div>
              <div className={styles.projectMeta}>
                <div className={styles.projectType}>{project.type}</div>
                <div className={styles.projectYear}>{project.year}</div>
              </div>
            </a>
          ))}
        </div>
        <div className={styles.projectActions}>
          <a href="/shipped" className={styles.projectAction}>
            View all shipped projects →
          </a>
        </div>
      </section>

      <hr className={styles.divider} />

      <section id="startups" className={styles.section}>
        <div className={styles.sectionLabel}>03 - the startup chapter</div>
        <div className={styles.startupBox} data-reveal>
          <div className={styles.startupHeadline}>
            one startup in motion,<br />
            <em>still in R&amp;D and prototype mode,</em><br />
            still figuring out the right launch.
          </div>
          <p className={styles.startupBody}>
            today i&apos;m focused on one thing: <a href="https://cucumbu.com" target="_blank" rel="noreferrer noopener" className={styles.startupLink}>cucumbu.com</a>.
            it&apos;s an early-stage workspace AI assistant that helps teams automate meeting follow ups, summarize context, and turn conversations into action without the noise.
          </p>
          <p className={styles.startupBody}>
            right now it&apos;s in research and prototyping — bootstrapped, unfunded, and being tested around workflow loops.
            the goal is to ship something that actually saves time, not just another productivity promise.
          </p>
          
          <div className={styles.startupStats}>
            <div><div className={styles.statNum}>1x</div><div className={styles.statLabel}>startup in focus</div></div>
            <div><div className={styles.statNum}>bootstrapped</div><div className={styles.statLabel}>status</div></div>
            <div><div className={styles.statNum}>R&amp;D</div><div className={styles.statLabel}>phase</div></div>
            <div><div className={styles.statNum}>early</div><div className={styles.statLabel}>prototype</div></div>
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      <section id="blog" className={styles.section}>
        <div className={styles.sectionLabel}>05 - Blogs</div>
        <div className={styles.blogBox} data-reveal>
          <div className={styles.blogHeadline}>
            Blogs
          </div>
          <p className={styles.blogBody}>
            I write about,my current projects, my thoughts for currently trending topics and learning in public.
          </p>
          <Link href="/blogs" className={styles.blogLink}>
            read all posts →
          </Link>
        </div>
      </section>

      <hr className={styles.divider} />

      <section id="contact" className={styles.section}>
        <div className={styles.sectionLabel}>04 - find me</div>
        <p className={styles.contactLead}>
          always down to talk games, startups, or whatever weird side project you are building at midnight. shoot me a message anywhere below.
        </p>
        <div className={styles.contactGrid}>
          <a href="https://github.com/adhyys07" target="_blank" className={styles.contactCard} data-hover data-reveal><div className={styles.contactPlatform}>GitHub</div><div className={styles.contactHandle}>@adhyys07</div></a>
          <a href="https://x.com/AdhdhyanJ" target="_blank" className={styles.contactCard} data-hover data-reveal><div className={styles.contactPlatform}>Twitter / X</div><div className={styles.contactHandle}>@AdhdhyanJ</div></a>
          <a href="mailto:me@adhyys.cc" target="_blank" className={styles.contactCard} data-hover data-reveal><div className={styles.contactPlatform}>Email</div><div className={styles.contactHandle}>me@adhyys.cc</div></a>
          <a href="https://adhyys.itch.io" target="_blank" className={styles.contactCard} data-hover data-reveal><div className={styles.contactPlatform}>Itch.io</div><div className={styles.contactHandle}>adhyys.itch.io</div></a>
          <a href="https://www.linkedin.com/in/adhdhyan/" target="_blank" className={styles.contactCard} data-hover data-reveal><div className={styles.contactPlatform}>LinkedIn</div><div className={styles.contactHandle}>/in/adhdhyan</div></a>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>made with caffeine and questionable life choices</span>
        <span><a href="https://github.com/adhyys07/adhdhyan-potfolio">source</a> · <a href="/pgp">pgp</a> · <a href="/rss.xml">rss</a></span>
      </footer>
    </main>
  );
}
