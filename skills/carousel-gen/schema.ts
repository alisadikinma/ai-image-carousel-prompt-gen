/**
 * schema.ts — Zod contract for the /carousel-gen skill output.
 *
 * SINGLE SOURCE OF TRUTH for the JSON shape this skill emits to stdout.
 * The Portfolio_v2 backend's CarouselGenOutputAdapter parses against this
 * contract; any drift here breaks downstream consumers.
 *
 * Design highlights:
 *   - Discriminated union on `status` — `complete` envelopes carry all
 *     narrative slides + invariants, `failed` envelopes carry an optional
 *     error message and no slide constraints. Lets the LLM emit a clean
 *     failure response that still parses (vs. blowing up on `slides.min(5)`).
 *   - Bilingual support: a slide may carry single-language `copy` OR a
 *     bilingual `copy_id` + `copy_en` pair, never both. Enforced by
 *     CarouselSlideSchema.superRefine.
 *   - Five LinkedIn-aware narrative layout types: cover, body,
 *     human_fingerprint, direct_answer, cta.
 *   - direct_answer slides carry an optional `direct_answer_block`
 *     (150-600 chars). Constrained to `layout_hint='direct_answer'` only —
 *     a body/cover/cta slide carrying a direct_answer_block is rejected.
 *   - Optional `alt_aspect` slot reserves the contract for a future
 *     TikTok/Reels (9:16) parallel render of the same narrative.
 *   - Top-level superRefine on the complete envelope enforces structural
 *     invariants the LLM is known to drift on: total_slides ≡ slides.length,
 *     slide 1 = cover, last slide = cta, slide_number gapless 1..N.
 *
 * Source: docs/plans/2026-04-28-linkedin-carousel-engine-decoupling.md (Task A1).
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Slide schema
// ---------------------------------------------------------------------------

export const CarouselSlideSchema = z
  .object({
    slide_number: z.number().int().min(1),
    layout_hint: z.enum([
      'cover',
      'body',
      'human_fingerprint',
      'direct_answer',
      'cta',
    ]),
    // Single-language mode.
    copy: z.string().optional(),
    // Bilingual mode — both must be present together.
    copy_id: z.string().optional(),
    copy_en: z.string().optional(),
    // Cinematic prompt the image-gen pipeline consumes. Cap reduced
    // 2500 → 1800 chars on May 4, 2026 — 9 slides × 2500 chars overshot
    // Sonnet's effective output token cap in pipeline mode and triggered
    // per-slide JSON chunking with continuation prose that publisher
    // orchestrator parsers (LinkedInGenerationService, etc.) cannot
    // recover. 1800 still fits the WOW 8-element + 5-paragraph structure
    // when authored tightly.
    image_prompt: z.string().min(300).max(1800),
    is_cover: z.boolean(),
    is_cta: z.boolean(),
    // Only valid on direct_answer slides; constraint enforced in superRefine.
    direct_answer_block: z.string().min(150).max(600).optional(),
  })
  .superRefine((slide, ctx) => {
    const hasSingle = !!slide.copy;
    const hasBilingual = !!(slide.copy_id && slide.copy_en);
    const hasPartialBilingual =
      (!!slide.copy_id && !slide.copy_en) ||
      (!slide.copy_id && !!slide.copy_en);

    if (!hasSingle && !hasBilingual && !hasPartialBilingual) {
      ctx.addIssue({
        code: 'custom',
        message: 'slide must have copy OR (copy_id + copy_en)',
        path: ['copy'],
      });
    }
    if (hasPartialBilingual) {
      // Point at the missing-side field so the operator sees which one to add.
      const missingPath = !slide.copy_en ? ['copy_en'] : ['copy_id'];
      ctx.addIssue({
        code: 'custom',
        message:
          'bilingual mode requires BOTH copy_id and copy_en (one is missing)',
        path: missingPath,
      });
    }
    if (hasSingle && hasBilingual) {
      ctx.addIssue({
        code: 'custom',
        message:
          'slide cannot mix single + bilingual copy (remove either copy or copy_id+copy_en)',
        path: ['copy'],
      });
    }
    if (
      slide.direct_answer_block !== undefined &&
      slide.layout_hint !== 'direct_answer'
    ) {
      ctx.addIssue({
        code: 'custom',
        message:
          'direct_answer_block is only valid on direct_answer layout slides',
        path: ['direct_answer_block'],
      });
    }
  });

export type CarouselSlide = z.infer<typeof CarouselSlideSchema>;

// ---------------------------------------------------------------------------
// Creator outfit (v3 Spotlight Portrait — signature outfit)
//
// Captures which costume the pipeline picked, where it came from, and why.
// Read by Portfolio_v2 admin UI for operator audit + future manual override hook.
// Optional for backward compat with pre-feature drafts.
//
// v3.0.0 (Spotlight Portrait): topic-costume switching is RETIRED. The default is
// the single **signature** smart-casual outfit — `source = 'signature'`. The only
// runtime exception is a literal **scene_override** deck. `topic_match` and
// `fallback` are DEPRECATED and retained only so pre-v3 drafts still parse
// (backward compat) — new runs should emit 'signature' or 'scene_override'.
//
// Source: docs/plans/2026-06-12-spotlight-portrait-blue-rebrand.md
//         (supersedes docs/plans/2026-05-04-topic-aware-costume-and-dramatic-hook.md)
// ---------------------------------------------------------------------------

export const CreatorOutfitSchema = z.object({
  category: z.string().min(2).max(60),
  prompt_phrase: z.string().min(20).max(400),
  // 'signature' (v3 default) | 'scene_override' (rare literal-setting deck).
  // 'topic_match' | 'fallback' DEPRECATED — kept for pre-v3 backward compat.
  source: z.enum(['signature', 'scene_override', 'topic_match', 'fallback']),
  reasoning: z.string().min(10).max(200),
});

export type CreatorOutfit = z.infer<typeof CreatorOutfitSchema>;

// ---------------------------------------------------------------------------
// Output schema (the full stdout JSON)
//
// Discriminated union on `status`:
//   - 'complete' → full narrative envelope, all structural invariants enforced
//   - 'failed'   → minimal envelope (status + format + generated_at + error?),
//                  no slide invariants. Lets the plugin emit a clean parseable
//                  failure response instead of letting parse() crash on
//                  `slides.min(5)` when slides are absent.
// ---------------------------------------------------------------------------

const CompleteEnvelopeSchema = z.object({
  status: z.literal('complete'),
  format: z.literal('carousel'),
  total_slides: z.number().int().min(5).max(15),
  aspect_ratio: z.enum(['4:5', '1:1', '9:16']).default('4:5'),
  bilingual: z.boolean().default(false),
  narrative: z.enum(['5act', 'free']).default('5act'),
  slides: z.array(CarouselSlideSchema).min(5).max(15),
  // Reserved for future TikTok/Reels parallel render of the same narrative
  // at 9:16. Optional — text/image slides reuse the primary `slides[]`.
  alt_aspect: z
    .object({
      aspect_ratio: z.enum(['9:16']),
      slides: z.array(CarouselSlideSchema),
    })
    .optional(),
  // Signature outfit the pipeline picked for this carousel (v3: source =
  // 'signature' by default; 'scene_override' for rare literal-setting decks).
  // Captures category + prompt phrase + resolution source + reasoning so the
  // operator admin UI can audit + (future) manual override. Optional for
  // backward compat with pre-v3 drafts.
  creator_outfit: CreatorOutfitSchema.optional(),
  // Operator-facing warnings the LLM logs in pipeline mode when an interactive
  // step had to be auto-resolved (e.g., "manifest_brand_needed: brand asset
  // upload required for [topic]", "default_wardrobe_applied: charcoal henley
  // chosen per creator-bible §6"). Backend Phase A4 adapter routes
  // manifest_* warnings to the awaiting_manual_upload FSM path.
  notes: z.array(z.string()).optional(),
  generated_at: z.string().datetime(),
});

const FailedEnvelopeSchema = z.object({
  status: z.literal('failed'),
  format: z.literal('carousel'),
  error: z.string().optional(),
  // The LLM MAY emit partial slides before giving up; allow but don't enforce
  // narrative invariants on the failed path. Adapter (Phase A4) decides
  // whether to surface the partial slides to the operator or discard them.
  slides: z.array(CarouselSlideSchema).max(15).optional(),
  // Same purpose as on complete envelope — surface auto-resolution decisions
  // even on failure so operators can debug what the LLM tried before giving up.
  notes: z.array(z.string()).optional(),
  generated_at: z.string().datetime(),
});

export const CarouselGenOutputSchema = z
  .discriminatedUnion('status', [CompleteEnvelopeSchema, FailedEnvelopeSchema])
  .superRefine((output, ctx) => {
    // Failed envelope: skip narrative invariants.
    if (output.status === 'failed') {
      return;
    }

    // Invariant 1: total_slides claim must match actual slides length.
    if (output.total_slides !== output.slides.length) {
      ctx.addIssue({
        code: 'custom',
        message: `total_slides (${output.total_slides}) must equal slides.length (${output.slides.length})`,
        path: ['total_slides'],
      });
    }

    // Invariant 2: slide 1 is the cover.
    if (output.slides.length > 0) {
      const first = output.slides[0];
      if (!first.is_cover || first.layout_hint !== 'cover') {
        ctx.addIssue({
          code: 'custom',
          message: 'slide 1 must have is_cover=true and layout_hint=cover',
          path: ['slides', 0],
        });
      }
    }

    // Invariant 3: last slide is the CTA.
    if (output.slides.length > 0) {
      const lastIdx = output.slides.length - 1;
      const last = output.slides[lastIdx];
      if (!last.is_cta || last.layout_hint !== 'cta') {
        ctx.addIssue({
          code: 'custom',
          message: 'last slide must have is_cta=true and layout_hint=cta',
          path: ['slides', lastIdx],
        });
      }
    }

    // Invariant 4: slide_number is gapless 1..N.
    output.slides.forEach((slide, idx) => {
      if (slide.slide_number !== idx + 1) {
        ctx.addIssue({
          code: 'custom',
          message: `slide_number ${slide.slide_number} at index ${idx} must be ${idx + 1}`,
          path: ['slides', idx, 'slide_number'],
        });
      }
    });
  });

export type CarouselGenOutput = z.infer<typeof CarouselGenOutputSchema>;
export type CompleteCarouselOutput = z.infer<typeof CompleteEnvelopeSchema>;
export type FailedCarouselOutput = z.infer<typeof FailedEnvelopeSchema>;
