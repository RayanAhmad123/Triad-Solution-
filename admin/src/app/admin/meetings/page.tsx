import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { Chip } from "@/components/Chip";
import { NewMeetingButton } from "./NewMeetingButton";
import { MeetingsCalendar } from "./MeetingsCalendar";

export const dynamic = "force-dynamic";

export default async function MeetingsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const sp = await searchParams;
  const view = sp.view === "list" ? "list" : "calendar";
  const supabase = await createClient();
  const { data } = await supabase
    .from("meetings")
    .select("id,name,date:date_time,type,status,agenda,location,participants,notes,action_items")
    .order("date_time", { ascending: true });

  return (
    <>
      <PageHeader
        title="Möten"
        subtitle="Möteslogg, agenda och kalendervy."
        right={
          <div className="flex items-center gap-2">
            <div className="flex rounded-btn border border-white/10 overflow-hidden text-xs">
              <a href="?view=calendar" className={`px-3 py-1.5 ${view === "calendar" ? "bg-white/10" : "hover:bg-white/5"}`}>Kalender</a>
              <a href="?view=list" className={`px-3 py-1.5 ${view === "list" ? "bg-white/10" : "hover:bg-white/5"}`}>Lista</a>
            </div>
            <NewMeetingButton />
          </div>
        }
      />
      {view === "calendar" ? (
        <MeetingsCalendar meetings={data ?? []} />
      ) : (
        <div className="glass rounded-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-left text-[var(--muted)] text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3">Namn</th>
                <th className="p-3">Datum</th>
                <th className="p-3">Typ</th>
                <th className="p-3">Deltagare</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(data ?? []).map((m: any) => (
                <tr key={m.id} className="hover:bg-white/[0.02]">
                  <td className="p-3">
                    <div className="font-medium">{m.name}</div>
                    {m.agenda && <div className="text-xs text-[var(--muted)] mt-0.5 line-clamp-1">{m.agenda}</div>}
                  </td>
                  <td className="p-3 text-[var(--muted)]">{m.date ? new Date(m.date).toLocaleString("sv-SE") : "—"}</td>
                  <td className="p-3">{m.type && <Chip tone={typeTone(m.type)}>{m.type}</Chip>}</td>
                  <td className="p-3 text-[var(--muted)]">{(m.participants ?? []).join(", ") || "—"}</td>
                  <td className="p-3">{m.status && <Chip tone={m.status === "done" ? "green" : m.status === "planned" ? "yellow" : "red"}>{m.status}</Chip>}</td>
                </tr>
              ))}
              {!data?.length && <tr><td colSpan={5} className="p-8 text-center text-sm text-[var(--muted)]">Inga möten.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function typeTone(t: string): any {
  return t === "customer" ? "green" : t === "workshop" ? "purple" : t === "planning" ? "yellow" : t === "follow_up" ? "orange" : "blue";
}
