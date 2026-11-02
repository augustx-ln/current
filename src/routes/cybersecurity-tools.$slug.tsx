import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { LabView } from "@/components/labs-ui";
import { labBySlug } from "@/data/labs";

export const Route = createFileRoute("/cybersecurity-tools/$slug")({
  loader: ({ params }) => {
    if (!labBySlug(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  component: LabPage,
});

function LabPage() {
  const { slug } = Route.useLoaderData();
  return (
    <div>
      <p className="mb-4 text-xs text-muted">
        <Link to="/cybersecurity-tools" className="text-accent">
          Labs
        </Link>
      </p>
      <LabView slug={slug} />
    </div>
  );
}
