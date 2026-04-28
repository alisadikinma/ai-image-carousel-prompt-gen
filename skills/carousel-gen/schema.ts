/**
 * schema.ts — Zod contract for the /carousel-gen skill output.
 *
 * SINGLE SOURCE OF TRUTH for the JSON shape this skill emits to stdout.
 * The Portfolio_v2 backend's CarouselGenOutputAdapter parses against this
 * contract; any drift here breaks downstream consumers.
 *
 * Design highlights:
 *   - Bilingual support: a slide may carry single-language `copy` OR a
 *     bilingual `copy_id` + `copy_en` pair, never both. Enforced by
 *     CarouselSlideSchema.superRefine.
 *   - Five LinkedIn-aware narrative layout types: cover, body,
 *     human_fingerprint, direct_answer, cta.
 *   - direct_answer slides carry an optional `direct_answer_block`
 *     (150-600 chars) — used by the backend to render a callout block.
 *   - Optional `alt_aspect` slot reserves the contract for a future
 *     TikTok/Reels (9:16) parallel render of the same narrative.
 *   - Top-level superRefine enforces structural invariants the LLM is
 *     known to drift on: total_slides ≡ slides.length, slide 1 = cover,
 *     last slide = cta, slide_number gapless 1..N.
 *
 * Source: docs/plans/2026-04-28-linkedin-carousel-decoupling.md (Task A1).
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
    // Cinematic prompt the image-gen pipeline consumes. 300-2500 chars
    // matches the WOW 8-element + 5-paragraph structure plugins author.
    image_prompt: z.string().min(300).max(2500),
    is_cover: z.boolean(),
    is_cta: z.boolean(),
    // Only meaningful on direct_answer slides; freeform on others.
    direct_answer_block: z.string().min(150).max(600).optional(),
  })
  .superRefine((slide, ctx) => {
    const hasSingle = !!slide.copy;
    const hasBilingual = !!(slide.copy_id && slide.copy_en);

    if (!hasSingle && !hasBilingual) {
      ctx.addIssue({
        code: 'custom',
        message: 'slide must have copy OR (copy_id + copy_en)',
        path: ['copy'],
      });
    }
    if (hasSingle && hasBilingual) {
      ctx.addIssue({
        code: 'custom',
        message: 'slide cannot mix single + bilingual copy',
        path: ['copy'],
      });
    }
  });

export type CarouselSlide = z.infer<typeof CarouselSlideSchema>;

// ---------------------------------------------------------------------------
// Output schema (the full stdout JSON)
// ---------------------------------------------------------------------------

export const CarouselGenOutputSchema = z
  .object({
    status: z.enum(['complete', 'failed']),
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
    generated_at: z.string().datetime(),
  })
  .superRefine((output, ctx) => {
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
