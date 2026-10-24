import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const colors = {
  yellow: "bg-yellow",
  pink: "bg-pink",
  blue: "bg-blue",
  green: "bg-green",
  red: "bg-red",
  purple: "bg-purple",
  orange: "bg-orange",
  white: "bg-white",
  ink: "bg-ink text-cream",
} as const;

export type Color = keyof typeof colors;

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
} as const;

// Lifts on hover, presses into the shadow on click
const pressable =
  "inline-flex items-center justify-center gap-2 border-[3px] border-ink font-bold uppercase tracking-wide shadow-brutal transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-[5px] active:translate-y-[5px] active:shadow-none disabled:pointer-events-none disabled:opacity-50";

interface ButtonStyle {
  color?: Color;
  size?: keyof typeof sizes;
}

export function Button({ color = "yellow", size = "md", className, ...props }: ComponentProps<"button"> & ButtonStyle) {
  return <button className={cn(pressable, colors[color], sizes[size], className)} {...props} />;
}

export function LinkButton({ color = "yellow", size = "md", className, ...props }: ComponentProps<typeof Link> & ButtonStyle) {
  return <Link className={cn(pressable, colors[color], sizes[size], className)} {...props} />;
}

export function Card({ color = "white", className, ...props }: ComponentProps<"div"> & { color?: Color }) {
  return <div className={cn("border-[3px] border-ink shadow-brutal", colors[color], className)} {...props} />;
}

// Retro window: title bar with three boxes, then content
export function Window({
  title,
  color = "yellow",
  className,
  bodyClassName,
  children,
}: {
  title: string;
  color?: Color;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("border-[3px] border-ink bg-white shadow-brutal", className)}>
      <div className={cn("flex items-center gap-3 border-b-[3px] border-ink px-3 py-2", colors[color])}>
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-3 border-2 border-ink bg-red" />
          <span className="size-3 border-2 border-ink bg-yellow" />
          <span className="size-3 border-2 border-ink bg-green" />
        </span>
        <span className="truncate font-mono text-xs font-bold uppercase">{title}</span>
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

// Comic starburst badge (decorative)
export function Starburst({ children, color = "yellow", className }: { children: ReactNode; color?: Color; className?: string }) {
  return (
    <span className={cn("inline-block drop-shadow-[3px_3px_0_#111111]", className)}>
      <span
        className={cn(
          "starburst flex size-24 items-center justify-center p-4 text-center font-display text-xs leading-tight uppercase",
          colors[color],
        )}
      >
        {children}
      </span>
    </span>
  );
}

const fieldBase =
  "w-full border-[3px] border-ink bg-white px-4 py-3 font-medium shadow-brutal-sm outline-none transition-all placeholder:text-ink/40 focus:-translate-y-0.5 focus:shadow-brutal focus-visible:outline-none";

export function Input({ className, invalid, ...props }: ComponentProps<"input"> & { invalid?: boolean }) {
  return <input className={cn(fieldBase, invalid && "bg-red/15", className)} aria-invalid={invalid || undefined} {...props} />;
}

export function Textarea({ className, invalid, ...props }: ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea className={cn(fieldBase, "min-h-36 resize-y", invalid && "bg-red/15", className)} aria-invalid={invalid || undefined} {...props} />
  );
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(fieldBase, "cursor-pointer py-2.5 pr-10 font-bold uppercase", className)} {...props} />;
}

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-between gap-3">
        <label htmlFor={htmlFor} className="font-display text-sm uppercase tracking-wide">
          {label}
        </label>
        {hint && <span className="font-mono text-xs text-ink/60">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="inline-flex w-fit items-center gap-1.5 border-2 border-ink bg-red px-2 py-0.5 text-xs font-bold text-ink">
          <span aria-hidden>✕</span> {error}
        </p>
      )}
    </div>
  );
}

export function Alert({ color = "red", title, children, action }: { color?: Color; title?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div role="alert" className={cn("flex flex-wrap items-center justify-between gap-3 border-[3px] border-ink p-4 shadow-brutal-sm", colors[color])}>
      <div>
        {title && <p className="font-display uppercase">{title}</p>}
        <p className="font-medium">{children}</p>
      </div>
      {action}
    </div>
  );
}

const statusStyle: Record<ProjectStatus, { color: string; icon: string }> = {
  PENDING: { color: "bg-yellow", icon: "◷" },
  APPROVED: { color: "bg-green", icon: "✓" },
  REJECTED: { color: "bg-red", icon: "✕" },
};

export function StatusBadge({ status, size = "sm" }: { status: ProjectStatus; size?: "sm" | "lg" }) {
  const { color, icon } = statusStyle[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border-2 border-ink font-mono font-bold uppercase",
        color,
        size === "sm" ? "px-2 py-0.5 text-xs" : "border-[3px] px-3 py-1 text-sm shadow-brutal-sm",
      )}
    >
      <span aria-hidden>{icon}</span>
      {status}
    </span>
  );
}

export function statusColor(status: ProjectStatus) {
  return statusStyle[status].color;
}

const roleColor = { STUDENT: "bg-blue", MENTOR: "bg-purple", ADMIN: "bg-orange" } as const;

export function RoleBadge({ role }: { role: keyof typeof roleColor }) {
  return <span className={cn("border-2 border-ink px-1.5 py-0.5 font-mono text-[10px] font-bold", roleColor[role])}>{role}</span>;
}

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16" role="status">
      <span className="size-6 animate-spin border-[3px] border-ink bg-yellow" />
      <span className="font-display uppercase">{label}…</span>
    </div>
  );
}

export function PageTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <span className="mb-3 inline-block border-2 border-ink bg-pink px-2 py-0.5 font-mono text-xs font-bold uppercase shadow-brutal-sm">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-4xl uppercase leading-none sm:text-5xl">{title}</h1>
      </div>
      {children}
    </div>
  );
}
