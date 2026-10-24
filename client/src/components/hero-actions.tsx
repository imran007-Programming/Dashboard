"use client";

import { useAuth } from "./auth-provider";
import { LinkButton } from "./ui";

export function HeroActions() {
  const { user, ready } = useAuth();

  if (ready && user) {
    return (
      <div className="flex flex-wrap gap-4">
        <LinkButton href="/projects" size="lg">
          Open dashboard →
        </LinkButton>
        {user.role === "STUDENT" && (
          <LinkButton href="/projects/new" size="lg" color="green">
            + Submit project
          </LinkButton>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      <LinkButton href="/signup" size="lg" color="pink">
        Get started →
      </LinkButton>
      <LinkButton href="/login" size="lg" color="white">
        I have an account
      </LinkButton>
    </div>
  );
}
