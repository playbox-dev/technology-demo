# playbox Technology demo

Five synchronized examples for the playbox Studio website: soccer, horse racing,
spaces, assembly work and retail. The layout follows 捉える → 理解する → 活かす.

## Studio integration

`index.html` replaces the **entire current Our Technology section**, including
the old native heading, copy, list and horse visuals. Hide or remove that old
section. The embed contains the new minimal Our Technology heading, research
link, five scene tabs and demo. Keep the next native **Our Works** section.

Place a Blank Embed where the old Technology section was, set its width to
**100%** and desktop height to **780px** (920px content width), then use:

```html
<iframe
  src="https://playbox-dev.github.io/technology-demo/"
  title="playbox Technology — 捉える・理解する・活かす"
  allow="autoplay"
  loading="lazy"
  style="display:block;width:100%;height:100%;border:0;background:#fff"
></iframe>
```

The estimated content height at 920px width is about **770px**, including the
new heading and collapsed source disclosure; 780px is the initial desktop embed
height for review. The embed has no outer padding. Tabs keep their original
spacing below the heading: 38px on desktop and 27px on mobile. Expanded notes
can scroll inside the embed. Smaller breakpoints need their own Studio height;
the current review focuses on desktop.

## Updating

- Edit the files in `src/`.
- Run `python3 scripts/build.py` to regenerate the complete Technology-section `index.html`.
- `preview.html` is the separate full-page concept preview.
- All code is self-contained. Videos are loaded from their credited source URLs.

## What the tracking represents

This is a manually aligned demonstration, not a live tracking product.
Visual annotations establish identities, foot positions, scene landmarks and
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
