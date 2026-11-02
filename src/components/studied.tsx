import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { articles } from "@/data/articles";
import { phases } from "@/data/phases";
import { tools } from "@/data/tools";
import { DESK_EVENT, readStudied, tonightDrill, toggleStudied, type StudyKind } from "@/lib/study";

export function StudyButton({ kind, id }: { kind: StudyKind; id: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const sync = () => setOn(readStudied()[kind].includes(id));
    sync();
    window.addEventListener(DESK_EVENT, sync);
    return () => window.removeEventListener(DESK_EVENT, sync);
  }, [kind, id]);

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => setOn(toggleStudied(kind, id)[kind].includes(id))}
      className={`h-11 rounded-md border px-4 text-sm ${on ? "border-accent bg-accent text-ink" : "border-line"}`}
    >
      {on ? "Studied" : "Mark studied"}
    </button>
  );
}

export function DeskSnapshot() {
  const [done, setDone] = useState(0);
  const total = tools.length + articles.length + phases.length;
  const drill = tonightDrill();

  useEffect(() => {
    const sync = () => {
      const studied = readStudied();
      setDone(studied.tools.length + studied.articles.length + studied.phases.length);
    };
    sync();
    window.addEventListener(DESK_EVENT, sync);
    return () => window.removeEventListener(DESK_EVENT, sync);
  }, []);

  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <section className="rise mt-12 grid gap-4 lg:grid-cols-[1.4fr_1fr]" style={{ animationDelay: "180ms" }}>
      <Link to="/desk" className="panel block p-5">
        <p className="text-xs tracking-widest text-accent uppercase">Your desk</p>
        <p className="mt-2 font-display text-2xl">{done === 0 ? "Nothing marked yet" : `${done} marked studied`}</p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted">{pct}% of guides and articles</p>
      </Link>
      <DrillCard drill={drill} />
    </section>
  );
}

export function DrillCard({ drill }: { drill: ReturnType<typeof tonightDrill> }) {
  const inner = (
    <>
      <p className="text-xs tracking-widest text-accent uppercase">Tonight</p>
      <h2 className="mt-2 font-display text-2xl">{drill.title}</h2>
      <p className="mt-2 text-sm text-muted">{drill.detail}</p>
    </>
  );
  const className = "panel block p-5";
  if (drill.to === "/linux-commands") {
    return (
      <Link to="/linux-commands" className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <Link to={drill.to} params={{ slug: drill.slug }} className={className}>
      {inner}
    </Link>
  );
}
