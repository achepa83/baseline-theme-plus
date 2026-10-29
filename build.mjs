// Builds Baseline Plus: Baseline's own theme.css (upstream/, never edited by hand) with a few parts
// taken out (patches below), plus our layer (src/*.css) at the end, where it wins over Baseline's
// rules of equal weight. Output one level up, where Obsidian loads the theme.
// No dependencies: node build.mjs
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const outDir = process.env.THEME_OUT_DIR || '..';

/**
 * Parts of Baseline we do not want, cut out by their exact text. When an update of Baseline
 * changes one of them, the build stops and says which: look at the new text, then adjust.
 */
const CUTS = [
	{
		why: 'Marketplace, Migrate and Support buttons at the top of the settings',
		from: '\t-\n\t\tid: info\n\t\ttitle: Get started\n',
		to: '\t-\n\t\tid: colors\n',
	},
	{
		why: 'Settings heading with "Hide Marketplace / Migrate / Support"',
		from: '\t-\n\t\tid: settings\n\t\ttitle: Settings\n',
		to: '\t-\n\t\tid: editor\n',
	},
];

function cut(text, { why, from, to }) {
	const start = text.indexOf(from);
	const end = start < 0 ? -1 : text.indexOf(to, start + from.length);
	if (start < 0 || end < 0) throw new Error(`Baseline has changed, this cut no longer fits: ${why}`);
	if (text.indexOf(from, start + 1) >= 0) throw new Error(`Cut is not unique: ${why}`);
	return text.slice(0, start) + text.slice(end);
}

const upstream = readFileSync('upstream/theme.css', 'utf8');
const version = readFileSync('upstream/VERSION', 'utf8').trim();
const charset = '@charset "UTF-8";\n';
if (!upstream.startsWith(charset)) throw new Error('Baseline no longer starts with @charset');

const patched = CUTS.reduce(cut, upstream.slice(charset.length));
// src/*.css as they are; src/*.css.mjs generate their CSS (default export), for rules too many to write by hand.
const parts = [];
for (const f of readdirSync('src').sort()) {
	if (f.endsWith('.css')) parts.push([f, readFileSync(`src/${f}`, 'utf8')]);
	else if (f.endsWith('.css.mjs')) parts.push([f, (await import(`./src/${f}`)).default]);
}
const layer = parts.map(([f, css]) => `/* ---- Baseline Plus: src/${f} ---- */\n${css}`).join('\n');

const header = `/*
Baseline Plus by achepa83, based on Baseline by svnaxis:
${version}, https://github.com/svnaxis/obsidian-baseline
Baseline's CSS follows unchanged except for the parts cut out in dev/build.mjs;
the additions of Baseline Plus come at the end.

${readFileSync('LICENSE.txt', 'utf8').trim()}

Baseline itself contains parts under their own licenses, noted where they appear.
*/
`;

const manifest = JSON.parse(readFileSync('manifest.json', 'utf8'));
const css = charset + header + patched + '\n' + layer;
writeFileSync(`${outDir}/theme.css`, css);
// A copy at the top of the repository: BRAT installs a theme from theme.css and manifest.json there.
writeFileSync('theme.css', css);
writeFileSync(`${outDir}/manifest.json`, JSON.stringify(manifest, null, '\t') + '\n');
console.log(`Baseline Plus ${manifest.version} (on ${version}) → ${outDir}/theme.css`);
