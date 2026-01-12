import Link from "next/link";
import type { ReactNode } from "react";

function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-white px-6 text-center text-lg font-semibold text-black shadow-lg shadow-black/30 transition active:scale-[0.99]"
    >
      {children}
    </Link>
  );
}

function SecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-14 w-full items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 text-center text-lg font-semibold text-white shadow-lg shadow-black/30 transition hover:bg-white/10 active:scale-[0.99]"
    >
      {children}
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-black to-zinc-950 px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
        <header className="mb-6">
          <h1 className="text-center text-4xl font-semibold tracking-tight">Movies</h1>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mt-2 space-y-3">
            <PrimaryButton href="/add">Add a Movie</PrimaryButton>
            <SecondaryButton href="/watchlist">View Watchlist</SecondaryButton>
            <SecondaryButton href="/watched">Watched Movies</SecondaryButton>
          </div>
        </section>
      </div>
    </main>
  );
}