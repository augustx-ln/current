import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeading } from "@/components/shell";
import { articles } from "@/data/articles";
import { commands } from "@/data/commands";
import { labs } from "@/data/labs";
import { phases } from "@/data/phases";
import { tools } from "@/data/tools";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => {
    if (typeof search.q === "string" && search.q) return { q: search.q };
    return {};
  },
  component: SearchPage,
});

function SearchPage() {
  const q = Route.useSearch().q ?? "";
  const needle = q.trim().toLowerCase();
  const toolHits = needle
    ? tools.filter((tool) => `${tool.name} ${tool.summary} ${tool.tags.join(" ")}`.toLowerCase().includes(needle))
    : tools.slice(0, 4);
  const commandHits = needle
    ? commands.filter((command) => `${command.name} ${command.summary}`.toLowerCase().includes(needle)).slice(0, 8)
    : [];
  const articleHits = needle
    ? articles.filter((article) => `${article.title} ${article.summary}`.toLowerCase().includes(needle))
    : articles.slice(0, 3);
  const phaseHits = needle
    ? phases.filter((item) => `${item.name} ${item.summary} ${item.phase}`.toLowerCase().includes(needle))
    : [];
  const labHits = needle ? labs.filter((lab) => `${lab.name} ${lab.summary}`.toLowerCase().includes(needle)) : [];
  const empty = needle && !toolHits.length && !commandHits.length && !articleHits.length && !phaseHits.length && !labHits.length;

  return (
    <div>
      <PageHeading
        kicker="Search"
        title={needle ? `Results for “${q.trim()}”` : "Search the lab"}
        lede="Tools, commands, articles, and browser labs."
      />
      {empty ? <p className="text-sm text-muted">Nothing matched. Try nmap, chmod, or subnet.</p> : null}
      {toolHits.length ? (
        <section className="mb-8">
          <h2 className="mb-3 text-xs tracking-widest text-cyan uppercase">Tools</h2>
          <div className="grid gap-3">
            {toolHits.map((tool) => (
              <Link key={tool.slug} to="/tools/$slug" params={{ slug: tool.slug }} className="panel block p-4 text-sm">
                <span className="font-bold text-accent">{tool.name}</span>
                <span className="mt-1 block text-muted">{tool.summary}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      {commandHits.length ? (
        <section className="mb-8">
          <h2 className="mb-3 text-xs tracking-widest text-cyan uppercase">Commands</h2>
          <div className="grid gap-3">
            {commandHits.map((command) => (
              <Link key={command.name} to="/linux-commands" className="panel block p-4 text-sm">
                <span className="font-bold text-accent">{command.name}</span>
                <span className="mt-1 block text-muted">{command.summary}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      {articleHits.length ? (
        <section className="mb-8">
          <h2 className="mb-3 text-xs tracking-widest text-cyan uppercase">Articles</h2>
          <div className="grid gap-3">
            {articleHits.map((article) => (
              <Link key={article.slug} to="/learn/$slug" params={{ slug: article.slug }} className="panel block p-4 text-sm">
                <span className="font-bold text-accent">{article.title}</span>
                <span className="mt-1 block text-muted">{article.summary}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      {phaseHits.length ? (
        <section className="mb-8">
          <h2 className="mb-3 text-xs tracking-widest text-cyan uppercase">Phases</h2>
          <div className="grid gap-3">
            {phaseHits.map((item) => (
              <Link key={item.slug} to="/phases/$slug" params={{ slug: item.slug }} className="panel block p-4 text-sm">
                <span className="font-bold text-accent">{item.name}</span>
                <span className="mt-1 block text-muted">{item.summary}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      {labHits.length ? (
        <section className="mb-8">
          <h2 className="mb-3 text-xs tracking-widest text-cyan uppercase">Labs</h2>
          <div className="grid gap-3">
            {labHits.map((lab) => (
              <Link key={lab.slug} to="/cybersecurity-tools/$slug" params={{ slug: lab.slug }} className="panel block p-4 text-sm">
                <span className="font-bold text-accent">{lab.name}</span>
                <span className="mt-1 block text-muted">{lab.summary}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
