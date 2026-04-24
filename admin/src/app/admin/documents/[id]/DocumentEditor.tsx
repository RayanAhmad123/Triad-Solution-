"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DocumentEditor({ doc }: { doc: any }) {
  const supabase = createClient();
  const router = useRouter();
  const [title, setTitle] = useState(doc.title ?? "Utan titel");
  const [icon, setIcon] = useState<string>(doc.icon ?? "📄");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder: "Skriv något…" }),
      Link.configure({ openOnClick: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: doc.content || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none min-h-[400px] focus:outline-none",
      },
    },
    onUpdate: () => scheduleSave(),
  });

  useEffect(() => { return () => { if (timer.current) clearTimeout(timer.current); }; }, []);

  function scheduleSave() {
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(save, 800);
  }

  async function save() {
    const content = editor?.getHTML() ?? "";
    const { error } = await supabase.from("documents").update({ title, icon, content, updated_at: new Date().toISOString() }).eq("id", doc.id);
    if (!error) { setStatus("saved"); router.refresh(); }
    else setStatus("idle");
  }

  async function remove() {
    if (!confirm("Ta bort dokumentet?")) return;
    await supabase.from("documents").delete().eq("id", doc.id);
    router.push("/admin/documents");
  }

  return (
    <article className="glass rounded-card p-8">
      <div className="flex items-center gap-3 mb-4">
        <input
          value={icon}
          onChange={(e) => { setIcon(e.target.value); scheduleSave(); }}
          maxLength={4}
          className="w-12 text-center text-3xl bg-transparent focus:outline-none"
        />
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); scheduleSave(); }}
          placeholder="Utan titel"
          className="flex-1 bg-transparent text-3xl font-heading font-semibold focus:outline-none"
        />
        <span className="text-xs text-[var(--muted)]">{status === "saving" ? "Sparar…" : status === "saved" ? "Sparat" : ""}</span>
        <button onClick={remove} className="text-xs text-rose-400 hover:underline">Ta bort</button>
      </div>
      {editor && (
        <div className="flex flex-wrap gap-1 mb-4 border-b border-white/5 pb-2">
          <Tb onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>B</Tb>
          <Tb onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><em>I</em></Tb>
          <Tb onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>H1</Tb>
          <Tb onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>H2</Tb>
          <Tb onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>H3</Tb>
          <Tb onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>•</Tb>
          <Tb onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>1.</Tb>
          <Tb onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")}>☐</Tb>
          <Tb onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>❝</Tb>
          <Tb onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}>{"</>"}</Tb>
          <Tb onClick={() => editor.chain().focus().setHorizontalRule().run()}>—</Tb>
        </div>
      )}
      <EditorContent editor={editor} />
    </article>
  );
}

function Tb({ children, onClick, active }: { children: React.ReactNode; onClick: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} className={`px-2.5 py-1 rounded text-sm ${active ? "bg-white/15" : "hover:bg-white/5"}`}>{children}</button>
  );
}
