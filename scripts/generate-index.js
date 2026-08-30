#!/usr/bin/env node
// Regenerates en/<category>/README.md and uk/<category>/README.md — a table of
// every prompt in that category (id, title, difficulty, one-line description),
// read straight from each file's frontmatter + `## Description` section.
// No dependencies. Usage: node scripts/generate-index.js [category-slug ...]
// With no arguments, regenerates every category folder found under en/.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LANGS = ['en', 'uk'];
const HEADERS = {
  en: { title: 'Title', difficulty: 'Difficulty', description: 'Description', note: 'auto-generated' },
  uk: { title: 'Назва', difficulty: 'Складність', description: 'Опис', note: 'згенеровано автоматично' },
};

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

function readDescription(text, lang) {
  const heading = lang === 'uk' ? '## Опис' : '## Description';
  const idx = text.indexOf(heading + '\n');
  if (idx === -1) return '';
  const rest = text.slice(idx + heading.length + 1);
  const end = rest.indexOf('\n## ');
  const body = (end === -1 ? rest : rest.slice(0, end)).trim();
  return body.replace(/\s+/g, ' ');
}

function listCategorySlugs() {
  const enRoot = path.join(ROOT, 'en');
  if (!fs.existsSync(enRoot)) return [];
  return fs
    .readdirSync(enRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
}

function loadCategoryFiles(langRoot, slug) {
  const dir = path.join(langRoot, slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .map((f) => {
      const text = fs.readFileSync(path.join(dir, f), 'utf8');
      const fm = readFrontmatter(text) || {};
      return {
        file: f,
        id: fm.id || f.replace(/\.md$/, ''),
        title: fm.title || '',
        difficulty: fm.difficulty || '',
        status: fm.status || '',
        description: readDescription(text, fm.language),
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

function escapeCell(s) {
  return String(s).replace(/\|/g, '\\|');
}

function renderIndex(lang, slug, entries) {
  const h = HEADERS[lang];
  const lines = [];
  lines.push(`# ${slug}`);
  lines.push('');
  lines.push(
    `_${entries.length} prompt(s) — ${h.note}. Run \`node scripts/generate-index.js ${slug}\` after adding, removing, or editing a prompt in this folder; do not hand-edit._`
  );
  lines.push('');
  lines.push(`| id | ${h.title} | ${h.difficulty} | ${h.description} |`);
  lines.push('|---|---|---|---|');
  for (const e of entries) {
    lines.push(
      `| [\`${e.id}\`](./${e.file}) | ${escapeCell(e.title)} | ${escapeCell(e.difficulty)} | ${escapeCell(e.description)} |`
    );
  }
  lines.push('');
  return lines.join('\n');
}

function generateForSlug(slug) {
  let wrote = false;
  for (const lang of LANGS) {
    const langRoot = path.join(ROOT, lang);
    const entries = loadCategoryFiles(langRoot, slug);
    if (entries.length === 0) continue;
    const out = renderIndex(lang, slug, entries);
    fs.writeFileSync(path.join(langRoot, slug, 'README.md'), out);
    wrote = true;
  }
  return wrote;
}

function main() {
  const args = process.argv.slice(2);
  const slugs = args.length > 0 ? args : listCategorySlugs();
  if (slugs.length === 0) {
    console.log('No category folders found under en/ — nothing to index.');
    return;
  }
  let total = 0;
  for (const slug of slugs) {
    if (generateForSlug(slug)) {
      console.log(`Indexed ${slug}`);
      total += 1;
    } else {
      console.log(`Skipped ${slug} (no prompts found)`);
    }
  }
  console.log(`Done: ${total} categor${total === 1 ? 'y' : 'ies'} indexed.`);
}

main();
