# Settings

The settings sidebar slides in from the left, opened with the button at the left end of the
top bar. It has three tabs — **Fretboard**, **Audio**, and **Icon** — and a link to About at
the bottom.

> Not everything lives in here. The settings you change constantly sit on the chip bars that
> bracket the neck: [marker display](fretboard.md#marker-display-bar) above it,
> [Visual Groupings](fretboard.md#visual-groupings-overlays-and-boxes) below it. The sidebar
> holds the things you set once and leave alone.

## Fretboard tab

Three groups, some of which appear only in the modes they apply to. Options that do not apply
right now are dimmed rather than hidden, so the sidebar does not rearrange itself under you.

### Appearance

| Setting | Options | Description |
|---------|---------|-------------|
| **Theme** | System / Light / Dark | Follow the device appearance, or pin Fretling to light or dark. |
| **Modules** | Auto / Machined / Studio | How the floating practice tools are drawn. Auto gives the light canvas the Machined panel and the dark canvas the Studio one; pin either to keep it everywhere. |

Marker settings are not here — labels, shapes, colors and accidentals all live on the
[marker display bar](fretboard.md#marker-display-bar) above the neck, where they stay
visible while you play.

### Practice Focus

| Setting | Options | Description |
|---------|---------|-------------|
| **Show Triad Boxes** | Toggle | Triads mode only. Outlines each triad position. |

**Non-Chord Notes** and **Fret Range** used to sit here. They are chips in the
[Visual Groupings](fretboard.md#visual-groupings-overlays-and-boxes) bar under the neck now —
both are flipped mid-practice and both change what the neck shows, so they belong beside it.

### Shape Overlays

| Setting | Options | Description |
|---------|---------|-------------|
| **CAGED Display** | Box / Lines / Both | How a CAGED shape is drawn: region outline, connecting lines through its notes, or both. |
| **Timeline Shape Cues** | Toggle | Also marks the shape's tones on the timeline. Requires chord shapes to be on. |
| **Show Finger Numbers** | Toggle | Prints finger numbers on chord shapes. Requires chord shapes to be on. |
| **CAGED Interaction** | Coexist / Exclusive / Replace CAGED | Chords mode. What happens when chord shapes and CAGED are both on — draw both, let shapes take over while they are on, or have shapes replace CAGED entirely (which also removes the CAGED chips from Visual Groupings). |

Chord shapes themselves are switched on and off in the **Chord Shapes** group of the
[Visual Groupings](fretboard.md#chord-shapes-chords-and-progressions) bar under the neck, not here — it is an overlay
you reach for often, so it sits beside the fretboard it changes. The two rows above follow it
and dim while it is off.

The whole Shape Overlays group is dimmed while you are identifying a chord — there is no key
to lay a shape against.

## Audio tab

### Playback

| Setting | Options | Description |
|---------|---------|-------------|
| **Instrument** | Acoustic Piano, Acoustic Guitar (Nylon), Acoustic Guitar (Steel), Jazz Guitar, Clean Electric Guitar, Sine Wave | The voice used when you tap notes on the neck. Sine Wave is synthesised; the rest come from a General MIDI SoundFont. |

### Chord Pad Layers

Chords can be voiced by stacking up to three instruments, which is how you get a pad behind a
chord rather than one flat sample. Each layer has its own instrument, volume, and mute;
**Add Layer** adds one, up to the maximum.

Layers apply to chord playback — the Chord chip beside the timeline, Chord Atlas previews,
and progression playback. Tapping single notes always uses the Instrument setting above.

## Icon tab

Fretling ships fourteen app icons; pick one and the home screen or Dock icon changes. The
choices are **Warm hex**, **Classic**, **Rich wood**, **Fret window**, **Blush sky**,
**Soft aurora**, **Watercolor**, **Champagne**, **Interval halo**, **Fret monogram**,
**Constellation**, **Ember**, **Ultraviolet**, and **Daylight**. Each is shown as a preview
tile before you commit.

## About and tips

At the bottom of the sidebar, **About Fretling** opens a screen with the version and build
number, a plain-language privacy summary, and credits for the open-source components Fretling
is built on — the chord fingering database, the SoundFont used for instrument playback, and
the Neural Amp Modeler engine with its dependencies.

The About screen also holds an optional **tip jar**. Tips are ordinary in-app purchases
handled by Apple, in three sizes. **They unlock nothing** — every feature is available whether
or not you ever tip.
