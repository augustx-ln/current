import type { Command } from "./types";
import { commandExtras } from "./commands-guide";

export const commandCategories = [
  "Navigation",
  "Files",
  "Permissions",
  "Text",
  "Processes",
  "Networking",
  "System",
  "Archives",
  "Packages",
] as const;

const rawCommands: Command[] = [
  { name: "pwd", category: "Navigation", summary: "Print the current working directory.", syntax: "pwd", example: "pwd" },
  { name: "ls", category: "Navigation", summary: "List files. -l is long form, -a includes hidden names.", syntax: "ls [options] [path]", example: "ls -la /etc" },
  { name: "cd", category: "Navigation", summary: "Change directory. cd with no argument returns home.", syntax: "cd [directory]", example: "cd /var/log" },
  { name: "cd ..", category: "Navigation", summary: "Move to the parent directory.", syntax: "cd ..", example: "cd .." },
  { name: "pushd", category: "Navigation", summary: "Stack the current directory and move.", syntax: "pushd <directory>", example: "pushd ~/labs" },
  { name: "popd", category: "Navigation", summary: "Return to the directory saved by pushd.", syntax: "popd", example: "popd" },
  { name: "dirs", category: "Navigation", summary: "Show the directory stack.", syntax: "dirs", example: "dirs -v" },
  { name: "tree", category: "Navigation", summary: "Print a visual directory tree. Install tree if it is missing.", syntax: "tree [path]", example: "tree -L 2 ~" },
  { name: "mkdir", category: "Files", summary: "Create a directory. -p makes parents as needed.", syntax: "mkdir [options] <dir>", example: "mkdir -p labs/nmap" },
  { name: "touch", category: "Files", summary: "Create an empty file or update its timestamp.", syntax: "touch <file>", example: "touch notes.txt" },
  { name: "cp", category: "Files", summary: "Copy files or directories. -r is required for directories.", syntax: "cp [options] <src> <dest>", example: "cp -r lab lab.bak" },
  { name: "mv", category: "Files", summary: "Move or rename.", syntax: "mv <src> <dest>", example: "mv draft.md notes.md" },
  { name: "rm", category: "Files", summary: "Remove files. -r removes directories. There is no trash can.", syntax: "rm [options] <path>", example: "rm -i old.log" },
  { name: "rmdir", category: "Files", summary: "Remove an empty directory.", syntax: "rmdir <dir>", example: "rmdir empty" },
  { name: "ln", category: "Files", summary: "Create a link. -s makes a symbolic link.", syntax: "ln -s <target> <name>", example: "ln -s /var/log/syslog ./syslog" },
  { name: "find", category: "Files", summary: "Walk a tree and print paths that match tests.", syntax: "find <path> [tests]", example: "find . -name '*.pcap' -mtime -1" },
  { name: "locate", category: "Files", summary: "Search a prebuilt filename index. Update it with updatedb.", syntax: "locate <pattern>", example: "locate sshd_config" },
  { name: "stat", category: "Files", summary: "Show size, ownership, and timestamps in detail.", syntax: "stat <file>", example: "stat /etc/passwd" },
  { name: "file", category: "Files", summary: "Guess a file’s type from its contents, not its extension.", syntax: "file <path>", example: "file capture.pcap" },
  { name: "chmod", category: "Permissions", summary: "Change mode bits. Prefer symbolic modes when you are unsure.", syntax: "chmod <mode> <path>", example: "chmod 640 secrets.txt" },
  { name: "chown", category: "Permissions", summary: "Change owner and group. Usually needs sudo.", syntax: "chown <user>:<group> <path>", example: "sudo chown root:adm /var/log/auth.log" },
  { name: "chgrp", category: "Permissions", summary: "Change the group only.", syntax: "chgrp <group> <path>", example: "chgrp adm report.txt" },
  { name: "umask", category: "Permissions", summary: "Show or set the mask that hides bits on new files.", syntax: "umask [mode]", example: "umask 027" },
  { name: "sudo", category: "Permissions", summary: "Run one command as another user, root by default. It logs you.", syntax: "sudo <command>", example: "sudo apt update" },
  { name: "sudo -l", category: "Permissions", summary: "List what the current user may run with sudo.", syntax: "sudo -l", example: "sudo -l" },
  { name: "id", category: "Permissions", summary: "Print user id, group id, and group memberships.", syntax: "id [user]", example: "id" },
  { name: "whoami", category: "Permissions", summary: "Print the effective username.", syntax: "whoami", example: "whoami" },
  { name: "cat", category: "Text", summary: "Print a file to the terminal.", syntax: "cat <file>", example: "cat /etc/os-release" },
  { name: "less", category: "Text", summary: "Page through a file. q quits, / searches.", syntax: "less <file>", example: "less /var/log/syslog" },
  { name: "head", category: "Text", summary: "Print the first lines. -n sets the count.", syntax: "head [-n N] <file>", example: "head -n 20 access.log" },
  { name: "tail", category: "Text", summary: "Print the last lines. -f follows as the file grows.", syntax: "tail [-f] <file>", example: "tail -f /var/log/auth.log" },
  { name: "grep", category: "Text", summary: "Print lines that match a pattern. -R searches a tree.", syntax: "grep [options] <pattern> [path]", example: "grep -R \"Failed password\" /var/log" },
  { name: "wc", category: "Text", summary: "Count lines, words, and bytes. -l is lines only.", syntax: "wc [options] <file>", example: "wc -l hosts.txt" },
  { name: "sort", category: "Text", summary: "Sort lines. -u drops duplicates after sorting.", syntax: "sort [options] <file>", example: "sort -u names.txt" },
  { name: "uniq", category: "Text", summary: "Collapse adjacent duplicate lines. Pipe sort into it.", syntax: "uniq [-c]", example: "sort access.log | uniq -c" },
  { name: "cut", category: "Text", summary: "Select columns. -d sets the delimiter, -f the fields.", syntax: "cut -d <delim> -f <fields>", example: "cut -d: -f1 /etc/passwd" },
  { name: "awk", category: "Text", summary: "Field-oriented scripting. '{print $1}' is the usual start.", syntax: "awk '<program>' <file>", example: "awk '{print $1}' access.log" },
  { name: "sed", category: "Text", summary: "Stream editor. Use it to substitute text, not as a programming language, until you mean to.", syntax: "sed <script> <file>", example: "sed 's/foo/bar/g' notes.txt" },
  { name: "diff", category: "Text", summary: "Show line differences between two files.", syntax: "diff [-u] <a> <b>", example: "diff -u config.bak config" },
  { name: "ps", category: "Processes", summary: "Snapshot of processes. aux is the everyday form.", syntax: "ps [options]", example: "ps aux" },
  { name: "top", category: "Processes", summary: "Live process view. q quits.", syntax: "top", example: "top" },
  { name: "htop", category: "Processes", summary: "Friendlier top, if it is installed.", syntax: "htop", example: "htop" },
  { name: "kill", category: "Processes", summary: "Send a signal to a PID. Default is TERM.", syntax: "kill [-signal] <pid>", example: "kill 4242" },
  { name: "pkill", category: "Processes", summary: "Signal processes matched by name.", syntax: "pkill <name>", example: "pkill -TERM ping" },
  { name: "jobs", category: "Processes", summary: "List jobs started in this shell.", syntax: "jobs", example: "jobs -l" },
  { name: "bg", category: "Processes", summary: "Resume a stopped job in the background.", syntax: "bg [%n]", example: "bg %1" },
  { name: "fg", category: "Processes", summary: "Bring a job back to the foreground.", syntax: "fg [%n]", example: "fg %1" },
  { name: "ping", category: "Networking", summary: "Send ICMP echo requests. Stop it with Ctrl-C. Do not flood hosts.", syntax: "ping <host>", example: "ping -c 4 1.1.1.1" },
  { name: "ip", category: "Networking", summary: "Show addresses, routes, and links. Replaces ifconfig.", syntax: "ip <object> <command>", example: "ip addr" },
  { name: "ss", category: "Networking", summary: "Show sockets. -tlnp lists listening TCP ports.", syntax: "ss [options]", example: "ss -tlnp" },
  { name: "traceroute", category: "Networking", summary: "List hops toward a host. Some networks hide replies.", syntax: "traceroute <host>", example: "traceroute example.com" },
  { name: "dig", category: "Networking", summary: "DNS lookup with the raw answer section.", syntax: "dig <name> [type]", example: "dig example.com A +short" },
  { name: "curl", category: "Networking", summary: "Transfer a URL. -I fetches headers only.", syntax: "curl [options] <url>", example: "curl -I https://example.com" },
  { name: "wget", category: "Networking", summary: "Download a file. Respect robots and licenses.", syntax: "wget <url>", example: "wget https://example.com/file.txt" },
  { name: "hostname", category: "Networking", summary: "Print or, with privileges, set the hostname.", syntax: "hostname", example: "hostname" },
  { name: "uname", category: "System", summary: "Print kernel name. -a adds version and machine.", syntax: "uname [-a]", example: "uname -a" },
  { name: "uptime", category: "System", summary: "How long the system has been up, plus load averages.", syntax: "uptime", example: "uptime" },
  { name: "df", category: "System", summary: "Disk free space. -h prints human units.", syntax: "df [-h]", example: "df -h" },
  { name: "du", category: "System", summary: "Disk usage of a tree. -sh summarizes.", syntax: "du [options] <path>", example: "du -sh /var/log" },
  { name: "free", category: "System", summary: "Memory and swap totals.", syntax: "free [-h]", example: "free -h" },
  { name: "dmesg", category: "System", summary: "Kernel ring buffer. Useful when hardware misbehaves.", syntax: "dmesg", example: "dmesg | tail" },
  { name: "journalctl", category: "System", summary: "Read systemd journals. -u filters a unit, -f follows.", syntax: "journalctl [options]", example: "journalctl -u ssh -n 50" },
  { name: "systemctl", category: "System", summary: "Start, stop, and inspect services.", syntax: "systemctl <verb> [unit]", example: "systemctl status ssh" },
  { name: "date", category: "System", summary: "Print or set the clock. Prefer ISO-8601 in notes.", syntax: "date", example: "date -u +%Y-%m-%dT%H:%M:%SZ" },
  { name: "timedatectl", category: "System", summary: "Show time zone and NTP status.", syntax: "timedatectl", example: "timedatectl" },
  { name: "tar", category: "Archives", summary: "Pack or unpack tar archives. -c creates, -x extracts, -z uses gzip.", syntax: "tar [options] <archive> [paths]", example: "tar -czf lab.tgz notes/" },
  { name: "gzip", category: "Archives", summary: "Compress a file in place. gunzip reverses it.", syntax: "gzip <file>", example: "gzip capture.log" },
  { name: "zip", category: "Archives", summary: "Create a zip archive. -r includes directories.", syntax: "zip [options] <archive> <paths>", example: "zip -r lab.zip lab/" },
  { name: "unzip", category: "Archives", summary: "Extract a zip archive. List with -l before you extract.", syntax: "unzip <archive>", example: "unzip -l lab.zip" },
  { name: "apt", category: "Packages", summary: "Debian and Kali package manager. update, then install.", syntax: "sudo apt <verb>", example: "sudo apt update && sudo apt install nmap" },
  { name: "dpkg", category: "Packages", summary: "Low-level .deb installer. -l lists packages.", syntax: "dpkg [options]", example: "dpkg -l | head" },
  { name: "which", category: "Packages", summary: "Print the path of a command the shell would run.", syntax: "which <command>", example: "which nmap" },
  { name: "man", category: "System", summary: "Open the manual. q quits.", syntax: "man <command>", example: "man ls" },
  { name: "history", category: "System", summary: "Show commands typed in this shell. Do not leave secrets in it.", syntax: "history", example: "history | tail" },
  { name: "alias", category: "System", summary: "Define a shortcut for this shell session.", syntax: "alias name='command'", example: "alias ll='ls -la'" },
  { name: "export", category: "System", summary: "Put a variable in the environment of child processes.", syntax: "export NAME=value", example: "export EDITOR=vim" },
  { name: "echo", category: "Text", summary: "Print arguments. Useful in scripts and the sandbox.", syntax: "echo <text>", example: "echo \"$HOME\"" },
];

export const commands: Command[] = rawCommands.map((command) => ({ ...command, ...commandExtras[command.name] }));

export function commandSlug(name: string) {
  if (name === "cd ..") return "cd-parent";
  if (name === "sudo -l") return "sudo-l";
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function commandBySlug(slug: string) {
  return commands.find((command) => commandSlug(command.name) === slug);
}

export function commandByName(name: string) {
  return commands.find((command) => command.name === name);
}
