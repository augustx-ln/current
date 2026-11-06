import type { Tool } from "./types";

/** Fills the shared guide blocks on the tools that students open first. */
export const guideExtras: Record<string, Partial<Tool>> = {
  nmap: {
    when: "First look at a network you are allowed to map. You need to know what is alive, which ports answer, and what those ports claim to be.",
    needs: ["Written scope with ranges and hours", "A lab host or an owned range", "A place to save the XML"],
    output: [
      { line: "Host is up", meaning: "Something answered discovery. It is not proof of a vulnerable service." },
      { line: "22/tcp open ssh", meaning: "A process accepted a connection on that port and looked like SSH." },
      { line: "80/tcp filtered http", meaning: "A filter ate the probe. You did not prove the port is closed." },
    ],
    next: "whatweb",
  },
  whatweb: {
    when: "After a web port is open. You want the obvious stack — server header, framework hints, a CMS — before you read the app.",
    needs: ["A URL in scope", "The host already found by a port map"],
    output: [{ line: "WordPress[4.x]", meaning: "A fingerprint matched. Confirm it. Do not treat the version as certain." }],
    next: "gobuster",
  },
  gobuster: {
    when: "You have a site in scope and you need names of paths that are not linked from the homepage.",
    needs: ["A base URL you may request", "A small wordlist you are allowed to use", "A rate the owner agreed to"],
    output: [{ line: "/admin (Status: 401)", meaning: "The path exists and asked for credentials. That is a finding to report, not a door to force." }],
    next: "nikto",
  },
  burpsuite: {
    when: "You are testing a web app you own or were hired to test, and you need to see one request at a time.",
    needs: ["A browser pointed at a lab or an in-scope app", "Permission to intercept that app's traffic"],
    output: [{ line: "HTTP/1.1 200", meaning: "The app answered. Read the headers and the body. Status alone is not a vulnerability." }],
  },
  wireshark: {
    when: "You have a capture from a network you are allowed to watch, and you need to see what the packets actually say.",
    needs: ["A pcap from your lab or a sensor you operate", "A question: which host talked to which port"],
    output: [{ line: "TCP 443 [SYN]", meaning: "A handshake start. It is not proof of what the application did after." }],
    next: "tcpdump",
  },
  lynis: {
    when: "You administer a Linux host and you want a checklist of hardening gaps before an audit.",
    needs: ["A host you administer", "Permission to read its config"],
    output: [{ line: "Suggestion: install a firewall", meaning: "A control is missing. It is a ticket, not an exploit." }],
  },
  "metasploit-framework": {
    when: "You are studying what an exploit framework is, on a lab you own. This page does not run it.",
    needs: ["A lab you control", "A reason other than curiosity about someone else's host"],
    limit: "Current will not start msfconsole, generate a payload, or walk an exploit. Read the phase on what an exploit is, then stop.",
  },
  sqlmap: {
    when: "You are learning what a SQL injection tester claims to do. Not for a site you do not own.",
    limit: "Current refuses sqlmap. Injection testing belongs in a program that asked for it, against an app in that program.",
  },
  hydra: {
    when: "You are learning why online password guessing is loud and usually out of scope.",
    limit: "Current refuses hydra. Guessing passwords against a service is an attack. Do not point it at an account you do not own.",
  },
};
