"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError, projectApi } from "@/lib/api";
import type { Project } from "@/lib/types";
import { useFetch } from "@/lib/use-fetch";
import { cn, formatDate, shortUrl } from "@/lib/utils";
import { useAuth } from "../auth-provider";
import { ConfirmDialog } from "../confirm-dialog";
import { ReviewPanel } from "./review-panel";
import { Alert, Button, Card, LinkButton, Spinner, StatusBadge, statusColor, Window } from "../ui";

export function ErrorCard({ error }: { error: ApiError }) {
  return (
    <Card color={error.status === 404 ? "yellow" : "red"} className="relative mx-auto max-w-lg bg-stripes p-8 text-center">
      <span className="tape -top-3 left-1/2 -translate-x-1/2" aria-hidden />
      <p className="font-display text-6xl">{error.status || "!"}</p>
      <p className="mt-3 inline-block bg-white px-2 text-lg font-bold">{error.message}</p>
      <div>
        <LinkButton href="/projects" color="white" className="mt-6">
          ← Back to projects
        </LinkButton>
      </div>
    </Card>
  );
}

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const { data, error, loading } = useFetch(`project:${id}`, () => projectApi.get(id));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  // Latest copy after a status change, so the page updates without refetching
  const [updated, setUpdated] = useState<Project | null>(null);

  if (loading) return <Spinner label="Loading project" />;
  if (error) return <ErrorCard error={error} />;
  if (!data) return null;

  const project = updated?.id === data.data.id ? updated : data.data;
  const isOwner = user?.id === project.userId;
  const canEdit = isOwner && user?.role === "STUDENT";
  const canReview = user?.role === "MENTOR" || user?.role === "ADMIN";
  const canDelete = isOwner || canReview;

  async function handleDelete() {
    setDeleting(true);
    setDeleteError("");
    try {
      await projectApi.remove(project.id);
      setConfirmOpen(false);
      router.push("/projects");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Could not delete project");
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Link href="/projects" className="w-fit font-bold underline decoration-[3px] underline-offset-4 hover:bg-yellow">
        ← All projects
      </Link>

      {deleteError && <Alert>{deleteError}</Alert>}

      {canReview && <ReviewPanel project={project} onChange={setUpdated} />}

      <Card className="overflow-hidden shadow-brutal-xl">
        <div className={cn("flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-ink bg-stripes px-6 py-4", statusColor(project.status))}>
          <StatusBadge status={project.status} size="lg" />
          {(canEdit || canDelete) && (
            <div className="flex gap-3">
              {canEdit && (
                <LinkButton href={`/projects/${project.id}/edit`} color="white" size="sm">
                  ✎ Edit
                </LinkButton>
              )}
              {canDelete && (
                <Button color="red" size="sm" onClick={() => setConfirmOpen(true)}>
                  🗑 Delete
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="p-6 sm:p-10">
          <h1 className="font-display text-4xl uppercase leading-none break-words sm:text-6xl">{project.name}</h1>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border-[3px] border-ink bg-ink px-5 py-2.5 font-bold text-cream shadow-brutal transition-all hover:-translate-y-0.5 hover:shadow-brutal-lg"
            >
              GitHub ↗ <span className="hidden font-mono text-xs font-normal sm:inline">{shortUrl(project.repoUrl)}</span>
            </a>
            <a
              href={project.liveLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border-[3px] border-ink bg-green px-5 py-2.5 font-bold shadow-brutal transition-all hover:-translate-y-0.5 hover:shadow-brutal-lg"
            >
              Live site ↗ <span className="hidden font-mono text-xs font-normal sm:inline">{shortUrl(project.liveLink)}</span>
            </a>
          </div>

          {/* Description shown like a README file */}
          <Window title="README.md" color="blue" className="mt-10 max-w-3xl" bodyClassName="bg-grid-paper p-6">
            <p className="text-lg leading-relaxed font-medium whitespace-pre-line">{project.description}</p>
          </Window>
        </div>

        <dl className="grid border-t-[3px] border-ink sm:grid-cols-3">
          {[
            { label: "Owner", value: project.user ? `${project.user.name}` : "—", sub: project.user?.email },
            { label: "Submitted", value: formatDate(project.createdAt) },
            { label: "Last updated", value: formatDate(project.updatedAt) },
          ].map((item, i) => (
            <div key={item.label} className={cn("p-5", i > 0 && "border-t-[3px] border-ink sm:border-t-0 sm:border-l-[3px]")}>
              <dt className="font-mono text-xs font-bold uppercase text-ink/60">{item.label}</dt>
              <dd className="mt-1 text-lg font-bold">{item.value}</dd>
              {item.sub && <dd className="truncate font-mono text-xs">{item.sub}</dd>}
            </div>
          ))}
        </dl>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete project?"
        confirmLabel="Yes, delete"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      >
        <strong>{project.name}</strong> will be removed permanently. This cannot be undone.
      </ConfirmDialog>
    </div>
  );
}
