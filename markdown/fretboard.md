# Fretboard

The neck is the one thing that never moves. Everything else — the sentence, the timeline,
the chip bars, the floating tools — arranges itself around it.

## Layout

Six strings, low E at the bottom to high e at the top, and **15 frets** plus the open
position. Fret numbers run along the neck, with the usual inlay frets — 3, 5, 7, 9, 12, 15 —
called out so you can find your place at a glance.

The neck fills the width it is given and does not scroll horizontally. If you want a smaller
span, use the [fret range limiter](#fret-range-limiter) rather than scrolling.

## Marker display bar

Directly above the neck sits a row of chips that changes how markers read. These are the
settings you reach for constantly, so they are always visible rather than buried in the
sidebar.

| Group | Chips | What it does |
|-------|-------|--------------|
| **Labels** | Notes / Intervals / None | *Notes* prints note names (G, A♯). *Intervals* prints scale degrees (1, 2, ♭3). *None* leaves bare dots — useful for testing yourself. |
| **Shapes** | Circles / Intervals | *Circles* draws every marker the same. *Intervals* gives each degree its own outline — square, diamond, hexagon — so the root reads differently from a third even in Gray. |
| **Colors** | Color / Gray | *Color* gives each interval its own color, so a degree is recognizable before you read it. *Gray* makes every marker the same, which keeps shapes and geometry in focus. |
| **Accidentals** | ♯ Sharps / ♭ Flats | Whether black-key notes read as F♯ or G♭. Only meaningful when labels show note names, so this group dims — but stays visible — when Labels is set to Intervals or None. |

Each group is radio-style: one chip is lit, and tapping the lit chip does nothing. On a
narrow window the bar scrolls sideways instead of wrapping.

## Note markers

Markers show which notes belong to the current scale, chord, or triad. Everything about how
they read — their labels, shapes, colors and accidentals — is set on the
[marker display bar](#marker-display-bar) above the neck. The root note is always emphasized
against the other tones.

> **Chord tones are never hidden.** When a chord is active alongside a key, notes belonging
> to the chord stay drawn even if they fall outside the scale. Altered chords, borrowed
> chords, secondary dominants and slash-bass notes therefore show up as they really are,
> rather than being filtered out by the key.

## Scale timeline

Above the neck, the timeline lays out all twelve semitones in a row. Notes that belong to the
current scale are filled in; the rest sit faded. When a chord is active, its tones are marked
too, so you can read the chord against its key in one line.

Horizontal rails bracket the row to show the structure: the chord's tones are tied together
above it, the scale's below. Small Chord and Scale captions name each rail, and triangles
mark each root.

### Play chips

Beside the timeline are up to two playback chips:

- **Scale** — plays the current scale as a run, following whatever pattern and fret range you
  have on screen. If the visible range holds no playable notes, the chip says so rather than
  doing nothing.
- **Chord** — sustains the current chord.

The Scale chip appears in Scales and Chords modes whenever a scale is selected; the Chord
chip appears whenever a chord is active. Press again to stop.

## Visual Groupings: overlays and boxes

Directly below the neck, a matching chip bar draws pattern systems over what is already
there. Which groups appear depends on the mode you are in.

### CAGED

**Off / All / C / A / G / E / D.** Overlays one of the five CAGED shapes — or all of them at
once — on the current scale, chord, or triad. Available in every learning mode.

How a shape is drawn is set in Settings → Fretboard → Shape Overlays → CAGED Display:

- **Box** — the outline of the shape's region.
- **Lines** — connecting lines through the shape's notes.
- **Both** — outline and lines together.

### Shapes (pentatonic)

**Off / All / 1 / 2 / 3 / 4 / 5.** Overlays pentatonic position boxes. In Scales and Triads
modes you pick a single position or All; in Chords mode the same five positions are drawn in
the context of the selected chord.

### 3 Notes Per String

**Off / 1 … 7.** Scales mode only. Draws a pattern with three scale notes on every string.
How many patterns exist depends on the scale — a seven-note scale gives seven, and smaller
scales offer fewer.

### Strings

**Off / 123 / 234 / 345 / 456.** Triads mode only. Narrows the neck to one set of three
adjacent strings so you can work a triad shape without the rest of the neck competing for
attention.

### Triad boxes

Triads mode, switched on with **Show Triad Boxes** in Settings: outlines each triad position
on the neck.

## Chord shapes

In Chords mode, **Show Chord Shapes** draws real, playable fingerings for the selected chord
on the neck, taken from an open chord-fingering database. Three settings shape how they
behave:

- **Show Finger Numbers** — prints which finger plays each note.
- **Timeline Shape Cues** — marks the shape's tones on the scale timeline as well as the neck.
- **CAGED Interaction** — decides what happens when chord shapes and CAGED overlays are both
  switched on:
  - **Coexist** — draw both.
  - **Exclusive** — chord shapes win; CAGED hides while shapes are on.
  - **Replace CAGED** — chord shapes stand in for CAGED entirely, and the CAGED chip group
    disappears from Visual Groupings.

A legend below the neck names the shapes currently drawn.

## Fret range limiter

Turn on **Limit Fret Range** in [Settings → Fretboard → Practice Focus](settings.md#fretboard-tab)
and a range bar appears below the neck. The handles sit on fret boundaries and are
full-height, so they are easy to grab.

- **Drag the left handle** — set the first fret.
- **Drag the right handle** — set the last fret.
- **Drag the track between them** — slide the whole window up or down the neck without
  changing its width.

Vertical marks inside the track show which frets hold at least one visible note, so you can
see where the material is before you move the window. The neck dims everything outside the
range, and Scale playback follows the range too.

## Tap to play

Tap any visible marker to hear that note, using the instrument set in
[Settings → Audio](settings.md#audio-tab). On iPad the neck is fully multitouch: hold several
notes at once to sound a chord, and slide a finger along the neck to move the sounding note
with it. Only visible markers respond, so tapping empty wood stays silent.

Notes light up while they sound — including notes played back by the Scale and Chord chips,
and notes recognized by [Live Detect](practice-tools.md#live-detect), so you can see what you
just played.
