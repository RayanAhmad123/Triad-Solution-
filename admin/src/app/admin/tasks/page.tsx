import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { Chip } from "@/components/Chip";
import { NewTaskButton } from "./NewTaskButton";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id,title,status,priority,due_at,tags,assignee:profiles(id,display_name),project:projects(id,name)")
    .order("status")
    .order("due_at", { ascending: true, nullsFirst: false });

  const groups: Record<string, any[]> = { not_started: [], in_progress: [], done: [], archived: [] };
  (tasks ?? []).forEach((t: any) => { (groups[t.status] ??= []).push(t); });

  return (
    <>
      <PageHeader title="Uppgifter" subtitle="Teamets gemensamma att-göra-lista." right={<NewTaskButton />} />
      <div className="grid gap-4 md:grid-cols-3">
        {(["not_started","in_progress","done"] as const).map((col) => (
          <section key={col} className="glass rounded-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-semibold capitalize">{label(col)}</h2>
              <span className="text-xs text-[var(--muted)]">{groups[col]?.length ?? 0}</span>
            </div>
            <ul className="space-y-2">
              {(groups[col] ?? []).map((t: any) => (
                <li key={t.id} className="rounded-btn bg-black/30 border border-white/5 p-3">
                  <div className="text-sm">{t.title}</div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {t.priority && <Chip tone={t.priority === "high" ? "red" : t.priority === "medium" ? "yellow" : "gray"}>{t.priority}</Chip>}
                    {t.project?.name && <Chip tone="teal">{t.project.name}</Chip>}
                    {t.assignee?.display_name && <Chip tone="purple">{t.assignee.display_name}</Chip>}
                    {t.due_at && <span className="text-[11px] text-[var(--muted)]">{new Date(t.due_at).toLocaleDateString("sv-SE")}</span>}
                  </div>
                </li>
              ))}
              {!(groups[col] ?? []).length && <li className="text-xs text-[var(--muted)] py-4">Inget här.</li>}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

function label(s: string) {
  return s === "not_started" ? "Ej påbörjat" : s === "in_progress" ? "Pågår" : s === "done" ? "Klart" : s;
}
