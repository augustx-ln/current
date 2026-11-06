import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StudyButton } from "@/components/studied";
import { PhaseCheck } from "@/components/phase-check";
import { commandByName, commandSlug } from "@/data/commands";
import { FIXTURE_TRY } from "@/data/fixtures";
import { toolCommands } from "@/data/tool-commands";
import { toolBySlug, toolLimit, tools } from "@/data/tools";
import { DESK_EVENT, readDesk, toggleSaved } from "@/lib/study";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = toolBySlug(params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  component: ToolPage,
});

function ToolPage() {
  const { tool } = Route.useLoaderData();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const related = tools.filter((item) => item.category === tool.category && item.slug !== tool.slug).slice(0, 3);
  const fixture = tool.category === "Exploitation" || tool.limit ? undefined : FIXTURE_TRY[tool.slug];
  const next = tool.next ? toolBySlug(tool.next) : undefined;
  const needs = tool.needs ?? ["Written scope", "A host, domain, or file you are allowed to test"];
  const linked = (toolCommands[tool.slug] ?? []).map((name) => commandByName(name)).filter((item) => item != null);

  useEffect(() => {
    const sync = () => setSaved(readDesk().saved.includes(tool.slug));
    sync();
    window.addEventListener(DESK_EVENT, sync);
    return () => window.removeEventListener(DESK_EVENT, sync);
  }, [tool.slug]);

  return (
    <article>
      <p className="text-xs text-muted">
        <Link to="/tools" search={{ cat: tool.category }} className="text-accent">
          Tools
        </Link>{" "}
        / {tool.category}
      </p>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{tool.name}</h1>
          <p className="mt-2 text-sm text-cyan">
            {tool.aka} · {tool.level} · {tool.minutes} min
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StudyButton kind="tools" id={tool.slug} />
          <button type="button" onClick={() => setSaved(toggleSaved(tool.slug).saved.includes(tool.slug))} className="h-11 rounded-md border border-line px-4 text-sm">
            {saved ? "Saved on this desk" : "Save guide"}
          </button>
        </div>
      </div>
      <p className="mt-5 max-w-3xl text-sm text-muted sm:text-base">{tool.overview}</p>

      <section className="panel mt-6 p-4 sm:p-5">
        <h2 className="text-xs tracking-widest text-cyan uppercase">When to use it</h2>
        <p className="mt-2 text-sm text-muted">{tool.when ?? tool.summary}</p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-lg font-bold">What you need first</h2>
        <ul className="mt-3 grid gap-2">
          {needs.map((item) => (
            <li key={item} className="panel px-4 py-3 text-sm text-muted">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel mt-6 p-4 sm:p-5">
        <h2 className="text-sm font-bold text-accent">Install</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <code className="block flex-1 overflow-x-auto rounded-md bg-black/40 px-3 py-3 text-sm">{tool.install}</code>
          <button
            type="button"
            className="h-11 shrink-0 rounded-md bg-accent px-4 text-sm font-bold text-ink"
            onClick={() => {
              void navigator.clipboard.writeText(tool.install).then(
                () => {
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1200);
                },
                () => setCopied(false),
              );
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="mt-4 text-xs text-muted">Teaching command: {tool.syntax}</p>
        {fixture ? (
          <p className="mt-3 text-sm text-muted">
            Scripted fixture: <code className="text-accent">{fixture}</code>. Only inside the terminal. Nothing is scanned.
          </p>
        ) : null}
      </section>

      {linked.length ? (
        <section className="mt-6">
          <h2 className="font-display text-lg font-bold">Commands this uses</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {linked.map((command) => (
              <li key={command.name}>
                <Link
                  to="/linux-commands/$slug"
                  params={{ slug: commandSlug(command.name) }}
                  className="inline-flex h-11 items-center rounded-full border border-line px-4 text-sm text-accent"
                >
                  {command.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tool.flags.length ? (
        <section className="mt-8">
          <h2 className="font-display text-lg font-bold">Flags worth knowing</h2>
          <ul className="mt-3 grid gap-2">
            {tool.flags.map((flag) => (
              <li key={flag.flag} className="panel px-4 py-3 text-sm">
                <code className="text-accent">{flag.flag}</code>
                <span className="mt-1 block text-muted">{flag.meaning}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tool.output?.length ? (
        <section className="mt-8">
          <h2 className="font-display text-lg font-bold">How to read a line</h2>
          <ul className="mt-3 grid gap-2">
            {tool.output.map((row) => (
              <li key={row.line} className="panel px-4 py-3 text-sm">
                <code className="text-accent">{row.line}</code>
                <span className="mt-1 block text-muted">{row.meaning}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold">Authorized workflow</h2>
        <ol className="mt-3 grid gap-2">
          {tool.steps.map((step, index) => (
            <li key={step} className="panel flex gap-3 px-4 py-3 text-sm">
              <span className="font-display text-accent">{index + 1}</span>
              <span className="text-muted">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel mt-8 p-4">
        <h2 className="text-sm font-bold text-cyan">What this lab will not do</h2>
        <p className="mt-2 text-sm text-muted">{toolLimit(tool)}</p>
      </section>

      <section className="panel mt-4 p-4">
        <h2 className="text-sm font-bold text-cyan">Defender note</h2>
        <p className="mt-2 text-sm text-muted">{tool.defender}</p>
      </section>
      <PhaseCheck slug={tool.slug} />

      {next ? (
        <p className="mt-8 text-sm">
          Next stop:{" "}
          <Link to="/tools/$slug" params={{ slug: next.slug }} className="text-accent">
            {next.name}
          </Link>
        </p>
      ) : null}

      {related.length ? (
        <section className="mt-8">
          <h2 className="font-display text-lg font-bold">Related</h2>
          <ul className="mt-3 grid gap-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link to="/tools/$slug" params={{ slug: item.slug }} className="text-sm text-accent">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
