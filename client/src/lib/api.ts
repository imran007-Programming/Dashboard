import type { ApiResponse, FieldError, Project, ProjectInput, ProjectQuery, ProjectStatus, SignupInput, User } from "./types";

export class ApiError extends Error {
  status: number;
  errors: FieldError[];

  constructor(status: number, message: string, errors: FieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }

  // Field errors from zod as { name: "Name is required", ... }
  fieldErrors(): Record<string, string> {
    return Object.fromEntries(this.errors.map((e) => [e.field, e.message]));
  }
}

type Method = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: Method;
  body?: unknown;
  query?: object;
}

// Called when the session is gone and refresh also failed
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

// Share one refresh call between requests that fail at the same time
let refreshing: Promise<boolean> | null = null;

function refreshSession() {
  refreshing ??= fetch("/api/auth/refresh", { method: "POST" })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

function buildUrl(path: string, query?: object) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return `/api${path}${qs ? `?${qs}` : ""}`;
}

async function request<T>(path: string, options: RequestOptions = {}, retry = true): Promise<ApiResponse<T>> {
  const { method = "GET", body, query } = options;

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "Network error. Check your connection.");
  }

  const json = await res.json().catch(() => null);

  // Access token expired: refresh once and retry
  if (res.status === 401 && retry && !path.startsWith("/auth/")) {
    if (await refreshSession()) {
      return request<T>(path, options, false);
    }
    onUnauthorized?.();
  }

  if (!json) {
    throw new ApiError(res.status, "Cannot reach the API server. Is it running on port 5000?");
  }

  if (!res.ok || !json.success) {
    throw new ApiError(res.status, json.message ?? "Something went wrong", json.errors ?? []);
  }

  return json as ApiResponse<T>;
}

export const authApi = {
  signup: (body: SignupInput) =>
    request<User>("/auth/signup", { method: "POST", body }),

  login: (body: { email: string; password: string }) =>
    request<User>("/auth/login", { method: "POST", body }),

  logout: () => request<null>("/auth/logout", { method: "POST" }),
};

export const projectApi = {
  list: (query: ProjectQuery) => request<Project[]>("/project", { query }),

  get: (id: string) => request<Project>(`/project/${id}`),

  create: (body: ProjectInput) => request<Project>("/project", { method: "POST", body }),

  update: (id: string, body: Partial<ProjectInput>) =>
    request<Project>(`/project/${id}`, { method: "PATCH", body }),

  remove: (id: string) => request<null>(`/project/${id}`, { method: "DELETE" }),

  // Mentor/admin only
  setStatus: (id: string, status: ProjectStatus) =>
    request<Project>(`/project/${id}/status`, { method: "PATCH", body: { status } }),
};
