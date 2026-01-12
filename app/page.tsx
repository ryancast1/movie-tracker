import Link from "next/link";

const actions = [
  { label: "Add a Movie", href: "/add", variant: "primary" as const },
  { label: "View Watchlist", href: "/watchlist", variant: "secondary" as const },
  { label: "Watched Movies", href: "/watched", variant: "secondary" as const },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-950 px-5 py-8 text-white">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-center">Movies</h1>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="space-y-3">
            {actions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className={
                  a.variant === "primary"
                    ? "block h-14 w-full rounded-xl bg-white text-black text-lg font-semibold grid place-items-center shadow-lg active:scale-[0.99] transition"
                    : "block h-14 w-full rounded-xl border border-white/10 bg-white/5 text-white text-lg font-semibold grid place-items-center shadow-lg active:scale-[0.99] transition"
                }
              >
                {a.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}