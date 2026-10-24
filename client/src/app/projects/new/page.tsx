import type { Metadata } from "next";
import { ProjectForm } from "@/components/projects/project-form";
import { RequireAuth } from "@/components/require-auth";
import { PageTitle } from "@/components/ui";

export const metadata: Metadata = { title: "New project" };

export default function NewProjectPage() {
  return (
    <RequireAuth roles={["STUDENT"]}>
      <PageTitle eyebrow="Submit" title="New project" />
      <ProjectForm />
    </RequireAuth>
  );
}
