import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { StudyButton } from "@/components/studied";
import { PhaseCheck } from "@/components/phase-check";
import { phaseBySlug, phases } from "@/data/phases";

export const Route = createFileRoute("/phases/$slug")({
  loader: ({ params }) => {
    const item = phaseBySlug(params.slug);
    if (!item) throw notFound();
    return { item };
  },
  component: PhasePage,
});

function PhasePage() {
  const { item } = Route.useLoaderData();
  const more = phases.filter((other) => other.slug !== item.slug && other.phase === item.phase).slice(0, 2);
  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-xs text-muted">
        <Link to="/phases" className="text-accent">
          Phases
        </Link>{" "}
        / {item.phase}
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium">{item.name}</h1>
      <p className="mt-3 text-xs text-cyan">{item.minutes} min</p>
      <div className="mt-5">
        <StudyButton kind="phases" id={item.slug} />
      </div>
      <p className="mt-6 text-sm leading-relaxed text-muted sm:text-base">{item.overview}</p>
      <h2 className="mt-8 font-display text-2xl">In the sandbox</h2>
      <p className="mt-2 text-sm text-muted">{item.inLab}</p>
      <h2 className="mt-8 font-display text-2xl">If you are defending</h2>
      <p className="mt-2 text-sm text-muted">{item.defender}</p>
      <p className="panel mt-8 p-4 text-sm text-accent">{item.refuses}</p>
      <PhaseCheck slug={item.slug} />
      {more.length ? (
        <div className="mt-10">
          <h2 className="font-display text-xl">Same phase</h2>
          <ul className="mt-3 grid gap-2">
            {more.map((other) => (
              <li key={other.slug}>
                <Link to="/phases/$slug" params={{ slug: other.slug }} className="text-sm text-accent">
                  {other.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
