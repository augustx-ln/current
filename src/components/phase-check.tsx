import { useEffect, useState } from "react";
import { checks } from "@/data/checks";
import { DESK_EVENT, markPassed, readDesk } from "@/lib/study";

export function PhaseCheck({ slug }: { slug: string }) {
  const check = checks[slug];
  const [picked, setPicked] = useState(-1);
  const [wrong, setWrong] = useState(false);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const sync = () => setPassed(readDesk().passed.includes(slug));
    sync();
    window.addEventListener(DESK_EVENT, sync);
    return () => window.removeEventListener(DESK_EVENT, sync);
  }, [slug]);

  if (!check) return null;

  function choose(index: number) {
    setPicked(index);
    if (index === check.answer) {
      setWrong(false);
      markPassed(slug);
      setPassed(true);
      return;
    }
    setWrong(true);
  }

  return (
    <section className="mt-10" aria-labelledby="check-title">
      <h2 id="check-title" className="font-display text-2xl">
        Check
      </h2>
      <p className="mt-2 text-sm text-muted">{check.prompt}</p>
      <div className="relative mt-4 grid gap-2">
        {check.choices.map((choice, index) => {
          const on = picked === index || (passed && index === check.answer);
          return (
            <button
              key={choice}
              type="button"
              disabled={passed}
              onClick={() => choose(index)}
              className={`h-auto min-h-11 rounded-2xl border px-4 py-3 text-left text-sm ${
                on ? "border-rose/50 bg-accent/15 text-fg" : "border-white/15 text-muted"
              } ${wrong && picked === index && !passed ? "nudge" : ""}`}
            >
              {choice}
            </button>
          );
        })}
      </div>
      {passed ? <p className="path-note mt-4 text-sm text-fg">{check.note}</p> : null}
    </section>
  );
}
