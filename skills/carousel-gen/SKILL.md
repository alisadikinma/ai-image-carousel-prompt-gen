---
name: carousel-gen
description: Cinematic AI image prompt generator for social media carousel content. Use whenever the user needs carousel image prompts, thumbnail prompts, carousel rebranding, or any visual content production for social media. Triggers on carousel, thumbnail, rebrand, image generation, Nano Banana Pro, visual content, AI image, buat prompt, bikinin gambar, or any request to create cinematic AI-generated visuals.
---

# Carousel Prompt Generator

Cinematic AI image prompt generator for social media carousel content.
Every frame must trigger visceral "WOW" — the reaction that stops scrolling.

## How to Use This Skill

### As Subagent (Recommended for batch work)
Copy `agents/carousel-prompt-generator.md` to your project's `.claude/agents/` directory:

```bash
# One-time setup after installing skill
mkdir -p .claude/agents
cp <skill-path>/agents/carousel-prompt-generator.md .claude/agents/
cp <skill-path>/references/ ./references/ -r
```

Then invoke via Task tool:
```
Task(agent="carousel-prompt-generator", prompt="Generate carousel prompts for topic X...")
```

### As Inline Skill (For single prompts)
Claude reads this SKILL.md directly and follows the workflow below.

---

## Reference Files (Read On-Demand)

| Task | Read First |
|------|-----------|
| ANY prompt | `references/global-config.md` (ALWAYS — read FIRST) |
| ANY prompt | + `references/creator-bible.md` (ALWAYS) |
| Non-`cinematic` style (`--style=sketchnote`, doodle, flat illustration) | + `references/style-presets.md` (read FIRST when `--style` ≠ `cinematic` — its override tables SUPERSEDE the photo Hard Rules + WOW gate; replaces creator-bible photo defaults) |
| Hook slide / Slide 1 | + `references/hook-science.md` (hook psychology, clickbait formulas, power words) |
| Hook headline formulas | + `references/hook-formula-bank.md` (52 hook formula templates, 8 psychology categories — all content types) |
| Hook visual specs | + `references/hook-visual-library.md` (expression libraries, lighting presets, camera angle banks, environment palettes, synergy matrix, anti-repetition) |
| Carousel rebranding | + `references/carousel-rebranding.md` |
| Platform choice / aspect ratio | + `references/platform-specs.md` |
| Lighting/lens lookup | + `references/cinematography-lut.md` |
| Prompt templates | + `references/prompt-formulas.md` |
| Indonesian content | + `references/localization-id.md` |
| Carousel best practices | + `references/carousel-best-practices.md` |
| Caption/copywriting | + `references/caption-copywriting.md` |
| Pipeline / non-interactive runs | + `references/non-interactive-defaults.md` (when `--blog-source` / `--pipeline` / `--non-interactive` is set, OR no TTY attached) |

---

## Pipeline Mode (Non-Interactive)

The skill auto-detects pipeline mode and switches off every interactive prompt.
This is the contract used by Portfolio_v2's backend SSH cron (`claude -p "/carousel-gen ..."`)
and by any third-party automation invoking the skill headless.

### Detection

Pipeline mode is ON when **any** of the following is true:

| Trigger | Source |
|---------|--------|
| `--blog-source=<url>` flag present | argv |
| `--pipeline` flag present | argv |
| `--non-interactive` flag present | argv |
| Skill invoked under `claude -p "..."` with no TTY attached | runtime |

When ON, **every "ask the user" step in this SKILL.md is replaced** by the
deterministic resolution rules in `references/non-interactive-defaults.md`.
Read that file FIRST whenever pipeline mode is detected — it owns the defaults
for profession costume, setting ambiguity, brand reference uploads, hook
category selection, and visual direction.

### Flags

| Flag | Default | Behavior |
|------|---------|----------|
| `--blog-source=<url>` | none | URL of the source blog post. Skill fetches OG metadata + caption for context enrichment. Presence of this flag is the primary pipeline-mode signal. |
| `--pipeline` | off | Explicit pipeline-mode toggle. Equivalent to `--non-interactive`. |
| `--non-interactive` | off | Alias for `--pipeline`. |
| `--bilingual=id,en` | off (single language) | Opt-in bilingual output. When set, every slide carries `copy_id` + `copy_en` and never `copy`. Output envelope flags `bilingual=true`. |
| `--narrative=5act\|free` | `5act` | Narrative spine. `5act` = HOOK → FORESHADOW → BODY → PEAK → CTA (the 5-act spine documented in `references/carousel-best-practices.md` §9). `free` = unconstrained narrative for experimental layouts. |
| `--style=<preset>` | `cinematic` | Visual execution preset. `cinematic` = default hyperrealistic photo carousel (all Hard Rules below as written). `sketchnote` = hand-drawn doodle infographic on cream paper (flat illustration, no creator photo, no film stock — the Granola + Claude educational look). When ≠ `cinematic`, read `references/style-presets.md` FIRST — its override tables SUPERSEDE the photo-centric Hard Rules + WOW gate. Works in BOTH interactive and pipeline mode. |
| `--target-slides=N` | `9` | Soft hint for total slide count. The skill MAY emit fewer or more slides if the narrative demands it (range: 5-15 per schema), but treats this as the planning target. |
| `--alt-aspect=9:16` | unset | **Phase B+ — TBD.** Reserved for future TikTok / Reels parallel-render of the same narrative. NOT implemented in this task. The schema reserves the `alt_aspect` envelope slot; producing actual 9:16 slides ships in a later phase. |

### Output Contract

In pipeline mode, the skill emits **one JSON document to stdout** matching
`CarouselGenOutputSchema` from `./schema.ts`:

- **No Markdown wrapping.** No `# Headline`, no leading prose, no trailing
  narration. The backend's `CarouselGenOutputAdapter` parses with a balanced-brace
  scanner, but the contract is "JSON only."
- **No sidecar files.** Pipeline mode does not write `carousel-prompt.md` or
  `video-handover.md` — those deliverables are interactive-mode only. The
  backend captures the JSON and persists `slides[]` to the
  `linkedin_posts.carousel_slides` column, then renders human-readable views
  from there.
- **Brand chrome via placeholder tokens (NOT literal references).** Every
  `image_prompt` in pipeline mode MUST use these 6 placeholder tokens, which
  the backend's `CarouselSlideEnhancer` resolves at dispatch time:
  `{{CREATOR_FACE}}`, `{{BRAND_LOGO}}`, `{{HANDLE}}`, `{{PORTFOLIO_URL}}`,
  `{{PAGE_INDICATOR}}`, `{{SWIPE_TEXT}}`. NEVER emit literals like
  `creator-face.png`, `@alisadikinma`, `1/9`, or `https://alisadikinma.com`
  in pipeline mode — they will not be replaced and brand chrome will silently
  break. Interactive mode keeps the existing literal-reference convention
  documented in the Creator Identity section below.
- **No question prompts.** Every interactive "ask the user" step in this
  SKILL.md is auto-resolved per `references/non-interactive-defaults.md`. Log
  defaulted choices to the envelope's optional `notes[]` array so the operator
  can override on regenerate.
- **Status:** `complete` on success, `failed` on unrecoverable error. Both are
  valid envelopes. Exit code is always 0 — the runtime distinguishes outcomes
  via the parsed `status` field, not exit codes.

### Pipeline Mode Routing (Quick Map)

When pipeline mode is detected:

1. **Source URL Collection** (Step 0 of any workflow) → read `--blog-source` flag, fetch OG metadata, skip the question.
2. **Subject Reference Planning** → render brands by name; emit `manifest_brand_needed` warnings; do NOT block.
3. **Interactive Slide Design (ambiguity)** → resolve via `hook-visual-library.md` §10 priority chain (scene-override → topic-keyword match → LLM inference → creator-bible fallback) per `references/non-interactive-defaults.md` §2. Log resolved costume + source to `notes[]` and populate envelope `creator_outfit` field.
4. **Hook Clarification (Step 7b)** → auto-select MOST DRAMATIC absurd hook category from `hook-visual-library.md` §1 (ranking: Status Inversion > Scale Disruption > Pattern Interrupt > Object Distortion > Time Anomaly > Visual Curiosity Gap > Speed & Value > subtle Curiosity Gap) per pillar/topic match; log to `notes[]`.
5. **Visual Hook Idea (Step 7c)** → auto-select absurd pattern-interrupt scene matching the chosen hook category; cover slide MUST contain at least one absurdist visual element (see Visual Hook + Costume Resolution section below); log to `notes[]`.
6. **Output (Step 16 of Fresh Carousel)** → stdout JSON only, no folder write.

Interactive mode is unchanged — every existing question-and-confirm step still
fires when no pipeline flag is set and a TTY is attached.

---

## Creator Identity (USER-PROVIDED)

> **Pipeline-mode override:** This entire section is SKIPPED in pipeline mode
> (`--pipeline` / `--blog-source`). Brand assets are injected by the backend's
> `CarouselSlideEnhancer` post-generation by resolving the 6 placeholder
> tokens listed in the Output Contract section above. Do NOT confirm any
> `ref/` folder or ask the user for files when pipeline mode is detected —
> the SSH cron has no filesystem access to operator assets.

The user must supply their creator identity for personalized prompts (interactive mode). If not provided, ask for:

1. **Creator face** (`ref/creator-face.png`) — clear face photo used as visual identity in every prompt
2. **Creator brand** (`ref/creator-brand.png`) — brand icon/logo file
3. **Brand handle** (e.g., @username)
4. **Accent color** (default per global-config.md `accent_color`)

Use `ref/creator-face.png` in every creator-facing prompt: `[CHARACTER from reference image: creator-face.png]`.

**Session start:** Always confirm `ref/` folder exists with `creator-face.png` + `creator-brand.png` before generating.

---

## Hard Rules (NON-NEGOTIABLE)

> **Style-preset note.** These Hard Rules + the WOW Quality Gate below are the
> **`cinematic`** preset (the default). When `--style` ≠ `cinematic` (e.g.
> `--style=sketchnote`), the override tables in `references/style-presets.md`
> SUPERSEDE every rule they mark as overridden — read that file first and apply its
> DOODLE gate in place of the photo WOW gate. Rules not overridden there still hold.

1. NEVER competitor branding (no other creator badges, watermarks, or handles). **Subject brand** (Google, WhatsApp, etc.) that IS the topic MUST remain visible for context
2. ALWAYS include user's brand icon (center of image, above watermark, thirty percent opacity) + @handle watermark (center of image, below brand icon, thirty percent opacity) rendered IN-IMAGE on every slide. For split-panel comparison (A vs B): both on the vertical divider line. In prompt body: ALWAYS spell "thirty percent opacity" — NEVER "30%"
3. Creator face on: Hook, CTA, Foreshadow, Loop-end, Thumbnail, **AND any B-Roll with human figures** (always — no need to ask). **EXCEPTION — Public Figure Topics**: when carousel is about a public figure (criminal, head of state, artist/celebrity, prominent CEO), body slides show the **public figure's face as primary** — creator may stand beside as companion. Hook + CTA + Foreshadow + Thumbnail = creator face still mandatory
4. B-roll / content slides **without any human figures** = NO creator face
5. Text = **IN-IMAGE rendering** via Nano Banana Pro prompt (headlines, accents, branding, labels — all part of the prompt)
6. Accent color = user's brand color (per global-config.md `accent_color`)
7. Default film stock = per global-config.md `film_stock` (warm, NOT cold)
8. Aspect ratio = platform-specific. IG Feed/LinkedIn: 4:5, TikTok/Reels: 9:16 (see Platform Routing)
9. Image size = 4K via Nano Banana Pro
10. All prompts must pass WOW minimum score (6/8, all 8 elements mandatory)
11. Brand icon + @handle watermark MUST be rendered in every slide prompt
12. All factual claims MUST be web-verified before prompt generation
13. Ambiguous slides (costume/setting) MUST trigger user question before prompt generation. Human figures in B-Roll = ALWAYS creator face (no question needed)
14. Default content language = per `global-config.md` Language section (bilingual by default). Single language only when user explicitly requests
15. Captions for all 4 platforms (IG + TikTok + LinkedIn + Threads) generated by default with every carousel
16. **Prompt body rendering rules** — when writing the actual Nano Banana Pro prompt, follow the Prompt Body Rendering Rules in `references/prompt-formulas.md`: all instruction words lowercase, no raw percentages, no "Shot on" prefix, no `//` separators, no category tags, no raw filenames. Only in-image text (headlines, HUD data, CTA, watermark handle) may be ALL CAPS
17. **Cover setting = the resolved absurd scene (scene-first).** Every cover slide MUST contain at least one absurdist visual element (impossible scale / role inversion / surreal juxtaposition / anachronism / object distortion) rendered at MAX chaos intensity but **topic-anchored** (≥1 recognizable topic element in frame). The cover has **NO generic-studio default** — a generic-studio / warm-studio / Edison-bulb / "modern studio with bokeh" cover with no absurdist element AUTO-FAILS, as do conservative literal scenes (e.g., "Wall Street building photographed at night with neon arrow rising"). On AUTO-FAIL, pick a higher-ranked category from `hook-visual-library.md` Section 1 and re-author. The hook headline stays serious/professional (Headline Independence Rule) while the visual goes full chaos
18. Every slide where the creator face appears (cover / body / human_fingerprint / cta) MUST resolve `[Wardrobe]` via `hook-visual-library.md` Section 10 priority chain. NEVER hardcode jas / blazer / henley / creator-bible default unless the priority chain explicitly falls through to it (rare edge case). **For abstract/conceptual topics** (knowledge systems, privacy, AI, workflow, mindset, focus, build-in-public) that match no profession keyword, resolve to a §10 **Conceptual Archetype** (Memory Architect / Data Guardian / AI Whisperer / Systems Engineer / Mind Hacker / Signal Cutter / Builder/Maker), or **Concept Avatar** if none match — an abstract topic NEVER falls through to a blazer/henley/Finance/Business costume
19. **Creator face detection token (MANDATORY)** — every slide where the creator's face appears (per Rule #3: Hook, CTA, Foreshadow, Loop-end, Thumbnail, B-Roll-with-humans) MUST contain the literal lowercase word `creator` in the `image_prompt` body — either as a noun ("creator stands beside…", "creator's hands grip…", "tight medium shot of the creator") OR via the `{{CREATOR_FACE}}` placeholder which expands to "the provided creator face reference image" at dispatch. NEVER substitute synonyms like "the host", "the speaker", "the man", "the protagonist", "the founder" — publisher pipelines (Portfolio_v2 LinkedIn carousel image enhancer) regex-detect the `creator` token to decide whether to attach `face_refs` to the GeminiGen call. Without the token, `face_refs` is dropped and GeminiGen renders a generic stranger's face. Applies to ALL layout_hint values (cover / body / human_fingerprint / direct_answer / cta) — the layout enum doesn't carry slide-role semantics, so the token is the only reliable signal.
20. **BODY + PEAK = educational explainer cards (content-dense, face-free)** — In the default `cinematic` deck, Act 3 (BODY) and Act 4 (PEAK) slides are NOT cinematic hero photos carrying a single big word/number. They are **editorial knowledge cards that teach** — this is where the audience must actually learn something. Every BODY and PEAK slide MUST render IN-IMAGE: **(a)** one **teaching headline** — the single concrete idea, specific not vague ("RAG cuts hallucination by grounding answers in your own docs", NEVER a bare "938%"); **(b)** **2-3 supporting context sub-points**, each a short labeled line carrying a real mechanism / number / step / example that explains WHY and HOW (this is the *essence + context* the viewer takes away); **(c)** one **takeaway line** ("so for you: …" / "artinya: …") so the card stands alone as a complete lesson. A lone statistic AUTO-FAILS — a number must always be paired with *what it means* and *why it matters*. Visual treatment = a cohesive branded **icon-led infographic / knowledge-card layout**: clean editorial grid, **one distinct icon for EVERY sub-point** (clear flat line/duotone glyph in brand `accent_color`) + a **header icon or micro-diagram** for the teaching headline + a **mini visual** (bar/ring/arrow/gauge) for any stat — favor an icon-grid / icon-row / numbered-icon-list so the brain digests the card at a glance (minimum 3 icons per card; a text-only card AUTO-FAILS), generous whitespace, strong type hierarchy (headline » sub-points » takeaway) — still 4K hyperrealistic-grade composition and lighting on the card surface, **NOT hand-drawn** (the doodle look is the separate `--style=sketchnote` preset). **No creator face — and no human figure at all** on BODY/PEAK cards (per Rules #3/#4 — content slides without human figures = no face), so they carry NO `creator` token and need no `[Wardrobe]` resolution; even on public-figure topics the body/peak card renders their logo/product/data, never a portrait. Mirror the full teaching text into the slide's `copy` (or `copy_id` + `copy_en`) so captions/metadata reflect the depth. **Prompt budget**: the explainer card still fits the 1800-char `image_prompt` cap — it has headroom precisely because it DROPS the cinematic-scene prose (film stock, wardrobe, absurdist scene, 8-element WOW). Spend the budget on the teaching text + a clean layout description, not on photographic mood. **The creator face appears on EXACTLY THREE acts — HOOK (Act 1), FORESHADOW (Act 2), CTA (Act 5)** — cinematic creator-face hero shots per Rules #3/#18/#19. The face → infographic → infographic → face rhythm IS the visual signature of the deck. **PEAK carries NO face** — it is a face-free explainer card like BODY (the former `human_fingerprint` PEAK portrait exception is removed; PEAK proof = data/visual, not a creator portrait).

---

## Visual Hook + Costume Resolution (Pipeline + Interactive Modes)

These two callouts apply to BOTH pipeline and interactive modes. They sit between
Step 7b/7c (hook clarification + visual direction) and Step 11 (slide prompt
authoring) of the Fresh Carousel and Rebranding workflows. Pipeline mode
auto-resolves; interactive mode confirms with the user. Either way, the
resolution rules and logging contract are the same.

> **Visual Hook authoring (MANDATORY for cover slide)** — PRIORITIZE absurd pattern-interrupt scenes from `hook-visual-library.md` Section 1's 8 visual hook categories. Default ranking (most dramatic → least dramatic):
>
> 1. **Status Inversion** — power/role flipped (default for political/finance/leadership topics)
> 2. **Scale Disruption** — impossible scale (default for tech/data/economic topics)
> 3. **Pattern Interrupt** — surreal juxtaposition (default for lifestyle/discovery topics)
> 4. **Object Distortion** — physically impossible objects (default for design/process topics)
> 5. **Time Anomaly** — anachronism (default for historical/comparative topics)
> 6. **Visual Curiosity Gap** — partial reveal / hidden element
> 7. **Speed & Value** — clean professional authority (only for genuine competence-demo topics)
> 8. **Curiosity Gap (subtle)** — LAST RESORT only when topic genuinely lacks dramatic potential
>
> **Hard rule**: every cover slide image_prompt MUST contain at least one absurdist visual element (impossible scale, role inversion, surreal juxtaposition, anachronism, or object distortion) that creates scroll-stop. Conservative literal scenes (e.g., "Wall Street building photographed at night with arrow rising") are AUTO-FAIL — the hook headline can stay serious/professional (per existing Headline Independence Rule in `prompt-formulas.md`) while the visual is absurd.
>
> Append a `visual_hook_resolved: <category> ("<reasoning>")` line to envelope `notes[]`.

> **Costume resolution per slide (MANDATORY)** — For every slide where the creator face appears (cover, body, human_fingerprint, cta layouts — NOT just hook), resolve the `[Wardrobe]` slot via `hook-visual-library.md` Section 10 priority chain in this exact order:
>
> 1. Scene-override (if hook scene context = night market, courtroom, hospital, gym, beach, etc., use the scene's costume override)
> 2. Topic-keyword match (match blog title + meta_keywords + body lede against §10's Topic Keyword → Category Resolution Table at the top of Section 10)
> 3. LLM inference fallback (pick most-immersive of the 17 categories based on dominant subject)
> 4. Creator-bible default (last resort only — generic personal-narrative topics)
>
> Topic-immersive applies to ALL layout types where creator appears, not only the hook. Even on body slides where a public figure (Musk, Trump, etc.) is the primary face, the creator (when shown as companion/narrator) wears the topic-thematic costume — public figure keeps their identity outfit; creator keeps thematic costume; both can co-exist in the same slide without conflict.
>
> After resolving, populate the envelope's top-level `creator_outfit` field with `{ category, prompt_phrase, source: 'scene_override' | 'topic_match' | 'fallback', reasoning }`. Also append a `costume_resolved: <category> via <source>` line to `notes[]`.

> **Cover Self-Check Gate (MANDATORY — run before emitting the JSON envelope)** — validate the cover/HOOK slide against BOTH checks; if EITHER fails, re-author the cover before emit:
>
> 1. **Scene check** — does the cover `image_prompt` contain ≥1 absurdist element (impossible scale / role inversion / surreal juxtaposition / anachronism / object distortion) AND ≥1 recognizable topic anchor? A generic-studio / warm-studio portrait, a literal explainer diagram, or a plain "creator standing in a studio" scene FAILS.
> 2. **Costume check** — is the resolved costume NOT a generic-business default (blazer / henley / suit) — unless a scene-override genuinely demands formal wear (courtroom, stage, gala)? An abstract topic wearing a blazer FAILS (must be a §10 Conceptual Archetype / Concept Avatar).
>
> On pass, append `cover_gate: pass` to envelope `notes[]`. On a re-authored fix, append `cover_gate: re-authored (<reason>)`. This gate applies in BOTH pipeline and interactive modes.

---

## Default Content Language

See `references/global-config.md` Language section for current defaults. Override: user specifies single language → use that language, no subtitle. Prompt instructions (scene description) = ALWAYS English (AI model instruction).

---

## Fixed Technical Specs

| Parameter | Value |
|-----------|-------|
| Image Platform | Nano Banana Pro (exclusive) |
| Image Resolution | Per global-config.md `image_resolution` |
| Aspect Ratio | Platform-specific (see Platform Routing) |
| Default Film Stock | Per global-config.md `film_stock` |
| Default Grade | Per global-config.md `color_grade` |
| Accent Color | Per global-config.md `accent_color` |
| Primary Text | Per global-config.md `headline_color` (rendered in-image) |
| Prompt Length | Per global-config.md `prompt_length` |
| Per-slide `image_prompt` HARD CAP | **1800 chars** (~280 words) — see truncation note below |

> **HARD CAP — `image_prompt` ≤ 1800 chars per slide (May 4, 2026).** Earlier
> output (700+ words per slide × 9 slides) exceeded Sonnet's effective output
> token cap during pipeline-mode runs, causing per-slide JSON chunking with
> continuation prose ("Continuing slide 5 image_prompt, then slides 6–9:")
> that the publisher's orchestrator parser cannot recover. Stay under 1800
> chars per slide. If a complex scene needs more, drop one of the optional
> paragraphs (atmosphere or texture-realism) rather than letting the prompt
> bloat. Compose tightly: every sentence must encode a visual choice. Filler
> sentences (e.g., "the lighting is dramatic") are zero-signal — replace
> with concrete metric ("3500K key + 5600K monitor accent at 3:1 ratio").

---

## Fact Verification (Mandatory for Factual Content)

When a carousel contains factual claims (statistics, data, quotes, numbers):

1. **IDENTIFY** all factual claims in the brief/topic
2. **WEB-SEARCH** each claim individually
3. **VERIFY** accuracy from 2+ sources
4. **FLAG** inaccurate claims to user with corrected data
5. **INCLUDE** verified source in output

### What Counts as Factual Claim
- Statistics ("120 TB per second", "99,000 searches")
- Named entity claims ("Amazon processes X orders")
- Historical facts, dates, numbers
- Scientific claims

### What Does NOT Need Verification
- Opinions, subjective statements
- Hypothetical scenarios
- Creative/artistic descriptions
- Common knowledge ("the sun rises in the east")

---

## Interactive Slide Design — Ambiguity Detection

The agent MUST pause and ask the user when ANY of these conditions are detected in a slide:

| Trigger | Condition | Question Template |
|---------|-----------|-------------------|
| **Profession/costume** | Scene implies profession-specific clothing (lab coat, hard hat, pilot uniform) | "Slide N is set in [context]. I'm resolving wardrobe via `hook-visual-library.md` §10 priority chain — proposed: [topic-matched costume from §10]. Want to override?" (see Visual Hook + Costume Resolution section above) |
| **Setting ambiguity** | Location/environment has 2+ valid interpretations | "Slide N needs a [location type]. Which do you prefer: (A) [option] (B) [option]?" |

### Rules
- **Human figures in B-Roll = ALWAYS use creator face** (no need to ask — this is automatic). **Exception**: Public figure topics — see Hard Rule #3
- Creator must be the most prominent/identifiable figure (foreground, slightly closer to camera in crowd scenes). **Exception**: Public figure topics — public figure is primary, creator is companion
- When NO triggers detected → generate prompt without asking
- Questions are concise, 2-3 options max, multiple-choice preferred
- Batch all questions for consecutive ambiguous slides together if possible
- After user answers, generate the prompt with their choices applied

---

## Source URL Collection (All Workflows)

At the START of every carousel generation, ask the user:

> "Punya URL source carousel-nya? (Instagram/TikTok/LinkedIn post URL)
> Kalau ada, share URL-nya — saya tarik caption + metadata untuk memperkaya context.
> Kalau nggak ada / bikin dari nol, lanjut aja."

If URL provided → extract metadata via Bash:
```bash
curl -s -L "{url}" | grep -o 'property="og:[^"]*" content="[^"]*"'
curl -s -L "{url}" | grep -o '"description".*' | head -c 3000
```

Extracts: account name, thumbnail, partial caption, engagement stats, post date.

**Usage:** Caption → topic context + fact extraction + caption inspiration. Engagement → CTA type selection. Account name → competitor branding awareness (DELETE from our prompts). NEVER copy caption verbatim — rewrite in our creator voice.

This step is OPTIONAL — user can skip.

---

## Workflow: Carousel Rebranding

0. **SOURCE URL + REF CONFIRMATION** — ask for source post URL (extract metadata if provided) + confirm `ref/creator-face.png` + `ref/creator-brand.png` exist
1. ANALYZE source slides — extract topic, data, visual concept per slide
2. IDENTIFY third-party elements to REMOVE
3. **VERIFY** — web-search factual claims, confirm accuracy
4. **SUBJECT REFERENCE PLANNING** (MANDATORY — auto-detect 4 categories) — scan for: (a) specific product models, (b) company/brand logos, (c) source/publication logos, (d) unique objects. Assign filenames, present to user, **upload is WAJIB** — do not proceed until confirmed. Fallback: generate reference prompts with accuracy warning. See Subject Reference Image System in `references/prompt-formulas.md`
5. **PLOT EMOTIONAL ARC** — assign emotional beat + intensity to each slide (see Emotional Arc section)
6. **INTERACTIVE** — check each slide for ambiguity triggers, ask user
7. CONVERT style to user's brand palette (warm, cinematic)
8. **SCORE HOOK HEADLINE** — verify 3/5 on Hook Scoring Gate before generating hook prompt
9. GENERATE Slide 1 (HOOK) — use Hook Slide template from `references/prompt-formulas.md`
10. GENERATE Slide 2 (FORESHADOW, mandatory) — use Foreshadow template, select type matching topic
11. GENERATE remaining slides — Nano Banana Pro prompts (text rendered in-image)
12. GENERATE last slide (CTA) — select CTA visual type matching engagement goal
13. SCORE each prompt via WOW gate (min 6/8, all 8 mandatory)
14. **GENERATE CAPTIONS** for all 4 platforms (IG + TikTok + LinkedIn + Threads)
15. **GENERATE VIDEO HANDOVER BRIEF** — auto-generate `video-handover.md` using Video Handover Brief Template from `references/prompt-formulas.md`
16. VERIFY continuity checklist

## Workflow: Fresh Carousel Production

0. **SOURCE URL + REF CONFIRMATION + OUTPUT FOLDER** — ask for source/inspiration post URL (extract metadata if provided) + confirm `ref/creator-face.png` + `ref/creator-brand.png` exist in topic folder + ask for topic folder path (optional — if provided, output to `{path}/carousel-prompt.md`; if skipped, print to console)
1. ANALYZE brief/topic — identify key messages, slide structure, emotions (enrich with source caption if available)
2. **VERIFY** — web-search each factual claim, collect sources
3. **SUBJECT REFERENCE PLANNING** (MANDATORY — auto-detect 4 categories) — scan for: (a) specific product models, (b) company/brand logos, (c) source/publication logos, (d) unique objects. Assign filenames, present to user, **upload is WAJIB** — do not proceed until confirmed. Fallback: generate reference prompts with accuracy warning. ALL subsequent slide prompts use these exact filenames. See Subject Reference Image System in `references/prompt-formulas.md`
4. **DEEP RESEARCH EXPANSION** — after verifying core facts, proactively web-search 3-5 additional angles: (a) How does it actually work? (mechanism, technology, process), (b) What can it be compared to? (vs existing tech/solutions/competitors), (c) Fun facts / surprising details most people don't know, (d) Controversy / ethical concerns / public debate, (e) Real-world impact / who benefits / who's affected. Present findings as "Research Expansion" brief to user. User picks which angles to include in body slides
5. DETERMINE target platform and set aspect ratio (read `references/platform-specs.md`)
6. **PLOT EMOTIONAL ARC** — assign emotional beat + intensity to each slide (see Emotional Arc section)
7. **INTERACTIVE** — check each slide for ambiguity triggers, ask user
7b. **HOOK CLARIFICATION** — present 3 hook options (PRIMARY + SECONDARY + WILDCARD) with sample headline + vibe. User picks or provides custom. Validate against Avoid list
7c. **VISUAL HOOK IDEA** — present 3 vivid scene concepts (MAX-chaos absurd, funny, eye-catching — 2-3 sentence creative pitches, NOT technical component lists). Each must be topic-anchored (≥1 recognizable topic element) and carry a scene-immersive costume — for abstract/conceptual topics, pitch a §10 Conceptual Archetype (Memory Architect / Data Guardian / … / Concept Avatar), never a blazer. Same scene-first + costume rules as pipeline (Rules #17/#18 + Cover Self-Check Gate). User picks, modifies, or provides own idea
8. **SCORE HOOK HEADLINE** — use confirmed hook category from 7b + visual direction from 7c. Verify 3/5 on Hook Scoring Gate
9. GENERATE Slide 1 (HOOK) — use Hook Slide template with confirmed creative direction
10. GENERATE Slide 2 (FORESHADOW, mandatory) — use Foreshadow template, select type matching topic
11. GENERATE remaining body slides — Nano Banana Pro prompts (text rendered in-image, bilingual default)
12. GENERATE last slide (CTA) — select CTA visual type matching engagement goal
13. SCORE each prompt via WOW gate (min 6/8, all 8 mandatory)
14. **GENERATE CAPTIONS** for all 4 platforms (IG + TikTok + LinkedIn + Threads)
15. **GENERATE VIDEO HANDOVER BRIEF** — auto-generate `video-handover.md` alongside `carousel-prompt.md` using Video Handover Brief Template from `references/prompt-formulas.md`. Write to `{path}/video-handover.md` (same folder). If no output folder → print handover brief to console after carousel output
16. **OUTPUT** — if folder path provided → write to `{path}/carousel-prompt.md` with Creative Direction summary at top; if no path → print to console. Include continuity checklist

## Workflow: Thumbnail Generation

1. READ `references/creator-bible.md` for expression + lighting setup
2. GENERATE prompt with: creator face 50-60%, exaggerated emotion, topic visual, text rendered in-image
3. SCORE WOW minimum 6/8, all 8 elements present

## Workflow: Multi-Platform Export

> **Note:** Multi-platform captions are now DEFAULT in every carousel. This workflow is for generating platform-specific SLIDE VARIATIONS (different aspect ratios per platform).

1. ANALYZE input brief/topic
2. **VERIFY** — web-search factual claims
3. READ `references/platform-specs.md` + `references/carousel-best-practices.md` + `references/caption-copywriting.md`
4. **INTERACTIVE** — check slides for ambiguity triggers
5. For EACH target platform, set:
   - Aspect ratio: IG Feed 4:5, TikTok 9:16, LinkedIn 4:5
   - Slide count: IG 7-10, TikTok 5-7, LinkedIn 5-8
   - Content tone: IG visual-first, TikTok trend-driven, LinkedIn insight-led
6. GENERATE full prompt set per platform (all slides, text in-image)
7. GENERATE caption per platform (English default)
8. SCORE each prompt via WOW gate (min 6/8)
9. VERIFY character limits: IG ≤2200, TikTok Title ≤19 + Caption ≤4000, LinkedIn ≤3000, Threads ≤500
10. OUTPUT all variants grouped by platform

---

## Platform Routing

```
Image Generation: Nano Banana Pro (exclusive)

Carousel Aspect Ratios:
  Instagram Feed → 4:5 (1080x1350)
  Instagram Reels → 9:16 (1080x1920)
  TikTok → 9:16 (1080x1920)
  LinkedIn → 4:5 (1080x1350) or 1:1 (1080x1080)
  Default (unspecified) → 4:5 (1080x1350)
```

---

## WOW Quality Gate

All 8 elements are MANDATORY in every prompt. Score 1 point each (max 8):

| # | Factor | Must Include in Prompt |
|---|--------|----------------------|
| 1 | LIGHTING DRAMA | Lighting pattern + ratio + Kelvin (Rembrandt 4:1, 3200K) |
| 2 | DEPTH LAYERS | Foreground + subject + background (3 distinct layers) |
| 3 | ATMOSPHERE | Haze, particles, volumetric rays, fog, bokeh, or environmental effect |
| 4 | COLOR CONTRAST | Warm-cool tension, accent color highlights, complementary palette |
| 5 | EMOTIONAL PEAK | Expression keywords (creator) or scene emotion (B-Roll) |
| 6 | CAMERA INTENTION | Shot type + lens + aperture + angle with clear purpose |
| 7 | TEXTURE REALISM | Skin pores, fabric weave, surface materials, environmental textures |
| 8 | CINEMATIC REF | Film stock + color grade + optional DP reference |

**Minimum: 6/8 for ALL slide types.** No exceptions.
Below 6/8 → REVISE by adding missing elements before output.

### WOW Output Format
```
### WOW: [N]/8
✓ Lighting Drama | ✓ Depth Layers | ✓ Atmosphere | ✓ Color Contrast
✓ Emotional Peak | ✓ Camera Intention | ✓ Texture Realism | ✓ Cinematic Ref
```

---

## Output Format

### Full Carousel Output
```
# Carousel: [Topic Title]
Platform: [Target] | Slides: [N] | Aspect: [ratio] | Language: [per global-config.md]

---

## Slide [N]: [TYPE] — [Slide Topic] | Emotion: [BEAT] ([intensity]/6)
Type: Hook / Foreshadow / Content / CTA | Creator Face: YES/NO | Platform: Nano Banana Pro
[For Hook: Hook Category: [category] | Headline Score: [N]/5]
[For Foreshadow: Foreshadow Type: [Steps Tease / Fear Urgency / Quiz / Visual Tease]]
[For CTA: CTA Type: [Polarize / Question / Identity Tag / Reward]]

### Suggested Filename
`[N]-[topic-keywords]-[brand-handle]-[slide-type].png`

### Reference Images
| Filename | Content | Usage |
|----------|---------|-------|
| creator-face.png | Creator's face reference | [Context-specific usage for this slide] |
| creator-brand.png | Brand icon | Center of image, thirty percent opacity, above watermark |
| [ref-xxx.png if applicable] | [Object/logo/source description] | [Slide-specific usage] |

### Nano Banana Pro Prompt
[Full merged prompt: scene + cinematography + all 8 WOW elements + text rendering + branding, 80-200 words]

### Verified Fact
"[Claim as stated]" — ✓ Verified
Source: [Publication name], [Year] | [URL]
Source Logo: [ref-source-{publication}-logo.png] (rendered in-image alongside source text, if applicable)
Note: [Any correction or nuance, if applicable]

### WOW: [N]/8
✓ Lighting Drama | ✓ Depth Layers | ✓ Atmosphere | ✓ Color Contrast
✓ Emotional Peak | ✓ Camera Intention | ✓ Texture Realism | ✓ Cinematic Ref

---

[... all slides ...]

---

## Visual Continuity Checklist
- [ ] ALL slides use consistent warm color palette
- [ ] NO competitor branding on ANY slide (subject brand IS required where relevant)
- [ ] Subject brand (logo/UI) visible on slides discussing that brand's stats/facts
- [ ] Hook headline scored 3/5+ on Hook Scoring Gate
- [ ] Hook category matches Topic → Hook Category Mapping (**NOT defaulting to Visual Shock**)
- [ ] Hook visual profile loaded from `references/hook-visual-library.md` (expression + lighting + camera + environment)
- [ ] Hook visual matches hook category (expression + scene + lighting — each category must look DISTINCT)
- [ ] Hook slide uses a Visual Action from the Hook Bank (16 absurd action types — see hook-science.md)
- [ ] If repeat topic this session: different camera variant (A/B/C) selected
- [ ] Costume matches topic category (hook-visual-library.md Section 10)
- [ ] Prop type matches hook category rule (Topic-Related or Random Absurd per Section 11c) from hook-visual-library.md
- [ ] Slide 2 is FORESHADOW type (Steps Tease / Fear Urgency / Quiz / Visual Tease)
- [ ] Foreshadow creates FOMO — viewer must swipe to resolve
- [ ] Emotional arc plotted — each slide has assigned beat + intensity
- [ ] Mini-hook present at slide 5-7 (re-engagement surprise)
- [ ] CTA uses specific visual type (Polarize / Question / Identity Tag / Reward)
- [ ] Hook + CTA + Foreshadow + Thumbnail have creator face
- [ ] B-Roll with human figures = creator face as most prominent figure (UNLESS public figure topic — then public figure primary, creator companion)
- [ ] Public figure topics: body slides show public figure's face as primary subject
- [ ] B-Roll without humans = no creator face
- [ ] All slides have dark gradient text zone (bottom half) with largest-possible billboard-scale text rendered in-image
- [ ] Brand icon rendered in every slide (center of image, above watermark, from reference file)
- [ ] Brand icon + @handle watermark both at thirty percent opacity (center of image; on vertical divider for comparison split-panel)
- [ ] Page number "[N]/[TOTAL]" in top-left corner on all slides
- [ ] SWIPE (GESER) on all slides except CTA (beneath headline, not at bottom edge)
- [ ] Prompt body follows rendering rules (no ALL CAPS instructions, no raw %, no Shot on, no //, no category tags)
- [ ] Film stock consistently warm
- [ ] Aspect ratio matches target platform
- [ ] All prompts score 6/8+ WOW
- [ ] All factual claims verified with sources
- [ ] Main headline + subtitle per global-config.md Language section (bilingual default; or single language if user-requested)
- [ ] Every slide has suggested filename (sequential number + topic keywords + brand handle + slide type)
- [ ] Hook category confirmed by user (Step 5b) — not auto-selected
- [ ] Visual direction confirmed by user (Step 5c) — not auto-selected
- [ ] Output saved to folder (if path provided) or printed to console
- [ ] Per-slide Reference Images table present on every slide (Filename | Content | Usage)
- [ ] All ref files listed in per-slide tables match files in ref/ folder
- [ ] Company logos use uploaded reference images (not AI-generated)
- [ ] Specific products use uploaded reference images (not AI-generated)
- [ ] Factual slides have source citation rendered in-image ("Source: [Publication], [Year]")
- [ ] Source logos (if applicable) use uploaded reference images
- [ ] Captions include source attribution for all verified facts

---

## Captions — All Platforms

### Instagram Caption ([N]/2,200 chars)
[Hook text — must land within first 125 chars]

[Body text — expand on carousel, don't repeat]

[CTA text]

#tag1 #tag2 #tag3 #tag4 #tag5

---

### TikTok Title (max 19 chars)
[Primary SEO keyword — always visible above caption]

### TikTok Caption ([N]/4,000 chars)
[Hook text — casual Gen Z tone, within first 100 chars]

[SEO-optimized body, long caption for 3x views boost]

[CTA text]

#tag1 #tag2 #tag3 #tag4 #tag5

---

### LinkedIn Caption ([N]/3,000 chars)
[Hook text — professional tone, within first 110 chars]

[Insight-led body with personal context/story]

[CTA text]

🔗 [Link]

Per global-config.md LinkedIn Cross-Promotion Block

#tag1 #tag2 #tag3

---

### Threads Caption ([N]/500 chars)
[Conversational hook — within first 100 chars]

[Short opinion-driven body — no hashtags on Threads]

[Question or opinion prompt for replies]
```

### Caption Rules
- Captions ALWAYS generated for all 4 platforms by default
- User can say "IG aja" or "skip LinkedIn" to filter
- Default language: English
- Character limits enforced: IG ≤2200, TikTok Title ≤19 + Caption ≤4000, LinkedIn ≤3000, Threads ≤500
- TikTok Title = primary SEO keyword (separate field, always visible above caption)
- Hashtags: IG max 5, TikTok max 5, LinkedIn 3-5, Threads none
- **Output format**: One continuous caption per platform — NO section labels (Hook/Body/CTA/Hashtags)
- **LinkedIn cross-promotion (MANDATORY)**: Every LinkedIn caption includes cross-promotion block from `global-config.md` before hashtags
- Each caption follows platform-specific rules from `references/caption-copywriting.md`

### Source Attribution in Captions (Factual Carousels)
When carousel contains verified factual claims from named sources:
- **ALL 4 platform captions** must include source attribution
- Format: "Source: [Publication Name], [Year]" or "Data: [Publication Name]"
- Place after body text, before CTA
- Multiple sources: list all, most authoritative first
- Example: "Data: Stockholm International Peace Research Institute (SIPRI), 2025"

---

## ⚠️ FINAL OUTPUT CONTRACT (PIPELINE MODE — READ LAST)

**This section overrides any conflicting instruction earlier in this SKILL file. It is intentionally placed at the end of the file so it is the most recently-seen instruction at output time.**

When you are running in pipeline mode (detected via `--blog-source`, `--pipeline`, `--non-interactive`, or no-TTY), your ENTIRE response to stdout MUST be a single valid JSON document matching `CarouselGenOutputSchema` from `./schema.ts`.

### Hard rules (no exceptions, no edge cases)

1. **First character of your response MUST be `{`.** Not a Markdown heading. Not a bullet list. Not "Pipeline run complete.". Not a status line. Not a table. The very first character is `{`.

2. **Last character of your response MUST be `}`.** Nothing after it. No "Sources:" list. No "Verified facts used:" appendix. No "Pipeline resolution log" table. No closing summary.

3. **Your response will be parsed by `JSON.parse()`.** If it cannot be parsed as JSON, the backend's `CarouselGenOutputAdapter` throws `CarouselGenAdapterException` and the operator sees the draft fail. The balanced-brace scanner tolerates a leading `{` and trailing `}` but nothing else.

4. **No reasoning narration.** Do not describe what you decided. Do not list which costume you chose. Do not enumerate hooks considered. Do not cite sources you consulted. All of that belongs INSIDE the JSON's `notes[]` array as short string entries — never as Markdown prose to stdout.

5. **No "Pipeline run complete." preamble.** Sonnet's natural tendency is to summarize the work. In pipeline mode, suppress this entirely. The backend reports success via the parsed `status` field, not via your narration.

6. **No tables.** Markdown tables (`| Decision | Source |`) are interactive-mode artifacts. In pipeline mode they appear inside the JSON envelope as `notes[]` strings or `creator_outfit`-style structured fields — never as raw Markdown.

7. **Verified facts go INSIDE the JSON.** If you fact-checked a benchmark number or a quote, that fact's text + source URL belong in the relevant slide's `image_prompt` or `direct_answer_block` field — not in a "Verified facts used:" appendix at the bottom of stdout.

### Self-check before emitting

Before you press send, mentally verify:

- Does my response start with `{`?
- Does my response end with `}`?
- Is everything between those two characters valid JSON (no Markdown, no prose, no tables)?
- Would `JSON.parse(myResponse)` succeed without throwing?

If any answer is no, **discard the response and restart with only the JSON envelope.**

### Why this matters

Production incident 2026-05-13 (drafts #103, #106, #115): Sonnet completed reasoning correctly but emitted a Markdown "Pipeline resolution log" table + sources list instead of the JSON envelope. The balanced-brace parser found zero `{` characters in stdout, returned null, and the backend marked drafts as `failed` with the unhelpful error "carousel-gen dispatch failed or returned null/empty stdout". Operator lost ~3 hours of generation work + manual recovery time.

The Output Contract section at line ~88 above declared the same rule. Sonnet violated it because that section was 500+ lines back in context by output time. This section exists at the END of the file precisely so it is the most-recently-seen instruction when you compose your response.

**Failure to comply is not a near-miss. It is a complete failure of the carousel-gen contract. Comply.**
