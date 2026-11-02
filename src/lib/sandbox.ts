import { commands } from "@/data/commands";
import { phases } from "@/data/phases";
import { tools } from "@/data/tools";

export type ShellUser = "kali" | "root";

export type ShellState = {
  cwd: string[];
  user: ShellUser;
};

type Node = { kind: "dir"; children: Record<string, Node> } | { kind: "file"; body: string };

const tree: Node = {
  kind: "dir",
  children: {
    home: {
      kind: "dir",
      children: {
        kali: {
          kind: "dir",
          children: {
            "README.txt": {
              kind: "file",
              body: "Current sandbox.\nYou are on 10.13.37.15/24. There is no default route.\nFake hosts: 10.13.37.1 gateway, 10.13.37.20 files.lab, 10.13.37.30 app.lab.\nTry: ip a, nmap 10.13.37.20, modules, payloads, su\n",
            },
            notes: {
              kind: "dir",
              children: {
                "scope.txt": {
                  kind: "file",
                  body: "Owner: you.\nIn scope: 10.13.37.0/24, this browser only.\nOut of scope: every other address.\nWindow: whenever this tab is open.\nDeliverable: notes, not access.\n",
                },
                "passwords.txt": {
                  kind: "file",
                  body: "lab\nlab123\nnot-a-real-secret\ncurrent\n",
                },
              },
            },
          },
        },
      },
    },
    root: {
      kind: "dir",
      children: {
        "flag.txt": {
          kind: "file",
          body: "current{this-file-never-left-the-browser}\n",
        },
        notes: {
          kind: "dir",
          children: {
            "hunt.txt": {
              kind: "file",
              body: "After a real test, ask:\n- Which accounts were used?\n- What was added to startup?\n- Which keys are new?\n- What did you delete before you left?\nCurrent planted nothing.\n",
            },
          },
        },
      },
    },
    etc: {
      kind: "dir",
      children: {
        hostname: { kind: "file", body: "current\n" },
        "os-release": { kind: "file", body: 'PRETTY_NAME="Current lab (simulated)"\nNAME="Current"\n' },
      },
    },
  },
};

const HOSTS: Record<string, string[]> = {
  "10.13.37.1": [
    "Host is up (fixture gateway).",
    "PORT    STATE    SERVICE",
    "53/tcp  filtered domain",
    "No packets left the browser.",
  ],
  "10.13.37.15": ["Host is up (this shell).", "You are here. Nothing is listening."],
  "10.13.37.20": [
    "Host is up (fixture files.lab).",
    "PORT    STATE SERVICE",
    "22/tcp  open  ssh",
    "80/tcp  open  http",
    "443/tcp open  https",
    "Banners are labels. Nothing accepted a connection.",
  ],
  "10.13.37.30": [
    "Host is up (fixture app.lab).",
    "PORT     STATE SERVICE",
    "8080/tcp open  http",
    "8443/tcp open  https",
    "The app is a sentence in a file, not a server.",
  ],
};

const WEB: Record<string, string[]> = {
  "10.13.37.20": [
    "http://10.13.37.20  200  (scripted)",
    "title: files.lab",
    "server: fixture-httpd",
    "/",
    "/robots.txt",
    "/files/",
    "No request left the browser.",
  ],
  "10.13.37.30": [
    "http://10.13.37.30:8080  200  (scripted)",
    "title: app.lab",
    "/",
    "/about",
    "/health",
    "No request left the browser.",
  ],
};

export function run(line: string, state: ShellState): { state: ShellState; lines: string[] } {
  const trimmed = line.trim();
  if (!trimmed) return { state, lines: [] };
  const [bin, ...args] = tokenize(trimmed);
  const command = bin ?? "";

  if (command === "help") {
    return {
      state,
      lines: [
        "Shell: help pwd ls cd cat echo clear whoami id hostname uname date history su tree",
        "Scan fixtures only: ip ping nmap masscan nc",
        "Web enum (scripted): curl whatweb nikto gobuster ffuf httpx wafw00f",
        "Study: man tools modules payloads learn",
        "Refused: sqlmap hydra john hashcat msfconsole msfvenom",
        "Address: 10.13.37.15/24. Targets: .20 files.lab  .30 app.lab. No uplink.",
      ],
    };
  }
  if (command === "clear") return { state, lines: ["__CLEAR__"] };
  if (command === "pwd") return { state, lines: [pathOf(state.cwd)] };
  if (command === "whoami") return { state, lines: [state.user] };
  if (command === "id") {
    return state.user === "root"
      ? { state, lines: ["uid=0(root) gid=0(root) groups=0(root)"] }
      : { state, lines: ["uid=1000(kali) gid=1000(kali) groups=1000(kali)"] };
  }
  if (command === "hostname") return { state, lines: ["current"] };
  if (command === "uname") return { state, lines: ["Linux current 6.6.0-lab #1 SMP x86_64 GNU/Linux (simulated)"] };
  if (command === "date") return { state, lines: [new Date().toUTCString()] };
  if (command === "echo") return { state, lines: [args.join(" ")] };
  if (command === "history") return { state, lines: ["Use the up arrow. This shell does not write ~/.bash_history."] };

  if (command === "su") {
    const next = args[0] === "kali" ? "kali" : args[0] === "root" || !args[0] ? "root" : null;
    if (!next) return { state, lines: [`su: user ${args[0]} does not exist`] };
    return { state: { ...state, user: next }, lines: [] };
  }
  if (command === "sudo") {
    if (args[0] === "-i" || args.length === 0) return { state: { ...state, user: "root" }, lines: [] };
    const inner = run(args.join(" "), { ...state, user: "root" });
    return { state, lines: inner.lines };
  }
  if (command === "exit") {
    if (state.user === "root") return { state: { ...state, user: "kali" }, lines: [] };
    return { state, lines: ["exit: you are already kali. Close the tab to leave."] };
  }

  if (command === "ip" || command === "ifconfig") {
    return {
      state,
      lines: [
        "eth0: flags=4163<UP,BROADCAST,RUNNING>  mtu 1500",
        "    inet 10.13.37.15/24 brd 10.13.37.255",
        "    ether 02:00:00:13:37:15",
        "routing:",
        "    10.13.37.0/24 dev eth0 src 10.13.37.15",
        "    default: absent",
        "Current has no uplink. This address is not assigned on your computer.",
      ],
    };
  }
  if (command === "ping") {
    const host = args.find((part) => part !== "-c" && !/^\d+$/.test(part));
    if (!host) return { state, lines: ["ping: usage: ping <fixture-ip>"] };
    if (!HOSTS[host]) {
      return { state, lines: [`ping: ${host}: Network is unreachable`, "No packet was sent. There is no uplink."] };
    }
    return {
      state,
      lines: [`PING ${host} (${host}) 56(84) bytes of data.`, `64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.40 ms (scripted)`, `1 packets transmitted, 1 received, 0% packet loss`],
    };
  }
  if (command === "nmap") {
    const host = [...args].reverse().find((part) => !part.startsWith("-"));
    if (!host) return { state, lines: ["nmap: give a fixture address, for example nmap 10.13.37.20"] };
    if (host === "10.13.37.0/24" || host === "10.13.37.0") {
      return {
        state,
        lines: [
          "Starting Nmap (scripted, no packets)",
          "Nmap scan report for 10.13.37.1",
          "Nmap scan report for 10.13.37.15",
          "Nmap scan report for 10.13.37.20",
          "Nmap scan report for 10.13.37.30",
          "4 hosts up. The report is a fixture.",
        ],
      };
    }
    const card = HOSTS[host];
    if (!card) return { state, lines: [`nmap: ${host}: no route. Current will not scan outside 10.13.37.0/24.`] };
    return { state, lines: [`Starting Nmap (scripted, no packets)`, `Nmap scan report for ${host}`, ...card] };
  }
  if (command === "masscan") {
    return {
      state,
      lines: [
        "masscan (scripted)",
        "Discovered open port 22/tcp on 10.13.37.20",
        "Discovered open port 80/tcp on 10.13.37.20",
        "Discovered open port 443/tcp on 10.13.37.20",
        "Discovered open port 8080/tcp on 10.13.37.30",
        "Discovered open port 8443/tcp on 10.13.37.30",
        "Rate was zero. No packets left the browser.",
      ],
    };
  }
  if (WEB_TOOLS.has(command) || command === "curl" || command === "wget" || command === "nc" || command === "ncat" || command === "netcat" || RECON.has(command)) {
    return webish(state, command, args);
  }
  if (command === "ss" || command === "netstat") {
    return { state, lines: ["State  Recv-Q  Send-Q  Local Address:Port", "LISTEN is empty. This shell opened no sockets."] };
  }

  if (REFUSED.has(command)) {
    return {
      state,
      lines: [
        `${command}: not available in Current.`,
        "Output would have to be a real tool. This sandbox only prints scripts.",
        "No process started. No socket opened. No file was written outside this tab.",
      ],
    };
  }

  if (command === "modules") {
    return { state, lines: phases.map((item) => `${item.phase.padEnd(18, " ")} ${item.name}`) };
  }
  if (command === "payloads") {
    return {
      state,
      lines: [
        "Payload: the follow-on program a test would run after a bug, if the owner asked.",
        "Stager: a small first step. Stage: the rest. Shell: an interactive prompt.",
        "Current does not build, encode, or host any of those.",
        "Read Phases → Payload literacy. Then stop.",
      ],
    };
  }
  if (command === "learn") {
    return { state, lines: ["Open Phases for recon, exploitation literacy, and post-exploitation.", "Open Tools for what a program is. Open Commands for the shell itself."] };
  }
  if (command === "tools") {
    return { state, lines: tools.map((tool) => `${tool.name.padEnd(22, " ")} ${tool.category}`) };
  }

  if (command === "ls") return ls(state, args);
  if (command === "cd") return cd(state, args);
  if (command === "cat") return cat(state, args);
  if (command === "tree") {
    const lines: string[] = [];
    walk(tree, "", lines, []);
    return { state, lines };
  }
  if (command === "man") return man(state, args);

  return { state, lines: [`${command}: command not found. Type help.`] };
}

const WEB_TOOLS = new Set(["whatweb", "nikto", "gobuster", "ffuf", "httpx", "wafw00f", "wpscan", "nuclei", "dirb"]);
const RECON = new Set(["dig", "whois", "amass", "subfinder", "theharvester", "tshark", "tcpdump", "shodan"]);

const REFUSED = new Set([
  "ssh",
  "scp",
  "socat",
  "msfvenom",
  "msfconsole",
  "exploit",
  "hydra",
  "sqlmap",
  "john",
  "hashcat",
  "aircrack-ng",
  "responder",
  "mimikatz",
  "powershell",
  "python",
  "python3",
  "bash",
  "sh",
]);

function webish(state: ShellState, command: string, args: string[]): { state: ShellState; lines: string[] } {
  const blob = args.join(" ");
  const ip = blob.match(/10\.13\.37\.\d+/)?.[0];
  const host = ip && HOSTS[ip] ? ip : blob.includes("app.lab") ? "10.13.37.30" : blob.includes("files.lab") || blob.includes("lab") ? "10.13.37.20" : null;
  if (!host || host === "10.13.37.1" || host === "10.13.37.15") {
    return {
      state,
      lines: [
        `${command}: give a fixture, for example ${command} http://10.13.37.20`,
        "Anything else has no route. No packet was sent.",
      ],
    };
  }
  if (command === "nc" || command === "ncat" || command === "netcat") {
    const page = WEB[host] ?? [];
    return { state, lines: [`nc (scripted) ${host}`, ...page.slice(0, 3), "Connection is a label. The socket was not opened."] };
  }
  const page = WEB[host] ?? ["No scripted page for that fixture."];
  return { state, lines: [`${command} (scripted)`, ...page] };
}

function ls(state: ShellState, args: string[]) {
  const target = resolve(state.cwd, args[0] ?? ".");
  const denied = deny(state, target);
  if (denied) return { state, lines: [denied] };
  const node = target ? getNode(target) : null;
  if (!node) return { state, lines: [`ls: cannot access '${args[0] ?? "."}': No such file or directory`] };
  if (node.kind === "file") return { state, lines: [args[0] ?? ""] };
  return { state, lines: Object.keys(node.children).sort() };
}

function cd(state: ShellState, args: string[]) {
  const spec = args[0] ?? "~";
  const target = resolve(state.cwd, spec === "~" ? homeOf(state.user) : spec);
  const denied = deny(state, target);
  if (denied) return { state, lines: [denied.replace("ls:", "cd:")] };
  const node = target ? getNode(target) : null;
  if (!node || node.kind !== "dir") return { state, lines: [`cd: no such directory: ${args[0] ?? ""}`] };
  return { state: { ...state, cwd: target ?? state.cwd }, lines: [] };
}

function cat(state: ShellState, args: string[]) {
  if (!args[0]) return { state, lines: ["cat: missing file"] };
  const target = resolve(state.cwd, args[0]);
  const denied = deny(state, target);
  if (denied) return { state, lines: [`cat: ${args[0]}: Permission denied`] };
  const node = target ? getNode(target) : null;
  if (!node) return { state, lines: [`cat: ${args[0]}: No such file`] };
  if (node.kind === "dir") return { state, lines: [`cat: ${args[0]}: Is a directory`] };
  return { state, lines: node.body.split("\n") };
}

function man(state: ShellState, args: string[]) {
  const name = (args[0] ?? "").toLowerCase();
  const tool = tools.find((item) => item.slug === name || item.name.toLowerCase() === name);
  if (tool) {
    return { state, lines: [`NAME`, `  ${tool.name} — ${tool.aka}`, ``, `SUMMARY`, `  ${tool.summary}`, ``, `NOTE`, `  ${tool.defender}`] };
  }
  const known = commands.find((item) => item.name === name);
  if (known) return { state, lines: [`NAME`, `  ${known.name} — ${known.summary}`, ``, `SYNOPSIS`, `  ${known.syntax}`] };
  const phase = phases.find((item) => item.slug === name || item.name.toLowerCase() === name);
  if (phase) return { state, lines: [phase.name, phase.summary, phase.refuses] };
  return { state, lines: [`No manual entry for ${name || "(empty)"}`] };
}

function deny(state: ShellState, path: string[] | null) {
  if (!path || state.user === "root") return null;
  if (path[0] === "root") return "ls: cannot open '/root': Permission denied";
  return null;
}

function homeOf(user: ShellUser) {
  return user === "root" ? "/root" : "/home/kali";
}

function resolve(cwd: string[], input: string): string[] | null {
  if (!input || input === ".") return cwd;
  const parts = input.startsWith("/") ? [] : [...cwd];
  for (const part of input.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") {
      parts.pop();
      continue;
    }
    if (part === "~") {
      parts.splice(0, parts.length, "home", "kali");
      continue;
    }
    parts.push(part);
  }
  return parts;
}

function getNode(path: string[]): Node | null {
  let node: Node = tree;
  for (const part of path) {
    if (node.kind !== "dir" || !node.children[part]) return null;
    node = node.children[part]!;
  }
  return node;
}

function walk(node: Node, prefix: string, lines: string[], path: string[]) {
  if (path.length === 0) lines.push("/");
  if (node.kind !== "dir") return;
  const names = Object.keys(node.children).sort();
  names.forEach((name, index) => {
    const last = index === names.length - 1;
    const child = node.children[name]!;
    lines.push(`${prefix}${last ? "└── " : "├── "}${name}${child.kind === "dir" ? "/" : ""}`);
    if (child.kind === "dir") walk(child, prefix + (last ? "    " : "│   "), lines, [...path, name]);
  });
}

function tokenize(input: string) {
  return input.split(/\s+/).filter(Boolean);
}

export function pathOf(cwd: string[]) {
  return cwd.length ? `/${cwd.join("/")}` : "/";
}
