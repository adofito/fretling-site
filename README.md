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

## The favicon

The site's mark is the app's **Fret Monogram** icon — one of the fourteen in the app's icon
picker, not a separate drawing. It is not the shipping `AppIcon`: that one is a magnifier
over a fretboard, and below roughly 64px it collapses into a beige smudge, so a browser tab
would show nothing recognizable. The monogram is a few large shapes and still reads as F,
bar and marker at 16px.

`favicon.ico` (16/32/48), `favicon-16.png`, `favicon-32.png` and `apple-touch-icon.png`
(180px, from the full-bleed iOS art so iOS can apply its own corner mask) are all generated.
Never edit them by hand — rebuild them from the icon set:

```sh
./scripts/make-favicon.sh                  # or pass another AppIcon* set name
```

## Screenshots

The guide ships 30 screenshots, each in a light and a dark version, as WebP in
`screenshots/`. They are **generated, never taken by hand**:

```sh
./build.sh debug
scripts/site/capture-guide.sh
```

The script stages the app through launch arguments, captures both themes, crops
to the region each section describes, converts to sRGB and encodes. Raw captures
land in `screenshots/raw/` and are gitignored — regenerate rather than keep them.
[`screenshots/CAPTURE.md`](screenshots/CAPTURE.md) documents the shot list, the
flags, the crop-rect workflow, and the `<figure class="shot">` markup.

The pages carry both versions and swap them in CSS, so screenshots follow the
reader's theme. The Markdown mirrors in `markdown/` are deliberately **text-only**:
Markdown has no theme mechanism, so a light-only image would render wrong for
readers on a dark GitHub.

## Publishing

`scripts/publish-site.sh` in the app repo copies the public subset of this folder into the
public site repo and pushes it. Only the files listed above are published — the App Store
prep notes, plans, specs, design-review captures and backlog that live beside it under
`docs/` in the app repo stay private.

It refuses to publish on a broken link. Two checks run against the staged copy: every
`src`/`href` (and every Markdown link target) must be a file in the public subset, and
every `#anchor` must resolve — `scripts/site/check-anchors.py`, which understands both
the explicit ids the HTML pages use and the heading slugs the Markdown mirrors rely on.
Run `./scripts/publish-site.sh --dry-run` to exercise both without publishing.

## Keeping it accurate

In the app repo, run `/check-site` before a release, or after landing anything that adds or
renames a mode, a setting, a practice tool, or a platform requirement. It runs three
mechanical checks (`scripts/site/check-freshness.py`, `check-anchors.py`,
`check-spelling.py`) and then reads the prose for drift they cannot see. It reports; it
never edits. `docs/website/MAINTENANCE.md` there is the runbook: what to re-capture when,
and why the screenshot pipeline is built the way it is. Neither is published with the site.

The guide describes the shipping build. When a feature lands, changes shape, or moves
between surfaces, update the page that covers it in the same change — a guide that describes
last quarter's app is worse than no guide, because it is believed.
