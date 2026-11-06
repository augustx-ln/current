import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { commandBySlug, commandSlug, commands } from "@/data/commands";

export const Route = createFileRoute("/linux-commands/$slug")({
  loader: ({ params }) => {
    const command = commandBySlug(params.slug);
    if (!command) throw notFound();
    return { command };
  },
  component: CommandPage,
});

function CommandPage() {
  const { command } = Route.useLoaderData();
  const [copied, setCopied] = useState(false);
  const related = commands.filter((item) => item.category === command.category && item.name !== command.name).slice(0, 4);

  return (
    <article>
      <p className="text-xs text-muted">
        <Link to="/linux-commands" className="text-accent">
          Commands
        </Link>{" "}
        / {command.category}
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{command.name}</h1>
      <p className="mt-2 text-sm text-cyan">{command.category}</p>
      <p className="mt-5 max-w-2xl text-sm text-muted sm:text-base">{command.summary}</p>

      <section className="panel mt-6 p-4 sm:p-5">
        <h2 className="text-xs tracking-widest text-cyan uppercase">When to use it</h2>
        <p className="mt-2 text-sm text-muted">{command.when ?? command.summary}</p>
      </section>

      <section className="panel mt-4 p-4 sm:p-5">
        <h2 className="text-sm font-bold text-accent">Syntax</h2>
        <code className="mt-3 block overflow-x-auto rounded-md bg-black/40 px-3 py-3 text-sm">{command.syntax}</code>
        <p className="mt-4 text-xs text-muted">Safe example</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
          <code className="block flex-1 overflow-x-auto text-sm text-fg">{command.example}</code>
          <button
            type="button"
            className="h-11 shrink-0 rounded-md bg-accent px-4 text-sm font-bold text-ink"
            onClick={() => {
              void navigator.clipboard.writeText(command.example).then(
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
      </section>

      <section className="panel mt-4 p-4 sm:p-5">
        <h2 className="text-sm font-bold text-cyan">In a report</h2>
        <p className="mt-2 text-sm text-muted">
          {command.report ?? "Quote the command and the line you mean. Do not paste the whole session."}
        </p>
      </section>

      {related.length ? (
        <section className="mt-8">
          <h2 className="font-display text-lg font-bold">Same shelf</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {related.map((item) => (
              <li key={item.name}>
                <Link to="/linux-commands/$slug" params={{ slug: commandSlug(item.name) }} className="text-sm text-accent">
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
