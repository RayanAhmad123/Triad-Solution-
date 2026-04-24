import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { Chip } from "@/components/Chip";
import { SortSelect } from "@/components/SortSelect";
import { NewCustomerButton } from "./NewCustomerButton";
import { ChevronRight, Search } from "lucide-react";

export const dynamic = "force-dynamic";

const SORTS = [
  { value: "name", label: "Namn (A–Ö)" },
  { value: "status", label: "Status" },
  { value: "industry", label: "Bransch" },
  { value: "created_desc", label: "Nyast" },
  { value: "created_asc", label: "Äldst" },
];

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const sort = sp.sort ?? "name";
  const query = sp.q?.toLowerCase() ?? "";
  const supabase = await createClient();
  let q = supabase
    .from("customers")
    .select("id,name,contact_person,industry,status,email,phone,website,notes,created_at");
  if (sort === "status") q = q.order("status").order("name");
  else if (sort === "industry") q = q.order("industry", { nullsFirst: false }).order("name");
  else if (sort === "created_desc") q = q.order("created_at", { ascending: false });
  else if (sort === "created_asc") q = q.order("created_at", { ascending: true });
  else q = q.order("name");
  const { data } = await q;

  const customers = (data ?? []).filter((c: any) => {
    if (!query) return true;
    return (
      c.name?.toLowerCase().includes(query) ||
      c.contact_person?.toLowerCase().includes(query) ||
      c.industry?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <PageHeader
        title="Kunder"
        subtitle="Kundregister med kontaktuppgifter och status."
        right={
          <div className="flex items-center gap-3">
            <SortSelect options={SORTS} defaultValue="name" />
            <NewCustomerButton />
          </div>
        }
      />

      {/* Search */}
      <form method="GET" className="mb-4">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="Sök kunder…"
            className="w-full rounded-xl border border-white/10 bg-black/20 pl-9 pr-4 py-2.5 text-sm placeholder:text-[var(--muted)] focus:outline-none focus:border-teal-400/40 focus:bg-black/30"
          />
          {sp.sort && <input type="hidden" name="sort" value={sp.sort} />}
        </div>
      </form>

      {/* Mobile: card list */}
      <div className="sm:hidden space-y-2">
        {customers.map((c: any) => (
          <div key={c.id} className="glass rounded-xl border border-white/10 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-teal-400/15 text-teal-300 flex items-center justify-center font-bold text-sm shrink-0">
              {c.name?.slice(0, 2).toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm truncate">{c.name}</div>
              <div className="text-xs text-[var(--muted)] truncate">{c.contact_person ?? c.email ?? c.industry ?? "—"}</div>
              <div className="mt-1">
                <Chip tone={statusTone(c.status)}>{statusLabel(c.status)}</Chip>
              </div>
            </div>
            <ChevronRight size={16} className="text-[var(--muted)] shrink-0" />
          </div>
        ))}
        {customers.length === 0 && (
          <div className="glass rounded-xl border border-white/10 p-8 text-center text-sm text-[var(--muted)]">
            {query ? "Inga kunder matchar sökningen." : "Inga kunder än."}
          </div>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block glass rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto scroll-x-hint">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-white/[0.03] text-left text-[var(--muted)] text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3">Kund</th>
                <th className="p-3">Kontaktperson</th>
                <th className="p-3">Bransch</th>
                <th className="p-3">Status</th>
                <th className="p-3">Kontakt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.map((c: any) => (
                <tr key={c.id} className="hover:bg-white/[0.02]">
                  <td className="p-3">
                    <div className="font-medium">{c.name}</div>
                    {c.website && (
                      <a href={c.website.startsWith("http") ? c.website : `https://${c.website}`} target="_blank" rel="noreferrer" className="text-xs text-teal-400 hover:underline">
                        {c.website}
                      </a>
                    )}
                  </td>
                  <td className="p-3 text-[var(--muted)]">{c.contact_person ?? "—"}</td>
                  <td className="p-3 text-[var(--muted)]">{c.industry ?? "—"}</td>
                  <td className="p-3"><Chip tone={statusTone(c.status)}>{statusLabel(c.status)}</Chip></td>
                  <td className="p-3 text-[var(--muted)]">
                    <div className="flex flex-col gap-0.5">
                      {c.email && <a href={`mailto:${c.email}`} className="text-xs hover:text-white">{c.email}</a>}
                      {c.phone && <a href={`tel:${c.phone}`} className="text-xs hover:text-white">{c.phone}</a>}
                      {!c.email && !c.phone && "—"}
                    </div>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-[var(--muted)]">
                    {query ? "Inga kunder matchar sökningen." : "Inga kunder än."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function statusTone(s: string | null): any {
  if (s === "active") return "green";
  if (s === "prospect") return "blue";
  if (s === "inactive") return "gray";
  if (s === "closed") return "red";
  return "gray";
}
function statusLabel(s: string | null) {
  if (s === "active") return "Aktiv";
  if (s === "prospect") return "Prospekt";
  if (s === "inactive") return "Inaktiv";
  if (s === "closed") return "Avslutad";
  return s ?? "—";
}
