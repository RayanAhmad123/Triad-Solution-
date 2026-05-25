import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { NewDocButton } from "./NewDocButton";
import { NewCategoryButton } from "./NewCategoryButton";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  title: string;
  icon: string | null;
  parent_id: string | null;
  kind: "category" | "document" | string;
  updated_at: string | null;
};

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("documents")
    .select("id,title,icon,parent_id,kind,updated_at")
    .order("kind", { ascending: true }) // 'category' before 'document'
    .order("title", { ascending: true });

  const rows = (data ?? []) as Row[];
  const tree = buildTree(rows);
  const categories = rows
    .filter((r) => r.kind === "category")
    .map((r) => ({ id: r.id, title: r.title, icon: r.icon }));

  return (
    <>
      <PageHeader
        title="Dokument"
        subtitle="Avtal, mallar, teknisk dokumentation."
        right={
          <div className="flex items-center gap-2">
            <NewCategoryButton categories={categories} />
            <NewDocButton categories={categories} />
          </div>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="glass rounded-card p-3">
          <TreeView nodes={tree} />
          {!tree.length && (
            <div className="p-4 text-sm text-[var(--muted)]">
              Inga dokument än. Skapa en kategori för att börja.
            </div>
          )}
        </aside>
        <div className="glass rounded-card p-6 min-h-[400px] grid place-items-center text-[var(--muted)] text-sm">
          Välj ett dokument eller en kategori till vänster.
        </div>
      </div>
    </>
  );
}

type Node = Row & { children: Node[] };

function buildTree(rows: Row[]): Node[] {
  const map = new Map<string, Node>();
  rows.forEach((r) => map.set(r.id, { ...r, children: [] }));
  const roots: Node[] = [];
  rows.forEach((r) => {
    const n = map.get(r.id)!;
    if (r.parent_id && map.has(r.parent_id)) map.get(r.parent_id)!.children.push(n);
    else roots.push(n);
  });
  // categories first within each level
  const sortNodes = (nodes: Node[]) => {
    nodes.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "category" ? -1 : 1;
      return a.title.localeCompare(b.title, "sv");
    });
    nodes.forEach((n) => sortNodes(n.children));
  };
  sortNodes(roots);
  return roots;
}

function TreeView({ nodes, depth = 0 }: { nodes: Node[]; depth?: number }) {
  return (
    <ul>
      {nodes.map((n) => {
        const isCategory = n.kind === "category";
        const defaultIcon = isCategory ? "📁" : "📄";
        return (
          <li key={n.id}>
            <Link
              href={`/admin/documents/${n.id}`}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-btn hover:bg-white/5 text-sm ${
                isCategory ? "font-medium text-white" : "text-[var(--muted)]"
              }`}
              style={{ paddingLeft: depth * 12 + 8 }}
            >
              <span className="w-4 text-center">{n.icon ?? defaultIcon}</span>
              <span className="truncate">{n.title}</span>
            </Link>
            {n.children.length > 0 && <TreeView nodes={n.children} depth={depth + 1} />}
          </li>
        );
      })}
    </ul>
  );
}
