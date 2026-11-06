const SHORTENERS = new Set(["bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly", "cutt.ly", "rb.gy", "shorturl.at"]);
const RISKY_TLDS = new Set(["zip", "mov", "tk", "ml", "gq", "cf", "ga", "xyz", "top", "click", "country", "gq", "work", "support"]);
const BAIT = ["login", "verify", "secure", "update", "account", "confirm", "password", "wallet", "invoice", "suspend", "unlock", "bank"];

export type UrlRisk = {
  error: string;
  score: number;
  rows: Record<string, string>;
  flags: { points: number; text: string }[];
};

export function analyzeUrl(value: string): UrlRisk {
  const trimmed = value.trim();
  if (!trimmed) return { error: "Paste a URL.", score: 0, rows: {}, flags: [] };
  let url: URL;
  try {
    url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    return { error: "That text is not a URL.", score: 0, rows: {}, flags: [] };
  }

  const flags: { points: number; text: string }[] = [];
  const host = url.hostname.toLowerCase();
  const tld = host.split(".").pop() ?? "";
  const haystack = `${host}${url.pathname}${url.search}`.toLowerCase();

  if (url.protocol === "http:") flags.push({ points: 15, text: "Plain HTTP. A login page on HTTP can be read by anyone on the path." });
  if (url.protocol !== "http:" && url.protocol !== "https:") flags.push({ points: 40, text: `${url.protocol} is not a normal web link. Do not open it from a message.` });
  if (url.username || url.password) flags.push({ points: 35, text: "The URL hides the real host behind a username, often using @." });
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(":")) flags.push({ points: 30, text: "The host is a raw IP address. Real sites almost always use a name." });
  if (host.startsWith("xn--")) flags.push({ points: 25, text: "Punycode. The name may look like a brand and resolve to a different word." });
  if (SHORTENERS.has(host)) flags.push({ points: 20, text: "A shortener hides the destination until after the click." });
  if (RISKY_TLDS.has(tld)) flags.push({ points: 15, text: `.${tld} is often used in throwaway phishing domains.` });
  if ((host.match(/\./g) ?? []).length > 3) flags.push({ points: 10, text: "Many labels. The real site is the registrable name, not the leftmost word." });
  const bait = BAIT.filter((word) => haystack.includes(word));
  if (bait.length) flags.push({ points: 12, text: `Phishing words in the link: ${bait.join(", ")}.` });
  if (url.port && url.port !== "80" && url.port !== "443") flags.push({ points: 8, text: `Unusual port ${url.port}.` });
  if (url.href.length > 120) flags.push({ points: 8, text: "Very long. Long query strings are used to hide the host." });

  const score = Math.min(100, flags.reduce((sum, flag) => sum + flag.points, 0));
  return {
    error: "",
    score,
    rows: {
      Protocol: url.protocol.replace(":", ""),
      Host: url.host,
      Path: url.pathname || "/",
      Query: url.search || "(none)",
    },
    flags,
  };
}

export function riskLabel(score: number) {
  if (score >= 50) return "High";
  if (score >= 20) return "Review";
  return "Low";
}
