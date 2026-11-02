import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { articles } from "@/data/articles";
import { commands } from "@/data/commands";
import { phases } from "@/data/phases";
import { tools } from "@/data/tools";

type Hit = { key: string; label: string; hint: string; go: () => void };

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const navigate = useNavigate();
  const box = useRef<HTMLDivElement>(null);
  const listId = useId();

  const hits = useMemo(() => suggest(query, navigate), [query, navigate]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    function onDoc(event: MouseEvent) {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const pick = hits[cursor];
    if (pick && query.trim()) {
      pick.go();
      setOpen(false);
      return;
    }
    void navigate({ to: "/search", search: { q: query.trim() } });
    setOpen(false);
  }

  return (
    <div ref={box} className={compact ? "relative" : "relative ml-auto hidden min-w-0 flex-1 md:block md:max-w-xs"}>
      <form onSubmit={onSubmit}>
        <label className="relative block">
          <span className="sr-only">Search the lab</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            role="combobox"
            aria-expanded={open && hits.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (!hits.length) return;
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setCursor((value) => (value + 1) % hits.length);
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setCursor((value) => (value - 1 + hits.length) % hits.length);
              } else if (event.key === "Escape") setOpen(false);
            }}
            placeholder={compact ? "Search" : "Search tools, commands…"}
            suppressHydrationWarning
            className="h-11 w-full rounded-full border border-white/15 bg-white/5 pr-3 pl-9 text-base text-fg backdrop-blur placeholder:text-muted md:text-sm"
          />
        </label>
      </form>
      {open && query.trim() && hits.length ? (
        <ul id={listId} role="listbox" className="panel no-pop stagger absolute z-50 mt-2 w-full overflow-hidden p-1">
          {hits.map((hit, index) => (
            <li key={hit.key} role="option" aria-selected={index === cursor}>
              <button
                type="button"
                className={`flex w-full flex-col rounded-lg px-3 py-2 text-left ${index === cursor ? "bg-accent/15" : ""}`}
                onMouseEnter={() => setCursor(index)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  hit.go();
                  setOpen(false);
                }}
              >
                <span className="text-sm text-fg">{hit.label}</span>
                <span className="text-xs text-muted">{hit.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function suggest(query: string, navigate: ReturnType<typeof useNavigate>): Hit[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const hits: Hit[] = [];
  for (const tool of tools) {
    if (`${tool.name} ${tool.tags.join(" ")} ${tool.category}`.toLowerCase().includes(needle)) {
      hits.push({
        key: `t-${tool.slug}`,
        label: tool.name,
        hint: `Tool · ${tool.category}`,
        go: () => void navigate({ to: "/tools/$slug", params: { slug: tool.slug } }),
      });
    }
  }
  for (const command of commands) {
    if (`${command.name} ${command.summary}`.toLowerCase().includes(needle)) {
      hits.push({
        key: `c-${command.name}`,
        label: command.name,
        hint: `Command · ${command.category}`,
        go: () => void navigate({ to: "/linux-commands" }),
      });
    }
  }
  for (const article of articles) {
    if (`${article.title} ${article.summary}`.toLowerCase().includes(needle)) {
      hits.push({
        key: `a-${article.slug}`,
        label: article.title,
        hint: `Article · ${article.topic}`,
        go: () => void navigate({ to: "/learn/$slug", params: { slug: article.slug } }),
      });
    }
  }
  for (const phase of phases) {
    if (`${phase.name} ${phase.summary}`.toLowerCase().includes(needle)) {
      hits.push({
        key: `p-${phase.slug}`,
        label: phase.name,
        hint: `Phase · ${phase.phase}`,
        go: () => void navigate({ to: "/phases/$slug", params: { slug: phase.slug } }),
      });
    }
  }
  return hits.slice(0, 7);
}
