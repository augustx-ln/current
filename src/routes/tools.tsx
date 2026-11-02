import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ChipBar, chipClass } from "@/components/chip-bar";
import { PageHeading } from "@/components/shell";
import { categories, tools } from "@/data/tools";

export const Route = createFileRoute("/tools")({
  validateSearch: (search: Record<string, unknown>): { q?: string; cat?: string } => {
    const result: { q?: string; cat?: string } = {};
    if (typeof search.q === "string" && search.q) result.q = search.q;
    if (typeof search.cat === "string" && search.cat && search.cat !== "All") result.cat = search.cat;
    return result;
  },
  component: ToolsRoute,
});

function ToolsRoute() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname !== "/tools" && pathname !== "/tools/") return <Outlet />;
  return <ToolsPage />;
}

function ToolsPage() {
  const { q: rawQ, cat: rawCat } = Route.useSearch();
  const q = rawQ ?? "";
  const cat = rawCat ?? "All";
  const needle = q.trim().toLowerCase();
  const visible = tools.filter((tool) => {
    const inCat = cat === "All" || tool.category === cat;
    const inQuery =
      !needle ||
      tool.name.toLowerCase().includes(needle) ||
      tool.summary.toLowerCase().includes(needle) ||
      tool.tags.some((tag) => tag.includes(needle));
    return inCat && inQuery;
  });

  return (
    <div>
      <PageHeading
        kicker="Kali tools"
        title="Tool guides"
        lede="Guides by job. Exploitation is its own shelf: what the tools are, and what this lab will not run."
      />
      <ChipBar value={cat}>
        {["All", ...categories].map((item) => (
          <Link
            key={item}
            to="/tools"
            search={{ q, cat: item }}
            data-chip={item}
            className={chipClass(item === cat)}
          >
            {item}
          </Link>
        ))}
      </ChipBar>
      <p className="mb-4 text-xs text-muted">
        {visible.length} guide{visible.length === 1 ? "" : "s"}
      </p>
      <div key={cat} className="chip-swap grid gap-3 sm:grid-cols-2">
        {visible.map((tool) => (
          <Link key={tool.slug} to="/tools/$slug" params={{ slug: tool.slug }} className="panel block p-4 hover:border-accent/40">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold text-accent">{tool.name}</h2>
              <span className="text-xs text-muted">{tool.level}</span>
            </div>
            <p className="mt-1 text-xs text-cyan">{tool.category}</p>
            <p className="mt-3 text-sm text-muted">{tool.summary}</p>
          </Link>
        ))}
      </div>
      {visible.length === 0 ? <p className="mt-6 text-sm text-muted">Nothing matched. Try another word or category.</p> : null}
    </div>
  );
}
