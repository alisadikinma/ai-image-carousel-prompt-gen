# Creator Bible — Template

> Configurable values (colors, language, handle, film stock, etc.) are in `global-config.md`. This file contains brand RULES and creative GUIDANCE.

## 1. Character Reference (USER MUST PROVIDE)

Creator identity is established through an **image character reference** — NOT a text description. Text descriptions (age, ethnicity, hair, etc.) produce inconsistent AI results. An image reference ensures the AI generates faces that actually look like the creator.

**How it works:**
1. User provides a character reference image at the start of each session (Step 0)
2. The image is referenced in every prompt that requires the creator's face
3. No text-based physical description is needed — the image IS the identity

**Required files (stored in `ref/` folder inside topic folder):**
- Creator face: `ref/creator-face.png` — clear face photo, good lighting (used for both character appearance and facial identity)
- Creator brand: `ref/creator-brand.png` — brand icon/logo file

**Prompt instruction (in every creator-facing prompt):**
```
[CHARACTER from reference image: creator-face.png]
...
Maintain exact appearance from reference image: creator-face.png.
```

**Session start checklist — agent MUST confirm with user:**
1. Have you created a `ref/` folder in your topic folder?
2. Is `creator-face.png` (your face photo) in the `ref/` folder?
3. Is `creator-brand.png` (your brand icon) in the `ref/` folder?

## 2. Branding Assets

| Asset | File | Usage |
|-------|------|-------|
| Creator face | `ref/creator-face.png` | Character reference + facial identity lock for all creator-facing prompts |
| Creator brand | `ref/creator-brand.png` | Rendered in center of image (above watermark), faint and barely-visible, on EVERY slide |

## 3. Branding Rules (HARD — NON-NEGOTIABLE)

### ALWAYS include (rendered IN-IMAGE):
- Brand icon rendered in **CENTER of image, directly ABOVE the @handle watermark**, **faint and barely-visible**, on EVERY slide (part of AI prompt)
- @handle watermark rendered in **CENTER of image, directly BELOW the brand icon**, white text, **faint and barely-visible** on ALL slides:
  - Brand icon + watermark stack as a centered branding block, both at faint and barely-visible
  - Ensures visibility without distracting from content
  - This applies to ALL slide types (Hook, Content, CTA, Thumbnail)
  - In prompt body: ALWAYS spell out "faint and barely-visible" — NEVER write "30%"
- "SWIPE (GESER) >" rendered on all slides except CTA (20-30% engagement boost)
- Corner labels where applicable: series name, episode number

### Subject Brand Context (CRITICAL for B-Roll / Factual Slides)
When a slide discusses a SPECIFIC company, product, or service (Google, WhatsApp, Tesla, etc.):
- **MUST include recognizable brand elements** (logo, UI, color scheme, interface) of the SUBJECT being discussed
- Without subject brand context, the informational claim has NO meaning to the viewer
- Example: "99.000 pencarian/detik" → MUST show Google logo/search UI. Without it, the stat is meaningless
- Example: "40 juta pesan/detik" → MUST show WhatsApp logo/chat UI. Without it, nobody knows what platform
- Subject brand = the topic. Creator brand = your branding. Both coexist.

### NEVER include:
- **Competitor branding** that competes with the CREATOR's brand (other creator handles, rival brand watermarks)
- **Source category tags** from original carousel (e.g., "TECHNOLOGY", "FINANCE" badges from the source) — these are the original creator's branding elements, NOT your content category
- Other creator watermarks or handles
- Generic stock branding elements
- Brands unrelated to the slide's topic

### CTA Slide Additions (rendered IN-IMAGE):
- Social handles (IG, TikTok, LinkedIn, etc.)
- Website URL
- Tagline below main text

## 4. Style DNA — Visual Identity

### Color Palette
| Role | Color | Hex |
|------|-------|-----|
| Primary text | White | #FFFFFF |
| Accent keyword | [User's accent] | Per global-config.md `accent_color` |
| Background base | Solid signature blue | Per global-config.md `background_base` (`#0F59B6`) — all slides |
| Secondary accent | Soft gold | #D4AF37 |

### Typography (Rendered IN-IMAGE)
- Headlines: Condensed **EXTRA BOLD / BLACK weight** sans-serif (Oswald Black / Bebas Neue Bold / Impact family)
- ALL CAPS for main headlines — **MASSIVE SIZE, dominating the bottom half of the frame**
- Headline font must be **significantly larger than typical** — think billboard-scale, not book-scale
- Accent/keyword text = same massive size but in accent color for maximum punch
- Mixed case for subtitles/taglines only
- Text hierarchy: **MASSIVE bold title** > medium subtitle > small tagline
- Prompt MUST specify: "extremely large, bold, impactful condensed uppercase text" — not just "bold text"
- **Default language:** Per `global-config.md` Language section (bilingual by default). Single language only if user explicitly requests
- **Prompt body rendering rule:** In the actual prompt body, describe text size using lowercase only: "the largest possible font size that fills the width, extra bold weight" — never use ALL CAPS instruction words like MASSIVE, ULTRA, LARGE in prompt body (AI renders them as literal text). See `references/prompt-formulas.md` Prompt Body Rendering Rules.

### Film Stock & Color Temperature
| Context | Film Stock | Kelvin | Grade |
|---------|-----------|--------|-------|
| Default (v3 Spotlight Portrait) | Per global-config.md `film_stock` (clean digital / neutral) | Per global-config.md `color_temp` (~5000-5600K neutral key, warm gold rim) | Per global-config.md `color_grade` (cool-neutral key + blue ambient + gold rim) |
| Higher contrast | Clean digital | ~5200K | Deeper blue ambient, brighter gold rim |

**Default to the cool-neutral creator key + blue ambient + gold rim (v3).** The
warm-amber / Kodak Portra look is retired.

### Background & Setting Preferences
- **Base = solid signature blue `#0F59B6` on every slide** (per `global-config.md` `background_base`)
- Creator portrait sits on a radial-glow blue base; topic conveyed by **floating UI elements**, not the environment
- Lighting: cool-neutral key (~5000-5600K) + warm gold rim for separation against the blue
- Avoid: warm-amber lifestyle scenes, Edison-bulb bokeh, mixing base colors within a deck

## 5. Creator Face Allocation

| Slide Type | Creator Face? | Expression | Shot Type |
|------------|---------------|------------|-----------|
| HOOK | YES (always) | Exaggerated — match hook category (see hook-science.md) | CU/MCU |
| FORESHADOW (Slide 2) | YES (always) | Concerned urgency OR teasing "I know something" smirk | MCU |
| Content body (no humans) | NO | — | B-roll topic visuals |
| Content body (with humans) | **YES (always)** | Context-appropriate | Depends on scene |
| Content body (**public figure topic**) | **PUBLIC FIGURE primary**, creator optional companion | Public figure context-appropriate, creator secondary | Depends on scene |
| Split-panel (with creator) | YES | Context-appropriate | MS/MWS |
| CTA (Polarize) | YES (always) | Playful challenge, one eyebrow raised | MS |
| CTA (Question) | YES (always) | Warm curiosity, direct eye contact, head tilt | CU |
| CTA (Identity Tag) | YES (always) | Laughing warmth, nudging gesture | MWS |
| CTA (Engagement Reward) | YES (always) | Generous excitement, presenting "gift" | MCU |
| Thumbnail | YES (always) | Exaggerated curiosity gap | CU tight |

### B-Roll with Human Figures — ALWAYS Use Creator Face
When a B-Roll/content slide involves visible human figures (silhouettes, crowds, professionals, specific persons):
1. **ALWAYS** use the creator's face — no need to ask. Creator face MUST appear in any slide with human figures.
2. Use character reference image + face reference image
3. **Crowd scenes**: Creator must be one of the **most prominent foreground figures** — clearly identifiable, not lost in the crowd. Place creator in center-foreground or left/right-foreground position, slightly larger/closer to camera than surrounding people.
4. **Single/few person scenes**: Creator IS the primary subject.
5. Default to the **signature smart-casual outfit** (§6) — v3 has no topic-costume switching. Only if the scene is a literal specific environment → ask: "signature outfit or a scene-override costume?"
6. The ONLY B-Roll slides without creator face = slides with NO human figures at all (pure object/landscape/abstract visuals)

### Public Figure Face Priority (OVERRIDES B-Roll Rule Above)

When the carousel topic centers on a **public figure** — criminal, head of state, artist/celebrity, or prominent CEO — the face rules change:

| Category | Examples |
|----------|----------|
| Criminal | Suspects, convicted persons, fugitives in the news |
| Head of State | Presidents, prime ministers, monarchs, governors |
| Artist / Celebrity | Actors, musicians, athletes, influencers with public notoriety |
| Prominent CEO | Tech founders, Fortune 500 CEOs, public-facing business leaders |

**Rules:**
1. **Body/content slides**: The **public figure's face is PRIMARY** — they are the main subject. Creator face is NOT the primary subject on these slides
2. **Creator as companion**: Creator MAY stand beside the public figure as a secondary/companion figure (side-by-side, slightly smaller or to the side). This is optional, not mandatory
3. **HOOK slide**: Creator face is still **MANDATORY** (always). The public figure can appear as a secondary element (background image, screen display, smaller inset) but the creator's exaggerated expression drives the hook
4. **CTA slide**: Creator face is still **MANDATORY** (always). Standard CTA visual type rules apply
5. **Foreshadow slide**: Creator face still mandatory — public figure can appear as background/teaser element
6. **Thumbnail**: Creator face still mandatory — public figure can appear as secondary element
7. **Detection**: If the topic names a specific public figure or the content is "about" a recognizable person, this rule auto-activates. No need for user to flag it
8. **AI face reference**: Use the public figure's name directly in the prompt (e.g., "Elon Musk" or "Joko Widodo") — AI models recognize public figures. Creator face reference file still used for creator companion shots

**Summary: Hook + CTA + Foreshadow + Thumbnail = creator face mandatory. Body slides about public figure = public figure's face primary, creator as optional companion.**

## 6. Wardrobe Default — Signature Outfit (v3 Spotlight Portrait)

> **One signature outfit, every slide, every topic.** v3 retires topic-costume
> switching: the creator no longer dresses as the topic. Topic is conveyed by the
> **floating topic elements** (see `hook-visual-library.md` Spotlight Portrait
> Template), never by costume. This maximizes AI-likeness consistency + brand
> recognition.

| Element | Spec |
|---------|------|
| Top | dark tee or henley (charcoal/black, neutral) under an **unstructured blazer** in a neutral tone (slate / charcoal / muted navy) |
| Bottom | clean dark trousers or dark slim denim |
| Accessories | minimal — slim watch optional, no loud logos |
| **Prompt phrase** | wearing the **signature smart-casual** outfit — a dark neutral tee or henley under an unstructured slate-toned blazer, clean dark trousers, soft matte knit and natural blazer drape with subtle creases, credible and approachable, consistent across every slide |

**Signature smart-casual** is the single default (`creator_outfit.source = signature`).
The only exception is a rare **scene-override** deck whose narrative is literally set
in a specific environment (`source = scene_override`) — see
`hook-visual-library.md` §10 Scene → Costume Override Table.

## 7. Text Gradient Zone Allocation (Single Source of Truth)

All text is rendered IN-IMAGE via the Nano Banana Pro prompt (not post-production).

| Slide Type | Gradient Zone | Prompt Instruction |
|------------|--------------|-------------------|
| Hook | Bottom half | "Bottom half of the image has a smooth dark gradient zone. Extremely large, bold, impactful condensed uppercase text reading..." |
| Foreshadow | Bottom half | "Bottom half of the image has a smooth dark gradient zone. Extremely large, bold, impactful condensed uppercase text reading..." |
| Content B-Roll | Bottom half | "Bottom half of the image has a smooth dark gradient zone. Extremely large, bold, impactful condensed uppercase text reading..." |
| Split-Panel | Bottom half | "Bottom half of the image has a smooth dark gradient zone. Extremely large, bold, impactful condensed uppercase text reading..." |
| CTA | Bottom half | "Bottom half of the image has a smooth dark gradient zone. Extremely large, bold, impactful condensed uppercase text reading..." |
| Thumbnail | Bottom third | "Bottom third of the image has a smooth dark gradient zone. Extremely large, bold, impactful condensed uppercase text reading..." |

All gradient zones use a smooth dark-to-transparent gradient (not a hard cut).

## 8. Lighting for Creator's Features

Customize lighting based on creator's physical features (hair, face shape, glasses, skin tone, etc.)

### Recommended Default Setups
| Content | Lighting | Ratio | Kelvin | Lens |
|---------|----------|-------|--------|------|
| Hook | Rembrandt | 4:1 | 3200K | 85mm f/1.8 |
| CTA | Butterfly | 2:1 | 3500K | 85mm f/2 |
| Split-panel | Loop + rim | 3:1 | 3500K | 50mm f/2.8 |
| Thumbnail | Rembrandt/Split | 4:1-6:1 | Mixed | 85mm f/1.8 |

## 9. Wardrobe x Lighting Notes

How wardrobe interacts with lighting — adjust fill, flags, and edge lights accordingly.

| Wardrobe | Lighting Note |
|----------|--------------|
| Dark blazer/jacket | Absorbs well, good skin contrast — works with all setups |
| White/light shirt | Can blow out — reduce fill or flag shirt area |
| Dark henley/polo | Needs edge light for separation on dark backgrounds |
| Dark suit | Very absorbent — requires rim/edge light for definition |

> **Note:** Customize these setups based on the creator's physical features (see Section 1.3 and 1.4 in RAG source — Creator Cinematography and Holiday Production Guide — for detailed examples of how hair type, face shape, glasses, and skin tone affect lighting choices).

## 10. Background by Mood

Match background treatment to the emotional tone of each slide or content piece.

| Mood | Background | Depth | Color Relationship |
|------|-----------|-------|-------------------|
| Professional authority | Dark, minimal | Deep bokeh f/1.8-2.8 | Contrast with skin |
| Approachable teaching | Office context | Moderate blur f/4 | Complementary |
| Tech credibility | Monitor/screen elements | Soft glow bokeh | Cool BG, warm face |
| Casual connection | Home/lifestyle hint | Moderate blur | Warm, inviting |

## 11. Holiday Content Production

Holiday content bridges personal brand identity with seasonal themes. The goal is to feel festive without losing professional credibility — warm and celebratory, but still unmistakably *you*.

### 11.1 The 70/30 Rule

Holiday atmosphere should occupy **70-80%** of the composition, with professional/tech identity taking up **20-30%**. This ensures the seasonal mood dominates while your brand stays recognizable.

**Prompt element order:**
1. Holiday scene (dominant visual — sets the mood)
2. Subject with professional cues (wardrobe, posture, setting)
3. Subtle tech elements (pick 1-2 max — do not overcrowd)
4. Atmosphere + technical specs (film stock, lighting, lens)

### 11.2 Holiday Film Stock Pairing

Each holiday has a natural color palette. Match film stock to amplify the holiday's inherent mood.

| Holiday | Best Film Stock | Reason |
|---------|----------------|--------|
| Christmas / Valentine's | Kodak Portra 400 | Warm skin, nostalgic warmth |
| Chinese New Year / Imlek | Kodak Ektar 100 | Vivid saturated reds/golds |
| Eid al-Fitr / Lebaran | Fujifilm Pro 400H | Cool greens, soft pastels |
| Diwali / New Year's Eve | Kodak Vision3 500T | Tungsten drama, rich blacks |
| Thanksgiving | Kodak Portra 400 | Warm earth tones |

### 11.3 Natural Tech Props (Pick 1-2 for Professional Identity Blend)

These props allow you to weave professional/tech identity into holiday scenes without breaking the festive mood.

| Prop | Description |
|------|-------------|
| Laptop | Casually open near holiday setting, showing AI workflow diagrams |
| Holographic display | Blue-cyan glow contrasting warm holiday tones |
| Smartwatch | Subtly displaying AI metrics |
| Transparent tablet | Reflecting holiday lights, showing neural network viz |
| Code patterns | Integrated into frost, snowflakes, or decorative elements |

**Key insight:** Warm analog holiday lighting vs cool blue tech glow = natural cinematic color temperature tension. This contrast makes the image visually compelling without feeling forced.

### 11.4 Photorealism + Holiday Magic Balance

Holiday content walks a line between realistic and magical. The rule: keep the **subject hyperrealistic** and let the **environment carry the magic**.

- **Subject = hyperrealistic:** natural skin texture, visible pores, real fabric weave, subtle imperfections
- **Magical elements = ambient/environmental:** "subtle golden particles floating lazily," "soft ethereal glow from decorations"
- **Booster keywords:** RAW photo, 8K UHD, natural skin texture with visible pores, film grain, high dynamic range

> Never apply magical effects directly to the subject's face or body. Keep magic in the air, the light, and the decorations.

### 11.5 Posting Strategy

Timing matters. Holiday content performs best when it builds anticipation, not when it arrives late.

| Timing | Action |
|--------|--------|
| 3-4 weeks before | Generate images (iterate, refine, select hero shots) |
| 2 weeks before | Post teaser/BTS content (process shots, prompt breakdowns) |
| Holiday day | Publish hero image |
| After holiday | "How I made this" tutorial (educational content with high shelf life) |

**Platform note:** LinkedIn holiday engagement increases ~18% in December; tech-focused accounts see up to 5x more impressions during holiday periods. Plan your best content accordingly.

## 12. Brand Elements In-Image Rendering Specs

All brand elements are rendered directly in the AI-generated image via the prompt. No post-production step.

### Element Specifications

| Element | Position | Style | Slide Types |
|---------|----------|-------|-------------|
| Brand icon | **Center of image, above watermark** | As-is from file, faint and barely-visible | ALL slides |
| @handle watermark | **Center of image** | White text, faint and barely-visible | ALL slides |
| Headline | Bottom gradient zone | White **EXTRA BOLD** condensed ALL CAPS, **large font** | ALL slides |
| Subtitle | Below main headline | [config: subtitle_language] translation. [config: subtitle_color], slightly smaller — NEVER white | ALL slides |
| Accent keywords (2-4) | Within headline | 2-4 keywords in [config: accent_color], **EXTRA BOLD** | ALL slides |
| Page number | **Top-left corner** | "[N]/[TOTAL]" white small | ALL slides |
| SWIPE CTA | Bottom center | [config: swipe_cta_text] white small | All EXCEPT CTA |
| Social icons + handle | CTA slide only | Per global-config.md CTA Social Media Block | CTA only |

### Opacity & Position Rules
| Slide Type | Brand Icon Position | @handle Position | Both Opacity |
|------------|-------------------|-----------------|-------------|
| Hook | Center of image, above watermark | Center of image, below brand icon | Thirty percent |
| Content/B-Roll | Center of image, above watermark | Center of image, below brand icon | Thirty percent |
| Split-Panel / Comparison (A vs B) | **ON the vertical divider line** | **ON the vertical divider line** | Thirty percent |
| Split-Panel / Non-comparison | Center of image, above watermark | Center of image, below brand icon | Thirty percent |
| CTA | Center of image, above watermark | Center of image, below brand icon | Thirty percent |
| Thumbnail | Center of image, above watermark | Center of image, below brand icon | Thirty percent |

**In prompt body:** ALWAYS write "faint and barely-visible" — NEVER write "30%". Raw percentages render as visible text in Nano Banana Pro.

**Split-Panel Rule:** For **comparison** split-panel slides (A vs B topics), the brand icon + @handle watermark is placed ON the vertical center divider that separates the two panels. For **non-comparison** split-panel slides (same topic, different angles), use the standard center-of-image placement (brand icon above watermark). This ensures comparison dividers are visually anchored while standard layouts remain consistent.

### Language Default

See `global-config.md` Language section for current defaults. Single language override when user explicitly requests.
