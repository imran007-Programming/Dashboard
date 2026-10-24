import type { User } from "./types";

// Logged-in user is kept in localStorage (tokens stay in httpOnly cookies).
// Works as an external store for useSyncExternalStore.

const KEY = "pd_user";
const EVENT = "pd-session-change";

// Fallback when localStorage is blocked (private mode etc.)
let memory: string | null = null;

export function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

export function getSnapshot(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return memory;
  }
}

// undefined on the server means "not loaded yet"
export function getServerSnapshot(): string | null | undefined {
  return undefined;
}

export function saveUser(user: User | null) {
  memory = user ? JSON.stringify(user) : null;
  try {
    if (memory) localStorage.setItem(KEY, memory);
    else localStorage.removeItem(KEY);
  } catch {
    // ignore, memory fallback is used
  }
  window.dispatchEvent(new Event(EVENT));
}

export function parseUser(raw: string | null | undefined): User | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}
