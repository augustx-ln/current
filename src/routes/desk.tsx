import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { DrillCard } from "@/components/studied";
import { PageHeading } from "@/components/shell";
import { articles, articleBySlug } from "@/data/articles";
import { pathStops, stopState } from "@/data/path";
import { phaseBySlug } from "@/data/phases";
import { toolBySlug } from "@/data/tools";
import { DESK_EVENT, addFinding, findingsMarkdown, markPassed, readCite, readDesk, removeFinding, tonightDrill, type Desk } from "@/lib/study";

export const Route = createFileRoute("/desk")({ component: DeskPage });

function DeskPage() {
  const [desk, setDesk] = useState<Desk>({ tools: [], articles: [], phases: [], saved: [], passed: [], findings: [] });

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
  const doneCount = pathStops.filter((stop) => desk.passed.includes(stop.check)).length;

  return (
    <div>
      <PageHeading kicker="Desk" title="First report" lede="Five stops. A stop counts when its check is answered, not when the page was opened." />
      <PathRail doneCount={doneCount} desk={desk} />
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Guides" value={String(toolNames.length)} />
        <Stat label="Articles" value={String(articleNames.length)} />
        <Stat label="Phases" value={String(phaseNames.length)} />
      </div>
      <div className="mt-6 max-w-xl">
        <DrillCard drill={tonightDrill()} />
      </div>
      <Findings desk={desk} />
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

function Findings({ desk }: { desk: Desk }) {
  const [title, setTitle] = useState("");
  const [host, setHost] = useState("10.13.37.20");
  const [tool, setTool] = useState("");
  const [evidence, setEvidence] = useState("");
  const [fix, setFix] = useState("");
  const field = "w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-fg placeholder:text-muted";

  useEffect(() => {
    const cite = readCite();
    if (!cite) return;
    setTitle(cite.title);
    setHost(cite.host);
    setTool(cite.tool);
    setEvidence(cite.line);
  }, []);

  function add(event: FormEvent) {
    event.preventDefault();
    addFinding({ title, host, tool, evidence, fix });
    setTitle("");
    setEvidence("");
    setFix("");
  }

  function download() {
    const blob = new Blob([findingsMarkdown(desk.findings)], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "current-findings.md";
    link.click();
    URL.revokeObjectURL(url);
    if (desk.findings.some((item) => item.fix.trim())) markPassed("report-write");
  }

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl">Findings</h2>
        <button type="button" onClick={download} className="h-11 rounded-md border border-line px-4 text-sm">
          Export Markdown
        </button>
      </div>
      <p className="mt-2 max-w-xl text-sm text-muted">A note you can cite. Hosts here are fixtures. Nothing in this list is a real target.</p>
      <form onSubmit={add} className="panel mt-4 grid gap-3 p-4">
        <input className={field} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" aria-label="Title" required />
        <div className="grid gap-3 sm:grid-cols-2">
          <input className={field} value={host} onChange={(event) => setHost(event.target.value)} placeholder="Fixture host" aria-label="Host" />
          <input className={field} value={tool} onChange={(event) => setTool(event.target.value)} placeholder="Tool" aria-label="Tool" />
        </div>
        <input className={field} value={evidence} onChange={(event) => setEvidence(event.target.value)} placeholder="Line you are citing" aria-label="Evidence" />
        <input className={field} value={fix} onChange={(event) => setFix(event.target.value)} placeholder="What you would fix" aria-label="Fix" />
        <button type="submit" className="h-11 w-fit rounded-md bg-accent px-4 text-sm font-bold text-ink">
          Add finding
        </button>
      </form>
      {desk.findings.length ? (
        <ul className="mt-3 grid gap-2">
          {desk.findings.map((item) => (
            <li key={item.id} className="panel p-4 text-sm">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-accent">{item.title}</h3>
                <button type="button" onClick={() => removeFinding(item.id)} className="text-xs text-muted">
                  Remove
                </button>
              </div>
              <p className="mt-2 text-muted">
                {item.tool ? `${item.tool} · ` : ""}
                {item.host || "no host"}
              </p>
              {item.evidence ? <p className="mt-2">{item.evidence}</p> : null}
              {item.fix ? <p className="mt-1 text-muted">{item.fix}</p> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted">No findings yet.</p>
      )}
    </section>
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
        const state = stopState(desk.passed, index);
        const body = (
          <>
            <p className="text-xs tracking-widest text-muted uppercase">{state === "done" ? "Done" : state === "now" ? "Now" : "Later"}</p>
            <h2 className="mt-1 font-display text-2xl">{stop.title}</h2>
            <p className="mt-1 text-sm text-muted">{stop.detail}</p>
          </>
        );
        return (
          <li key={stop.id} className="relative pl-10">
            <span
              className={`absolute top-4 left-2 size-4 rounded-full border ${
                state === "later" ? "border-white/30 bg-[#100d0e]" : "border-accent bg-accent"
              } ${state === "now" ? "lamp" : ""}`}
              aria-hidden
            />
            {state === "later" ? (
              <div className="panel block p-4 opacity-60" aria-disabled="true">
                {body}
              </div>
            ) : (
              <StopLink stop={stop}>{body}</StopLink>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StopLink({ stop, children }: { stop: (typeof pathStops)[number]; children: ReactNode }) {
  const className = "panel block p-4";
  if (stop.to === "/read") {
    return (
      <Link to="/read" className={className}>
        {children}
      </Link>
    );
  }
  if (stop.to === "/desk") {
    return (
      <Link to="/desk" className={className}>
        {children}
      </Link>
    );
  }
  if (stop.to === "/phases/$slug") {
    return (
      <Link to="/phases/$slug" params={{ slug: stop.slug }} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/tools/$slug" params={{ slug: stop.slug }} className={className}>
      {children}
    </Link>
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
