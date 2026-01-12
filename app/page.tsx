import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-black to-neutral-900 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-10 pt-10">
        <h1 className="text-center text-4xl font-extrabold tracking-tight">Movies</h1>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/50">
          <Link
            href="/add"
            className="block w-full rounded-2xl bg-white px-4 py-4 text-center text-xl font-extrabold text-black"
          >
            Add a Movie
          </Link>
        </section>
      </div>
    </main>
  );
}