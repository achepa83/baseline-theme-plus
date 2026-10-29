# Baseline Plus

A variant of the Obsidian theme [Baseline](https://github.com/svnaxis/obsidian-baseline) by svnaxis, with a few
additions. Baseline itself is included unchanged (currently 4.1.0); everything it offers keeps working, including
your Baseline settings.

## Install

With the [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin: *Add beta theme* → `achepa83/baseline-theme-plus`.
Or copy `theme.css` and `manifest.json` into `.obsidian/themes/Baseline Plus/` of your vault.

The options are set with [Style Settings](https://github.com/mgmeyers/obsidian-style-settings), in the section
**Baseline Plus**.

## Additions

- **Vault switcher:** shows when the pointer is on it (or always, or as in Baseline), with a solid, blurred or no
  background, and a solid color behind the vault name.
- **Highlight strength:** how strongly hovered items stand out.
- **Callouts on phones:** text under the icon instead of beside it, and a smaller list indent.
- **Properties:** the names take the width of the longest one, within a minimum and a maximum, with an adjustable
  gap to the values. On iPhone and iPad a fixed width is used (Safari cannot size the fields to their text yet).
- **Blockquote font style** applies while writing too, not only in reading view.
- **True Adaptive:** the grays follow the light around you: in light mode backgrounds dim in a dark room and text
  gets darker in bright light; in dark mode backgrounds lift and text gets brighter in bright light, softer in the
  dark; in the evening colors get a little warmer. Each effect has its own slider. The values come from the plugin
  Tweak Utils (not published); without it nothing changes. Works with the signatures Baseline, Material, Radiance and
  Softlight.
- Removed: the Marketplace, Migrate and Support links and the "Settings" section of Baseline's Style Settings.

## License

MIT, like Baseline. See [LICENSE.txt](LICENSE.txt); the full text with both copyrights is also at the top of
`theme.css`.
