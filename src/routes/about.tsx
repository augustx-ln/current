import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeading } from "@/components/shell";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <div className="max-w-3xl">
      <PageHeading
        kicker="About"
        title="Current"
        lede="A simulated Kali desk. Creator Aug."
      />
      <div className="grid gap-4 text-sm leading-relaxed text-muted">
        <p>
          Current is Aug’s lab for reading Linux, tool notes, and the phases of an authorized test. The shell
          has a home directory and a root prompt. Both are fake. The address 10.13.37.15 is not configured on
          your machine.
        </p>
        <p>
          Pages describe what well-known tools do and how defenders should respond. They skip exploit steps,
          payload generation, and anything that would touch a network you do not own. The port lab is a
          simulation. Hashes and decoders run in your browser.
        </p>
        <p>
          If you are starting from zero, read{" "}
          <Link to="/learn/$slug" params={{ slug: "kali-linux-beginner-guide" }} className="text-accent">
            Kali without the mythology
          </Link>{" "}
          and then open the{" "}
          <Link to="/terminal-sandbox" className="text-accent">
            sandbox
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
