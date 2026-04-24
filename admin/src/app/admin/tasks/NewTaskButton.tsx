"use client";
import { useState } from "react";
import { TaskFormModal } from "./TaskForm";

export function NewTaskButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-btn bg-[var(--triad-teal)] text-black px-4 py-2 text-sm font-medium hover:brightness-110"
      >
        + Ny uppgift
      </button>
      {open && <TaskFormModal mode="create" onClose={() => setOpen(false)} />}
    </>
  );
}
