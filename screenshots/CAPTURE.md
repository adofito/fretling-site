# Documentation screenshot capture guide

The user guide currently ships **without screenshots**. The previous set (twelve iPad PNGs
at 2360 × 1640) was captured on **2026-02-07** and removed on 2026-08-21 because every one
of them showed a build that no longer exists. They predate:

- the marker display bar above the neck (Labels / Colors / Accidentals)
- the Visual Groupings chip bar below the neck (they showed the old card-style controls)
- every practice tool except the metronome — tuner, amp, looper, mixer and Live Detect
  icons are all absent from the top-right row
- the `identify` intent in the header sentence
- the Settings sidebar as it is today: they show a **Chord** tab that no longer exists, and
  Display Mode / Colors / Accidentals rows that have since moved out to the chip bar
- the **Icon** settings tab
- the rename from Fretty to Fretling

They are recoverable from git history if ever needed:
`git log --diff-filter=D --name-only -- docs/screenshots/ docs/website/screenshots/`
(they were deleted before the site moved into `docs/website/`, so both paths are needed).

## How to capture

- **iPad**: iPad Air 11" (M2) or the matching simulator, landscape, 2360 × 1640.
  This matches the previous set and the App Store 11" iPad slot.
- **Mac**: 1200 × 800 window (⌘⇧4 then Space, or `screencapture -w`).
- Take every shot in **light** appearance unless the row says otherwise, so the set reads
  as one system. Capture the dark-mode shot last, from the same state as `01`.
- Use **E Major** as the working key throughout, so consecutive shots are comparable.
- Close any floating tool you are not documenting — a stray panel in the corner dates a
  screenshot as surely as a wrong tab does.

## Shot list

Save each file into this folder under the exact filename in the first column. The
`Referenced by` column is where to add the `<figure>` once the file exists; nothing breaks
while a file is missing, because no page links to an image today.

| Filename | App state to set up | Referenced by |
|---|---|---|
| `01-scales-e-major.png` | Scales mode, E Major. Marker bar: Labels = Notes, Colors = Color. Visual Groupings all Off. No tool panels open. | `index.html#anatomy`, `fretboard.html#layout` |
| `02-marker-bar-notes.png` | Same as 01, cropped to the marker display bar and the top two strings. Labels = Notes lit. | `fretboard.html#marker-bar` |
| `03-marker-bar-intervals.png` | Same crop as 02, Labels = Intervals. Shows the Accidentals group dimmed. | `fretboard.html#marker-bar` |
| `04-timeline-brackets.png` | Scales mode, E Major, a chord selected. Settings → Fretboard → Timeline → Structure = Brackets. Crop to the timeline and play chips. | `fretboard.html#timeline` |
| `05-timeline-ticks.png` | Identical to 04 with Structure = Ticks. Same crop, for side-by-side comparison. | `fretboard.html#timeline` |
| `06-caged-overlay.png` | Scales mode, E Major, Visual Groupings → CAGED = A. Settings → CAGED Display = Both. | `fretboard.html#overlays` |
| `07-pentatonic-shapes.png` | Scales mode, E Major, Visual Groupings → Shapes = 4, CAGED = Off. | `fretboard.html#overlays` |
| `08-three-notes-per-string.png` | Scales mode, E Major, Visual Groupings → 3 Notes Per String = 3. | `fretboard.html#overlays` |
| `09-chords-mode.png` | Chords mode, E Major, any diatonic chord selected. Show Non-Chord Notes on. | `learning-modes.html#chords` |
| `10-chord-shapes.png` | Chords mode with Show Chord Shapes and Show Finger Numbers on, so the legend below the neck is visible. | `fretboard.html#chord-shapes` |
| `11-triads-strings.png` | Triads mode, E Major, Show Triad Boxes on, Visual Groupings → Strings = 234. | `learning-modes.html#triads` |
| `12-identify-placement.png` | Header verb = identify, in E Major, four or five notes placed on the neck, readings list visible. | `learning-modes.html#identify` |
| `13-fret-range-limiter.png` | Any mode with Limit Fret Range on and the range narrowed to about frets 5–9. Crop to the neck and the limiter bar. | `fretboard.html#fret-range` |
| `14-settings-fretboard.png` | Sidebar open, Fretboard tab, in Chords mode so the Shape Overlays group shows every row. | `settings.html#fretboard-tab` |
| `15-settings-audio.png` | Sidebar open, Audio tab, with at least two chord pad layers added. | `settings.html#audio-tab` |
| `16-settings-icon.png` | Sidebar open, Icon tab, showing the icon preview grid. | `settings.html#icon-tab` |
| `17-tuner.png` | Tuner open, playing a note slightly flat so the indicator is off-centre. Bar indicator, Fast mode. | `practice-tools.html#tuner` |
| `18-metronome.png` | Metronome open, 120 BPM, 4/4, Drums sound pack, playing so the beat indicator is lit. | `practice-tools.html#metronome` |
| `19-drum-sequencer.png` | Drum pattern editor open on a 4/4 pattern with kick, snare and hat steps visible. | `practice-tools.html#drums` |
| `20-amp.png` | **Mac.** Guitar amp open on the Amp tab, a model loaded, Monitor running, input meter showing signal. | `practice-tools.html#amp` |
| `21-looper.png` | **Mac.** Looper open with a loop recorded, showing the beat readout and Bars setting. | `practice-tools.html#looper` |
| `22-mixer.png` | **Mac** (so all seven strips are present). Mixer open, one channel soloed so the SOLO badge shows. | `practice-tools.html#mixer` |
| `23-live-detect.png` | Live Detect open while a chord is played, with the recognised notes lit on the neck. | `practice-tools.html#live-detect` |
| `24-dark-mode.png` | Same state as 01 with Theme = Dark. | `index.html` |

## Adding one to a page

Once a file is in place, add a figure where the shot list says. Keep the alt text
descriptive — it is what a screen reader gets instead of the picture:

```html
<figure>
  <img src="screenshots/06-caged-overlay.png"
       alt="The A-shape CAGED box outlined over the E Major scale, with connecting lines through its notes."
       class="doc-img" width="2360" height="1640" loading="lazy">
  <figcaption class="figure-caption">CAGED = A with CAGED Display set to Both.</figcaption>
</figure>
```

Set `width` and `height` to the file's real pixel dimensions so the page does not reflow as
images load. Never leave a `<figure>` pointing at a file that has not been captured yet — a
broken image is worse than no image.
