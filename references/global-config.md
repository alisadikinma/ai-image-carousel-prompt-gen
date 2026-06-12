# Global Config — Single Source of Truth

> **All other files reference this config.** To change any setting, edit THIS file only.
> Other reference files, SKILL.md, agent.md, CLAUDE.md, and README.md all point here
> for configurable values. They contain behavioral RULES and creative GUIDANCE —
> not hardcoded values.
>
> **Pipeline / non-interactive runs:** when `/carousel-gen` is invoked with
> `--blog-source` / `--pipeline` / `--non-interactive` (or under `claude -p` with
> no TTY), see `references/non-interactive-defaults.md` for the deterministic
> resolution rules that replace every interactive prompt.

---

## How to Change a Setting

1. Find the setting below
2. Change the value
3. Done — all other files reference `global-config.md` for these values

No need to edit 10+ files. The skill, agent, and reference docs all read this file first and use these values.

---

## 1. Creator Identity

| Setting | Value |
|---------|-------|
| `handle` | `@alisadikinma` |
| `handle_no_at` | `alisadikinma` |
| `portfolio_url` | `https://alisadikinma.com` |
| `social_platforms` | Instagram, TikTok, LinkedIn |
| `cross_promo_text` | `📲 Follow me on IG/TikTok/YT: @alisadikinma` |

---

## 2. Language

| Setting | Value |
|---------|-------|
| `main_headline_language` | Bahasa Indonesia |
| `subtitle_language` | English |
| `caption_language` | English |
| `swipe_cta_text` | `GESER 👆 / swipe` (bilingual top-bar pill — ID main + small EN) |
| `cta_pill_text` | `SIMPAN & BAGIKAN / save & share` (bilingual bottom CTA pill — ID main + small EN) |
| `bilingual_default` | Yes — Bahasa Indonesia headline (main) + English subtitle |
| `override_rule` | User requests single language → use that language, no subtitle |

> **Bilingual chrome (v3 Spotlight Portrait):** both the top-bar swipe pill and the
> bottom CTA pill render bilingually — Bahasa Indonesia as the primary line with a
> smaller English line. This applies even when `override_rule` collapses the headline
> to a single language (the chrome stays recognizable across audiences).

---

## 3. Colors & Branding

| Setting | Value |
|---------|-------|
| `background_base` | `#0F59B6` (solid signature blue — ALL slides, whole deck) |
| `accent_color` | `#F5A623` (Golden Yellow — complementary to blue, constant) |
| `headline_color` | `#FFFFFF` (White, ALL CAPS) |
| `subtitle_color` | Accent color (`#F5A623`) — NEVER white like main headline |
| `cta_background` | Deepened **navy variant of `#0F59B6`** + extra gold glow (CTA "action moment" — signature blue stays intact, NOT dark-inverted) |
| `cta_engagement_actions` | **Save + Comment + Share** (algorithm weight order; like de-prioritized). Comment-to-DM **deferred** — swappable into the CTA headline when the platform supports DM automation |

**Grid strategy = solid signature.** Every post uses the same `background_base`
blue (`#0F59B6`) for maximum across-post recognition. Within one carousel the base
is 100% consistent — **never mix base colors across slides of the same deck**. The
only base variation allowed is the CTA slide's deepened-navy `cta_background` (still
a blue, signals "close/action").

> **Card legibility on blue:** body/peak explainer-card surfaces render **darker
> than the `#0F59B6` base** so accent-gold `#F5A623` icons and text stay legible.

---

## 4. Visual Defaults

| Setting | Value |
|---------|-------|
| `film_stock` | Clean digital / neutral (no film-grain emulation; crisp modern look) |
| `color_temp` | ~5000-5600K neutral key, warm gold rim accent |
| `color_grade` | Cool-neutral creator key + blue ambient + gold rim accent |
| `image_resolution` | 4K |
| `image_style` | hyperrealistic |
| `prompt_length` | 80-200 words (up to 250 for complex) |
| `wow_minimum` | 6/8 (all 8 elements mandatory) |
| `font_weight` | Extra Bold / Black weight (billboard-scale) |
| `gradient_zone` | Bottom half (bottom third for thumbnails) |

### Hyperrealistic Standard (Anti-AI-Look)

Every prompt MUST include micro-imperfections from these 6 categories to avoid the "AI-perfect" look:

| Category | Required Imperfections |
|----------|----------------------|
| Skin | visible pores, subtle under-eye texture, micro-sweat, natural color variation |
| Hair | stray hairs catching light, not perfectly groomed |
| Fabric | natural creases, slight wrinkles, not perfectly pressed |
| Surfaces | scuff marks, fingerprints on metal, dust on shelves |
| Composition | slight asymmetry preferred, avoid perfect centering |
| Light | natural falloff, slight color fringing at edges, realistic shadow gradients, subtle lens vignetting |
| `brand_icon_position` | Center of image, above watermark |
| `watermark_position` | Center of image, below brand icon |
| `opacity` | Thirty percent opacity (spell out in prompt — NEVER "30%") |

---

## 5. Platform Specs

### Aspect Ratios
| Platform | Aspect Ratio |
|----------|-------------|
| Instagram Feed | 4:5 |
| Instagram Reels | 9:16 |
| TikTok | 9:16 |
| LinkedIn | 4:5 or 1:1 |
| Default (unspecified) | 4:5 |

### Hashtag Limits
| Platform | Max Hashtags | Formula |
|----------|-------------|---------|
| Instagram | 5 | 2 broad + 2 niche + 1 branded |
| TikTok | 5 | 2 broad + 2 niche + 1 branded |
| LinkedIn | 3-5 | Industry-specific |
| Threads | 0 | No hashtags |

### Caption Character Limits
| Platform | Max Characters | Truncation Point |
|----------|---------------|-----------------|
| Instagram | 2,200 | 125 chars |
| TikTok | 4,000 | ~100-150 chars |
| LinkedIn | 3,000 | 210 (desktop) / 110 (mobile) |
| Threads | 500 | ~100 chars |

---

## 6. Format Conventions

| Setting | Value |
|---------|-------|
| `page_number_format` | `[N]/[TOTAL]` — top-left corner, small white text, ALL slides (thumbnails excluded) |
| `filename_pattern` | `{N}-{topic-keywords}-{handle_no_at}-{slide-type}.png` |

---

## 7. Style Presets

| Setting | Value |
|---------|-------|
| `default_style` | `cinematic` |
| `available_styles` | `cinematic`, `sketchnote` |
| `style_registry` | `references/style-presets.md` (override tables per preset) |

The values in Sections 3-4 above are the **`cinematic`** preset (hyperrealistic photo).
When `--style` ≠ `cinematic`, `references/style-presets.md` supersedes the visual-execution
settings (background, film stock, palette execution, creator face, quality gate). Creator
identity (§1), language (§2), platform specs (§5), and format conventions (§6) are
preset-agnostic and always apply. To add a preset, see `references/style-presets.md` →
"Adding a New Preset".

---

## CTA Social Media Block (In-Image)

Exact prompt text for CTA slides — replaces social handles placeholder:

```
Three small social media icons (Instagram logo, TikTok logo, LinkedIn logo) arranged in a single horizontal row with "@alisadikinma" in white text beside the icons row.
Below the icons row, "https://alisadikinma.com" in white text at slightly smaller size.
```

To change: update the handle and URL above, and update `handle` + `portfolio_url` in Section 1.

---

## LinkedIn Cross-Promotion Block (Caption)

Appended to every LinkedIn caption before hashtags:

```
📲 Follow me on IG/TikTok/YT: @alisadikinma
🌐 Portfolio: https://alisadikinma.com
```

To change: update this block and the values in Section 1.
