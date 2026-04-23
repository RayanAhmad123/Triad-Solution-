import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { NewDocButton } from "./NewDocButton";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("documents")
    .select("id,title,icon,parent_id,updated_at")
    .order("title");

  const tree = buildTree(data ?? []);

  return (
    <>
      <PageHeader title="Dokument" subtitle="Avtal, mallar, teknisk dokumentation." right={<NewDocButton />} />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="glass rounded-card p-3">
          <TreeView nodes={tree} />
          {!tree.length && <div className="p-4 text-sm text-[var(--muted)]">Inga dokument än.</div>}
        </aside>
        <div className="glass rounded-card p-6 min-h-[400px] grid place-items-center text-[var(--muted)] text-sm">
          Välj ett dokument till vänster.
        </div>
      </div>
    </>
  );
}

type Node = { id: string; title: string; icon: string | null; children: Node[] };
function buildTree(rows: any[]): Node[] {
  const map = new Map<string, Node>();
  rows.forEach((r) => map.set(r.id, { id: r.id, title: r.title, icon: r.icon, children: [] }));
  const roots: Node[] = [];
  rows.forEach((r) => {
    const n = map.get(r.id)!;
    if (r.parent_id && map.has(r.parent_id)) map.get(r.parent_id)!.children.push(n);
    else roots.push(n);
  });
  return roots;
}
function TreeView({ nodes, depth = 0 }: { nodes: Node[]; depth?: number }) {
  return (
    <ul>
      {nodes.map((n) => (
        <li key={n.id}>
          <Link href={`/admin/documents/${n.id}`} className="flex items-center gap-2 px-2 py-1.5 rounded-btn hover:bg-white/5 text-sm" style={{ paddingLeft: depth * 12 + 8 }}>
            <span className="w-4 text-center">{n.icon ?? "📄"}</span>
            <span className="truncate">{n.title}</span>
          </Link>
          {n.children.length > 0 && <TreeView nodes={n.children} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}
