"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TaskCard, type Task } from "./TaskCard";

const COLUMNS: { key: "not_started" | "in_progress" | "done"; label: string; accent: string }[] = [
  { key: "not_started", label: "Att göra", accent: "bg-white/30" },
  { key: "in_progress", label: "Pågår", accent: "bg-amber-400" },
  { key: "done", label: "Klart", accent: "bg-[var(--triad-teal)]" },
];

export function TasksBoard({ initial }: { initial: Task[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  useEffect(() => {
    setTasks(initial);
  }, [initial]);

  async function moveTask(taskId: string, toStatus: string) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === toStatus) return;
    const completed_at = toStatus === "done" ? new Date().toISOString() : null;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: toStatus } : t)),
    );
    const { error } = await supabase
      .from("tasks")
      .update({ status: toStatus, completed_at })
      .eq("id", taskId);
    if (error) {
      alert(error.message);
      setTasks(initial);
      return;
    }
    router.refresh();
  }

  const groups: Record<string, Task[]> = { not_started: [], in_progress: [], done: [] };
  for (const t of tasks) {
    (groups[t.status] ??= []).push(t);
  }

  const total = tasks.length;
  const doneCount = groups.done?.length ?? 0;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <>
      <div className="mb-6 glass rounded-card p-4">
        <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-2">
          <span>
            {doneCount} av {total} uppgifter klara
          </span>
          <span className="font-mono text-white">{pct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--triad-teal)] to-emerald-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = groups[col.key] ?? [];
          const isOver = dragOverCol === col.key;
          return (
            <section
              key={col.key}
              onDragOver={(e) => {
                if (!dragId) return;
                e.preventDefault();
                if (dragOverCol !== col.key) setDragOverCol(col.key);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverCol(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragId) moveTask(dragId, col.key);
                setDragId(null);
                setDragOverCol(null);
              }}
              className={`glass rounded-card p-4 min-h-[300px] transition-colors ${
                isOver ? "ring-1 ring-teal-400/40" : ""
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${col.accent}`} />
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-wider">
                    {col.label}
                  </h2>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-[var(--muted)]">
                    {items.length}
                  </span>
                </div>
              </div>
              <ul className="space-y-2">
                {items.map((t) => (
                  <li
                    key={t.id}
                    draggable
                    onDragStart={(e) => {
                      setDragId(t.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragEnd={() => {
                      setDragId(null);
                      setDragOverCol(null);
                    }}
                    className={`cursor-grab active:cursor-grabbing ${
                      dragId === t.id ? "opacity-40" : ""
                    }`}
                  >
                    <TaskCard task={t} />
                  </li>
                ))}
                {!items.length && (
                  <li className="rounded-btn border border-dashed border-white/5 py-8 text-center text-xs text-[var(--muted)]">
                    {isOver ? "Släpp här" : col.key === "done" ? "Inget avklarat än." : "Inget här."}
                  </li>
                )}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
