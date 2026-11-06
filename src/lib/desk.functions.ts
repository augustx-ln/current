import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

export type Finding = {
  id: string;
  title: string;
  host: string;
  evidence: string;
  fix: string;
  tool: string;
};

export type DeskPayload = {
  tools: string[];
  articles: string[];
  phases: string[];
  saved: string[];
  passed: string[];
  findings: Finding[];
};

const empty = (): DeskPayload => ({ tools: [], articles: [], phases: [], saved: [], passed: [], findings: [] });

function asList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string" && item.length > 0 && item.length < 80).slice(0, 200);
}

function clip(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function asFindings(value: unknown): Finding[] {
  if (!Array.isArray(value)) return [];
  const out: Finding[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as Partial<Finding>;
    const title = clip(row.title, 120);
    if (!title) continue;
    out.push({
      id: clip(row.id, 40) || `f${out.length}`,
      title,
      host: clip(row.host, 80),
      evidence: clip(row.evidence, 280),
      fix: clip(row.fix, 280),
      tool: clip(row.tool, 60),
    });
    if (out.length >= 40) break;
  }
  return out;
}

export function cleanDesk(value: unknown): DeskPayload {
  if (!value || typeof value !== "object") return empty();
  const row = value as Partial<DeskPayload>;
  return {
    tools: asList(row.tools),
    articles: asList(row.articles),
    phases: asList(row.phases),
    saved: asList(row.saved),
    passed: asList(row.passed),
    findings: asFindings(row.findings),
  };
}

export const loadDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<DeskPayload | null> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{ payload: unknown }>`select payload from desk_state where user_id = ${context.userId}`;
    const payload = rows[0]?.payload;
    if (payload == null) return null;
    const parsed = typeof payload === "string" ? JSON.parse(payload) : payload;
    return cleanDesk(parsed);
  });

export const saveDesk = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => cleanDesk(data))
  .handler(async ({ data, context }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const body = JSON.stringify(data);
    await sql`insert into desk_state (user_id, payload, updated_at) values (${context.userId}, ${body}::jsonb, now()) on conflict (user_id) do update set payload = excluded.payload, updated_at = now()`;
    return { ok: true as const };
  });
