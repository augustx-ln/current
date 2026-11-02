import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="py-16">
      <p className="text-xs tracking-widest text-accent uppercase">404</p>
      <h1 className="mt-2 font-display text-3xl font-bold">That path is not in the lab</h1>
      <p className="mt-3 max-w-lg text-sm text-muted">
        The page is missing or the slug does not match a guide. Try the tool index or search.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/" className="inline-flex h-11 items-center rounded-md bg-accent px-4 text-sm font-bold text-ink">
          Home
        </Link>
        <Link to="/tools" className="inline-flex h-11 items-center rounded-md border border-line px-4 text-sm">
          Browse tools
        </Link>
      </div>
    </div>
  );
}
