import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { Chip } from "@/components/Chip";
import { NewProjectButton } from "./NewProjectButton";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("id,name,status,priority,summary,start_date,end_date,owner:profiles(display_name)")
    .order("status");

  return (
    <>
      <PageHeader title="Projekt" subtitle="Aktiva och planerade projekt med status & ansvarig." right={<NewProjectButton />} />
      <div className="glass rounded-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.03] text-left text-[var(--muted)] text-xs uppercase tracking-wider">
            <tr>
              <th className="p-3">Namn</th>
              <th className="p-3">Status</th>
              <th className="p-3">Prioritet</th>
              <th className="p-3">Ägare</th>
              <th className="p-3">Tidsperiod</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {(data ?? []).map((p: any) => (
              <tr key={p.id} className="hover:bg-white/[0.02]">
                <td className="p-3">
                  <div className="font-medium">{p.name}</div>
                  {p.summary && <div className="text-xs text-[var(--muted)] mt-0.5">{p.summary}</div>}
                </td>
                <td className="p-3"><Chip tone={statusTone(p.status)}>{p.status}</Chip></td>
                <td className="p-3"><Chip tone={p.priority === "high" ? "red" : p.priority === "medium" ? "yellow" : "gray"}>{p.priority ?? "—"}</Chip></td>
                <td className="p-3 text-[var(--muted)]">{p.owner?.display_name ?? "—"}</td>
                <td className="p-3 text-[var(--muted)]">
                  {fmt(p.start_date)} → {fmt(p.end_date)}
                </td>
              </tr>
            ))}
            {!data?.length && (
              <tr><td colSpan={5} className="p-8 text-center text-sm text-[var(--muted)]">Inga projekt än.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function fmt(d: string | null) { return d ? new Date(d).toLocaleDateString("sv-SE") : "—"; }
function statusTone(s: string | null): any {
  if (!s) return "gray";
  if (s === "done") return "green";
  if (s === "in_progress") return "teal";
  if (s === "planning") return "blue";
  if (s === "canceled") return "red";
  if (s === "paused") return "yellow";
  return "gray";
}
