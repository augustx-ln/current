import { useMemo, useState } from "react";
import { analyzeUrl, riskLabel } from "@/lib/url-risk";

const field = "w-full rounded-md border border-line bg-bg px-3 py-3 text-sm text-fg placeholder:text-muted";
const button = "inline-flex h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink";

const HEADER_CHECKS = ["strict-transport-security", "content-security-policy", "x-content-type-options", "referrer-policy", "x-frame-options", "permissions-policy"];

export function DnsLab() {
  const [name, setName] = useState("example.com");
  const [type, setType] = useState("A");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<{ data: string; ttl: number }[]>([]);

  async function run() {
    const host = name.trim().toLowerCase().replace(/\.$/, "");
    if (!/^[a-z0-9.-]+$/.test(host) || !host.includes(".")) {
      setError("Enter a domain such as example.com.");
      setRows([]);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(host)}&type=${encodeURIComponent(type)}`, {
        headers: { Accept: "application/dns-json" },
      });
      if (!response.ok) throw new Error(`Resolver answered ${response.status}.`);
      const body = (await response.json()) as { Status?: number; Answer?: { data: string; TTL: number }[] };
      if (body.Status === 3) {
        setRows([]);
        setError("NXDOMAIN. That name is not published.");
      } else {
        setRows((body.Answer ?? []).map((row) => ({ data: row.data, ttl: row.TTL })));
        if (!body.Answer?.length) setError("No answers for that type.");
      }
    } catch {
      setError("The public resolver did not answer. The lookup stays in your browser. Nothing was scanned.");
      setRows([]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_8rem_auto]">
        <input className={field} value={name} onChange={(event) => setName(event.target.value)} aria-label="Domain" />
        <select className={field} value={type} onChange={(event) => setType(event.target.value)} aria-label="Record type">
          {["A", "AAAA", "MX", "TXT", "NS", "CNAME"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <button type="button" className={button} disabled={busy} onClick={() => void run()}>
          {busy ? "Looking up…" : "Look up"}
        </button>
      </div>
      {error ? <p className="text-sm text-accent">{error}</p> : null}
      <ul className="grid gap-2">
        {rows.map((row) => (
          <li key={`${row.data}-${row.ttl}`} className="rounded-md border border-line bg-bg px-3 py-2 text-sm break-all">
            {row.data}
            <span className="mt-1 block text-xs text-muted">TTL {row.ttl}s</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Rdap = {
  ldhName?: string;
  handle?: string;
  name?: string;
  country?: string;
  type?: string;
  startAddress?: string;
  endAddress?: string;
  nameservers?: { ldhName?: string }[];
  entities?: { roles?: string[]; vcardArray?: [string, [string, Record<string, string>, string, string][]] }[];
  events?: { eventAction?: string; eventDate?: string }[];
};

function registrar(body: Rdap) {
  const entity = body.entities?.find((item) => item.roles?.includes("registrar"));
  const fn = entity?.vcardArray?.[1]?.find((row) => row[0] === "fn");
  return fn?.[3] ?? "";
}

function eventDate(body: Rdap, action: string) {
  return body.events?.find((event) => event.eventAction === action)?.eventDate ?? "";
}

export function WhoisLab() {
  const [name, setName] = useState("example.com");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<Record<string, string>>({});

  async function run() {
    const host = name.trim().toLowerCase().replace(/\.$/, "");
    if (!/^[a-z0-9.-]+$/.test(host)) {
      setError("Enter a domain.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(host)}`);
      if (!response.ok) throw new Error(String(response.status));
      const body = (await response.json()) as Rdap;
      setRows({
        Domain: body.ldhName ?? host,
        Registrar: registrar(body) || "(not published)",
        Created: eventDate(body, "registration") || "(none)",
        Expires: eventDate(body, "expiration") || "(none)",
        Nameservers: (body.nameservers ?? []).map((item) => item.ldhName).filter(Boolean).join(", ") || "(none)",
      });
    } catch {
      setError("No public registration record came back. Some registries block browser reads.");
      setRows({});
    } finally {
      setBusy(false);
    }
  }

  return <LookupForm label="Domain" value={name} setValue={setName} busy={busy} error={error} rows={rows} onRun={() => void run()} />;
}

export function AgeLab() {
  const [name, setName] = useState("example.com");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<Record<string, string>>({});

  async function run() {
    const host = name.trim().toLowerCase().replace(/\.$/, "");
    if (!/^[a-z0-9.-]+$/.test(host)) {
      setError("Enter a domain.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(host)}`);
      if (!response.ok) throw new Error(String(response.status));
      const body = (await response.json()) as Rdap;
      const created = eventDate(body, "registration");
      const expires = eventDate(body, "expiration");
      const createdAt = created ? new Date(created) : null;
      const expiresAt = expires ? new Date(expires) : null;
      const ageDays = createdAt ? Math.floor((Date.now() - createdAt.getTime()) / 86400000) : null;
      const leftDays = expiresAt ? Math.floor((expiresAt.getTime() - Date.now()) / 86400000) : null;
      setRows({
        Created: created || "(none)",
        Age: ageDays == null ? "(unknown)" : `${Math.floor(ageDays / 365)} years, ${ageDays % 365} days`,
        Expires: expires || "(none)",
        Remaining: leftDays == null ? "(unknown)" : `${leftDays} days`,
      });
    } catch {
      setError("The registry did not return dates to this browser.");
      setRows({});
    } finally {
      setBusy(false);
    }
  }

  return <LookupForm label="Domain" value={name} setValue={setName} busy={busy} error={error} rows={rows} onRun={() => void run()} />;
}

export function IpLab() {
  const [name, setName] = useState("1.1.1.1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<Record<string, string>>({});

  async function run() {
    const ip = name.trim();
    if (!/^[0-9a-f:.]+$/i.test(ip)) {
      setError("Enter an IP address.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`https://rdap.org/ip/${encodeURIComponent(ip)}`);
      if (!response.ok) throw new Error(String(response.status));
      const body = (await response.json()) as Rdap;
      setRows({
        Name: body.name || "(none)",
        Handle: body.handle || "(none)",
        Country: body.country || "(none)",
        Type: body.type || "(none)",
        Range: body.startAddress && body.endAddress ? `${body.startAddress} – ${body.endAddress}` : "(none)",
      });
    } catch {
      setError("No registry record came back for that address.");
      setRows({});
    } finally {
      setBusy(false);
    }
  }

  return <LookupForm label="IP address" value={name} setValue={setName} busy={busy} error={error} rows={rows} onRun={() => void run()} />;
}

function LookupForm({
  label,
  value,
  setValue,
  busy,
  error,
  rows,
  onRun,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  busy: boolean;
  error: string;
  rows: Record<string, string>;
  onRun: () => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input className={field} value={value} aria-label={label} onChange={(event) => setValue(event.target.value)} />
        <button type="button" className={button} disabled={busy} onClick={onRun}>
          {busy ? "Looking up…" : "Look up"}
        </button>
      </div>
      {error ? <p className="text-sm text-accent">{error}</p> : null}
      <dl className="grid gap-2 text-sm">
        {Object.entries(rows).map(([key, item]) => (
          <div key={key} className="rounded-md border border-line bg-bg px-3 py-2">
            <dt className="text-xs text-muted">{key}</dt>
            <dd className="break-all">{item}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function SslLab() {
  const [raw, setRaw] = useState("");
  const parsed = useMemo(() => readCert(raw), [raw]);
  return (
    <div className="grid gap-4">
      <textarea className={field} rows={8} value={raw} placeholder="Paste certificate text, including Subject and Not After" onChange={(event) => setRaw(event.target.value)} />
      {parsed.error ? <p className="text-sm text-muted">{parsed.error}</p> : null}
      <dl className="grid gap-2 text-sm">
        {Object.entries(parsed.rows).map(([key, item]) => (
          <div key={key} className="rounded-md border border-line bg-bg px-3 py-2">
            <dt className="text-xs text-muted">{key}</dt>
            <dd className="break-all">{item}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function readCert(raw: string) {
  const text = raw.trim();
  if (!text) return { error: "Paste the text of a certificate you already have. This page does not open a connection.", rows: {} as Record<string, string> };
  const grab = (label: string) => text.match(new RegExp(`${label}\\s*[:=]\\s*(.+)`, "i"))?.[1]?.trim() ?? "";
  const rows = {
    Subject: grab("Subject"),
    Issuer: grab("Issuer"),
    "Not before": grab("Not Before"),
    "Not after": grab("Not After"),
  };
  const found = Object.values(rows).some(Boolean);
  return { error: found ? "" : "No Subject, Issuer, or date lines were in that text.", rows: found ? rows : {} };
}

export function ScoreLab() {
  const [url, setUrl] = useState("https://login.example.com/verify");
  const [headers, setHeaders] = useState("strict-transport-security: max-age=63072000\nx-content-type-options: nosniff");
  const risk = useMemo(() => analyzeUrl(url), [url]);
  const present = useMemo(() => {
    const names = new Set(
      headers
        .split(/\r?\n/)
        .map((line) => line.split(":")[0]?.trim().toLowerCase())
        .filter(Boolean),
    );
    return HEADER_CHECKS.filter((name) => names.has(name));
  }, [headers]);

  return (
    <div className="grid gap-4">
      <input className={field} value={url} aria-label="URL" onChange={(event) => setUrl(event.target.value)} />
      <textarea className={field} rows={5} value={headers} aria-label="Headers" onChange={(event) => setHeaders(event.target.value)} />
      <div className="grid gap-3 sm:grid-cols-2">
        <p className="rounded-md border border-line bg-bg px-3 py-3 text-sm">
          Link shape <span className="text-accent">{risk.error ? "—" : riskLabel(risk.score)}</span>
          <span className="mt-1 block text-muted">{risk.error || `${risk.score} risk points. ${risk.flags.length} flags.`}</span>
        </p>
        <p className="rounded-md border border-line bg-bg px-3 py-3 text-sm">
          Headers <span className="text-accent">{present.length}/{HEADER_CHECKS.length}</span>
          <span className="mt-1 block text-muted">Present: {present.join(", ") || "none of the usual six"}.</span>
        </p>
      </div>
    </div>
  );
}

export function WordlistLab() {
  const [word, setWord] = useState("autumn");
  const [lines, setLines] = useState<string[]>([]);

  function run() {
    const base = word.trim();
    if (!base || base.length > 32) {
      setLines([]);
      return;
    }
    const titled = base[0]!.toUpperCase() + base.slice(1);
    const leet = base.replace(/a/gi, "4").replace(/e/gi, "3").replace(/i/gi, "1").replace(/o/gi, "0").replace(/s/gi, "5");
    const suffixes = ["", "1", "12", "123", "!", "2024", "2025", "2026"];
    const out = new Set<string>();
    for (const suffix of suffixes) {
      out.add(base + suffix);
      out.add(titled + suffix);
      out.add(leet + suffix);
      out.add(base + suffix + "!");
    }
    setLines([...out].slice(0, 80));
  }

  return (
    <div className="grid gap-4">
      <p className="text-xs text-muted">For a form you own. The list stops at 80 obvious variants.</p>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input className={field} value={word} aria-label="Base word" onChange={(event) => setWord(event.target.value)} />
        <button type="button" className={button} onClick={run}>
          Generate
        </button>
      </div>
      {lines.length ? (
        <pre className="max-h-72 overflow-auto rounded-md border border-line bg-bg p-3 text-xs leading-relaxed">{lines.join("\n")}</pre>
      ) : null}
    </div>
  );
}
