export const pathStops = [
  {
    id: "recon",
    title: "Recon",
    detail: "Four fixture hosts. A scan that leaves the subnet is refused.",
    to: "/phases/$slug" as const,
    slug: "lab-network",
    kind: "phases" as const,
  },
  {
    id: "web",
    title: "Web enumeration",
    detail: "Banners and paths are labels. The pages are scripted.",
    to: "/tools/$slug" as const,
    slug: "whatweb",
    kind: "tools" as const,
  },
  {
    id: "exploit",
    title: "Exploitation literacy",
    detail: "The word, without a module you can run.",
    to: "/phases/$slug" as const,
    slug: "what-an-exploit-is",
    kind: "phases" as const,
  },
  {
    id: "defense",
    title: "Defense",
    detail: "What broke, who fixes it, and what you closed.",
    to: "/phases/$slug" as const,
    slug: "reporting",
    kind: "phases" as const,
  },
];
