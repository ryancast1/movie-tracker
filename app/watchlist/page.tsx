"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Row = {
  id: string;
  created_at: string | null;
  category: "movie" | "documentary" | null;
  title: string | null;
  year: number | null;
  length_minutes: number | null;
  priority: number | null;
  source: string | null;
  location: string | null;
  note: string | null;
  status: "to_watch" | "watching" | "watched" | null;
};

function minutesToHMM(mins: number | null) {
  if (mins == null) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${mins}m`;
  return `${h}:${String(m).padStart(2, "0")}`;
}

function catShort(c: Row["category"]) {
  if (c === "documentary") return "D";
  return "M";
}

function priorityLabel(p: Row["priority"]) {
  if (p == null) return "";
  if (p === 0) return "Watching";
  return String(p);
}

export default function WatchlistPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setErr(null);

      const { data, error } = await supabase
        .from("movie_tracker")
        .select(
          "id, created_at, category, title, year, length_minutes, priority, source, location, note, status"
        )
        .eq("status", "to_watch")
        // priority first (nulls last), then newest added
        .order("priority", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false })
        .order("title", { ascending: true });

      if (!alive) return;

      if (error) {
        setErr(error.message);
        setRows([]);
      } else {
        setRows((data as Row[]) || []);
      }

      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const count = useMemo(() => rows.length, [rows]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-950 px-5 py-8 text-white">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-5">
          <h1 className="text-3xl font-semibold tracking-tight text-center">Watchlist</h1>
          <div className="mt-2 flex items-center justify-center text-sm text-white/60">
            <span>{loading ? "Loading…" : `${count} items`}</span>
          </div>
        </header>

        {err && (
          <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {err}
          </div>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          {/* “Column headers” for desktop-ish widths */}
          <div className="hidden md:grid grid-cols-[44px_1fr_90px_110px] items-center gap-3 px-3 py-2 text-xs text-white/50">
            <div>Cat</div>
            <div>Title</div>
            <div className="text-right">Length</div>
            <div className="text-right">Priority</div>
          </div>

          <div className="divide-y divide-white/10">
            {loading ? (
              <div className="p-4 text-sm text-white/60">Loading…</div>
            ) : rows.length === 0 ? (
              <div className="p-4 text-sm text-white/60">No items in To Watch.</div>
            ) : (
              rows.map((r) => {
                const expanded = expandedId === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setExpandedId(expanded ? null : r.id)}
                    className="w-full text-left"
                  >
                    <div className="px-3 py-3">
                      {/* row */}
                      <div className="grid grid-cols-[44px_1fr_96px] md:grid-cols-[44px_1fr_90px_110px] items-start gap-3">
                        {/* Cat */}
                        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/30 text-sm font-semibold">
                          {catShort(r.category)}
                        </div>

                        {/* Title + submeta */}
                        <div className="min-w-0">
                          <div className="flex min-w-0 items-baseline gap-2">
                            <div className="truncate text-base font-semibold text-white">
                              {r.title ?? "(untitled)"}
                            </div>
                            {r.year != null && (
                              <div className="shrink-0 text-sm text-white/50">{r.year}</div>
                            )}
                          </div>

                          {/* phone submeta */}
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/60 md:hidden">
                            {r.length_minutes != null && (
                              <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1">
                                {minutesToHMM(r.length_minutes)}
                              </span>
                            )}
                            {r.location && <span className="truncate">{r.location}</span>}
                          </div>
                        </div>

                        {/* Mobile right column: Priority */}
                        <div className="md:hidden text-right">
                          <div className="text-sm font-semibold text-white/80">
                            {priorityLabel(r.priority)}
                          </div>
                        </div>

                        {/* Desktop columns */}
                        <div className="hidden md:block text-right text-sm text-white/80">
                          {minutesToHMM(r.length_minutes)}
                        </div>
                        <div className="hidden md:block text-right text-sm text-white/70">
                          {priorityLabel(r.priority)}
                        </div>
                      </div>

                      {/* expand area */}
                      {expanded && (
                        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm">
                          <div className="grid gap-2 md:grid-cols-2">
                            <div>
                              <div className="text-xs text-white/50">Source</div>
                              <div className="text-white/80">{r.source || "—"}</div>
                            </div>
                            <div>
                              <div className="text-xs text-white/50">Location</div>
                              <div className="text-white/80">{r.location || "—"}</div>
                            </div>
                            <div className="md:col-span-2">
                              <div className="text-xs text-white/50">Notes</div>
                              <div className="text-white/80 whitespace-pre-wrap">{r.note || "—"}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}