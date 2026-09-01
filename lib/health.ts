/**
 * Live health for the tools index.
 *
 * The status column used to be a word typed into a file, which is a claim
 * rather than a fact. This actually reaches the endpoint and reports what
 * came back, so the page can be wrong about a tool for at most one
 * revalidation window rather than indefinitely.
 */

export type HealthState = "operational" | "unreachable" | "retired";

export interface Health {
  state: HealthState;
  /** Round trip in milliseconds. Absent when nothing was contacted. */
  ms?: number;
  /** HTTP status actually returned, for the retired case there is none. */
  code?: number;
}

const TIMEOUT_MS = 5000;

/**
 * A retired tool has no endpoint, so it is reported as retired rather than
 * as unreachable. Those are different facts and collapsing them would make
 * the index look broken instead of complete.
 */
export async function checkHealth(url?: string): Promise<Health> {
  if (!url) return { state: "retired" };

  const started = Date.now();

  try {
    // HEAD keeps this cheap. Any response at all proves the host is up, so
    // a 405 from a server that refuses HEAD still counts as reachable;
    // only 5xx means the service itself is failing.
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });

    return {
      state: res.status < 500 ? "operational" : "unreachable",
      ms: Date.now() - started,
      code: res.status,
    };
  } catch {
    // DNS failure, TLS failure, connection refused, or timeout.
    return { state: "unreachable", ms: Date.now() - started };
  }
}

export const HEALTH_LABEL: Record<HealthState, string> = {
  operational: "Operational",
  unreachable: "Unreachable",
  retired: "Retired",
};
