"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CheckSquare, FolderKanban, Calendar, Users, FileText,
  Wallet, Palette, BookTemplate, LogOut, X,
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

export function Sidebar({
  userEmail,
  isOpen = false,
  onClose,
}: {
  userEmail: string;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-white/5 bg-[var(--surface)] backdrop-blur flex flex-col
        transition-transform duration-200
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 lg:h-screen lg:sticky lg:top-0
      `}
    >
      <div className="px-5 py-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg brand-gradient" />
          <div>
            <div className="font-heading font-semibold tracking-tight">Triad</div>
            <div className="text-[11px] uppercase tracking-wider text-[var(--muted)]">Admin</div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-btn hover:bg-white/5 text-[var(--muted)] hover:text-white"
            aria-label="Stäng meny"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <nav className="px-2 py-2 flex-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
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
