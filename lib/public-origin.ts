import type { NextRequest } from "next/server";

/**
 * The public-facing origin for this deployment, used to build emailed
 * auth links so the link a user clicks and the origin it redirects to
 * are always the same host. Same resolution order as praetom's
 * public-origin: dev loopback wins, then NEXT_PUBLIC_SITE_URL
 * (authoritative in Railway), then forwarded headers, then Host.
 * Internal bind addresses (0.0.0.0 behind Railway's proxy) are filtered
 * at every step.
 */

const INTERNAL_HOSTS = ["0.0.0.0", "[::]", "localhost:0"];

function isInternal(host: string): boolean {
  return INTERNAL_HOSTS.some((bad) => host.startsWith(bad));
}

function isLoopback(host: string): boolean {
  return host.startsWith("localhost") || host.startsWith("127.");
}

export function originFromHeaders(get: (name: string) => string | null): string {
  const host = get("host");
  if (host && isLoopback(host) && !isInternal(host)) {
    return `http://${host}`;
  }

  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  const fwdHost = get("x-forwarded-host");
  if (fwdHost && !isInternal(fwdHost)) {
    return `${get("x-forwarded-proto") ?? "https"}://${fwdHost}`;
  }

  if (host && !isInternal(host)) {
    return `${isLoopback(host) ? "http" : "https"}://${host}`;
  }

  const railway = process.env.RAILWAY_PUBLIC_DOMAIN?.trim();
  if (railway) return `https://${railway}`;

  return "https://standardreasoningcompany.com";
}

export function publicOrigin(req: NextRequest): string {
  return originFromHeaders((name) => req.headers.get(name));
}
