# playbox Technology demo

Five synchronized examples for the playbox Studio website: soccer, horse racing,
spaces, assembly work and retail. The layout follows 捉える → 理解する → 活かす.

## Studio integration

`index.html` is the section-only embed. Keep the native Studio heading and the
next Our Works section. Add a Blank Embed under the Technology heading, set its
width to **100%** and desktop height to **700px** (920px content width), then use:

```html
<iframe
  src="https://playbox-dev.github.io/technology-demo/"
  title="playbox Technology — 捉える・理解する・活かす"
  allow="autoplay"
  loading="lazy"
  style="display:block;width:100%;height:100%;border:0;background:#fff"
></iframe>
```

The 700px desktop height includes the collapsed source disclosure. Expanded
notes can scroll inside the embed. Smaller breakpoints need their own Studio
height; the current review focuses on desktop.

## Updating

- Edit the files in `src/`.
- Run `python3 scripts/build.py` to regenerate the section-only `index.html`.
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
