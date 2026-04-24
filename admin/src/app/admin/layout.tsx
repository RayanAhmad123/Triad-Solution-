import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isPublic = pathname.startsWith("/admin/login") || pathname.startsWith("/admin/auth");
  if (isPublic) return <>{children}</>;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <AdminShell userEmail={user?.email ?? ""}>
      {children}
    </AdminShell>
  );
}
