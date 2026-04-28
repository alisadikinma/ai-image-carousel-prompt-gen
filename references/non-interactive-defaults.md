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
| Ask: "Should you wear [profession outfit] or your default [wardrobe from creator bible]?" | **Always use the creator-bible default wardrobe.** Append a one-line warning to the slide's prompt body explaining why (e.g., "creator wears charcoal henley in lieu of profession-specific costume — pipeline mode default"). |

**Default wardrobe resolution order (per `creator-bible.md` Section 6):**

1. **Professional / Tech context** (default for `linkedin` blog topics) — *Blazer with open-collar shirt.*
2. **Casual / Lifestyle context** (default for personal-narrative or `human_fingerprint` slides) — *Henley, hoodie, or denim jacket.*
3. **Street / Outdoor context** (B-roll on location) — *Denim jacket over a solid tee.*

Pipeline mode default unless the blog post explicitly tags the topic otherwise:
**charcoal henley with natural fabric weave** (matches `creator-bible.md` Section 6
casual default and the established Portfolio_v2 brand identity from draft #28+).

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
| `cover` (hook, scroll-stop) | **Warm-lit modern studio** with Edison-bulb bokeh and exposed brick wall (per Section 10 "Approachable teaching" + Section 4 "Warm lifestyle environments"). |
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
| Present 3 hook options + ask the operator to pick or override. | **Auto-select the PRIMARY hook category** mapped from the blog post's pillar (per `hook-formula-bank.md` topic→category table). Auto-select the visual direction whose vibe best matches the post's emotional core (read from blog metadata when available; otherwise default to "Visual Curiosity Gap" per `hook-visual-library.md` Section 1). Log both choices to the JSON envelope's `notes[]` so the operator can override on regenerate. |

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
