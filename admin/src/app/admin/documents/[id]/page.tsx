import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DocumentEditor } from "./DocumentEditor";

export const dynamic = "force-dynamic";

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [doc, tree] = await Promise.all([
    supabase.from("documents").select("*").eq("id", id).single(),
    supabase.from("documents").select("id,title,icon,parent_id").order("title"),
  ]);
  if (doc.error || !doc.data) notFound();

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="glass rounded-card p-3 max-h-[calc(100vh-3rem)] overflow-auto sticky top-6">
        <Link href="/admin/documents" className="block text-xs text-[var(--muted)] hover:text-white px-2 py-1 mb-2">← Alla dokument</Link>
        <TreeList items={tree.data ?? []} activeId={id} />
      </aside>
      <DocumentEditor doc={doc.data} />
    </div>
  );
}

function TreeList({ items, activeId }: { items: any[]; activeId: string }) {
  return (
    <ul>
      {items.map((d) => (
        <li key={d.id}>
          <Link href={`/admin/documents/${d.id}`} className={`flex items-center gap-2 px-2 py-1.5 rounded-btn text-sm ${d.id === activeId ? "bg-white/10 text-white" : "hover:bg-white/5 text-[var(--muted)]"}`}>
            <span className="w-4 text-center">{d.icon ?? "📄"}</span>
            <span className="truncate">{d.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
