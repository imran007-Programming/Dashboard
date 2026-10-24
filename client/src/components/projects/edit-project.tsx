"use client";

import { useParams } from "next/navigation";
import { projectApi } from "@/lib/api";
import { useFetch } from "@/lib/use-fetch";
import { useAuth } from "../auth-provider";
import { Card, LinkButton, PageTitle, Spinner } from "../ui";
import { ErrorCard } from "./project-detail";
import { ProjectForm } from "./project-form";

export function EditProject() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data, error, loading } = useFetch(`project:${id}`, () => projectApi.get(id));

  if (loading) return <Spinner label="Loading project" />;
  if (error) return <ErrorCard error={error} />;
  if (!data) return null;

  const project = data.data;

  if (project.userId !== user?.id) {
    return (
      <Card color="red" className="mx-auto max-w-lg bg-stripes p-8 text-center">
        <p className="font-display text-5xl">403</p>
        <p className="mt-3 inline-block bg-white px-2 text-lg font-bold">You can only edit your own project.</p>
        <div>
          <LinkButton href={`/projects/${project.id}`} color="white" className="mt-6">
            ← Back to project
          </LinkButton>
        </div>
      </Card>
    );
  }

  return (
    <>
      <PageTitle eyebrow="Edit" title={project.name} />
      {/* New key after each save, so the form starts from the latest data */}
      <ProjectForm key={project.updatedAt} project={project} />
    </>
  );
}
