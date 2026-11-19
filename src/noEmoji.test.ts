import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Icons in this package are lucide icons, never emoji or glyph characters.
 * This scans the source, the Storybook config and the README for pictograph
 * and symbol code points. Plain typographic punctuation (… · – —) is fine, and
 * arrows are only allowed in comments and the README, where they are prose.
 */
const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');

// Emoji and pictographs, dingbats (check marks, crosses, stars), misc symbols,
// geometric shapes, technical symbols (command key), and the emoji joiners.
const PICTOGRAPH = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{25A0}-\u{25FF}\u{2300}-\u{23FF}\u{FE0F}\u{200D}]/u;
const ARROW = /[\u{2190}-\u{21FF}]/u;

const CHECKED_EXTENSIONS = new Set(['.ts', '.tsx', '.css', '.md', '.mdx']);
const SKIPPED_DIRS = new Set(['node_modules', 'dist', 'storybook-static', '.git', '.pnpm-store']);

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    if (SKIPPED_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (CHECKED_EXTENSIONS.has(extname(full))) yield full;
  }
}

const isCommentLine = (line: string) => {
  const t = line.trimStart();
  return t.startsWith('//') || t.startsWith('*') || t.startsWith('/*');
};

function offenders(): string[] {
  const out: string[] = [];
  const roots = [join(ROOT, 'src'), join(ROOT, '.storybook'), join(ROOT, 'README.md')];
  for (const root of roots) {
    const files = statSync(root).isDirectory() ? [...walk(root)] : [root];
    for (const file of files) {
      if (file.endsWith('noEmoji.test.ts')) continue;
      const isProse = file.endsWith('.md') || file.endsWith('.mdx');
      readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
        const bad = PICTOGRAPH.test(line) || (!isProse && !isCommentLine(line) && ARROW.test(line));
        if (bad) out.push(`${relative(ROOT, file)}:${i + 1}: ${line.trim().slice(0, 80)}`);
      });
    }
  }
  return out;
}

describe('no emoji or glyph icons', () => {
  it('uses lucide icons only: no emoji, pictograph or symbol characters in source, stories or docs', () => {
    expect(offenders()).toEqual([]);
  });
});
