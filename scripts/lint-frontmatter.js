#!/usr/bin/env node
// Validates every prompt file's frontmatter and required body sections.
// No dependencies. Run alongside check-parity.js in CI — this is what
// stops a tag-vocabulary split (like the database/databases drift fixed
// 2026-08-30) or a malformed frontmatter field from landing silently once
// more than one person is contributing.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['en', 'uk'];
const VALID_DIFFICULTY = new Set(['beginner', 'intermediate', 'advanced']);
const VALID_STATUS = new Set(['draft', 'stable', 'deprecated']);

// EN heading -> UK heading, per CLAUDE.md's documented localization convention.
const REQUIRED_HEADINGS = [
  ['## Description', '## Опис'],
  ['## When to use it', '## Коли використовувати'],
  ['## The Prompt', '## Промпт'],
  ['## Variables', '## Змінні'],
  ['## Example', '## Приклад'],
  ['## Tips & Variations', '## Поради та варіації'],
  ['## Changelog', '## Історія змін'],
];

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
      results.push(full);
    }
  }
  return results;
}

function readFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split('\n')) {
    const fieldMatch = line.match(/^([a-zA-Z_]+):\s*(.+)$/);
    if (fieldMatch) fields[fieldMatch[1]] = fieldMatch[2].trim();
  }
  return fields;
}

function parseTags(raw) {
  if (!raw) return null;
  const match = raw.match(/^\[(.*)\]$/);
  if (!match) return null;
  return match[1]
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

function loadCanonicalTags() {
  const tagsPath = path.join(ROOT, 'docs', 'tags.md');
  const text = fs.readFileSync(tagsPath, 'utf8');
  const tags = new Set();
  // Tag list lines are comma-separated inline lists under each `## Theme` heading.
  for (const line of text.split('\n')) {
    if (!line.trim() || line.startsWith('#') || line.startsWith('_') || line.startsWith('*')) continue;
    for (const tag of line.split(',')) {
      const t = tag.trim().replace(/[.,]$/, '');
      if (/^[a-z0-9][a-z0-9-]*$/.test(t)) tags.add(t);
    }
  }
  return tags;
}

function main() {
  const canonicalTags = loadCanonicalTags();
  const errors = [];

  for (const lang of LANGS) {
    const files = listMarkdownFiles(path.join(ROOT, lang));
    for (const filePath of files) {
      const rel = path.relative(ROOT, filePath);
      const text = fs.readFileSync(filePath, 'utf8');
      const fm = readFrontmatter(text);
      if (!fm) {
        errors.push(`${rel}: missing or malformed frontmatter`);
        continue;
      }

      if (!VALID_DIFFICULTY.has(fm.difficulty)) {
        errors.push(`${rel}: invalid difficulty "${fm.difficulty}" (expected one of: ${[...VALID_DIFFICULTY].join(', ')})`);
      }
      if (!VALID_STATUS.has(fm.status)) {
        errors.push(`${rel}: invalid status "${fm.status}" (expected one of: ${[...VALID_STATUS].join(', ')})`);
      }

      const tags = parseTags(fm.tags);
      if (!tags || tags.length === 0) {
        errors.push(`${rel}: tags is empty or malformed (expected e.g. "[foo, bar]")`);
      } else {
        for (const tag of tags) {
          if (!canonicalTags.has(tag)) {
            errors.push(`${rel}: tag "${tag}" is not in docs/tags.md — add it there in this PR, or reuse an existing tag`);
          }
        }
      }

      for (const [enHeading, ukHeading] of REQUIRED_HEADINGS) {
        if (!text.includes(`\n${enHeading}\n`) && !text.includes(`\n${ukHeading}\n`)) {
          errors.push(`${rel}: missing required section (expected "${enHeading}" or "${ukHeading}")`);
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error('Frontmatter lint failed:\n');
    for (const err of errors) console.error(`  - ${err}`);
    console.error(`\n${errors.length} issue(s) found.`);
    process.exit(1);
  }

  console.log('Frontmatter lint OK.');
}

main();
