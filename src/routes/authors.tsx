import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@/components/shell";

export const Route = createFileRoute("/authors")({ component: AuthorsPage });

function AuthorsPage() {
  return (
    <div className="max-w-3xl">
      <PageHeading kicker="Desk" title="Who writes this" lede="Current is written by Aug." />
      <article className="panel p-5">
        <h2 className="font-display text-2xl font-medium text-accent">Aug.</h2>
        <p className="mt-3 text-sm text-muted">
          Guides are written as teaching notes for students and junior analysts. They assume you can install a
          virtual machine and read a man page. They do not assume you have permission to test anyone else’s
          systems — you have to go get that yourself.
        </p>
        <p className="mt-3 text-sm text-muted">
          Corrections worth making: a wrong port, a misleading flag, or a sentence that sounds like an
          invitation to attack. Use the contact page. It stores the note on this device only.
        </p>
      </article>
    </div>
  );
}
