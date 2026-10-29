// True Adaptive for Baseline Plus: the palette follows the light around.
// Generates CSS (build.mjs takes the default export): twelve steps × two modes are too many to keep
// by hand. Values come from Tweak Utils (True Adaptive), on <body>:
//   --ta-light 0–1 (how bright it is around), --ta-warmth 0–1 (evening, night), class ta-on.
// Without them (Tweak Utils off) nothing here applies: every rule needs body.ta-on.
//
// Baseline's dynamic signatures build their grays as oklch(L^e, C, H) per step (Colorist). The same
// formula here, with the light around in it:
//   light mode, dark room     backgrounds dim a little (white does not glare)
//   light mode, bright light  text gets darker (more contrast)
//   dark mode, bright light   backgrounds lift a little (black does not swallow the text)
//   dark mode, dark room      text gets softer
//   dark mode, bright light   text gets brighter (from above average light on, up to full)
//   evening and night         a warm tint: on backgrounds in light mode, on text in dark mode
// Static signatures (Dracula, Nord, …) define their own colors and are left as they are.

const STEPS = ['00', '05', '10', '20', '25', '30', '35', '40', '50', '60', '70', '100'];
const isBackground = (step) => Number(step) <= 40;
const DYNAMIC = {
	light: ':is(.baseline-light, .material-light, .radiance-light, .softlight-light)',
	dark: ':is(.baseline-dark, .material-dark, .radiance-dark, .softlight-dark)',
};

// The warm tint: mixed towards an amber of the same lightness.
const warm = (color, lightness) =>
	`color-mix(in oklch, ${color}, oklch(${lightness} 0.06 70) calc(var(--ta-warmth, 0) * var(--bp-ta-warm, 0.5) * 100%))`;

function step(mode, s) {
	const exponent = mode === 'light' ? 'var(--colorist-l-light)' : 'calc(1 / var(--colorist-l-dark))';
	const base = `pow(var(--colorist-l-${s}), ${exponent})`;
	let lightness;
	if (mode === 'light') {
		lightness = isBackground(s)
			? `calc(${base} * (1 - var(--bp-ta-dim, 0.1) * (1 - var(--ta-light, 0.5))))`
			: `calc(${base} * (1 - var(--bp-ta-contrast, 0.25) * var(--ta-light, 0.5)))`;
	} else {
		const soft = `calc(${base} * (1 - var(--bp-ta-soften, 0.12) * (1 - var(--ta-light, 0.5))))`;
		// Bright light: 0 up to average light, 1 in full light.
		const bright = 'max(0, calc((var(--ta-light, 0.5) - 0.5) * 2))';
		lightness = isBackground(s)
			? `min(1, calc(${base} + var(--bp-ta-lift, 0.05) * var(--ta-light, 0.5)))`
			: `calc(${soft} + var(--bp-ta-brighten, 0.3) * ${bright} * (1 - ${soft}))`;
	}
	const chroma = `min(0.1, calc(var(--colorist-c-${s}) * var(--colorist-c-${mode})))`;
	const color = `oklch(${lightness} ${chroma} var(--colorist-h-${mode}))`;
	const tinted = (mode === 'light') === isBackground(s);
	return `  --color-base-${s}: ${tinted ? warm(color, lightness) : color};`;
}

const rules = ['light', 'dark'].map(
	(mode) =>
		`body.css-settings-manager.bp-ta.ta-on.theme-${mode}${DYNAMIC[mode]} {\n${STEPS.map((s) => step(mode, s)).join('\n')}\n}`,
);

export default `/* While it reads the values of Tweak Utils' True Adaptive, the theme says so: Tweak Utils then shows it
   and leaves out its own warm layer, which would come on top. */
body.bp-ta {
  --ta-support: 1;
}

${rules.join('\n\n')}
`;
