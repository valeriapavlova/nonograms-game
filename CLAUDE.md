# Familiar — project rules

Calm PWA for people who share the care of a pet: daily tasks, medication with photo proof, and a structured handoff to a temporary sitter.
Owner: Valeria (designer, first app — explain steps in simple words).

## Stack
Next.js + TypeScript · Supabase (auth, Postgres, realtime, storage) · Vercel · PWA first.

## Product rules
- Navigation: Today · Pets · Done · Calendar · Handoff. Settings in the header.
- Sitter view: mobile web, no account, link + code, access only for the stay.
- Medication times default 08:00 and 20:00.
- Done task shows tick + time + name: "✓ 08:10 · Sergi".
- Emergency order: 1 · Call the vet · 2 · Tell the owner.
- No chat, no feed.

## Design rules
- Fonts: Bricolage Grotesque ExtraBold (display), Urbanist (UI).
- Colors: paper #FAF6EE · ink #17150F · stone #6D685D · hairline #D9D1C2 · sage #BCD9C4 (done/selected only) · lavender #C3C4E4 (medication) · peach #EDB39C (needs attention) · terracotta #D96F4C (SOS) · red #BF2700 (danger) · butter #F4D163.
- Color = meaning, shape = importance. Never color alone: add a word or icon.
- Spacing: 24 between sections · 12 label → content · 8 between cards.
- Card style: filled no stroke = info · stroke = tappable · dashed = add new.
- Text ≥ 12 px, touch targets ≥ 44 px, WCAG AA contrast.
- CSS: avoid !important.

## Working rules
- One small task at a time; explain what changed and how to test it.
- Commit after each working step.
- Ask before adding new libraries or paid services.
