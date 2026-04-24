"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Chip } from "@/components/Chip";
import { TaskFormModal } from "./TaskForm";

export type Task = {
  id: string;
  title: string;
  status: string;
  priority: string | null;
  due_at: string | null;
  description: string | null;
  project?: { id: string; name: string } | null;
  assignee?: { id: string; display_name: string | null } | null;
};

export function TaskCard({ task }: { task: Task }) {
  const supabase = createClient();
  const router = useRouter();
  const [optimistic, setOptimistic] = useState(task.status);
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);

  const done = optimistic === "done";

  async function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    const next = done ? "not_started" : "done";
    setOptimistic(next);
    await supabase
      .from("tasks")
      .update({ status: next, completed_at: next === "done" ? new Date().toISOString() : null })
      .eq("id", task.id);
    startTransition(() => router.refresh());
  }

  const overdue = task.due_at && !done && new Date(task.due_at) < new Date();

  return (
    <>
      <div
        onClick={() => setEditing(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") setEditing(true);
        }}
        className={`group relative cursor-pointer rounded-btn border border-white/5 bg-black/20 p-3 transition-all hover:bg-black/30 hover:border-white/10 ${
          isPending ? "opacity-70" : ""
        }`}
      >
        <div className="flex items-start gap-2.5">
          <button
            onClick={toggle}
            aria-label={done ? "Markera som ej klar" : "Markera som klar"}
            className={`mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[5px] border transition-all touch-manipulation ${
              done
                ? "border-[var(--triad-teal)] bg-[var(--triad-teal)] text-black"
                : "border-white/25 bg-transparent hover:border-[var(--triad-teal)]/60"
            }`}
          >
            {done && (
              <svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M2.5 7.5 L5.5 10.5 L11.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className={`text-sm leading-snug ${done ? "text-white/40 line-through" : "text-white"}`}>
              {task.title}
            </div>
            {task.description && (
              <div className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">{task.description}</div>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {task.priority && (
                <Chip tone={task.priority === "high" ? "red" : task.priority === "medium" ? "yellow" : "gray"}>
                  {priorityLabel(task.priority)}
                </Chip>
              )}
              {task.project?.name && <Chip tone="teal">{task.project.name}</Chip>}
              {task.assignee?.display_name ? (
                <Chip tone="purple">{task.assignee.display_name}</Chip>
              ) : (
                <Chip tone="gray">Hela teamet</Chip>
              )}
              {task.due_at && (
                <span
                  className={`text-[11px] ${
                    overdue ? "font-medium text-rose-300" : "text-[var(--muted)]"
                  }`}
                >
                  {overdue && "⚠ "}
                  {new Date(task.due_at).toLocaleDateString("sv-SE", { day: "numeric", month: "short" })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <TaskFormModal
          mode="edit"
          onClose={() => setEditing(false)}
          initial={{
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority ?? "medium",
            due_at: task.due_at,
            status: task.status,
            assignee_id: task.assignee?.id ?? null,
            project_id: task.project?.id ?? null,
          }}
        />
      )}
    </>
  );
}

function priorityLabel(p: string) {
  return p === "high" ? "Hög" : p === "medium" ? "Medel" : "Låg";
}
