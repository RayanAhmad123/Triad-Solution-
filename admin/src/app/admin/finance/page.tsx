import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { Chip } from "@/components/Chip";

export const dynamic = "force-dynamic";

const SEK = (n: number) => new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n);

export default async function FinancePage() {
  const supabase = await createClient();
  const [expenses, income, invoices] = await Promise.all([
    supabase.from("expenses").select("*").order("date", { ascending: false }),
    supabase.from("income").select("*").order("date", { ascending: false }),
    supabase.from("invoices").select("*").order("issued_at", { ascending: false }),
  ]);

  const totalExp = (expenses.data ?? []).reduce((s: number, r: any) => s + Number(r.amount_sek || 0), 0);
  const totalInc = (income.data ?? []).reduce((s: number, r: any) => s + Number(r.amount_sek || 0), 0);
  const net = totalInc - totalExp;

  return (
    <>
      <PageHeader title="Ekonomi" subtitle="Utlägg, intäkter och fakturor." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        <FinanceStat label="Intäkter" value={SEK(totalInc)} color="green" />
        <FinanceStat label="Utlägg" value={SEK(totalExp)} color="red" />
        <FinanceStat label="Netto" value={SEK(net)} color={net >= 0 ? "teal" : "red"} />
      </div>

      <Section title="Utlägg">
        <table className="w-full text-sm min-w-[540px]">
          <thead className="bg-white/[0.03] text-left text-[var(--muted)] text-xs uppercase tracking-wider">
            <tr><th className="p-3">Beskrivning</th><th className="p-3">Kategori</th><th className="p-3">Betald av</th><th className="p-3">Datum</th><th className="p-3">Belopp</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {(expenses.data ?? []).map((r: any) => (
              <tr key={r.id}><td className="p-3">{r.description}</td><td className="p-3 text-[var(--muted)]">{r.category ?? "—"}</td><td className="p-3 text-[var(--muted)]">{r.paid_by ?? "—"}</td><td className="p-3 text-[var(--muted)]">{r.date ? new Date(r.date).toLocaleDateString("sv-SE") : "—"}</td><td className="p-3 font-mono">{SEK(Number(r.amount_sek || 0))}</td><td className="p-3"><Chip tone={r.status === "reimbursed" ? "green" : "red"}>{r.status === "reimbursed" ? "Återbetald" : "Ej återbetald"}</Chip></td></tr>
            ))}
            {!expenses.data?.length && <tr><td colSpan={6} className="p-8 text-center text-sm text-[var(--muted)]">Inga utlägg än.</td></tr>}
          </tbody>
        </table>
      </Section>

      <Section title="Intäkter">
        <table className="w-full text-sm min-w-[540px]">
          <thead className="bg-white/[0.03] text-left text-[var(--muted)] text-xs uppercase tracking-wider">
            <tr><th className="p-3">Beskrivning</th><th className="p-3">Källa</th><th className="p-3">Datum</th><th className="p-3">Belopp</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {(income.data ?? []).map((r: any) => (
              <tr key={r.id}><td className="p-3">{r.description}</td><td className="p-3 text-[var(--muted)]">{r.source ?? "—"}</td><td className="p-3 text-[var(--muted)]">{r.date ? new Date(r.date).toLocaleDateString("sv-SE") : "—"}</td><td className="p-3 font-mono">{SEK(Number(r.amount_sek || 0))}</td><td className="p-3"><Chip tone={r.status === "received" ? "green" : r.status === "pending" ? "yellow" : "red"}>{r.status}</Chip></td></tr>
            ))}
            {!income.data?.length && <tr><td colSpan={5} className="p-8 text-center text-sm text-[var(--muted)]">Inga intäkter än.</td></tr>}
          </tbody>
        </table>
      </Section>

      <Section title="Fakturor">
        <table className="w-full text-sm min-w-[540px]">
          <thead className="bg-white/[0.03] text-left text-[var(--muted)] text-xs uppercase tracking-wider">
            <tr><th className="p-3">Fakturanummer</th><th className="p-3">Kund</th><th className="p-3">Utfärdad</th><th className="p-3">Förfaller</th><th className="p-3">Belopp</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {(invoices.data ?? []).map((r: any) => (
              <tr key={r.id}><td className="p-3 font-mono">{r.number}</td><td className="p-3 text-[var(--muted)]">{r.customer_name ?? "—"}</td><td className="p-3 text-[var(--muted)]">{r.issued_at ? new Date(r.issued_at).toLocaleDateString("sv-SE") : "—"}</td><td className="p-3 text-[var(--muted)]">{r.due_date ? new Date(r.due_date).toLocaleDateString("sv-SE") : "—"}</td><td className="p-3 font-mono">{SEK(Number(r.amount_sek || 0))}</td><td className="p-3"><Chip tone={r.status === "paid" ? "green" : r.status === "overdue" ? "red" : r.status === "sent" ? "blue" : "gray"}>{r.status}</Chip></td></tr>
            ))}
            {!invoices.data?.length && <tr><td colSpan={6} className="p-8 text-center text-sm text-[var(--muted)]">Inga fakturor än.</td></tr>}
          </tbody>
        </table>
      </Section>
    </>
  );
}

const financeColorMap = {
  green: { accentBar: "bg-emerald-400", numColor: "text-emerald-300", iconBg: "bg-emerald-400/10" },
  red: { accentBar: "bg-rose-400", numColor: "text-rose-300", iconBg: "bg-rose-400/10" },
  teal: { accentBar: "bg-teal-400", numColor: "text-teal-300", iconBg: "bg-teal-400/10" },
};

function FinanceStat({ label, value, color }: { label: string; value: string; color: "green" | "red" | "teal" }) {
  const c = financeColorMap[color];
  return (
    <div className="glass rounded-xl border border-white/10 p-5 relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${c.accentBar}`} />
      <div className="pl-2">
        <div className="text-xs uppercase tracking-wider text-[var(--muted)]">{label}</div>
        <div className={`font-heading text-2xl sm:text-3xl font-bold mt-2 ${c.numColor}`}>{value}</div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-xl border border-white/10 overflow-hidden mb-6">
      <header className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
        <h2 className="font-heading font-semibold">{title}</h2>
      </header>
      <div className="overflow-x-auto scroll-x-hint">{children}</div>
    </section>
  );
}
