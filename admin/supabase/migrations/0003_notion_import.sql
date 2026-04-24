-- Notion → Supabase import
-- Idempotent: deterministic UUIDs + ON CONFLICT clauses.

-- CUSTOMERS ----------------------------------------------------------
insert into public.customers (id, name, contact_person, industry, status, website, kund_id)
values
  ('10000000-0000-0000-0000-000000000001','Indian Express','Rasiq Hossain','Restaurang','prospect','http://www.indianexpress.se/ie2/indianexpress2.html','9'),
  ('10000000-0000-0000-0000-000000000002','Göteborgs Moské','Faraj Semmo','Församling','active',null,'8'),
  ('10000000-0000-0000-0000-000000000003','Foodia Global AB','Aymen Abdulfattah','Grossist','active',null,'6'),
  ('10000000-0000-0000-0000-000000000004','Islamic Relief Sverige','Mohamed Sadek','Välgörenhetsorganisation','prospect',null,'7'),
  ('10000000-0000-0000-0000-000000000005','Friluftsbaba','Vahid','Guide och resor','prospect',null,'10')
on conflict (id) do update set
  name = excluded.name,
  contact_person = excluded.contact_person,
  industry = excluded.industry,
  status = excluded.status,
  website = excluded.website,
  kund_id = excluded.kund_id,
  updated_at = now();

-- PROJECTS -----------------------------------------------------------
insert into public.projects (id, name, status, priority, summary, customer_id)
values
  ('20000000-0000-0000-0000-000000000001','Triad Solutions – Research & Sales','in_progress','high','Intern research, kundlistor, säljarbete och första kundkontakter.',null),
  ('20000000-0000-0000-0000-000000000002','Triad Solutions – Uppstart','in_progress','high','Grundande av bolaget, hemsida, grafisk profil, företagsbeskrivning.',null),
  ('20000000-0000-0000-0000-000000000003','Indian Express – Grafisk profil & hemsida','planning','high','Grafisk profil och ny hemsida för Indian Express restaurang.','10000000-0000-0000-0000-000000000001')
on conflict (id) do update set
  name = excluded.name,
  status = excluded.status,
  priority = excluded.priority,
  summary = excluded.summary,
  customer_id = excluded.customer_id,
  updated_at = now();

-- TASKS --------------------------------------------------------------
insert into public.tasks (id, title, status, priority, due_at, project_id, description)
values
  ('30000000-0000-0000-0000-000000000001','Researcha potentiella generella lösningar att sälja','done','medium','2026-04-05T00:00:00Z','20000000-0000-0000-0000-000000000001','Bokningssystem för frisörer, kassasystem för matbutiker, appar för organisationer, lagersystem, high-tech kamerasystem (samtliga avförda).'),
  ('30000000-0000-0000-0000-000000000002','Skapa ny Hemsida','done','medium',null,'20000000-0000-0000-0000-000000000003',null),
  ('30000000-0000-0000-0000-000000000003','Lära sig om Supabase','in_progress','high',null,'20000000-0000-0000-0000-000000000001',null),
  ('30000000-0000-0000-0000-000000000004','Bygg hemsidan','done','high','2026-04-05T00:00:00Z','20000000-0000-0000-0000-000000000002',null),
  ('30000000-0000-0000-0000-000000000005','Skapa gemensam GitHub','done','medium','2026-04-23T00:00:00Z','20000000-0000-0000-0000-000000000002','Kontakt@triadsolutions.se · samma lösenord.'),
  ('30000000-0000-0000-0000-000000000006','Skriva Företagsbeskrivning','done','high',null,'20000000-0000-0000-0000-000000000002',null),
  ('30000000-0000-0000-0000-000000000007','Skapa Grafisk Profil','done','medium',null,'20000000-0000-0000-0000-000000000003',null),
  ('30000000-0000-0000-0000-000000000008','Skriv ner potentiella kunder och deras problem','done','medium','2026-04-05T00:00:00Z','20000000-0000-0000-0000-000000000001',null),
  ('30000000-0000-0000-0000-000000000009','Skapa grafisk profil','done','low',null,'20000000-0000-0000-0000-000000000002',null),
  ('30000000-0000-0000-0000-00000000000a','Indian Express – grafisk profil & hemsida','not_started','high','2026-04-23T00:00:00Z','20000000-0000-0000-0000-000000000003',null),
  ('30000000-0000-0000-0000-00000000000b','Skapa Sociala Medier','not_started','low',null,'20000000-0000-0000-0000-000000000002',null),
  ('30000000-0000-0000-0000-00000000000c','System för företagsdokument & kvitton','not_started','medium','2026-04-23T00:00:00Z','20000000-0000-0000-0000-000000000001',null),
  ('30000000-0000-0000-0000-00000000000d','Starta process för att starta företag','done','high','2026-04-05T00:00:00Z','20000000-0000-0000-0000-000000000002',null),
  ('30000000-0000-0000-0000-00000000000e','Färdigställ Triad-sidan','in_progress','high','2026-04-23T00:00:00Z','20000000-0000-0000-0000-000000000001',null),
  ('30000000-0000-0000-0000-00000000000f','Boka möte med Foodia Global','done','high','2026-04-23T00:00:00Z','20000000-0000-0000-0000-000000000001',null),
  ('30000000-0000-0000-0000-000000000010','Lära sig om Github','done','high',null,'20000000-0000-0000-0000-000000000001',null),
  ('30000000-0000-0000-0000-000000000011','Lära sig om Claude','done','high',null,'20000000-0000-0000-0000-000000000001',null),
  ('30000000-0000-0000-0000-000000000012','Kontakta Islamic Relief – beslut om projekt','in_progress','high','2026-04-23T00:00:00Z','20000000-0000-0000-0000-000000000001',null)
on conflict (id) do update set
  title = excluded.title,
  status = excluded.status,
  priority = excluded.priority,
  due_at = excluded.due_at,
  project_id = excluded.project_id,
  description = excluded.description,
  updated_at = now();

-- MEETINGS -----------------------------------------------------------
insert into public.meetings (id, name, date_time, type, status, location, agenda, notes, action_items, participants)
values
  (
    '40000000-0000-0000-0000-000000000001',
    'Uppstartsmöte',
    '2026-03-29T12:15:00+02:00',
    'internal',
    'planned',
    'Liba Cafe',
    null,
    null,
    null,
    array['Rayan','Sahil','Firas']
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    'Uppstartsmöte RFS Solutions',
    '2026-03-29T13:00:00+02:00',
    'planning',
    'completed',
    'Liba Cafe',
    'Namnval, hemsida, roller, nästa steg.',
    'Beslutade namnet Triad Solutions (tidigare arbetsnamn RFS). Diskussion kring ny gemensam hemsida och delade ansvarsområden.',
    'Rayan: skissa hemsida. Firas: företagsbeskrivning. Sahil: Github + Notion. Deadline: 2026-04-05.',
    array['Rayan','Sahil','Firas']
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    'Uppföljningsmöte RFS Solutions',
    '2026-04-05T10:00:00+02:00',
    'planning',
    'planned',
    null,
    null,
    null,
    null,
    array['Rayan','Sahil','Firas']
  ),
  (
    '40000000-0000-0000-0000-000000000004',
    'Planeringsmöte 2026-04-09',
    '2026-04-09T10:00:00+02:00',
    'planning',
    'completed',
    'Liba Bröd',
    'Tvåveckorsmål, uppgiftsfördelning, kundaktiviteter.',
    'Planering av nästa 2 veckors mål. Fokus: Indian Express grafisk profil & hemsida, Islamic Relief beslut, Foodia Global möte, intern dokumentation.',
    'Indian Express grafisk & hemsida – deadline 2026-04-23. Kontakta Islamic Relief – deadline 2026-04-23. Boka Foodia – deadline 2026-04-23. System för företagsdokument & kvitton – deadline 2026-04-23.',
    array['Rayan','Sahil','Firas']
  )
on conflict (id) do update set
  name = excluded.name,
  date_time = excluded.date_time,
  type = excluded.type,
  status = excluded.status,
  location = excluded.location,
  agenda = excluded.agenda,
  notes = excluded.notes,
  action_items = excluded.action_items,
  participants = excluded.participants,
  updated_at = now();

-- EXPENSES -----------------------------------------------------------
insert into public.expenses (id, description, amount_sek, paid_by, category, date, status)
values
  ('50000000-0000-0000-0000-000000000001','Domän + Microsoft 365',1018,'rayan','other','2026-04-04','pending')
on conflict (id) do update set
  description = excluded.description,
  amount_sek = excluded.amount_sek,
  paid_by = excluded.paid_by,
  category = excluded.category,
  date = excluded.date,
  status = excluded.status;

-- DOCUMENTS ----------------------------------------------------------
-- Replace Företagsbeskrivning with fuller Notion content.
insert into public.documents (id, title, icon, is_template, content)
values (
  '00000000-0000-0000-0000-000000000001',
  'Företagsbeskrivning',
  '🏢',
  false,
  '<h1>Företagsbeskrivning – Triad Solutions AB</h1>
   <h2>Allmän information</h2>
   <p><b>Företagsnamn:</b> Triad Solutions AB<br><b>Bolagsform:</b> Aktiebolag (AB)<br><b>Säte:</b> Sverige<br><b>Verksamhetsområde:</b> IT- och tekniktjänster</p>
   <h2>Verksamhetsbeskrivning</h2>
   <p>Triad Solutions AB är ett svenskt aktiebolag verksamt inom IT och teknik. Bolaget erbjuder tjänster inom mjukvaruutveckling, systemintegration, teknisk konsultation och digitala lösningar anpassade efter kunders behov. Triad Solutions AB arbetar med att leverera moderna, skalbara och kostnadseffektiva IT-lösningar till företag och organisationer i Sverige och internationellt.</p>
   <p>Bolagets affärsidé bygger på att kombinera teknisk spetskompetens med ett lösningsorienterat arbetssätt, där varje uppdrag hanteras med hög professionalism och fokus på långsiktiga kundrelationer.</p>
   <h2>Ägarstruktur</h2>
   <p>Bolaget ägs till lika delar av tre grundare, vardera med 33,33% av aktierna:</p>
   <ul><li><b>Rayan Ahmad</b> — 33,33%</li><li><b>Firas Mutlaq</b> — 33,33%</li><li><b>Sahil Chowdhury</b> — 33,33%</li></ul>
   <p>Samtliga tre grundare är aktiva i bolagets drift och delar ansvaret för bolagets ledning och strategi.</p>
   <h2>Kontakt</h2>
   <p>För frågor om bolaget, vänligen kontakta någon av grundarna direkt.</p>
   <p><i>Triad Solutions AB — Grundat 2026</i></p>'
) on conflict (id) do update set content = excluded.content, updated_at = now();

-- Färgpalett (child of Grafisk Profil)
insert into public.documents (id, title, icon, is_template, parent_id, content)
values (
  '00000000-0000-0000-0000-000000000020',
  'Färgpalett',
  '🎨',
  false,
  '00000000-0000-0000-0000-000000000002',
  '<h1>Färgpalett</h1>
   <p>Triad Solutions officiella färger. Följ dessa konsekvent i alla kanaler.</p>
   <h2>Primär gradient</h2>
   <ul>
     <li><b>Triad Teal</b> <code>#00b4a8</code> — logotyp, primär accent, knappar, ikoner</li>
     <li><b>Deep Navy</b> <code>#0a2540</code> — bakgrunder, rubriker, mörkt läge</li>
     <li><b>Brand Gradient</b> <code>#00b4a8 → #0a2540</code> — hero, covers, logotypbakgrunder</li>
   </ul>
   <h2>Neutrala färger</h2>
   <ul>
     <li><b>Mörk Antracit</b> <code>#2b2d2f</code> — brödtext, mörka ytor, footers</li>
     <li><b>Pure White</b> <code>#ffffff</code> — bakgrunder, text på mörk yta, logotyp (vit)</li>
   </ul>
   <h2>Regler</h2>
   <ul>
     <li>Gradienten går alltid från Teal → Navy, aldrig omvänd.</li>
     <li>Använd Antracit som textfärg, aldrig ren svart (#000000).</li>
     <li>Max 2–3 färger per layout.</li>
   </ul>'
) on conflict (id) do update set content = excluded.content, parent_id = excluded.parent_id, updated_at = now();

-- Typografi
insert into public.documents (id, title, icon, is_template, parent_id, content)
values (
  '00000000-0000-0000-0000-000000000021',
  'Typografi',
  '✍️',
  false,
  '00000000-0000-0000-0000-000000000002',
  '<h1>Typografi</h1>
   <p>Triad Solutions typsnittsregler för logotyp, UI och dokument.</p>
   <h2>Logotyptypsnitt</h2>
   <ul>
     <li><b>Roboto SemiBold</b> (vikt 600, versaler) — används för "TRIAD"</li>
     <li><b>Montserrat Thin</b> (vikt 100, versaler spatierad) — används för "SOLUTIONS"</li>
   </ul>
   <h2>Övriga typsnitt</h2>
   <ul>
     <li><b>Roboto</b> (Regular/Medium) — brödtext, UI, presentationer</li>
     <li><b>Montserrat</b> (Regular/SemiBold) — rubriker, knappar, etiketter</li>
     <li><b>JetBrains Mono</b> — kodsnuttar, teknisk dokumentation</li>
   </ul>
   <h2>Typografisk skala</h2>
   <ul>
     <li>H1 — Montserrat SemiBold 48–64px</li>
     <li>H2 — Montserrat SemiBold 32–40px</li>
     <li>H3 — Montserrat Medium 24–28px</li>
     <li>Brödtext — Roboto Regular 16px</li>
     <li>Liten text — Roboto Regular 14px</li>
     <li>Etikett — Montserrat Medium 12px uppercase</li>
     <li>Kod — JetBrains Mono Regular 14px</li>
   </ul>'
) on conflict (id) do update set content = excluded.content, parent_id = excluded.parent_id, updated_at = now();

-- Logotyp
insert into public.documents (id, title, icon, is_template, parent_id, content)
values (
  '00000000-0000-0000-0000-000000000022',
  'Logotyp',
  '🖼️',
  false,
  '00000000-0000-0000-0000-000000000002',
  '<h1>Logotyp</h1>
   <p>Sex officiella logotypvarianter. Välj rätt version beroende på bakgrund.</p>
   <h2>Regler</h2>
   <ul>
     <li>Svart logotyp på vit/ljus bakgrund.</li>
     <li>Vit logotyp på mörk/svart bakgrund.</li>
     <li>Färglogotyp på neutral grå bakgrund.</li>
     <li>Ändra aldrig färger, sträck eller förvräng aldrig logotypen.</li>
     <li>Placera aldrig logotypen på röriga bakgrunder.</li>
   </ul>
   <h2>Varianter</h2>
   <ol>
     <li><b>Svart ikon</b> (utan text) — favicons, app-ikoner, stämplar.</li>
     <li><b>Svart logotyp</b> (med text) — dokument, presentationer på ljus bakgrund.</li>
     <li><b>Färg ikon</b> (utan text) — sociala medier, profilbilder.</li>
     <li><b>Färg logotyp</b> (med text) — hero, pitch deck, marknadsföring.</li>
     <li><b>Vit ikon</b> — mörka bakgrunder, t-shirts, merchandise.</li>
     <li><b>Vit logotyp</b> (med text) — dark mode UI, mörka presentationer.</li>
   </ol>
   <h2>Filformat</h2>
   <ul>
     <li>Webb / UI — SVG, WebP</li>
     <li>Dokument / Print — PDF, PNG (300 DPI)</li>
     <li>Favicon — ICO, 32×32px PNG</li>
   </ul>'
) on conflict (id) do update set content = excluded.content, parent_id = excluded.parent_id, updated_at = now();

-- Design & Layout
insert into public.documents (id, title, icon, is_template, parent_id, content)
values (
  '00000000-0000-0000-0000-000000000023',
  'Design & Layout',
  '📐',
  false,
  '00000000-0000-0000-0000-000000000002',
  '<h1>Design & Layout</h1>
   <p>Spacing, hörnradier, skuggor och kommunikationsriktlinjer för Triad Solutions.</p>
   <h2>Spacing-system (8px grid)</h2>
   <ul>
     <li><b>xs</b> 4px — inre padding för badges/chips</li>
     <li><b>sm</b> 8px — avstånd mellan ikoner och text</li>
     <li><b>md</b> 16px — standardpadding i kort och sektioner</li>
     <li><b>lg</b> 32px — avstånd mellan sektioner</li>
     <li><b>xl</b> 64px — sidmarginaler, hero-avstånd</li>
   </ul>
   <h2>Hörnradier</h2>
   <ul><li>Knappar — 8px</li><li>Kort — 12px</li><li>Modaler — 16px</li><li>Chips/Badges — 999px (pill)</li></ul>
   <h2>Skuggor</h2>
   <ul>
     <li>Subtil — <code>0 1px 3px rgba(0,0,0,0.08)</code></li>
     <li>Kort — <code>0 4px 12px rgba(0,0,0,0.10)</code></li>
     <li>Modal — <code>0 16px 40px rgba(0,0,0,0.16)</code></li>
   </ul>
   <h2>Ton & Röst</h2>
   <ul>
     <li>Ton: Professionell men tillgänglig.</li>
     <li>Stil: Klar, direkt, teknisk när det behövs.</li>
     <li>Språk: Svenska internt, engelska externt.</li>
     <li>Undvik: Jargon, hype-ord, passiv meningsbyggnad.</li>
   </ul>
   <blockquote>Rätt: "Vi bygger skalbara lösningar som faktiskt fungerar."</blockquote>
   <blockquote>Fel: "Vi levererar world-class next-generation synergier!"</blockquote>
   <h2>Sociala medier</h2>
   <ul>
     <li>LinkedIn — färg ikon, 400×400px PNG</li>
     <li>GitHub — svart ikon, 400×400px PNG</li>
     <li>Instagram — färg ikon, 400×400px PNG</li>
   </ul>'
) on conflict (id) do update set content = excluded.content, parent_id = excluded.parent_id, updated_at = now();
