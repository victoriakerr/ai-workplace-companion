import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Loader2, Sparkles, Check } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail, type Tone } from "@/lib/mock-ai";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      {
        name: "description",
        content: "Draft professional emails with tone control, then edit and copy the result.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Draft professional emails with tone control in seconds.",
      },
    ],
  }),
  component: EmailGenerator,
});

function EmailGenerator() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);

  async function onGenerate() {
    setLoading(true);
    setDraft("");
    const result = await generateEmail({ recipient, purpose, keyPoints, tone });
    setDraft(result);
    setLoading(false);
  }

  async function onCopy() {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Smart Email Generator</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Draft professional emails with tone control. Every draft stays fully editable.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Priya Naidoo, Head of Operations"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Rescheduling the Q3 planning workshop"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="points">Key points</Label>
            <Textarea
              id="points"
              rows={5}
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder={"One point per line\nNew proposed date: 14 March\nAgenda unchanged"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onGenerate} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Generating draft…
              </>
            ) : (
              <>
                <Sparkles /> Generate email
              </>
            )}
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Editable draft</h2>
            <Button size="sm" variant="outline" onClick={onCopy} disabled={!draft}>
              {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          {loading ? (
            <div className="mt-4 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 animate-pulse rounded bg-muted"
                  style={{ width: `${90 - i * 8}%` }}
                />
              ))}
            </div>
          ) : (
            <Textarea
              rows={18}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Your generated email will appear here — edit it freely before sending."
              className="mt-4 font-mono text-xs leading-relaxed"
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
