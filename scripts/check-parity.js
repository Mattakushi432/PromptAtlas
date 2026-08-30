#!/usr/bin/env node
// Verifies en/ and uk/ prompt trees mirror each other 1:1, with matching
// frontmatter `id` and `version` on each pair. No dependencies, so it
// runs the same in CI and locally with a plain `node` install.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['en', 'uk'];

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
      // README.md inside a category folder is the auto-generated index
      // (scripts/generate-index.js), not a prompt — it has no frontmatter
      // and isn't part of the bilingual pairing this script checks.
      results.push(full);
    }
  }
  return results;
}

function readFrontmatter(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split('\n')) {
    const fieldMatch = line.match(/^([a-zA-Z_]+):\s*(.+)$/);
    if (fieldMatch) fields[fieldMatch[1]] = fieldMatch[2].trim();
  }
  return fields;
}

function relativeId(langRoot, filePath) {
  return path.relative(langRoot, filePath).replace(/\\/g, '/');
}

function main() {
  const errors = [];
  const roots = Object.fromEntries(LANGS.map((lang) => [lang, path.join(ROOT, lang)]));
  const filesByLang = Object.fromEntries(
    LANGS.map((lang) => [lang, listMarkdownFiles(roots[lang])])
  );

  if (filesByLang.en.length === 0 && filesByLang.uk.length === 0) {
    console.log('No prompts under en/ or uk/ yet — parity check passes trivially.');
    return;
  }

  const relByLang = Object.fromEntries(
    LANGS.map((lang) => [lang, new Set(filesByLang[lang].map((f) => relativeId(roots[lang], f)))])
  );

  for (const rel of relByLang.en) {
    if (!relByLang.uk.has(rel)) errors.push(`Missing uk/${rel} (en/${rel} exists)`);
  }
  for (const rel of relByLang.uk) {
    if (!relByLang.en.has(rel)) errors.push(`Missing en/${rel} (uk/${rel} exists)`);
  }

  for (const rel of relByLang.en) {
    if (!relByLang.uk.has(rel)) continue;
    const enPath = path.join(roots.en, rel);
    const ukPath = path.join(roots.uk, rel);
    const enFm = readFrontmatter(enPath);
    const ukFm = readFrontmatter(ukPath);

    if (!enFm) errors.push(`en/${rel}: missing or malformed frontmatter`);
    if (!ukFm) errors.push(`uk/${rel}: missing or malformed frontmatter`);
    if (!enFm || !ukFm) continue;

    if (enFm.id !== ukFm.id) {
      errors.push(`${rel}: id mismatch (en="${enFm.id}" uk="${ukFm.id}")`);
    }
    if (enFm.version !== ukFm.version) {
      errors.push(`${rel}: version mismatch (en="${enFm.version}" uk="${ukFm.version}")`);
    }
    if (enFm.language !== 'en') errors.push(`en/${rel}: language should be "en", got "${enFm.language}"`);
    if (ukFm.language !== 'uk') errors.push(`uk/${rel}: language should be "uk", got "${ukFm.language}"`);
  }

  if (errors.length > 0) {
    console.error('Bilingual parity check failed:\n');
    for (const err of errors) console.error(`  - ${err}`);
    console.error(`\n${errors.length} issue(s) found.`);
    process.exit(1);
  }

  console.log(`Parity OK: ${relByLang.en.size} prompt(s) mirrored across en/ and uk/.`);
}

main();
