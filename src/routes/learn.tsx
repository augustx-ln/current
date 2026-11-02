import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ChipBar, chipClass } from "@/components/chip-bar";
import { PageHeading } from "@/components/shell";
import { articles, topics } from "@/data/articles";

export const Route = createFileRoute("/learn")({
  validateSearch: (search: Record<string, unknown>): { topic?: string } => {
    if (typeof search.topic === "string" && search.topic && search.topic !== "All") return { topic: search.topic };
    return {};
  },
  component: LearnRoute,
});

function LearnRoute() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname !== "/learn" && pathname !== "/learn/") return <Outlet />;
  return <LearnPage />;
}

function LearnPage() {
  const topic = Route.useSearch().topic ?? "All";
  const visible = articles.filter((article) => topic === "All" || article.topic === topic);
  return (
    <div>
      <PageHeading
        kicker="Learning center"
        title="Articles"
        lede="Short lessons on Linux, networking, web security, and how to practice without breaking the law."
      />
      <ChipBar value={topic}>
        {["All", ...topics].map((item) => (
          <Link key={item} to="/learn" search={{ topic: item }} data-chip={item} className={chipClass(item === topic)}>
            {item}
          </Link>
        ))}
      </ChipBar>
      <div key={topic} className="chip-swap grid gap-3 md:grid-cols-2">
        {visible.map((article) => (
          <Link key={article.slug} to="/learn/$slug" params={{ slug: article.slug }} className="panel block p-4">
            <p className="text-xs text-cyan">
              {article.topic} · {article.level} · {article.minutes} min
            </p>
            <h2 className="mt-2 font-bold">{article.title}</h2>
            <p className="mt-2 text-sm text-muted">{article.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
