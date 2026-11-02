import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@/components/shell";

export const Route = createFileRoute("/disclaimer")({ component: DisclaimerPage });

function DisclaimerPage() {
  return (
    <div className="max-w-3xl">
      <PageHeading kicker="Legal" title="Disclaimer" />
      <div className="grid gap-4 text-sm leading-relaxed text-muted">
        <p>
          Current is a simulated lab by Aug. Commands print scripted text. The only addresses are fixtures on
          10.13.37.0/24, and there is no route off this page.
        </p>
        <p>
          Nothing here permits you to access, scan, disrupt, or copy data from a system you do not own or
          have written authorization to test. Unauthorized access is a crime in most jurisdictions, including
          under computer misuse laws. A tutorial is not legal advice.
        </p>
        <p>
          Tool notes describe what programs are for. They do not include exploit procedures or payload
          generation. The sandbox will not run those tools.
        </p>
        <p>Practice apps, your own virtual machines, and programs with a published scope are the right places to get hands-on.</p>
      </div>
    </div>
  );
}
