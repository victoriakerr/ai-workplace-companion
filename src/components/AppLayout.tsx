import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, NotebookPen, CalendarClock, Sparkles, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email-generator", label: "Email Generator", icon: Mail },
  { to: "/meeting-summarizer", label: "Meeting Summarizer", icon: NotebookPen },
  { to: "/task-planner", label: "Task Planning", icon: CalendarClock },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full bg-[oklch(0.32_0.14_25)] px-4 py-1.5 text-center text-xs tracking-wide text-white">
        AI-generated content may require human review.
      </div>

      <div className="flex">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-sidebar-border bg-sidebar px-3 py-5 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-8 flex items-center justify-between px-2">
            <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </span>
              <span className="font-display text-sm font-semibold leading-tight">
                AI Workplace
                <span className="block text-muted-foreground">Assistant</span>
              </span>
            </Link>
            <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="size-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {nav.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {open && (
          <div
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
        )}

        <div className="flex min-h-screen w-full min-w-0 flex-col">
          <header className="flex items-center gap-3 border-b border-border px-4 py-3 lg:hidden">
            <button onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="size-5" />
            </button>
            <span className="font-display text-sm font-semibold">AI Workplace Assistant</span>
          </header>

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8 sm:py-12">
            {children}
          </main>

          <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground sm:px-8">
            Responsible AI Disclaimer: AI can make mistakes. Please review all outputs before
            sending or acting on them.
          </footer>
        </div>
      </div>
    </div>
  );
}
