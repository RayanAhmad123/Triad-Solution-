import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChevronLeft } from "lucide-react";
import { OfferEditor } from "./OfferEditor";

export const dynamic = "force-dynamic";

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [offerRes, customersRes] = await Promise.all([
    supabase
      .from("offers")
      .select("*, customer:customers(id,name,contact_person,email,phone,website,org_number,address)")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("customers").select("id,name,org_number,address").order("name"),
  ]);

  const offer = offerRes.data as any;
  if (!offer) notFound();

  const customers = (customersRes.data ?? []) as Array<{
    id: string;
    name: string;
    org_number: string | null;
    address: string | null;
  }>;

  return (
    <>
      <div className="mb-2">
        <Link
          href="/admin/templates/offerter"
          className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-white"
        >
          <ChevronLeft size={14} /> Tillbaka till Offerter
        </Link>
      </div>

      <OfferEditor offer={offer} customers={customers} />
    </>
  );
}
