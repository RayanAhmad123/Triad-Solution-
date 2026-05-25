import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DocumentEditor } from "./DocumentEditor";
import { CategoryView } from "./CategoryView";

export const dynamic = "force-dynamic";

type TreeRow = {
  id: string;
  title: string;
  icon: string | null;
  parent_id: string | null;
  kind: "category" | "document" | string;
};

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [doc, tree, files] = await Promise.all([
    supabase.from("documents").select("*").eq("id", id).single(),
    supabase
      .from("documents")
      .select("id,title,icon,parent_id,kind")
      .order("kind", { ascending: true })
      .order("title", { ascending: true }),
    supabase
      .from("document_files")
      .select("*")
      .eq("document_id", id)
      .order("uploaded_at", { ascending: false }),
  ]);
  if (doc.error || !doc.data) notFound();

  const allRows = (tree.data ?? []) as TreeRow[];
  const categories = allRows
    .filter((r) => r.kind === "category" && r.id !== id)
    .map((r) => ({ id: r.id, title: r.title, icon: r.icon }));
  const items = allRows
    .filter((r) => r.parent_id === id)
    .map((r) => ({
      id: r.id,
      title: r.title,
      icon: r.icon,
      kind: r.kind,
      updated_at: null,
    }));

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="glass rounded-card p-3 max-h-[calc(100vh-3rem)] overflow-auto sticky top-6">
        <Link
          href="/admin/documents"
          className="block text-xs text-[var(--muted)] hover:text-white px-2 py-1 mb-2"
        >
          ← Alla dokument
        </Link>
        <Tree nodes={buildTree(allRows)} activeId={id} />
      </aside>

      {doc.data.kind === "category" ? (
        <CategoryView
          doc={{ id: doc.data.id, title: doc.data.title, icon: doc.data.icon }}
          items={items}
          files={files.data ?? []}
          categories={categories}
        />
      ) : (
        <DocumentEditor doc={doc.data} />
      )}
    </div>
  );
}

type Node = TreeRow & { children: Node[] };

function buildTree(rows: TreeRow[]): Node[] {
  const map = new Map<string, Node>();
  rows.forEach((r) => map.set(r.id, { ...r, children: [] }));
  const roots: Node[] = [];
  rows.forEach((r) => {
    const n = map.get(r.id)!;
    if (r.parent_id && map.has(r.parent_id)) map.get(r.parent_id)!.children.push(n);
    else roots.push(n);
  });
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

function Tree({ nodes, activeId, depth = 0 }: { nodes: Node[]; activeId: string; depth?: number }) {
  return (
    <ul>
      {nodes.map((n) => {
        const isCategory = n.kind === "category";
        const defaultIcon = isCategory ? "📁" : "📄";
        const active = n.id === activeId;
        return (
          <li key={n.id}>
            <Link
              href={`/admin/documents/${n.id}`}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-btn text-sm ${
                active
                  ? "bg-white/10 text-white"
                  : isCategory
                    ? "text-white hover:bg-white/5 font-medium"
                    : "text-[var(--muted)] hover:bg-white/5"
              }`}
              style={{ paddingLeft: depth * 12 + 8 }}
            >
              <span className="w-4 text-center">{n.icon ?? defaultIcon}</span>
              <span className="truncate">{n.title}</span>
            </Link>
            {n.children.length > 0 && <Tree nodes={n.children} activeId={activeId} depth={depth + 1} />}
          </li>
        );
      })}
    </ul>
  );
}
