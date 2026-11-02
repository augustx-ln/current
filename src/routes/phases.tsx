import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PageHeading } from "@/components/shell";
import { phases, type Phase } from "@/data/phases";

export const Route = createFileRoute("/phases")({ component: PhasesRoute });

const ORDER: Phase[] = ["Recon", "Exploitation", "Post-exploitation"];

function PhasesRoute() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname !== "/phases" && pathname !== "/phases/") return <Outlet />;
  return <PhasesPage />;
}

function PhasesPage() {
  return (
    <div>
      <PageHeading
        kicker="Phases"
        title="Recon, then the words people misuse"
        lede="Exploitation and post-exploitation are phases of an authorized test. Current teaches the shape of them. It does not load modules or build payloads."
      />
      <div className="panel mb-10 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["10.13.37.1", "gateway"],
          ["10.13.37.15", "you"],
          ["10.13.37.20", "files.lab"],
          ["10.13.37.30", "app.lab"],
        ].map(([ip, name]) => (
          <div key={ip}>
            <p className="font-display text-xl text-accent">{ip}</p>
            <p className="text-xs text-muted">{name}</p>
          </div>
        ))}
      </div>
      {ORDER.map((phase) => (
        <section key={phase} className="mb-10">
          <h2 className="font-display text-3xl font-medium">{phase}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {phases
              .filter((item) => item.phase === phase)
              .map((item) => (
                <Link key={item.slug} to="/phases/$slug" params={{ slug: item.slug }} className="panel block p-4">
                  <p className="text-xs text-muted">{item.minutes} min</p>
                  <h3 className="mt-2 font-display text-xl">{item.name}</h3>
                  <p className="mt-2 text-sm text-muted">{item.summary}</p>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
