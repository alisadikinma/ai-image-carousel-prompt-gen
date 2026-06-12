/**
 * refs-content.test.ts — content guard for the carousel-gen reference docs.
 *
 * These reference markdown files ARE the pipeline-mode contract: they get
 * concatenated into `references/compiled/refs-carousel-gen-pipeline.md` via
 * `npm run compile-refs` and injected into Sonnet's system prompt. Drift or
 * regressions in the load-bearing rules silently degrade generation quality
 * with no schema-level signal.
 *
 * v3.0.0 (Spotlight Portrait blue rebrand): the v2.20→v2.25 MAX-chaos absurdist
 * hook machinery + topic-costume switching is RETIRED. The new default is the
 * "Spotlight Portrait" template — a calm credible creator portrait + ≥3 floating
 * topic UI elements on a solid blue `#0F59B6` base, with a single signature
 * smart-casual outfit. This test pins the new anchors so the rebrand cannot be
 * accidentally reverted, and asserts the absurdist anchors are gone from the
 * active rules.
 *
 * Test framework: Vitest. No LLM inference — pure string assertions, runs in ms.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const REF = (name: string) => resolve(REPO_ROOT, 'references', name);

const read = (path: string) => readFileSync(path, 'utf8');

// ---------------------------------------------------------------------------
// global-config.md — blue base + cool-neutral grade + bilingual chrome + CTA
// ---------------------------------------------------------------------------

describe('global-config.md — blue base + cool-neutral grade + chrome (v3.0)', () => {
  const text = read(REF('global-config.md'));

  it('defines the solid blue base token #0F59B6', () => {
    expect(text).toMatch(/#0F59B6/i);
    expect(text).toMatch(/background_base/);
  });

  it('color_grade is cool-neutral + gold rim, not warm golden amber', () => {
    expect(text).toMatch(/cool-neutral/i);
    expect(text).toMatch(/gold rim/i);
    // The old warm-amber grade must no longer be the active value.
    expect(text).not.toContain('Warm golden amber');
  });

  it('carries bilingual chrome (top-bar swipe pill + CTA pill text)', () => {
    expect(text).toMatch(/GESER/);
    expect(text).toMatch(/cta_pill_text/);
  });

  it('defines the CTA deepened-navy background + engagement actions', () => {
    expect(text).toMatch(/cta_background/);
    expect(text).toMatch(/navy/i);
    expect(text).toMatch(/cta_engagement_actions/);
    expect(text).toMatch(/save/i);
    expect(text).toMatch(/comment/i);
    expect(text).toMatch(/share/i);
  });
});

// ---------------------------------------------------------------------------
// non-interactive-defaults.md — Spotlight Portrait resolution (v3.0)
// ---------------------------------------------------------------------------

describe('non-interactive-defaults.md — spotlight portrait resolution (v3.0)', () => {
  const text = read(REF('non-interactive-defaults.md'));

  it('cover mood-row resolves to the Spotlight Portrait template (no absurd scene)', () => {
    const coverRow = text
      .split('\n')
      .find((l) => l.includes('`cover`') && l.includes('|'));
    expect(coverRow, 'cover mood-row not found in §3 table').toBeTruthy();
    expect(coverRow!).toContain('Spotlight Portrait');
    expect(coverRow!).not.toContain('resolved absurd');
  });

  it('the absurdist anchors are gone from the whole file', () => {
    expect(text).not.toContain('resolved absurd');
    expect(text).not.toMatch(/MAX absurdist chaos/i);
    expect(text).not.toContain('Memory Architect');
  });

  it('§5 carries the floating-element hard rule (≥3 floating topic elements)', () => {
    expect(text).toMatch(
      /(?:≥|>=|at least|minimum|min\.?)\s*3\s*floating|floating[^.\n]*(?:≥|>=|at least|minimum)\s*3/i,
    );
  });

  it('§2 costume chain resolves to the signature outfit (no topic-keyword table)', () => {
    expect(text).toMatch(/signature (outfit|smart-casual)/i);
    expect(text).not.toContain('Topic Keyword → Category Resolution Table');
  });
});

// ---------------------------------------------------------------------------
// hook-visual-library.md — Spotlight Portrait template + floating spec (v3.0)
// ---------------------------------------------------------------------------

describe('hook-visual-library.md — spotlight portrait template (v3.0)', () => {
  const text = read(REF('hook-visual-library.md'));

  it('defines the Spotlight Portrait template + floating topic elements spec', () => {
    expect(text).toContain('Spotlight Portrait');
    expect(text).toMatch(/floating (topic )?elements?/i);
  });

  it('defines the signature smart-casual outfit as the default wardrobe', () => {
    expect(text).toMatch(/signature (outfit|smart-casual)/i);
  });

  it('retires topic-costume switching (no Topic Keyword Resolution Table, no archetypes)', () => {
    expect(text).not.toContain('Topic Keyword → Category Resolution Table');
    expect(text).not.toContain('Memory Architect');
    expect(text).not.toContain('Concept Avatar');
  });
});

// ---------------------------------------------------------------------------
// SKILL.md — Rule #17/#18 template gate + signature outfit + CTA action variant
// ---------------------------------------------------------------------------

describe('SKILL.md — spotlight template gate + signature outfit (v3.0)', () => {
  const text = read(resolve(REPO_ROOT, 'skills', 'carousel-gen', 'SKILL.md'));

  it('Rule #17 is the Spotlight Portrait template gate (floating ≥3)', () => {
    expect(text).toMatch(/Spotlight Portrait template gate/i);
    expect(text).toMatch(/floating/i);
  });

  it('the absurdist mandate is gone (no generic-studio AUTO-FAIL, no Concept Avatar)', () => {
    expect(text).not.toMatch(/generic-studio/i);
    expect(text).not.toContain('Concept Avatar');
  });

  it('Cover Self-Check Gate still logs cover_gate and checks floating elements', () => {
    expect(text).toContain('Cover Self-Check Gate');
    expect(text).toContain('cover_gate');
    expect(text).toMatch(/floating/i);
  });

  it('Rule #18 routes the creator to the signature outfit (topic via floating)', () => {
    expect(text).toMatch(/signature (outfit|smart-casual)/i);
  });

  it('CTA rule enforces exactly ONE mencolok command and bans stacking two', () => {
    expect(text).toMatch(/exactly ONE command/i);
    expect(text).toMatch(/mencolok/i);
    expect(text).toMatch(/NEVER stack two/i);
    // The old multi-command ask must be gone from the active rule.
    expect(text).not.toMatch(/prioritizes \*\*Save \+ Comment \+ Share\*\*/i);
    expect(text).toMatch(/comment-to-DM[^.]*defer|defer[^.]*comment-to-DM/i);
  });
});

// ---------------------------------------------------------------------------
// prompt-formulas.md + creator-bible.md — layout rules + wardrobe (v3.0)
// ---------------------------------------------------------------------------

describe('prompt-formulas.md — spotlight layout rules (v3.0)', () => {
  const text = read(REF('prompt-formulas.md'));

  it('documents the top-bar pill + floating elements + CTA pill + blue base layout', () => {
    expect(text).toMatch(/top-bar pill|top bar pill/i);
    expect(text).toMatch(/floating (topic )?elements?/i);
    expect(text).toMatch(/CTA pill/i);
    expect(text).toMatch(/#0F59B6/i);
  });

  it('documents the CTA creator gesture + mini value-recap floating', () => {
    expect(text).toMatch(/mini value-recap/i);
    expect(text).toMatch(/open-palm|pointing|join me/i);
  });
});

describe('creator-bible.md — signature outfit default (v3.0)', () => {
  const text = read(REF('creator-bible.md'));

  it('defines the signature smart-casual outfit as the single wardrobe default', () => {
    expect(text).toMatch(/signature (outfit|smart-casual)/i);
  });

  it('drops topic-keyword costume switching as the active rule', () => {
    expect(text).not.toContain('Topic Keyword → Category Resolution Table');
  });
});

// ---------------------------------------------------------------------------
// compiled pipeline bundle — propagation guard (v3.0)
// ---------------------------------------------------------------------------

describe('compiled pipeline bundle — propagation guard (v3.0)', () => {
  const bundlePath = resolve(
    REPO_ROOT,
    'references',
    'compiled',
    'refs-carousel-gen-pipeline.md',
  );

  it('IF the bundle exists, it carries the Spotlight Portrait rules, not the absurdist ones', () => {
    if (!existsSync(bundlePath)) {
      // Bundle is gitignored/regenerated; skip when absent (CI without build step).
      return;
    }
    const bundle = read(bundlePath);
    expect(bundle).toContain('Spotlight Portrait');
    expect(bundle).toMatch(/floating/i);
    expect(bundle).not.toContain('Memory Architect');
    expect(bundle).not.toContain('resolved absurd');
  });
});

// ---------------------------------------------------------------------------
// global-config.md — text-overlay purity + opacity-leak removal + single CTA (v3.0.4)
// ---------------------------------------------------------------------------

describe('global-config.md — text-overlay purity + single CTA (v3.0.4)', () => {
  const text = read(REF('global-config.md'));

  it('carries the TEXT-OVERLAY PURITY hard rule (no labels/font/grade words in renders)', () => {
    expect(text).toMatch(/TEXT-OVERLAY PURITY/i);
    expect(text).toMatch(/CTA Headline/); // forbidden-label example
    expect(text).toMatch(/soft artistry and depth/i); // forbidden grade-adjective example
  });

  it('subtitle rule names the literal-translation requirement (no style-word leak)', () => {
    expect(text).toMatch(/actual English translation of the headline/i);
  });

  it('no "thirty percent opacity" prompt-body phrase remains (it rendered as "30%")', () => {
    // The phrase may only survive inside an explicit NEVER-draw negative directive.
    const offending = text
      .split('\n')
      .filter((l) => /thirty percent/i.test(l))
      // Drop negative directives AND lines that merely quote it as a forbidden literal.
      .filter((l) => !/NEVER|never draw|forbidden|do not draw|not draw/i.test(l))
      .filter((l) => !/"thirty percent"/i.test(l));
    expect(offending).toEqual([]);
  });

  it('cta_engagement_actions is exactly ONE mencolok command, not stacked', () => {
    expect(text).toMatch(/Exactly ONE command per CTA slide/i);
    expect(text).toMatch(/mencolok/i);
    expect(text).not.toMatch(/`cta_engagement_actions`[^|]*\*\*Save \+ Comment \+ Share\*\*/);
  });
});

// ---------------------------------------------------------------------------
// version-sync guard — package.json === plugin.json === 3.0.4
// ---------------------------------------------------------------------------

describe('version sync — package.json === plugin.json === 3.0.4', () => {
  it('all version sources are pinned at 3.0.4', () => {
    const pkg = JSON.parse(read(resolve(REPO_ROOT, 'package.json'))) as {
      version: string;
    };
    const plugin = JSON.parse(
      read(resolve(REPO_ROOT, '.claude-plugin', 'plugin.json')),
    ) as { version: string };
    expect(pkg.version).toBe('3.0.4');
    expect(plugin.version).toBe('3.0.4');
  });
});
