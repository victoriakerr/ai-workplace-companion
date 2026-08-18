const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type Tone = "Formal" | "Friendly" | "Persuasive";

export async function generateEmail(input: {
  recipient: string;
  purpose: string;
  keyPoints: string;
  tone: Tone;
}) {
  await delay(1400);
  const recipient = input.recipient.trim() || "there";
  const purpose = input.purpose.trim() || "our upcoming collaboration";
  const points = input.keyPoints
    .split("\n")
    .map((p) => p.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
  const bullets = points.length
    ? points.map((p) => `• ${p}`).join("\n")
    : "• Aligning on scope and timelines\n• Confirming next steps and owners";

  const openings: Record<Tone, string> = {
    Formal: `Dear ${recipient},\n\nI hope this message finds you well. I am writing regarding ${purpose}.`,
    Friendly: `Hi ${recipient},\n\nHope you're having a good week! I wanted to reach out about ${purpose}.`,
    Persuasive: `Hi ${recipient},\n\nI'll keep this brief because ${purpose} is a genuine opportunity worth your time.`,
  };
  const closings: Record<Tone, string> = {
    Formal:
      "Please let me know if you require any further detail. I look forward to your response.\n\nKind regards,\nAlex Morgan",
    Friendly: "Let me know what you think — happy to jump on a quick call.\n\nCheers,\nAlex",
    Persuasive:
      "If this looks right, reply with a time this week and I'll take care of the rest.\n\nBest,\nAlex Morgan",
  };

  return `Subject: ${purpose.charAt(0).toUpperCase() + purpose.slice(1)}\n\n${openings[input.tone]}\n\n${bullets}\n\n${closings[input.tone]}`;
}

export async function summarizeMeeting(notes: string) {
  await delay(1600);
  const lines = notes
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const first = lines[0] ?? "the team sync";

  return {
    summary: `The team reviewed ${first.toLowerCase().slice(0, 90)} and aligned on delivery priorities for the coming sprint. Scope was trimmed to protect the launch date, and two blockers were escalated for follow-up. Overall sentiment: on track, with dependency risk on the vendor integration.`,
    actionItems: [
      { task: "Finalise the revised launch scope document", owner: "Priya", deadline: "Fri, this week" },
      { task: "Escalate vendor API delay and confirm new ETA", owner: "Daniel", deadline: "Wed, 5pm" },
      { task: "Draft customer comms for the phased rollout", owner: "Sam", deadline: "Next Monday" },
      { task: "Book the follow-up review with stakeholders", owner: "Alex", deadline: "Tomorrow" },
    ],
    decisions: [
      "Launch will ship in two phases rather than one full release.",
      "Analytics dashboard moves to the next sprint.",
      "Weekly stakeholder review becomes a 30-minute written update.",
    ],
  };
}

export type PlannedTask = {
  task: string;
  priority: "High" | "Med" | "Low";
  estimate: string;
  slot: string;
};

export async function planTasks(raw: string): Promise<PlannedTask[]> {
  await delay(1500);
  const tasks = raw
    .split("\n")
    .map((t) => t.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter(Boolean);
  const list = tasks.length
    ? tasks
    : ["Prepare quarterly report", "Reply to client emails", "Review design handoff", "Team 1:1s"];

  const priorities: PlannedTask["priority"][] = ["High", "High", "Med", "Med", "Low"];
  const estimates = ["45 min", "1 hr 30 min", "30 min", "1 hr", "20 min"];
  const slots = [
    "09:00 – 09:45",
    "10:00 – 11:30",
    "11:45 – 12:15",
    "13:30 – 14:30",
    "15:00 – 15:20",
    "15:30 – 16:15",
    "16:30 – 17:00",
  ];

  return list.map((task, i) => ({
    task,
    priority: priorities[i % priorities.length]!,
    estimate: estimates[i % estimates.length]!,
    slot: slots[i % slots.length]!,
  }));
}
