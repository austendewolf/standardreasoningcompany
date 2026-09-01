"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

/**
 * The live panel: open connections now, and rolling active counts.
 *
 * Connections come from Supabase Realtime presence, so the number is
 * actual open sockets rather than a page-view tally, and it drops the
 * moment a tab closes. Region comes from the browser's own IANA timezone
 * rather than an IP lookup: it is coarse by construction, the browser
 * volunteers it, and presence lives in memory on the realtime server for
 * exactly as long as the socket does.
 *
 * The rolling counts come from a browser-generated id in localStorage.
 * No address is recorded anywhere, which is what makes publishing a count
 * from it defensible on a public page.
 */

const CHANNEL = "sheet";
const VISITOR_KEY = "src.visitor";

interface Peer {
  region: string;
}

/** "America/Los_Angeles" reads as "Los Angeles". */
function regionLabel(tz: string): string {
  return (tz.split("/").pop() ?? tz).replace(/_/g, " ");
}

function currentRegion(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";
  } catch {
    return "Unknown";
  }
}

/** Stable across visits, meaningless off this device. */
function visitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, fresh);
    return fresh;
  } catch {
    return crypto.randomUUID();
  }
}

export function Connections() {
  const [regions, setRegions] = useState<[string, number][]>([]);
  const [count, setCount] = useState(0);
  const [joined, setJoined] = useState(false);
  const [active, setActive] = useState<{ d30: number; h24: number } | null>(
    null,
  );

  useEffect(() => {
    const supabase = createClient();

    // Rolling counts. One round trip, records and reads in the same call.
    supabase
      .rpc("sr_record_visit", { p_visitor: visitorId() })
      .then(({ data }) => {
        const row = Array.isArray(data) ? data[0] : data;
        if (row) setActive({ d30: row.active_30d, h24: row.active_24h });
      });

    const channel = supabase.channel(CHANNEL, {
      config: { presence: { key: crypto.randomUUID() } },
    });

    function sync() {
      const peers = Object.values(
        channel.presenceState<Peer>(),
      ).flat() as unknown as Peer[];

      const tally = new Map<string, number>();
      for (const p of peers) {
        const label = regionLabel(p?.region ?? "Unknown");
        tally.set(label, (tally.get(label) ?? 0) + 1);
      }

      setCount(peers.length);
      setRegions(
        [...tally.entries()].sort(
          (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
        ),
      );
    }

    channel
      .on("presence", { event: "sync" }, sync)
      .on("presence", { event: "join" }, sync)
      .on("presence", { event: "leave" }, sync)
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return;
        await channel.track({ region: currentRegion() });
        setJoined(true);
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="conn">
      <div className="conn-head">
        <span className="conn-title">Live Connections</span>
        <span
          className={`ping${joined ? " ping-live" : ""}`}
          aria-hidden="true"
        />
      </div>

      <div className="conn-body">
        <div className="conn-big">{pad(count)}</div>

        <ul className="conn-list">
          {joined && regions.length ? (
            regions.map(([label, n]) => (
              <li className="conn-row" key={label}>
                <span className="conn-place">{label}</span>
                <span className="conn-n">{n > 1 ? `×${n}` : ""}</span>
              </li>
            ))
          ) : (
            <li className="conn-row conn-pending">
              <span className="conn-place">Connecting</span>
            </li>
          )}
        </ul>
      </div>

      <div className="conn-foot">
        <span className="conn-metric">
          <span className="conn-metric-key">24H</span>
          <span className="conn-metric-val">
            {active ? pad(active.h24) : "--"}
          </span>
        </span>
        <span className="conn-metric">
          <span className="conn-metric-key">30D</span>
          <span className="conn-metric-val">
            {active ? pad(active.d30) : "--"}
          </span>
        </span>
      </div>
    </div>
  );
}
