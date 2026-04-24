"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function NewCustomerButton() {
  const supabase = createClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", contact_person: "", industry: "", status: "prospect", email: "", phone: "", website: "", notes: "" });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("customers").insert(f);
    setSaving(false);
    if (error) { alert(error.message); return; }
    setOpen(false);
    setF({ name: "", contact_person: "", industry: "", status: "prospect", email: "", phone: "", website: "", notes: "" });
    router.refresh();
  }

  function bind<K extends keyof typeof f>(k: K) {
    return { value: f[k] as string, onChange: (e: any) => setF((p) => ({ ...p, [k]: e.target.value })) };
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-btn bg-[var(--triad-teal)] text-black px-4 py-2 text-sm font-medium hover:brightness-110">+ Ny kund</button>
      {open && (
        <div className="fixed inset-0 bg-black/60 grid place-items-center z-50 p-4" onClick={() => setOpen(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="w-full max-w-lg glass rounded-modal p-6 space-y-3 max-h-[90vh] overflow-auto">
            <h3 className="font-heading text-lg font-semibold">Ny kund</h3>
            <input autoFocus {...bind("name")} placeholder="Kundnamn" className="w-full rounded-btn bg-black/30 border border-white/10 px-3 py-2" />
            <div className="grid grid-cols-2 gap-3">
              <input {...bind("contact_person")} placeholder="Kontaktperson" className="rounded-btn bg-black/30 border border-white/10 px-3 py-2 text-sm" />
              <input {...bind("industry")} placeholder="Bransch" className="rounded-btn bg-black/30 border border-white/10 px-3 py-2 text-sm" />
              <input {...bind("email")} type="email" placeholder="E-post" className="rounded-btn bg-black/30 border border-white/10 px-3 py-2 text-sm" />
              <input {...bind("phone")} placeholder="Telefon" className="rounded-btn bg-black/30 border border-white/10 px-3 py-2 text-sm" />
              <input {...bind("website")} placeholder="Webbplats" className="rounded-btn bg-black/30 border border-white/10 px-3 py-2 text-sm col-span-2" />
              <select {...bind("status")} className="rounded-btn bg-black/30 border border-white/10 px-3 py-2 text-sm">
                <option value="prospect">Prospekt</option>
                <option value="active">Aktiv</option>
                <option value="inactive">Inaktiv</option>
                <option value="closed">Avslutad</option>
              </select>
            </div>
            <textarea {...bind("notes")} rows={3} placeholder="Anteckningar" className="w-full rounded-btn bg-black/30 border border-white/10 px-3 py-2 text-sm" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-btn px-3 py-2 text-sm text-[var(--muted)]">Avbryt</button>
              <button type="submit" disabled={saving} className="rounded-btn bg-[var(--triad-teal)] text-black px-4 py-2 text-sm font-medium disabled:opacity-50">
                {saving ? "Sparar…" : "Spara"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
