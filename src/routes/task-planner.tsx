import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { planTasks, type PlannedTask } from "@/lib/mock-ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Assistant" },
      {
        name: "description",
        content: "Prioritize your tasks by urgency and importance and get a suggested day schedule.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Prioritize tasks by urgency and importance, with suggested time slots.",
      },
    ],
  }),
  component: TaskPlanner,
});

const priorityStyles: Record<PlannedTask["priority"], string> = {
  High: "text-[oklch(0.72_0.18_25)]",
  Med: "text-[oklch(0.8_0.15_85)]",
  Low: "text-muted-foreground",
};

function TaskPlanner() {
  const [raw, setRaw] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<PlannedTask[]>([]);

  async function onPlan() {
    setLoading(true);
    setRows(await planTasks(raw));
    setLoading(false);
  }

  function update(i: number, patch: Partial<PlannedTask>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">AI Task Planner</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Prioritize tasks by urgency and importance, with time estimates and suggested slots.
      </p>

      <div className="mt-8 rounded-xl border border-border bg-card p-5">
        <Textarea
          rows={7}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="List your tasks for today"
        />
        <Button className="mt-4" onClick={onPlan} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Planning your day…
            </>
          ) : (
            <>
              <Sparkles /> Plan my day
            </>
          )}
        </Button>
      </div>

      {loading && (
        <div className="mt-6 space-y-3 rounded-xl border border-border bg-card p-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded bg-muted" />
          ))}
        </div>
      )}

      {!loading && rows.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card p-5">
          <div className="min-w-[720px] space-y-2">
            <div className="grid grid-cols-[1fr_130px_130px_170px] gap-2 px-1 text-xs text-muted-foreground">
              <span>Task</span>
              <span>Priority</span>
              <span>Time estimate</span>
              <span>Suggested time slot</span>
            </div>
            {rows.map((r, i) => (
              <div key={i} className="grid grid-cols-[1fr_130px_130px_170px] gap-2">
                <Input value={r.task} onChange={(e) => update(i, { task: e.target.value })} />
                <Select
                  value={r.priority}
                  onValueChange={(v) => update(i, { priority: v as PlannedTask["priority"] })}
                >
                  <SelectTrigger className={cn("font-medium", priorityStyles[r.priority])}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Med">Med</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={r.estimate}
                  onChange={(e) => update(i, { estimate: e.target.value })}
                />
                <Input value={r.slot} onChange={(e) => update(i, { slot: e.target.value })} />
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
