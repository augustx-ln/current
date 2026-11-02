import { useEffect, useSyncExternalStore, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { loadDesk } from "@/lib/desk.functions";
import { readDesk, setDeskSync, unionDesk, writeDesk } from "@/lib/study";

let where = "On this browser";
const listeners = new Set<() => void>();

function setWhere(next: string) {
  where = next;
  listeners.forEach((listener) => listener());
}

export function useDeskWhere() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => where,
    () => "On this browser",
  );
}

export function DeskSync() {
  const { user, isPending } = useCurrentUserState();

  useEffect(() => {
    if (!authEnabled || isPending || !user || user.isDevFallback) {
      setDeskSync(false);
      setWhere("On this browser");
      return;
    }
    let cancel = false;
    setDeskSync(true);
    setWhere("Saving…");
    const local = readDesk();
    void loadDesk()
      .then((remote) => {
        if (cancel) return;
        const merged = remote ? unionDesk(local, remote) : local;
        writeDesk(merged, JSON.stringify(merged) !== JSON.stringify(remote));
        setWhere("Saved to this account");
      })
      .catch(() => {
        if (!cancel) setWhere("On this browser");
      });
    return () => {
      cancel = true;
    };
  }, [isPending, user]);

  return null;
}

export function AccountButton() {
  const { user, isPending } = useCurrentUserState();
  const signedIn = authEnabled && !isPending && Boolean(user && !user.isDevFallback);
  const [menu, setMenu] = useState(false);
  const [busy, setBusy] = useState(false);
  const label = user?.displayName ?? "Account";

  if (isPending) {
    return <div className="hidden h-11 w-24 animate-pulse rounded-full bg-white/10 md:block" aria-hidden />;
  }

  if (signedIn) {
    return (
      <div className="relative hidden md:block">
        <button
          type="button"
          className="inline-flex h-11 max-w-40 items-center gap-2 rounded-full border border-white/15 px-3 text-sm"
          aria-expanded={menu}
          onClick={() => setMenu((value) => !value)}
        >
          <span className="lamp size-2 shrink-0 rounded-full bg-accent" aria-hidden />
          <span className="truncate">{label}</span>
        </button>
        {menu ? (
          <div className="panel no-pop stagger absolute right-0 z-50 mt-2 grid w-44 p-1">
            <button
              type="button"
              className="rounded-lg px-3 py-3 text-left text-sm text-muted"
              disabled={busy}
              onClick={() => {
                setBusy(true);
                void signOut().catch(() => setBusy(false));
              }}
            >
              {busy ? "Signing out…" : "Sign out"}
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Link to="/login" className="hidden h-11 items-center gap-2 rounded-full border border-white/15 px-3 text-sm md:inline-flex">
      <LogIn className="size-4" aria-hidden />
      Sign in
    </Link>
  );
}

export function MobileAccount({ onDone }: { onDone: () => void }) {
  const { user, isPending } = useCurrentUserState();
  const signedIn = authEnabled && !isPending && Boolean(user && !user.isDevFallback);
  const [busy, setBusy] = useState(false);

  if (isPending) return <div className="h-12 animate-pulse rounded-full bg-white/10" aria-hidden />;

  if (signedIn) {
    return (
      <button
        type="button"
        className="h-12 rounded-full border border-white/15 text-sm"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          void signOut().catch(() => setBusy(false));
        }}
      >
        {busy ? "Signing out…" : `Sign out${user?.displayName ? ` · ${user.displayName}` : ""}`}
      </button>
    );
  }

  return (
    <Link to="/login" onClick={onDone} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 text-sm">
      <LogIn className="size-4" aria-hidden /> Sign in
    </Link>
  );
}
