"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import type { Role } from "@/lib/types";
import { useAuth } from "./auth-provider";
import { Card, LinkButton, Spinner } from "./ui";

// Client-side guard. The API still checks auth and roles on every request.
export function RequireAuth({ roles, children }: { roles?: Role[]; children: ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) return <Spinner label="Checking session" />;

  if (roles && !roles.includes(user.role)) {
    return (
      <Card color="red" className="relative mx-auto max-w-lg bg-stripes p-8 text-center">
        <span className="tape -top-3 left-1/2 -translate-x-1/2" aria-hidden />
        <p className="font-display text-5xl">403</p>
        <p className="mt-3 text-lg font-bold">This page is only for {roles.join(" / ").toLowerCase()} accounts.</p>
        <LinkButton href="/projects" color="white" className="mt-6">
          Back to projects
        </LinkButton>
      </Card>
    );
  }

  return children;
}
