# playbox Technology demo

Five synchronized examples for the playbox Studio website: soccer, horse racing,
spaces, assembly work and retail. The layout follows 捉える → 理解する → 活かす.

The active scene tab has a red playback progress bar driven by the synchronized
clip time. At the end of each clip, playback advances in tab order: soccer →
horse racing → spaces → assembly work → retail → soccer. Manual selection resets
the new scene’s progress. Pausing freezes both playback and progress; switching
tabs while paused preserves that choice. Reduced-motion users start paused.

## Studio integration

`index.html` replaces the **entire current Our Technology section**, including
the old native heading, copy, list and horse visuals. Hide or remove that old
section. The embed contains the new minimal Our Technology heading, research
link, five scene tabs and demo. Keep the next native **Our Works** section.

Place a Blank Embed where the old Technology section was and set its width to
**100%**, with native Studio wrapper height set to **Auto at every breakpoint**.
Paste the complete iframe from [`studio-embed.html`](./studio-embed.html). Its
inline CSS gives the iframe a fluid height, including in Studio Live Preview
where page custom code does not run. A fixed native wrapper height would prevent
the next section from following this responsive iframe correctly.

The fallback matches this Studio page's measured layout: maximum iframe width
**920px**, with horizontal section padding of **24px per side at page widths up
to 540px**, **40px per side from 541–840px**, and **80px per side above 840px**.
It calculates the resulting iframe width before choosing the desktop or stacked
height. Update the inline gutter calculation if the Studio layout changes.
The height includes a small buffer above the measured content in all five scenes.

The embed has no outer padding. Its title and animated red square underline
match the native Studio section headings. At iframe widths up to **620px**, the
research link sits below the heading, the source and model stack, and the Apply
examples become separate rows. These layouts need more height than desktop;
use the iframe's actual content width when choosing a fallback, rather than the
outer browser width. The source disclosure opens upward in a scrollable panel
and does not change the section's height.

For exact automatic sizing on the published Studio page, the optional helper
below can be added to page custom code. It is provided here but has not yet been
installed in Studio:

```html
<script src="https://playbox-dev.github.io/technology-demo/studio-resize.js" defer></script>
```

`src/section-ui.js` observes the demo's size and sends only its height to its
parent. `studio-resize.js` accepts messages only from this demo's origin and
matching iframe within `#technology`, then resizes the iframe and its native
`div.frame.sd` wrapper. It checks height bounds, avoids repeated writes, and
requests a fresh measurement after loading or replacing an iframe. Studio page
custom code does not run in Live Preview, so retain a native responsive fallback
there through `studio-embed.html`. When installed, the JavaScript helper overrides
the iframe's CSS fallback on the published page.

## Updating

- Edit the files in `src/`.
- Run `python3 scripts/build.py` to regenerate the complete Technology-section `index.html`.
- `preview.html` is the separate full-page concept preview.
- `studio-embed.html` is the paste-ready responsive Studio iframe.
- All code is self-contained. Videos are loaded from their credited source URLs.

## What the tracking represents

This demonstration synchronizes prepared reconstructions with source footage.
AI-assisted visual annotation establishes identities, foot positions, scene landmarks and
object layouts. Image-processing helpers propagate and refine selected tracks;
soccer uses bidirectional Lucas–Kanade optical flow and pitch calibration.
The runtime renders prepared coordinates at each displayed video frame's
timestamp. No trained detector or tracking model runs in the browser.

Soccer includes all visible players and officials; racing includes 14 horses.
Space and retail views preserve visible entry, exit and occlusion timing, and
use the same layout in their application examples. Assembly work follows the
actual tabletop and measured part positions. Depth and hidden shapes are
estimates. The demo's disclosure contains scene-specific details and credits.

## Publication

GitHub Pages can serve the root of `main` without a build step. The `.nojekyll`
file preserves the static output. This repository is independent of the
halftone animation repository. Saving Studio edits and publishing the production
Studio website are separate steps.
