import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isPublic = pathname.startsWith("/admin/login") || pathname.startsWith("/admin/auth");
  if (isPublic) return <>{children}</>;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen">
      <Sidebar userEmail={user?.email ?? ""} />
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
