# ai-image-carousel-prompt-gen

> Cinematic AI image prompt generator for social media carousels — every frame must trigger visceral "WOW".

> **v3.0.0 — Spotlight Portrait rebrand.** The default cover/hook is now a calm,
> credible **creator portrait + ≥3 floating topic UI elements** (real tool
> cards/logos/screenshots) on a **solid signature blue `#0F59B6`** base, with one
> **signature smart-casual outfit** on every slide. The earlier absurdist MAX-chaos
> scene + per-topic costume switching is retired (archived, non-default). Some
> sections below still describe the legacy absurdist hook library — that content
> remains available for reference but is no longer the default mechanic.

A Claude Code plugin that generates production-ready AI image prompts for carousel content across Instagram, TikTok, LinkedIn, and Threads. Built around a cinematography-first philosophy with psychology-based hook science: if Deakins wouldn't light it and Fincher wouldn't approve the frame, it doesn't ship.

## The Problem

| What happens | Result |
|---|---|
| Generic AI prompts produce flat, lifeless carousel images | Users scroll past |
| No consistent visual identity across slides | Brand looks amateur |
| Rebranding third-party carousels means starting from scratch | Hours wasted per carousel |
| No quality standard — every prompt is a gamble | Inconsistent feed |
| Different platform specs ignored | Wrong aspect ratios, suboptimal engagement |
| Caption writing is a separate manual step | Workflow friction, inconsistent tone |
| Factual claims in carousels go unverified | Credibility damage |
| Agent generates everything without asking | Mismatched creative decisions |

## The Solution

### 1. WOW Quality Gate (8/8 Mandatory, Min 6/8)

Every prompt is scored against 8 cinematic criteria — ALL must be present:

| # | Factor | What It Catches |
|---|--------|----------------|
| 1 | Lighting Drama | Flat, even lighting with no mood |
| 2 | Depth Layers | Missing foreground/background separation |
| 3 | Atmosphere | No haze, particles, or volumetric rays |
| 4 | Color Contrast | No warm-cool tension or accent highlights |
| 5 | Emotional Peak | Neutral, lifeless expressions |
| 6 | Camera Intention | Random angles with no purpose |
| 7 | Texture Realism | Smooth, plastic-looking surfaces |
| 8 | Cinematic Reference | No film stock or DP style anchor |

**Minimum 6/8 for ALL slide types.** Below minimum = automatic revision.

### 2. Text-in-Image Rendering

All text (headlines, accent words, branding, SWIPE CTA) is described directly in the Nano Banana Pro prompt for in-image rendering. No more separate "post-production" step — you get complete slides.

### 3. Creator Identity System

Your character reference image, brand handle, accent color, and brand icon are injected into every prompt — ensuring consistent AI-generated visuals across your entire content library. Image references produce more accurate AI likeness than text descriptions.

### 4. Auto Captions for All Platforms

Every carousel automatically generates captions for IG + TikTok + LinkedIn + Threads:

```
Single Brief → Carousel Prompts (text in-image)
                    ↓
             IG Caption (≤2200 chars, 5 hashtags)
             TikTok Title (≤19 chars, primary SEO keyword)
             TikTok Caption (≤4000 chars, 5 hashtags)
             LinkedIn Caption (≤3000 chars, 3-5 hashtags)
             Threads Caption (≤500 chars, no hashtags)
```

Default language: per `references/global-config.md` (bilingual in-image text + English captions by default).

### 5. Fact Verification

All factual claims (statistics, data, quotes) are automatically web-searched and verified before prompt generation. Sources included in output.

### 6. Interactive Slide Design

The agent detects ambiguous creative decisions and asks before generating:
- Profession-specific costumes → "Lab coat or your default blazer?"
- Setting ambiguity → "Modern glass server room or industrial gritty?"

**Note:** B-Roll with human figures automatically uses your creator face as the most prominent figure — no question needed. **Exception:** Public figure topics use the public figure's face as primary in body slides.

### 7. Psychology-Based Hook Science

5 hook categories with 100-hook bank (20 per category, Bahasa + English), backed by research data (Backlinko 912M posts, TokPortal Q2-2025, Virvid 2026, Sephora May-2025):
- **Visual Shock** — pattern interrupt in <0.5s (+131% attention retention, +400% dopamine)
- **Negative Bias** — loss aversion trigger (+63% CTR, 2:1 outperform generic)
- **Curiosity Gap** — open loop psychology (+41% retention, 70%+ completion)
- **Relatability** — identity alignment (+91.7% engagement, +31% authentic)
- **Speed & Value** — ROI on attention (2.5x saves/shares, +217% lead gen)

Plus: Gen-Z transcreation rules, interactive carousel hooks (quiz/flowchart), cover slide design specs, and algorithm engagement hierarchy.

**Hook Formula Bank (v2.11.0):** 52 fill-in-the-blank hook formula templates in 8 psychology categories (Seefluencer framework by Samuel Christ) — works for ALL content types (educational, tips, story, opinion, product, affiliate). Categories: Unbeatable Value, Problem-Solver, Plot Twist, FOMO & Urgency, Social Proof, Comparison & Authority, Hyper-Targeted, Curiosity & Teaser. Cross-mapped to the 5 visual hook categories with visual action pairing and execution checklist.

**Hook Visual Library (NEW in v2.12.0):** Deep visual specs per hook category — expression libraries with prompt-ready phrases (eyes, mouth, head, hands, body, emotion per category), lighting presets (pattern, ratio, color temp, fill, rim, shadow), camera angle banks (3 variants A/B/C per category for anti-repetition), environment palettes, Visual Action × Expression synergy matrix, and anti-repetition variation system. Mandatory hook category enforcement: agent MUST follow Topic → Hook Category Mapping, NEVER default to Visual Shock. **Costume/Wardrobe Library (v2.12.1):** 10 topic-based costume profiles with prompt-ready phrases (Finance = blazer, Tech = hoodie, Food = apron, etc.) + Default fallback. **Prop/Tool Interaction System (v2.12.1):** Topic → Prop bank (5 topic-related + 3 random absurd per category), Prop × Visual Action interaction matrix (12 actions), Hook Category → Prop selection rule (Visual Shock = absurd, others = topic-related).

### 8. CTA Science (Algorithm-Optimized)

4 CTA types ranked by engagement impact, designed around the 2026 algorithm engagement hierarchy (DM shares 3-5x > Saves 3x > Comments > Likes):

| CTA Type | Strength | Example |
|---|---|---|
| **Engagement Reward** | Highest conversion (12-18%) | "Comment 'MAU' dan gue kirim guide-nya ke DM lo" |
| **Question Trigger** | Highest comment volume | "Lo termasuk yang mana? Comment angkanya!" |
| **Polarize Debate** | Highest shares + depth | "Menurut lo [A] atau [B]?" |
| **Identity Tag** | Highest DM shares | "Tag temen yang BUTUH ini" |

### 9. Subject Brand Context

When discussing a specific company (Google, WhatsApp, Tesla), their brand elements (logo, UI, color scheme) are included in the image. Without subject brand context, factual claims are meaningless to viewers.

### 10. Public Figure Face Priority (NEW in v2.10.0)

When the carousel topic is about a **public figure** (criminal, head of state, artist/celebrity, or prominent CEO), face allocation changes automatically:

| Slide Type | Whose Face? |
|---|---|
| Hook | Creator (always mandatory) — public figure as secondary element |
| Foreshadow | Creator (always mandatory) — public figure as background teaser |
| Body/Content | **Public figure is primary** — creator as optional companion beside them |
| CTA | Creator (always mandatory) — standard CTA visual rules |
| Thumbnail | Creator (always mandatory) — public figure as secondary |

The rule auto-activates when the topic names a specific public figure. No need to flag it manually.

### 11. Visual Action Hook Bank (NEW in v2.10.0)

12 absurd mundane action categories for carousel hook slides — because the best pattern interrupt is a creator doing something **nyeleneh** while delivering serious content:

| # | Category | Action Example | Best For |
|---|----------|---------------|----------|
| 1 | Makan Nyeleneh | Biting bread/apple with shocked face | Finance, Education, Tech |
| 2 | Minum Dramatic | Sipping coffee with intense stare | Business, Tutorial, Tips |
| 3 | Objek Absurd | Holding unrelated object (fish, rubber duck) dead-serious | Any serious topic |
| 4 | Destruction | Ripping paper, snapping pencil | Myth-busting, Controversy |
| 5 | Satisfying Process | Pouring honey, squeezing lemon | Food, Lifestyle, Beauty |
| 6 | Scale Absurd | Creator dwarfed by oversized prop | Tech, Comparison, Challenge |
| 7 | Wrong Context | Suit at beach, laptop in jungle | Lifestyle, Business, Travel |
| 8 | Frozen Mid-Action | Mid-jump, mid-throw freeze frame | Challenge, Motivation, Fitness |
| 9 | Extreme Close-Up | Macro shot of mouth biting, hand pouring | Universal pattern interrupt |
| 10 | Props Overflow | Buried in topic-related objects | Listicle, Tips, Education |
| 11 | Contradiction Pose | Smiling in stressful situation | Controversy, Irony, News |
| 12 | Mundane Zen | Calm meditation while background chaos | Productivity, Mental Health |

Includes Topic → Visual Action mapping, prompt-ready fragments for Nano Banana Pro, and synergy tables linking visual action to hook psychology category. The absurd mundane action IS the pattern interrupt.

### 12. Source URL Metadata Extraction (v2.6.0)

Paste an Instagram/TikTok/LinkedIn post URL and the agent auto-extracts caption, account name, engagement stats, and post date. This metadata enriches prompt context and powers caption writing — no manual copy-paste needed.

```
/carousel-gen

Agent: "Punya URL source carousel-nya?"
User:  https://instagram.com/p/DVJgCUcDAVI/

Agent extracts:
  → @getintoai (account)
  → "Another major week in AI!..." (caption)
  → 173 likes, 1 comments (engagement)
  → Feb 24, 2026 (date)

Uses caption as:
  → Topic context for image prompts
  → Skeleton for our own captions (rewritten in creator voice)
  → Factual claims → fed into verification step
  → Hashtag research reference
```

### 13. Carousel Engagement Funnel (v2.2.0)

Full-funnel engagement system from first impression to conversion:

```
HOOK (Slide 1)     → Mindblowing headline + pattern interrupt visual
    ↓                 Score 3/5 on Hook Scoring Gate before generating
FORESHADOW (Slide 2) → Bridge to body with FOMO ("kalau lo skip...")
    ↓                 4 types: Steps Tease, Fear Urgency, Quiz, Visual Tease
BODY (Slides 3-N)  → Progressive value with emotional arc
    ↓                 Mini-hook at slide 5-7 re-engages committed swipers
CTA (Last Slide)    → 4 visual types matching engagement goal
                      Polarize | Question | Identity Tag | Engagement Reward
```

### 14. Emotional Arc System (v2.2.0)

Every carousel follows a "roller coaster" emotional pattern with visual treatment mapped per beat:

| Beat | Visual Treatment |
|------|-----------------|
| HIGH (Hook) | Extreme CU, 4:1 lighting, peak saturation, pattern interrupt |
| DIP (Foreshadow) | Pull back, muted palette, tension build |
| BUILD (Body) | Progressive saturation + tighter framing |
| MINI-HOOK (Mid) | Sudden change — angle shift, color disruption |
| CLIMAX (Reveal) | Peak drama, biggest text, most shareable insight |
| WARM (CTA) | Softest lighting, warmest tone, intimate connection |

---

## Installation

### From Marketplace (Recommended)

```bash
# Step 1: Add marketplace source
claude plugins marketplace add alisadikinma/ai-content-suite

# Step 2: Install plugin
claude plugins install ai-image-carousel-prompt-gen

# Optional: Choose scope
claude plugins install ai-image-carousel-prompt-gen --scope user    # All projects
claude plugins install ai-image-carousel-prompt-gen --scope project # This project only
```

### Manual Installation

```bash
# Clone to Claude Code marketplaces directory
git clone https://github.com/alisadikinma/ai-image-carousel-prompt-gen.git \
  ~/.claude/plugins/marketplaces/ai-content-suite
```

### Verify Installation

After installing, the plugin announces itself on every session start:

```
ai-image-carousel-prompt-gen loaded. Skills available:
  carousel-gen — cinematic AI image prompts for social media carousels
  carousel-validate — cross-file consistency checker (7 checks)
  carousel-localize — scaffold new localization files
```

The skill auto-triggers when you mention carousels, thumbnails, rebranding, or AI image prompts. You can also invoke it explicitly:

```
/carousel-gen
```

---

## What's Inside

### Skills

| Skill | Triggers On |
|---|---|
| `carousel-gen` | carousel, thumbnail, rebrand, image generation, visual content, AI image, buat prompt, bikinin gambar |
| `carousel-validate` | Cross-file consistency checker (7 checks: SWIPE rules, hashtags, gradients, aspect ratios, config consistency) |
| `carousel-localize` | Scaffold new localization files + wire reference tables |

### Agent

| Agent | Purpose |
|---|---|
| `carousel-gen` | Subagent for batch carousel prompt work — reads references, verifies facts, asks about ambiguities, generates prompts + captions, writes output |

### Reference Docs (12 files, read on-demand)

| File | When Used |
|---|---|
| `global-config.md` | ALWAYS (read FIRST) — single source of truth for all configurable values (language, colors, handle, film stock, platform specs) |
| `creator-bible.md` | ALWAYS — creator identity, brand rules, gradient zones, holiday production, brand-in-image specs |
| `hook-science.md` | Hook slides — 5 hook categories (100-hook bank), Visual Action Hook Bank (16 absurd action types), CTA science (4 types + algorithm hierarchy), Gen-Z transcreation, engagement benchmarks, interactive hooks |
| `hook-formula-bank.md` | 52 fill-in-the-blank hook formula templates in 8 psychology categories (Seefluencer) — works for ALL content types |
| `hook-visual-library.md` | Hook visual specs — expression libraries, lighting presets, camera angle banks (3 variants), environment palettes, synergy matrix, anti-repetition, costume library (10 topics), prop interaction system |
| `carousel-rebranding.md` | Converting third-party carousels to your brand |
| `platform-specs.md` | Nano Banana Pro specs, platform aspect ratios |
| `cinematography-lut.md` | Lighting, lens, film stock, atmosphere, DP signatures |
| `prompt-formulas.md` | Prompt templates, hook headline formula, foreshadow, CTA visual types, emotional arc, checklists |
| `localization-id.md` | Indonesian localization extras, holidays, AI bias countermeasures |
| `carousel-best-practices.md` | Carousel design, engagement benchmarks, algorithm signals |
| `caption-copywriting.md` | Caption formulas, emotional triggers, CTA psychology, hashtag strategy |

---

## The Workflow

```
User Request
    |
    v
[0] Ask for source URL (optional) ── extract caption + metadata
    |
    v
[0b] Ask for output folder path (optional) ── save to {path}/carousel-prompt.md
    |
    v
[1] Read global-config.md + creator-bible.md (ALWAYS)
    |
    v
[2] Read task-specific references
    |
    v
[3] Analyze input (enriched with source metadata if available)
    |                                    |
    v                                    v
[4a] FRESH CONTENT            [4b] REBRANDING
  Analyze brief/topic           Analyze source slides
  Set platform aspect ratio     Strip third-party branding
    |                                    |
    v                                    v
[5] VERIFY FACTS — web-search all claims
    |
    v
[5b] SUBJECT REFERENCE PLANNING — name ref images upfront (if topic has specific objects)
    |
    v
[5c] DEEP RESEARCH — proactively search 3-5 angles (mechanism, comparison, fun facts, controversy, impact)
    |
    v
[6] PLOT EMOTIONAL ARC — assign beat + intensity per slide
    |
    v
[7] INTERACTIVE DESIGN — ask about ambiguous slides
    |
    v
[7b] HOOK CLARIFICATION — present 3 hook options (PRIMARY/SECONDARY/WILDCARD), user picks
    |
    v
[7c] VISUAL HOOK IDEA — present 3 vivid scene concepts (absurd+funny+eye-catching), user picks or gives own idea
    |
    v
[8] SCORE HOOK HEADLINE — 3/5 on Hook Scoring Gate (using confirmed category)
    |
    v
[9] SELECT HOOK CATEGORY — user-confirmed from step 7b (NEVER default to Visual Shock)
    |
    v
[9b] SELECT VISUAL ACTION — user-confirmed from step 7c
    |
    v
[9c] LOAD VISUAL PROFILE — expression + lighting + camera + environment from hook-visual-library.md
    |
    v
[10] Generate prompts (Engagement Funnel Order):
    ├── Slide 1: HOOK (visual action + category-matched visual profile + scored headline)
    ├── Slide 2: FORESHADOW (mandatory bridge with FOMO)
    ├── Slides 3-N: BODY (emotional arc + mini-hook at 5-7)
    └── Last: CTA (4 visual types matching engagement goal)
    |
    ├── Below 6/8? ──> REVISE
    |
    v
[11] Generate captions for all 4 platforms (English default)
    |
    v
[12] Generate video handover brief (video-handover.md)
    |
    v
[13] Output with verified sources + continuity checklist
    |
    v
[13b] If folder path provided → write carousel-prompt.md + video-handover.md to {path}/
      If no path → print to console as usual
```

---

## Capabilities

### Carousel Image Prompts
Generate cinematic Nano Banana Pro prompts for each carousel slide — Hook, Content, CTA — with text rendered in-image, proper creator face placement, brand consistency, and all 8 WOW elements.

### Carousel Rebranding
Upload any third-party carousel and get it fully converted to your brand: colors, lighting, style, branding elements. No third-party logos survive.

### Thumbnail Generation
Creator face at 50-60% frame, exaggerated emotion, topic visual, text rendered in-image. Optimized for click-through.

### Caption Copywriting (Auto, All Platforms)
Captions generated by default for IG + TikTok + LinkedIn + Threads with every carousel. Platform-specific character limits, truncation-safe hooks, 2-2-1 hashtag formula, emotional triggers, CTA psychology, and TikTok triple-layer keyword SEO. Default language: English.

### Fact Verification
All factual claims (statistics, numbers, quotes) auto-verified via web search. Sources included per slide. Inaccurate claims flagged with corrections.

### Interactive Slide Design
Agent detects ambiguous slides and asks before generating — human figures (creator face or anonymous?), profession costumes, setting interpretations. Straightforward slides generated without asking.

### Indonesian Localization
Bahasa Indonesia subtitle support and localization reference. Includes setting conversions, holiday adaptations with color palettes, and AI bias countermeasures.

### Deep Research Expansion (NEW in v2.16.0)
After verifying facts, the agent proactively searches 3-5 additional angles: how it works, comparisons, fun facts, controversy, real-world impact. Findings presented to user who picks which angles to include in body slides.

### Video Handover Brief (NEW in v2.16.0)
Auto-generated `video-handover.md` alongside every carousel. Provides downstream video agent with storyline summary, detailed hook visual concept (scene description + motion opportunities + comedy detail), per-slide scenes, emotional arc, text preservation rules, reference images, and creative context.

### Subject Reference Images (NEW in v2.16.0)
Agent identifies topic-specific objects needing visual consistency across slides, assigns descriptive filenames upfront (`ref-{object-description}.png`), asks user for source photos, generates reference image prompts. Same filenames used in ALL slide prompts.

---

## Hard Rules

These are non-negotiable across all generated prompts:

| Rule | Enforcement |
|---|---|
| No competitor branding | Zero competitor badges, logos, handles, or source category tags. Subject brand (Google, WhatsApp) KEPT for context |
| Brand icon + handle on every slide | Both at thirty percent opacity. Icon CENTER (above watermark). @handle CENTER (below icon). Vertical divider for comparison split-panel |
| Multi-keyword highlighting | 2-4 emotionally impactful keywords in accent color per headline — never just 1 word |
| Subtitle color | Subtitle in accent color per global-config.md (never white like main headline) |
| Creator face placement | Hook, CTA, Foreshadow, Thumbnail always. B-Roll with humans: ALWAYS (creator as most prominent). **Public figure topics**: public figure primary in body, creator as companion |
| Visual Action Hook | Hook slide MUST use absurd action from Visual Action Hook Bank (16 categories) as pattern interrupt |
| Creative Clarification | Every carousel starts with 2-step clarification: 3 hook options → user picks → 3 vivid scene concepts (absurd/funny/eye-catching) → user picks or gives own idea. No auto-selection |
| Hook category enforcement | Hook category MUST match Topic → Hook Category Mapping. NEVER default to Visual Shock. Visual profile loaded from hook-visual-library.md |
| Anti-repetition | Same topic repeated = different camera variant (A/B/C) from hook-visual-library.md |
| Text rendered in-image | Headlines (MASSIVE billboard-scale, extra bold), accents, branding, SWIPE CTA — all in prompt |
| Default film stock | Per global-config.md `film_stock` (warm, not cold) |
| Aspect ratio | Platform-specific: IG Feed 4:5, TikTok 9:16, LinkedIn 4:5 |
| Image resolution | 4K via Nano Banana Pro |
| WOW minimum | 6/8, all 8 elements mandatory |
| Default language | Per global-config.md Language section (bilingual by default, single language on request) |
| Auto captions | All 4 platforms by default |
| Fact verification | All claims web-verified before output |
| SWIPE FOR MORE | "SWIPE (GESER) >" on all slides except CTA |
| Page numbers | "[N]/[TOTAL]" in top-left corner on all slides |
| Hashtags | Max 5 (IG/TikTok), 3-5 (LinkedIn) |
| Suggested filenames | SEO-optimized per slide: `{N}-{topic}-{brand}-{type}.png` |
| File output | Optional — user provides folder path at start, output saved to `{path}/carousel-prompt.md`. No path = console |

---

## Output Format

### Carousel Slide

```
## Slide [N]: [TYPE] — [Topic] | Emotion: [BEAT] ([intensity]/6)
Type: Hook / Foreshadow / Content / CTA | Creator Face: YES/NO | Platform: Nano Banana Pro

### Suggested Filename
`[N]-[topic-keywords]-[brand-handle]-[slide-type].png`

### Nano Banana Pro Prompt
[Full merged prompt: scene + cinematography + 8 WOW elements + text rendering + branding, 80-200 words]

### Verified Fact
"[Claim]" — ✓ Verified | Source: [URL]

### WOW: [N]/8
✓ Lighting Drama | ✓ Depth Layers | ✓ Atmosphere | ✓ Color Contrast
✓ Emotional Peak | ✓ Camera Intention | ✓ Texture Realism | ✓ Cinematic Ref
```

### Captions (Auto-Generated)

```
## Captions — All Platforms

### Instagram Caption ([N]/2,200 chars)
[Continuous caption — Bahasa Indonesia, 5 hashtags at end]

### TikTok Caption ([N]/4,000 chars)
[Continuous caption — casual Gen Z Bahasa, 5 hashtags at end]

### LinkedIn Caption ([N]/3,000 chars)
[Continuous caption — professional Bahasa, link inline, 3-5 hashtags at end]

### Threads Caption ([N]/500 chars)
[Continuous caption — conversational Bahasa, no hashtags]
```

**Note:** No section labels (Hook/Body/CTA/Hashtags) — each caption is one continuous text.

---

## Project Structure

```
ai-image-carousel-prompt-gen/
├── .claude-plugin/
│   ├── plugin.json              # Plugin metadata
├── hooks/
│   ├── hooks.json               # Hook definitions (SessionStart)
│   └── session-start.sh         # Session start announcement
├── skills/
│   ├── carousel-gen/
│   │   └── SKILL.md             # Main skill — carousel prompt generation
│   ├── carousel-validate/
│   │   └── SKILL.md             # Cross-file consistency checker
│   └── carousel-localize/
│       └── SKILL.md             # Scaffold new localizations
├── agents/
│   └── carousel-prompt-generator.md  # Subagent definition
├── references/
│   ├── global-config.md         # Single source of truth for all configurable values
│   ├── creator-bible.md         # Creator identity + brand-in-image + holidays
│   ├── hook-science.md          # Hook psychology, 5 categories, visual action bank, scoring
│   ├── hook-formula-bank.md      # 52 hook formula templates, 8 psychology categories
│   ├── hook-visual-library.md   # Hook visual specs, expression libraries, anti-repetition
│   ├── carousel-rebranding.md   # Rebranding conversion rules
│   ├── platform-specs.md        # Nano Banana Pro + platform specs
│   ├── cinematography-lut.md    # Lighting/lens/film stock LUT
│   ├── prompt-formulas.md       # Prompt templates + hook formula + foreshadow + CTA types + emotional arc
│   ├── localization-id.md       # Indonesian localization
│   ├── carousel-best-practices.md  # Design best practices
│   └── caption-copywriting.md   # Caption formulas + hashtags
├── CLAUDE.md                    # Project documentation
├── README.md
└── LICENSE                      # MIT
```

---

## Philosophy

### Cinematography First

Every prompt is anchored in real cinematography — named lighting setups, specific lens choices, actual film stocks, cinematographer signatures. No "make it look cinematic" hand-waving.

### Complete Slides

Text is rendered in the AI-generated image — headlines, accent words, branding, SWIPE CTA. You get a complete carousel slide, not a bare image that needs extensive post-production.

### Creator Consistency

Your face, your brand, your colors — character reference image injected into every prompt. The AI sees the same visual reference every time, producing consistent results across hundreds of slides.

### Platform-Aware

Instagram carousels, TikTok Photo Mode carousels, LinkedIn document posts — each has different specs, aspect ratios, algorithm signals, and engagement patterns. Reference docs encode platform-specific best practices so prompts and captions are optimized for where they'll actually be posted.

### Caption-Ready

Captions aren't an afterthought — they're generated by default for all 4 platforms with every carousel. Platform-specific character limits, truncation-safe hooks, and the right hashtag count.

### Verified Facts

Every factual claim is web-searched and verified before it goes into a prompt. Sources are cited. Inaccurate data is flagged and corrected.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Contributions to reference docs (new platforms, updated specs, additional cinematography techniques) are especially welcome.

---

## License

MIT - see [LICENSE](LICENSE) for details.

---

Built by [Ali Sadikin](https://github.com/alisadikinma)
