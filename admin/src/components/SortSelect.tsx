"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type SortOption = { value: string; label: string };

export function SortSelect({
  options,
  param = "sort",
  defaultValue,
}: {
  options: SortOption[];
  param?: string;
  defaultValue?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const current = sp.get(param) ?? defaultValue ?? options[0]?.value;

  function change(next: string) {
    const params = new URLSearchParams(sp.toString());
    if (next && next !== defaultValue) params.set(param, next);
    else params.delete(param);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
      <span className="uppercase tracking-wider">Sortera</span>
      <select
        value={current}
        onChange={(e) => change(e.target.value)}
        className="rounded-btn bg-black/30 border border-white/10 px-2 py-2 text-xs text-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
