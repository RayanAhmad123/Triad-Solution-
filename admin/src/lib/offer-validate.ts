// Delad validering för vilka fält som krävs innan en offert kan exporteras med
// tillhörande SaaS-avtal och PUB-avtal. Importeras både i klient (OfferEditor,
// NewOfferButton) och server (PDF-routerna), så denna fil får INTE importera
// pdf-lib eller andra tunga server-beroenden.

export type ContractOfferInput = {
  offer_date?: string | null;
  valid_until?: string | null;
  customer?: {
    name?: string | null;
    org_number?: string | null;
    address?: string | null;
  } | null;
};

// Returnerar en lista med människoläsbara etiketter för de fält som saknas.
// Tom lista = redo att exporteras.
export function missingContractFields(o: ContractOfferInput): string[] {
  const missing: string[] = [];
  const c = o.customer;
  if (!c || !c.name?.trim()) missing.push("Kund");
  if (!c?.org_number?.trim()) missing.push("Kundens organisationsnummer");
  if (!c?.address?.trim()) missing.push("Kundens adress");
  if (!o.offer_date) missing.push("Offertdatum");
  if (!o.valid_until) missing.push("Giltig till");
  return missing;
}

export function isContractReady(o: ContractOfferInput): boolean {
  return missingContractFields(o).length === 0;
}
