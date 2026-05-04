/**
 * compile-refs.ts — Build the pipeline-mode compiled reference bundle.
 *
 * Reads raw reference markdown files from references/ and produces the
 * `refs-carousel-gen-pipeline.md` bundle in references/compiled/. The bundle
 * gets injected via `--append-system-prompt-file` when the Portfolio_v2
 * backend's LinkedInGenerationService routes a carousel-format draft to
 * /carousel-gen via SSH (Phase A6 router, Phase B cutover via
 * LINKEDIN_USE_CAROUSEL_GEN_ENGINE=true).
 *
 * Why bundle instead of read-on-demand:
 *   - The skill runs under `claude -p` non-interactively on VPS — there is
 *     no Read tool available to fetch references at runtime.
 *   - --append-system-prompt-file injects the entire bundle into the system
 *     prompt at session start, eliminating per-run file I/O.
 *
 * Bundle contents (mirrors what an interactive operator would Read on demand):
 *   - global-config.md          — creator identity, language, colors, format
 *   - creator-bible.md          — wardrobe, settings, lighting defaults
 *   - hook-formula-bank.md      — 52 hook formulas (8 psychology categories)
 *   - cinematography-lut.md     — lighting + camera + lens lookup tables
 *   - prompt-formulas.md        — prompt body rendering rules
 *   - carousel-best-practices.md — platform specs, 5-act narrative spine (§9)
 *   - non-interactive-defaults.md — pipeline-mode resolution rules
 *
 * Usage:
 *   npm run compile-refs              # via package.json scripts (uses tsx)
 *   npx tsx scripts/compile-refs.ts   # direct invocation
 *
 * Mirrors the sister plugin pattern: linkedin-post-writer/scripts/compile-refs.ts.
 */

import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { basename, join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export interface CompileRefsOptions {
  inputDir: string;
  outputDir: string;
}

interface BundleSpec {
  outputFile: string;
  purpose: string;
  sources: string[];
}

const BUNDLES: BundleSpec[] = [
  {
    outputFile: 'refs-carousel-gen-pipeline.md',
    purpose:
      'Pipeline-mode bundle (creator identity, narrative spine, non-interactive defaults)',
    sources: [
      'global-config.md',
      'creator-bible.md',
      'hook-visual-library.md',
      'hook-formula-bank.md',
      'cinematography-lut.md',
      'prompt-formulas.md',
      'carousel-best-practices.md',
      'non-interactive-defaults.md',
    ],
  },
];

function buildHeader(purpose: string): string {
  return [
    `# Carousel-Gen Reference — ${purpose}`,
    '',
    'Compiled for `--append-system-prompt-file` injection into pipeline-mode',
    '`/carousel-gen` runs. Do NOT read these files with the Read tool — they',
    'are already in the system prompt.',
    '',
  ].join('\n');
}

function buildSeparator(sourceFile: string): string {
  const name = basename(sourceFile, '.md');
  return ['', '---', '', `## Reference: ${name}`, '', ''].join('\n');
}

async function ensureFile(path: string): Promise<void> {
  try {
    const s = await stat(path);
    if (!s.isFile()) {
      throw new Error(`expected file, got directory: ${path}`);
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`source file not found: ${path}`);
    }
    throw err;
  }
}

async function buildBundle(
  inputDir: string,
  outputDir: string,
  spec: BundleSpec,
): Promise<{ file: string; bytes: number }> {
  const parts: string[] = [buildHeader(spec.purpose)];

  for (const source of spec.sources) {
    const srcPath = join(inputDir, source);
    await ensureFile(srcPath);
    const content = await readFile(srcPath, 'utf8');
    parts.push(buildSeparator(source));
    parts.push(content.trimEnd());
    parts.push('');
  }

  const body = parts.join('\n');
  const outPath = join(outputDir, spec.outputFile);
  await writeFile(outPath, body, 'utf8');
  const s = await stat(outPath);
  return { file: spec.outputFile, bytes: s.size };
}

export async function compileRefs(
  options: CompileRefsOptions,
): Promise<Array<{ file: string; bytes: number }>> {
  const inputDir = resolve(options.inputDir);
  const outputDir = resolve(options.outputDir);

  await mkdir(outputDir, { recursive: true });

  const results: Array<{ file: string; bytes: number }> = [];
  for (const spec of BUNDLES) {
    results.push(await buildBundle(inputDir, outputDir, spec));
  }
  return results;
}

async function runCli(): Promise<void> {
  const __filename = fileURLToPath(import.meta.url);
  const scriptDir = dirname(__filename);
  const rootDir = resolve(scriptDir, '..');
  const inputDir = join(rootDir, 'references');
  const outputDir = join(rootDir, 'references', 'compiled');

  const results = await compileRefs({ inputDir, outputDir });

  process.stdout.write('Compiled reference files:\n');
  for (const { file, bytes } of results) {
    process.stdout.write(`  ${file}: ${bytes.toLocaleString()} bytes\n`);
  }
  process.stdout.write('Done.\n');
}

// CLI entrypoint: only run when executed directly via tsx/node, not when imported.
const invokedDirectly =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  runCli().catch((err: unknown) => {
    const message = err instanceof Error ? err.stack ?? err.message : String(err);
    process.stderr.write(`compile-refs failed: ${message}\n`);
    process.exit(1);
  });
}
