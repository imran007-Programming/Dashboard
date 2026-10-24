"use client";

import { useCallback, useEffect, useEffectEvent, useState } from "react";
import { ApiError } from "./api";

interface FetchState<T> {
  key: string;
  data?: T;
  error?: ApiError;
}

// Fetches when `key` changes. Pass null to skip.
export function useFetch<T>(key: string | null, fetcher: () => Promise<T>) {
  const [state, setState] = useState<FetchState<T> | null>(null);
  const [version, setVersion] = useState(0);

  const requestKey = key === null ? null : `${key}#${version}`;
  const runFetcher = useEffectEvent(fetcher);

  useEffect(() => {
    if (requestKey === null) return;
    let cancelled = false;

    runFetcher()
      .then((data) => {
        if (!cancelled) setState({ key: requestKey, data });
      })
      .catch((err) => {
        if (cancelled) return;
        const error = err instanceof ApiError ? err : new ApiError(0, "Something went wrong");
        setState({ key: requestKey, error });
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  const current = state?.key === requestKey ? state : null;

  return {
    data: current?.data,
    error: current?.error,
    // Keep showing old data while the next page loads
    previous: state?.data,
    loading: requestKey !== null && current === null,
    reload,
  };
}
