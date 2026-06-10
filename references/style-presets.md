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
| `sketchnote` | no | Hand-drawn doodle infographic on warm cream paper — flat marker illustration, no photo, no creator face | Educational tutorials, "how it works", explainer carousels, step-by-step workflows (the Granola + Claude look) |

> Default resolution: if `--style` is absent → `cinematic`. Everything below the
> `cinematic` row documents *non-default* presets. `cinematic` simply = "obey SKILL.md
> + global-config.md as written."

---

## Preset: `sketchnote`

Hand-drawn educational infographic. Looks like a talented designer sketched it with
markers on cream notebook paper. Flat, warm, friendly, high-signal. **No photography,
no realism, no cinematic lighting, no photographic human face.**

### 1. Visual Defaults Override (supersedes global-config.md §4)

| Setting | `cinematic` (default) | `sketchnote` override |
|---------|----------------------|------------------------|
| `image_style` | hyperrealistic | **flat 2D hand-drawn sketchnote illustration** |
| Background | scene environment | **warm cream paper `#F5F0E8`, subtle paper-fiber grain** |
| `film_stock` | Kodak Portra 400 | **none** — it is not a photograph |
| `color_temp` / `color_grade` | 3200-3500K warm amber | **none** — flat illustration has no film grade |
| Lighting | Rembrandt 4:1, Kelvin ratios | **flat even "page" light** — no photographic lighting |
| Texture (anti-AI) | skin pores, fabric weave | **marker-ink edges, paper grain, slight line wobble** |
| Creator face | photo on hook/CTA/foreshadow | **none** — no photographic human (optional: simple line-doodle avatar only) |
| Text zone | dark gradient bottom half | **none** — hand-lettering sits directly on cream paper |
| `image_resolution` | 4K | 4K (unchanged) |
| Aspect ratio | platform-specific | platform-specific (unchanged) |

### 2. Doodle Palette (supersedes global-config.md §3 execution)

| Role | Value | Use |
|------|-------|-----|
| Paper | `#F5F0E8` warm cream | every slide background |
| Ink | `#1A1A1A` near-black | body lettering, icon outlines |
| Accent A (brand) | `#F5A623` golden (global-config `accent_color`) | headline emphasis, underlines, highlights |
| Accent B (support) | `#2E7D32` forest green | secondary emphasis, "good/positive" elements, dividers |

> **Granola-exact variant:** swap Accent A→forest green, Accent B→terracotta orange
> (`#D9603B`) to mirror the Granola + Claude reference precisely. Keep cream + ink fixed.
> Discipline: **cream + ink + at most 2 accents**, identical across all slides.

### 3. Lettering & Text

- **Hand-lettered marker** style: bold weight for headlines, regular for body. Slight
  organic wobble — NOT a clean vector font.
- **Emphasis marks** carry meaning: underline key words, circle the payoff, draw arrows
  to connect ideas, highlight one phrase per slide.
- **Bilingual rule unchanged** — Bahasa Indonesia headline (main) + English subtitle per
  global-config.md §2. Subtitle in Accent A, smaller, beneath the headline.
- **In-image text rule (SKILL.md Hard Rule #5) KEPT** — all headlines, labels, captions
  rendered inside the image. Nano Banana Pro's legible-text strength is the whole reason
  this style works; lean into it.

### 4. Iconography

- Flat **doodle icons only**: rounded-square app tiles, hand-drawn arrows, checkmarks,
  emphasis circles, simple node/tree diagrams, speech bubbles, podiums, trophies.
- **Logos/products → simplified hand-drawn versions**, NOT uploaded photo references.
  This is a deliberate exception to the Subject Reference Image System (which exists to
  keep photographic logos accurate). In sketchnote mode a redrawn doodle logo is correct;
  uploading a real PNG logo would break the flat aesthetic. Describe the logo in words
  ("a green spiral app icon", "an orange burst icon") and let the model draw it.

### 5. Branding Chrome (keeps SKILL.md Hard Rule #2/#11 intent, doodle execution)

- Brand handle `@alisadikinma` + logo STILL appear, but **hand-drawn / hand-lettered**,
  as a subtle footer mark (the rigid "center of image, thirty percent opacity" placement
  is relaxed — a small bottom-corner hand-lettered handle reads better on a sketchnote).
- Page number `[N]/[TOTAL]` top-left — KEPT, hand-written.
- `SWIPE (GESER) →` — KEPT, as a hand-drawn arrow (bottom-right). Omit on CTA slide.

### 6. Hard Rules Override Map (vs. SKILL.md "Hard Rules")

| SKILL.md Hard Rule | In `sketchnote` |
|--------------------|-----------------|
| #2 brand icon + #11 watermark every slide | **KEPT** (doodle execution, relaxed placement per §5) |
| #3 / #4 / #18 / #19 creator face / costume / `creator` token | **SUSPENDED** — no photographic creator. (Pipeline `{{CREATOR_FACE}}` token is NOT emitted in sketchnote mode) |
| #5 text rendered in-image | **KEPT** |
| #7 warm film stock | **SUSPENDED** — no film stock |
| #9 4K via Nano Banana Pro | **KEPT** |
| #10 / WOW gate 6/8 | **REPLACED** by the DOODLE gate below |
| #16 prompt body rendering (lowercase instructions, no raw `%`, no "shot on", no `//`, no category tags) | **KEPT** |
| #17 absurdist cover element | **RELAXED to OPTIONAL** — literal sketchnote covers are allowed (the Granola cover is literal). A playful surreal doodle is welcome but not mandatory |
| #12 factual claims web-verified | **KEPT** |

### 7. DOODLE Quality Gate (replaces the 8-element photo WOW gate)

All 8 mandatory, 1 point each, **minimum 6/8** — same gating logic, sketchnote criteria:

| # | Factor | Must include in prompt |
|---|--------|------------------------|
| 1 | PAPER AUTHENTICITY | cream paper background + visible paper grain/fiber |
| 2 | HAND-DRAWN WOBBLE | organic line imperfection — explicitly NOT clean vector |
| 3 | LETTERING HIERARCHY | bold hand-lettered headline + smaller body, clear size contrast |
| 4 | EMPHASIS MARKS | underline / circle / highlight / arrow on the key words |
| 5 | ICON CLARITY | simple recognizable doodle icons supporting the message |
| 6 | PALETTE DISCIPLINE | cream + ink + ≤2 accents, consistent across slides |
| 7 | WHITESPACE & COMPOSITION | one big idea per slide, generous breathing room |
| 8 | LEGIBLE IN-IMAGE TEXT | headline + labels crisp and readable |

```
### DOODLE: [N]/8
✓ Paper Authenticity | ✓ Hand-Drawn Wobble | ✓ Lettering Hierarchy | ✓ Emphasis Marks
✓ Icon Clarity | ✓ Palette Discipline | ✓ Whitespace | ✓ Legible Text
```

### 8. Cross-Slide Consistency (CRITICAL for carousels)

A carousel must look like one hand drew the whole set. Two mechanisms, use both:

1. **Repeat the STYLE BLOCK verbatim** at the top of every slide's prompt (below).
2. **Chain the style reference** — once slide 1 renders, pass it as a style reference
   image into slides 2..N (Nano Banana Pro accepts up to 14 reference images and holds
   visual consistency across frames). In the prompt: "match the exact paper texture,
   marker style, and palette of the provided reference image."

### 9. Canonical STYLE BLOCK (paste at the top of every sketchnote slide prompt)

```
A one-page hand-drawn educational infographic in sketchnote style. Warm cream paper
background (#F5F0E8) with subtle paper-fiber grain. Everything looks drawn by hand with
markers — every line has a slight organic wobble, flat 2D illustration, no photography,
no realism, no gradients, no cinematic lighting. Palette strictly limited to cream paper,
near-black ink (#1A1A1A), golden accent (#F5A623), and forest-green support (#2E7D32).
Bold hand-lettered headlines, key words underlined or circled in accent color. Clean
composition, generous whitespace. Crisp legible lettering.
```

### 10. Prompt Templates

**COVER (slide 1) —**
```
[STYLE BLOCK]
Big bold hand-lettered headline across the top: "{ID_HEADLINE}" with key words underlined
in golden accent; smaller English subtitle beneath in green: "{EN_SUBTITLE}". Center: a
hand-drawn visual that states the core idea — {COVER_DOODLE: e.g. two rounded-square app
icons joined by a hand-drawn plus and equals sign, leading to a small sketched node
diagram}. A hand-drawn note with an arrow: "{ONE_LINE_PROMISE}". Bottom-right: hand-drawn
"SWIPE (GESER) →". Small hand-lettered "@alisadikinma" footer bottom-left, page mark "1/{N}"
top-left. 4:5 aspect ratio.
```

**BODY (steps / comparison / list) —**
```
[STYLE BLOCK]
Hand-lettered section title top-left: "{STEP_TITLE}". Below, {BODY_LAYOUT: e.g. three
numbered hand-drawn rows, each with a doodle icon + a short label + a one-line explanation;
OR a two-column "WHAT HAPPENED vs WHAT TO DO" split with a hand-drawn arrow between them}.
Circle or highlight the single most important phrase in golden accent. Page mark "{n}/{N}"
top-left, "SWIPE (GESER) →" bottom-right, "@alisadikinma" footer. 4:5 aspect ratio.
```

**CTA (last slide) —**
```
[STYLE BLOCK]
Hand-lettered headline: "{CTA_HEADLINE}" (e.g. "That's the whole system."). A hand-drawn
checkmark-in-circle. Below, a hand-drawn speech bubble: "Comment '{KEYWORD}' to get the
{LEAD_MAGNET}" and a hand-drawn bookmark icon with "or save this post". Three small
hand-drawn social icons (Instagram, TikTok, LinkedIn) with "@alisadikinma" beside them,
and "https://alisadikinma.com" smaller beneath. No SWIPE arrow on CTA. Page mark
"{N}/{N}" top-left. 4:5 aspect ratio.
```

### 11. Worked Example (Granola + Claude cover, sketchnote)

```
A one-page hand-drawn educational infographic in sketchnote style. Warm cream paper
background (#F5F0E8) with subtle paper-fiber grain. Everything looks drawn by hand with
markers — slight organic wobble in every line, flat 2D illustration, no photography, no
realism, no cinematic lighting. Palette strictly cream, near-black ink (#1A1A1A), golden
accent (#F5A623), forest-green support (#2E7D32). Big bold hand-lettered headline at top:
"GRANOLA + CLAUDE = AI SALES WORKFLOW PALING GASPOL", the words "AI SALES WORKFLOW"
underlined in golden accent; smaller green English subtitle beneath: "Two AI powerhouses.
One unfair advantage." Center: two rounded-square doodle app icons — a green spiral and an
orange burst — joined by a hand-drawn plus sign and an equals sign, leading into a small
sketched tree diagram of a checkmark node branching to person, dollar, and chart icons.
A hand-drawn arrow points to a note: "your complete AI sales workflow." Bottom-right:
hand-drawn "SWIPE (GESER) →". Small hand-lettered "@alisadikinma" bottom-left, "1/7"
top-left. Generous whitespace, clean composition, crisp legible lettering. 4:5 aspect ratio.

### DOODLE: 8/8
✓ Paper Authenticity | ✓ Hand-Drawn Wobble | ✓ Lettering Hierarchy | ✓ Emphasis Marks
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
