import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useDeskWhere } from "@/components/account";
import { DrillCard } from "@/components/studied";
import { PageHeading } from "@/components/shell";
import { articles, articleBySlug } from "@/data/articles";
import { pathStops } from "@/data/path";
import { phaseBySlug } from "@/data/phases";
import { toolBySlug } from "@/data/tools";
import { DESK_EVENT, readDesk, tonightDrill, type Desk } from "@/lib/study";

export const Route = createFileRoute("/desk")({ component: DeskPage });

function DeskPage() {
  const where = useDeskWhere();
  const [desk, setDesk] = useState<Desk>({ tools: [], articles: [], phases: [], saved: [], passed: [] });

  useEffect(() => {
    const sync = () => setDesk(readDesk());
    sync();
    window.addEventListener(DESK_EVENT, sync);
    return () => window.removeEventListener(DESK_EVENT, sync);
  }, []);

  const toolNames = desk.tools.map((slug) => toolBySlug(slug)).filter((tool) => tool != null);
  const articleNames = desk.articles.map((slug) => articleBySlug(slug)).filter((article) => article != null);
  const phaseNames = desk.phases.map((slug) => phaseBySlug(slug)).filter((item) => item != null);
  const saved = desk.saved.map((slug) => toolBySlug(slug)).filter((tool) => tool != null);
  const next = articles.find((article) => !desk.articles.includes(article.slug));
  const doneCount = pathStops.filter((stop) => desk[stop.kind].includes(stop.slug)).length;

  return (
    <div>
      <PageHeading kicker="Desk" title="What you have actually opened" lede={where} />
      <PathRail doneCount={doneCount} desk={desk} />
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Guides" value={String(toolNames.length)} />
        <Stat label="Articles" value={String(articleNames.length)} />
        <Stat label="Phases" value={String(phaseNames.length)} />
      </div>
      <div className="mt-6 max-w-xl">
        <DrillCard drill={tonightDrill()} />
      </div>
      {next ? (
        <p className="mt-8 text-sm text-muted">
          Next article:{" "}
          <Link to="/learn/$slug" params={{ slug: next.slug }} className="text-accent">
            {next.title}
          </Link>
        </p>
      ) : null}
      <Shelf title="Saved guides" empty="Save a guide from its page. It stays with the desk.">
        {saved.map((tool) => (
          <li key={tool.slug}>
            <Link to="/tools/$slug" params={{ slug: tool.slug }} className="text-sm text-accent">
              {tool.name}
            </Link>
          </li>
        ))}
      </Shelf>
      <Shelf title="Phases" empty="Mark a phase studied when you have read it.">
        {phaseNames.map((item) => (
          <li key={item.slug}>
            <Link to="/phases/$slug" params={{ slug: item.slug }} className="text-sm text-accent">
              {item.name}
            </Link>
            {desk.passed.includes(item.slug) ? <span className="ml-2 text-xs text-muted">checked</span> : null}
          </li>
        ))}
      </Shelf>
      <Shelf title="Guides" empty="Nothing marked yet.">
        {toolNames.map((tool) => (
          <li key={tool.slug}>
            <Link to="/tools/$slug" params={{ slug: tool.slug }} className="text-sm text-accent">
              {tool.name}
            </Link>
          </li>
        ))}
      </Shelf>
      <Shelf title="Articles" empty="Nothing marked yet.">
        {articleNames.map((article) => (
          <li key={article.slug}>
            <Link to="/learn/$slug" params={{ slug: article.slug }} className="text-sm text-accent">
              {article.title}
            </Link>
          </li>
        ))}
      </Shelf>
    </div>
  );
}

function PathRail({ doneCount, desk }: { doneCount: number; desk: Desk }) {
  const [grow, setGrow] = useState(false);
  const span = pathStops.length - 1;
  const ratio = span === 0 ? 0 : doneCount / span;

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setGrow(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <ol className="relative grid gap-3">
      <span
        className="path-line pointer-events-none absolute top-5 left-[0.95rem] w-px bg-accent"
        style={{ height: grow ? `${ratio * 100}%` : "0%", maxHeight: "calc(100% - 2.5rem)" }}
        aria-hidden
      />
      {pathStops.map((stop, index) => {
        const done = desk[stop.kind].includes(stop.slug);
        const current = !done && pathStops.slice(0, index).every((item) => desk[item.kind].includes(item.slug));
        return (
          <li key={stop.id} className="relative pl-10">
            <span
              className={`absolute top-4 left-2 size-4 rounded-full border ${
                done || current ? "border-accent bg-accent" : "border-white/30 bg-[#100d0e]"
              } ${current ? "lamp" : ""}`}
              aria-hidden
            />
            <Link to={stop.to} params={{ slug: stop.slug }} className="panel block p-4">
              <p className="text-xs tracking-widest text-muted uppercase">{done ? "Done" : current ? "Now" : "Later"}</p>
              <h2 className="mt-1 font-display text-2xl">{stop.title}</h2>
              <p className="mt-1 text-sm text-muted">{stop.detail}</p>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

function Shelf({ title, empty, children }: { title: string; empty: string; children: ReactNode }) {
  const filled = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <section className="mt-8">
      <h2 className="font-display text-2xl">{title}</h2>
      {filled ? <ul className="mt-3 grid gap-2">{children}</ul> : <p className="mt-2 text-sm text-muted">{empty}</p>}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-4">
      <p className="text-xs tracking-widest text-muted uppercase">{label}</p>
      <p className="mt-1 font-display text-3xl">{value}</p>
    </div>
  );
}
