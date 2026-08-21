# Documentation screenshot capture guide

The guide's screenshots are **generated, never taken by hand**. Every shot is
captured from the DEBUG build, staged Release-identical through launch
arguments, in both light and dark, then cropped, downscaled and encoded to
WebP by one script:

```sh
./build.sh debug                    # the script captures the built app
scripts/site/capture-guide.sh       # all 30 shots, both themes, ~12 minutes
```

| Flag | What it does |
|---|---|
| `--only "08 09"` | Capture just these shot numbers |
| `--theme Light` \| `Dark` | One theme instead of both |
| `--export-only` | Re-crop and re-encode from the cached raws without relaunching the app — this is how you tune a crop rect in under a second |
| `--probe 01` | Capture shot 01, print its size and profile, and open it so you can measure a crop rect against a real capture |

Output:

```
screenshots/raw/{light,dark}/NN-stem.png    2880 x 1800, gitignored
screenshots/NN-stem-{light,dark}.webp       committed, published
```

## Rules the script depends on

- **A Retina (2×) display.** The staged window is 1440 × 900 pt, which captures
  at 2880 × 1800. The script asserts that width and fails loudly otherwise.
- **Crop rects are tied to that 2880 × 1800 frame.** Changing the staged window
  size, or anything in `MainContentLayoutMetrics`, invalidates every rect in
  `shot_crop()`. Re-measure with `--probe`, re-tune with `--export-only`.
- **Captures are Display P3.** The export converts to sRGB before encoding —
  without it the interval markers render oversaturated directly beside the sRGB
  CSS swatches on `fretboard.html#markers`. That step fails loudly rather than
  shipping a P3 file.
- **Launch-arg syntax.** Keys read via `object(forKey:) as? Bool/Int` need XML
  plist literals (`-metronomeIsVisible '<true/>'`); string-enum and
  `bool(forKey:)`-read keys take plain values (`-learningMode Scales`).
  `scripts/appstore/capture-macos.sh` documents this in full — it is the same
  mechanism, and the rules must not fork.
- **Everything the app cannot reach from persisted settings** goes through the
  DEBUG-only flags in `Fretling/Utilities/ScreenshotStaging.swift`:
  `-FretlingScreenshotMode` (also hides the DEBUG Utilities settings tab, so
  captures match Release), `-FretlingOpenSettings` / `-FretlingSettingsTab`,
  `-FretlingOpenChordAtlas`, `-FretlingOpenAbout`, `-FretlingOpenDrumSequencer`,
  `-FretlingAmpTab`, `-FretlingScalesChord`, `-FretlingWindowWidth/Height`.

## Three states are deliberately not staged

They need live audio, and a guide screenshot of a "plug in your guitar" error
is worse than one of a calm idle panel:

| Shot | Shown instead | Why |
|---|---|---|
| Metronome | Stopped, with tempo / meter / subdivision / sound visible | There is no auto-start hook, and a running metronome lands on a random beat — the capture would not be reproducible |
| Guitar amp | Model loaded, Monitor idle, meter at rest | Needs an interface and a plugged-in guitar |
| Looper | Armed and empty, bars set | Needs live playing |
| Live Detect | Idle, reading "Tap Listen to detect what you play" | Needs real audio; with no input device it would show an error |

The mixer shows a **muted** strip rather than a soloed one: solo is transient by
deliberate design (`MixerService`), and the guide's own sentence covers both.

## The shot list

The authoritative list lives in `shot_name()`, `shot_args()` and `shot_crop()`
in [`../../../scripts/site/capture-guide.sh`](../../../scripts/site/capture-guide.sh) —
one place, so the table below cannot drift out of sync with what actually runs.

| # | Stem | Illustrates |
|---|---|---|
| 01 | `app-scales` | `index#anatomy`, `fretboard#layout` |
| 02 | `header-sentence` | `index#quick-start`, `learning-modes#sentence` |
| 03 | `tool-icon-row` | `index#anatomy` |
| 04 | `scales-with-chord` | `learning-modes#scales` |
| 05 | `chords-mode` | `learning-modes#chords` |
| 06 | `triads-strings` | `learning-modes#triads` |
| 07 | `identify-placement` | `learning-modes#identify` |
| 08 / 09 | `marker-bar-notes` / `-intervals` | `fretboard#marker-bar` — a matched pair, same crop |
| 10 / 11 | `markers-circles` / `-intervals` | `fretboard#markers` — matched pair |
| 12 / 13 | `timeline-brackets` / `-ticks` | `fretboard#timeline` — matched pair |
| 14 / 15 / 16 | `caged-a-both`, `pentatonic-shape-4`, `three-notes-per-string` | `fretboard#overlays` |
| 17 | `chord-shapes-legend` | `fretboard#chord-shapes` |
| 18 | `fret-range-limiter` | `fretboard#fret-range` |
| 19 / 20 / 21 | `settings-fretboard` / `-audio` / `-icon` | `settings.html`, one per tab |
| 22 | `about-sheet` | `settings#about` |
| 23–30 | `tuner`, `metronome`, `drum-sequencer`, `amp`, `amp-advanced`, `looper`, `mixer`, `live-detect` | `practice-tools.html`, one per section |

Matched pairs share a crop rect on purpose: if the frame moves between the two,
the reader sees the framing change instead of the setting.

There is no separate dark-mode shot. Every shot ships in both themes and the
page swaps them, so dark mode illustrates itself.

## Adding one to a page

```html
<figure class="shot" style="--shot-max: 850px">
  <img class="shot-light" src="screenshots/14-caged-a-both-light.webp"
       width="1936" height="1210" loading="lazy" decoding="async"
       alt="The A-shape CAGED box outlined over the E Major scale, with connecting lines drawn through the notes inside it.">
  <img class="shot-dark" src="screenshots/14-caged-a-both-dark.webp"
       width="1936" height="1210" loading="lazy" decoding="async"
       alt="The A-shape CAGED box outlined over the E Major scale, with connecting lines drawn through the notes inside it.">
  <figcaption class="figure-caption">CAGED = A with CAGED Display set to Both.</figcaption>
</figure>
```

- **Both images carry the same `alt`.** They are one picture; only the app's
  appearance differs, and exactly one is displayed at a time.
- **Write `alt` as a sentence** describing what the picture shows, ending in a
  period — the register `site.js`'s `neckSummary()` uses. Not "CAGED screenshot".
- **`width` and `height` are the file's real pixels**, read with `sips`. Without
  them the page reflows as images load and in-page anchor landings jump.
- **`--shot-max`** caps a panel crop at half its pixel width; full-column shots
  omit it. The assets are 2×.
- **No `<a>` wrapper and no `srcset`.** `publish-site.sh` validates `src` and
  `href` against the published subset but cannot parse `srcset`, so a `srcset`
  target would escape the check silently.
- **Never point a `<figure>` at a file that has not been captured.**
  `publish-site.sh` now enforces this: it refuses to publish on a broken
  reference.

The Markdown mirrors in `../markdown/` stay **text-only** by decision — Markdown
has no theme mechanism, so a light-only image renders wrong for the many readers
on a dark GitHub.

## History

The guide shipped without screenshots until 2026-08-21. The previous set
(twelve iPad PNGs at 2360 × 1640, captured 2026-02-07) was deleted rather than
published stale: every one showed a build that no longer exists — before the
marker display bar, before the Visual Groupings chip bar, before every practice
tool except the metronome, before the `identify` intent, with a Settings
**Chord** tab that is gone, and under the old Fretty name.

They are recoverable from git history if ever needed:
`git log --diff-filter=D --name-only -- docs/screenshots/ docs/website/screenshots/`
(they were deleted before the site moved into `docs/website/`, so both paths are
needed).
