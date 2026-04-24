"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function NewDocButton() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function create() {
    setLoading(true);
    const { data, error } = await supabase.from("documents").insert({ title: "Utan titel", content: "" }).select("id").single();
    setLoading(false);
    if (error) { alert(error.message); return; }
    router.push(`/admin/documents/${data!.id}`);
  }

  return (
    <button onClick={create} disabled={loading} className="rounded-btn bg-[var(--triad-teal)] text-black px-4 py-2 text-sm font-medium hover:brightness-110 disabled:opacity-50">
      {loading ? "Skapar…" : "+ Nytt dokument"}
    </button>
  );
}
