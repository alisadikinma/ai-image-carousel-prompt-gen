# Non-Interactive Defaults — Pipeline Mode Resolution Rules

> **Read order:** This file is loaded ONLY when `/carousel-gen` runs in pipeline
> mode (auto-detected from the `--blog-source` flag, or explicit `--pipeline` /
> `--non-interactive`). Interactive mode keeps the existing question-and-confirm
> flow defined in `SKILL.md` and `creator-bible.md`.

When the skill runs non-interactively (typically as `claude -p "/carousel-gen ..."`
inside a backend SSH cron job — Portfolio_v2's `LinkedInGenerationService` and
the upcoming carousel-gen path), there is **no human operator on the other end of
the prompt to answer clarifying questions**. Hanging on a question would block
the FSM, time out the SSH call, and leave the draft stuck at `generating`.

This file replaces every interactive question in `SKILL.md` with a deterministic
default resolution rule. The rule is: **resolve from `creator-bible.md` + `global-config.md`
defaults, render the slide, and emit a structured warning** in the JSON envelope's
optional `notes[]` field (or stderr if the envelope is failing) — never block on a
question.

---

## 1. Mode Detection

| Trigger | Mode |
|---|---|
| `--blog-source=<url>` flag present | **Pipeline** (non-interactive) |
| `--pipeline` flag present | **Pipeline** (non-interactive) |
| `--non-interactive` flag present | **Pipeline** (non-interactive) |
| Skill invoked under `claude -p "..."` with no TTY | **Pipeline** (non-interactive) |
| Anything else (default — operator at the keyboard) | **Interactive** (existing flow) |

When pipeline mode is detected, suppress every prompt that would otherwise pause
for user input. Apply the resolution rules below, log a warning to the JSON
envelope, and continue.

---

## 2. Profession / Costume Ambiguity

Trigger: a slide implies profession-specific clothing (lab coat, hard hat, pilot
uniform, surgical scrubs, chef whites, courtroom robe, military uniform, etc.).

| Interactive behavior | Pipeline behavior |
|---|---|
| Ask: "Should you wear [profession outfit] or your default [wardrobe from creator bible]?" | **Apply `hook-visual-library.md` Section 10 priority chain non-interactively** (see resolution chain below). Log selection reasoning to envelope `notes[]`. |

**Pipeline behavior**: Apply `hook-visual-library.md` Section 10 priority chain non-interactively:

1. **Scene-override (always wins)** — if the visual hook scene implies a specific environment (night market, beach, gym, courtroom, hospital, kitchen, etc.), use the scene-appropriate costume from §10 Scene → Costume Override Table.
2. **Topic-category match** — match blog topic against §10's Topic Keyword → Category Resolution Table at the top of Section 10. Use the matched category's Prompt Phrase verbatim into the slide's `[Wardrobe]` slot.
3. **LLM inference fallback** — when no keyword matches and no scene override, infer the most appropriate profession-immersive costume from the dominant blog subject. Pick category from §10's existing 17 (9 lifestyle + 8 profession) categories.
4. **Creator-bible default** — only as last resort when topic is genuinely generic personal-narrative (no profession context). Use creator-bible §6 default (charcoal henley OR blazer per context).

**Topic-immersive rule**: thematic costume applies to ALL layout types where creator face appears (cover, body, human_fingerprint, cta) — NOT just hook. Even when a public figure is also present in body slides, creator wears thematic costume; public figure wears their identity outfit.

**Logging**: append selection reasoning to envelope `notes[]` in this exact format: `costume_resolved: <category> via <source> ("<reasoning>")`. Examples:

- `costume_resolved: Medical via topic_match ("matched keyword 'surgeon' in title")`
- `costume_resolved: Aerospace via scene_override ("hook scene = inside ISS module")`
- `costume_resolved: Tech / AI via fallback ("no keyword match, inferred from AI/ML topic")`

---

## 3. Setting / Location Ambiguity

Trigger: the scene allows two or more valid environments (office vs. home studio,
indoor vs. outdoor, day vs. night).

| Interactive behavior | Pipeline behavior |
|---|---|
| Ask: "Which do you prefer: (A) [option] (B) [option]?" | **Always use the creator-bible mood-matched default** from Section 10 (Background by Mood). Add the chosen mood to the slide's image prompt without asking. |

**Mood-to-setting mapping (per `creator-bible.md` Section 10):**

| Slide mood / layout_hint | Default setting |
|---|---|
| `cover` (hook, scroll-stop) | **= the resolved absurd §5 hook scene** — the cover has NO generic-studio default; its setting IS the dramatic pattern-interrupt scene chosen in §5 (topic-anchored, must contain ≥1 recognizable topic element). A conservative warm-studio cover AUTO-FAILS (see §5 + SKILL.md Rule #17). |
| `body` (content delivery) | **Warm-lit home studio at a wooden desk** with monitors and warm tungsten key lighting. |
| `human_fingerprint` (lived-experience anchor) | **Warm-lit cafe corner table during late afternoon golden hour** with window key light and a journal in foreground. |
| `direct_answer` (PEAK / AI-search) | **Warm-lit modern studio** with a clean dark wall behind the subject, soft volumetric haze. |
| `cta` (last slide) | **Warm-lit modern studio** with butterfly key + amber bounce, presenting gesture. |

If the blog topic explicitly names a location (e.g., "during my Tokyo trip"),
override the default with the topic's location and proceed without asking.

---

## 4. Subject Reference / Brand Logo Upload

Trigger: a slide cites a specific company, product, or publication that should
ideally have a reference logo file uploaded (`ref-google-logo.png`,
`ref-tesla-cybertruck.png`, etc.).

| Interactive behavior | Pipeline behavior |
|---|---|
| Block until user confirms reference uploads (Subject Reference Image System workflow). | **Proceed without upload.** Render the brand element by name in the prompt body (e.g., "Google search UI visible in background") and append a structured warning to the JSON envelope's `notes[]` array of the form `manifest_brand_needed: <brand-name>` so the backend can surface a manual-upload prompt to the operator after generation completes. |

The backend's `CarouselGenOutputAdapter` (Phase A4) will route any
`manifest_brand_needed` warning to the existing `awaiting_manual_upload` handling
path used by `EntityReferenceService` for the article pipeline.

---

## 5. Hook Category / Visual Direction Selection

Trigger: interactive workflow asks the operator to pick from 3 hook options or 3
visual directions (Steps 5b/5c in the Fresh Carousel Production workflow).

| Interactive behavior | Pipeline behavior |
|---|---|
| Present 3 hook options + ask the operator to pick or override. | **Auto-select the MOST DRAMATIC absurd visual hook category** from `hook-visual-library.md` Section 1 that creates pattern-interrupt scroll-stop for the topic (see ranking + selection rule below). Log both choices to envelope `notes[]` so the operator can override on regenerate. |

**Pipeline behavior**: Auto-select the MOST DRAMATIC absurd visual hook category from `hook-visual-library.md` Section 1 that creates pattern-interrupt scroll-stop for the topic.

**Default ranking** (most dramatic → least dramatic, prefer top of list):

1. **Status Inversion** — power/role flipped (Wall Street executives bowing to giant Musk statue; politicians dressed as schoolchildren)
2. **Scale Disruption** — impossible scale (creator standing on stack of cash taller than skyscraper; ant-sized creator next to giant CPU chip)
3. **Pattern Interrupt** — surreal juxtaposition (creator in business suit holding live octopus in office; rocket launching from coffee mug)
4. **Object Distortion** — physically impossible objects (laptop bent into Möbius strip; clock with melting hands)
5. **Time Anomaly** — anachronism (medieval knight using smartphone; 1950s diner with hologram menu)
6. **Visual Curiosity Gap** — partial reveal / hidden element (creator pointing at blurred shape; door cracked open with glow)
7. **Speed & Value** — clean professional authority (use only when topic is genuinely about competence demonstration, not virality)
8. **Curiosity Gap (subtle)** — LAST RESORT, use only when topic genuinely lacks dramatic potential (rare)

**Selection rule**: pick the highest-ranked category compatible with the topic's emotional core. NEVER default to Curiosity Gap or Visual Curiosity Gap if a higher-ranked category fits — those are escape hatches, not defaults.

**Intensity directive (MAX absurdist chaos, topic-anchored)**: author the cover scene at MAXIMUM pattern-interrupt intensity — impossible scale, physics-breaking action, role inversion, anachronism, or object distortion — NOT a tame literal scene. The chaos MUST stay **topic-anchored**: keep ≥1 recognizable topic element in frame (the discussed brand/object/concept) so the absurdity reads as intentional genius, never as random "Visual Shock." The hook headline stays serious/professional (Headline Independence Rule) while the visual goes full chaos — that dissonance is the scroll-stop. The cover **setting derives from this scene** (§3 cover row), and the **creator costume derives from the scene** (`hook-visual-library.md` §10 — `creator_outfit.source = scene_override`), not from a fixed default. For abstract/conceptual topics with no profession-keyword match, dress the creator in a §10 Conceptual Archetype (see §5c), never a blazer.

**Logging**: append to envelope `notes[]` in this format: `visual_hook_resolved: <category> ("<reasoning>")`. Example:

- `visual_hook_resolved: Status Inversion ("Wall Street/Musk topic — power inversion most dramatic")`

---

## 5c. Conceptual-Topic → Metaphor-Scene Mapping (abstract topics)

Trigger: the blog topic is **abstract/conceptual** (knowledge systems, privacy,
AI, workflow, mindset, focus, building-in-public) and matches **no** profession
keyword in `hook-visual-library.md` §10. Without this map such topics fall through
to a tame business-casual default (the v2.24 "navy blazer + warm studio" bug).

For these topics, resolve the cover to an absurd **Metaphor-Scene** + the matching
§10 **Conceptual Archetype** costume. The creator becomes the embodiment of the
topic's core metaphor (`creator_outfit.source = scene_override`).

| Topic cluster (keywords) | Metaphor-Scene (max-chaos, topic-anchored) | §10 Archetype costume |
|---|---|---|
| second brain, PKM, notes, zettelkasten, knowledge mgmt, obsidian | creator in a cathedral-scale vault of floating glowing memory-orbs, a giant brain-shaped vault door behind | **Memory Architect** |
| privacy, self-host, data sovereignty, encryption, security, own-your-data | creator guarding a glowing personal-server fortress, corporate cloud-servers crumbling to dust outside the walls | **Data Guardian** |
| AI agent, LLM, automation, prompt, RAG, ML | creator conducting a swarm of glowing AI-agent orbs mid-air like an orchestra | **AI Whisperer** |
| workflow, pipeline, infra, devops, system design | creator assembling a giant floating machine of interlocking code-gears | **Systems Engineer** |
| mindset, psychology, habit, learning, focus (cognition) | creator floating inside a giant cross-section of a glowing brain | **Mind Hacker** |
| deep work, distraction, attention, notification overload | creator slicing through a storm of notification icons with a single glowing focus-blade | **Signal Cutter** |
| indie hacker, build in public, SaaS, side project, founder log | creator forging a glowing app out of raw light-clay at a futuristic anvil | **Builder/Maker** |
| ANY other abstract topic (no match above) | absurd scene that literally embodies the topic's core metaphor (engine infers it) | **Concept Avatar** (fallback) |

**Rule**: an abstract topic NEVER falls through to a blazer/henley/Finance/Business
costume — if no row matches, use **Concept Avatar** and dress the creator as a
theatrical embodiment of the inferred metaphor. Log `costume_resolved: <archetype>
via scene_override` and `visual_hook_resolved: <category>` to `notes[]`.

---

## 5b. BODY + PEAK Content Sourcing (Educational Explainer Cards)

Trigger: authoring the Act 3 (BODY ×3-5) and Act 4 (PEAK) slides. See Hard Rule
#20 in `SKILL.md` and the "BODY + PEAK Content Depth" subsection in
`carousel-best-practices.md` §9 — those slides are educational explainer cards
(teaching headline + 2-3 context sub-points + takeaway), NOT cinematic photos
with one big number.

| Interactive behavior | Pipeline behavior |
|---|---|
| Operator hand-picks which ideas/data go on each body slide. | **Mine the sub-points from real content, never invent them.** Source order: (1) the `--blog-source` body + the inline blog content embedded in the prompt; (2) the verified facts/claims already gathered for this run (Fact Verification section); (3) only if both are thin, the topic's general well-known mechanics — and flag it with a `body_depth_thin: <topic>` line in `notes[]` so the operator knows the cards lean generic. Each body/peak slide MUST carry a teaching headline + 2-3 concrete sub-points (mechanism / number-with-meaning / step / example) + a takeaway line. A slide that resolves to a lone statistic or a vague label is invalid — re-author it with real context before emitting. |

**Number rule**: any figure on a body/peak card travels WITH what it means and
why it matters ("938% recall jump — because it searches meaning, not keywords"),
never a bare "938%".

> **🚫 FACE RULE — BODY + PEAK ARE STRICTLY FACE-FREE (HARD STOP).**
> The creator face appears on **EXACTLY THREE acts: HOOK, FORESHADOW, CTA.**
> Every BODY (Act 3) and PEAK (Act 4) slide is a face-free **infographic
> knowledge card** — NO `creator` token, NO `[Wardrobe]`, NO human figure of any
> kind (not the creator, not a generic person, not a public figure as the card
> subject). This is non-negotiable even when the topic is about a person: render
> their logo / product / data, never a portrait, on a body/peak card.
> **NO `human_fingerprint` face exception on PEAK** — in the default `cinematic`
> deck PEAK is an explainer card like BODY. The face → infographic → infographic
> → face rhythm (Hook + Foreshadow cinematic → Body + Peak cards → CTA cinematic)
> IS the deck's signature. A body/peak slide that emits a `creator` token AUTO-FAILS;
> re-author it as a face-free card. Log `face_free_card: body|peak` in `notes[]`.

> **🔵 ICON DENSITY — MAXIMIZE ICONS ON BODY + PEAK CARDS.**
> These cards must be **icon-led so the brain digests them at a glance.** Render:
> (a) **one distinct icon for EVERY sub-point** (not just some) — a clear flat
> line/duotone glyph in brand `accent_color`; (b) a **header icon or small
> micro-diagram** for the teaching headline; (c) where a sub-point is a
> number/stat, pair it with a **mini visual** (bar, ring, arrow, gauge) not bare
> text. Favor an icon-grid / icon-row / numbered-icon-list layout over a wall of
> text. Goal: a viewer understands the card's shape from the icons alone before
> reading a word. Minimum 3 icons per card; never a text-only card.

---

## 6. Source URL Collection

Trigger: Step 0 of every workflow asks for an inspiration URL.

| Interactive behavior | Pipeline behavior |
|---|---|
| Ask for source URL, optionally extract metadata. | **Read `--blog-source=<url>` directly from the flag.** Extract caption / OG metadata via `curl` as documented in `SKILL.md`. If the flag is missing in pipeline mode, continue without source enrichment — do NOT block. |

---

## 7. Output Folder

Trigger: workflow asks where to write `carousel-prompt.md` and `video-handover.md`.

| Interactive behavior | Pipeline behavior |
|---|---|
| Ask for output folder path; fall back to console. | **Always emit a single JSON document to stdout** matching `CarouselGenOutputSchema`. Never write Markdown files. The backend captures stdout, parses the JSON, and persists the slides + image_prompts to the database. The optional sidecar Markdown deliverables (`carousel-prompt.md`, `video-handover.md`) are interactive-mode only. |

---

## 8. Pipeline-Mode Output Contract Summary

In pipeline mode, the skill MUST emit **one and only one** stdout document:

- **Format:** valid JSON (parseable by `JSON.parse`)
- **Schema:** matches `CarouselGenOutputSchema` from `skills/carousel-gen/schema.ts`
- **Status:** `complete` on success, `failed` on unrecoverable error
- **No prose wrapping:** no Markdown headers, no leading commentary, no trailing
  narration. The backend's parser uses a balanced-brace scanner to tolerate the
  occasional stray fence, but the contract is "JSON only."
- **Warnings:** non-fatal issues (missing brand reference, defaulted wardrobe,
  defaulted hook category) belong in the envelope's optional `notes[]` array, NOT
  in stderr or in narrative text.
- **Exit code:** 0 on `status=complete`, 0 on `status=failed` (the parser owns
  failure handling — non-zero exits are reserved for crashes the runtime can't
  parse).

---

## 9. Non-Pipeline Behavior Unchanged

When the skill runs interactively (no `--blog-source` / `--pipeline` /
`--non-interactive` flag, TTY attached), the existing question-and-confirm flow
in `SKILL.md` Sections "Source URL Collection," "Interactive Slide Design,"
"Hook Clarification," and "Visual Hook Idea" remains the canonical path. This
file is purely additive — it does not modify or replace interactive defaults.

---

## 10. Cross-Reference: Topic-Aware Resolution Sources

Pipeline mode reads these sections at runtime via the bundled `refs-carousel-gen-pipeline.md`:

| Need | Source | Section |
|---|---|---|
| Visual hook absurd-scene formulas (8 categories) | `hook-visual-library.md` | §1 |
| Costume topic→category resolution table | `hook-visual-library.md` | §10 (top — Topic Keyword → Category Resolution Table) |
| Costume per-category prompt phrases | `hook-visual-library.md` | §10 (17 categories — 9 lifestyle + 8 profession) |
| Scene-override costume rules | `hook-visual-library.md` | §10 Scene → Costume Override Table |
| Creator-bible last-resort wardrobe | `creator-bible.md` | §6 |
