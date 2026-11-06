import type { Command } from "./types";

/** When and report notes for the commands a guide actually mentions. */
export const commandExtras: Record<string, Partial<Command>> = {
  grep: {
    when: "You have a log, a scan file, or a config and you need the lines that match a word.",
    report: "Cited as: grep -n \"Failed password\" auth.log returned 14 lines. The count is the finding, not the pattern.",
  },
  ss: {
    when: "You are on a host you administer and you need to see what is listening before you call it exposure.",
    report: "Cited as: ss -tlnp showed 0.0.0.0:22 and 127.0.0.1:8080. Public versus loopback is the sentence.",
  },
  chmod: {
    when: "A file's mode is wrong. A private key should not be world-readable. A script that should run is not executable.",
    report: "Cited as: mode was 0644, changed to 0600. Name the before and the after.",
  },
  find: {
    when: "You need files by name, age, or size in a tree you are allowed to read.",
    report: "Cited as: find /var/log -name '*.gz' -mtime +30 listed 40 archives. The path and the test are the evidence.",
  },
  curl: {
    when: "You want the headers or the body of a URL in scope, once, without a browser.",
    report: "Cited as: curl -I returned 200 and a missing content-security-policy. Quote the header, not the whole page.",
  },
  ip: {
    when: "You need this host's address and route before you interpret a scan.",
    report: "Cited as: ip addr showed 10.13.37.15/24 on eth0, no default route. That is the lab, not the internet.",
  },
  dig: {
    when: "You need the published DNS answer for a name you are allowed to study.",
    report: "Cited as: dig files.lab A returned 10.13.37.20. The type and the data are the note.",
  },
  cat: {
    when: "A file is short and you are allowed to read it. For logs, use less.",
    report: "Cited as: cat scope.txt. Paste the lines you mean, not the whole file.",
  },
  less: {
    when: "A file is long. You need to page and search without dumping it into the scrollback.",
    report: "Do not paste a paged session. Copy the lines you will cite.",
  },
  tail: {
    when: "You care about the end of a log, or you are watching a service you administer.",
    report: "Cited as: the last 20 lines of auth.log. Date them.",
  },
  journalctl: {
    when: "A systemd service failed and you need its own log, not the whole machine.",
    report: "Cited as: journalctl -u ssh -n 20. Name the unit and the error line.",
  },
  systemctl: {
    when: "You need to know if a service is running, enabled, or failed on a host you administer.",
    report: "Cited as: systemctl is-active ssh returned active. The verb and the unit are the evidence.",
  },
  file: {
    when: "The extension is a guess. You want what the bytes look like.",
    report: "Cited as: file capture said ASCII text, not a pcap. Trust the type over the name.",
  },
  sudo: {
    when: "One command needs another user's rights. It is logged. Do not live in a root shell.",
    report: "Cited as: the command, not the fact that sudo worked. Sudo is not a finding.",
  },
  id: {
    when: "You need to know which user the shell is, before you interpret a permission error.",
    report: "Cited as: id showed uid=1000(kali). The name is the note.",
  },
  whoami: {
    when: "You only need the username.",
    report: "Cited as: whoami returned kali. Pair it with id if groups matter.",
  },
  ping: {
    when: "You need to know if a fixture host answers at all, before you scan it.",
    report: "Cited as: ping -c 3 10.13.37.20, 0% loss. Loss and the count, not a flood.",
  },
  traceroute: {
    when: "A host in your lab does not answer and you need the path, not a port list.",
    report: "Cited as: hop 2 was 10.13.37.20. The hop that stops is the question.",
  },
  tar: {
    when: "You are packing notes or a capture to move, or unpacking an archive you trust.",
    report: "Cited as: tar -tzf lab.tgz listed the files before extract. List first.",
  },
  sort: {
    when: "A list of names or log lines needs one order, and you want duplicates gone.",
    report: "Cited as: sort -u names.txt. The count after -u is the note, not the raw file.",
  },
  wc: {
    when: "You need a count of lines, not the lines themselves.",
    report: "Cited as: wc -l hosts.txt returned 40. The number is the evidence.",
  },
  ps: {
    when: "You need a snapshot of what is running on a host you administer.",
    report: "Cited as: ps showed the process name and the user. Do not paste the whole table.",
  },
  apt: {
    when: "You are installing or updating a package on a machine you administer.",
    report: "Cited as: the package name and the version. The install itself is not a finding.",
  },
  dmesg: {
    when: "Hardware or a driver just failed and the kernel log is the first place to look.",
    report: "Cited as: the one dmesg line with the device name. Not the whole ring buffer.",
  },
  unzip: {
    when: "You have an archive you trust and you want the file list before you extract it.",
    report: "Cited as: unzip -l showed the names. List first. Extract only what you need.",
  },
};
