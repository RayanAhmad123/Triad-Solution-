// Supermind: hybrid modelluppsättning. Opus gör tung planering/resonemang;
// Haiku gör billig, snabb triage av varje meddelande. Modell-ID:n är
// konfigurerbara via env men har vettiga standardvärden.
import type Anthropic from "@anthropic-ai/sdk";

// Tung modell för den agentiska planeringsloopen (verktyg, resonemang).
export const PLANNING_MODEL = process.env.SUPERMIND_PLANNING_MODEL || "claude-opus-4-8";

// Snabb, billig modell för triage och enkla svar.
export const FAST_MODEL = process.env.SUPERMIND_FAST_MODEL || "claude-haiku-4-5";

export type Triage = {
  // Behöver frågan portaldata/verktyg (→ Opus-loopen) eller inte (→ direktsvar)?
  needsPortalData: boolean;
  // Färdigt svar från Haiku för triviala turer (hälsning, tack, metafrågor).
  directReply: string;
  tokens: number;
};

const TRIAGE_SYSTEM = `Du är en snabb router för Triad Solutions interna AI-assistent "Supermind".
Assistenten har verktyg för att läsa portaldata: projekt, uppgifter, kunder, offerter,
ekonomi, möten och teamets kapacitet.

Din enda uppgift: avgör om användarens senaste meddelande KRÄVER portaldata/verktyg för att
besvaras väl.

- Sätt needs_portal_data = true för allt som rör projekt, uppgifter, kunder, offerter,
  ekonomi, möten, planering, prioritering eller "vad ska jag göra". Vid minsta tvekan: true.
- Sätt needs_portal_data = false ENDAST för triviala turer som inte rör datan: hälsningar,
  tack, småprat, eller metafrågor om assistenten själv (t.ex. "vilken modell är du?").
  Skriv då ett kort, vänligt svar på svenska i direct_reply.
- När needs_portal_data = true ska direct_reply vara en tom sträng.`;

const TRIAGE_SCHEMA = {
  type: "object",
  properties: {
    needs_portal_data: {
      type: "boolean",
      description: "True om frågan kräver portaldata/verktyg för ett bra svar.",
    },
    direct_reply: {
      type: "string",
      description: "Kort svar på svenska för triviala turer; tom sträng annars.",
    },
  },
  required: ["needs_portal_data", "direct_reply"],
  additionalProperties: false,
} as const;

/**
 * Klassificerar en inkommande tur med Haiku. Failar säkert: vid fel antar vi
 * att Opus-loopen behövs (needsPortalData = true) så att vi aldrig tappar ett
 * substantiellt svar p.g.a. en triage-miss.
 *
 * OBS: Haiku 4.5 stödjer inte `effort` och behöver ingen `thinking` — vi
 * skickar bara structured outputs (json_schema).
 */
export async function triageMessage(
  client: Anthropic,
  userMessage: string,
): Promise<Triage> {
  try {
    const res = await client.messages.create({
      model: FAST_MODEL,
      max_tokens: 512,
      system: TRIAGE_SYSTEM,
      messages: [{ role: "user", content: userMessage }],
      output_config: {
        format: { type: "json_schema", schema: TRIAGE_SCHEMA as Record<string, unknown> },
      },
    });
    const tokens = (res.usage?.input_tokens ?? 0) + (res.usage?.output_tokens ?? 0);
    const text = res.content.find((b) => b.type === "text");
    const raw = text && "text" in text ? text.text : "{}";
    const parsed = JSON.parse(raw) as { needs_portal_data?: boolean; direct_reply?: string };
    return {
      needsPortalData: parsed.needs_portal_data !== false, // default: behöver data
      directReply: (parsed.direct_reply ?? "").trim(),
      tokens,
    };
  } catch {
    // Säker fallback: kör Opus-loopen.
    return { needsPortalData: true, directReply: "", tokens: 0 };
  }
}
