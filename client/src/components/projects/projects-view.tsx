"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { projectApi } from "@/lib/api";
import type { ProjectQuery, ProjectStatus, SortBy, SortOrder } from "@/lib/types";
import { useFetch } from "@/lib/use-fetch";
import { cn } from "@/lib/utils";
import { useAuth } from "../auth-provider";
import { Alert, Button, Card, Input, LinkButton, PageTitle, Select } from "../ui";
import { Pagination } from "./pagination";
import { ProjectCard, ProjectCardSkeleton } from "./project-card";

const STATUSES: (ProjectStatus | "ALL")[] = ["ALL", "PENDING", "APPROVED", "REJECTED"];

const statusChip: Record<ProjectStatus | "ALL", string> = {
  ALL: "bg-white",
  PENDING: "bg-yellow",
  APPROVED: "bg-green",
  REJECTED: "bg-red",
};

const statTiles: { key: "total" | ProjectStatus; label: string; bg: string }[] = [
  { key: "total", label: "Total", bg: "bg-white" },
  { key: "PENDING", label: "Pending", bg: "bg-yellow" },
  { key: "APPROVED", label: "Approved", bg: "bg-green" },
  { key: "REJECTED", label: "Rejected", bg: "bg-red" },
];

const SORTS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "updatedAt:desc", label: "Recently updated" },
  { value: "name:asc", label: "Name A → Z" },
  { value: "name:desc", label: "Name Z → A" },
];

const LIMITS = [6, 12, 24];
const DEFAULT_LIMIT = 12;

// The URL is the source of truth for filters, so they survive reloads and can be shared
function readQuery(params: URLSearchParams): Required<Pick<ProjectQuery, "page" | "limit" | "sortBy" | "sortOrder">> & ProjectQuery {
  const page = Number(params.get("page"));
  const limit = Number(params.get("limit"));
  const status = params.get("status") as ProjectStatus | null;
  const [sortBy, sortOrder] = (params.get("sort") ?? "createdAt:desc").split(":") as [SortBy, SortOrder];
  const validSort = SORTS.some((s) => s.value === `${sortBy}:${sortOrder}`);

  return {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: LIMITS.includes(limit) ? limit : DEFAULT_LIMIT,
    search: params.get("search")?.trim() || undefined,
    status: status && STATUSES.includes(status) && status !== ("ALL" as string) ? status : undefined,
    sortBy: validSort ? sortBy : "createdAt",
    sortOrder: validSort ? sortOrder : "desc",
  };
}

// Count per status, using limit=1 requests and reading meta.total
async function fetchStats() {
  const statuses: (ProjectStatus | undefined)[] = [undefined, "PENDING", "APPROVED", "REJECTED"];
  const [total, PENDING, APPROVED, REJECTED] = await Promise.all(
    statuses.map((status) => projectApi.list({ limit: 1, status }).then((res) => res.meta?.total ?? 0)),
  );
  return { total, PENDING, APPROVED, REJECTED };
}

export function ProjectsView() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = useMemo(() => readQuery(searchParams), [searchParams]);
  const [searchText, setSearchText] = useState(query.search ?? "");

  const { data, error, loading, previous, reload } = useFetch(`projects?${searchParams.toString()}`, () =>
    projectApi.list(query),
  );
  const stats = useFetch("project-stats", fetchStats);

  function updateParams(changes: Record<string, string | null>, resetPage = true) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    if (resetPage) next.delete("page");
    const qs = next.toString();
    router.replace(qs ? `/projects?${qs}` : "/projects", { scroll: false });
  }

  // Debounce search input before it goes to the URL
  const applySearch = useEffectEvent((value: string) => {
    if (value !== (query.search ?? "")) updateParams({ search: value || null });
  });

  useEffect(() => {
    const timer = setTimeout(() => applySearch(searchText.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  function goToPage(page: number) {
    updateParams({ page: page > 1 ? String(page) : null }, false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearFilters() {
    setSearchText("");
    router.replace("/projects", { scroll: false });
  }

  const isStudent = user?.role === "STUDENT";
  const result = data ?? previous;
  const projects = result?.data ?? [];
  const meta = result?.meta;
  const hasFilters = !!(query.search || query.status || searchParams.get("sort"));
  const activeStatus = query.status ?? "ALL";
  const statValues = stats.data ?? stats.previous;

  return (
    <div>
      <PageTitle eyebrow={user?.role.toLowerCase()} title={isStudent ? "My projects" : "All projects"}>
        {isStudent && (
          <LinkButton href="/projects/new" color="green">
            + New project
          </LinkButton>
        )}
      </PageTitle>

      {/* Stats strip: click a tile to filter by that status */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statTiles.map(({ key, label, bg }) => {
          const status = key === "total" ? "ALL" : key;
          const active = activeStatus === status;
          return (
            <button
              key={key}
              onClick={() => updateParams({ status: status === "ALL" ? null : status })}
              aria-pressed={active}
              className={cn(
                "relative overflow-hidden border-[3px] border-ink p-4 text-left transition-all",
                bg,
                active ? "translate-x-[5px] translate-y-[5px] shadow-none" : "shadow-brutal hover:-translate-y-0.5 hover:shadow-brutal-lg",
              )}
            >
              {active && <span className="absolute inset-0 bg-stripes" aria-hidden />}
              <span className="relative flex items-center justify-between font-mono text-xs font-bold uppercase">
                {label}
                {active && <span className="border-2 border-ink bg-white px-1">●</span>}
              </span>
              <span className="relative mt-2 block font-display text-4xl leading-none tabular-nums">
                {statValues ? statValues[key] : <span className="inline-block h-9 w-10 animate-pulse bg-ink/15 align-middle" />}
              </span>
            </button>
          );
        })}
      </div>

      <Card className="mb-8 flex flex-col gap-5 bg-grid-paper p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
          <label className="relative">
            <span className="sr-only">Search projects</span>
            <span className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 font-bold" aria-hidden>
              ⌕
            </span>
            <Input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by name or description…"
              className="pl-10"
            />
          </label>
          <label>
            <span className="sr-only">Sort</span>
            <Select value={`${query.sortBy}:${query.sortOrder}`} onChange={(e) => updateParams({ sort: e.target.value === "createdAt:desc" ? null : e.target.value })}>
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </label>
          <label>
            <span className="sr-only">Per page</span>
            <Select value={query.limit} onChange={(e) => updateParams({ limit: e.target.value === String(DEFAULT_LIMIT) ? null : e.target.value })}>
              {LIMITS.map((l) => (
                <option key={l} value={l}>
                  {l} / page
                </option>
              ))}
            </Select>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => updateParams({ status: s === "ALL" ? null : s })}
                aria-pressed={activeStatus === s}
                className={cn(
                  "border-[3px] border-ink px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all",
                  activeStatus === s
                    ? cn(statusChip[s], "translate-x-[3px] translate-y-[3px] shadow-none ring-0")
                    : "bg-white shadow-brutal-sm hover:-translate-y-0.5 hover:bg-cream",
                )}
              >
                {activeStatus === s && "● "}
                {s}
              </button>
            ))}
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="bg-white px-1 font-bold underline decoration-[3px] underline-offset-4 hover:bg-yellow">
              Clear filters ✕
            </button>
          )}
        </div>
      </Card>

      {error ? (
        <Alert
          title={`Error ${error.status || ""}`.trim()}
          action={
            <Button color="white" size="sm" onClick={reload}>
              Try again
            </Button>
          }
        >
          {error.message}
        </Alert>
      ) : !result ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card color="yellow" className="relative flex flex-col items-center gap-4 bg-stripes px-6 py-14 text-center">
          <span className="tape -top-3 left-1/2 -translate-x-1/2" aria-hidden />
          <p className="bg-white px-2 font-display text-5xl" aria-hidden>
            ¯\_(ツ)_/¯
          </p>
          <p className="bg-white px-2 font-display text-2xl uppercase">{hasFilters ? "Nothing matches" : "No projects yet"}</p>
          <p className="max-w-sm bg-yellow px-2 font-medium">
            {hasFilters ? "Try a different search or status." : isStudent ? "Submit your first project to get it reviewed." : "Students have not submitted anything yet."}
          </p>
          {hasFilters ? (
            <Button color="white" onClick={clearFilters}>
              Clear filters
            </Button>
          ) : (
            isStudent && (
              <LinkButton href="/projects/new" color="pink">
                + Submit a project
              </LinkButton>
            )
          )}
        </Card>
      ) : (
        <>
          <div className={cn("grid gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3", loading && "opacity-50")} aria-busy={loading}>
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} showOwner={!isStudent} />
            ))}
          </div>
          {meta && <Pagination meta={meta} onChange={goToPage} />}
        </>
      )}
    </div>
  );
}
