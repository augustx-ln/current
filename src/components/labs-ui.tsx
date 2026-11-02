import { useMemo, useState } from "react";
import { labBySlug } from "@/data/labs";

const field =
  "w-full rounded-md border border-line bg-bg px-3 py-3 text-sm text-fg placeholder:text-muted";
const button =
  "inline-flex h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink";

export function LabView({ slug }: { slug: string }) {
  const lab = labBySlug(slug);
  if (!lab) return null;
  return (
    <div>
      <p className="text-xs tracking-widest text-cyan uppercase">{lab.group}</p>
      <h1 className="mt-2 font-display text-3xl font-bold">{lab.name}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">{lab.summary}</p>
      <div className="panel mt-6 p-4 sm:p-6">
        <LabBody slug={slug} />
      </div>
    </div>
  );
}

function LabBody({ slug }: { slug: string }) {
  switch (slug) {
    case "hash-generator":
      return <HashLab />;
    case "base64":
      return <Base64Lab />;
    case "jwt-decoder":
      return <JwtLab />;
    case "uuid-generator":
      return <UuidLab />;
    case "json-formatter":
      return <JsonLab />;
    case "regex-tester":
      return <RegexLab />;
    case "email-validator":
      return <EmailLab />;
    case "password-strength-checker":
      return <PasswordLab />;
    case "subnet-calculator":
      return <SubnetLab />;
    case "port-lab":
      return <PortLab />;
    case "security-headers":
      return <HeadersLab />;
    case "url-anatomy":
      return <UrlLab />;
    case "permissions":
      return <PermLab />;
    case "cipher-bench":
      return <CipherLab />;
    case "http-status":
      return <StatusLab />;
    case "quiz":
      return <QuizLab />;
    default:
      return <p className="text-sm text-muted">This lab is not wired up.</p>;
  }
}

async function digest(algorithm: "SHA-256" | "SHA-512", text: string) {
  const bytes = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algorithm, bytes);
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function HashLab() {
  const [text, setText] = useState("authorized-lab");
  const [sha256, setSha256] = useState("");
  const [sha512, setSha512] = useState("");
  const [error, setError] = useState("");

  async function run() {
    try {
      setError("");
      setSha256(await digest("SHA-256", text));
      setSha512(await digest("SHA-512", text));
    } catch {
      setError("This browser could not compute a digest.");
    }
  }

  return (
    <div className="grid gap-4">
      <label className="grid gap-2 text-sm">
        Text
        <textarea className={field} rows={4} value={text} onChange={(event) => setText(event.target.value)} />
      </label>
      <button type="button" className={button} onClick={() => void run()}>
        Hash locally
      </button>
      {error ? <p className="text-sm text-accent">{error}</p> : null}
      <Output label="SHA-256" value={sha256} />
      <Output label="SHA-512" value={sha512} />
      <p className="text-xs text-muted">Integrity fingerprints only. Do not store passwords this way.</p>
    </div>
  );
}

function Base64Lab() {
  const [text, setText] = useState("current");
  const [encoded, setEncoded] = useState("");
  const [hex, setHex] = useState("");
  const [error, setError] = useState("");

  function encode() {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    setEncoded(btoa(binary));
    setHex([...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join(" "));
    setError("");
  }

  function decode() {
    try {
      const binary = atob(text.trim());
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      setEncoded(new TextDecoder().decode(bytes));
      setHex("decoded into the box above the hex line");
      setError("");
    } catch {
      setError("That is not valid Base64.");
    }
  }

  return (
    <div className="grid gap-4">
      <label className="grid gap-2 text-sm">
        Input
        <textarea className={field} rows={4} value={text} onChange={(event) => setText(event.target.value)} />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={button} onClick={encode}>
          Encode
        </button>
        <button type="button" className="inline-flex h-11 items-center rounded-md border border-line px-4 text-sm" onClick={decode}>
          Decode Base64
        </button>
      </div>
      {error ? <p className="text-sm text-accent">{error}</p> : null}
      <Output label="Base64 / decoded text" value={encoded} />
      <Output label="Hex" value={hex} />
    </div>
  );
}

function b64url(segment: string) {
  const pad = segment.length % 4 === 0 ? "" : "=".repeat(4 - (segment.length % 4));
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(padded), (char) => char.charCodeAt(0)))) as unknown;
}

function JwtLab() {
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsYWItdXNlciIsInJvbGUiOiJyZWFkZXIifQ.signature-not-checked",
  );
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [note, setNote] = useState("");

  function decode() {
    const parts = token.trim().split(".");
    if (parts.length < 2) {
      setNote("A JWT has three parts separated by dots. This one does not.");
      setHeader("");
      setPayload("");
      return;
    }
    try {
      const parsedHeader = b64url(parts[0] ?? "");
      const parsedPayload = b64url(parts[1] ?? "");
      setHeader(JSON.stringify(parsedHeader, null, 2));
      setPayload(JSON.stringify(parsedPayload, null, 2));
      const alg =
        parsedHeader && typeof parsedHeader === "object" && "alg" in parsedHeader
          ? String((parsedHeader as { alg: unknown }).alg)
          : "";
      setNote(
        alg.toLowerCase() === "none"
          ? "alg is none. Treat this token as untrusted. This lab never checks a signature."
          : "Decoded only. The signature was not verified, so do not trust the claims.",
      );
    } catch {
      setNote("Header or payload was not valid JSON Base64url.");
      setHeader("");
      setPayload("");
    }
  }

  return (
    <div className="grid gap-4">
      <label className="grid gap-2 text-sm">
        Token
        <textarea className={field} rows={4} value={token} onChange={(event) => setToken(event.target.value)} />
      </label>
      <button type="button" className={button} onClick={decode}>
        Decode
      </button>
      {note ? <p className="text-sm text-cyan">{note}</p> : null}
      <Output label="Header" value={header} />
      <Output label="Payload" value={payload} />
    </div>
  );
}

function UuidLab() {
  const [rows, setRows] = useState<string[]>([]);
  return (
    <div className="grid gap-4">
      <button
        type="button"
        className={button}
        onClick={() => setRows((current) => [crypto.randomUUID(), ...current].slice(0, 8))}
      >
        Generate UUID
      </button>
      <ul className="grid gap-2 font-mono text-sm">
        {rows.map((row) => (
          <li key={row} className="rounded-md border border-line bg-bg px-3 py-2">
            {row}
          </li>
        ))}
      </ul>
    </div>
  );
}

function JsonLab() {
  const [text, setText] = useState('{"tool":"nmap","ports":[22,80]}');
  const [out, setOut] = useState("");
  const [error, setError] = useState("");

  function pretty(space: number) {
    try {
      setOut(JSON.stringify(JSON.parse(text), null, space));
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Invalid JSON");
      setOut("");
    }
  }

  return (
    <div className="grid gap-4">
      <textarea className={field} rows={8} value={text} onChange={(event) => setText(event.target.value)} />
      <div className="flex flex-wrap gap-2">
        <button type="button" className={button} onClick={() => pretty(2)}>
          Pretty
        </button>
        <button type="button" className="inline-flex h-11 items-center rounded-md border border-line px-4 text-sm" onClick={() => pretty(0)}>
          Minify
        </button>
      </div>
      {error ? <p className="text-sm text-accent">{error}</p> : null}
      <Output label="Result" value={out} />
    </div>
  );
}

function RegexLab() {
  const [pattern, setPattern] = useState("\\bport\\s+(\\d+)");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("open port 22\nopen port 443\nclosed port 23");
  const matches = useMemo(() => {
    if (pattern.length > 80) return { error: "Keep the pattern under 80 characters.", list: [] as string[] };
    try {
      const expression = new RegExp(pattern, flags.replace(/[^gimsuy]/g, ""));
      const list = text.match(expression) ?? [];
      return { error: "", list: list.slice(0, 50) };
    } catch (reason) {
      return { error: reason instanceof Error ? reason.message : "Bad pattern", list: [] as string[] };
    }
  }, [pattern, flags, text]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_6rem]">
        <input className={field} value={pattern} onChange={(event) => setPattern(event.target.value)} aria-label="Pattern" />
        <input className={field} value={flags} onChange={(event) => setFlags(event.target.value)} aria-label="Flags" />
      </div>
      <textarea className={field} rows={5} value={text} onChange={(event) => setText(event.target.value)} />
      {matches.error ? <p className="text-sm text-accent">{matches.error}</p> : null}
      <p className="text-sm text-muted">{matches.list.length} match(es)</p>
      <ul className="grid gap-2 text-sm">
        {matches.list.map((item, index) => (
          <li key={`${item}-${index}`} className="rounded-md border border-line bg-bg px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

const TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmal.com": "gmail.com",
  "hotnail.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "yaho.com": "yahoo.com",
};

function EmailLab() {
  const [email, setEmail] = useState("student@lab.test");
  const verdict = useMemo(() => {
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "That shape is not an email address.";
    const domain = value.split("@")[1]?.toLowerCase() ?? "";
    if (TYPOS[domain]) return `Looks like a typo. Did you mean ${TYPOS[domain]}?`;
    if (domain.endsWith(".test") || domain.endsWith(".invalid") || domain.endsWith(".example")) {
      return "Syntax is fine. The domain is reserved for documentation, so it will not receive mail.";
    }
    return "Syntax looks plausible. This does not prove the mailbox exists.";
  }, [email]);

  return (
    <div className="grid gap-4">
      <input className={field} value={email} onChange={(event) => setEmail(event.target.value)} aria-label="Email" />
      <p className="text-sm">{verdict}</p>
    </div>
  );
}

const COMMON = new Set(["password", "123456", "12345678", "qwerty", "letmein", "admin", "welcome", "kali"]);

function PasswordLab() {
  const [password, setPassword] = useState("");
  const report = useMemo(() => {
    const length = password.length;
    let pool = 0;
    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/\d/.test(password)) pool += 10;
    if (/[^A-Za-z0-9]/.test(password)) pool += 32;
    const entropy = length && pool ? Math.round(length * Math.log2(pool)) : 0;
    const common = COMMON.has(password.toLowerCase());
    const label = common ? "Common" : entropy >= 60 ? "Strong" : entropy >= 36 ? "Fair" : "Weak";
    return { entropy, label, common };
  }, [password]);

  return (
    <div className="grid gap-4">
      <input
        className={field}
        type="password"
        autoComplete="off"
        value={password}
        placeholder="Type a password. It stays in this tab."
        onChange={(event) => setPassword(event.target.value)}
        aria-label="Password"
      />
      <p className="font-display text-2xl text-accent">{report.label}</p>
      <p className="text-sm text-muted">
        Rough entropy {report.entropy} bits
        {report.common ? ". This exact string is on a tiny common-password list." : "."} Nothing was uploaded.
      </p>
    </div>
  );
}

function SubnetLab() {
  const [ip, setIp] = useState("10.10.1.25");
  const [cidr, setCidr] = useState(24);
  const result = useMemo(() => subnet(ip, cidr), [ip, cidr]);
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
        <input className={field} value={ip} onChange={(event) => setIp(event.target.value)} aria-label="IPv4 address" />
        <input
          className={field}
          type="number"
          min={0}
          max={32}
          value={cidr}
          onChange={(event) => setCidr(Number(event.target.value))}
          aria-label="CIDR prefix"
        />
      </div>
      {result.error ? (
        <p className="text-sm text-accent">{result.error}</p>
      ) : (
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          {Object.entries(result.rows).map(([key, value]) => (
            <div key={key} className="rounded-md border border-line bg-bg px-3 py-2">
              <dt className="text-xs text-muted">{key}</dt>
              <dd className="mt-1 font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function subnet(ip: string, prefix: number) {
  const parts = ip.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return { error: "Enter a dotted IPv4 address.", rows: {} as Record<string, string> };
  }
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
    return { error: "Prefix must be 0–32.", rows: {} as Record<string, string> };
  }
  const address = ((parts[0]! << 24) | (parts[1]! << 16) | (parts[2]! << 8) | parts[3]!) >>> 0;
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (address & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const hosts = prefix >= 31 ? (prefix === 32 ? 1 : 2) : 2 ** (32 - prefix) - 2;
  return {
    error: "",
    rows: {
      Network: formatIp(network),
      Broadcast: formatIp(broadcast),
      "First host": prefix >= 31 ? formatIp(network) : formatIp(network + 1),
      "Last host": prefix >= 31 ? formatIp(broadcast) : formatIp(broadcast - 1),
      Mask: formatIp(mask),
      Hosts: String(hosts),
    },
  };
}

function formatIp(value: number) {
  return [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join(".");
}

const PROFILES = [
  {
    id: "web",
    name: "Lab web box",
    blurb: "A single site you installed. HTTPS is up, SSH is limited to the lab LAN.",
    ports: [
      { port: 22, state: "open", service: "ssh", note: "Keys only. Do not leave password auth on." },
      { port: 80, state: "open", service: "http", note: "Redirects to 443 in a tidy setup." },
      { port: 443, state: "open", service: "https", note: "Encrypted does not mean authorized." },
    ],
  },
  {
    id: "locked",
    name: "Hardened host",
    blurb: "Inventory scan of a host that only answers on SSH from a jump box.",
    ports: [
      { port: 22, state: "filtered", service: "ssh", note: "A filter dropped the probe. You did not prove it is closed." },
      { port: 443, state: "closed", service: "https", note: "The host replied that nothing is listening." },
    ],
  },
  {
    id: "risky",
    name: "What not to publish",
    blurb: "A fictional misconfiguration used for discussion. These ports should not face the internet.",
    ports: [
      { port: 21, state: "open", service: "ftp", note: "Cleartext file transfer. Retire it." },
      { port: 23, state: "open", service: "telnet", note: "Cleartext admin. Retire it." },
      { port: 445, state: "open", service: "smb", note: "File sharing does not belong on a public address." },
      { port: 3389, state: "open", service: "rdp", note: "Remote desktop is a standing invite. Put it behind a VPN." },
    ],
  },
];

function PortLab() {
  const [id, setId] = useState(PROFILES[0]!.id);
  const [running, setRunning] = useState(false);
  const [shown, setShown] = useState(0);
  const profile = PROFILES.find((item) => item.id === id) ?? PROFILES[0]!;

  function scan() {
    setShown(0);
    setRunning(true);
    profile.ports.forEach((_, index) => {
      window.setTimeout(() => {
        setShown(index + 1);
        if (index === profile.ports.length - 1) setRunning(false);
      }, 280 * (index + 1));
    });
  }

  return (
    <div className="grid gap-4">
      <p className="text-xs text-muted">Simulated. No packets are sent.</p>
      <div className="flex flex-wrap gap-2">
        {PROFILES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setId(item.id);
              setShown(0);
            }}
            className={`h-11 rounded-md border px-3 text-sm ${item.id === id ? "border-accent text-accent" : "border-line text-muted"}`}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted">{profile.blurb}</p>
      <button type="button" className={button} onClick={scan} disabled={running}>
        {running ? "Reading lab table…" : "Run simulated scan"}
      </button>
      <ul className="grid gap-2">
        {profile.ports.slice(0, shown).map((row) => (
          <li key={row.port} className="rounded-md border border-line bg-bg px-3 py-3 text-sm">
            <span className="text-accent">{row.port}/tcp</span> {row.state} {row.service}
            <span className="mt-1 block text-muted">{row.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const HEADER_CHECKS: { name: string; why: string }[] = [
  { name: "strict-transport-security", why: "Tells browsers to stay on HTTPS." },
  { name: "content-security-policy", why: "Limits where scripts and frames may load from." },
  { name: "x-content-type-options", why: "Stops MIME sniffing. The value you want is nosniff." },
  { name: "referrer-policy", why: "Controls how much of the URL leaks to the next site." },
  { name: "x-frame-options", why: "Old but common clickjacking control. CSP frame-ancestors is better." },
  { name: "permissions-policy", why: "Turns off camera, mic, and other features the page does not need." },
];

function HeadersLab() {
  const [raw, setRaw] = useState(
    "strict-transport-security: max-age=63072000\nx-content-type-options: nosniff\nreferrer-policy: strict-origin-when-cross-origin",
  );
  const present = useMemo(() => {
    const names = new Set(
      raw
        .split(/\r?\n/)
        .map((line) => line.split(":")[0]?.trim().toLowerCase())
        .filter(Boolean),
    );
    return HEADER_CHECKS.map((check) => ({ ...check, ok: names.has(check.name) }));
  }, [raw]);
  const score = present.filter((item) => item.ok).length;

  return (
    <div className="grid gap-4">
      <textarea className={field} rows={6} value={raw} onChange={(event) => setRaw(event.target.value)} aria-label="Response headers" />
      <p className="font-display text-2xl text-accent">
        {score}/{present.length}
      </p>
      <ul className="grid gap-2 text-sm">
        {present.map((item) => (
          <li key={item.name} className="rounded-md border border-line bg-bg px-3 py-2">
            <span className={item.ok ? "text-accent" : "text-muted"}>{item.ok ? "present" : "missing"}</span> {item.name}
            <span className="mt-1 block text-muted">{item.why}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UrlLab() {
  const [value, setValue] = useState("https://login.example.com/reset?next=https://evil.example");
  const parsed = useMemo(() => {
    try {
      const url = new URL(value);
      const flags: string[] = [];
      if (url.protocol === "http:") flags.push("Not HTTPS.");
      if (url.username || url.password) flags.push("Credentials are embedded in the URL. Classic phishing shape.");
      if (/^\d+\.\d+\.\d+\.\d+$/.test(url.hostname)) flags.push("Host is a raw IP address.");
      if ((url.hostname.match(/\./g) ?? []).length > 3) flags.push("Many labels. Check which one is the real registrable domain.");
      if (url.href.includes("@") && !url.username) flags.push("An @ in an odd place can hide the real host.");
      return {
        error: "",
        rows: {
          Protocol: url.protocol,
          Host: url.host,
          Path: url.pathname,
          Query: url.search || "(none)",
        },
        flags,
      };
    } catch {
      return { error: "Not a URL this parser understands.", rows: {} as Record<string, string>, flags: [] as string[] };
    }
  }, [value]);

  return (
    <div className="grid gap-4">
      <input className={field} value={value} onChange={(event) => setValue(event.target.value)} aria-label="URL" />
      {parsed.error ? <p className="text-sm text-accent">{parsed.error}</p> : null}
      <dl className="grid gap-2 text-sm">
        {Object.entries(parsed.rows).map(([key, item]) => (
          <div key={key} className="rounded-md border border-line bg-bg px-3 py-2">
            <dt className="text-xs text-muted">{key}</dt>
            <dd className="break-all">{item}</dd>
          </div>
        ))}
      </dl>
      <ul className="grid gap-2 text-sm text-cyan">
        {parsed.flags.length ? parsed.flags.map((flag) => <li key={flag}>{flag}</li>) : <li>No obvious phishing shape. Still read the host before you type a password.</li>}
      </ul>
    </div>
  );
}

function PermLab() {
  const [bits, setBits] = useState([true, true, false, true, false, false, false, false, false]);
  const labels = ["r", "w", "x", "r", "w", "x", "r", "w", "x"];
  const octal = [0, 1, 2]
    .map((group) =>
      bits.slice(group * 3, group * 3 + 3).reduce((sum, on, index) => sum + (on ? 4 >> index : 0), 0),
    )
    .join("");
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-3 gap-3 text-center text-xs text-muted sm:grid-cols-9">
        {bits.map((on, index) => (
          <button
            key={labels[index]! + index}
            type="button"
            aria-pressed={on}
            onClick={() => setBits((current) => current.map((bit, bitIndex) => (bitIndex === index ? !bit : bit)))}
            className={`h-14 rounded-md border text-lg ${on ? "border-accent text-accent" : "border-line text-muted"}`}
          >
            {on ? labels[index] : "-"}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted">owner · group · others</p>
      <p className="font-display text-3xl text-accent">{octal}</p>
    </div>
  );
}

function CipherLab() {
  const [text, setText] = useState("lab notes");
  const [shift, setShift] = useState(13);
  const out = useMemo(() => caesar(text, shift), [text, shift]);
  return (
    <div className="grid gap-4">
      <textarea className={field} rows={3} value={text} onChange={(event) => setText(event.target.value)} />
      <label className="grid gap-2 text-sm">
        Shift {shift}
        <input type="range" min={0} max={25} value={shift} onChange={(event) => setShift(Number(event.target.value))} />
      </label>
      <Output label="Ciphertext" value={out} />
      <p className="text-xs text-muted">ROT13 is shift 13. This is a toy, not encryption.</p>
    </div>
  );
}

function caesar(text: string, shift: number) {
  return [...text]
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      return char;
    })
    .join("");
}

const STATUSES: Record<string, string> = {
  "200": "OK. The request succeeded.",
  "201": "Created. A new resource exists.",
  "204": "No content. Success, empty body.",
  "301": "Moved permanently. Update your links.",
  "302": "Found. Temporary redirect.",
  "304": "Not modified. Use the cached copy.",
  "400": "Bad request. The server refused the shape of the request.",
  "401": "Unauthorized. Authentication is missing or wrong.",
  "403": "Forbidden. Authenticated, but not allowed.",
  "404": "Not found. Or hidden. Do not assume which.",
  "405": "Method not allowed.",
  "429": "Too many requests. Slow down.",
  "500": "Server error. The failure is on the far side.",
  "502": "Bad gateway. A proxy could not reach the app.",
  "503": "Unavailable. Often maintenance or overload.",
};

function StatusLab() {
  const [code, setCode] = useState("404");
  const known = STATUSES[code.trim()];
  return (
    <div className="grid gap-4">
      <input className={field} value={code} onChange={(event) => setCode(event.target.value)} aria-label="Status code" />
      <p className="text-sm">{known ?? "No note for that code. 1xx is informational, 2xx success, 3xx redirect, 4xx client, 5xx server."}</p>
      <div className="flex flex-wrap gap-2">
        {Object.keys(STATUSES).map((item) => (
          <button key={item} type="button" className="h-10 rounded-md border border-line px-3 text-sm" onClick={() => setCode(item)}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

const QUESTIONS = [
  {
    q: "You find an open admin panel on a company you do not work for. What is the right move?",
    options: ["Try the default password, just to see", "Report it through a published security contact or bug bounty", "Post the URL for clout"],
    answer: 1,
  },
  {
    q: "Which hash is appropriate for storing passwords?",
    options: ["SHA-256 with no salt", "MD5", "argon2, bcrypt, or scrypt with a unique salt"],
    answer: 2,
  },
  {
    q: "What does chmod 600 on a private key mean?",
    options: ["World readable", "Owner can read and write, nobody else", "Everyone can execute it"],
    answer: 1,
  },
  {
    q: "A port scan returns filtered. That means:",
    options: ["The service is definitely closed", "A filter ate the probe, so you do not know", "The host is offline"],
    answer: 1,
  },
  {
    q: "HTTPS guarantees which of these by itself?",
    options: ["The site is trustworthy", "The traffic is encrypted to that host", "The server is patched"],
    answer: 1,
  },
  {
    q: "Where should you practice Nmap first?",
    options: ["A random address from a search engine", "Your lab VM or scanme.nmap.org", "Your neighbor’s router"],
    answer: 1,
  },
  {
    q: "SMB (445) on a public address is:",
    options: ["Normal for a website", "Something to close or strictly limit", "Required for HTTPS"],
    answer: 1,
  },
  {
    q: "OSINT notes should:",
    options: ["Cite the source and the date", "Include every personal detail you can find", "Skip the question you were trying to answer"],
    answer: 0,
  },
];

function QuizLab() {
  const [picked, setPicked] = useState<(number | null)[]>(() => QUESTIONS.map(() => null));
  const [done, setDone] = useState(false);
  const score = picked.reduce<number>((sum, choice, index) => sum + (choice === QUESTIONS[index]?.answer ? 1 : 0), 0);

  return (
    <div className="grid gap-6">
      {QUESTIONS.map((item, index) => (
        <fieldset key={item.q} className="grid gap-2">
          <legend className="text-sm font-medium">
            {index + 1}. {item.q}
          </legend>
          {item.options.map((option, optionIndex) => {
            const selected = picked[index] === optionIndex;
            const show = done && optionIndex === item.answer;
            return (
              <label key={option} className={`flex min-h-11 items-center gap-2 rounded-md border px-3 py-2 text-sm ${show ? "border-accent" : "border-line"}`}>
                <input
                  type="radio"
                  name={`q-${index}`}
                  checked={selected}
                  onChange={() =>
                    setPicked((current) => current.map((value, valueIndex) => (valueIndex === index ? optionIndex : value)))
                  }
                />
                {option}
              </label>
            );
          })}
        </fieldset>
      ))}
      <button
        type="button"
        className={button}
        onClick={() => {
          setDone(true);
          const next = picked.reduce<number>((sum, choice, index) => sum + (choice === QUESTIONS[index]?.answer ? 1 : 0), 0);
          const prior = Number(window.localStorage.getItem("gk-quiz") ?? "0");
          if (next > prior) window.localStorage.setItem("gk-quiz", String(next));
        }}
      >
        Score
      </button>
      {done ? (
        <p className="text-sm">
          {score} / {QUESTIONS.length}. Best on this browser: {window.localStorage.getItem("gk-quiz")}.
        </p>
      ) : null}
    </div>
  );
}

function Output({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="mb-1 text-xs text-muted">{label}</p>
      <pre className="overflow-x-auto rounded-md border border-line bg-bg p-3 text-xs leading-relaxed break-all whitespace-pre-wrap">
        {value}
      </pre>
    </div>
  );
}
