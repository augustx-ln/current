export type Phase = "Recon" | "Exploitation" | "Post-exploitation";

export type StudyModule = {
  slug: string;
  name: string;
  phase: Phase;
  minutes: number;
  summary: string;
  overview: string;
  inLab: string;
  defender: string;
  refuses: string;
};

export const phases: StudyModule[] = [
  {
    slug: "rules-of-engagement",
    name: "Rules of engagement",
    phase: "Recon",
    minutes: 6,
    summary: "Written scope is the difference between a lab and a crime.",
    overview:
      "Ethical testing starts on paper: who owns the systems, which addresses are in bounds, which hours are allowed, and where the report goes. Current’s only network is a fiction, 10.13.37.0/24, and it has no route anywhere else.",
    inLab: "Read /home/kali/notes/scope.txt in the sandbox, then run `ip a` and notice the missing default route.",
    defender: "If a tester cannot show the scope email, stop the work. Surprise scanning is not a phase.",
    refuses: "Current will not accept a target outside the fixture subnet.",
  },
  {
    slug: "lab-network",
    name: "Lab network map",
    phase: "Recon",
    minutes: 5,
    summary: "Four fake hosts. That is the entire internet of this app.",
    overview:
      "10.13.37.1 is the gateway, 10.13.37.15 is you, 10.13.37.20 is files.lab, and 10.13.37.30 is app.lab. They exist as text. Nothing is listening on your machine or on the public internet.",
    inLab: "nmap 10.13.37.20 and ping 10.13.37.30 print a script. nmap 8.8.8.8 does not.",
    defender: "Treat every scan report as a claim about a scope, not a trophy list.",
    refuses: "No packets leave the browser. There is no uplink to fake.",
  },
  {
    slug: "service-notes",
    name: "Service notes",
    phase: "Recon",
    minutes: 7,
    summary: "An open port is a sentence, not an invitation.",
    overview:
      "Recon in a professional test records software names and versions so the owner can patch them. It does not continue into an exploit because a banner looked old. Current’s nmap text is handwritten. It does not fingerprint a live service.",
    inLab: "The canned report for files.lab lists ssh and http as labels only.",
    defender: "Map the banner to a patch, then verify the patch. Do not collect banners you were not asked for.",
    refuses: "Version detection against hosts you type in is not implemented.",
  },
  {
    slug: "what-an-exploit-is",
    name: "What an exploit is",
    phase: "Exploitation",
    minutes: 8,
    summary: "An exploit is a proof that a bug is reachable. It is not a souvenir.",
    overview:
      "On an authorized test, exploitation means showing that a known weakness can be reached, then stopping at the smallest proof the owner asked for. Current does not ship exploit code, module paths you can run, or a button that ‘gets a shell’. The word is here so you can read a report without romanticizing it.",
    inLab: "Type `modules` in the sandbox. The list is this study index, not a framework catalog.",
    defender: "Ask for impact and evidence, not a screenshot of someone else’s prompt.",
    refuses: "No exploit binary, script, or module is loaded.",
  },
  {
    slug: "sessions",
    name: "Sessions, explained",
    phase: "Exploitation",
    minutes: 6,
    summary: "A session is a login you were given, or a proof you must already be allowed to hold.",
    overview:
      "Frameworks talk about sessions because a test sometimes needs to show what a foothold can see. In Current the only session is your local shell, kali or root, and root is a costume change. `su` does not elevate anything on your computer.",
    inLab: "Run `id`, then `su`, then `id` again. Leave with `exit` if you added it — or just `su kali`.",
    defender: "A real session on a client network is evidence. It is logged, timed, and closed when the scope ends.",
    refuses: "Current cannot attach to a remote session.",
  },
  {
    slug: "payload-literacy",
    name: "Payload literacy",
    phase: "Exploitation",
    minutes: 7,
    summary: "A payload is the part that runs after a bug. Current will not build one.",
    overview:
      "People use the word payload for the follow-on program a test would run if the owner asked for a controlled proof. Stagers, stages, and shells are vocabulary you will see in write-ups. This page defines them and stops. There is no generator, no shellcode, and no one-liner. If a lab needs a payload, it belongs in an isolated virtual machine you own, with a product that is meant for that, not in a website.",
    inLab: "`payloads` prints this vocabulary. `msfvenom` answers that generation is disabled.",
    defender: "Block outbound callbacks you did not approve. A surprise listener is not a deliverable.",
    refuses: "No payload bytes, builders, or callback addresses.",
  },
  {
    slug: "privilege-boundary",
    name: "Privilege boundary",
    phase: "Post-exploitation",
    minutes: 6,
    summary: "User and root are different people. The interesting part is why.",
    overview:
      "Post-exploitation, when it is in scope, asks what a low-privilege user can already see. Current lets you switch the prompt to root so you can read /root/flag.txt, a joke file. That is the whole ‘privilege’ story on offer: permissions in a fake tree.",
    inLab: "As kali, `cat /root/flag.txt` is denied. `su`, then read it.",
    defender: "Watch for unexpected uid changes in logs. The lesson is the boundary, not a recipe for crossing one.",
    refuses: "No local exploit, no credential dump, no token theft.",
  },
  {
    slug: "persistence-hunting",
    name: "Persistence, from the other side",
    phase: "Post-exploitation",
    minutes: 7,
    summary: "Learn what leftover access looks like so you can remove it.",
    overview:
      "Persistence means a way back in after a reboot. Defenders hunt scheduled tasks, new services, and unfamiliar keys. Current does not show how to plant any of those. The sandbox file /root/notes/hunt.txt lists the questions a report should answer.",
    inLab: "Switch to root and read the hunt notes. Nothing in that file is a setup script.",
    defender: "Prefer removal steps and an owner sign-off over a clever mechanism.",
    refuses: "No startup scripts, keys, or implants.",
  },
  {
    slug: "reporting",
    name: "The report is the product",
    phase: "Post-exploitation",
    minutes: 5,
    summary: "After the lab, write what broke, who can fix it, and what you deleted.",
    overview:
      "A finished test hands back evidence, impact, and a fix. It also says what access was closed. Current’s desk already tracks what you marked studied. Pair that with a scope note and you have the shape of a junior report, minus any client data.",
    inLab: "Open Desk after you mark a phase studied. The trail should match what you actually opened.",
    defender: "If it is not in the report, it did not happen. If it is still on disk after the end date, it should not be.",
    refuses: "Current stores marks on this desk. Do not paste client secrets into it.",
  },
];

export function phaseBySlug(slug: string) {
  return phases.find((item) => item.slug === slug);
}
