/**
 * refs-content.test.ts — content guard for the carousel-gen reference docs.
 *
 * These reference markdown files ARE the pipeline-mode contract: they get
 * concatenated into `references/compiled/refs-carousel-gen-pipeline.md` via
 * `npm run compile-refs` and injected into Sonnet's system prompt. Drift or
 * regressions in the key rules (scene-first cover, max-chaos intensity,
 * conceptual costume archetypes, cover self-check gate) silently degrade
 * generation quality with no schema-level signal. This test asserts the
 * load-bearing anchors exist so the v2.25 "scene-first / topic-immersive
 * costume" rules cannot be accidentally reverted.
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

describe('non-interactive-defaults.md — scene-first cover + max-chaos (v2.25)', () => {
  const text = read(REF('non-interactive-defaults.md'));

  it('cover mood-row defers to the resolved absurd scene (no warm-studio default)', () => {
    // The `cover` row in the §3 mood→setting table must point at the resolved
    // §5 absurd scene, not a fixed warm studio.
    const coverRow = text
      .split('\n')
      .find((l) => l.includes('`cover`') && l.includes('|'));
    expect(coverRow, 'cover mood-row not found in §3 table').toBeTruthy();
    expect(coverRow!).toContain('resolved absurd');
    // The old hard-coded Edison-bulb studio must no longer be the cover default.
    expect(coverRow!).not.toContain('Edison-bulb');
  });

  it('§5 carries the MAX absurdist-chaos, topic-anchored intensity directive', () => {
    expect(text).toContain('topic-anchored');
    expect(text).toMatch(/MAX absurdist chaos/i);
  });

  it('§5c conceptual-topic → metaphor-scene mapping section exists', () => {
    expect(text).toMatch(/##\s*5c\./);
    expect(text).toContain('Metaphor-Scene');
  });
});

describe('hook-visual-library.md §10 — conceptual costume archetypes (v2.25)', () => {
  const text = read(REF('hook-visual-library.md'));

  const ARCHETYPES = [
    'Memory Architect',
    'Data Guardian',
    'AI Whisperer',
    'Systems Engineer',
    'Mind Hacker',
    'Signal Cutter',
    'Builder/Maker',
    'Concept Avatar',
  ];

  it.each(ARCHETYPES)('defines the "%s" conceptual archetype card', (name) => {
    expect(text).toContain(`### ${name}`);
  });

  it('Memory Architect card carries a prompt-ready phrase', () => {
    const start = text.indexOf('### Memory Architect');
    expect(start).toBeGreaterThan(-1);
    const card = text.slice(start, start + 1200);
    expect(card).toContain('**Prompt phrase**');
    expect(card).toMatch(/Default absurd scene/i);
  });

  it('Topic Keyword Resolution Table routes conceptual keywords to archetypes', () => {
    expect(text).toMatch(/second brain[^|]*\|\s*\*\*Memory Architect\*\*/i);
    expect(text).toMatch(/data sovereignty[^|]*\|\s*\*\*Data Guardian\*\*/i);
  });

  it('abstract topics never fall through to a blazer (Concept Avatar fallback rule)', () => {
    expect(text).toMatch(/Concept Avatar/);
    expect(text).toMatch(/never[^.]*blazer/i);
  });
});

describe('SKILL.md — strengthened cover/costume rules + self-check gate (v2.25)', () => {
  const text = read(resolve(REPO_ROOT, 'skills', 'carousel-gen', 'SKILL.md'));

  it('Rule #17 AUTO-FAILs generic-studio covers (scene-first)', () => {
    expect(text).toMatch(/generic-studio/i);
    expect(text).toContain('AUTO-FAIL');
  });

  it('Cover Self-Check Gate is defined (pre-JSON-emit)', () => {
    expect(text).toContain('Cover Self-Check Gate');
    expect(text).toContain('cover_gate');
  });

  it('Rule #18 routes abstract topics to Concept Avatar (never blazer)', () => {
    expect(text).toContain('Concept Avatar');
  });
});

describe('compiled pipeline bundle — propagation guard (v2.25)', () => {
  const bundlePath = resolve(
    REPO_ROOT,
    'references',
    'compiled',
    'refs-carousel-gen-pipeline.md',
  );

  it('IF the bundle exists, it contains the scene-first cover rule + conceptual archetypes', () => {
    if (!existsSync(bundlePath)) {
      // Bundle is gitignored/regenerated; skip when absent (CI without build step).
      return;
    }
    const bundle = read(bundlePath);
    expect(bundle).toContain('resolved absurd');
    expect(bundle).toContain('Memory Architect');
    expect(bundle).toContain('Concept Avatar');
  });
});
