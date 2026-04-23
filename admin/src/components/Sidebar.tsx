"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CheckSquare, FolderKanban, Calendar, Users, FileText,
  Wallet, Palette, BookTemplate, LogOut,
} from "lucide-react";

const nav = [
  { href: "/admin", label: "Översikt", icon: LayoutDashboard, exact: true },
  { href: "/admin/tasks", label: "Uppgifter", icon: CheckSquare },
  { href: "/admin/projects", label: "Projekt", icon: FolderKanban },
  { href: "/admin/meetings", label: "Möten", icon: Calendar },
  { href: "/admin/customers", label: "Kunder", icon: Users },
  { href: "/admin/documents", label: "Dokument", icon: FileText },
  { href: "/admin/finance", label: "Ekonomi", icon: Wallet },
  { href: "/admin/brand", label: "Grafisk Profil", icon: Palette },
  { href: "/admin/templates", label: "Mallar", icon: BookTemplate },
];

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 border-r border-white/5 bg-[var(--surface)]/60 backdrop-blur flex flex-col">
      <div className="px-5 py-5 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg brand-gradient" />
        <div>
          <div className="font-heading font-semibold tracking-tight">Triad</div>
          <div className="text-[11px] uppercase tracking-wider text-[var(--muted)]">Admin</div>
        </div>
      </div>
      <nav className="px-2 py-2 flex-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-btn text-sm mb-0.5 transition-colors ${
                active ? "bg-white/8 text-white" : "text-[var(--muted)] hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <form action="/admin/auth/signout" method="post" className="border-t border-white/5 p-3">
        <div className="text-xs text-[var(--muted)] px-2 py-1 truncate">{userEmail}</div>
        <button
          type="submit"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-btn text-sm text-[var(--muted)] hover:text-white hover:bg-white/5"
        >
          <LogOut size={16} />
          Logga ut
        </button>
      </form>
    </aside>
  );
}
