import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { Chip } from "@/components/Chip";

export const dynamic = "force-dynamic";

type TaskRow = {
  id: string;
  title: string;
  status: string;
  priority: string | null;
  due_at: string | null;
  assignee_id: string | null;
  assignee?: { display_name: string | null } | null;
};

type MeetingRow = { id: string; name: string; date: string | null; type: string | null };

export default async function OverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const nowIso = new Date().toISOString();

  const [tasksOpen, tasksMine, projects, meetings, customers] = await Promise.all([
    supabase
      .from("tasks")
      .select(
        "id,title,status,priority,due_at,assignee_id,assignee:profiles!tasks_assignee_id_fkey(display_name)",
        { count: "exact" },
      )
      .neq("status", "done")
      .order("due_at", { ascending: true, nullsFirst: false })
      .limit(8),
    user
      ? supabase
          .from("tasks")
          .select("id,title,status,priority,due_at,assignee_id", { count: "exact" })
          .eq("assignee_id", user.id)
          .neq("status", "done")
          .order("due_at", { ascending: true, nullsFirst: false })
          .limit(10)
      : Promise.resolve({ data: [], count: 0 } as any),
    supabase.from("projects").select("id,name,status,priority", { count: "exact" }).limit(6),
    supabase
      .from("meetings")
      .select("id,name,date:date_time,type", { count: "exact" })
      .gte("date_time", nowIso)
      .order("date_time", { ascending: true })
      .limit(6),
    supabase.from("customers").select("id,name,status", { count: "exact" }).limit(6),
  ]);

  const openTasks = (tasksOpen.data ?? []) as unknown as TaskRow[];
  const myTasks = (tasksMine.data ?? []) as unknown as TaskRow[];
  const upcomingMeetings = (meetings.data ?? []) as unknown as MeetingRow[];

  return (
    <>
      <PageHeader title="Översikt" subtitle="Från idé till SaaS-bolag — Triad Solutions internt nav." />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
        <StatCard label="Öppna uppgifter" value={tasksOpen.count ?? 0} href="/admin/tasks" />
        <StatCard label="Projekt" value={projects.count ?? 0} href="/admin/projects" />
        <StatCard label="Kommande möten" value={meetings.count ?? 0} href="/admin/meetings" />
        <StatCard label="Kunder" value={customers.count ?? 0} href="/admin/customers" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="glass rounded-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold">Mina uppgifter</h2>
            <Link href="/admin/tasks" className="text-xs text-[var(--muted)] hover:text-white">
              Alla →
            </Link>
          </div>
          <ul className="divide-y divide-white/5">
            {myTasks.map((t) => (
              <li key={t.id} className="py-2.5 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate">{t.title}</span>
                  {t.priority && (
                    <Chip
                      tone={t.priority === "high" ? "red" : t.priority === "medium" ? "yellow" : "gray"}
                    >
                      {t.priority}
                    </Chip>
                  )}
                </div>
                {t.due_at && (
                  <div
                    className={`text-[11px] mt-0.5 ${
                      new Date(t.due_at) < new Date() ? "text-rose-300" : "text-[var(--muted)]"
                    }`}
                  >
                    {new Date(t.due_at) < new Date() && "⚠ "}
                    {new Date(t.due_at).toLocaleDateString("sv-SE", { day: "numeric", month: "short" })}
                  </div>
                )}
              </li>
            ))}
            {!myTasks.length && (
              <li className="py-6 text-sm text-[var(--muted)]">Inga uppgifter tilldelade dig.</li>
            )}
          </ul>
        </section>

        <section className="lg:col-span-2 glass rounded-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold">Teamets kommande uppgifter</h2>
            <Link href="/admin/tasks" className="text-xs text-[var(--muted)] hover:text-white">
              Kanban →
            </Link>
          </div>
          <ul className="divide-y divide-white/5">
            {openTasks.map((t) => (
              <li key={t.id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                <span className="truncate">{t.title}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-[var(--muted)]">
                    {t.assignee?.display_name ?? "Teamet"}
                  </span>
                  {t.priority && (
                    <Chip
                      tone={t.priority === "high" ? "red" : t.priority === "medium" ? "yellow" : "gray"}
                    >
                      {t.priority}
                    </Chip>
                  )}
                  <Chip tone={statusTone(t.status)}>{t.status}</Chip>
                </div>
              </li>
            ))}
            {!openTasks.length && <li className="py-6 text-sm text-[var(--muted)]">Inga öppna uppgifter.</li>}
          </ul>
        </section>

        <section className="lg:col-span-3 glass rounded-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold">Kommande möten</h2>
            <Link href="/admin/meetings" className="text-xs text-[var(--muted)] hover:text-white">
              Kalender →
            </Link>
          </div>
          <ul className="space-y-3">
            {upcomingMeetings.map((m) => (
              <li key={m.id} className="text-sm">
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-[var(--muted)]">
                  {m.date ? new Date(m.date).toLocaleString("sv-SE") : "Ingen tid"} · {m.type ?? "—"}
                </div>
              </li>
            ))}
            {!upcomingMeetings.length && (
              <div className="text-sm text-[var(--muted)]">Inga kommande möten.</div>
            )}
          </ul>
        </section>
      </div>
    </>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="glass rounded-card p-5 hover:bg-white/[0.03] transition-colors block">
      <div className="text-xs uppercase tracking-wider text-[var(--muted)]">{label}</div>
      <div className="font-heading text-3xl mt-1">{value}</div>
    </Link>
  );
}

function statusTone(s: string | null): any {
  if (!s) return "gray";
  if (["done", "completed"].includes(s)) return "green";
  if (["in_progress"].includes(s)) return "teal";
  if (["blocked", "canceled"].includes(s)) return "red";
  return "gray";
}
