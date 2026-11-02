import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

export function ChipBar({ value, children }: { value: string; children: ReactNode }) {
  const bar = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const node = bar.current;
    if (!node) return;
    const chip = node.querySelector<HTMLElement>(`[data-chip="${CSS.escape(value)}"]`);
    if (!chip) {
      setPill(null);
      return;
    }
    setPill({ left: chip.offsetLeft, width: chip.offsetWidth });
    chip.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [value]);

  return (
    <div ref={bar} className="relative mb-4 flex gap-1 overflow-x-auto pb-1">
      {pill ? <span className="nav-pill" style={{ left: pill.left, width: pill.width }} aria-hidden /> : null}
      {children}
    </div>
  );
}

export function chipClass(on: boolean) {
  return `relative z-10 inline-flex h-11 shrink-0 items-center rounded-full px-3 text-sm ${on ? "text-fg" : "text-muted"}`;
}
