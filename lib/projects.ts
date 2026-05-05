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
    name: "Voxcraft",
    desc: "A voxel destruction sandbox built in Godot with custom physics chunks — 40k downloads on itch.io.",
    type: "Game · Indie",
    year: "2024",
  },
  {
    name: "Nexus Dashboard",
    desc: "Real-time analytics for indie game studios. MRR hit $8k before acqui-hire.",
    type: "SaaS · Startup",
    year: "2023",
  },
  {
    name: "bevy_netcode",
    desc: "Open source deterministic netcode library for Bevy, with 900+ GitHub stars.",
    type: "Open Source",
    year: "2023",
  },
  {
    name: "Echoes of the Void",
    desc: "48h jam horror game in Unity — won best atmosphere at Ludum Dare 54.",
    type: "Game · Jam",
    year: "2023",
  },
  {
    name: "FoundersAtMidnight",
    desc: "A newsletter for builder-types — no VC fluff, just raw notes from building in public.",
    type: "Content",
    year: "ongoing",
  },
];
