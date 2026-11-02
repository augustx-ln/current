import { pathOf, run, type ShellState } from "@/lib/sandbox";
import { useEffect, useRef, useState } from "react";

type Line = { kind: "in" | "out"; text: string };

type Session = {
  id: number;
  shell: ShellState;
  lines: Line[];
  draft: string;
  history: string[];
  hist: number;
};

let nextId = 1;

function blank(): Session {
  const id = nextId++;
  return {
    id,
    shell: { cwd: ["home", "kali"], user: "kali" },
    lines: [
      { kind: "out", text: "Current lab — scripted shell. No uplink." },
      { kind: "out", text: "Fixtures: 10.13.37.20 files.lab    10.13.37.30 app.lab" },
      { kind: "out", text: "Try: nmap 10.13.37.20    whatweb http://10.13.37.20" },
    ],
    draft: "",
    history: [],
    hist: 0,
  };
}

export function Terminal() {
  const [sessions, setSessions] = useState<Session[]>(() => [blank()]);
  const [active, setActive] = useState(sessions[0]?.id ?? 1);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const current = sessions.find((item) => item.id === active) ?? sessions[0]!;

  useEffect(() => {
    const node = scroller.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [current.lines, current.draft, active]);

  useEffect(() => {
    field.current?.focus();
  }, [active]);

  function patch(id: number, update: (session: Session) => Session) {
    setSessions((list) => list.map((item) => (item.id === id ? update(item) : item)));
  }

  function submit(raw: string) {
    const session = current;
    const result = run(raw, session.shell);
    const history = raw.trim() ? [...session.history, raw] : session.history;
    patch(session.id, (item) => ({
      ...item,
      shell: result.state,
      history,
      hist: history.length,
      draft: "",
      lines: result.lines.includes("__CLEAR__")
        ? []
        : [
            ...item.lines,
            { kind: "in", text: promptOf(item.shell) + raw },
            ...result.lines.map((text) => ({ kind: "out" as const, text })),
          ],
    }));
  }

  function addSession() {
    if (sessions.length >= 3) return;
    const session = blank();
    setSessions((list) => [...list, session]);
    setActive(session.id);
  }

  function closeSession(id: number) {
    if (sessions.length === 1) return;
    const rest = sessions.filter((item) => item.id !== id);
    setSessions(rest);
    if (active === id) setActive(rest[rest.length - 1]!.id);
  }

  return (
    <div className="panel no-pop overflow-hidden">
      <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 bg-black/30 px-2 py-1.5">
        {sessions.map((session, index) => (
          <button
            key={session.id}
            type="button"
            onClick={() => setActive(session.id)}
            className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-3 text-xs ${
              session.id === active ? "bg-accent text-ink" : "text-muted"
            }`}
          >
            tty{index + 1}
            {sessions.length > 1 ? (
              <span
                role="button"
                tabIndex={0}
                aria-label={`Close session ${index + 1}`}
                className="opacity-70"
                onClick={(event) => {
                  event.stopPropagation();
                  closeSession(session.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") closeSession(session.id);
                }}
              >
                ×
              </span>
            ) : null}
          </button>
        ))}
        <button
          type="button"
          onClick={addSession}
          disabled={sessions.length >= 3}
          className="ml-auto h-8 rounded-full px-3 text-xs text-muted disabled:opacity-40"
        >
          + session
        </button>
      </div>
      <div
        ref={scroller}
        className="term-scroll h-[min(32rem,70dvh)] overflow-y-auto bg-black/50 px-3 py-3 font-sans text-base leading-relaxed sm:text-sm"
        onClick={() => field.current?.focus()}
      >
        {current.lines.map((line, index) => (
          <div key={`${current.id}-${index}`} className={line.kind === "in" ? "whitespace-pre-wrap text-rose" : "whitespace-pre-wrap text-fg"}>
            {line.text || " "}
          </div>
        ))}
        <form
          className="flex"
          onSubmit={(event) => {
            event.preventDefault();
            submit(current.draft);
          }}
        >
          <label className="sr-only" htmlFor={`term-${current.id}`}>
            Terminal command
          </label>
          <span className="shrink-0 text-accent">{promptOf(current.shell)}</span>
          <input
            ref={field}
            id={`term-${current.id}`}
            value={current.draft}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none"
            onChange={(event) => {
              const value = event.target.value;
              patch(current.id, (item) => ({ ...item, draft: value }));
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowUp") {
                event.preventDefault();
                const next = Math.max(0, current.hist - 1);
                patch(current.id, (item) => ({ ...item, hist: next, draft: item.history[next] ?? "" }));
              } else if (event.key === "ArrowDown") {
                event.preventDefault();
                const next = Math.min(current.history.length, current.hist + 1);
                patch(current.id, (item) => ({ ...item, hist: next, draft: item.history[next] ?? "" }));
              }
            }}
          />
        </form>
      </div>
    </div>
  );
}

function promptOf(shell: ShellState) {
  const sign = shell.user === "root" ? "#" : "$";
  return `${shell.user}@current:${pathOf(shell.cwd)}${sign} `;
}
