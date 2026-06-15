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
| Ask: "Should you wear [profession outfit] or your signature outfit?" | **Apply the v3 signature-outfit chain non-interactively** (see below). Log selection reasoning to envelope `notes[]`. |

**Pipeline behavior (v3 Spotlight Portrait — per-keyword costume switching RETIRED):** the creator no longer changes outfit per profession/keyword. Topic is conveyed by the **floating topic elements** (§5), never by the costume — with ONE narrow topic exception (locale). Resolve in three steps:

1. **Locale/culture override** — if the topic is **fundamentally DEFINED by a specific country/culture** (the place *is* the story, e.g. India AI-training jobs paid in rupees, Japan's robot hotels), dress the creator in that locale's **modern, credible traditional/national attire** (e.g. a tailored kurta / Nehru-collar for India; no caricature, no stereotyped props). `creator_outfit.source = locale_override`. Trigger ONLY when the topic wouldn't exist without that place — a country merely mentioned in passing does NOT count.
2. **Scene-override (rare, still wins over signature)** — if a deck's narrative genuinely demands a setting outfit (the scene is literally inside a specific environment, e.g. on-stage, courtroom B-roll), use the scene-appropriate costume from `hook-visual-library.md` §10 Scene → Costume Override Table. `creator_outfit.source = scene_override`.
3. **Signature outfit (default — almost always)** — otherwise dress the creator in the one **signature smart-casual outfit**: dark tee/henley + unstructured blazer, neutral tone (from `creator-bible.md`). Used on EVERY creator-face slide (cover, body w/ face is N/A — see §5b face rule, human_fingerprint, cta), every topic. `creator_outfit.source = signature`.

The `locale_override` is the **sole topic-driven exception**; it keys on the topic's DEFINING place, NOT on profession keywords. There is otherwise **no topic-keyword matching, no per-profession archetype switching** in v3 — those steps are removed. The signature outfit maximizes AI-likeness consistency and brand recognition.

**Logging**: append selection reasoning to envelope `notes[]` in this exact format: `costume_resolved: <category> via <source> ("<reasoning>")`. Examples:

- `costume_resolved: Signature smart-casual via signature ("v3 default — topic conveyed by floating elements")`
- `costume_resolved: Indian traditional (modern kurta) via locale_override ("topic is fundamentally about India — AI training jobs paid in rupees")`
- `costume_resolved: On-stage via scene_override ("deck narrative is a literal keynote-stage scene")`

---

## 3. Setting / Location Ambiguity

Trigger: the scene allows two or more valid environments (office vs. home studio,
indoor vs. outdoor, day vs. night).

| Interactive behavior | Pipeline behavior |
|---|---|
| Ask: "Which do you prefer: (A) [option] (B) [option]?" | **Always use the v3 Spotlight Portrait base** (solid blue `#0F59B6`). Add the layout-specific mood to the slide's image prompt without asking. |

**Mood-to-setting mapping (v3 Spotlight Portrait — solid blue `#0F59B6` base on ALL slides):**

| Slide mood / layout_hint | Default setting |
|---|---|
| `cover` (hook, scroll-stop) | **= Spotlight Portrait template** — solid blue `#0F59B6` base with a radial glow behind the creator, creator upper-body portrait in the **costume from §2's resolution chain** (signature by default; that locale's modern attire when the topic is locale-defining), **≥3 floating topic UI elements** (real tool cards/logos/screenshots) around the upper body, top-bar swipe pill, bottom CTA pill, bottom-gradient headline with 2-4 gold accent words. NO absurdist scene, NO generic warm-studio. The floating elements (not an absurd scene) do the scroll-stop work. **Hook-copy specificity:** when the topic is defined by a specific **place / number / who**, the bottom-gradient HEADLINE must surface it (lead with it) — e.g. "DI INDIA, DIBAYAR Rp-rupee/JAM…" not a generic "DIBAYAR…". The defining locale belongs in the words, not only the floating map icon. |
| `body` (content delivery) | **Blue `#0F59B6` base, icon-led knowledge card** — card surfaces darker than the base so accent-gold icons read (face-free per §5b). |
| `human_fingerprint` (lived-experience anchor) | **Blue `#0F59B6` base Spotlight Portrait** — creator upper-body, signature outfit, reflective expression, ≥3 floating topic elements, cool-neutral key + gold rim. |
| `direct_answer` (PEAK / AI-search) | **Blue `#0F59B6` base, icon-led answer card** with a clean darker-blue card surface (face-free per §5b). |
| `cta` (last slide) | **Deepened navy variant of `#0F59B6` + extra gold glow** (`cta_background`) — creator half-body, signature outfit, warm "join me" gesture, floating = mini value-recap. Signature blue stays intact (NOT dark-inverted). |

If the blog topic explicitly names a location (e.g., "during my Tokyo trip"),
the floating elements and props may reflect it, but the solid blue base and
signature outfit stay constant (scene-override costume only for a literal-setting deck).

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
| Present 3 hook options + ask the operator to pick or override. | **Resolve the cover to the Spotlight Portrait template** (`hook-visual-library.md` "Spotlight Portrait Template" section): a calm credible creator portrait + **≥3 floating topic UI elements** on the solid blue base. Log the resolution to envelope `notes[]` so the operator can override on regenerate. |

**Pipeline behavior (v3 Spotlight Portrait — absurdist ranking RETIRED):** the scroll-stop mechanic is no longer an absurd scene. It is the **floating topic elements** — glassy UI cards, screenshots, and logos of the *real* tools/topic floating around a composed creator portrait on the blue base. Resolve as follows:

1. **Identify 3–6 real topic artifacts** — the actual tools, apps, products, logos, screenshots, or objects the blog discusses (e.g. a Canva UI card, a ChatGPT logo, a dashboard screenshot, a product shot).
2. **Render them as glassy floating UI elements** around the creator's upper body — translucent, soft glow, depth blur, arranged at varied depths. Optional small AI-robot mascot for AI topics.
3. **Hard rule: ≥3 floating topic elements** on every creator-face slide (cover, human_fingerprint, cta). Fewer than 3 AUTO-FAILS the template gate (SKILL.md Rule #17).

The creator stays in the **signature outfit** (§2) and the headline stays serious/professional (**Headline Independence Rule retained** — the headline delivers the topic; the floating elements grab the eye). The cover setting derives from this template (§3 cover row), not from a scene. `creator_outfit.source = signature`.

**Logging**: append to envelope `notes[]` in this format: `visual_hook_resolved: Spotlight Portrait ("<floating elements chosen>")`. Example:

- `visual_hook_resolved: Spotlight Portrait ("3 floating cards: Canva UI, ChatGPT logo, exported-design thumbnail")`

---

## 5c. Topic → Floating Elements Hint Table

Trigger: choosing the **≥3 floating topic elements** for a creator-face slide (§5).
The floating elements — not a costume or an absurd scene — carry the topic. The
creator stays in the **signature outfit** regardless of topic.

Pick the real artifacts the blog actually discusses. This table is a starting
hint per topic cluster — always prefer the *specific* tools named in the source
content over the generic examples.

| Topic cluster (keywords) | Example floating elements (glassy UI cards / logos / screenshots) |
|---|---|
| second brain, PKM, notes, zettelkasten, knowledge mgmt, obsidian | Obsidian graph-view card, a note-card, a linked-tags panel, a search bar |
| privacy, self-host, data sovereignty, encryption, security | a self-hosted-server dashboard card, a lock/shield glyph, an encrypted-vault UI |
| AI agent, LLM, automation, prompt, RAG, ML | ChatGPT/Claude logo, a prompt-window card, an agent-flow diagram, small AI-robot mascot |
| workflow, pipeline, infra, devops, system design | a pipeline/flow diagram card, a terminal window, a CI/CD status panel |
| mindset, psychology, habit, learning, focus | a habit-tracker card, a streak-calendar UI, a focus-timer widget |
| deep work, distraction, attention, notification overload | a muted-notifications panel, a focus-mode toggle, a calendar time-block card |
| indie hacker, build in public, SaaS, side project | a revenue/MRR chart card, a landing-page mockup, a GitHub commit graph |
| design tools, content, no-code | the actual tool UIs (Canva, Figma, Notion) as cards + their logos |
| **company roster / acronym / "top N" list** (FAANG, MANGOS, Magnificent 7, top AI models, big-tech line-up, stock tickers) | **the decoded member LOGOS as a dominant line-up/grid** (4–8 brand wordmarks + glyphs) — switch to the **Entity-Driven Hybrid** cover (creator smaller/side, logos dominant). See hook-visual-library.md → "Entity-Driven / Acronym Cover". |
| ANY other topic | the 3–6 most recognizable real tools/objects/logos the blog names |

**Rule**: every creator-face slide carries **≥3** of these floating elements. They
are translucent glassy UI with soft glow + depth blur, arranged around the creator's
upper body on the blue base. Log `visual_hook_resolved: Spotlight Portrait ("<elements>")`
to `notes[]`. The creator costume is always `signature` (§2) — never topic-switched.

**Acronym-decode (HARD, all acts):** if the hook is an acronym standing for companies
(FAANG, MANGOS, FANG, Magnificent 7), **never render the bare acronym letters as the
only visual** — decode it into its member-company logos (e.g. `FAANG → Meta · Apple ·
Amazon · Netflix · Google`), drawn from the members the source content actually names.
Use the **Entity-Driven Hybrid** cover (logos dominant, creator smaller/side) and show
the same decoded logos on the body/peak doodle cards (simple hand-drawn wordmarks +
labels). Render **logos/wordmarks only — never a photoreal CEO/public-figure face**
(GeminiGen refuses real-person faces). Log `acronym_decoded: <ACRONYM> → <members>` in
`notes[]`.

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
| Spotlight Portrait template anatomy | `hook-visual-library.md` | "Spotlight Portrait Template" |
| Floating topic elements spec (≥3) | `hook-visual-library.md` | "Floating Topic Elements" |
| Signature smart-casual outfit definition | `creator-bible.md` + `hook-visual-library.md` §10 | Signature Outfit card |
| Scene-override costume rules (rare) | `hook-visual-library.md` | §10 Scene → Costume Override Table |
| Blue base + grade + chrome values | `global-config.md` | §2/§3/§4 |
