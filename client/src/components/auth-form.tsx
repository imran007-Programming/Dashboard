"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api";
import { loginSchema, signupSchema, zodFieldErrors } from "@/lib/schemas";
import type { SignupRole } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuth } from "./auth-provider";
import { Alert, Button, Card, Field, Input } from "./ui";

type Mode = "login" | "signup";

const copy = {
  login: {
    title: "Welcome back",
    sticker: "Login",
    button: "Log in",
    switchText: "No account yet?",
    switchLink: "/signup",
    switchLabel: "Sign up",
  },
  signup: {
    title: "Create account",
    sticker: "Sign up",
    button: "Create account",
    switchText: "Already have an account?",
    switchLink: "/login",
    switchLabel: "Log in",
  },
} as const;

// Seeded by the server on start (server/src/lib/seed.ts)
const DEMO_PASSWORD = "123456";
const DEMO_ACCOUNTS = [
  { label: "Admin", email: "admin@gmail.com", color: "orange" },
  { label: "Mentor", email: "mentor@gmail.com", color: "purple" },
  { label: "Student", email: "student@gmail.com", color: "blue" },
] as const;

const ROLE_OPTIONS: { value: SignupRole; label: string; text: string; active: string }[] = [
  { value: "STUDENT", label: "Student", text: "Submit projects", active: "bg-blue" },
  { value: "MENTOR", label: "Mentor", text: "Review projects", active: "bg-purple" },
];

export function AuthForm({ mode }: { mode: Mode }) {
  const { user, ready, login, signup } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [role, setRole] = useState<SignupRole>("STUDENT");
  const text = copy[mode];

  // Already logged in
  useEffect(() => {
    if (ready && user) router.replace("/projects");
  }, [ready, user, router]);

  async function run(action: () => Promise<void>, form?: HTMLFormElement) {
    setSubmitting(true);
    setErrors({});
    setFormError("");

    try {
      await action();
      form?.reset();
      router.push("/projects");
    } catch (err) {
      if (err instanceof ApiError && err.errors.length > 0) {
        setErrors(err.fieldErrors());
      } else {
        setFormError(err instanceof Error ? err.message : "Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");

    // Validate with Zod first; the server runs the same schema again
    if (mode === "signup") {
      const result = signupSchema.safeParse({ name: String(data.get("name") ?? ""), email, password, role });
      if (!result.success) return showClientErrors(result.error);
      run(() => signup(result.data), form);
    } else {
      const result = loginSchema.safeParse({ email, password });
      if (!result.success) return showClientErrors(result.error);
      run(() => login(result.data), form);
    }
  }

  function showClientErrors(error: Parameters<typeof zodFieldErrors>[0]) {
    setFormError("");
    setErrors(zodFieldErrors(error));
  }

  function demoLogin(email: string) {
    run(() => login({ email, password: DEMO_PASSWORD }));
  }

  return (
    <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-[1fr_1.1fr]">
      <div className="hidden md:block">
        <p className="font-display text-6xl uppercase leading-none">
          {mode === "login" ? (
            <>
              Back to <span className="mt-1 inline-block bg-yellow px-1">work</span>.
            </>
          ) : (
            <>
              Ship it. <span className="mt-1 inline-block bg-pink px-1">Get</span> reviewed.
            </>
          )}
        </p>
        <p className="mt-6 max-w-sm text-lg font-medium">
          Submit your GitHub projects, track their review status and keep everything in one place.
        </p>
        {/* Graph paper note with shapes pinned on it */}
        <div className="relative mt-10 h-32 max-w-xs border-[3px] border-ink bg-white bg-grid-paper shadow-brutal">
          <span className="tape -top-3 left-1/2 -translate-x-1/2" aria-hidden />
          <div className="flex h-full items-center justify-center gap-4" aria-hidden>
            <span className="size-12 border-[3px] border-ink bg-blue shadow-brutal-sm" />
            <span className="size-12 rounded-full border-[3px] border-ink bg-green shadow-brutal-sm" />
            <span className="size-12 border-[3px] border-ink bg-orange bg-stripes shadow-brutal-sm" />
          </div>
        </div>
      </div>

      <Card className="relative p-6 shadow-brutal-xl sm:p-8">
        <span className="tape -top-3 -left-5" aria-hidden />
        <span className="absolute -top-4 right-6 border-[3px] border-ink bg-yellow px-3 py-1 font-display text-sm uppercase shadow-brutal-sm">
          {text.sticker}
        </span>
        <h1 className="font-display text-3xl uppercase">{text.title}</h1>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5" noValidate>
          {formError && <Alert>{formError}</Alert>}

          {mode === "signup" && (
            <div className="flex flex-col gap-2">
              <span id="role-label" className="font-display text-sm uppercase tracking-wide">
                Sign up as
              </span>
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-labelledby="role-label">
                {ROLE_OPTIONS.map((opt) => {
                  const active = role === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setRole(opt.value)}
                      className={cn(
                        "relative overflow-hidden border-[3px] border-ink p-3 text-left transition-all",
                        active ? cn(opt.active, "translate-x-[3px] translate-y-[3px] shadow-none") : "bg-white shadow-brutal-sm hover:-translate-y-0.5",
                      )}
                    >
                      {active && <span className="absolute inset-0 bg-stripes" aria-hidden />}
                      <span className="relative flex items-center justify-between font-display uppercase">
                        {opt.label}
                        <span className={cn("flex size-5 items-center justify-center border-2 border-ink text-xs", active ? "bg-white" : "bg-cream")}>
                          {active ? "✓" : ""}
                        </span>
                      </span>
                      <span className="relative mt-0.5 block text-xs font-bold">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
              {errors.role && <p className="text-xs font-bold text-red">{errors.role}</p>}
            </div>
          )}

          {mode === "signup" && (
            <Field label="Name" htmlFor="name" error={errors.name}>
              <Input id="name" name="name" autoComplete="name" placeholder="Your name" invalid={!!errors.name} required />
            </Field>
          )}

          <Field label="Email" htmlFor="email" error={errors.email}>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" invalid={!!errors.email} required />
          </Field>

          <Field label="Password" htmlFor="password" error={errors.password} hint={mode === "signup" ? "min 6 chars" : undefined}>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder="••••••••"
              invalid={!!errors.password}
              required
            />
          </Field>

          <Button type="submit" size="lg" color={mode === "login" ? "yellow" : "pink"} disabled={submitting} className="mt-2">
            {submitting ? "Please wait…" : `${text.button} →`}
          </Button>
        </form>

        {mode === "login" && (
          <div className="mt-8 border-t-[3px] border-dashed border-ink pt-6">
            <p className="flex items-center justify-between font-display text-sm uppercase">
              Try a demo account
              <span className="border-2 border-ink bg-white px-1.5 font-mono text-[10px] font-bold normal-case">pw: {DEMO_PASSWORD}</span>
            </p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {DEMO_ACCOUNTS.map((acc) => (
                <Button key={acc.email} type="button" color={acc.color} size="sm" disabled={submitting} onClick={() => demoLogin(acc.email)} title={acc.email}>
                  {acc.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        <p className="mt-6 text-center font-medium">
          {text.switchText}{" "}
          <Link href={text.switchLink} className="font-bold underline decoration-[3px] underline-offset-4 hover:bg-yellow">
            {text.switchLabel}
          </Link>
        </p>
      </Card>
    </div>
  );
}
