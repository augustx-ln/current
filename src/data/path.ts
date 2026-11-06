type StopBase = {
  id: string;
  title: string;
  detail: string;
  check: string;
};

export type PathStop =
  | (StopBase & { to: "/phases/$slug"; slug: string })
  | (StopBase & { to: "/tools/$slug"; slug: string })
  | (StopBase & { to: "/read" })
  | (StopBase & { to: "/desk" });

export const pathStops: PathStop[] = [
  {
    id: "scope",
    title: "Scope",
    detail: "The fixture is 10.13.37.0/24. Say what is out of scope.",
    to: "/phases/$slug",
    slug: "rules-of-engagement",
    check: "rules-of-engagement",
  },
  {
    id: "recon",
    title: "Recon",
    detail: "One open port on 10.13.37.20, and why filtered is not closed.",
    to: "/phases/$slug",
    slug: "lab-network",
    check: "lab-network",
  },
  {
    id: "web",
    title: "Web",
    detail: "WhatWeb’s banner is a label. Cite one line.",
    to: "/tools/$slug",
    slug: "whatweb",
    check: "whatweb",
  },
  {
    id: "read",
    title: "Read",
    detail: "Pick the line you will cite: a port, a header, or a date.",
    to: "/read",
    check: "report-read",
  },
  {
    id: "write",
    title: "Write",
    detail: "Add the fix, then export current-findings.md.",
    to: "/desk",
    check: "report-write",
  },
];

export function stopState(passed: string[], index: number): "done" | "now" | "later" {
  const open = pathStops.slice(0, index).every((stop) => passed.includes(stop.check));
  if (!open) return "later";
  return passed.includes(pathStops[index].check) ? "done" : "now";
}
