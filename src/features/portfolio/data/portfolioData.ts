export const PAGES = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
] as const;

export const DISCORD_USER_ID = "626285227630788639";

export const DISCORD_FALLBACK = {
  username: "adayilmaz",
  displayName: "Ada Yılmaz",
  avatarInitials: "AY",
  status: "online",
  customStatus: "Orbiting new interface ideas",
  activity: "offline",
  detail: "",
  guildTag: "DEVS",
  platforms: { desktop: true, mobile: false, web: false },
} as const;

export const DISCORD_STATUS_LABEL = {
  online: "ONLINE",
  idle: "IDLE",
  dnd: "DO NOT DISTURB",
  offline: "OFFLINE",
} as const;

export const SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "WebGL",
  "Figma",
  "Next.js",
  "GraphQL",
  "Three.js",
  "Swift",
  "PostgreSQL",
];

export const SKILL_NOTES: Record<string, string> = {
  React: "Fast, responsive interfaces built from reusable components.",
  TypeScript: "Safer code with fewer unexpected bugs.",
  "Node.js": "APIs, bots, backend services, and automation.",
  WebGL: "3D scenes, shaders, and experimental web visuals.",
  Figma: "Wireframes, UI systems, and quick prototypes.",
  "Next.js": "Fast, production-ready websites with solid SEO.",
  GraphQL: "Clean data flows and flexible queries.",
  "Three.js": "3D scenes and motion in the browser.",
  Swift: "Quick experiments and prototypes for mobile.",
  PostgreSQL: "Persistent data for dashboards and backend systems.",
};

export const SOCIAL_ITEMS = [
  { key: "github", label: "GitHub", href: "https://github.com/krakenari" },
  { key: "linkedin", label: "LinkedIn", href: "#" },
  { key: "x", label: "X", href: "#" },
  { key: "mail", label: "Email", href: "mailto:krakenari@onionmail.org" },
] as const;

export const PROJECTS = [
  {
    id: "portfolio-space",
    title: "Space Portfolio",
    tag: "Web / Frontend",
    status: "in active development",
    metric: "3D card feel",
    description:
      "A monochrome space-inspired portfolio with draggable floating cards and live Discord presence.",
    stack: ["React", "TypeScript", "CSS", "Vite"],
  },
] as const;

export type ProjectItem = (typeof PROJECTS)[number];
