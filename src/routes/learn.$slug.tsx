import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { StudyButton } from "@/components/studied";
import { articleBySlug, articles } from "@/data/articles";

export const Route = createFileRoute("/learn/$slug")({
  loader: ({ params }) => {
    const article = articleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const more = articles.filter((item) => item.slug !== article.slug && item.topic === article.topic).slice(0, 2);
  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-xs text-muted">
        <Link to="/learn" className="text-accent">
          Learn
        </Link>{" "}
        / {article.topic}
      </p>
      <h1 className="mt-3 font-display text-3xl leading-tight font-bold sm:text-4xl">{article.title}</h1>
      <p className="mt-3 text-xs text-cyan">
        {article.level} · {article.minutes} min read
      </p>
      <p className="mt-4 text-sm text-muted sm:text-base">{article.summary}</p>
      <div className="mt-5">
        <StudyButton kind="articles" id={article.slug} />
      </div>
      <div className="mt-8 grid gap-8">
        {article.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-xl font-bold">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-sm leading-relaxed text-fg/90">
                {paragraph}
              </p>
            ))}
            {section.bullets ? (
              <ul className="mt-3 grid gap-2 text-sm text-muted">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="border-l-2 border-accent pl-3">
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
      {more.length ? (
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {more.map((item) => (
            <Link key={item.slug} to="/learn/$slug" params={{ slug: item.slug }} className="panel block p-4 text-sm">
              <span className="text-xs text-muted">Next in {item.topic}</span>
              <span className="mt-2 block font-bold text-accent">{item.title}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}
