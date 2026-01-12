"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<"email" | "code">("email");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailTrimmed = useMemo(() => email.trim(), [email]);
  const codeTrimmed = useMemo(() => code.replace(/\s/g, ""), [code]);

  async function sendCode() {
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: emailTrimmed,
      options: {
        // Set to true once if you haven't created your user yet.
        shouldCreateUser: false,
      },
    });

    setLoading(false);

    if (error) setMsg(error.message);
    else {
      setPhase("code");
      setMsg("Check your email for the code.");
    }
  }

  async function verifyCode() {
    setLoading(true);
    setMsg(null);

    const { data, error } = await supabase.auth.verifyOtp({
      email: emailTrimmed,
      token: codeTrimmed,
      type: "email",
    });

    setLoading(false);

    if (error) setMsg(error.message);
    else if (data.session) router.replace("/");
    else setMsg("No session returned—request a new code.");
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <p className="mt-2 text-white/70">
          {phase === "email"
            ? "We’ll email you a one-time code."
            : `Code sent to: ${emailTrimmed}`}
        </p>

        {phase === "email" && (
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-white/80">
              Email
            </label>
            <input
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-lg outline-none focus:border-white/35"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              autoCapitalize="none"
              autoCorrect="off"
              inputMode="email"
            />

            <button
              className="w-full rounded-xl bg-white text-black px-4 py-3 text-lg font-semibold disabled:opacity-50"
              onClick={sendCode}
              disabled={!emailTrimmed || loading}
            >
              {loading ? "Sending…" : "Send code"}
            </button>
          </div>
        )}

        {phase === "code" && (
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-white/80">
              Code
            </label>
            <input
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-2xl tracking-widest outline-none focus:border-white/35"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="12345678"
              inputMode="numeric"
              onKeyDown={(e) => {
                if (e.key === "Enter" && codeTrimmed && !loading) verifyCode();
              }}
            />

            <button
              className="w-full rounded-xl bg-white text-black px-4 py-3 text-lg font-semibold disabled:opacity-50"
              onClick={verifyCode}
              disabled={!codeTrimmed || loading}
            >
              {loading ? "Verifying…" : "Verify"}
            </button>

            <div className="flex gap-3">
              <button
                className="flex-1 rounded-xl border border-white/20 px-4 py-3 text-sm text-white/90 disabled:opacity-50"
                onClick={sendCode}
                disabled={loading}
              >
                Resend
              </button>
              <button
                className="flex-1 rounded-xl border border-white/20 px-4 py-3 text-sm text-white/90 disabled:opacity-50"
                onClick={() => {
                  setPhase("email");
                  setCode("");
                  setMsg(null);
                }}
                disabled={loading}
              >
                Change email
              </button>
            </div>
          </div>
        )}

        {msg && <p className="mt-5 text-sm text-white/75">{msg}</p>}
      </div>
    </main>
  );
}
