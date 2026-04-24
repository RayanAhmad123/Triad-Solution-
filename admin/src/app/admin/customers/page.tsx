import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { Chip } from "@/components/Chip";
import { SortSelect } from "@/components/SortSelect";
import { NewCustomerButton } from "./NewCustomerButton";

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
  searchParams: Promise<{ sort?: string }>;
}) {
  const sp = await searchParams;
  const sort = sp.sort ?? "name";
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
      <div className="glass rounded-card overflow-hidden">
        <table className="w-full text-sm">
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
            {(data ?? []).map((c: any) => (
              <tr key={c.id} className="hover:bg-white/[0.02]">
                <td className="p-3">
                  <div className="font-medium">{c.name}</div>
                  {c.website && (
                    <a href={c.website.startsWith("http") ? c.website : `https://${c.website}`} target="_blank" rel="noreferrer" className="text-xs text-[var(--triad-teal)] hover:underline">
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
            {!data?.length && (
              <tr><td colSpan={5} className="p-8 text-center text-sm text-[var(--muted)]">Inga kunder än.</td></tr>
            )}
          </tbody>
        </table>
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
