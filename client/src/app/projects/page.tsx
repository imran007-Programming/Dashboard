import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectsView } from "@/components/projects/projects-view";
import { RequireAuth } from "@/components/require-auth";
import { Spinner } from "@/components/ui";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <RequireAuth>
      {/* ProjectsView reads the query string, so it needs a Suspense boundary */}
      <Suspense fallback={<Spinner label="Loading projects" />}>
        <ProjectsView />
      </Suspense>
    </RequireAuth>
  );
}
