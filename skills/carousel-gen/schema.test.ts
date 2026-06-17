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
  CreatorOutfitSchema,
  type CarouselGenOutput,
  type CompleteCarouselOutput,
  type CreatorOutfit,
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
  const filler =
    ' Cinematic mid-shot, golden hour rim light, 35mm anamorphic, shallow depth of field, dust particles drifting through the beam, hyperrealistic skin texture, no AI sheen, photographed not rendered.';
  let out = seed;
  while (out.length < 300) {
    out += filler;
  }
  return out.slice(0, 1200);
}

function makeValidDirectAnswerBlock(): string {
  return (
    'The shortest path to a high-converting carousel is a tight 5-act spine: cover hooks the scroll-stop, three body slides hammer one tension each, the human fingerprint slide grounds it in lived experience, and the CTA closes a single specific loop. Skip any act and dwell time collapses.'
  );
}

/**
 * Build a 9-slide bilingual carousel with the canonical narrative beats:
 *   slide 1 = cover, slide 4 = human_fingerprint, slide 8 = direct_answer,
 *   slide 9 = cta. Slides 2/3/5/6/7 = body.
 */
function buildValidBilingualOutput(): CompleteCarouselOutput {
  const layouts: Array<CompleteCarouselOutput['slides'][number]['layout_hint']> = [
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

/**
 * Build a 9-slide single-language carousel (English only via `copy` field).
 * Mirror of buildValidBilingualOutput but with single-language mode toggle.
 */
function buildValidSingleLanguageOutput(): CompleteCarouselOutput {
  const layouts: Array<CompleteCarouselOutput['slides'][number]['layout_hint']> = [
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
      copy: `Slide ${slideNumber} content for layout=${layout}.`,
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
    bilingual: false,
    narrative: '5act',
    slides,
    generated_at: '2026-04-28T00:00:00.000Z',
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('CarouselGenOutputSchema — complete envelope', () => {
  it('parses a 9-slide bilingual 5act carousel with all narrative beats', () => {
    const input = buildValidBilingualOutput();
    const parsed = CarouselGenOutputSchema.parse(input);

    if (parsed.status !== 'complete') {
      throw new Error('expected complete envelope');
    }
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
    parsed.slides.forEach((s) => {
      expect(s.copy_id).toBeTruthy();
      expect(s.copy_en).toBeTruthy();
      expect(s.copy).toBeUndefined();
    });
  });

  it('parses a 9-slide single-language carousel (copy without copy_id/copy_en)', () => {
    const input = buildValidSingleLanguageOutput();
    const parsed = CarouselGenOutputSchema.parse(input);

    if (parsed.status !== 'complete') {
      throw new Error('expected complete envelope');
    }
    expect(parsed.bilingual).toBe(false);
    expect(parsed.slides).toHaveLength(9);
    parsed.slides.forEach((s) => {
      expect(s.copy).toBeTruthy();
      expect(s.copy_id).toBeUndefined();
      expect(s.copy_en).toBeUndefined();
    });
  });

  it('rejects a slide that mixes single + bilingual copy modes', () => {
    const input = buildValidBilingualOutput();
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

  it('rejects partial bilingual (copy_id without copy_en)', () => {
    const input = buildValidBilingualOutput();
    const mutated = {
      ...input,
      slides: input.slides.map((s, i) =>
        // Slide 2: drop copy_en, keep copy_id. Realistic LLM truncation pattern.
        i === 1 ? { ...s, copy_en: undefined } : s,
      ),
    };

    expect(() => CarouselGenOutputSchema.parse(mutated)).toThrow(ZodError);
    try {
      CarouselGenOutputSchema.parse(mutated);
    } catch (err) {
      const zerr = err as ZodError;
      const messages = zerr.issues.map((i) => i.message).join(' | ');
      expect(messages).toMatch(/bilingual mode requires BOTH copy_id and copy_en/);
      // Path should target the missing side.
      const partialIssues = zerr.issues.filter((i) =>
        i.message.includes('bilingual mode requires'),
      );
      expect(partialIssues.length).toBeGreaterThan(0);
      expect(partialIssues[0].path.join('.')).toMatch(/copy_en$/);
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
      const layoutIssues = zerr.issues.filter(
        (i) => i.path.join('.') === 'slides.2.layout_hint',
      );
      expect(layoutIssues.length).toBeGreaterThan(0);
      expect(layoutIssues[0].code).toBe('invalid_enum_value');
    }
  });

  it('enforces direct_answer_block length bounds (150-600 chars)', () => {
    const input = buildValidBilingualOutput();

    const tooShort = {
      ...input,
      slides: input.slides.map((s, i) =>
        i === 7 ? { ...s, direct_answer_block: 'a'.repeat(50) } : s,
      ),
    };
    expect(() => CarouselGenOutputSchema.parse(tooShort)).toThrow(ZodError);

    const tooLong = {
      ...input,
      slides: input.slides.map((s, i) =>
        i === 7 ? { ...s, direct_answer_block: 'a'.repeat(700) } : s,
      ),
    };
    expect(() => CarouselGenOutputSchema.parse(tooLong)).toThrow(ZodError);
  });

  it('rejects direct_answer_block on a non-direct_answer layout slide', () => {
    const input = buildValidBilingualOutput();
    // Slide 5 is layout=body — a direct_answer_block here is invalid.
    const mutated = {
      ...input,
      slides: input.slides.map((s, i) =>
        i === 4
          ? { ...s, direct_answer_block: makeValidDirectAnswerBlock() }
          : s,
      ),
    };

    expect(() => CarouselGenOutputSchema.parse(mutated)).toThrow(ZodError);
    try {
      CarouselGenOutputSchema.parse(mutated);
    } catch (err) {
      const zerr = err as ZodError;
      const layoutIssues = zerr.issues.filter((i) =>
        i.message.includes('direct_answer_block is only valid'),
      );
      expect(layoutIssues.length).toBeGreaterThan(0);
      expect(layoutIssues[0].path).toContain('direct_answer_block');
    }
  });

  it('rejects when total_slides does not equal slides.length', () => {
    const input = buildValidBilingualOutput();
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

  it('rejects when slide 1 has is_cover=false even with layout_hint=cover', () => {
    const input = buildValidBilingualOutput();
    const mutated = {
      ...input,
      slides: input.slides.map((s, i) =>
        // Single-field mutation: keep layout_hint=cover but flip is_cover to false.
        i === 0 ? { ...s, is_cover: false } : s,
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

  it('rejects when slide 1 has layout_hint!=cover even with is_cover=true', () => {
    const input = buildValidBilingualOutput();
    const mutated = {
      ...input,
      slides: input.slides.map((s, i) =>
        // Single-field mutation: keep is_cover=true but flip layout_hint to body.
        i === 0 ? { ...s, layout_hint: 'body' as const } : s,
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

  it('rejects when last slide has is_cta=false even with layout_hint=cta', () => {
    const input = buildValidBilingualOutput();
    const lastIdx = input.slides.length - 1;
    const mutated = {
      ...input,
      slides: input.slides.map((s, i) =>
        // Single-field mutation: keep layout_hint=cta but flip is_cta to false.
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

  it('rejects when last slide has layout_hint!=cta even with is_cta=true', () => {
    const input = buildValidBilingualOutput();
    const lastIdx = input.slides.length - 1;
    const mutated = {
      ...input,
      slides: input.slides.map((s, i) =>
        // Single-field mutation: keep is_cta=true but flip layout_hint to body.
        i === lastIdx ? { ...s, layout_hint: 'body' as const, is_cta: true } : s,
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

describe('CarouselGenOutputSchema — failed envelope', () => {
  it('parses a minimal failed envelope without slides', () => {
    const input = {
      status: 'failed' as const,
      format: 'carousel' as const,
      error: 'LLM quota exhausted mid-generation',
      generated_at: '2026-04-28T00:00:00.000Z',
    };

    const parsed = CarouselGenOutputSchema.parse(input);
    if (parsed.status !== 'failed') {
      throw new Error('expected failed envelope');
    }
    expect(parsed.error).toBe('LLM quota exhausted mid-generation');
    expect(parsed.slides).toBeUndefined();
  });

  it('parses a failed envelope without an error message', () => {
    const input = {
      status: 'failed' as const,
      format: 'carousel' as const,
      generated_at: '2026-04-28T00:00:00.000Z',
    };

    const parsed = CarouselGenOutputSchema.parse(input);
    if (parsed.status !== 'failed') {
      throw new Error('expected failed envelope');
    }
    expect(parsed.error).toBeUndefined();
    expect(parsed.slides).toBeUndefined();
  });

  it('parses a failed envelope with partial slides (LLM gave up mid-stream)', () => {
    const input = {
      status: 'failed' as const,
      format: 'carousel' as const,
      error: 'truncation',
      generated_at: '2026-04-28T00:00:00.000Z',
      slides: [
        {
          slide_number: 1,
          layout_hint: 'cover' as const,
          copy_id: 'partial id',
          copy_en: 'partial en',
          image_prompt: makePrompt('partial cover'),
          is_cover: true,
          is_cta: false,
        },
        {
          slide_number: 2,
          layout_hint: 'body' as const,
          copy_id: 'partial body id',
          copy_en: 'partial body en',
          image_prompt: makePrompt('partial body'),
          is_cover: false,
          is_cta: false,
        },
      ],
    };

    const parsed = CarouselGenOutputSchema.parse(input);
    if (parsed.status !== 'failed') {
      throw new Error('expected failed envelope');
    }
    expect(parsed.slides).toHaveLength(2);
  });
});

describe('CarouselGenOutputSchema — notes field for pipeline-mode warnings', () => {
  it('preserves notes array on complete envelope', () => {
    const input = {
      ...buildValidBilingualOutput(),
      notes: [
        'manifest_brand_needed: brand asset upload required for [topic]',
        'default_wardrobe_applied: charcoal henley chosen per creator-bible §6',
      ],
    };
    const parsed = CarouselGenOutputSchema.parse(input);
    if (parsed.status !== 'complete') {
      throw new Error('expected complete envelope');
    }
    expect(parsed.notes).toHaveLength(2);
    expect(parsed.notes?.[0]).toMatch(/manifest_brand_needed/);
  });

  it('preserves notes array on failed envelope', () => {
    const input = {
      status: 'failed' as const,
      format: 'carousel' as const,
      error: 'LLM timeout',
      notes: ['research_expansion_skipped: angles auto-selected'],
      generated_at: '2026-04-28T00:00:00.000Z',
    };
    const parsed = CarouselGenOutputSchema.parse(input);
    if (parsed.status !== 'failed') {
      throw new Error('expected failed envelope');
    }
    expect(parsed.notes).toHaveLength(1);
  });
});

describe('CarouselGenOutputSchema — creator_outfit field', () => {
  function makeValidOutfit(): CreatorOutfit {
    return {
      category: 'Medical',
      prompt_phrase:
        'wearing a clean white surgical scrub top with a stethoscope draped around the neck',
      source: 'topic_match',
      reasoning:
        "Topic mentions 'surgeon' and 'operating room' — matched the medical wardrobe entry in creator-bible §6.2.",
    };
  }

  it('accepts valid creator_outfit on complete envelope', () => {
    const input = {
      ...buildValidBilingualOutput(),
      creator_outfit: makeValidOutfit(),
    };
    const parsed = CarouselGenOutputSchema.parse(input);
    if (parsed.status !== 'complete') {
      throw new Error('expected complete envelope');
    }
    expect(parsed.creator_outfit).toBeDefined();
    expect(parsed.creator_outfit?.category).toBe('Medical');
    expect(parsed.creator_outfit?.source).toBe('topic_match');
    expect(parsed.creator_outfit?.prompt_phrase).toMatch(/surgical scrub/);
    expect(parsed.creator_outfit?.reasoning).toMatch(/surgeon/);
  });

  it('accepts complete envelope WITHOUT creator_outfit (backward compat)', () => {
    const input = buildValidBilingualOutput();
    // Sanity: ensure fixture builder does not include creator_outfit, so this
    // test asserts the optional path rather than coincidentally passing.
    expect((input as Record<string, unknown>).creator_outfit).toBeUndefined();

    const parsed = CarouselGenOutputSchema.parse(input);
    if (parsed.status !== 'complete') {
      throw new Error('expected complete envelope');
    }
    expect(parsed.creator_outfit).toBeUndefined();
  });

  it('rejects creator_outfit with invalid source enum', () => {
    const input = {
      ...buildValidBilingualOutput(),
      creator_outfit: {
        ...makeValidOutfit(),
        source: 'random_string',
      },
    };

    expect(() => CarouselGenOutputSchema.parse(input)).toThrow(ZodError);
    try {
      CarouselGenOutputSchema.parse(input);
    } catch (err) {
      const zerr = err as ZodError;
      const sourceIssues = zerr.issues.filter(
        (i) => i.path.join('.') === 'creator_outfit.source',
      );
      expect(sourceIssues.length).toBeGreaterThan(0);
      expect(sourceIssues[0].code).toBe('invalid_enum_value');
    }
  });

  it('rejects creator_outfit with category too short', () => {
    const input = {
      ...buildValidBilingualOutput(),
      creator_outfit: {
        ...makeValidOutfit(),
        category: 'A',
      },
    };

    expect(() => CarouselGenOutputSchema.parse(input)).toThrow(ZodError);
    try {
      CarouselGenOutputSchema.parse(input);
    } catch (err) {
      const zerr = err as ZodError;
      const categoryIssues = zerr.issues.filter(
        (i) => i.path.join('.') === 'creator_outfit.category',
      );
      expect(categoryIssues.length).toBeGreaterThan(0);
      expect(categoryIssues[0].code).toBe('too_small');
    }
  });

  it('rejects creator_outfit with reasoning too short', () => {
    const input = {
      ...buildValidBilingualOutput(),
      creator_outfit: {
        ...makeValidOutfit(),
        reasoning: 'short',
      },
    };

    expect(() => CarouselGenOutputSchema.parse(input)).toThrow(ZodError);
    try {
      CarouselGenOutputSchema.parse(input);
    } catch (err) {
      const zerr = err as ZodError;
      const reasoningIssues = zerr.issues.filter(
        (i) => i.path.join('.') === 'creator_outfit.reasoning',
      );
      expect(reasoningIssues.length).toBeGreaterThan(0);
      expect(reasoningIssues[0].code).toBe('too_small');
    }
  });

  it('rejects creator_outfit with prompt_phrase too short', () => {
    const input = {
      ...buildValidBilingualOutput(),
      creator_outfit: {
        ...makeValidOutfit(),
        prompt_phrase: 'short',
      },
    };

    expect(() => CarouselGenOutputSchema.parse(input)).toThrow(ZodError);
    try {
      CarouselGenOutputSchema.parse(input);
    } catch (err) {
      const zerr = err as ZodError;
      const promptIssues = zerr.issues.filter(
        (i) => i.path.join('.') === 'creator_outfit.prompt_phrase',
      );
      expect(promptIssues.length).toBeGreaterThan(0);
      expect(promptIssues[0].code).toBe('too_small');
    }
  });

  it("accepts source='signature' (v3 Spotlight Portrait default)", () => {
    const input = {
      ...buildValidBilingualOutput(),
      creator_outfit: {
        category: 'Signature smart-casual',
        prompt_phrase:
          'wearing the signature smart-casual outfit — a dark neutral tee under an unstructured slate-toned blazer, clean dark trousers',
        source: 'signature' as const,
        reasoning:
          'v3 default — topic conveyed by the floating topic elements, costume stays signature.',
      },
    };
    const parsed = CarouselGenOutputSchema.parse(input);
    if (parsed.status !== 'complete') {
      throw new Error('expected complete envelope');
    }
    expect(parsed.creator_outfit?.source).toBe('signature');
  });

  it("accepts source='locale_override' (topic defined by a country/culture)", () => {
    const input = {
      ...buildValidBilingualOutput(),
      creator_outfit: {
        category: 'Indian traditional (modern kurta)',
        prompt_phrase:
          'wearing a tailored modern kurta in a neutral tone, credible and approachable, consistent across every slide',
        source: 'locale_override' as const,
        reasoning:
          'topic is fundamentally about India — AI training jobs paid in rupees; locale defines the deck.',
      },
    };
    const parsed = CarouselGenOutputSchema.parse(input);
    if (parsed.status !== 'complete') {
      throw new Error('expected complete envelope');
    }
    expect(parsed.creator_outfit?.source).toBe('locale_override');
  });

  it('still accepts legacy source=topic_match (backward compat with pre-v3 drafts)', () => {
    const input = {
      ...buildValidBilingualOutput(),
      creator_outfit: makeValidOutfit(),
    };
    const parsed = CarouselGenOutputSchema.parse(input);
    if (parsed.status !== 'complete') {
      throw new Error('expected complete envelope');
    }
    expect(parsed.creator_outfit?.source).toBe('topic_match');
  });

  it('CreatorOutfitSchema standalone — exports correctly + parses minimal valid object', () => {
    expect(CreatorOutfitSchema).toBeDefined();
    const minimal: CreatorOutfit = {
      category: 'IT',
      prompt_phrase:
        'wearing a charcoal henley shirt with rolled-up sleeves over dark denim',
      source: 'fallback',
      reasoning: 'No topic match found; default wardrobe applied per bible §6.',
    };
    const parsed = CreatorOutfitSchema.parse(minimal);
    expect(parsed.category).toBe('IT');
    expect(parsed.source).toBe('fallback');
    expect(parsed.prompt_phrase).toMatch(/charcoal henley/);
    expect(parsed.reasoning).toMatch(/default wardrobe/);
  });
});

describe('CarouselSlideSchema — people_spotlight contract (needs_real_faces)', () => {
  it('accepts a profile slide flagged needs_real_faces with people[] + face_layout', () => {
    const input = buildValidBilingualOutput();
    // Slide 2 (index 1) is a "SIAPA <Name>?" profile slide depicting a real person.
    const mutated = {
      ...input,
      slides: input.slides.map((s, i) =>
        i === 1
          ? {
              ...s,
              needs_real_faces: true,
              people: [{ name: 'Ashish Vaswani', role: 'lead author' }],
              face_layout: 'photo_band_top' as const,
            }
          : s,
      ),
    };

    const parsed = CarouselGenOutputSchema.parse(mutated);
    if (parsed.status !== 'complete') {
      throw new Error('expected complete envelope');
    }
    expect(parsed.slides[1].needs_real_faces).toBe(true);
    expect(parsed.slides[1].people).toHaveLength(1);
    expect(parsed.slides[1].people?.[0].name).toBe('Ashish Vaswani');
    expect(parsed.slides[1].people?.[0].role).toBe('lead author');
    expect(parsed.slides[1].face_layout).toBe('photo_band_top');
  });

  it('accepts a group profile slide with multiple people (founders)', () => {
    const input = buildValidBilingualOutput();
    const mutated = {
      ...input,
      slides: input.slides.map((s, i) =>
        i === 2
          ? {
              ...s,
              needs_real_faces: true,
              people: [
                { name: 'Michael Truell' },
                { name: 'Sualeh Asif' },
                { name: 'Arvid Lunnemark' },
                { name: 'Aman Sanger' },
              ],
              face_layout: 'photo_band_top' as const,
            }
          : s,
      ),
    };

    const parsed = CarouselGenOutputSchema.parse(mutated);
    if (parsed.status !== 'complete') {
      throw new Error('expected complete envelope');
    }
    expect(parsed.slides[2].people).toHaveLength(4);
    // role is optional — omitted here.
    expect(parsed.slides[2].people?.[0].role).toBeUndefined();
  });

  it('accepts a legacy slide with NONE of the new fields (backward compat)', () => {
    const input = buildValidBilingualOutput();
    // Sanity: fixture must not already carry the new fields, so this asserts the
    // optional path rather than coincidentally passing.
    input.slides.forEach((s) => {
      expect((s as Record<string, unknown>).needs_real_faces).toBeUndefined();
      expect((s as Record<string, unknown>).people).toBeUndefined();
      expect((s as Record<string, unknown>).face_layout).toBeUndefined();
    });

    const parsed = CarouselGenOutputSchema.parse(input);
    if (parsed.status !== 'complete') {
      throw new Error('expected complete envelope');
    }
    expect(parsed.slides[1].needs_real_faces).toBeUndefined();
    expect(parsed.slides[1].people).toBeUndefined();
  });

  it('rejects needs_real_faces=true with an empty people array', () => {
    const input = buildValidBilingualOutput();
    const mutated = {
      ...input,
      slides: input.slides.map((s, i) =>
        i === 1
          ? { ...s, needs_real_faces: true, people: [], face_layout: 'photo_band_top' as const }
          : s,
      ),
    };

    expect(() => CarouselGenOutputSchema.parse(mutated)).toThrow(ZodError);
    try {
      CarouselGenOutputSchema.parse(mutated);
    } catch (err) {
      const zerr = err as ZodError;
      const messages = zerr.issues.map((i) => i.message).join(' | ');
      expect(messages).toMatch(/needs_real_faces requires at least one entry in people/);
    }
  });

  it('rejects needs_real_faces=true with people omitted entirely', () => {
    const input = buildValidBilingualOutput();
    const mutated = {
      ...input,
      slides: input.slides.map((s, i) =>
        i === 1 ? { ...s, needs_real_faces: true, face_layout: 'photo_band_top' as const } : s,
      ),
    };

    expect(() => CarouselGenOutputSchema.parse(mutated)).toThrow(ZodError);
  });

  it("rejects needs_real_faces=true with face_layout='none'", () => {
    const input = buildValidBilingualOutput();
    const mutated = {
      ...input,
      slides: input.slides.map((s, i) =>
        i === 1
          ? {
              ...s,
              needs_real_faces: true,
              people: [{ name: 'Ashish Vaswani' }],
              face_layout: 'none' as const,
            }
          : s,
      ),
    };

    expect(() => CarouselGenOutputSchema.parse(mutated)).toThrow(ZodError);
    try {
      CarouselGenOutputSchema.parse(mutated);
    } catch (err) {
      const zerr = err as ZodError;
      const messages = zerr.issues.map((i) => i.message).join(' | ');
      expect(messages).toMatch(/needs_real_faces requires a face_layout other than 'none'/);
    }
  });

  it('rejects a person entry with a name shorter than 2 chars', () => {
    const input = buildValidBilingualOutput();
    const mutated = {
      ...input,
      slides: input.slides.map((s, i) =>
        i === 1
          ? {
              ...s,
              needs_real_faces: true,
              people: [{ name: 'A' }],
              face_layout: 'photo_band_top' as const,
            }
          : s,
      ),
    };

    expect(() => CarouselGenOutputSchema.parse(mutated)).toThrow(ZodError);
  });
});

describe('CarouselGenOutputSchema — type narrowing', () => {
  it('narrows to CompleteCarouselOutput when status=complete', () => {
    const input = buildValidBilingualOutput();
    const parsed: CarouselGenOutput = CarouselGenOutputSchema.parse(input);

    if (parsed.status === 'complete') {
      // Type narrowing should expose `slides` array as required (non-optional).
      const firstSlide = parsed.slides[0];
      expect(firstSlide.slide_number).toBe(1);
    } else {
      throw new Error('expected complete envelope');
    }
  });
});
