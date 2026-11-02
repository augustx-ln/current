import { createFileRoute, Link } from "@tanstack/react-router";
import { Terminal } from "@/components/terminal";
import { PageHeading } from "@/components/shell";

export const Route = createFileRoute("/terminal-sandbox")({
  component: TerminalPage,
});

function TerminalPage() {
  return (
    <div>
      <PageHeading
        kicker="Sandbox"
        title="Kali sandbox"
        lede="Three sessions, prompt in the scroll, like a tty. Scan only 10.13.37.20 and 10.13.37.30. Exploitation commands stay refused."
      />
      <Terminal />
      <p className="mt-4 text-sm text-muted">
        Want the real syntax? Open the <Link to="/linux-commands" className="text-accent">command reference</Link>.
      </p>
    </div>
  );
}
