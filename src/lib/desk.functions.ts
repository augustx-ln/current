import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

export type DeskPayload = {
  tools: string[];
  articles: string[];
  phases: string[];
  saved: string[];
  passed: string[];
};

const empty = (): DeskPayload => ({ tools: [], articles: [], phases: [], saved: [], passed: [] });

function asList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string" && item.length > 0 && item.length < 80).slice(0, 200);
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
