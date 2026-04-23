import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { Chip } from "@/components/Chip";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const supabase = await createClient();
  const [tasks, projects, meetings, customers] = await Promise.all([
    supabase.from("tasks").select("id,title,status,priority,due_at,assignee_id", { count: "exact" }).order("due_at", { ascending: true }).limit(8),
    supabase.from("projects").select("id,name,status,priority", { count: "exact" }).limit(6),
    supabase.from("meetings").select("id,name,date:date_time,type", { count: "exact" }).order("date_time", { ascending: true }).limit(6),
    supabase.from("customers").select("id,name,status", { count: "exact" }).limit(6),
  ]);

  return (
    <>
      <PageHeader
        title="Översikt"
        subtitle="Från idé till SaaS-bolag — Triad Solutions internt nav."
      />
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <StatCard label="Uppgifter" value={tasks.count ?? 0} href="/admin/tasks" />
        <StatCard label="Projekt" value={projects.count ?? 0} href="/admin/projects" />
        <StatCard label="Möten" value={meetings.count ?? 0} href="/admin/meetings" />
        <StatCard label="Kunder" value={customers.count ?? 0} href="/admin/customers" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 glass rounded-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold">Kommande uppgifter</h2>
            <Link href="/admin/tasks" className="text-xs text-[var(--muted)] hover:text-white">
              Alla →
            </Link>
          </div>
          <ul className="divide-y divide-white/5">
            {(tasks.data ?? []).map((t: any) => (
              <li key={t.id} className="py-2.5 flex items-center justify-between text-sm">
                <span>{t.title}</span>
                <div className="flex items-center gap-2">
                  {t.priority && <Chip tone={t.priority === "high" ? "red" : t.priority === "medium" ? "yellow" : "gray"}>{t.priority}</Chip>}
                  <Chip tone={statusTone(t.status)}>{t.status}</Chip>
                </div>
              </li>
            ))}
            {!tasks.data?.length && <li className="py-6 text-sm text-[var(--muted)]">Inga uppgifter än.</li>}
          </ul>
        </section>

        <section className="glass rounded-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold">Kommande möten</h2>
            <Link href="/admin/meetings" className="text-xs text-[var(--muted)] hover:text-white">
              Kalender →
            </Link>
          </div>
          <ul className="space-y-3">
            {(meetings.data ?? []).map((m: any) => (
              <li key={m.id} className="text-sm">
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-[var(--muted)]">
                  {m.date ? new Date(m.date).toLocaleString("sv-SE") : "Ingen tid"} · {m.type ?? "—"}
                </div>
              </li>
            ))}
            {!meetings.data?.length && <div className="text-sm text-[var(--muted)]">Inga möten än.</div>}
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
