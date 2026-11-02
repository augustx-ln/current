import type { Article } from "./types";

export const topics = [
  "Foundations",
  "Linux",
  "Networking",
  "Web",
  "Defense",
  "Career",
] as const;

export const articles: Article[] = [
  {
    slug: "kali-linux-beginner-guide",
    title: "Kali Linux, without the mythology",
    topic: "Foundations",
    level: "Beginner",
    minutes: 8,
    summary: "What the distribution is, how to install it safely, and what to learn before any tool.",
    sections: [
      {
        heading: "A toolbox, not a personality",
        paragraphs: [
          "Kali Linux is a Debian-based distribution packaged with security tools. It does not grant skill, permission, or anonymity. If you are new, the operating system is the least interesting part. The interesting part is whether you can explain a packet, a permission bit, and a log line.",
          "Install it in a virtual machine first. VirtualBox or a similar hypervisor keeps the lab away from the laptop you use for banking. Take a snapshot before you experiment. Breaking the VM should be cheap.",
        ],
      },
      {
        heading: "A sane first week",
        paragraphs: ["Skip the tool list. Spend the week on the machine itself."],
        bullets: [
          "Update packages, then learn apt well enough to undo a mistake.",
          "Live in the terminal: pwd, ls, cd, cat, less, grep.",
          "Read /etc/os-release and the output of ip addr until they are boring.",
          "Write notes in a folder you can find again.",
        ],
      },
      {
        heading: "The rule that keeps you out of trouble",
        paragraphs: [
          "Test systems you own, or systems someone hired you to test, inside a written scope. A public bug bounty is a scope. A random IP is not. Curiosity does not appear on the statute as a defense.",
        ],
      },
    ],
  },
  {
    slug: "what-is-linux",
    title: "What Linux actually is",
    topic: "Linux",
    level: "Beginner",
    minutes: 6,
    summary: "Kernel, distribution, shell, and why Kali is only one of many systems.",
    sections: [
      {
        heading: "Three layers people mash together",
        paragraphs: [
          "The kernel talks to hardware and schedules processes. A distribution bundles that kernel with a package set, an installer, and opinions. The shell is a program that reads the commands you type. Ubuntu, Debian, Fedora, and Kali can share a kernel family and still feel different because their packages and defaults differ.",
        ],
      },
      {
        heading: "Why servers look like this",
        paragraphs: [
          "Most of the internet runs on Unix-like systems because they are scriptable, cheap to automate, and old enough that the sharp edges are documented. Learning Linux is career infrastructure, even if you never touch a security tool.",
        ],
      },
    ],
  },
  {
    slug: "linux-terminal-guide",
    title: "A terminal you can trust",
    topic: "Linux",
    level: "Beginner",
    minutes: 7,
    summary: "Prompt, paths, pipes, and the habits that stop you deleting the wrong tree.",
    sections: [
      {
        heading: "Read the prompt",
        paragraphs: [
          "user@host:directory$ is the usual shape. If the prompt ends in # you are root. Root is not a badge. It is how a typo becomes an outage. Stay a normal user until a command refuses you.",
        ],
      },
      {
        heading: "Paths and pipes",
        paragraphs: [
          "An absolute path starts at /. A relative path starts where you are. .. is the parent. ~ is home. A pipe | sends one command’s output into the next. grep, sort, uniq, and head will cover more real work than any GUI file manager.",
        ],
        bullets: [
          "Tab completion is not optional. Use it.",
          "history shows what you typed. Do not put passwords in commands.",
          "man <command> and then q. The manual is the feature.",
        ],
      },
    ],
  },
  {
    slug: "linux-file-permissions",
    title: "File permissions in one sitting",
    topic: "Linux",
    level: "Beginner",
    minutes: 7,
    summary: "Owner, group, everyone else, and the octal numbers on chmod.",
    sections: [
      {
        heading: "Nine bits",
        paragraphs: [
          "ls -l starts with a type character and then three triads: owner, group, others. Each triad is read, write, execute. r is 4, w is 2, x is 1. A mode of 640 is read-write for the owner, read for the group, nothing for the world.",
          "Execute on a directory means you may traverse it, not that it is a program. A secret file inside a world-executable directory is not secret if the file itself is world-readable.",
        ],
      },
      {
        heading: "What to memorize",
        paragraphs: ["You do not need every special bit on day one. You need to stop shipping mode 777."],
        bullets: [
          "644 for ordinary files.",
          "755 for directories and programs people should run.",
          "600 for private keys.",
          "sudo is a logged privilege, not a lifestyle.",
        ],
      },
    ],
  },
  {
    slug: "networking-basics",
    title: "Networking basics for security work",
    topic: "Networking",
    level: "Beginner",
    minutes: 9,
    summary: "Addresses, ports, and the handful of protocols you will meet every week.",
    sections: [
      {
        heading: "Names and numbers",
        paragraphs: [
          "An IPv4 address is 32 bits, usually written as four decimals. A port is a 16-bit door on that address. 192.168.1.10:22 means SSH on that host if someone is listening. DNS turns names into addresses. If DNS is wrong, every tool above it is wrong.",
        ],
      },
      {
        heading: "TCP, UDP, and what a scan even is",
        paragraphs: [
          "TCP sets up a conversation. UDP does not. A port scan is just a series of questions: are you listening? Version detection asks a follow-up. None of that is magic, and none of it is allowed on networks you do not administer.",
        ],
        bullets: [
          "22 SSH, 53 DNS, 80 HTTP, 443 HTTPS, 3389 RDP. Learn these before you memorize tool flags.",
          "Private ranges (10/8, 172.16/12, 192.168/16) are not routable on the public internet.",
          "ping proves very little. Firewalls drop ICMP all the time.",
        ],
      },
    ],
  },
  {
    slug: "ports-and-protocols",
    title: "Ports and protocols worth knowing",
    topic: "Networking",
    level: "Beginner",
    minutes: 6,
    summary: "A short map of services you will see in inventories and incidents.",
    sections: [
      {
        heading: "The everyday set",
        paragraphs: ["You can look up the rest. These are the ones that change a design review."],
        bullets: [
          "22/tcp — SSH. Keys, not passwords.",
          "53/udp and tcp — DNS. Also a favorite tunnel when nobody is watching.",
          "80 and 443 — the web. 443 is not automatically safe; it is only encrypted.",
          "445/tcp — SMB. Do not expose it to the internet.",
          "3389/tcp — Remote Desktop. Same advice.",
          "51820/udp — WireGuard, if you chose the default.",
        ],
      },
    ],
  },
  {
    slug: "ethical-hacking-fundamentals",
    title: "Ethical hacking is a permission problem",
    topic: "Foundations",
    level: "Beginner",
    minutes: 7,
    summary: "Scope, rules of engagement, and why the word ethical is not a costume.",
    sections: [
      {
        heading: "Permission is the whole definition",
        paragraphs: [
          "Ethical hacking means looking for weaknesses with the owner’s explicit permission, inside limits you both wrote down, and reporting what you find so it can be fixed. Take away the permission and the same keystrokes are a crime. Take away the report and you are just collecting trophies.",
        ],
      },
      {
        heading: "What a scope looks like",
        paragraphs: ["A useful scope is boring and specific."],
        bullets: [
          "Hostnames and address ranges that are in, and a sentence about what is out.",
          "Hours you may test, and who to call if something falls over.",
          "Whether availability tests are allowed at all.",
          "How findings are delivered and how long you keep data.",
        ],
      },
    ],
  },
  {
    slug: "cia-triad",
    title: "Confidentiality, integrity, availability",
    topic: "Defense",
    level: "Beginner",
    minutes: 5,
    summary: "The three words that sort almost every security argument.",
    sections: [
      {
        heading: "A sorting hat, not a slogan",
        paragraphs: [
          "Confidentiality: only the right people can read it. Integrity: it has not been changed in a way you cannot detect. Availability: the people who should reach it, can. Encryption helps the first. Hashes and signatures help the second. Backups and capacity help the third.",
          "Arguments go wrong when one goal eats the others. A lock that nobody can open is great confidentiality and terrible availability. A public wiki is the reverse. Say which goal you are protecting before you pick a tool.",
        ],
      },
    ],
  },
  {
    slug: "password-security-guide",
    title: "Password security that survives contact with users",
    topic: "Defense",
    level: "Beginner",
    minutes: 7,
    summary: "Length, managers, hashing, and why rotation theater does not help.",
    sections: [
      {
        heading: "What actually fails",
        paragraphs: [
          "People reuse short passwords. Databases of those passwords leak. Attackers try the popular ones first, online and offline. Complexity rules that force Summer2024! train everyone to pick the same shape.",
        ],
      },
      {
        heading: "What to do instead",
        paragraphs: ["This is the whole policy for most teams."],
        bullets: [
          "A password manager and a long unique passphrase per site.",
          "Multi-factor authentication on mail, your identity provider, and remote access.",
          "Server-side hashing with argon2, bcrypt, or scrypt. Not MD5, not SHA-1.",
          "Rate limits and alerting on login sprays. MFA does not excuse a public RDP port.",
        ],
      },
    ],
  },
  {
    slug: "hashes-explained",
    title: "Hashes, without the mystique",
    topic: "Defense",
    level: "Beginner",
    minutes: 6,
    summary: "Fingerprints of data, and why a fast hash is a bad place to store a password.",
    sections: [
      {
        heading: "A one-way fingerprint",
        paragraphs: [
          "A cryptographic hash takes bytes and emits a fixed-length digest. Change one bit of the input and the digest changes. You cannot invert SHA-256 in any practical sense. You can still guess inputs, hash them, and compare. That is the entire offline password attack, and it is why password hashes need to be slow on purpose.",
        ],
      },
      {
        heading: "Use the right tool",
        paragraphs: [
          "SHA-256 is fine for file integrity. It is a poor password store because it is fast. Password storage wants a memory-hard function and a unique salt. Checksums you compute in the Hash Generator lab are integrity checks, not secrecy.",
        ],
      },
    ],
  },
  {
    slug: "web-security-fundamentals",
    title: "Web security fundamentals",
    topic: "Web",
    level: "Beginner",
    minutes: 8,
    summary: "The browser trust model, and the bugs that fall out of it.",
    sections: [
      {
        heading: "The server is the authority",
        paragraphs: [
          "Anything in the browser can be edited. Hidden fields, JavaScript checks, and pretty URLs are suggestions. The server has to check identity, authorization, and input again. When it does not, you get the classics: injection, broken access control, and cross-site scripting.",
        ],
      },
      {
        heading: "A beginner’s reading order",
        paragraphs: ["Learn the shape of the bug before any scanner."],
        bullets: [
          "XSS: untrusted text treated as HTML or JavaScript.",
          "SQL injection: untrusted text glued into a query. Parameters fix it.",
          "IDOR: changing an id shows someone else’s object.",
          "CSRF: the browser sends cookies on a request the user did not intend.",
          "Security headers: CSP, HSTS, framing, and content type. Use the header lab.",
        ],
      },
    ],
  },
  {
    slug: "osint-introduction",
    title: "OSINT is just careful reading",
    topic: "Foundations",
    level: "Beginner",
    minutes: 6,
    summary: "Open-source intelligence: public records, and the ethics of writing them down.",
    sections: [
      {
        heading: "Public does not mean harmless",
        paragraphs: [
          "OSINT uses information people already published: DNS, certificates, job posts, documents, photos. Collecting it can still hurt someone if you publish a dossier they did not expect, or if you use it to harass them. The professional version is narrow: answer a question for a defender, cite the source, stop.",
        ],
      },
      {
        heading: "A small method",
        paragraphs: ["Write the question first. “What of our infrastructure is public?” is a good one. “Everything about this stranger” is not."],
        bullets: [
          "Save the URL and the date. Pages change.",
          "Separate what you observed from what you inferred.",
          "Give the subject a chance to fix exposure before you write a blog about it.",
        ],
      },
    ],
  },
  {
    slug: "nmap-beginner-tutorial",
    title: "Nmap for people who just installed it",
    topic: "Networking",
    level: "Beginner",
    minutes: 8,
    summary: "Host discovery, a small port list, and how to read the result.",
    sections: [
      {
        heading: "One lab host",
        paragraphs: [
          "Point Nmap at a machine you installed, or at scanme.nmap.org, which Nmap’s authors provide for this purpose. Start with discovery and a few ports. Save the output. A giant default scan of a network you found on Shodan is how beginners become case numbers.",
        ],
        bullets: [
          "nmap -sn 192.168.56.0/24 on your lab network tells you what is alive.",
          "nmap -p 22,80,443 -sV <lab-host> asks those ports what they are.",
          "nmap -oA lab1 <lab-host> keeps a copy you can attach to notes.",
        ],
      },
      {
        heading: "How to read a line",
        paragraphs: [
          "open means something accepted the conversation. closed means the host replied that nothing is listening. filtered means a filter ate the probe and you should not pretend you know. The service name is a guess from a banner. Confirm it.",
        ],
      },
    ],
  },
  {
    slug: "incident-response",
    title: "Incident response in four verbs",
    topic: "Defense",
    level: "Intermediate",
    minutes: 7,
    summary: "Prepare, detect, contain, recover. The order matters more than the tools.",
    sections: [
      {
        heading: "Before anything is on fire",
        paragraphs: [
          "You cannot buy response during the incident. You need logs that exist, a person allowed to isolate a host, and a way to reach people at 2am. Write that down on a calm Tuesday.",
        ],
      },
      {
        heading: "During",
        paragraphs: ["The verbs, in order, unless life or safety says otherwise."],
        bullets: [
          "Detect: what made you think this is real?",
          "Contain: stop the spread. Unplug is allowed. Heroics are not.",
          "Eradicate: remove the cause, not just the symptom.",
          "Recover: restore from something you trust, then watch.",
          "Learn: one page on what would have made this boring.",
        ],
      },
    ],
  },
  {
    slug: "wifi-security-basics",
    title: "Wi-Fi security basics",
    topic: "Networking",
    level: "Beginner",
    minutes: 6,
    summary: "WPA2, WPA3, WPS, and why the café password is already public.",
    sections: [
      {
        heading: "Encryption is not access control",
        paragraphs: [
          "A WPA2 network encrypts traffic between your laptop and the access point so a stranger with a radio cannot read it trivially. Everyone who knows the passphrase can still see a lot, and a short passphrase can be guessed from a captured handshake. That guess is legal only on a network you own. On a network you do not own, it is an offense.",
        ],
      },
      {
        heading: "Practical choices",
        paragraphs: ["Turn off WPS. Prefer WPA3-Personal or WPA2-AES, never mixed WEP. Use a long passphrase. Put guests on a separate SSID that cannot see your laptops and printers."],
      },
    ],
  },
  {
    slug: "cybersecurity-roadmap-2026",
    title: "A 2026 learning roadmap that is not a shopping list",
    topic: "Career",
    level: "Beginner",
    minutes: 8,
    summary: "Skills to stack, in an order that produces a portfolio instead of a tab graveyard.",
    sections: [
      {
        heading: "Months, not modules",
        paragraphs: [
          "Certificates can open a recruiter’s filter. They do not replace a story you can tell about a lab you built. The roadmap below assumes a few hours a week.",
        ],
        bullets: [
          "Month 1: Linux terminal, files, permissions, SSH. Use the sandbox and the command reference.",
          "Month 2: TCP/IP, DNS, HTTP. Capture your own traffic in Wireshark.",
          "Month 3: Web fundamentals. Break a local practice app, then fix it.",
          "Month 4: Logging and a small incident write-up. Defenders get hired.",
          "After that: one specialty. Identity, detection, or app security. Not all three at once.",
        ],
      },
      {
        heading: "What to show",
        paragraphs: [
          "A git repo with lab notes, redacted, plus one page on a hardening change you made to a VM. That outperforms a list of tools you launched once.",
        ],
      },
    ],
  },
];

export function articleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}
