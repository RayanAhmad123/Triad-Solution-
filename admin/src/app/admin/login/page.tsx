"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    router.replace(next);
    router.refresh();
  }

  async function handleMagicLink() {
    if (!email) { setMsg("Ange e-post först."); return; }
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/admin/auth/callback?next=${encodeURIComponent(next)}` },
    });
    setLoading(false);
    setMsg(error ? error.message : "Mejl skickat — öppna länken för att logga in.");
  }

  return (
    <main className="min-h-screen grid place-items-center px-6 brand-gradient">
      <div className="w-full max-w-md glass rounded-modal p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-9 w-9 rounded-lg brand-gradient" />
          <h1 className="font-heading text-2xl font-semibold">Triad Admin</h1>
        </div>
        <p className="text-sm text-[var(--muted)] mb-6">
          Endast inbjudna medlemmar. Logga in med din e-post.
        </p>
        <form onSubmit={handleSignIn} className="space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-[var(--muted)]">E-post</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-btn bg-black/30 border border-white/10 px-3 py-2 ring-focus"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-[var(--muted)]">Lösenord</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-btn bg-black/30 border border-white/10 px-3 py-2 ring-focus"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-btn bg-[var(--triad-teal)] text-black font-medium py-2.5 hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Loggar in…" : "Logga in"}
          </button>
          <button
            type="button"
            onClick={handleMagicLink}
            disabled={loading}
            className="w-full rounded-btn border border-white/10 py-2.5 text-sm hover:bg-white/5"
          >
            Skicka magisk länk i stället
          </button>
        </form>
        {msg && <p className="mt-4 text-sm text-[var(--muted)]">{msg}</p>}
      </div>
    </main>
  );
}
