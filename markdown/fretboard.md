# Fretboard

The neck is the one thing that never moves. Everything else — the sentence, the timeline,
the chip bars, the floating tools — arranges itself around it.

## Layout

Six strings, low E at the bottom to high e at the top, and **15 frets** plus the open
position to start with. Fret numbers run along the neck, with the usual inlay frets — 3, 5,
7, 9, 12, 15, 17, 19, 21 — called out so you can find your place at a glance.

Set the neck to your own guitar with **Frets** at the left of the [marker display
bar](#marker-display-bar): anywhere from 12 to 22.

The neck always fills the width it is given and never scrolls sideways, so a longer neck
draws narrower frets and slightly smaller markers rather than running off the edge. To work
a span of the neck rather than shorten it, use the [fret range
limiter](#fret-range-limiter) — that frames a position on the board you have, while
**Frets** changes how much board there is.

**Side marks.** Like the side dots on a real neck, short marks run along the bass edge of the
board, just below the low E string, at 3, 5, 7, 9, 12, 15, 17, 19 and 21 — and the octave at
fret 12 wears a pair. They sit outside the strings, so a mark can never touch or hide a note,
and they wear the same brown and jade as the fret numbers above the neck, so the two always
agree on where you are. They are short flat dashes rather than dots, because a dot is what a
note marker is.

**String names.** A narrow lane on the leading edge names each string — e, B, G, D, A, E
from the top down — with the six letters sharing one right edge, and a gutter between the
names and the strings they name.

## Marker display bar

Directly above the neck sits a row of chips that changes how markers read. These are the
settings you reach for constantly, so they are always visible rather than buried in the
sidebar.

| Group | Chips | What it does |
|-------|-------|--------------|
| **Frets** | − / + | How many frets the neck draws, from 12 to 22 — set it to match your own guitar. The default is 15. This is the one group that is a stepper rather than a row of chips, and it leads the bar because it describes the board rather than the markers standing on it. |
| **Labels** | Notes / Intervals / None | *Notes* prints note names (G, A♯). *Intervals* prints scale degrees (1, 2, ♭3). *None* leaves bare dots — useful for testing yourself. |
| **Shapes** | Circles / Intervals | *Circles* draws every marker the same. *Intervals* gives each degree its own outline — square, diamond, hexagon — so the root reads differently from a third even in Gray. |
| **Colors** | Color / Gray | *Color* gives each interval its own color, so a degree is recognizable before you read it. *Gray* makes every marker the same, which keeps shapes and geometry in focus. |
| **Accidentals** | ♯ Sharps / ♭ Flats | Whether black-key notes read as F♯ or G♭. Only meaningful when labels show note names, so this group dims — but stays visible — when Labels is set to Intervals or None. |

Every group except **Frets** is radio-style: one chip is lit, and tapping the lit chip does
nothing. On a narrow window the bar scrolls sideways instead of wrapping.

**The defaults** are Labels *Notes*, Shapes *Intervals*, Colors *Color* and Accidentals
*Sharps*, on 15 frets. Every one of them is remembered between launches.

**How the interval shapes are built:** they are a ladder, not a set of glyphs to memorize.
The root is a circle; the 2nd is that circle broken once; from the 3rd up, the degree is the
number of corners — three for a 3rd, four for a 4th, and so on to seven for a 7th. A
flattened or sharpened degree keeps its shape and leans, one way for lowered and the other
for raised, so there are two rules to learn rather than twelve symbols.

## Note markers

Markers show which notes belong to the current scale, chord, or triad. Everything about how
they read — their labels, shapes, colors and accidentals — is set on the
[marker display bar](#marker-display-bar) above the neck. The root note is always emphasized
against the other tones.

> **Chord tones are never hidden.** When a chord is active alongside a key, notes belonging
> to the chord stay drawn even if they fall outside the scale. Altered chords, borrowed
> chords, secondary dominants and slash-bass notes therefore show up as they really are,
> rather than being filtered out by the key.

### The interval wheel

With **Colors** set to Color, a marker's fill is its distance from the key's root — the same
twelve colors everywhere in the app, so a major third looks like a major third whatever key
you are in. That root is the one anchor: the neck, the timeline and the Chord Atlas all
measure from it, and it stays the key's root even while a chord is active, so a pitch keeps a
single color across all three. Switching the root recolors the whole neck; switching the scale
type does not.

| Color | Interval | Distance |
|-------|----------|----------|
| Root | Unison | — |
| ♭2 | Minor 2nd | One semitone |
| 2 | Major 2nd | Two semitones |
| ♭3 | Minor 3rd | Three semitones |
| 3 | Major 3rd | Four semitones |
| 4 | Perfect 4th | Five semitones |
| ♭5 | Tritone | Six semitones |
| 5 | Perfect 5th | Seven semitones |
| ♭6 | Minor 6th | Eight semitones |
| 6 | Major 6th | Nine semitones |
| ♭7 | Minor 7th | Ten semitones |
| 7 | Major 7th | Eleven semitones |

The wheel is built rather than picked: hue advances a fixed step per semitone from the root's
blue, so distance around the color wheel is distance in pitch, and three lightness bands are
arranged so no two chromatic neighbors share one — which is what keeps the twelve apart for a
reader who cannot separate red from green.

## Scale timeline

Above the neck, the timeline lays out all twelve semitones in a row. Notes that belong to the
current scale are filled in; the rest sit faded. When a chord is active, its tones are marked
too, so you can read the chord against its key in one line.

Horizontal rails bracket the row to show the structure: the chord's tones are tied together
above it, the scale's below. Small Chord and Scale captions name each rail, and triangles
mark each root.

### Timeline transports

At the leading edge of the timeline stand up to two round transports, each on the rail it
plays — the Chord transport beside the chord rail above the row, the Scale transport beside
the scale rail below it. Press one to make sound, press it again to stop; a transport that is
sounding fills in solid.

- **Scale** — plays the scale as a run, following whatever pattern and fret range you have on
  screen.
- **Chord** — sustains the chord.

A transport is mounted on a rail, so a rail is all it takes for one to appear: the Scale
transport is there whenever a scale is on the timeline, the Chord transport whenever a chord
is active. That includes Triads, which can now sound the triad it is showing you.

On the Mac, **Shift-Space** presses whichever of the two is on screen — the chord if one is
active, otherwise the scale. The plain space bar belongs to the
[metronome](practice-tools.md#metronome), which is the one transport that runs in every mode.

Under the row, a single tone line spells what the transport is about to sound. It follows the
subject of the mode you are in — the chord in Chords and Triads, the scale in Scales — except
while something is playing, when it follows the sound instead. When both transports are up it
puts **Scale** or **Chord** in front, so you can tell which one it is describing.

The scale's line is spelled from the notes that will *actually be struck*, so narrowing the
fret range or switching on a box narrows the line the same way it narrows the run. If the
visible range holds no playable notes, the line says *No notes in this fret range* rather than
leaving you to press a dead button.

The spelling follows the rest of the app: **Labels** decides whether you read note names or
interval degrees, and **Accidentals** whether they are sharp or flat. It answers a different
question from the timeline above it — the timeline maps the key, the tone line says what this
one transport will sound.

## Visual Groupings: overlays and boxes

Directly below the neck, a matching chip bar draws pattern systems over what is already
there. Which groups appear depends on the mode you are in.

A thin line under a group means that system is live — it is drawing on the neck right now.
A group left at **Off**, **Full**, or **All** lays nothing over the board and carries no line,
so you can see what is switched on without reading the row.

The row is wider than a narrow window can hold, so it breaks on purpose rather than
truncating: the switches you flip mid-practice — Fret Range, and Non-Chord Notes in Chords —
stay pinned in place while the pattern systems scroll behind them. Where content really is
cut off it passes under a soft fade, so a sliced chip reads as more row rather than damage.

### Chord Shapes (Chords)

**Off / On.** Turns the chord-shape overlays on the neck on and off — see
[Chord shapes](#chord-shapes) below for what they draw and the settings that go with them. It
leads the row and starts **On**: in Chords the chord is what the neck is drawing, so its own
voicings are the first system you reach for, and CAGED and the boxes are context laid over it.

### CAGED

**Off / All / C / A / G / E / D.** Overlays one of the five CAGED shapes — or all of them at
once — on the current scale, chord, or triad.

**The shapes follow the chord you are looking at.** Each of the five letters names a shape, and
every shape comes in two grips: the major one you know from the open chords, and the minor one
that flattens its third. Fretling picks the grip from whatever owns the neck in that mode — the
scale in Scales, the chord in Chords, the chord under the playhead in Progressions, the triad in
Triads. So an A minor chord draws the Am, Em and Dm grips at A, not A major's. The chips keep
their five letters either way, because the letter is the shape and the neck is where the grip
shows.

**Where CAGED has nothing to say, the group is gone.** The system maps the neck with major and
minor triad grips, so it cannot spell a chord built on anything else — a diminished or augmented
triad, or a chord with no third at all, like sus2 and sus4. Pick one of those, or a Locrian key,
and the CAGED group leaves the row rather than laying a shape over it that the chord does not
contain. It comes back, with the selection you left it on, as soon as you pick something it can
shape.

How a shape is drawn is set in Settings → Fretboard → Shape Overlays → CAGED Display:

- **Box** — the outline of the shape's region.
- **Lines** — connecting lines through the shape's notes.
- **Both** — outline and lines together.

### Box Shapes

**Off / All / 1 / 2 / 3 / 4 / 5.** Outlines one of the five position boxes on the neck, or all
five at once. Whose boxes they are depends on the mode. In Scales they belong to the scale you
chose — each of the twelve scales has its own five, so a Major scale gets the major positions
rather than a pentatonic stand-in. In Chords they are the key's positions, drawn under the
chord. In Triads they come from the pentatonic that fits the triad: major pentatonic for major
and augmented, minor pentatonic for minor and diminished.

### 3 Notes Per String

**Off / 1 … 7.** Scales mode only. Draws a pattern with three scale notes on every string.
How many patterns exist depends on the scale — a seven-note scale gives seven, and smaller
scales offer fewer.

### Strings

**Off / 123 / 234 / 345 / 456.** Triads mode only. Narrows the neck to one set of three
adjacent strings so you can work a triad shape without the rest of the neck competing for
attention.

### Non-Chord Notes

**Off / On.** Chords mode only. **Off** shows the chord's tones alone; **On** keeps the rest of
the notes visible underneath in gray, so the chord reads inside its key rather than floating on
an empty neck.

### Fret Range

**Full / Limited.** Every mode. **Limited** frames a
[position window](#fret-range-limiter) on the neck so you can work a span of frets; **Full**
gives the whole neck back. While the window is up, the group carries a third chip reading the
span — **3–8** — which opens as a menu of named positions. A named position that would reach
past the end of your neck is *dropped* from that menu rather than squeezed to fit: a 12th
position crushed into two frets is not the 12th position.

### Triad lines

Triads mode, switched on with **Show Triad Lines** in Settings: draws a line through each
triad voicing on the neck, the same connect-the-dots grammar the CAGED overlay uses. Only
voicings one hand can hold get a line, so a tone that belongs to no shape on the chosen
string set stays marked without one.

## Chord shapes

In Chords mode, the **Chord Shapes** group in the Visual Groupings bar draws real, playable
fingerings for the selected chord on the neck, taken from an open chord-fingering database.
It is the first group in the bar, on the left, because in Chords and Progressions the chord
is the thing the neck is drawing and everything else is laid over it. Set it to **On** to show
the fingerings and **Off** to hide them. Three settings in Settings → Fretboard
→ Shape Overlays shape how they behave:

- **Show Finger Numbers** — prints which finger plays each note.
- **Timeline Shape Cues** — marks the shape's tones on the scale timeline as well as the neck.
- **CAGED Interaction** — decides what happens when chord shapes and CAGED overlays are both
  switched on:
  - **Coexist** — draw both.
  - **Exclusive** — chord shapes win; CAGED hides while shapes are on.
  - **Replace CAGED** — chord shapes stand in for CAGED entirely, and the CAGED chip group
    disappears from Visual Groupings.

A legend below the neck names the shapes currently drawn. It carries the same **Chord Shapes**
caption as the switch, because it lists the same system: turn the switch off and the legend
goes with it.

## Fret range limiter

Set **Fret Range** to **Limited** in the Visual Groupings bar and a position window is drawn
on the neck itself — a framed span with a slim grab tab on each edge. The frets outside it
are quieted rather than emptied, because *set aside* and *not in the scale* must not look
alike.

- **Drag an edge tab** — moves that boundary, snapping to the nearest fret line.
- **Drag the fret numbers inside the frame** — slides the whole window along the neck without
  changing its width.
- **Double-tap an edge tab** — opens the window out to that end of the neck.

The boundary frets name themselves as blue chips in the number row, on the same disc the
landmark numbers wear. The frame is never filled in: it claims the span with its edge alone, so
the markers it is drawn around stay exactly as legible as they were — and every note inside
it stays tappable.

While the window is up, the **Fret Range** group carries a value chip reading the span —
**3–8**. It is also a menu: open it to jump straight to a named position — *Open*, *3rd*,
*5th*, *7th*, *9th* or *12th* — the ones that fit on the neck you have. Scale playback follows
the window too.

## Tap to play

Tap any visible marker to hear that note, using the instrument set in
[Settings → Audio](settings.md#audio-tab). On iPad the neck is fully multitouch: hold several
notes at once to sound a chord, and slide a finger along the neck to move the sounding note
with it. Only visible markers respond, so tapping empty wood stays silent.

**A press sustains; a lift stops it.** Hold a marker and the note is held for as long as you
hold it. Let go and it stops — but never before it has rung for a second and a half, so a
quick tap sounds like a pluck rather than a blip. Sliding off a note stops it at once, the way
lifting a fretting finger does.

Notes light up while they sound — including notes played back by the Scale and Chord chips,
and notes recognized by [Live Detect](practice-tools.md#live-detect), so you can see what you
just played.

**On the Mac,** the pointer turns to a hand over anything that responds to a click — a marker,
a chip, a panel header — so the neck says what is live before you press it. Hovering a chip row
lights the chip you are about to hit.
