"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Folder, FileText, Trash2 } from "lucide-react";
import { DocumentFilesManager, type DocumentFile } from "./DocumentFilesManager";
import { NewDocButton } from "../NewDocButton";
import { NewCategoryButton } from "../NewCategoryButton";

type Child = {
  id: string;
  title: string;
  icon: string | null;
  kind: "category" | "document" | string;
  updated_at: string | null;
};

type Category = { id: string; title: string; icon: string | null };

export function CategoryView({
  doc,
  items,
  files,
  categories,
}: {
  doc: { id: string; title: string; icon: string | null };
  items: Child[];
  files: DocumentFile[];
  categories: Category[];
}) {
  const supabase = createClient();
  const router = useRouter();
  const [title, setTitle] = useState(doc.title);
  const [icon, setIcon] = useState(doc.icon ?? "📁");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function saveMeta(next: { title?: string; icon?: string }) {
    setStatus("saving");
    const { error } = await supabase
      .from("documents")
      .update({ ...next, updated_at: new Date().toISOString() })
      .eq("id", doc.id);
    if (error) {
      setStatus("idle");
      alert(error.message);
      return;
    }
    setStatus("saved");
    router.refresh();
  }

  async function remove() {
    if (
      !confirm(
        "Ta bort kategorin? Alla underliggande dokument, kategorier och filer tas också bort.",
      )
    )
      return;
    const { error } = await supabase.from("documents").delete().eq("id", doc.id);
    if (error) {
      alert(error.message);
      return;
    }
    router.push("/admin/documents");
  }

  const subCategories = items.filter((c) => c.kind === "category");
  const subDocs = items.filter((c) => c.kind !== "category");

  return (
    <article className="glass rounded-card p-8 space-y-8">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            value={icon}
            onChange={(e) => {
              setIcon(e.target.value);
            }}
            onBlur={() => saveMeta({ icon })}
            maxLength={4}
            className="w-12 text-center text-3xl bg-transparent focus:outline-none"
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => saveMeta({ title: title || "Utan titel" })}
            className="flex-1 bg-transparent text-3xl font-heading font-semibold focus:outline-none"
          />
          <span className="text-xs text-[var(--muted)]">
            {status === "saving" ? "Sparar…" : status === "saved" ? "Sparat" : ""}
          </span>
          <button onClick={remove} className="text-xs text-rose-400 hover:underline flex items-center gap-1">
            <Trash2 size={12} /> Ta bort
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <Folder size={14} />
          Kategori
        </div>
      </header>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Innehåll ({items.length})
          </h3>
          <div className="flex items-center gap-2">
            <NewCategoryButton categories={categories} defaultParentId={doc.id} variant="compact" />
            <NewDocButton categories={categories} defaultParentId={doc.id} variant="compact" />
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-card border border-dashed border-white/10 p-6 text-center text-xs text-[var(--muted)]">
            Tomt. Skapa en underkategori eller ett dokument.
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {[...subCategories, ...subDocs].map((c) => (
              <Link
                key={c.id}
                href={`/admin/documents/${c.id}`}
                className="flex items-center gap-3 rounded-btn bg-black/20 border border-white/5 hover:border-teal-400/30 hover:bg-black/30 p-3 transition-colors"
              >
                <span className="text-xl">
                  {c.icon ?? (c.kind === "category" ? "📁" : "📄")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{c.title}</div>
                  <div className="text-[10px] text-[var(--muted)] flex items-center gap-1">
                    {c.kind === "category" ? <Folder size={10} /> : <FileText size={10} />}
                    {c.kind === "category" ? "Kategori" : "Dokument"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-white/5 pt-6">
        <DocumentFilesManager documentId={doc.id} initial={files} />
      </section>
    </article>
  );
}
