export type Project = {
  name: string;
  desc: string;
  type: string;
  year: string;
  url?: string;
  tags?: string[];
};

export const projects: Project[] = [
  {
    name: "TermoSlack",
    desc: "A terminal-based Slack client that lets you use Slack as yourself from the command line, with realtime messaging, channels, DMs, themes, uploads, and session persistence.",
    type: "JavaScript - CLI",
    year: "2025",
    url: "https://github.com/adhyys07/TermoSlack",
    tags: ["Slack", "Terminal", "Realtime"],
  },
  {
    name: "Pigeon",
    desc: "An autonomous drone concept using algorithms and computer vision to capture terrain, detect landing spots, and support emergency manual control.",
    type: "Robotics - CV",
    year: "2026",
    url: "https://github.com/adhyys07/Pigeon",
    tags: ["Drone", "Computer Vision", "AI"],
  },
  {
    name: "AlphaDesk",
    desc: "A Python terminal stock dashboard with global search, watchlists, live prices, alerts, charts, CSV export, comparison tools, news, notes, and themes.",
    type: "Python - Finance",
    year: "2025",
    url: "https://github.com/adhyys07/AlphaDesk",
    tags: ["Python", "Terminal UI", "Stocks"],
  },
  {
    name: "Enclopheus",
    desc: "A Slack bot for Enclosure YSWS that keeps participants updated on project status, fulfillment, grant links, channel access, and Airtable-driven workflow notifications.",
    type: "JavaScript - Automation",
    year: "2026",
    url: "https://github.com/adhyys07/Enclopheus",
    tags: ["Slack Bot", "Airtable", "Docker"],
  },
  {
    name: "The Carnival",
    desc: "A Next.js app for The Carnival YSWS, where builders create extensions for their tools and apply for grants to improve their development workflow.",
    type: "TypeScript - Web App",
    year: "2026",
    url: "https://the-carnival.hackclub.dev",
    tags: ["Next.js", "YSWS", "Cloudflare R2"],
  },
  {
    name: "Castle Hardcore",
    desc: "A challenging 2D castle platformer built in Godot, focused on tight controls, high difficulty, custom GDScript behavior, and Hack Club event play.",
    type: "GDScript - Game",
    year: "2025",
    url: "https://adhyys.itch.io/castle-hardcore",
    tags: ["Godot", "GDScript", "Itch.io"],
  },
];
