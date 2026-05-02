"use client";

import { useEffect, useRef } from "react";

import styles from "./portfolio-index.module.css";

type Props = {
  fontClassName: string;
};

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
    tags: ["product", "fundraising", "growth", "hiring"],
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

const projects = [
  {
    name: "Voxcraft",
    desc: "voxel destruction sandbox in Godot with custom physics chunks - 40k downloads on itch.io",
    type: "Game · Indie",
    year: "2024",
  },
  {
    name: "Nexus Dashboard",
    desc: "real-time analytics SaaS for indie game studios. MRR hit $8k before acqui-hire",
    type: "SaaS · Startup",
    year: "2023",
  },
  {
    name: "bevy_netcode",
    desc: "open source deterministic netcode library for the Bevy game engine - 900+ GitHub stars",
    type: "Open Source",
    year: "2023",
  },
  {
    name: "Echoes of the Void",
    desc: "48h jam horror game in Unity. won 'best atmosphere' at Ludum Dare 54",
    type: "Game · Jam",
    year: "2023",
  },
  {
    name: "FoundersAtMidnight",
    desc: "newsletter for builder-types - no VC fluff, just raw notes from building in public",
    type: "Content",
    year: "ongoing",
  },
];

export default function PortfolioIndex({ fontClassName }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

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

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      hoverTargets.forEach((target) => {
        target.removeEventListener("mouseenter", onEnter);
        target.removeEventListener("mouseleave", onLeave);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <main ref={rootRef} className={`${styles.page} ${fontClassName}`}>
      <div data-cursor className={styles.cursor} />

      <nav className={styles.nav}>
        <div className={styles.navLogo}>.Adhyys</div>
        <ul className={styles.navLinks}>
          <li><a href="#skills">skills</a></li>
          <li><a href="#projects">projects</a></li>
          <li><a href="#startups">startups</a></li>
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
          a <strong>software engineer</strong> who ships games at midnight and pitches startups in the morning.
          i write code that runs in browsers, engines, and production servers simultaneously.
          obsessed with clean architecture, weird game mechanics, and <strong>building companies from scratch</strong>.
        </p>
        <div className={styles.heroChips}>
          <span className={`${styles.chip} ${styles.a}`}>Unity / Godot</span>
          <span className={`${styles.chip} ${styles.b}`}>TypeScript</span>
          <span className={`${styles.chip} ${styles.b}`}>React / Next.js</span>
          <span className={`${styles.chip} ${styles.c}`}>3x Founder</span>
          <span className={styles.chip}>open source</span>
          <span className={styles.chip}>game jams</span>
        </div>
        <div className={styles.scrollHint}>
          <div className={styles.scrollLine} />
          scroll to explore
        </div>
      </section>

      <hr className={styles.divider} />

      <section id="blog" className={styles.section}>
        <div className={styles.sectionLabel}>05 — blog</div>
        <p className={styles.contactLead}>
          Short essays, notes, and tutorials — thoughts on product, design, and engineering. Read the full collection.
        </p>
        <div>
          <a href="/writing" className={styles.contactCard} data-hover>
            <div className={styles.contactPlatform}>Writing</div>
            <div className={styles.contactHandle}>Visit the blog</div>
          </a>
        </div>
      </section>


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
            <div className={styles.tOut}>name: Dev Singh</div>
            <div className={styles.tOut}>location: building from a bedroom somewhere</div>
            <div className={styles.tOut}>current: working on a physics-based puzzle game + a B2B SaaS</div>
            <div className={styles.tOut}>previously: shipped 4 games, raised $600k, got acquired once</div>
            <div className={styles.tOut}>favourite lang: Rust (but TypeScript pays the bills)</div>
            <div className={styles.tOut}>vibe: chaotic good</div>
            <br />
            <div><span className={styles.tPrompt}>~/dev $</span> <span className={styles.tCmd}>cat now.txt</span></div>
            <div className={styles.tOut}>-&gt; shipping a game jam project every month in 2025</div>
            <div className={styles.tOut}>-&gt; writing a tiny ECS engine in Rust, just for fun</div>
            <div className={styles.tOut}>-&gt; growing foundersatmidnight.dev newsletter to 10k</div>
            <br />
            <div><span className={styles.tPrompt}>~/dev $</span> <span className={styles.tCursor} /></div>
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      <section id="projects" className={styles.section}>
        <div className={styles.sectionLabel}>02 - things i&apos;ve shipped</div>
        <div className={styles.projectsList}>
          {projects.map((project) => (
            <div key={project.name} className={styles.projectRow} data-hover data-reveal>
              <div>
                <div className={styles.projectName}>{project.name}</div>
                <div className={styles.projectDesc}>{project.desc}</div>
              </div>
              <div className={styles.projectMeta}>
                <div className={styles.projectType}>{project.type}</div>
                <div className={styles.projectYear}>{project.year}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className={styles.divider} />

      <section id="startups" className={styles.section}>
        <div className={styles.sectionLabel}>03 - the startup chapter</div>
        <div className={styles.startupBox} data-reveal>
          <div className={styles.startupHeadline}>
              i&apos;ve started things,<br />
              <em>broken things,</em><br />
              and shipped anyway.
            </div>
            <p className={styles.startupBody}>
              three startups over four years. one acqui-hired, one still running, one beautifully dead.
              i started <strong>Building Not Found</strong> and led its early fundraising efforts.
              i&apos;ve pitched in SF, built with co-founders across timezones, and learned that the best code in the world means nothing if nobody uses it.
            </p>
            <p className={styles.startupBody}>
              now i help other early-stage founders avoid the mistakes i made — and make some interesting new ones together.
            </p>
          <div className={styles.startupStats}>
            <div><div className={styles.statNum}>3x</div><div className={styles.statLabel}>founded</div></div>
            <div><div className={styles.statNum}>$600k</div><div className={styles.statLabel}>raised</div></div>
            <div><div className={styles.statNum}>1x</div><div className={styles.statLabel}>acquired</div></div>
            <div><div className={styles.statNum}>40k+</div><div className={styles.statLabel}>users built for</div></div>
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      <section id="blog" className={styles.section}>
        <div className={styles.sectionLabel}>05 - writing</div>
        <div className={styles.blogBox} data-reveal>
          <div className={styles.blogHeadline}>
            notes & essays
          </div>
          <p className={styles.blogBody}>
            i write about building products, shipping games, and learning in public.
            no marketing fluff—just raw thoughts on engineering, startups, and what I'm learning.
          </p>
          <a href="/writing" className={styles.blogLink}>
            read all posts →
          </a>
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
          <a href="mailto:adhdhyan@cucumbu.com" target="_blank" className={styles.contactCard} data-hover data-reveal><div className={styles.contactPlatform}>Email</div><div className={styles.contactHandle}>adhdhyan@cucumbu.com</div></a>
          <a href="https://adhyys.itch.io" target="_blank" className={styles.contactCard} data-hover data-reveal><div className={styles.contactPlatform}>Itch.io</div><div className={styles.contactHandle}>adhyys.itch.io</div></a>
          <a href="https://www.linkedin.com/in/adhdhyan/" target="_blank" className={styles.contactCard} data-hover data-reveal><div className={styles.contactPlatform}>LinkedIn</div><div className={styles.contactHandle}>/in/adhdhyan</div></a>
          <a href="#" className={styles.contactCard} data-hover data-reveal><div className={styles.contactPlatform}>Blogs</div><div className={styles.contactHandle}>foundersatmidnight.dev</div></a>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>made with caffeine and questionable life choices</span>
        <span><a href="#">source</a> · <a href="#">pgp</a> · <a href="#">rss</a></span>
      </footer>
    </main>
  );
}
