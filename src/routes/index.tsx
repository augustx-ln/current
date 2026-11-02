import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { phases } from "@/data/phases";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  const { user, isPending } = useCurrentUserState();
  const pending = authEnabled && isPending;
  const signedIn = !authEnabled || Boolean(user && !user.isDevFallback);

  if (pending) {
    return (
      <section className="mx-auto grid min-h-[calc(100dvh-3.5rem)] max-w-6xl content-center px-4 py-10">
        <h1 className="font-display text-5xl leading-[0.95] font-medium sm:text-7xl md:text-8xl">Current</h1>
        <div className="mt-8 h-12 w-56 animate-pulse rounded-full bg-white/10" />
      </section>
    );
  }

  if (!signedIn) return <Gate />;
  return <Home />;
}

function Gate() {
  return (
    <section className="mx-auto grid min-h-[calc(100dvh-3.5rem)] max-w-6xl content-center px-4 py-10 sm:min-h-[calc(100dvh-4rem)] sm:py-16">
      <h1 className="rise max-w-4xl font-display text-5xl leading-[0.95] font-medium sm:text-7xl md:text-8xl">Current</h1>
      <p className="rise mt-6 max-w-xl text-sm text-muted sm:text-base" style={{ animationDelay: "120ms" }}>
        Sign in to open the lab. The address is fake, the output is scripted, and nothing here can reach a network.
      </p>
      <div className="rise mt-8 flex max-w-sm flex-col gap-3" style={{ animationDelay: "220ms" }}>
        {GROK_PROVIDERS.map((provider) => (
          <button
            key={provider.providerId}
            type="button"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm"
            onClick={() => void signIn(provider.providerId, { callbackURL: "/" })}
          >
            Continue with {provider.label}
          </button>
        ))}
      </div>
      <p className="rise mt-10 text-sm text-muted" style={{ animationDelay: "320ms" }}>
        Creator <span className="text-fg">Aug.</span>
        {" · "}
        <Link to="/disclaimer" className="underline-offset-4 hover:text-fg hover:underline">
          Simulated lab only
        </Link>
      </p>
    </section>
  );
}

function Home() {
  return (
    <div>
      <section className="mx-auto grid min-h-[calc(100dvh-3.5rem)] max-w-6xl content-center px-4 py-10 sm:min-h-[calc(100dvh-4rem)] sm:py-16">
        <h1 className="rise max-w-4xl font-display text-5xl leading-[0.95] font-medium sm:text-7xl md:text-8xl">Current</h1>
        <p className="rise mt-6 max-w-xl text-sm text-muted sm:text-base" style={{ animationDelay: "120ms" }}>
          A Kali-shaped lab with a fake address, a home directory, and a root prompt. The output is scripted. Nothing here can reach a network.
        </p>
        <div className="rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "220ms" }}>
          <Link to="/terminal-sandbox" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-ink">
            Open the sandbox <ArrowRight className="size-4" />
          </Link>
          <Link to="/phases" className="inline-flex h-12 items-center justify-center rounded-full border border-line px-6 text-sm">
            Read the phases
          </Link>
        </div>
        <p className="rise mt-10 text-sm text-muted" style={{ animationDelay: "320ms" }}>
          Creator <span className="text-fg">Aug.</span>
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <Reveal>
          <h2 className="font-display text-4xl font-medium">Three phases. No live modules.</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Recon, exploitation, and post-exploitation are how a written test is talked about. Current keeps the vocabulary and refuses the part that would leave this browser: payloads, callbacks, and real tools.
          </p>
        </Reveal>
        <Reveal>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {(["Recon", "Exploitation", "Post-exploitation"] as const).map((phase) => (
              <div key={phase} className="panel h-full p-5">
                <h3 className="font-display text-2xl text-accent">{phase}</h3>
                <ul className="mt-4 grid gap-2">
                  {phases
                    .filter((item) => item.phase === phase)
                    .map((item) => (
                      <li key={item.slug}>
                        <Link to="/phases/$slug" params={{ slug: item.slug }} className="text-sm text-fg hover:text-accent">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <Reveal>
        <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-24 md:grid-cols-3">
          <Card to="/terminal-sandbox" title="Sandbox" body="home/kali and /root. su changes the prompt, not your computer. 10.13.37.15, no default route." />
          <Card to="/tools" title="Tool notes" body="What the usual programs are for, written for someone who will have to defend a network." />
          <Card to="/desk" title="Desk" body="Marks, saved guides, and one check per phase, kept on this account." />
        </section>
      </Reveal>
    </div>
  );
}

function Card({ to, title, body }: { to: "/terminal-sandbox" | "/tools" | "/desk"; title: string; body: string }) {
  return (
    <Link to={to} className="panel block h-full p-5">
      <h3 className="font-display text-2xl">{title}</h3>
      <p className="mt-3 text-sm text-muted">{body}</p>
    </Link>
  );
}
