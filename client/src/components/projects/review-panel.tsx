"use client";

import { useState } from "react";
import { projectApi } from "@/lib/api";
import type { Project, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Alert, Window } from "../ui";

const OPTIONS: { status: ProjectStatus; label: string; icon: string; bg: string }[] = [
  { status: "APPROVED", label: "Approve", icon: "✓", bg: "bg-green" },
  { status: "REJECTED", label: "Reject", icon: "✕", bg: "bg-red" },
  { status: "PENDING", label: "Back to pending", icon: "◷", bg: "bg-yellow" },
];

// Mentor/admin only: set the review status of a project
export function ReviewPanel({ project, onChange }: { project: Project; onChange: (project: Project) => void }) {
  const [saving, setSaving] = useState<ProjectStatus | null>(null);
  const [error, setError] = useState("");

  async function setStatus(status: ProjectStatus) {
    setSaving(status);
    setError("");
    try {
      const res = await projectApi.setStatus(project.id, status);
      onChange(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status");
    } finally {
      setSaving(null);
    }
  }

  return (
    <Window title="review.panel" color="purple" bodyClassName="flex flex-col gap-4 bg-grid-paper p-5">
      <p className="w-fit bg-white px-1 font-medium">
        Current status: <span className="font-mono font-bold">{project.status}</span>
      </p>

      {error && <Alert>{error}</Alert>}

      <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Set project status">
        {OPTIONS.map((opt) => {
          const current = project.status === opt.status;
          return (
            <button
              key={opt.status}
              onClick={() => setStatus(opt.status)}
              disabled={current || saving !== null}
              aria-pressed={current}
              className={cn(
                "relative flex items-center justify-center gap-2 overflow-hidden border-[3px] border-ink px-4 py-3 font-bold uppercase transition-all",
                opt.bg,
                current
                  ? "translate-x-[5px] translate-y-[5px] cursor-default shadow-none"
                  : "shadow-brutal hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-[5px] active:translate-y-[5px] active:shadow-none disabled:opacity-60",
              )}
            >
              {current && <span className="absolute inset-0 bg-stripes" aria-hidden />}
              <span className="relative flex size-6 items-center justify-center border-2 border-ink bg-white text-xs" aria-hidden>
                {opt.icon}
              </span>
              <span className="relative">{saving === opt.status ? "Saving…" : current ? "Current" : opt.label}</span>
            </button>
          );
        })}
      </div>
    </Window>
  );
}
