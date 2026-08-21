# Fretling — user guide and support site

The public site for **Fretling**, a guitar learning app for Mac and iPad: scales, chords,
triads, chord identification, and practice tools on an interactive fretboard.

This folder is the source for the published site. It is also where the App Store listing's
**Support URL** and **Privacy Policy URL** point.

## Pages

| File | Page |
|------|------|
| `index.html` | Home — what Fretling does, screen anatomy, quick start, requirements |
| `learning-modes.html` | Scales, Chords, Triads, and identifying a chord |
| `fretboard.html` | Markers, chip bars, timeline, overlays, chord shapes, fret range, tap-to-play |
| `practice-tools.html` | Tuner, metronome, drum sequencer, amp, looper, mixer, Live Detect |
| `settings.html` | Every option in the settings sidebar |
| `privacy.html` | Privacy policy |

`css/styles.css` is the whole visual system, written from the app's own design tokens —
the interval wheel, the header accents, the warm canvas and elevated islands, the chip
grammar of the bars that bracket the neck. No framework, no CDN, no webfont. `js/site.js`
is the only script: it runs the appearance control, the marker display bar on the home
page, and the fretboard it draws. There is no build step — the pages are plain HTML and
open directly in a browser.

The home page's neck is pre-rendered into `index.html` so it is correct with scripting
turned off. If you change the renderer in `js/site.js`, regenerate it:

```sh
node -e 'const f=require("./docs/website/js/site.js"),s=require("fs");
  const h=s.readFileSync("docs/website/index.html","utf8");
  s.writeFileSync("docs/website/index.html", h.replace(/<div class="fretboard" data-fretboard>[\s\S]*?<\/div>/, `<div class="fretboard" data-fretboard>${f.renderFretboard({})}</div>`));'
```

To preview the site locally, serve this folder and open it — the pages use relative paths,
so `file://` works too, minus the pre-render check:

```sh
python3 -m http.server 8765 --directory docs/website
```

`markdown/` holds a plain-Markdown mirror of the same content, for reading in an editor or
on GitHub.

## Screenshots

The guide currently ships without screenshots. The previous set was captured on 2026-02-07
and no longer matches the app, so it was removed rather than published stale.
[`screenshots/CAPTURE.md`](screenshots/CAPTURE.md) lists the 24 shots to take, the exact app
state for each, the filename to save it under, and the markup to drop one into a page.

## Publishing

`scripts/publish-site.sh` in the app repo copies the public subset of this folder into the
public site repo and pushes it. Only the files listed above are published — the App Store
prep notes, plans, specs, design-review captures and backlog that live beside it under
`docs/` in the app repo stay private.

## Keeping it accurate

The guide describes the shipping build. When a feature lands, changes shape, or moves
between surfaces, update the page that covers it in the same change — a guide that describes
last quarter's app is worse than no guide, because it is believed.
