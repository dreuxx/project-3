import { useEffect, useState } from "react";
import { fetchStructures } from "../services/rcsb";

export default function useRnaStructures(simulateError = false) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({
    status: "loading",
    data: [],
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    let timedOut = false;
    setResult({ status: "loading", data: [], error: null });
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 12000);

    async function load() {
      try {
        const data = await fetchStructures({
          signal: controller.signal,
          simulateError,
        });
        if (!cancelled) setResult({ status: "data", data, error: null });
      } catch (error) {
        if (cancelled) return;
        const message = timedOut
          ? "The request took too long. Check your connection and retry."
          : error instanceof TypeError
            ? "We could not reach RCSB PDB. Check your connection and retry."
            : error.message ||
              "The structures could not be loaded. Please retry.";
        setResult({ status: "error", data: [], error: message });
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
  }, [simulateError, attempt]);

  return {
    data: result.data,
    loading: result.status === "loading",
    error: result.error,
    retry: () => setAttempt((current) => current + 1),
  };
}
