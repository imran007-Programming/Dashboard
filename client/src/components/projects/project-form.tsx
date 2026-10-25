"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ApiError, projectApi } from "@/lib/api";
import { createProjectSchema, zodFieldErrors } from "@/lib/schemas";
import type { Project, ProjectInput } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Alert, Button, Card, Field, Input, LinkButton, Textarea, Window } from "../ui";

const empty: ProjectInput = { name: "", repoUrl: "", liveLink: "", description: "" };

// Checklist ticks come from the same Zod schema, one field at a time
const passes = (field: keyof ProjectInput, v: ProjectInput) => createProjectSchema.shape[field].safeParse(v[field]).success;

const rules: { field: keyof ProjectInput; label: string; check: (v: ProjectInput) => boolean }[] = [
  { field: "name", label: "Name is 3–100 characters", check: (v) => passes("name", v) },
  { field: "repoUrl", label: "Repo is a github.com link", check: (v) => passes("repoUrl", v) },
  { field: "liveLink", label: "Live link is a valid URL", check: (v) => passes("liveLink", v) },
  { field: "description", label: "Description is 20–1000 characters", check: (v) => passes("description", v) },
];

interface ProjectFormProps {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = !!project;
  const initial: ProjectInput = project
    ? { name: project.name, repoUrl: project.repoUrl, liveLink: project.liveLink, description: project.description }
    : empty;

  const [values, setValues] = useState<ProjectInput>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectInput, string>>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function setField(field: keyof ProjectInput, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    // Validate with Zod before the request; the server runs the same schema again
    const result = createProjectSchema.safeParse(values);
    if (!result.success) {
      setErrors(zodFieldErrors(result.error));
      return;
    }

    // Parsed data is already trimmed by the schema
    const trimmed: ProjectInput = result.data;

    // On edit, send only the fields that changed
    const changes = isEdit
      ? (Object.fromEntries(Object.entries(trimmed).filter(([k, v]) => v !== initial[k as keyof ProjectInput])) as Partial<ProjectInput>)
      : trimmed;

    if (isEdit && Object.keys(changes).length === 0) {
      setFormError("Nothing changed yet.");
      return;
    }

    setSubmitting(true);
    try {
      const res = isEdit ? await projectApi.update(project.id, changes) : await projectApi.create(trimmed);
      // Page stays mounted in the background, so start fresh next time
      setValues(isEdit ? trimmed : empty);
      router.push(`/projects/${res.data.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.errors.length > 0) {
        setErrors(err.fieldErrors());
      } else {
        setFormError(err instanceof Error ? err.message : "Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const done = rules.filter((r) => r.check(values)).length;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          {formError && <Alert color={formError === "Nothing changed yet." ? "yellow" : "red"}>{formError}</Alert>}

          <Field label="Project name" htmlFor="name" error={errors.name}>
            <Input id="name" value={values.name} onChange={(e) => setField("name", e.target.value)} placeholder="e.g. Task Manager API" invalid={!!errors.name} maxLength={100} />
          </Field>

          <Field label="GitHub repository" htmlFor="repoUrl" error={errors.repoUrl}>
            <Input
              id="repoUrl"
              type="url"
              value={values.repoUrl}
              onChange={(e) => setField("repoUrl", e.target.value)}
              placeholder="https://github.com/you/project"
              invalid={!!errors.repoUrl}
              className="font-mono text-sm"
            />
          </Field>

          <Field label="Live link" htmlFor="liveLink" error={errors.liveLink}>
            <Input
              id="liveLink"
              type="url"
              value={values.liveLink}
              onChange={(e) => setField("liveLink", e.target.value)}
              placeholder="https://project.vercel.app"
              invalid={!!errors.liveLink}
              className="font-mono text-sm"
            />
          </Field>

          <Field label="Description" htmlFor="description" error={errors.description} hint={`${values.description.trim().length} / 1000`}>
            <Textarea
              id="description"
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="What does it do? What did you use to build it?"
              invalid={!!errors.description}
              maxLength={1000}
            />
          </Field>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button type="submit" size="lg" color={isEdit ? "blue" : "green"} disabled={submitting}>
              {submitting ? "Saving…" : isEdit ? "Save changes" : "Submit project →"}
            </Button>
            <LinkButton href={isEdit ? `/projects/${project.id}` : "/projects"} size="lg" color="white">
              Cancel
            </LinkButton>
          </div>
        </form>
      </Card>

      <Window title="checklist.txt" className="lg:sticky lg:top-24" bodyClassName="bg-grid-paper p-6">
        {/* Progress bar fills as rules pass */}
        <div className="flex items-center gap-3">
          <div className="h-5 flex-1 border-[3px] border-ink bg-white">
            <div className="h-full bg-green bg-stripes transition-all" style={{ width: `${(done / rules.length) * 100}%` }} />
          </div>
          <span className="font-mono text-sm font-bold">
            {done}/{rules.length}
          </span>
        </div>
        <ul className="mt-5 flex flex-col gap-3">
          {rules.map((r) => {
            const ok = r.check(values);
            return (
              <li key={r.field} className="flex items-start gap-3 font-medium">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center border-[3px] border-ink text-xs font-bold",
                    ok ? "bg-green" : "bg-white",
                  )}
                  aria-hidden
                >
                  {ok ? "✓" : ""}
                </span>
                <span className={cn("bg-white px-1", ok && "line-through decoration-2")}>{r.label}</span>
                <span className="sr-only">{ok ? "done" : "not done"}</span>
              </li>
            );
          })}
        </ul>
        {!isEdit && (
          <p className="mt-6 border-t-[3px] border-ink bg-white pt-4 text-sm font-medium">
            New projects start as PENDING until a mentor reviews them.
          </p>
        )}
      </Window>
    </div>
  );
}
