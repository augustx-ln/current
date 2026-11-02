import { Link, Navigate, useRouterState } from "@tanstack/react-router";
import { Menu, TerminalSquare, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AccountButton, DeskSync, MobileAccount } from "@/components/account";
import { SearchBox } from "@/components/search-box";
import { authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

const NAV = [
  { to: "/phases", label: "Phases" },
  { to: "/tools", label: "Tools" },
  { to: "/linux-commands", label: "Commands" },
  { to: "/learn", label: "Learn" },
  { to: "/terminal-sandbox", label: "Terminal" },
  { to: "/desk", label: "Desk" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigateAway = useRouterState({ select: (state) => state.location.pathname });
  const pathname = navigateAway;
  const navRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const active = NAV.find((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))?.to;
  const { user, isPending } = useCurrentUserState();
  const pending = authEnabled && isPending;
  const signedIn = !authEnabled || Boolean(user && !user.isDevFallback);
  const gate = pathname === "/" || pathname === "/login" || pathname === "/disclaimer";
  const showApp = signedIn && !pending;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav || !active) {
      setPill(null);
      return;
    }
    const link = nav.querySelector<HTMLElement>(`[data-nav="${active}"]`);
    if (!link) return;
    setPill({ left: link.offsetLeft, width: link.offsetWidth });
  }, [active, pathname, showApp]);

  const [shownFor, setShownFor] = useState(pathname);
  const [enter, setEnter] = useState("");
  if (shownFor !== pathname) {
    setShownFor(pathname);
    setEnter(enterClass(shownFor, pathname));
  }

  return (
    <div className="min-h-screen">
      <header
        className={`topbar sticky top-0 z-40 border-b pt-[env(safe-area-inset-top)] ${
          scrolled || open ? "topbar-scrolled border-white/15" : "border-transparent"
        }`}
      >
        <DeskSync />
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="relative grid size-9 place-items-center" aria-hidden>
              <span className="lamp size-2.5 rounded-full bg-accent" />
            </span>
            <span className="font-display text-lg leading-none tracking-tight">Current</span>
          </Link>
          {showApp ? (
            <nav ref={navRef} className="relative ml-4 hidden items-center lg:flex" aria-label="Primary">
              {pill ? <span className="nav-pill" style={{ left: pill.left, width: pill.width }} aria-hidden /> : null}
              {NAV.map((item) => {
                const on = item.to === active;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    data-nav={item.to}
                    className={`relative z-10 rounded-full px-3 py-2 text-sm transition-colors duration-200 ${on ? "text-fg" : "text-muted hover:text-fg"}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          ) : null}
          {showApp ? <SearchBox /> : null}
          {showApp ? <AccountButton /> : pending ? <div className="hidden h-11 w-24 animate-pulse rounded-full bg-white/10 md:block" aria-hidden /> : null}
          {showApp ? (
            <button
              type="button"
              className="ml-auto inline-flex size-11 items-center justify-center rounded-md border border-line md:ml-0 lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          ) : null}
        </div>
        {open && showApp ? (
          <div className="menu-drop border-t border-white/10 px-3 py-3 lg:hidden">
            <SearchBox compact />
            <div className="mt-3">
              <MobileAccount onDone={() => setOpen(false)} />
            </div>
            <div className="stagger mt-2 grid gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`min-h-12 rounded-md px-2 py-3 text-sm ${item.to === active ? "text-accent" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </header>
      <div className="overflow-x-clip">
        <main key={pathname} className={`${enter} ${pathname === "/" ? "w-full" : "mx-auto w-full max-w-6xl px-4 py-6 sm:py-8"}`}>
          {gate ? children : pending ? <div className="h-[50dvh]" /> : signedIn ? children : <Navigate to="/" />}
        </main>
      </div>
      <footer className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl leading-none">Current</p>
            <p className="mt-2 text-sm text-muted">A lab that never leaves the browser. Creator Aug.</p>
          </div>
          {showApp ? (
            <>
              <FooterCol title="Study" links={[["/tools", "Tools"], ["/linux-commands", "Commands"], ["/learn", "Articles"]]} />
              <FooterCol
                title="Practice"
                links={[
                  ["/phases", "Phases"],
                  ["/terminal-sandbox", "Terminal sandbox"],
                  ["/desk", "Your desk"],
                ]}
              />
              <FooterCol
                title="Desk"
                links={[
                  ["/about", "About"],
                  ["/authors", "Authors"],
                  ["/contact", "Contact"],
                  ["/disclaimer", "Disclaimer"],
                ]}
              />
            </>
          ) : null}
        </div>
        <p className="border-t border-line px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-center text-xs text-muted">
          Current by Aug. Simulated lab only. Practice on systems you are allowed to test.
        </p>
      </footer>
    </div>
  );
}

function enterClass(from: string, to: string) {
  const a = sectionIndex(from);
  const b = sectionIndex(to);
  if (to === "/") return from === "/" ? "page-fade" : "page-land";
  if (a === b) return "page-fade";
  return b > a ? "page-right" : "page-left";
}

function sectionIndex(path: string) {
  if (path === "/") return 0;
  const found = NAV.findIndex((item) => path === item.to || path.startsWith(`${item.to}/`));
  return found === -1 ? 0 : found + 1;
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: ["/tools" | "/linux-commands" | "/learn" | "/phases" | "/terminal-sandbox" | "/desk" | "/about" | "/authors" | "/contact" | "/disclaimer", string][];
}) {
  return (
    <div>
      <p className="text-xs tracking-widest text-cyan uppercase">{title}</p>
      <ul className="stagger mt-3 grid gap-2">
        {links.map(([to, label]) => (
          <li key={label}>
            <Link to={to} className="text-sm text-muted hover:text-fg">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PageHeading({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="mb-8 max-w-3xl">
      <p className="mb-2 flex items-center gap-2 text-xs tracking-widest text-accent uppercase">
        <TerminalSquare className="size-3.5" aria-hidden />
        {kicker}
      </p>
      <h1 className="rise font-display text-4xl leading-tight font-medium sm:text-5xl">{title}</h1>
      {lede ? <p className="mt-3 text-sm text-muted sm:text-base">{lede}</p> : null}
    </header>
  );
}
