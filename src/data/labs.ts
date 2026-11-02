import type { Lab } from "./types";

export const labs: Lab[] = [
  {
    slug: "hash-generator",
    name: "Hash Generator",
    summary: "SHA-256 and SHA-512 digests computed entirely in the browser.",
    group: "Encoding",
  },
  {
    slug: "base64",
    name: "Base64 & Hex",
    summary: "Encode and decode text. Nothing leaves this page.",
    group: "Encoding",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    summary: "Read header and payload. Signature is not trusted or forged.",
    group: "Encoding",
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    summary: "Mint version-4 identifiers for labs and fixtures.",
    group: "Dev",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    summary: "Pretty-print or minify JSON and catch syntax errors.",
    group: "Dev",
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    summary: "Try a pattern against sample text with match highlights.",
    group: "Dev",
  },
  {
    slug: "email-validator",
    name: "Email Shape Check",
    summary: "Syntax check plus a short list of common domain typos.",
    group: "Dev",
  },
  {
    slug: "password-strength-checker",
    name: "Password Strength",
    summary: "Local entropy estimate. The password is never stored or sent.",
    group: "Defense",
  },
  {
    slug: "subnet-calculator",
    name: "Subnet Calculator",
    summary: "IPv4 network, broadcast, usable range, and mask from a CIDR.",
    group: "Network",
  },
  {
    slug: "port-lab",
    name: "Port Lab",
    summary: "Simulated host profiles. No packets leave the browser.",
    group: "Network",
  },
  {
    slug: "security-headers",
    name: "Security Headers",
    summary: "Paste response headers and score the usual defensive set.",
    group: "Defense",
  },
  {
    slug: "url-anatomy",
    name: "URL Anatomy",
    summary: "Break a link apart and flag common phishing shapes.",
    group: "Defense",
  },
  {
    slug: "permissions",
    name: "Unix Permissions",
    summary: "Translate rwx triads into the octal mode and back.",
    group: "Linux",
  },
  {
    slug: "cipher-bench",
    name: "Cipher Bench",
    summary: "ROT13 and Caesar shifts for learning classical ciphers.",
    group: "Encoding",
  },
  {
    slug: "http-status",
    name: "HTTP Status",
    summary: "Look up what a status code usually means.",
    group: "Web",
  },
  {
    slug: "quiz",
    name: "Lab Quiz",
    summary: "Eight questions on ethics, networking, and Linux basics.",
    group: "Learn",
  },
];

export function labBySlug(slug: string) {
  return labs.find((lab) => lab.slug === slug);
}
