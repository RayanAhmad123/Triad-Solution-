// Triad Solutions företagsuppgifter — används som "Leverantör" i SaaS-avtalet
// och som "Personuppgiftsbiträde" i PUB-avtalet, samt i offertens FRÅN-block.
//
// Dessa värden är desamma för varje offert och avtal. Fyll i de fält som är
// markerade med "[SÄTT ...]" en gång här — då fylls de automatiskt in i alla
// genererade dokument.

export const COMPANY = {
  name: "Triad Solutions",
  orgNumber: "[SÄTT ORG.NR i src/lib/company.ts]",
  street: "[SÄTT GATUADRESS i src/lib/company.ts]",
  zip: "[POSTNR]",
  city: "[ORT]",
  email: "info@triadsolutions.se",
  phone: "[SÄTT TELEFON i src/lib/company.ts]",
  // Dataskyddsombud (DPO) — ange namn eller "Ej utsett".
  dpo: "Ej utsett",
} as const;

// "Gatuadress, Postnr Ort" på en rad.
export function companyAddressLine(): string {
  const cityLine = [COMPANY.zip, COMPANY.city].filter(Boolean).join(" ").trim();
  return [COMPANY.street, cityLine].filter(Boolean).join(", ");
}

// Rader för FRÅN-blocket i offerten.
export function companyFromLines(): string[] {
  return [
    `Organisationsnummer: ${COMPANY.orgNumber}`,
    COMPANY.street,
    [COMPANY.zip, COMPANY.city].filter(Boolean).join(" ").trim(),
    COMPANY.email,
    COMPANY.phone,
  ].filter((l) => l && l.trim());
}
