"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Profile = { id: string; display_name: string | null };

export function NewTaskButton() {
  const supabase = createClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [due, setDue] = useState("");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    supabase
      .from("profiles")
      .select("id,display_name")
      .order("display_name", { ascending: true })
      .then(({ data }) => setProfiles((data ?? []) as Profile[]));
  }, [open, supabase]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("tasks").insert({
      title: title.trim(),
      priority,
      due_at: due || null,
      status: "not_started",
      assignee_id: assigneeId || null,
    });
    setSaving(false);
    if (error) {
      alert(error.message);
      return;
    }
    setOpen(false);
    setTitle("");
    setDue("");
    setAssigneeId("");
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-btn bg-[var(--triad-teal)] text-black px-4 py-2 text-sm font-medium hover:brightness-110"
      >
        + Ny uppgift
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/60 grid place-items-center z-50" onClick={() => setOpen(false)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="w-full max-w-md glass rounded-modal p-6 space-y-4"
          >
            <h3 className="font-heading text-lg font-semibold">Ny uppgift</h3>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Vad ska göras?"
              className="w-full rounded-btn bg-black/30 border border-white/10 px-3 py-2"
            />
            <label className="block text-xs uppercase tracking-wider text-[var(--muted)]">
              Tilldelad
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="mt-1 w-full rounded-btn bg-black/30 border border-white/10 px-3 py-2 text-sm text-white"
              >
                <option value="">Hela teamet</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.display_name ?? "Okänd"}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="rounded-btn bg-black/30 border border-white/10 px-3 py-2 text-sm"
              >
                <option value="low">Låg</option>
                <option value="medium">Medel</option>
                <option value="high">Hög</option>
              </select>
              <input
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className="rounded-btn bg-black/30 border border-white/10 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-btn px-3 py-2 text-sm text-[var(--muted)]"
              >
                Avbryt
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-btn bg-[var(--triad-teal)] text-black px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                {saving ? "Sparar…" : "Spara"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
