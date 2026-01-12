"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type MovieRow = {
  id: string;
  title: string;
  status: "to_watch" | "watching" | "watched";
  priority: number;
};

export default function Home() {
  const router = useRouter();
  const [rows, setRows] = useState<MovieRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("movie_tracker")
        .select("id,title,status,priority")
        .order("priority", { ascending: true });

      if (error) setError(error.message);
      else setRows(data ?? []);
    })();
  }, [router]);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Movie Tracker</h1>
        <button className="rounded border px-3 py-1" onClick={signOut}>
          Sign out
        </button>
      </div>

      {error && <p className="mt-4 text-red-600">Error: {error}</p>}

      <ul className="mt-4 space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="rounded border p-3">
            <div className="font-semibold">{r.title}</div>
            <div className="text-sm opacity-70">
              status: {r.status} · priority: {r.priority}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
