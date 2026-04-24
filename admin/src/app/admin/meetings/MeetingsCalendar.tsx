"use client";
import { useMemo, useState } from "react";

type Meeting = { id: string; name: string; date: string | null; type: string | null };

export function MeetingsCalendar({ meetings }: { meetings: Meeting[] }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date(); d.setDate(1); return d;
  });

  const weeks = useMemo(() => buildMonth(cursor), [cursor]);
  const byDay = useMemo(() => {
    const map = new Map<string, Meeting[]>();
    meetings.forEach((m) => {
      if (!m.date) return;
      const k = new Date(m.date).toISOString().slice(0, 10);
      (map.get(k) ?? map.set(k, []).get(k))!.push(m);
    });
    return map;
  }, [meetings]);

  const monthName = cursor.toLocaleDateString("sv-SE", { month: "long", year: "numeric" });

  return (
    <div className="glass rounded-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-semibold capitalize">{monthName}</h2>
        <div className="flex gap-1">
          <button onClick={() => shift(-1)} className="px-3 py-1.5 rounded-btn text-sm hover:bg-white/5">‹</button>
          <button onClick={() => setCursor(firstOfMonth(new Date()))} className="px-3 py-1.5 rounded-btn text-sm hover:bg-white/5">Idag</button>
          <button onClick={() => shift(1)} className="px-3 py-1.5 rounded-btn text-sm hover:bg-white/5">›</button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-xs text-[var(--muted)] uppercase tracking-wider mb-1">
        {["Mån","Tis","Ons","Tor","Fre","Lör","Sön"].map((d) => <div key={d} className="px-2 py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((d, i) => {
          const iso = d.toISOString().slice(0, 10);
          const items = byDay.get(iso) ?? [];
          const inMonth = d.getMonth() === cursor.getMonth();
          const today = iso === new Date().toISOString().slice(0, 10);
          return (
            <div key={i} className={`min-h-[92px] rounded-btn border p-2 text-xs ${inMonth ? "border-white/5 bg-black/20" : "border-white/[0.02] bg-black/10 opacity-60"} ${today ? "ring-1 ring-[var(--triad-teal)]" : ""}`}>
              <div className={`font-medium mb-1 ${today ? "text-[var(--triad-teal)]" : ""}`}>{d.getDate()}</div>
              {items.slice(0, 3).map((m) => (
                <div key={m.id} className="truncate rounded px-1.5 py-0.5 mb-0.5 bg-[var(--triad-teal)]/20 text-[var(--triad-teal)]">
                  {m.name}
                </div>
              ))}
              {items.length > 3 && <div className="text-[10px] text-[var(--muted)]">+{items.length - 3} till</div>}
            </div>
          );
        })}
      </div>
    </div>
  );

  function shift(delta: number) {
    const next = new Date(cursor); next.setMonth(next.getMonth() + delta); setCursor(next);
  }
}

function firstOfMonth(d: Date) { const x = new Date(d); x.setDate(1); x.setHours(0,0,0,0); return x; }
function buildMonth(cursor: Date): Date[][] {
  const first = firstOfMonth(cursor);
  const start = new Date(first);
  const offset = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - offset);
  const weeks: Date[][] = [];
  for (let w = 0; w < 6; w++) {
    const row: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start); d.setDate(start.getDate() + w*7 + i); row.push(d);
    }
    weeks.push(row);
  }
  return weeks;
}
