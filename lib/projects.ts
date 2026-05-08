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
    desc: "A terminal Slack client that lets you use Slack as yourself from the command line, with realtime messages, channels, DMs, uploads, custom themes, emojis, and persistent login.",
    type: "JavaScript - CLI",
    year: "2025",
    url: "https://github.com/adhyys07/TermoSlack",
    tags: ["Slack", "Terminal", "Realtime"],
  },
  {
    name: "Enclosure YSWS",
    desc: "A Hack Club YSWS where builders design enclosures and get them 3D-printed and shipped, with a TypeScript web app for submissions and program flow.",
    type: "TypeScript - Web App",
    year: "2026",
    url: "https://github.com/hackclub/enclosure",
    tags: ["Hack Club", "3D Printing", "YSWS"],
  },
  {
    name: "Cucumbu",
    desc: "An early-stage workspace AI assistant focused on turning meetings, follow-ups, and team context into useful actions without extra noise.",
    type: "AI - Startup",
    year: "2026",
    url: "https://cucumbu.com",
    tags: ["AI", "Productivity", "Workspace","Closed Source"],
  },
  {
    name: "Kronos",
    desc: "A split wireless gaming keyboard with RGB keys, powered by dual XIAO nRF52840 boards, with plans for custom firmware and companion software.",
    type: "Hardware - Keyboard",
    year: "2026",
    url: "https://github.com/adhyys07/kronos",
    tags: ["Keyboard", "Bluetooth", "Hardware"],
  },
  {
    name: "Slack Mail",
    desc: "A Slack bot that lets users connect Gmail or Outlook, view inbox messages, open emails, reply, search, send mail, handle attachments, and manage email without leaving Slack.",
    type: "JavaScript - Slack Bot",
    year: "2025",
    url: "https://github.com/adhyys07/Slack_Mail",
    tags: ["Slack", "Email", "Google"],
  },
  {
    name: "AlphaDesk",
    desc: "A Python terminal stock dashboard with global search, watchlists, live prices, alerts, ASCII charts, CSV export, comparisons, news, notes, and themes.",
    type: "Python - Finance",
    year: "2025",
    url: "https://github.com/adhyys07/AlphaDesk",
    tags: ["Python", "Stocks", "Terminal UI"],
  },
  {
    name: "Enclopheus",
    desc: "A Slack bot for Enclosure YSWS that keeps participants updated on submission status, fulfillment, grant links, Airtable records, channel access, and workflow notifications.",
    type: "JavaScript - Automation",
    year: "2026",
    url: "https://github.com/adhyys07/Enclopheus",
    tags: ["Slack Bot", "Airtable", "Docker"],
  },
  {
    name: "Carnival",
    desc: "A TypeScript web app for The Carnival YSWS, where builders create extensions for tools they use and apply for grants to improve their development workflow.",
    type: "TypeScript - Web App",
    year: "2026",
    url: "https://github.com/hackclub/the-carnival",
    tags: ["Next.js", "YSWS", "Cloudflare R2"],
  },
  {
    name: "Skinner",
    desc: "A Chrome extension for customizing HCB card themes with built-in overlays, animated gradients, retro effects, holographic styles, and custom uploaded images.",
    type: "JavaScript - Extension",
    year: "2026",
    url: "https://github.com/adhyys07/skinner",
    tags: ["Chrome Extension", "HCB", "Themes"],
  },
  {
    name: "Castle Hardcore",
    desc: "A difficult 2D castle platformer built in Godot for a Hack Club event, with tight side-scrolling mechanics, custom GDScript behavior, and an itch.io playable build.",
    type: "GDScript - Game",
    year: "2025",
    url: "https://adhyys.itch.io/castle-hardcore",
    tags: ["Godot", "GDScript", "Itch.io"],
  },
  {
    name: "DropIt",
    desc: "A P2P web based tool for quickly sharing files by dragging and dropping, built with TypeScript, React with a simple interface and automatic expiration.",
    type: "HTML - Web",
    year: "2025",
    url: "https://github.com/adhyys07/DropIT",
    tags: ["HTML", "Static Site", "Experiment"],
  },
  {
    name: "TEMU",
    desc: "A terminal VM manager built with Python and Textual for creating, starting, stopping, deleting, inspecting, and snapshotting VirtualBox or libvirt virtual machines.",
    type: "Python - TUI",
    year: "2025",
    url: "https://github.com/adhyys07/TEMU",
    tags: ["Python", "Textual", "Virtual Machines"],
  },
  {
    name: "Termino",
    desc: "A terminal casino game suite with authentication, session management, Airtable-backed users and coins, and games like blackjack, roulette, slots, minesweeper, and plinko.",
    type: "HTML - Game",
    year: "2025",
    url: "https://github.com/adhyys07/Termino",
    tags: ["Terminal", "Games", "Airtable"],
  },
  {
    name: "Mp3Pod",
    desc: "A pocket-sized DIY MP3 player concept built around Arduino, DFPlayer, SD storage, OLED controls, FM radio, audio output, battery power, USB-C charging, and a 3D-printed case.",
    type: "C++ - Hardware",
    year: "2025",
    url: "https://github.com/adhyys07/Mp3Pod",
    tags: ["Arduino", "Audio", "Hardware"],
  },
  {
    name: "ShoutLang",
    desc: "A playful beginner-friendly programming language inspired by shouting, with a custom interpreter, arithmetic, variables, modes, comments, and a browser playground.",
    type: "Python - Language",
    year: "2025",
    url: "https://github.com/adhyys07/ShoutLang",
    tags: ["Interpreter", "Programming Language", "Playground"],
  },
  {
    name: "PaperCut!",
    desc: "A wonky game based in paper world where our pencil character fight Paper Monsters and solve puzzles, built in Godot with GDScript.",
    type: "Project - Draft",
    year: "2026",
    url: "https://github.com/adhyys07/d",
    tags: ["Draft", "GitHub", "Project"],
  },
];
