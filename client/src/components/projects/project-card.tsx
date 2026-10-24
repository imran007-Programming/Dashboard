import Link from "next/link";
import type { Project } from "@/lib/types";
import { cn, formatDate, shortUrl } from "@/lib/utils";
import { StatusBadge, statusColor } from "../ui";

export function ProjectCard({ project, showOwner }: { project: Project; showOwner: boolean }) {
  return (
    <article className="flex flex-col border-[3px] border-ink bg-white shadow-brutal transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-xl">
      <div className={cn("flex items-center justify-between gap-2 border-b-[3px] border-ink bg-stripes px-4 py-2", statusColor(project.status))}>
        <StatusBadge status={project.status} />
        <time dateTime={project.createdAt} className="bg-white px-1 font-mono text-xs font-bold">
          {formatDate(project.createdAt)}
        </time>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 font-display text-xl uppercase leading-tight">
          <Link href={`/projects/${project.id}`} className="hover:underline hover:decoration-[3px]">
            {project.name}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm font-medium text-ink/75">{project.description}</p>
        {showOwner && project.user && (
          <p className="mt-auto flex items-center gap-2 pt-2 text-sm">
            <span className="flex size-7 shrink-0 items-center justify-center border-2 border-ink bg-purple font-display text-xs">
              {project.user.name.charAt(0).toUpperCase()}
            </span>
            <span className="truncate font-bold">{project.user.name}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 border-t-[3px] border-ink text-center text-xs font-bold uppercase">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="border-r-[3px] border-ink px-2 py-2.5 hover:bg-yellow"
          title={shortUrl(project.repoUrl)}
        >
          Repo ↗
        </a>
        <a
          href={project.liveLink}
          target="_blank"
          rel="noreferrer"
          className="border-r-[3px] border-ink px-2 py-2.5 hover:bg-green"
          title={shortUrl(project.liveLink)}
        >
          Live ↗
        </a>
        <Link href={`/projects/${project.id}`} className="bg-ink px-2 py-2.5 text-cream hover:bg-pink hover:text-ink">
          Open →
        </Link>
      </div>
    </article>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="flex h-72 animate-pulse flex-col border-[3px] border-ink bg-white shadow-brutal" aria-hidden>
      <div className="h-11 border-b-[3px] border-ink bg-ink/10 bg-stripes" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-6 w-3/4 bg-ink/15" />
        <div className="h-4 w-full bg-ink/10" />
        <div className="h-4 w-5/6 bg-ink/10" />
      </div>
    </div>
  );
}
