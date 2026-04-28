/**
 * schema.test.ts — Zod contract tests for /carousel-gen output.
 *
 * The schema is the contract between this plugin's output and the
 * Portfolio_v2 backend's CarouselGenOutputAdapter. Any drift here breaks
 * downstream consumers. Cover both happy path and rejection paths.
 *
 * Test framework: Vitest (matches sister plugin linkedin-post-writer's setup).
 * No LLM inference — pure schema validation, runs in ms.
 */

import { describe, it, expect } from 'vitest';
import { ZodError } from 'zod';

import {
  CarouselGenOutputSchema,
  type CarouselGenOutput,
} from './schema.js';

// ---------------------------------------------------------------------------
// Fixture builders — keep test cases compact and intent-revealing.
// ---------------------------------------------------------------------------

/**
 * Build a 300-char minimum image_prompt string to satisfy the schema's
 * `image_prompt: z.string().min(300).max(2500)` constraint without bloating
 * test fixtures with cinematic prose.
 */
function makePrompt(seed: string): string {
  // 300 chars min — pad seed with deterministic filler so tests stay readable.
  const filler =
    ' Cinematic mid-shot, golden hour rim light, 35mm anamorphic, shallow depth of field, dust particles drifting through the beam, hyperrealistic skin texture, no AI sheen, photographed not rendered.';
  let out = seed;
  while (out.length < 300) {
    out += filler;
  }
  return out.slice(0, 1200);
}

function makeValidDirectAnswerBlock(): string {
  // 150-600 chars. Aim for ~250.
  return (
    'The shortest path to a high-converting carousel is a tight 5-act spine: cover hooks the scroll-stop, three body slides hammer one tension each, the human fingerprint slide grounds it in lived experience, and the CTA closes a single specific loop. Skip any act and dwell time collapses.'
  );
}

/**
 * Build a 9-slide bilingual carousel with the canonical narrative beats
 * the plan describes:
 *   slide 1 = cover, slide 4 = human_fingerprint, slide 8 = direct_answer,
 *   slide 9 = cta. Slides 2/3/5/6/7 = body.
 */
function buildValidBilingualOutput(): CarouselGenOutput {
  const layouts: Array<CarouselGenOutput['slides'][number]['layout_hint']> = [
    'cover',
    'body',
    'body',
    'human_fingerprint',
    'body',
    'body',
    'body',
    'direct_answer',
    'cta',
  ];

  const slides = layouts.map((layout, idx) => {
    const slideNumber = idx + 1;
    const isCover = layout === 'cover';
    const isCta = layout === 'cta';
    const base = {
      slide_number: slideNumber,
      layout_hint: layout,
      copy_id: `Slide ${slideNumber} dalam Bahasa Indonesia.`,
      copy_en: `Slide ${slideNumber} in English.`,
      image_prompt: makePrompt(`slide ${slideNumber} ${layout} prompt seed.`),
      is_cover: isCover,
      is_cta: isCta,
    };
    if (layout === 'direct_answer') {
      return { ...base, direct_answer_block: makeValidDirectAnswerBlock() };
    }
    return base;
  });

  return {
    status: 'complete',
    format: 'carousel',
    total_slides: 9,
    aspect_ratio: '4:5',
    bilingual: true,
    narrative: '5act',
    slides,
    generated_at: '2026-04-28T00:00:00.000Z',
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('CarouselGenOutputSchema', () => {
  it('parses a 9-slide bilingual 5act carousel with all narrative beats', () => {
    const input = buildValidBilingualOutput();
    const parsed = CarouselGenOutputSchema.parse(input);

    expect(parsed.bilingual).toBe(true);
    expect(parsed.narrative).toBe('5act');
    expect(parsed.total_slides).toBe(9);
    expect(parsed.slides).toHaveLength(9);
    expect(parsed.slides[0].layout_hint).toBe('cover');
    expect(parsed.slides[0].is_cover).toBe(true);
    expect(parsed.slides[3].layout_hint).toBe('human_fingerprint');
    expect(parsed.slides[7].layout_hint).toBe('direct_answer');
    expect(parsed.slides[7].direct_answer_block).toBeDefined();
    expect(parsed.slides[8].layout_hint).toBe('cta');
    expect(parsed.slides[8].is_cta).toBe(true);
    // Bilingual fields preserved on every slide.
    parsed.slides.forEach((s) => {
      expect(s.copy_id).toBeTruthy();
      expect(s.copy_en).toBeTruthy();
      expect(s.copy).toBeUndefined();
    });
  });

  it('rejects a slide that mixes single + bilingual copy modes', () => {
    const input = buildValidBilingualOutput();
    // Corrupt slide 2: set both `copy` AND retain `copy_id`/`copy_en`.
    const mutated = {
      ...input,
      slides: input.slides.map((s, i) =>
        i === 1 ? { ...s, copy: 'single-language copy that should not coexist' } : s,
      ),
    };

    expect(() => CarouselGenOutputSchema.parse(mutated)).toThrow(ZodError);
    try {
      CarouselGenOutputSchema.parse(mutated);
    } catch (err) {
      const zerr = err as ZodError;
      const messages = zerr.issues.map((i) => i.message).join(' | ');
      expect(messages).toMatch(/cannot mix single \+ bilingual copy/);
    }
  });

  it('rejects a slide with an invalid layout_hint enum value', () => {
    const input = buildValidBilingualOutput();
    const mutated = {
      ...input,
      slides: input.slides.map((s, i) =>
        i === 2 ? { ...s, layout_hint: 'banner' as never } : s,
      ),
    };

    expect(() => CarouselGenOutputSchema.parse(mutated)).toThrow(ZodError);
    try {
      CarouselGenOutputSchema.parse(mutated);
    } catch (err) {
      const zerr = err as ZodError;
      // At least one issue should target the invalid enum on slides[2].layout_hint.
      const layoutIssues = zerr.issues.filter(
        (i) => i.path.join('.') === 'slides.2.layout_hint',
      );
      expect(layoutIssues.length).toBeGreaterThan(0);
      expect(layoutIssues[0].code).toBe('invalid_enum_value');
    }
  });

  it('enforces direct_answer_block length bounds (150-600 chars)', () => {
    const input = buildValidBilingualOutput();

    // Below min — 50 chars.
    const tooShort = {
      ...input,
      slides: input.slides.map((s, i) =>
        i === 7
          ? { ...s, direct_answer_block: 'a'.repeat(50) }
          : s,
      ),
    };
    expect(() => CarouselGenOutputSchema.parse(tooShort)).toThrow(ZodError);

    // Above max — 700 chars.
    const tooLong = {
      ...input,
      slides: input.slides.map((s, i) =>
        i === 7
          ? { ...s, direct_answer_block: 'a'.repeat(700) }
          : s,
      ),
    };
    expect(() => CarouselGenOutputSchema.parse(tooLong)).toThrow(ZodError);
  });

  it('rejects when total_slides does not equal slides.length', () => {
    const input = buildValidBilingualOutput();
    // Claim 10 slides while delivering 9.
    const mutated = { ...input, total_slides: 10 };

    expect(() => CarouselGenOutputSchema.parse(mutated)).toThrow(ZodError);
    try {
      CarouselGenOutputSchema.parse(mutated);
    } catch (err) {
      const zerr = err as ZodError;
      const messages = zerr.issues.map((i) => i.message).join(' | ');
      expect(messages).toMatch(/total_slides .* must equal slides\.length/);
    }
  });

  it('rejects when slide 1 is not cover (wrong is_cover or layout_hint)', () => {
    const input = buildValidBilingualOutput();
    const mutated = {
      ...input,
      slides: input.slides.map((s, i) =>
        i === 0 ? { ...s, is_cover: false, layout_hint: 'body' as const } : s,
      ),
    };

    expect(() => CarouselGenOutputSchema.parse(mutated)).toThrow(ZodError);
    try {
      CarouselGenOutputSchema.parse(mutated);
    } catch (err) {
      const zerr = err as ZodError;
      const messages = zerr.issues.map((i) => i.message).join(' | ');
      expect(messages).toMatch(
        /slide 1 must have is_cover=true and layout_hint=cover/,
      );
    }
  });

  it('rejects when last slide is not cta (is_cta=false)', () => {
    const input = buildValidBilingualOutput();
    const lastIdx = input.slides.length - 1;
    const mutated = {
      ...input,
      slides: input.slides.map((s, i) =>
        i === lastIdx ? { ...s, is_cta: false } : s,
      ),
    };

    expect(() => CarouselGenOutputSchema.parse(mutated)).toThrow(ZodError);
    try {
      CarouselGenOutputSchema.parse(mutated);
    } catch (err) {
      const zerr = err as ZodError;
      const messages = zerr.issues.map((i) => i.message).join(' | ');
      expect(messages).toMatch(
        /last slide must have is_cta=true and layout_hint=cta/,
      );
    }
  });
});
