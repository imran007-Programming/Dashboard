import type { Metadata } from "next";
import { Suspense } from "react";
import { EditProject } from "@/components/projects/edit-project";
import { RequireAuth } from "@/components/require-auth";
import { Spinner } from "@/components/ui";

export const metadata: Metadata = { title: "Edit project" };

export default function EditProjectPage() {
  return (
    <RequireAuth roles={["STUDENT"]}>
      <Suspense fallback={<Spinner label="Loading project" />}>
        <EditProject />
      </Suspense>
    </RequireAuth>
  );
}
