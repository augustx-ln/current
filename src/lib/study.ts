import { cleanDesk, saveDesk, type DeskPayload, type Finding } from "@/lib/desk.functions";

export type StudyKind = "tools" | "articles" | "phases";

export type Desk = DeskPayload;

const KEY = "lantern-studied";
const SAVED_KEY = "gk-saved";
export const DESK_EVENT = "current-desk";

const empty = (): Desk => ({ tools: [], articles: [], phases: [], saved: [], passed: [], findings: [] });

function list(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string");
}

export function readDesk(): Desk {
  if (typeof window === "undefined") return empty();
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Desk>) : {};
    let saved = list(parsed.saved);
    if (!raw || !Array.isArray(parsed.saved)) {
      const legacy = window.localStorage.getItem(SAVED_KEY);
      if (legacy) saved = list(JSON.parse(legacy) as unknown);
    }
    return cleanDesk({
      tools: list(parsed.tools),
      articles: list(parsed.articles),
      phases: list(parsed.phases),
      saved,
      passed: list(parsed.passed),
      findings: parsed.findings,
    });
  } catch {
    return empty();
  }
}

export function readStudied(): Pick<Desk, StudyKind> {
  const desk = readDesk();
  return { tools: desk.tools, articles: desk.articles, phases: desk.phases };
}

let syncOn = false;
let saveTimer = 0;

export function setDeskSync(on: boolean) {
  syncOn = on;
}

export function writeDesk(next: Desk, remote = true) {
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.localStorage.setItem(SAVED_KEY, JSON.stringify(next.saved));
  window.dispatchEvent(new Event(DESK_EVENT));
  if (remote && syncOn) {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      void saveDesk({ data: next }).catch(() => undefined);
    }, 350);
  }
}

export function toggleStudied(kind: StudyKind, id: string): Desk {
  const current = readDesk();
  const set = new Set(current[kind]);
  if (set.has(id)) set.delete(id);
  else set.add(id);
  const next = { ...current, [kind]: [...set] };
  writeDesk(next);
  return next;
}

export function toggleSaved(id: string): Desk {
  const current = readDesk();
  const set = new Set(current.saved);
  if (set.has(id)) set.delete(id);
  else set.add(id);
  const next = { ...current, saved: [...set] };
  writeDesk(next);
  return next;
}

export function markPassed(id: string): Desk {
  const current = readDesk();
  if (current.passed.includes(id)) return current;
  const next = { ...current, passed: [...current.passed, id] };
  writeDesk(next);
  return next;
}

const CITE_KEY = "current-cite";

export type Cite = { title: string; host: string; tool: string; line: string };

export function writeCite(cite: Cite) {
  window.localStorage.setItem(CITE_KEY, JSON.stringify(cite));
  markPassed("report-read");
}

export function readCite(): Cite | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CITE_KEY);
    if (!raw) return null;
    const row = JSON.parse(raw) as Partial<Cite>;
    if (!row.line || !row.title) return null;
    return {
      title: String(row.title).slice(0, 120),
      host: String(row.host ?? "").slice(0, 80),
      tool: String(row.tool ?? "").slice(0, 60),
      line: String(row.line).slice(0, 280),
    };
  } catch {
    return null;
  }
}

export function addFinding(input: Omit<Finding, "id">): Desk {
  const current = readDesk();
  const finding: Finding = {
    id: `f${Date.now().toString(36)}`,
    title: input.title.trim().slice(0, 120),
    host: input.host.trim().slice(0, 80),
    evidence: input.evidence.trim().slice(0, 280),
    fix: input.fix.trim().slice(0, 280),
    tool: input.tool.trim().slice(0, 60),
  };
  if (!finding.title) return current;
  const next = { ...current, findings: [finding, ...current.findings].slice(0, 40) };
  writeDesk(next);
  return next;
}

export function removeFinding(id: string): Desk {
  const current = readDesk();
  const next = { ...current, findings: current.findings.filter((item) => item.id !== id) };
  writeDesk(next);
  return next;
}

export function findingsMarkdown(findings: Finding[]) {
  const lines = ["# Current findings", "", "Fixture notes. These hosts exist only in the lab.", ""];
  if (!findings.length) lines.push("No findings yet.", "");
  for (const item of findings) {
    lines.push(`## ${item.title}`, "");
    if (item.tool) lines.push(`- Tool: ${item.tool}`);
    lines.push(`- Host: ${item.host || "—"}`, `- Evidence: ${item.evidence || "—"}`, `- Fix: ${item.fix || "—"}`, "");
  }
  return lines.join("\n");
}

export function unionDesk(left: Desk, right: Desk): Desk {
  const merge = (a: string[], b: string[]) => [...new Set([...a, ...b])];
  const findings = new Map<string, Finding>();
  for (const item of [...left.findings, ...right.findings]) findings.set(item.id, item);
  return {
    tools: merge(left.tools, right.tools),
    articles: merge(left.articles, right.articles),
    phases: merge(left.phases, right.phases),
    saved: merge(left.saved, right.saved),
    passed: merge(left.passed, right.passed),
    findings: [...findings.values()].slice(0, 40),
  };
}

export const drills = [
  {
    title: "Say the triad out loud",
    detail: "Confidentiality, integrity, availability — one sentence each, no notes.",
    to: "/learn/$slug" as const,
    slug: "cia-triad",
  },
  {
    title: "Read a mode",
    detail: "What does chmod 640 allow, and who is left out?",
    to: "/linux-commands" as const,
    slug: "",
  },
  {
    title: "One open port",
    detail: "On the port lab, explain why filtered is not the same as closed.",
    to: "/cybersecurity-tools/$slug" as const,
    slug: "port-lab",
  },
  {
    title: "A header you would add",
    detail: "Pick one missing security header and say what it stops.",
    to: "/cybersecurity-tools/$slug" as const,
    slug: "security-headers",
  },
  {
    title: "Nmap, small",
    detail: "Name the three states Nmap prints and what each one actually proved.",
    to: "/tools/$slug" as const,
    slug: "nmap",
  },
  {
    title: "Passwords that survive",
    detail: "Why is a fast hash a bad place to store a password?",
    to: "/learn/$slug" as const,
    slug: "hashes-explained",
  },
  {
    title: "Your own traffic",
    detail: "What would you refuse to capture, and why?",
    to: "/tools/$slug" as const,
    slug: "wireshark",
  },
];

export function tonightDrill() {
  const day = Math.floor(Date.now() / 86_400_000);
  return drills[day % drills.length]!;
}
