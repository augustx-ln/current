import type { Tool } from "./types";
import { guideExtras } from "./tools-guide";
import { moreTools } from "./tools-more";

export const categories = [
  "Reconnaissance",
  "Web",
  "Network",
  "Sniffing",
  "Wireless",
  "Identity",
  "Exploitation",
  "Forensics",
  "Reverse Engineering",
  "Reporting",
  "Hardening",
  "Hardware",
  "Social Engineering",
] as const;

const rawTools: Tool[] = [
  {
    slug: "nmap",
    name: "Nmap",
    aka: "Network Mapper",
    category: "Reconnaissance",
    level: "Beginner",
    minutes: 12,
    summary: "Discovers hosts and services so you can map an authorized network before you test it.",
    overview:
      "Nmap sends carefully chosen probes and reads what comes back: which hosts answer, which ports are open, and often which software is listening. It is the default first look in a scoped penetration test and just as useful to a defender building an asset inventory. Treat every scan as a request for information, not a free pass to poke networks you do not own.",
    defender:
      "Unexpected bursts of SYNs or version probes against many ports are a classic scanning signature. Log them, know your real exposure, and close services that have no business being reachable.",
    install: "sudo apt install nmap",
    syntax: "nmap [options] <target>",
    flags: [
      { flag: "-sn", meaning: "Host discovery only. Does not probe ports." },
      { flag: "-p", meaning: "Limit the scan to listed ports, for example -p 22,80,443." },
      { flag: "-sV", meaning: "Ask open ports what service and version they appear to be." },
      { flag: "-oA", meaning: "Write normal, grepable, and XML output with one basename." },
    ],
    steps: [
      "Confirm written scope: IP ranges, domains, and the hours you may scan.",
      "Start with a short host-discovery pass so you know what is actually alive.",
      "Scan only the ports in scope and save the XML for your report.",
      "Hand unexpected services to the asset owner before any deeper testing.",
    ],
    tags: ["ports", "discovery", "inventory"],
  },
  {
    slug: "amass",
    name: "Amass",
    aka: "Attack surface mapping",
    category: "Reconnaissance",
    level: "Intermediate",
    minutes: 10,
    summary: "OWASP project that collects subdomains and related infrastructure from public sources.",
    overview:
      "Amass builds a picture of names, addresses, and autonomous systems tied to an organization. Passive mode stays in public datasets. Active mode resolves and probes, which only belongs inside a program that invited you. The value is the map: forgotten staging hosts are where real incidents start.",
    defender:
      "Run Amass against your own domains on a schedule. Anything you did not mean to publish is a ticket, not a surprise for someone else.",
    install: "sudo apt install amass",
    syntax: "amass enum -d <domain>",
    flags: [
      { flag: "-passive", meaning: "Use public sources only. No direct name resolution probes." },
      { flag: "-d", meaning: "Domain to enumerate." },
      { flag: "-o", meaning: "Write discovered names to a file." },
    ],
    steps: [
      "List the apex domains you are allowed to study.",
      "Prefer passive collection first and review the names with the owner.",
      "Only resolve or probe hosts that are explicitly in scope.",
      "Track new names over time so abandoned apps do not linger.",
    ],
    tags: ["osint", "dns", "subdomains"],
  },
  {
    slug: "subfinder",
    name: "Subfinder",
    aka: "Passive subdomain finder",
    category: "Reconnaissance",
    level: "Beginner",
    minutes: 6,
    summary: "Fast passive subdomain discovery from public sources.",
    overview:
      "Subfinder queries certificate logs, search datasets, and similar public feeds, then prints hostnames. It is intentionally narrow: find names, stop. What you do with a name is a separate, authorized decision.",
    defender:
      "Certificate transparency already publishes these names. Read the same feeds your attackers can, and retire hosts that should not have a certificate.",
    install: "sudo apt install subfinder",
    syntax: "subfinder -d <domain>",
    flags: [
      { flag: "-d", meaning: "Apex domain." },
      { flag: "-silent", meaning: "Print names only, which is handy in a pipeline." },
      { flag: "-all", meaning: "Ask every configured source, slower but wider." },
    ],
    steps: [
      "Run it on a domain you administer or are contracted to review.",
      "Diff the list against your inventory.",
      "Investigate names you do not recognize before anyone else does.",
    ],
    tags: ["osint", "subdomains"],
  },
  {
    slug: "theharvester",
    name: "theHarvester",
    aka: "Public email and host collector",
    category: "Reconnaissance",
    level: "Beginner",
    minutes: 8,
    summary: "Gathers emails, hosts, and IPs that search engines and public sources already show.",
    overview:
      "theHarvester is a passive OSINT helper. It does not break into mailboxes. It shows what a patient person can already learn from the open web, which is exactly why staff should know their footprint.",
    defender:
      "Public employee emails feed phishing. Reduce what is published, and train people whose addresses are easy to harvest.",
    install: "sudo apt install theharvester",
    syntax: "theHarvester -d <domain> -b <source>",
    flags: [
      { flag: "-d", meaning: "Domain to research." },
      { flag: "-b", meaning: "Public source to query, such as a search engine key you configured." },
      { flag: "-l", meaning: "Limit how many results to pull." },
    ],
    steps: [
      "Stay on domains you are allowed to research.",
      "Treat collected addresses as sensitive personal data, not a contact list to spam.",
      "Report exposed documents or staff lists to the owner.",
    ],
    tags: ["osint", "email"],
  },
  {
    slug: "whois",
    name: "WHOIS",
    aka: "Registration lookup",
    category: "Reconnaissance",
    level: "Beginner",
    minutes: 5,
    summary: "Reads public domain and IP registration records.",
    overview:
      "WHOIS (and RDAP, its newer cousin) tells you who registered a name, which registrar holds it, and often which network an address belongs to. Privacy proxies hide personal data on many modern domains. The record is still useful for ownership and abuse contacts.",
    defender:
      "Keep registrar contacts current. Expired domains and stale abuse mailboxes are how brand impersonation sticks.",
    install: "sudo apt install whois",
    syntax: "whois <domain-or-ip>",
    flags: [
      { flag: "-h", meaning: "Ask a specific WHOIS server when the default referral is wrong." },
    ],
    steps: [
      "Look up a domain you are studying for class or a client.",
      "Note registrar, dates, and name servers.",
      "Use the abuse contact for reports, not for social-engineering the owner.",
    ],
    tags: ["osint", "dns"],
  },
  {
    slug: "whatweb",
    name: "WhatWeb",
    aka: "Technology fingerprinting",
    category: "Reconnaissance",
    level: "Beginner",
    minutes: 7,
    summary: "Identifies CMS platforms, servers, and libraries from public HTTP responses.",
    overview:
      "WhatWeb requests a page the way a browser would and matches headers, cookies, and HTML against a large signature set. Knowing a site runs an old plugin is the start of a patching conversation, not an invitation to attack it.",
    defender:
      "Hide versions where you can, but patch anyway. Fingerprints are a hint; missing updates are the actual bug.",
    install: "sudo apt install whatweb",
    syntax: "whatweb <url>",
    flags: [
      { flag: "-a", meaning: "Aggression from 1 (stealthy) to 3 (more requests)." },
      { flag: "--log-json", meaning: "Save matches as JSON." },
    ],
    steps: [
      "Point it only at properties in your test scope.",
      "Record the stack in your notes.",
      "Compare versions with vendor advisories and patch what is yours.",
    ],
    tags: ["web", "fingerprint"],
  },
  {
    slug: "httpx",
    name: "httpx",
    aka: "HTTP probing",
    category: "Reconnaissance",
    level: "Intermediate",
    minutes: 8,
    summary: "Checks which hosts speak HTTP and records status, title, and technology hints.",
    overview:
      "ProjectDiscovery’s httpx (packaged on Kali as httpx-toolkit so it does not clash with the Python library) takes a list of hosts and asks which ones answer on the web. It is a sorter: live versus dead, before any deeper review.",
    defender:
      "An unknown live virtual host is an unowned app. Probe your own ranges and shut down what nobody maintains.",
    install: "sudo apt install httpx-toolkit",
    syntax: "httpx -l hosts.txt",
    flags: [
      { flag: "-title", meaning: "Print the HTML title." },
      { flag: "-sc", meaning: "Print the status code." },
      { flag: "-silent", meaning: "URLs only." },
    ],
    steps: [
      "Feed it names you are allowed to request.",
      "Separate parked, redirect, and real applications.",
      "Do not follow this with intrusive testing outside the written scope.",
    ],
    tags: ["web", "probing"],
  },
  {
    slug: "shodan-cli",
    name: "Shodan CLI",
    aka: "Internet device search",
    category: "Reconnaissance",
    level: "Beginner",
    minutes: 9,
    summary: "Queries Shodan’s index of banners from internet-connected devices.",
    overview:
      "Shodan already scanned the public internet. The CLI searches that database: products, ports, and locations. Searching is passive. Connecting to a device you found is a different act and is illegal without permission. Use it to see your own exposure.",
    defender:
      "Search your company name, netblocks, and product banners. Anything management-related on the open internet needs a firewall change today.",
    install: "sudo apt install shodan",
    syntax: "shodan search <query>",
    flags: [
      { flag: "init", meaning: "Store your own API key locally after you create an account." },
      { flag: "search", meaning: "Query the public index. Filters like port: and org: narrow it." },
      { flag: "host", meaning: "Show the stored banner for one address." },
    ],
    steps: [
      "Create your own API key. Do not borrow someone else’s.",
      "Search your organization’s netblock.",
      "Close or authenticate anything that should not be public.",
    ],
    tags: ["osint", "exposure"],
  },
  {
    slug: "dig",
    name: "dig",
    aka: "DNS lookup",
    category: "Reconnaissance",
    level: "Beginner",
    minutes: 6,
    summary: "Asks DNS servers for records and shows the raw answer.",
    overview:
      "dig is the honest way to read DNS. You choose the type (A, AAAA, MX, TXT, NS) and see status, TTL, and the answer section. It is daily infrastructure work, not an exploit.",
    defender:
      "Loose zone transfers and forgotten TXT records leak more than people expect. Query your own zones the way an outsider would.",
    install: "sudo apt install dnsutils",
    syntax: "dig <name> <type>",
    flags: [
      { flag: "+short", meaning: "Print just the answer." },
      { flag: "@server", meaning: "Ask a specific resolver." },
      { flag: "ANY", meaning: "Not reliable anymore; query the types you actually need." },
    ],
    steps: [
      "Resolve a name you expect to understand.",
      "Check MX and TXT when you are reviewing mail security.",
      "Compare answers from a public resolver and your internal one.",
    ],
    tags: ["dns"],
  },
  {
    slug: "nikto",
    name: "Nikto",
    aka: "Web server scanner",
    category: "Web",
    level: "Beginner",
    minutes: 8,
    summary: "Checks a web server for outdated files, default pages, and risky headers.",
    overview:
      "Nikto sends many HTTP requests looking for known misconfigurations. It is noisy and not a stealth tool. Run it on applications you are paid or permitted to assess, then turn findings into patches.",
    defender:
      "Default files, directory listings, and missing security headers are the usual haul. Fix those before you worry about exotic bugs.",
    install: "sudo apt install nikto",
    syntax: "nikto -h <url>",
    flags: [
      { flag: "-h", meaning: "Host or URL." },
      { flag: "-o", meaning: "Write a report." },
      { flag: "-Tuning", meaning: "Limit which test groups run." },
    ],
    steps: [
      "Get permission. Nikto is loud in access logs.",
      "Scan a staging copy when production traffic matters.",
      "Triage the report: patch, remove, or accept with a written reason.",
    ],
    tags: ["web", "misconfig"],
  },
  {
    slug: "gobuster",
    name: "Gobuster",
    aka: "Content discovery",
    category: "Web",
    level: "Intermediate",
    minutes: 8,
    summary: "Guesses directories and DNS names from a wordlist you supply.",
    overview:
      "Gobuster tries many paths or hostnames and reports which ones exist. The wordlist is the whole game: a bigger list is more load on the server. Only run it where brute-forcing URLs is in scope, and prefer a low rate.",
    defender:
      "Unlinked admin panels and backup files show up this way. Remove them, or put real authentication in front of them.",
    install: "sudo apt install gobuster",
    syntax: "gobuster dir -u <url> -w <wordlist>",
    flags: [
      { flag: "dir", meaning: "Directory and file mode." },
      { flag: "dns", meaning: "Subdomain mode." },
      { flag: "-t", meaning: "Thread count. Lower it if you are hammering a small server." },
    ],
    steps: [
      "Use a lab or an app you own.",
      "Start with a small wordlist and a modest thread count.",
      "Review hits with the developer. Do not assume a 200 means it is safe to use.",
    ],
    tags: ["web", "content"],
  },
  {
    slug: "ffuf",
    name: "ffuf",
    aka: "Web fuzzer",
    category: "Web",
    level: "Intermediate",
    minutes: 9,
    summary: "Fast fuzzer for paths, parameters, and virtual hosts.",
    overview:
      "ffuf replaces a keyword in a URL and filters responses by status, size, or words. It is powerful enough to melt a small app if you set threads high. In this lab we cover how it is used in an authorized content review, not payload lists.",
    defender:
      "Rate-limit and alert on repetitive 404 storms. Hidden parameters should still be authorized server-side.",
    install: "sudo apt install ffuf",
    syntax: "ffuf -u <url>/FUZZ -w <wordlist>",
    flags: [
      { flag: "-u", meaning: "URL with the FUZZ marker." },
      { flag: "-mc", meaning: "Status codes to keep." },
      { flag: "-fs", meaning: "Hide responses of a given size." },
    ],
    steps: [
      "Agree a rate limit with the owner.",
      "Filter noise before you read results.",
      "Document new endpoints and how they should be authenticated.",
    ],
    tags: ["web", "fuzz"],
  },
  {
    slug: "nuclei",
    name: "Nuclei",
    aka: "Template scanner",
    category: "Web",
    level: "Intermediate",
    minutes: 10,
    summary: "Runs community templates that check for known issues and misconfigurations.",
    overview:
      "Nuclei is a template engine. Each template describes a check. You choose severity and tags so you are not launching every check on the internet. Update templates, scope the target list, and read what a template actually requests before you run it.",
    defender:
      "Run the same templates in CI against staging. Known issues should fail the build, not the news.",
    install: "sudo apt install nuclei",
    syntax: "nuclei -u <url>",
    flags: [
      { flag: "-severity", meaning: "Limit to info, low, medium, high, or critical." },
      { flag: "-tags", meaning: "Run a slice of the template set, such as headers or ssl." },
      { flag: "-l", meaning: "Read targets from a file." },
    ],
    steps: [
      "Update templates, then read ones you plan to run.",
      "Start with info and misconfiguration tags on a host you own.",
      "File fixes. Do not republish working proofs against other people’s systems.",
    ],
    tags: ["web", "templates"],
  },
  {
    slug: "wpscan",
    name: "WPScan",
    aka: "WordPress enumerator",
    category: "Web",
    level: "Beginner",
    minutes: 7,
    summary: "Enumerates WordPress versions, plugins, and users when the site exposes them.",
    overview:
      "WPScan looks at the public signals a WordPress site already sends: readme files, generator tags, and the user API when it is left open. Finding a plugin name is not permission to exploit a CVE on someone else’s blog.",
    defender:
      "Remove version banners, disable unused plugins, and do not leave the user REST route listing authors if you do not need it.",
    install: "sudo apt install wpscan",
    syntax: "wpscan --url <url>",
    flags: [
      { flag: "--enumerate p", meaning: "Look for popular plugins." },
      { flag: "--api-token", meaning: "Your own WPScan API token for vulnerability data." },
    ],
    steps: [
      "Only scan WordPress sites you administer or are hired to review.",
      "Update core, themes, and plugins that trail the current release.",
      "Remove users and plugins the site does not need.",
    ],
    tags: ["wordpress", "web"],
  },
  {
    slug: "owasp-zap",
    name: "OWASP ZAP",
    aka: "Web app scanner",
    category: "Web",
    level: "Beginner",
    minutes: 11,
    summary: "Intercepting proxy and automated scanner maintained by OWASP.",
    overview:
      "ZAP sits between your browser and a lab application. You browse, it records, and you can passively flag missing headers or actively scan a site that expects it. It is the approachable alternative when you are learning web testing workflow.",
    defender:
      "Passive scan your own staging site in CI. Header and cookie findings are usually the cheapest wins.",
    install: "sudo apt install zaproxy",
    syntax: "zaproxy",
    flags: [
      { flag: "HUD", meaning: "In-browser overlay for people new to proxies." },
      { flag: "Passive scan", meaning: "Reviews traffic you already generated." },
    ],
    steps: [
      "Point the browser proxy at ZAP and trust its local certificate only on a lab profile.",
      "Spider an application you own.",
      "Turn active scanning on only with permission and a maintenance window.",
    ],
    tags: ["web", "proxy"],
  },
  {
    slug: "burpsuite",
    name: "Burp Suite",
    aka: "Web proxy",
    category: "Web",
    level: "Intermediate",
    minutes: 12,
    summary: "The standard proxy for inspecting and repeating your own browser traffic.",
    overview:
      "Burp shows each request your browser made and lets you change it and send it again. That is how testers learn how an application really behaves. Community edition is enough to learn the proxy, repeater, and decoder. Use it on applications that invited testing.",
    defender:
      "If a parameter change in Repeater flips another user’s data, you have an authorization bug. Fix the check on the server, not just the button in the UI.",
    install: "sudo apt install burpsuite",
    syntax: "burpsuite",
    flags: [
      { flag: "Proxy", meaning: "Records traffic from a browser pointed at 127.0.0.1." },
      { flag: "Repeater", meaning: "Edits and resends one request." },
      { flag: "Decoder", meaning: "Transforms encodings so you can read them." },
    ],
    steps: [
      "Install the CA only in a dedicated browser profile.",
      "Map the app by clicking through it as a normal user.",
      "Note every place the server trusts the client, and write that up.",
    ],
    tags: ["web", "proxy"],
  },
  {
    slug: "wafw00f",
    name: "wafw00f",
    aka: "WAF fingerprint",
    category: "Web",
    level: "Beginner",
    minutes: 5,
    summary: "Guesses whether a site sits behind a web application firewall, and which one.",
    overview:
      "wafw00f sends a few benign and slightly odd requests and compares error pages and headers with known products. Identifying a WAF is reconnaissance. Bypassing one on a target you do not own is not a lab exercise we teach here.",
    defender:
      "A WAF is a seatbelt, not a patch. Know which one you deployed and what it does not cover.",
    install: "sudo apt install wafw00f",
    syntax: "wafw00f <url>",
    flags: [{ flag: "-a", meaning: "Test all known fingerprints, not only the first hit." }],
    steps: [
      "Run it against your own edge.",
      "Confirm the result with the team that operates the WAF.",
      "Keep application fixes in the backlog even when the WAF blocks a demo payload.",
    ],
    tags: ["web", "waf"],
  },
  {
    slug: "sqlmap",
    name: "SQLMap",
    aka: "SQL injection tester",
    category: "Exploitation",
    level: "Advanced",
    minutes: 9,
    summary: "Automates checks for SQL injection on requests you are authorized to test.",
    overview:
      "SQL injection happens when an application glues user input into a database query. SQLMap can detect that class of bug. Dumping databases, operating-system shells, and tamper scripts are out of scope for this guide. If you suspect injection, stop, preserve the request, and fix the query with parameters.",
    defender:
      "Parameterized queries end this bug class. A scanner is how you notice you forgot one.",
    install: "sudo apt install sqlmap",
    syntax: "sqlmap -u <url>",
    flags: [
      { flag: "-u", meaning: "A URL you are allowed to test." },
      { flag: "--batch", meaning: "Accept defaults. Still does not grant you permission." },
    ],
    steps: [
      "Do not run SQLMap against a site that is not yours.",
      "On a local vulnerable lab (DVWA, Juice Shop), watch how a single quote changes the response.",
      "Rewrite the query to use bound parameters and retest.",
    ],
    tags: ["web", "sqli"],
  },
  {
    slug: "wireshark",
    name: "Wireshark",
    aka: "Packet analyzer",
    category: "Network",
    level: "Beginner",
    minutes: 14,
    summary: "Captures and dissects packets on an interface you are allowed to listen to.",
    overview:
      "Wireshark is a microscope. You pick an interface, optionally set a capture filter, and read protocols in plain language. Capturing other people’s traffic on a shared network without consent is wiretapping. Use it on your lab VM, your own machine, or a span port you were given.",
    defender:
      "Cleartext protocols (FTP, HTTP, old Telnet) show up immediately. That is your migration list.",
    install: "sudo apt install wireshark",
    syntax: "wireshark",
    flags: [
      { flag: "Capture filter", meaning: "Applied before packets are stored. Example: port 53." },
      { flag: "Display filter", meaning: "Applied while reading. Example: dns or http." },
    ],
    steps: [
      "Add your user to the wireshark group instead of running the GUI as root.",
      "Capture on the lab interface for a minute while you generate traffic you understand.",
      "Follow a TCP stream and name every protocol you see.",
    ],
    tags: ["packets", "analysis"],
  },
  {
    slug: "tcpdump",
    name: "tcpdump",
    aka: "CLI packet capture",
    category: "Network",
    level: "Beginner",
    minutes: 8,
    summary: "Captures packets in a terminal and writes pcap files for later study.",
    overview:
      "tcpdump is Wireshark’s command-line cousin. It belongs on servers where you cannot open a GUI. Same rule: capture traffic you are responsible for.",
    defender:
      "A short pcap during an incident is often more honest than a screenshot of a dashboard.",
    install: "sudo apt install tcpdump",
    syntax: "sudo tcpdump -i <iface>",
    flags: [
      { flag: "-i", meaning: "Interface, or any." },
      { flag: "-n", meaning: "Do not resolve names. Faster and less confusing." },
      { flag: "-w", meaning: "Write a pcap instead of printing." },
    ],
    steps: [
      "Capture a few dozen packets of traffic you generated.",
      "Open the file in Wireshark if the terminal view is too dense.",
      "Delete captures that contain secrets when the exercise is over.",
    ],
    tags: ["packets"],
  },
  {
    slug: "netcat",
    name: "Netcat",
    aka: "Network swiss army knife",
    category: "Network",
    level: "Intermediate",
    minutes: 8,
    summary: "Opens TCP or UDP connections for debugging services you control.",
    overview:
      "Netcat can connect to a port and show the banner, or listen on a port so another lab machine can talk to it. Listening backdoors and reverse shells are not part of this guide. Use it to confirm a service speaks the protocol you think it does.",
    defender:
      "Unexpected listeners are incidents. netstat or ss should match what you meant to run.",
    install: "sudo apt install netcat-traditional",
    syntax: "nc <host> <port>",
    flags: [
      { flag: "-v", meaning: "Verbose connection status." },
      { flag: "-l", meaning: "Listen. Only on a machine and port you are allowed to bind." },
    ],
    steps: [
      "Connect to a service in your lab and read the banner.",
      "Quit. Do not pipe a shell anywhere.",
      "Compare the banner with the version you intended to install.",
    ],
    tags: ["tcp", "debug"],
  },
  {
    slug: "masscan",
    name: "Masscan",
    aka: "Fast port scanner",
    category: "Network",
    level: "Advanced",
    minutes: 7,
    summary: "Scans ports very quickly. Easy to overwhelm a network by accident.",
    overview:
      "Masscan is asynchronous and can outrun the path between you and the target. That makes it a poor teaching default. If a client truly needs a wide inventory, agree the rate in packets per second first. This page does not provide a recipe for scanning the internet.",
    defender:
      "A sudden full-port sweep is often masscan or a cousin. Block, alert, and check whether it came from a vendor who skipped the change window.",
    install: "sudo apt install masscan",
    syntax: "masscan <target> -p<ports> --rate <pps>",
    flags: [
      { flag: "--rate", meaning: "Packets per second. Start far lower than the default if you ever use it in a lab." },
      { flag: "-p", meaning: "Ports to try." },
    ],
    steps: [
      "Prefer Nmap unless you have a measured reason and a written rate.",
      "Never aim it at addresses outside your lab range.",
      "Save results and reconcile them with the asset list.",
    ],
    tags: ["ports"],
  },
  {
    slug: "hashcat",
    name: "Hashcat",
    aka: "Password hash auditor",
    category: "Exploitation",
    level: "Advanced",
    minutes: 10,
    summary: "Tests whether password hashes you already possess are guessable.",
    overview:
      "Hashcat is for hashes you obtained legally: a lab file, or a dump from a system you administer after an incident. It is not a tool for cracking accounts that are not yours. The useful outcome is a policy change: longer passphrases, hashing with a modern KDF, and multi-factor authentication.",
    defender:
      "If a fast hash like unsalted MD5 still guards a password, assume it will not survive a stolen database. Move to argon2, bcrypt, or scrypt.",
    install: "sudo apt install hashcat",
    syntax: "hashcat -m <mode> <hashfile>",
    flags: [
      { flag: "-m", meaning: "Hash type. Identify it before you waste a GPU." },
      { flag: "--identify", meaning: "Ask hashcat what a sample might be." },
    ],
    steps: [
      "Only audit hashes you have a right to hold.",
      "Identify the algorithm.",
      "Report weak patterns to the owner and rotate those credentials. Do not keep a personal copy of recovered passwords.",
    ],
    tags: ["passwords", "audit"],
  },
  {
    slug: "john",
    name: "John the Ripper",
    aka: "Password auditor",
    category: "Exploitation",
    level: "Intermediate",
    minutes: 8,
    summary: "Classic offline password auditor for hashes you are authorized to test.",
    overview:
      "John bundles formats and a simple cracking loop. Same boundary as hashcat: your hashes, your lab, or a contract. Publishing recovered passwords is a separate harm even when the test was allowed.",
    defender:
      "Unique, long passphrases beat clever complexity rules. Check that your lockout and MFA story does not depend on the hash staying secret forever.",
    install: "sudo apt install john",
    syntax: "john <hashfile>",
    flags: [
      { flag: "--wordlist", meaning: "Try candidates from a list you are allowed to use." },
      { flag: "--format", meaning: "Force a hash format when auto-detect is wrong." },
    ],
    steps: [
      "Work on a copy of a lab hash file.",
      "Stop when you have enough evidence that the policy is weak.",
      "Delete recovered material when the report is filed.",
    ],
    tags: ["passwords", "audit"],
  },
  {
    slug: "hydra",
    name: "Hydra",
    aka: "Online login tester",
    category: "Exploitation",
    level: "Advanced",
    minutes: 7,
    summary: "Tries credentials against a network service. Illegal without explicit permission.",
    overview:
      "Hydra automates login guesses. That is the definition of an online password attack. We do not publish target syntax here. Defenders should assume exposed SSH, RDP, and web logins will see this kind of traffic and should require keys or MFA, plus rate limits.",
    defender:
      "Fail2ban is not a strategy. Disable password SSH, alert on spray patterns, and do not reuse corporate passwords anywhere.",
    install: "sudo apt install hydra",
    syntax: "See the official THC Hydra documentation after you have written authorization.",
    flags: [],
    steps: [
      "Do not point login guessers at systems you do not own.",
      "In a local lab with accounts you created, observe how lockout should behave.",
      "Turn the lesson into MFA and monitoring, not a wordlist habit.",
    ],
    tags: ["authentication", "defense"],
  },
  {
    slug: "aircrack-ng",
    name: "Aircrack-ng",
    aka: "Wireless lab suite",
    category: "Wireless",
    level: "Advanced",
    minutes: 9,
    summary: "Captures and studies wireless traffic in a lab you control.",
    overview:
      "The aircrack-ng suite can put an adapter into monitor mode and work with handshake captures. Capturing neighbors’ networks or attacking their keys is illegal. Use a spare access point, your own SSID, and traffic you generated. The defensive lesson is why open and WEP networks are obsolete and why WPA2/WPA3 with a long passphrase matters.",
    defender:
      "Use WPA3 where devices allow it, disable WPS, and treat a shared café password as public.",
    install: "sudo apt install aircrack-ng",
    syntax: "airmon-ng  and  aircrack-ng <capture>",
    flags: [
      { flag: "airmon-ng", meaning: "Manage monitor mode on an adapter you own." },
      { flag: "airodump-ng", meaning: "Observe networks. Stay on your lab SSID." },
    ],
    steps: [
      "Set up a personal access point for the exercise.",
      "Capture only that network.",
      "Read why a short passphrase is guessable, then change yours.",
    ],
    tags: ["wifi", "lab"],
  },
  {
    slug: "kismet",
    name: "Kismet",
    aka: "Wireless detector",
    category: "Wireless",
    level: "Intermediate",
    minutes: 7,
    summary: "Detects wireless networks and devices around a sensor you placed.",
    overview:
      "Kismet is a sniffer and logger. Site surveys, rogue-AP hunts, and lab work are the point. Do not use it to stalk devices or to follow people. Device identifiers can be personal data.",
    defender:
      "A survey that finds an unknown access point bridged into the office LAN is a real incident. Walk the building before you blame the firewall.",
    install: "sudo apt install kismet",
    syntax: "kismet",
    flags: [],
    steps: [
      "Survey a space you have permission to assess.",
      "Mark authorized SSIDs ahead of time.",
      "Investigate anything else with the facilities team, not with a deauth frame.",
    ],
    tags: ["wifi", "survey"],
  },
  {
    slug: "exiftool",
    name: "ExifTool",
    aka: "Metadata reader",
    category: "Forensics",
    level: "Beginner",
    minutes: 6,
    summary: "Reads and edits metadata in photos, documents, and other files.",
    overview:
      "Photos carry camera model, timestamps, and sometimes GPS. ExifTool prints that metadata. Stripping it before you publish is basic privacy. Reading it from files you are allowed to examine is basic forensics.",
    defender:
      "Staff who post phone photos from a sensitive site may publish coordinates without noticing. Strip metadata at the edge.",
    install: "sudo apt install libimage-exiftool-perl",
    syntax: "exiftool <file>",
    flags: [
      { flag: "-gps:all", meaning: "Show location tags if they exist." },
      { flag: "-all=", meaning: "Remove metadata. Keep a copy of the original if it is evidence." },
    ],
    steps: [
      "Inspect a photo you took.",
      "Notice which tags you would not want on the public web.",
      "Practice stripping a copy, not the only original.",
    ],
    tags: ["metadata", "privacy"],
  },
  {
    slug: "binwalk",
    name: "Binwalk",
    aka: "Firmware carving",
    category: "Forensics",
    level: "Intermediate",
    minutes: 8,
    summary: "Searches a binary for embedded file systems and compressed blobs.",
    overview:
      "Binwalk is how people inspect router firmware and other images they are allowed to reverse. Signatures inside the blob hint at archives and file systems. Extracting secrets from someone else’s device firmware to attack customers is not the exercise.",
    defender:
      "Ship signed updates and do not embed private keys in a squashfs you hoped nobody would unpack.",
    install: "sudo apt install binwalk",
    syntax: "binwalk <file>",
    flags: [
      { flag: "-e", meaning: "Extract recognized sections from a file you may analyze." },
    ],
    steps: [
      "Download firmware from the vendor page for a device you own.",
      "Scan it and read the signature hits.",
      "Note hardcoded secrets if you find them and update or report them responsibly.",
    ],
    tags: ["firmware", "reverse"],
  },
  {
    slug: "autopsy",
    name: "Autopsy",
    aka: "Disk forensics GUI",
    category: "Forensics",
    level: "Intermediate",
    minutes: 12,
    summary: "Browser-based interface on The Sleuth Kit for disk images you are allowed to examine.",
    overview:
      "Autopsy indexes files, timelines, and browser artifacts from a forensic image. Chain of custody matters: work on a copy, write down hash values, and do not alter the original. It is a lab and incident tool, not a way to browse a machine you stole access to.",
    defender:
      "If you might need forensics later, disk encryption keys and logging have to exist before the incident.",
    install: "sudo apt install autopsy",
    syntax: "autopsy",
    flags: [],
    steps: [
      "Hash the image before you open it.",
      "Build a timeline of files you created in a lab scenario.",
      "Export a short report and re-hash the source image to show you did not change it.",
    ],
    tags: ["disk", "timeline"],
  },
  {
    slug: "volatility",
    name: "Volatility",
    aka: "Memory forensics",
    category: "Forensics",
    level: "Advanced",
    minutes: 11,
    summary: "Analyzes RAM captures for processes, network sockets, and injected code.",
    overview:
      "Memory holds what disk does not: running processes, keys, and sometimes malware that never touched a file. Volatility needs a capture you took legally and a profile that matches the operating system. This guide stops at the idea and the lab workflow.",
    defender:
      "Enable memory acquisition in your incident plan. Without a capture, you are guessing from logs.",
    install: "sudo apt install volatility3",
    syntax: "vol -f <memory.img> <plugin>",
    flags: [
      { flag: "windows.info", meaning: "Identify the image before deeper plugins." },
      { flag: "pslist", meaning: "List processes the kernel still knows about." },
    ],
    steps: [
      "Capture memory from a lab VM you infected with a known-safe sample from a class, or skip malware entirely and just list processes.",
      "Compare the process list with what the VM’s task manager shows.",
      "Document the plugin and the image hash.",
    ],
    tags: ["memory"],
  },
  {
    slug: "lynis",
    name: "Lynis",
    aka: "Host auditor",
    category: "Hardening",
    level: "Beginner",
    minutes: 8,
    summary: "Reads a Unix system’s configuration and suggests hardening steps.",
    overview:
      "Lynis is a defensive scanner. It looks at SSH settings, file permissions, firewalls, and updates, then prints a hardening index. Run it on machines you administer. The report is a to-do list, not a score to brag about.",
    defender:
      "This is the tool. Schedule it. Track the warnings you accepted on purpose.",
    install: "sudo apt install lynis",
    syntax: "sudo lynis audit system",
    flags: [
      { flag: "--quick", meaning: "Skip slow checks when you want a first look." },
    ],
    steps: [
      "Run it on a lab VM.",
      "Fix one warning you understand, then run it again.",
      "Keep the report with the change ticket.",
    ],
    tags: ["hardening", "linux"],
  },
  {
    slug: "wireguard",
    name: "WireGuard",
    aka: "Modern VPN",
    category: "Hardening",
    level: "Beginner",
    minutes: 10,
    summary: "A small, fast VPN you can actually read the configuration of.",
    overview:
      "WireGuard gives each peer a key pair and a short config: addresses, endpoint, and allowed IPs. It is the right way to reach a lab network without exposing every port. Keys are secrets. Do not paste them into tickets or screenshots.",
    defender:
      "A VPN is not authorization. Once a peer is inside, accounts and firewalls still matter.",
    install: "sudo apt install wireguard",
    syntax: "wg genkey | tee private.key | wg pubkey > public.key",
    flags: [
      { flag: "wg-quick", meaning: "Bring a config file up or down." },
      { flag: "ListenPort", meaning: "UDP port, 51820 by default." },
    ],
    steps: [
      "Generate keys on each lab VM.",
      "Write a config that only routes the lab subnet.",
      "Confirm the handshake with wg show, then close the port on the public side if you do not need it.",
    ],
    tags: ["vpn", "networking"],
  },
  {
    slug: "metasploit-framework",
    name: "Metasploit",
    aka: "Exploitation framework",
    category: "Exploitation",
    level: "Advanced",
    minutes: 10,
    summary: "A framework for reproducing known vulnerabilities in a lab you control.",
    overview:
      "Metasploit organizes exploits, payloads, and sessions. That power is why it does not belong pointed at networks you do not own. This guide will not list modules, payloads, or listener commands. Learn the vocabulary, practice on vendor-provided vulnerable VMs, and spend more time on the patch than the demo.",
    defender:
      "Asset inventory plus timely patches removes most of what public exploit kits target. Assume a public proof of concept exists the week a serious bug is announced.",
    install: "sudo apt install metasploit-framework",
    syntax: "Study the official Rapid7 documentation inside a private lab.",
    flags: [],
    steps: [
      "Read the module description for a vulnerability you already patched in class.",
      "Reproduce it only on a VM that was built to be vulnerable.",
      "Write the detection and the fix, not a souvenir shell.",
    ],
    tags: ["lab", "vulns"],
  },
  {
    slug: "bloodhound",
    name: "BloodHound",
    aka: "Active Directory mapper",
    category: "Identity",
    level: "Advanced",
    minutes: 11,
    summary: "Graphs identity relationships in an Active Directory you are allowed to review.",
    overview:
      "BloodHound shows how groups, sessions, and ACLs chain into powerful accounts. Defenders use that graph to delete attack paths. Collectors that dump directory data are in-scope only with the domain owner. We do not provide collection commands.",
    defender:
      "Look for users who can reset privileged passwords, and for tier-0 accounts that log into ordinary workstations.",
    install: "See the BloodHound Community Edition docs for the current package.",
    syntax: "Import a collection you were authorized to make, then use the pathfinding UI.",
    flags: [],
    steps: [
      "Get written approval from the directory owner.",
      "Review shortest paths to high-value groups.",
      "Remove the extra rights. Recollect later and show the path is gone.",
    ],
    tags: ["active-directory", "defense"],
  },
  {
    slug: "searchsploit",
    name: "SearchSploit",
    aka: "Exploit-DB search",
    category: "Exploitation",
    level: "Intermediate",
    minutes: 6,
    summary: "Searches the local Exploit-DB archive so you can match versions to public advisories.",
    overview:
      "SearchSploit is a local search engine for public exploit entries. Finding a matching title means a product version needs a patch, not that you should run the code. Read the CVE, check the vendor advisory, and update.",
    defender:
      "Put the version from your inventory into the search. If a public entry exists and you are unpatched, that is the priority.",
    install: "sudo apt install exploitdb",
    syntax: "searchsploit <product>",
    flags: [
      { flag: "-t", meaning: "Search titles only, which cuts false matches." },
      { flag: "--exclude", meaning: "Drop noisy terms." },
    ],
    steps: [
      "Search a product version you actually run.",
      "Open the advisory rather than the exploit as your first read.",
      "Patch, mitigate, or record why the finding does not apply.",
    ],
    tags: ["cve", "inventory"],
  },
  ...moreTools,
];

export const tools: Tool[] = rawTools.map((tool) => ({ ...tool, ...guideExtras[tool.slug] }));

export function toolBySlug(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function toolLimit(tool: Tool) {
  if (tool.limit) return tool.limit;
  if (tool.category === "Exploitation" || tool.category === "Social Engineering") {
    return "Current will not run this tool, generate a payload, or walk an attack. This page is literacy.";
  }
  return "Practice only on systems you own or are contracted to test. The terminal prints scripts. It does not reach a real network.";
}
