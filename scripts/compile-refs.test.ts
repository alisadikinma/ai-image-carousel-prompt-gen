/**
 * compile-refs.test.ts — verify the pipeline-mode compiled refs bundle
 * is produced with all required sections.
 *
 * The compiled file ships to VPS at /home/claudesn/refs-carousel-gen-pipeline.md
 * and is injected via --append-system-prompt-file when LinkedInGenerationService
 * routes a carousel-format draft to /carousel-gen. It MUST contain the pipeline
 * detection rules, narrative framework, and creator identity defaults — without
 * them the LLM falls back to interactive behavior and hangs the SSH cron.
 */

import { describe, it, expect } from 'vitest';
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { compileRefs } from './compile-refs.js';

const __filename = fileURLToPath(import.meta.url);
const SCRIPT_DIR = dirname(__filename);
const PLUGIN_ROOT = resolve(SCRIPT_DIR, '..');
const REFERENCES_DIR = join(PLUGIN_ROOT, 'references');

describe('compile-refs — pipeline-mode bundle', () => {
  it('produces refs-carousel-gen-pipeline.md when invoked programmatically', async () => {
    const outputDir = await mkdtemp(join(tmpdir(), 'carousel-gen-refs-'));

    try {
      const results = await compileRefs({
        inputDir: REFERENCES_DIR,
        outputDir,
      });

      const pipeline = results.find(
        (r) => r.file === 'refs-carousel-gen-pipeline.md',
      );
      expect(pipeline, 'compileRefs must produce refs-carousel-gen-pipeline.md').toBeDefined();
      expect(pipeline!.bytes).toBeGreaterThan(30_000);

      const filePath = join(outputDir, 'refs-carousel-gen-pipeline.md');
      const fileStat = await stat(filePath);
      expect(fileStat.isFile()).toBe(true);

      const content = await readFile(filePath, 'utf8');

      // Must include section names from the load-bearing source files.
      expect(content).toContain('5-Act Narrative Spine');
      expect(content).toContain('Mode Detection');
      expect(content).toContain('Creator Identity');
      expect(content).toContain('Hook');
    } finally {
      await rm(outputDir, { recursive: true, force: true });
    }
  });
});
