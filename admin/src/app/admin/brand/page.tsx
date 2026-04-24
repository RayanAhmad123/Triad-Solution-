import { PageHeader } from "@/components/PageHeader";

export default function BrandPage() {
  return (
    <>
      <PageHeader title="Grafisk Profil" subtitle="Triad Solutions visuella identitet." />
      <section className="glass rounded-card p-6 mb-6">
        <h2 className="font-heading text-xl font-semibold mb-4">Färgpalett</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Swatch name="Triad Teal" hex="#00b4a8" usage="Logotyp, accent, knappar" />
          <Swatch name="Deep Navy" hex="#0a2540" usage="Bakgrunder, mörkt läge" />
          <Swatch name="Antracit" hex="#2b2d2f" usage="Brödtext, mörka ytor" />
          <Swatch name="Pure White" hex="#ffffff" usage="Bakgrunder, text mörk yta" dark />
        </div>
        <div className="mt-4 h-16 rounded-card brand-gradient grid place-items-center text-sm font-medium">
          Brand Gradient · Teal → Navy
        </div>
      </section>

      <section className="glass rounded-card p-6 mb-6">
        <h2 className="font-heading text-xl font-semibold mb-4">Typografi</h2>
        <ul className="space-y-3 text-sm">
          <li><b className="font-heading">Montserrat</b> — rubriker, knappar, labels (SemiBold 600, Thin 100)</li>
          <li><b style={{ fontFamily: "Roboto" }}>Roboto</b> — brödtext, UI-element (Regular 400, Medium 500)</li>
          <li><b className="font-mono">JetBrains Mono</b> — kod, teknisk dokumentation</li>
        </ul>
      </section>

      <section className="glass rounded-card p-6 mb-6">
        <h2 className="font-heading text-xl font-semibold mb-4">Logotyp</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { src: "/admin/logos/Logo_Black_Icon.png", bg: "#ffffff", label: "Svart ikon" },
            { src: "/admin/logos/Logo_Black_with_text.png", bg: "#ffffff", label: "Svart med text" },
            { src: "/admin/logos/Logo_Color_Icon.png", bg: "#f5f5f7", label: "Färg ikon" },
            { src: "/admin/logos/Logo_Color_with_text.png", bg: "#f5f5f7", label: "Färg med text" },
            { src: "/admin/logos/Logo_White_Icon.png", bg: "#0a2540", label: "Vit ikon" },
            { src: "/admin/logos/Logo_White_with_text.png", bg: "#0a2540", label: "Vit med text" },
          ].map((l) => (
            <div key={l.src}>
              <div className="rounded-card aspect-video grid place-items-center" style={{ background: l.bg }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.src} alt={l.label} className="max-h-[80%] max-w-[80%]" />
              </div>
              <div className="text-xs text-[var(--muted)] mt-2">{l.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass rounded-card p-6">
        <h2 className="font-heading text-xl font-semibold mb-4">Spacing & form</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="text-[var(--muted)] uppercase tracking-wider text-xs mb-2">Spacing (8px grid)</h3>
            <ul className="space-y-1"><li>xs — 4px · badges</li><li>sm — 8px · ikoner/text</li><li>md — 16px · kort, sektioner</li><li>lg — 32px · sektioner</li><li>xl — 64px · sidmarginaler</li></ul>
          </div>
          <div>
            <h3 className="text-[var(--muted)] uppercase tracking-wider text-xs mb-2">Hörnradier</h3>
            <ul className="space-y-1"><li>Knappar — 8px</li><li>Kort — 12px</li><li>Modaler — 16px</li><li>Chips — 999px (pill)</li></ul>
          </div>
        </div>
      </section>
    </>
  );
}

function Swatch({ name, hex, usage, dark }: { name: string; hex: string; usage: string; dark?: boolean }) {
  return (
    <div>
      <div className="rounded-card h-20" style={{ background: hex, border: dark ? "1px solid rgba(255,255,255,0.1)" : undefined }} />
      <div className="mt-2 text-sm font-medium">{name}</div>
      <div className="font-mono text-xs text-[var(--muted)]">{hex}</div>
      <div className="text-xs text-[var(--muted)] mt-1">{usage}</div>
    </div>
  );
}
