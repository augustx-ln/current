export type Check = {
  prompt: string;
  choices: [string, string, string];
  answer: 0 | 1 | 2;
  note: string;
};

export const checks: Record<string, Check> = {
  "rules-of-engagement": {
    prompt: "Which address is out of scope in Current?",
    choices: ["8.8.8.8", "10.13.37.20", "files.lab"],
    answer: 0,
    note: "The fixture is 10.13.37.0/24. Everything else has no route.",
  },
  "lab-network": {
    prompt: "Why is filtered not the same as closed?",
    choices: ["A filter ate the probe, so you do not know", "The service is turned off", "The host is offline"],
    answer: 0,
    note: "Open is a label here. Filtered means the answer cannot be trusted.",
  },
  "service-notes": {
    prompt: "An open port on a scripted report means what?",
    choices: ["A label to map to a patch", "Permission to go further", "A live service on your machine"],
    answer: 0,
    note: "Record the banner. Verify the patch. Do not treat the line as an invitation.",
  },
  "what-an-exploit-is": {
    prompt: "On an authorized test, exploitation is for what?",
    choices: ["The smallest proof the owner asked for", "A souvenir shell", "A module list to reuse later"],
    answer: 0,
    note: "Impact and evidence. Then stop.",
  },
  sessions: {
    prompt: "What does su do in this sandbox?",
    choices: ["Changes the prompt in a fake tree", "Raises privilege on your computer", "Opens a remote session"],
    answer: 0,
    note: "kali and root are costumes. Nothing on the host changes.",
  },
  "payload-literacy": {
    prompt: "What does Current do if you ask it to build a payload?",
    choices: ["Defines the word and refuses", "Prints shellcode", "Starts a listener"],
    answer: 0,
    note: "No bytes, no builder, no callback address.",
  },
  "privilege-boundary": {
    prompt: "Why is cat /root/flag.txt denied as kali?",
    choices: ["The fake tree has a permission boundary", "The file is on a remote host", "The command is not installed"],
    answer: 0,
    note: "The lesson is the boundary, not a way across it.",
  },
  "persistence-hunting": {
    prompt: "What is the defender's job after access?",
    choices: ["Find leftover ways back in and remove them", "Plant a task so the test can resume", "Keep the credentials"],
    answer: 0,
    note: "Hunt scheduled tasks, new services, and unfamiliar keys. Do not add them.",
  },
  reporting: {
    prompt: "What is the product of a finished test?",
    choices: ["Evidence, impact, a fix, and closed access", "A screenshot of a prompt", "A copy of client secrets"],
    answer: 0,
    note: "If it is not in the report, it did not happen.",
  },
  whatweb: {
    prompt: "What is a scripted banner good for?",
    choices: ["A line you can cite", "A login you should try", "Proof a packet left the browser"],
    answer: 0,
    note: "Cite the banner. Nothing was contacted.",
  },
};
