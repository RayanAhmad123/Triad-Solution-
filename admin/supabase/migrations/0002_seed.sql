-- Seed: Notion-sourced content ported into admin.
-- Re-runnable via ON CONFLICT guards where possible.

-- DOCUMENTS ----------------------------------------------------------
-- Företagsbeskrivning
insert into public.documents (id, title, icon, is_template, content)
values (
  '00000000-0000-0000-0000-000000000001',
  'Företagsbeskrivning',
  '🏢',
  false,
  '<h1>Triad Solutions</h1>
   <p><b>Triad Solutions</b> är ett svenskt teknik- och konsultbolag grundat av tre ingenjörer: <b>Rayan</b>, <b>Sahil</b> och <b>Firas</b>. Vi bygger digitala lösningar för små och medelstora företag med fokus på enkelhet, kvalitet och skalbarhet.</p>
   <h2>Vision</h2>
   <p>Att göra avancerad teknik tillgänglig för företag som annars inte har resurser att bygga egna lösningar.</p>
   <h2>Mission</h2>
   <p>Leverera snabba, säkra och väldesignade webb- och mobila produkter — med den omsorg en intern produktorganisation skulle haft.</p>
   <h2>Kärnvärden</h2>
   <ul>
     <li><b>Kvalitet först</b> — vi skickar inget vi inte själva skulle använt.</li>
     <li><b>Transparens</b> — ärlig kommunikation kring tid, pris och risk.</li>
     <li><b>Äga resultatet</b> — vi mäter oss mot kundens affär, inte timmar.</li>
   </ul>'
) on conflict (id) do update set content = excluded.content, updated_at = now();

-- Grafisk profil (content mirrored to /admin/brand page, kept as doc for reference)
insert into public.documents (id, title, icon, is_template, content)
values (
  '00000000-0000-0000-0000-000000000002',
  'Grafisk Profil',
  '🎨',
  false,
  '<h1>Grafisk Profil</h1>
   <p>Triad Solutions visuella identitet. För den kompletta, interaktiva versionen se <a href="/admin/brand">Grafisk Profil</a>.</p>
   <h2>Färger</h2>
   <ul>
     <li>Triad Teal <b>#00b4a8</b> — logotyp, accent, knappar</li>
     <li>Deep Navy <b>#0a2540</b> — bakgrunder, mörkt läge</li>
     <li>Antracit <b>#2b2d2f</b> — brödtext, mörka ytor</li>
     <li>Pure White <b>#ffffff</b> — bakgrunder, text mörk yta</li>
   </ul>
   <h2>Typsnitt</h2>
   <ul>
     <li><b>Montserrat</b> — rubriker, knappar, labels</li>
     <li><b>Roboto</b> — brödtext, UI</li>
     <li><b>JetBrains Mono</b> — kod</li>
   </ul>
   <h2>Gradient</h2>
   <p>Teal → Navy. Alltid den riktningen.</p>'
) on conflict (id) do update set content = excluded.content, updated_at = now();

-- TEMPLATES ----------------------------------------------------------
-- Offertmall
insert into public.documents (id, title, icon, is_template, content)
values (
  '00000000-0000-0000-0000-000000000010',
  'Offertmall',
  '📝',
  true,
  '<h1>Offert — [Kundnamn]</h1>
   <p><b>Datum:</b> [ÅÅÅÅ-MM-DD] · <b>Giltig till:</b> [ÅÅÅÅ-MM-DD] · <b>Kontakt:</b> [Namn, Triad Solutions]</p>
   <h2>1. Bakgrund</h2>
   <p>Kort beskrivning av kundens behov, mål och nuvarande situation.</p>
   <h2>2. Lösningsförslag</h2>
   <ul><li>Leverabel 1</li><li>Leverabel 2</li><li>Leverabel 3</li></ul>
   <h2>3. Omfattning & avgränsningar</h2>
   <p>Vad som ingår, vad som inte ingår.</p>
   <h2>4. Tidsplan</h2>
   <ul><li>Fas 1 — Discovery (vecka 1)</li><li>Fas 2 — Utveckling (vecka 2–5)</li><li>Fas 3 — Lansering (vecka 6)</li></ul>
   <h2>5. Pris</h2>
   <p>Fastpris: <b>[X SEK]</b> exkl. moms. Betalningsvillkor: 30 dagar netto, fakturering vid milstolpar (50/50).</p>
   <h2>6. Villkor</h2>
   <p>Standardvillkor enligt bifogat avtal. Offert giltig 30 dagar.</p>'
) on conflict (id) do update set content = excluded.content, updated_at = now();

-- InternMöte Sekreterarmall
insert into public.documents (id, title, icon, is_template, content)
values (
  '00000000-0000-0000-0000-000000000011',
  'Internmöte — Sekreterarmall',
  '📋',
  true,
  '<h1>Internmöte — [Datum]</h1>
   <p><b>Tid:</b> [HH:MM] · <b>Sekreterare:</b> [Namn] · <b>Deltagare:</b> Rayan, Sahil, Firas</p>
   <h2>1. Sedan senast</h2>
   <ul><li>Status på beslut från föregående möte</li></ul>
   <h2>2. Uppdateringar</h2>
   <ul><li><b>Rayan:</b> …</li><li><b>Sahil:</b> …</li><li><b>Firas:</b> …</li></ul>
   <h2>3. Beslut</h2>
   <ul><li>Beslut 1 — ansvarig, deadline</li></ul>
   <h2>4. Action items</h2>
   <ul data-type="taskList"><li data-type="taskItem" data-checked="false">Ägare · Uppgift · Deadline</li></ul>
   <h2>5. Nästa möte</h2>
   <p>[Datum, tid]</p>'
) on conflict (id) do update set content = excluded.content, updated_at = now();

-- Kundmötesmall
insert into public.documents (id, title, icon, is_template, content)
values (
  '00000000-0000-0000-0000-000000000012',
  'Kundmöte — Agenda & protokoll',
  '🤝',
  true,
  '<h1>Kundmöte — [Kund] — [Datum]</h1>
   <p><b>Deltagare (Triad):</b> … · <b>Deltagare (kund):</b> …</p>
   <h2>Agenda</h2>
   <ol><li>Välkomna & syfte</li><li>Genomgång av behov/projekt</li><li>Demo / status</li><li>Frågor & nästa steg</li></ol>
   <h2>Anteckningar</h2>
   <p>…</p>
   <h2>Action items</h2>
   <ul data-type="taskList"><li data-type="taskItem" data-checked="false">Ägare · Uppgift · Deadline</li></ul>'
) on conflict (id) do update set content = excluded.content, updated_at = now();

-- Projektbrief
insert into public.documents (id, title, icon, is_template, content)
values (
  '00000000-0000-0000-0000-000000000013',
  'Projektbrief',
  '📐',
  true,
  '<h1>Projektbrief — [Projektnamn]</h1>
   <h2>Sammanfattning</h2><p>En mening om vad vi bygger och för vem.</p>
   <h2>Mål</h2><ul><li>Affärsmål</li><li>Användarmål</li></ul>
   <h2>Framgångskriterier</h2><ul><li>Mätbart kriterium 1</li></ul>
   <h2>Omfattning</h2><p>In / Ut</p>
   <h2>Tidsplan</h2><p>Milstolpar</p>
   <h2>Risker</h2><ul><li>Risk — mitigering</li></ul>'
) on conflict (id) do update set content = excluded.content, updated_at = now();
