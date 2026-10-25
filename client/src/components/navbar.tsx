"use client";

import Link from "next/link";
import { useAuth } from "./auth-provider";
import { Button, LinkButton, RoleBadge } from "./ui";

export function Navbar() {
  const { user, ready, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-cream">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Devfolio Hub home">
          <span className="border-[3px] border-ink bg-yellow px-2 py-0.5 font-display text-lg shadow-brutal-sm">DEVFOLIO</span>
          <span className="font-display text-lg">/HUB</span>
        </Link>

        {/* Empty until the session is read, so there is no login/logout flicker */}
        <div className="flex min-h-10 flex-wrap items-center gap-3">
          {ready && user && (
            <>
              <LinkButton href="/projects" color="white" size="sm">
                Projects
              </LinkButton>
              {user.role === "STUDENT" && (
                <LinkButton href="/projects/new" color="green" size="sm">
                  + New
                </LinkButton>
              )}
              <div className="hidden items-center gap-2 border-[3px] border-ink bg-white px-3 py-1 sm:flex">
                <span className="max-w-32 truncate text-sm font-bold">{user.name}</span>
                <RoleBadge role={user.role} />
              </div>
              <Button color="pink" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          )}
          {ready && !user && (
            <>
              <LinkButton href="/login" color="white" size="sm">
                Login
              </LinkButton>
              <LinkButton href="/signup" color="pink" size="sm">
                Sign up
              </LinkButton>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
