import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChipBar, chipClass } from "@/components/chip-bar";
import { PageHeading } from "@/components/shell";
import { commandCategories, commandSlug, commands } from "@/data/commands";

export const Route = createFileRoute("/linux-commands")({
  component: CommandsRoute,
});

function CommandsRoute() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname !== "/linux-commands" && pathname !== "/linux-commands/") return <Outlet />;
  return <CommandsPage />;
}

function CommandsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const needle = q.trim().toLowerCase();
  const visible = useMemo(
    () =>
      commands.filter((command) => {
        const inCat = cat === "All" || command.category === cat;
        const inQuery =
          !needle ||
          command.name.toLowerCase().includes(needle) ||
          command.summary.toLowerCase().includes(needle);
        return inCat && inQuery;
      }),
    [cat, needle],
  );

  return (
    <div>
      <PageHeading
        kicker="Reference"
        title="Linux commands"
        lede={`${commands.length} commands. Open one for when to use it, a safe example, and how it reads in a report.`}
      />
      <label className="mb-4 block">
        <span className="sr-only">Filter commands</span>
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Filter by name or description"
          className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
        />
      </label>
      <ChipBar value={cat}>
        {["All", ...commandCategories].map((item) => (
          <button key={item} type="button" data-chip={item} onClick={() => setCat(item)} className={chipClass(item === cat)}>
            {item}
          </button>
        ))}
      </ChipBar>
      <ul key={cat} className="chip-swap grid gap-3">
        {visible.map((command) => (
          <li key={command.name}>
            <Link to="/linux-commands/$slug" params={{ slug: commandSlug(command.name) }} className="panel block p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-lg font-bold text-accent">{command.name}</h2>
                <span className="text-xs text-cyan">{command.category}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{command.summary}</p>
              <code className="mt-3 block overflow-x-auto text-sm">{command.syntax}</code>
            </Link>
          </li>
        ))}
      </ul>
      {visible.length === 0 ? <p className="mt-4 text-sm text-muted">No command matched.</p> : null}
    </div>
  );
}
