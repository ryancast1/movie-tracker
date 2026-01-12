"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // This will pick up the session from the magic-link redirect (URL)
      await supabase.auth.getSession();
      router.replace("/");
    })();
  }, [router]);

  return <main className="p-6">Signing you in…</main>;
}
