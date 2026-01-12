

"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type MovieRow = {
  id: string;
  category: "movie" | "documentary";
  title: string;
  source: string | null;
  length_minutes: number | null;
  status: "to_watch" | "watched";
  date_watched: string | null; // YYYY-MM-DD
  priority: number | null;
  rewatch: boolean;
  location: string | null;
  year: number | null;
  note: string | null;
  created_at: string | null;
};

function minutesToHMM(mins: number | null): string | null {
  if (mins == null) return null;
  if (!Number.isFinite(mins) || mins <= 0) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m}m`;
  return `${h}:${String(m).padStart(2, "0")}`;
}

function ymdToMD(ymd: string | null): string {
  if (!ymd) return "—";
  // ymd is YYYY-MM-DD
  const [y, m, d] = ymd.split("-");
  if (!y || !m || !d) return ymd;
  return `${Number(m)}/${Number(d)}`;
}

function catBadge(c: MovieRow["category"]): string {
  return c === "documentary" ? "D" : "M";
}

export default function WatchedPage() {
  const [rows, setRows] = useState<MovieRow[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setStatus("loading");
        setErrMsg(null);

        const { data, error } = await supabase
          .from("movie_tracker")
          .select(
            "id,category,title,source,length_minutes,status,date_watched,priority,rewatch,location,year,note,created_at"
          )
          .eq("status", "watched")
          // Most recently watched first; if missing watched date, fall back to created_at
          .order("date_watched", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false, nullsFirst: false });

        if (error) throw error;

        if (!alive) return;
        setRows((data ?? []) as MovieRow[]);
        setStatus("ready");
      } catch (e: any) {
        if (!alive) return;
        setStatus("error");
        setErrMsg(e?.message ?? String(e));
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const countText = useMemo(() => {
    const n = rows.length;
    return n === 1 ? "1 item" : `${n} items`;
  }, [rows.length]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-950 px-5 py-8 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-6 text-center">
          <h1 className="text-5xl font-semibold tracking-tight">Watched</h1>
          <div className="mt-2 text-sm text-white/60">{countText}</div>
        </header>

        <section className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_60px_rgba(0,0,0,0.65)]">
          {status === "loading" && (
            <div className="py-10 text-center text-white/60">Loading…</div>
          )}

          {status === "error" && (
            <div className="py-10 text-center text-white/60">
              <div className="text-white/70">Failed to load watched list.</div>
              {errMsg && <div className="mt-2 text-xs text-white/50">{errMsg}</div>}
            </div>
          )}

          {status === "ready" && rows.length === 0 && (
            <div className="py-10 text-center text-white/60">No watched movies yet.</div>
          )}

          {status === "ready" && rows.length > 0 && (
            <div className="divide-y divide-white/10">
              {rows.map((r) => {
                const isOpen = openId === r.id;
                const len = minutesToHMM(r.length_minutes);
                const watched = ymdToMD(r.date_watched);

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setOpenId((prev) => (prev === r.id ? null : r.id))}
                    className="w-full text-left"
                  >
                    <div className="flex gap-4 py-4">
                      {/* Category badge */}
                      <div className="flex w-16 shrink-0 items-start justify-center pt-1">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-2xl font-semibold">
                          {catBadge(r.category)}
                        </div>
                      </div>

                      {/* Main content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-3xl font-semibold tracking-tight">
                              {r.title}
                              {typeof r.year === "number" && r.year > 0 && (
                                <span className="ml-2 text-white/50">({r.year})</span>
                              )}
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/70">
                              {len && (
                                <span className="inline-flex items-center rounded-xl border border-white/10 bg-black/30 px-3 py-1">
                                  {len}
                                </span>
                              )}

                              {r.location && (
                                <span className="truncate text-white/60">{r.location}</span>
                              )}
                            </div>
                          </div>

                          {/* Watched date (right) */}
                          <div className="shrink-0 text-right text-sm text-white/60">
                            <div className="tabular-nums">{watched}</div>
                          </div>
                        </div>

                        {isOpen && (
                          <div className="mt-3 space-y-2 text-sm text-white/60">
                            {r.source && (
                              <div>
                                <span className="text-white/50">Source: </span>
                                <span className="text-white/70">{r.source}</span>
                              </div>
                            )}
                            {r.location && (
                              <div>
                                <span className="text-white/50">Location: </span>
                                <span className="text-white/70">{r.location}</span>
                              </div>
                            )}
                            {r.note && (
                              <div className="whitespace-pre-wrap">
                                <span className="text-white/50">Notes: </span>
                                <span className="text-white/70">{r.note}</span>
                              </div>
                            )}
                            {!r.source && !r.location && !r.note && (
                              <div className="text-white/40">No extra details.</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}