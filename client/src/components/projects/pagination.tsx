import type { PaginationMeta } from "@/lib/types";
import { cn } from "@/lib/utils";

// 1 … 4 5 6 … 10
function pageList(page: number, totalPages: number): (number | "gap")[] {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const result: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("gap");
    result.push(p);
  });
  return result;
}

const box =
  "flex h-11 min-w-11 items-center justify-center border-[3px] border-ink px-3 font-display shadow-brutal-sm transition-all";
const clickable = "bg-white hover:-translate-y-0.5 hover:bg-yellow hover:shadow-brutal active:translate-y-0.5 active:shadow-none";

export function Pagination({ meta, onChange }: { meta: PaginationMeta; onChange: (page: number) => void }) {
  const { page, totalPages, total, limit } = meta;
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-between gap-4" aria-label="Pagination">
      <p className="border-2 border-ink bg-white px-2 py-1 font-mono text-sm font-bold">
        {from}–{to} of {total}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          className={cn(box, clickable, "disabled:pointer-events-none disabled:opacity-40")}
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          ←
        </button>
        {pageList(page, totalPages).map((p, i) =>
          p === "gap" ? (
            <span key={`gap-${i}`} className="px-1 font-display">
              …
            </span>
          ) : (
            <button
              key={p}
              className={cn(box, p === page ? "bg-ink text-cream" : clickable)}
              onClick={() => onChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          ),
        )}
        <button
          className={cn(box, clickable, "disabled:pointer-events-none disabled:opacity-40")}
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </nav>
  );
}
