import { useEffect, useState } from "react";
import { fetchRnaModel } from "../services/rnaModel";
export default function useRnaModel(id) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ id: null, data: null, error: null });
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    let cancelled = false;
    let timedOut = false;
    setResult({ id, data: null, error: null });
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 20000);
    async function load() {
      try {
        const data = await fetchRnaModel(id, controller.signal, attempt > 0);
        if (!cancelled) setResult({ id, data, error: null });
      } catch (error) {
        if (!cancelled)
          setResult({
            id,
            data: null,
            error: timedOut
              ? "Loading coordinates took too long. Please retry."
              : error instanceof TypeError
                ? "Could not reach the structure service. Check your connection and retry."
                : error instanceof SyntaxError
                  ? "The structure service returned unreadable data."
                  : error.message,
          });
        controller.abort();
      } finally {
        clearTimeout(timeout);
      }
    }
    load();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [id, attempt]);
  const current = result.id === id ? result : { data: null, error: null };
  return {
    ...current,
    loading: !!id && !current.data && !current.error,
    retry: () => setAttempt((value) => value + 1),
  };
}
