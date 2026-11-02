import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PageHeading } from "@/components/shell";
import { labs } from "@/data/labs";

export const Route = createFileRoute("/cybersecurity-tools")({
  component: LabsRoute,
});

function LabsRoute() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname !== "/cybersecurity-tools" && pathname !== "/cybersecurity-tools/") return <Outlet />;
  return <LabsPage />;
}

function LabsPage() {
  const groups = [...new Set(labs.map((lab) => lab.group))];
  return (
    <div>
      <PageHeading
        kicker="In the browser"
        title="Security labs"
        lede="Hashing, subnets, headers, a simulated port table, and a quiz. Input stays on this device. Nothing here scans a remote host."
      />
      {groups.map((group) => (
        <section key={group} className="mb-8">
          <h2 className="text-xs tracking-widest text-cyan uppercase">{group}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {labs
              .filter((lab) => lab.group === group)
              .map((lab) => (
                <Link
                  key={lab.slug}
                  to="/cybersecurity-tools/$slug"
                  params={{ slug: lab.slug }}
                  className="panel block p-4 hover:border-accent/40"
                >
                  <h3 className="font-bold text-accent">{lab.name}</h3>
                  <p className="mt-2 text-sm text-muted">{lab.summary}</p>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
