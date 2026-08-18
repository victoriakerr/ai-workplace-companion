import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { summarizeMeeting } from "@/lib/mock-ai";

export const Route = createFileRoute("/meeting-summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
      {
        name: "description",
        content: "Turn raw meeting transcripts into a summary, owned action items and decisions.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Turn transcripts into actions and decisions you can edit.",
      },
    ],
  }),
  component: MeetingSummarizer,
});

type ActionItem = { task: string; owner: string; deadline: string };

function MeetingSummarizer() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [decisions, setDecisions] = useState<string[]>([]);

  async function onSummarize() {
    setLoading(true);
    const result = await summarizeMeeting(notes);
    setSummary(result.summary);
    setActions(result.actionItems);
    setDecisions(result.decisions);
    setLoading(false);
  }

  function updateAction(i: number, patch: Partial<ActionItem>) {
    setActions((prev) => prev.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  }

  const hasOutput = summary || actions.length > 0;

  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Meeting Notes Summarizer
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Paste your notes and get a summary, action items with owners and deadlines, and key
        decisions.
      </p>

      <div className="mt-8 rounded-xl border border-border bg-card p-5">
        <Textarea
          rows={10}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste meeting notes here"
        />
        <Button className="mt-4" onClick={onSummarize} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Summarizing…
            </>
          ) : (
            <>
              <Sparkles /> Summarize notes
            </>
          )}
        </Button>
      </div>

      {loading && (
        <div className="mt-6 space-y-3 rounded-xl border border-border bg-card p-5">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="h-4 animate-pulse rounded bg-muted"
              style={{ width: `${95 - i * 7}%` }}
            />
          ))}
        </div>
      )}

      {!loading && hasOutput && (
        <div className="mt-6 space-y-6">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-primary">1. Summary</h2>
            <Textarea
              className="mt-3"
              rows={5}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-primary">2. Action items</h2>
            <div className="mt-3 space-y-2">
              <div className="hidden gap-2 px-1 text-xs text-muted-foreground sm:grid sm:grid-cols-[1fr_150px_150px]">
                <span>Task</span>
                <span>Owner</span>
                <span>Deadline</span>
              </div>
              {actions.map((a, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-[1fr_150px_150px]">
                  <Input value={a.task} onChange={(e) => updateAction(i, { task: e.target.value })} />
                  <Input
                    value={a.owner}
                    onChange={(e) => updateAction(i, { owner: e.target.value })}
                  />
                  <Input
                    value={a.deadline}
                    onChange={(e) => updateAction(i, { deadline: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-primary">3. Key decisions</h2>
            <div className="mt-3 space-y-2">
              {decisions.map((d, i) => (
                <Input
                  key={i}
                  value={d}
                  onChange={(e) =>
                    setDecisions((prev) => prev.map((x, idx) => (idx === i ? e.target.value : x)))
                  }
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </AppLayout>
  );
}
