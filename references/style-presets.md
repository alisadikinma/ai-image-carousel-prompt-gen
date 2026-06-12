# Style Presets — Visual Execution Layer

> **What this file is.** A *style preset* swaps the **visual execution layer** of a
> carousel without touching the brain of the skill. The base workflow — hook science,
> 5-act narrative spine, fact verification, bilingual headlines, multi-platform captions,
> WOW-style quality gating — stays exactly the same. Only HOW each slide is *rendered*
> changes: cinematic photo vs. hand-drawn doodle, etc.
>
> Activated via the `--style=<preset>` flag (see SKILL.md Flags table). Works in BOTH
> interactive and pipeline mode. When a non-`cinematic` preset is active, the override
> tables below **SUPERSEDE** the photo-centric Hard Rules + WOW gate in SKILL.md.

---

## Preset Registry

| `--style` | Default? | Aesthetic | Use for |
|-----------|----------|-----------|---------|
| `cinematic` | ✅ YES | Hyperrealistic photo carousel — Kodak Portra, dramatic lighting, creator face, dark gradient text zone | Authority / personal-brand / "stop the scroll" emotional content (the skill's original behavior — nothing changes) |
| `sketchnote` | no | **Blue-brand hybrid:** photographic creator Spotlight Portrait on the **hook (cover) + CTA**, hand-drawn doodle infographic on **all body/peak slides** — every slide on a solid blue `#0F59B6` brand base | Educational explainers / "how it works" carousels that still need a personal-brand face on the scroll-stop and the call-to-action (the house style) |

> Default resolution: if `--style` is absent → `cinematic`. Everything below the
> `cinematic` row documents *non-default* presets. `cinematic` simply = "obey SKILL.md
> + global-config.md as written."

---

## Preset: `sketchnote`

The house style. A **hybrid**: the educational doodle infographic the brand is known for,
but on the brand's **solid blue `#0F59B6` base** instead of cream paper, and with a
**real photographic creator** anchoring the hook and the CTA so the scroll-stop and the
call-to-action carry a face. The middle (body/peak) slides stay pure hand-drawn doodle —
that is the part readers love — just recolored for the blue base (light "chalk/marker"
ink instead of dark ink).

### 0. Slide-Role Routing (READ FIRST — decides which execution each slide uses)

Every slide sits on the **same solid blue `#0F59B6` base** with the same brand chrome
(top-left page mark, `@alisadikinma` footer, `SWIPE (GESER) →` on non-CTA slides). What
differs is the *content treatment*, by `layout_hint`:

| Slide role (`layout_hint`) | Execution |
|---|---|
| `cover` (hook, slide 1) + `cta` (last slide) + any `human_fingerprint` | **PHOTOGRAPHIC Spotlight Portrait** — apply the **Spotlight Portrait Template** from `hook-visual-library.md` verbatim: a real, calm, credible **creator face + upper body from the provided face reference** (`{{CREATOR_FACE}}` token IS emitted on these slides), signature outfit, **≥3 floating topic UI elements** (glassy tool cards / logos / screenshots) around the upper body, bold bilingual headline with 2–4 gold accent words in the bottom gradient zone. NOT a doodle. NO hand-drawn human. |
| `body`, `peak`, `direct_answer`, everything else | **HAND-DRAWN DOODLE** (the §1–§11 rules below) on the blue base — flat marker illustration, light ink, no photographic human. |

> Why hybrid: the doodle body slides are the brand's teaching superpower (keep them); the
> hook and CTA need a human face to stop the scroll and drive the action, so those two
> roles use the photographic Spotlight Portrait. Both halves share the blue base so the
> carousel reads as one coherent set.

---

The rules below (§1–§11) govern the **DOODLE slides** (body / peak / middle). For the
photographic cover + CTA, follow `hook-visual-library.md` "Spotlight Portrait Template"
on the same `#0F59B6` base.

Hand-drawn educational infographic. Looks like a talented designer sketched it with
light markers / chalk on a **solid blue notebook surface**. Flat, confident, high-signal.
**No photography, no realism, no cinematic lighting on doodle slides.**

### 1. Visual Defaults Override (supersedes global-config.md §4)

| Setting | `cinematic` (default) | `sketchnote` doodle slides |
|---------|----------------------|------------------------|
| `image_style` | hyperrealistic | **flat 2D hand-drawn sketchnote illustration** |
| Background | scene environment | **blue brand gradient base (navy `#0A3D82` edges → brighter `#1E6FD0` center, NOT flat solid), subtle paper-fiber/grain texture, optional faint grid** |
| `film_stock` | Kodak Portra 400 | **none** — it is not a photograph |
| `color_temp` / `color_grade` | 3200-3500K warm amber | **none** — flat illustration has no film grade |
| Lighting | Rembrandt 4:1, Kelvin ratios | **flat even "page" light** — no photographic lighting |
| Texture (anti-AI) | skin pores, fabric weave | **marker-ink edges, paper/grid grain, slight line wobble** |
| Creator face | photo on hook/CTA/foreshadow | **doodle slides: none. Cover + CTA: photographic per §0 routing** |
| Text zone | dark gradient bottom half | **none on doodle slides** — light hand-lettering sits directly on the blue base |
| `image_resolution` | 4K | 4K (unchanged) |
| Aspect ratio | platform-specific | platform-specific (unchanged) |

### 2. Doodle Palette (supersedes global-config.md §3 execution)

Light "chalk/marker on blue" — the inverse of the old cream sketchnote. High legibility on
the blue base is the priority.

| Role | Value | Use |
|------|-------|-----|
| Base | `#0F59B6` solid brand blue | every slide background |
| Ink | `#F8F6F0` warm off-white | body lettering, icon outlines, hand-drawn lines |
| Accent A (brand) | `#F5A623` golden (global-config `accent_color`) | headline emphasis, underlines, the key payoff word |
| Accent B (support) | `#6FE0B0` light mint | secondary emphasis, "good/positive" elements, dividers (legible on blue; replaces the old forest-green, which dies on blue) |

> Discipline: **blue base + off-white ink + at most 2 accents (gold + mint)**, identical
> across all slides. Never use dark/near-black ink on the blue base — it disappears.

### 3. Lettering & Text

- **Hand-lettered marker** style: bold weight for headlines, regular for body. Slight
  organic wobble — NOT a clean vector font. Off-white ink on blue.
- **Emphasis marks** carry meaning: underline key words, circle the payoff, draw arrows
  to connect ideas, highlight one phrase per slide in gold.
- **Bilingual rule unchanged** — Bahasa Indonesia headline (main) + English subtitle per
  global-config.md §2. Subtitle in Accent A or mint, smaller, beneath the headline.
- **In-image text rule (SKILL.md Hard Rule #5) KEPT** — all headlines, labels, captions
  rendered inside the image. Nano Banana Pro's legible-text strength is the whole reason
  this style works; lean into it.

### 4. Iconography

- Flat **doodle icons only**: rounded-square app tiles, hand-drawn arrows, checkmarks,
  emphasis circles, simple node/tree diagrams, speech bubbles, podiums, trophies — drawn
  in off-white line on blue.
- **Logos/products → simplified hand-drawn versions**, NOT uploaded photo references.
  This is a deliberate exception to the Subject Reference Image System on DOODLE slides
  (which exists to keep photographic logos accurate). On the photographic cover/CTA, real
  floating tool logos/cards ARE allowed per the Spotlight Portrait spec. On doodle slides,
  describe the logo in words ("a green spiral app icon") and let the model draw it.

### 5. Branding Chrome (keeps SKILL.md Hard Rule #2/#11 intent, doodle execution)

- Brand handle `@alisadikinma` + logo STILL appear, but **hand-drawn / hand-lettered**
  on doodle slides (a small bottom-corner hand-lettered handle reads better on a
  sketchnote). The photographic cover/CTA use the standard Spotlight Portrait chrome.
- **Brand icon = a bald head with rectangular glasses and NO hair.** Even hand-drawn,
  the doodle brand mark must stay bald + glasses to match the real brand icon — never
  doodle a generic face with hair.
- Page number `[N]/[TOTAL]` top-left — KEPT.
- `SWIPE (GESER) →` — KEPT (bottom-right). Omit on CTA slide.

### 6. Hard Rules Override Map (vs. SKILL.md "Hard Rules")

| SKILL.md Hard Rule | In `sketchnote` |
|--------------------|-----------------|
| #2 brand icon + #11 watermark every slide | **KEPT** (doodle execution on body/peak, standard on cover/CTA) |
| #3 / #4 / #18 / #19 creator face / costume / `creator` token | **DOODLE slides: SUSPENDED** (no photographic human). **Cover + CTA: ACTIVE** — emit `{{CREATOR_FACE}}` and render the photographic Spotlight Portrait creator |
| #5 text rendered in-image | **KEPT** |
| #7 warm film stock | **SUSPENDED on doodle slides** — no film stock |
| #9 4K via Nano Banana Pro | **KEPT** |
| #10 / WOW gate 6/8 | **Doodle slides: REPLACED** by the DOODLE gate below. **Cover/CTA: KEPT** (Spotlight Portrait WOW gate) |
| #16 prompt body rendering (lowercase instructions, no raw `%`, no "shot on", no `//`, no category tags) | **KEPT** |
| #17 absurdist cover element | **N/A** — the cover is a photographic Spotlight Portrait; the scroll-stop is the floating topic elements, not an absurd scene |
| #12 factual claims web-verified | **KEPT** |

### 7. DOODLE Quality Gate (body/peak slides — replaces the 8-element photo WOW gate)

All 8 mandatory, 1 point each, **minimum 6/8** — same gating logic, sketchnote criteria.
(The photographic cover + CTA are gated by the Spotlight Portrait WOW gate instead.)

| # | Factor | Must include in prompt |
|---|--------|------------------------|
| 1 | BLUE-BASE AUTHENTICITY | blue brand gradient background (navy `#0A3D82` edges → brighter `#1E6FD0` center, not flat solid) + visible paper/grid grain |
| 2 | HAND-DRAWN WOBBLE | organic line imperfection — explicitly NOT clean vector |
| 3 | LETTERING HIERARCHY | bold hand-lettered headline + smaller body, clear size contrast |
| 4 | EMPHASIS MARKS | underline / circle / highlight / arrow on the key words |
| 5 | ICON CLARITY | simple recognizable doodle icons supporting the message |
| 6 | PALETTE DISCIPLINE | blue base + off-white ink + ≤2 accents (gold + mint), consistent across slides |
| 7 | WHITESPACE & COMPOSITION | one big idea per slide, generous breathing room |
| 8 | LEGIBLE IN-IMAGE TEXT | off-white headline + labels crisp and readable on blue |

```
### DOODLE: [N]/8
✓ Blue-Base Authenticity | ✓ Hand-Drawn Wobble | ✓ Lettering Hierarchy | ✓ Emphasis Marks
✓ Icon Clarity | ✓ Palette Discipline | ✓ Whitespace | ✓ Legible Text
```

### 8. Cross-Slide Consistency (CRITICAL for carousels)

A carousel must look like one set. Two mechanisms, use both:

1. **Repeat the STYLE BLOCK verbatim** at the top of every doodle slide's prompt (below).
   Cover + CTA carry the Spotlight Portrait blue-base description instead.
2. **Chain the style reference** — once the first doodle slide renders, pass it as a style
   reference image into the later doodle slides (Nano Banana Pro accepts up to 14 reference
   images and holds visual consistency across frames). In the prompt: "match the exact blue
   base, marker style, and palette of the provided reference image." The blue base ties the
   photographic cover/CTA and the doodle body slides into one coherent set.

### 9. Canonical STYLE BLOCK (paste at the top of every DOODLE slide prompt)

```
A one-page hand-drawn educational infographic in sketchnote style on a blue brand gradient
background — deep navy #0A3D82 in the corners radiating to a brighter #1E6FD0 toward the
center (a soft directional gradient for artistry, NOT a flat solid fill) — with subtle
paper-fiber/grid grain. Everything looks drawn by hand with light markers — every line has a
slight organic wobble, flat 2D illustration, the drawings and icons stay flat (no gradient
fills on the doodles themselves), no photography, no realism, no cinematic lighting. Palette
strictly limited to the blue gradient base, warm off-white ink (#F8F6F0), golden accent
(#F5A623), and light-mint support (#6FE0B0). Bold hand-lettered off-white headlines, key
words underlined or circled in golden accent. Clean composition, generous whitespace. Crisp
legible lettering.
```

### 10. Prompt Templates

**COVER (slide 1) — PHOTOGRAPHIC Spotlight Portrait (NOT doodle):**
```
Follow the Spotlight Portrait Template from hook-visual-library.md on a blue brand gradient
base — deep navy #0A3D82 in the corners radiating to a brighter #1E6FD0 glow behind the
creator (NOT a flat solid fill), subtle vignette darkening at the edges for depth. A real
photographic creator from the provided face reference — calm and credible, bald head with
rectangular glasses, signature outfit — anchored center/right, caught mid-action (NOT a
stiff frontal stand): sipping a coffee mug, holding a game controller, mid-gesture, or
another relaxed slightly-quirky topic-relevant beat. Around the upper body, ≥3 glassy
floating topic UI elements (real tool cards / logos / screenshots of the topic) with soft
glow and depth blur — this is the scroll-stop. Bottom gradient zone: big bold bilingual
headline "{ID_HEADLINE}" with 2–4 key words in golden accent (#F5A623), smaller English
subtitle "{EN_SUBTITLE}" beneath. Top-bar pill: a bald-with-glasses brand avatar + the
clearly visible handle "@alisadikinma" + a small verified check on the left, and a
"GESER 👆 / swipe" pill on the right — do NOT print the word "Bilingual". Page mark "1/{N}"
top-left. 4:5 aspect ratio.
```

**BODY / PEAK (steps / comparison / list) — DOODLE on blue:**
```
[STYLE BLOCK]
On a blue brand gradient base (deep navy #0A3D82 edges → brighter #1E6FD0 toward center, NOT
a flat solid fill). Hand-lettered section title top-left in off-white: "{STEP_TITLE}". Below,
{BODY_LAYOUT: e.g. three numbered hand-drawn rows, each with a doodle icon + a short label +
a one-line explanation; OR a two-column "WHAT HAPPENED vs WHAT TO DO" split with a hand-drawn
arrow between them}. Circle or highlight the single most important phrase in golden accent.
Page mark "{n}/{N}" top-left, "SWIPE (GESER) →" bottom-right, "@alisadikinma" footer with a
small bald-with-glasses brand icon (no hair). 4:5 aspect.
```

**CTA (last slide) — PHOTOGRAPHIC Spotlight Portrait (NOT doodle):**
```
Follow the Spotlight Portrait Template from hook-visual-library.md on a blue brand gradient
base — deep navy #0A3D82 corners radiating to a brighter #1E6FD0 glow behind the creator
(NOT a flat solid fill) + gold glow accent. The real photographic creator from the face
reference, calm and confident, bald head with rectangular glasses, caught in a relaxed
quirky action beat (e.g. raising a coffee mug toward the viewer, pointing at the CTA pill).
2–3 floating mini value-recap cards. Bold bilingual CTA headline "{CTA_HEADLINE}" with key
words in golden accent. A rounded dark action pill bottom-center: "SIMPAN & BAGIKAN / save &
share". Three social icons (Instagram, TikTok, LinkedIn) with "@alisadikinma" and
"https://alisadikinma.com" beneath. No SWIPE arrow. Page mark "{N}/{N}" top-left. 4:5 aspect
ratio.
```

### 11. Worked Example (a body/peak doodle slide on blue)

```
A one-page hand-drawn educational infographic in sketchnote style on a blue brand gradient
background — deep navy #0A3D82 in the corners radiating to a brighter #1E6FD0 toward the
center (NOT a flat solid fill) — with subtle paper-fiber/grid grain. Everything looks drawn by hand with
light markers — slight organic wobble in every line, flat 2D illustration, no photography,
no realism, no gradients, no cinematic lighting. Palette strictly the blue base, warm
off-white ink (#F8F6F0), golden accent (#F5A623), light-mint support (#6FE0B0). Hand-lettered
off-white section title top-left: "3 LANGKAH AUDIT". Below, three numbered hand-drawn rows,
each a doodle icon (a shield, a falling chart, a magnifying glass) + a short off-white label
+ a one-line explanation; the phrase "24 JAM" circled in golden accent. Page mark "4/7"
top-left, hand-drawn "SWIPE (GESER) →" bottom-right, "@alisadikinma" footer bottom-left.
Generous whitespace, clean composition, crisp legible lettering. 4:5 aspect ratio.

### DOODLE: 8/8
✓ Blue-Base Authenticity | ✓ Hand-Drawn Wobble | ✓ Lettering Hierarchy | ✓ Emphasis Marks
✓ Icon Clarity | ✓ Palette Discipline | ✓ Whitespace | ✓ Legible Text
```

---

## Adding a New Preset

1. Add a row to the Preset Registry table.
2. Add a `## Preset: <name>` section with the same subsections (overrides, palette,
   gate, STYLE BLOCK, templates).
3. No SKILL.md change needed — the `--style` flag already routes here. Just document the
   new value in the SKILL.md Flags table description.
4. (Pipeline mode only) if the preset must work headless on the VPS, add
   `style-presets.md` to the `BUNDLES` sources in `scripts/compile-refs.ts` and run
   `npm run compile-refs`. Interactive mode reads this file on demand and needs no compile.
