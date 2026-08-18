import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, CalendarClock, ArrowRight, Clock, Zap, PencilLine } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Assistant — Emails, Meetings & Planning" },
      {
        name: "description",
        content:
          "Automate emails, summarize meetings and plan your week from one dark-mode AI workspace.",
      },
      { property: "og:title", content: "AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Automate emails, summarize meetings and plan your week — all from one workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { icon: Clock, value: "Save 5+ hrs/week", label: "Less busywork, more focus" },
  { icon: Zap, value: "2x Faster workflows", label: "From blank page to draft" },
  { icon: PencilLine, value: "100% Editable outputs", label: "You stay in control" },
];

const tools = [
  {
    icon: Mail,
    title: "Smart Email Generator",
    body: "Draft professional emails with tone control",
    to: "/email-generator",
  },
  {
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    body: "Turn transcripts into actions and decisions",
    to: "/meeting-summarizer",
  },
  {
    icon: CalendarClock,
    title: "AI Task Planner",
    body: "Prioritize tasks by urgency and importance",
    to: "/task-planner",
  },
] as const;

function Dashboard() {
  return (
    <AppLayout>
      <section className="rounded-xl border border-border bg-card px-6 py-12 sm:px-10 sm:py-16">
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
          Your AI Workplace Assistant
        </h1>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          Automate emails, summarize meetings and plan your week — all from one workspace.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/email-generator">Generate email</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/task-planner">Plan my week</Link>
          </Button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={value} className="rounded-xl border border-border bg-card p-5">
            <Icon className="size-5 text-primary" />
            <p className="mt-3 font-display text-lg font-semibold">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">Productivity tools</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {tools.map(({ icon: Icon, title, body, to }) => (
            <div
              key={title}
              className="flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-accent text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{body}</p>
              <Link
                to={to}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Open tool <ArrowRight className="size-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
