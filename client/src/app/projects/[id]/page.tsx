import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectDetail } from "@/components/projects/project-detail";
import { RequireAuth } from "@/components/require-auth";
import { Spinner } from "@/components/ui";

export const metadata: Metadata = { title: "Project" };

export default function ProjectPage() {
  return (
    <RequireAuth>
      {/* The id is only known at request time, so useParams needs Suspense */}
      <Suspense fallback={<Spinner label="Loading project" />}>
        <ProjectDetail />
      </Suspense>
    </RequireAuth>
  );
}
