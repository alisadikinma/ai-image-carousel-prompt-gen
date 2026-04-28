/**
 * golden.test.ts — Golden-file integration test for /carousel-gen pipeline mode.
 *
 * Locks the documented JSON contract that pipeline-mode `/carousel-gen` runs
 * MUST produce when invoked non-interactively against a sample blog input.
 *
 * The fixture `golden/draft28-equivalent.json` is the AUTHORED expected output
 * representing what the skill SHOULD emit — NOT a recorded LLM response.
 * Treat it like a snapshot test: when SKILL.md prompt logic changes in a way
 * that intentionally shifts output shape, regenerate this file deliberately
 * and re-justify each invariant. Drift here breaks the Portfolio_v2 backend's
 * `CarouselGenOutputAdapter` (Phase A4 in the engine-decoupling plan).
 *
 * NOT covered here: actually invoking `claude -p "/carousel-gen ..."`. That's a
 * deployment-time integration test, owned by Phase D2 of the plan.
 *
 * Test framework: Vitest (matches sister test schema.test.ts).
 */

import { describe, it, expect } from 'vitest';

import { CarouselGenOutputSchema } from './schema.js';

// JSON modules with import assertions are stable in Node 20+ ESM. Vitest
// resolves the path relative to this file.
import goldenFixture from './golden/draft28-equivalent.json' with { type: 'json' };

describe('/carousel-gen pipeline mode — golden fixture', () => {
  it('parses cleanly via CarouselGenOutputSchema and narrows to status=complete', () => {
    const parsed = CarouselGenOutputSchema.parse(goldenFixture);
    if (parsed.status !== 'complete') {
      throw new Error('expected complete envelope from golden fixture');
    }
    expect(parsed.format).toBe('carousel');
    expect(parsed.total_slides).toBe(9);
    expect(parsed.slides).toHaveLength(9);
    expect(parsed.bilingual).toBe(true);
    expect(parsed.narrative).toBe('5act');
    expect(parsed.aspect_ratio).toBe('4:5');
  });

  it('carries the 5-act narrative beats: cover + cta + human_fingerprint + direct_answer', () => {
    const parsed = CarouselGenOutputSchema.parse(goldenFixture);
    if (parsed.status !== 'complete') {
      throw new Error('expected complete envelope');
    }

    // Exactly 1 cover, must be slide 1.
    const covers = parsed.slides.filter((s) => s.layout_hint === 'cover');
    expect(covers).toHaveLength(1);
    expect(parsed.slides[0].layout_hint).toBe('cover');
    expect(parsed.slides[0].is_cover).toBe(true);

    // Exactly 1 cta, must be the last slide.
    const ctas = parsed.slides.filter((s) => s.layout_hint === 'cta');
    expect(ctas).toHaveLength(1);
    const lastIdx = parsed.slides.length - 1;
    expect(parsed.slides[lastIdx].layout_hint).toBe('cta');
    expect(parsed.slides[lastIdx].is_cta).toBe(true);

    // At least 1 human_fingerprint slide (the lived-experience anchor).
    const fingerprints = parsed.slides.filter(
      (s) => s.layout_hint === 'human_fingerprint',
    );
    expect(fingerprints.length).toBeGreaterThanOrEqual(1);

    // At least 1 direct_answer slide carrying a non-empty direct_answer_block
    // (the AI-search-optimized PEAK slide).
    const directAnswers = parsed.slides.filter(
      (s) => s.layout_hint === 'direct_answer',
    );
    expect(directAnswers.length).toBeGreaterThanOrEqual(1);
    directAnswers.forEach((s) => {
      expect(s.direct_answer_block).toBeDefined();
      // Schema enforces 150-600 chars on direct_answer_block — match the lower
      // bound here so this test fails loudly if a future fixture edit
      // truncates the block below the schema-enforced floor.
      const blockLength = (s.direct_answer_block ?? '').length;
      expect(blockLength).toBeGreaterThanOrEqual(150);
      expect(blockLength).toBeLessThanOrEqual(600);
    });
  });

  it('honors the bilingual contract: every slide has copy_id + copy_en (no copy)', () => {
    const parsed = CarouselGenOutputSchema.parse(goldenFixture);
    if (parsed.status !== 'complete') {
      throw new Error('expected complete envelope');
    }

    parsed.slides.forEach((slide, idx) => {
      expect(slide.copy_id, `slide ${idx + 1} missing copy_id`).toBeTruthy();
      expect(slide.copy_en, `slide ${idx + 1} missing copy_en`).toBeTruthy();
      expect(
        slide.copy,
        `slide ${idx + 1} should not carry single-language copy in bilingual mode`,
      ).toBeUndefined();
    });
  });
});
