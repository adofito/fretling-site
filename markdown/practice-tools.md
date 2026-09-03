# Practice Tools

Six tools open from the icon row at the right of the top bar. Each is a floating panel over
the fretboard — drag it where you want it, and close it when you are done. When panels overlap,
pressing one brings it to the front, and the arrangement is kept between launches. The neck
stays visible and usable underneath.

Every panel also **minimizes** to a one-row strip that keeps its main control and readout
live — the metronome's play button, tempo and beat lamp; the tuner's Listen button, note and
cents; the looper's Record and Play; the mixer's Main fader; the amp's Monitor and output gain;
Live Detect's Listen and detected chord. Click the chevron beside the panel's close button, or
double-click its header (double-tap on iPad); the same chevron expands it again. Which panels
are minimized is remembered between launches, along with where they sit.

> **Everything on this page works on Mac and iPad.** The amp and the looper used to be
> Mac-only; they now run on iPad too. Plug in a USB-C audio interface, or use headphones —
> monitoring through the built-in speaker feeds back into the built-in mic, and the amp
> will tell you so.

Every panel is built to look like the hardware it stands in for — a machined faceplate,
recessed displays, indicator lamps, knurled fader caps. Two finishes ship: **Machined**, a
light panel, and **Studio**, a graphite one. `Settings › Fretboard › Appearance › Modules`
picks between them, and the default follows your theme — light panels on the light canvas,
graphite on the dark one.

## Tuner

A chromatic tuner that listens through your microphone or audio interface. It names the note
you are playing and shows how far off you are in cents.

### Indicator styles

Five ways of drawing the same measurement — pick whichever you read fastest:

- **Needle** — a classic swinging needle.
- **Bar** — a horizontal deviation bar against a cents scale.
- **Trace** — plots pitch over time, so drift and vibrato are visible. With Reduce Motion on, the trace sweeps across the display instead of scrolling, so what it has drawn stays put.
- **Strobe** — a strobe band that stands still when you are in tune.
- **Disc** — a rotating disc, seen through a half-moon window, that stops turning at true pitch.

### Fast or Precision

These are two different instruments, not a quality slider:

| Mode | Reads | In tune within | Use it when |
|------|-------|----------------|-------------|
| **Fast** | Responds immediately, whole cents | ±5 cents | Retuning a string mid-song, checking quickly between takes. |
| **Precision** | Hold a note about a second, tenths of a cent | ±0.5 cents | Setting the guitar up properly with it on the bench. |

Precision measures phase over a settled baseline, which is why it needs a held note — a
sub-cent reading is only as good as the stretch of signal it was fitted over.

### Reference and calibration

At the bottom of the panel, a **Reference** disclosure holds the Fast / Precision switch and
two settings you set once and leave alone:

- **A4** — the reference pitch, from 430 to 450 Hz in whole hertz, 440 by default. Turn it
  for an orchestra that tunes to 442, or a recording at 432.
- **Offset** — a manual correction of up to ±5 cents, in tenths, for an instrument or an
  interface that reads consistently sharp or flat. Under it, after the tuner has listened
  for a while, a line reports how far your audio input's clock runs from its nominal rate,
  in parts per million and in cents. That part is measured and corrected automatically, so
  the slider only ever carries your own preference.

## Metronome

| Control | Range / options | Notes |
|---------|-----------------|-------|
| **Tempo** | 40–250 BPM, default 120 | Steppers move one BPM at a time; hold to run. |
| **TAP** | — | Tap in time and the tempo follows your taps. |
| **Meter** | 4/4, 3/4, 2/4, 6/8, 5/4, 7/8, 9/8, 12/8, 1/4 | The beat indicator shows your place in the bar. |
| **Subdivision** | Quarter, Eighth, Triplet, Dotted Eighth, Sixteenth | Subdivides the beat without changing the tempo. Dotted Eighth is the long–short pair — a dotted eighth and a sixteenth — two clicks to every beat. |
| **Sound** | Classic, Woodblock, Click, Drums | *Drums* plays a real kit pattern instead of a click — see below. |
| **Accent** | On / off | Emphasizes the downbeat of each bar. |

## Drum sequencer

With the **Drums** sound pack selected, the metronome plays a step-sequenced pattern across
six lanes — **Crash**, **Ride**, **Open Hat**, **Hat**, **Snare**, and **Kick** — instead of
a bare click. The kit is a recorded acoustic drum kit, and every hit rings for its natural
length: a kick keeps sounding under the hats that follow it, and an open hat rings until
the closed hat shuts it, as on a real kit. Every meter ships with a musical default rather
than a mechanical one — hats on the beat hit harder than the hats between — so 6/8 feels
like 6/8 without you editing anything.

Open the pattern editor from the metronome to build your own:

- **The grid** — one row per lane, one column per step. Each cell shows how hard that hit
  lands: the fill rises from the bottom of the cell to its level, full at the top. The grid
  scrolls sideways when a meter needs more steps than fit.
- **Set a level** — tap a cell at the height you want it to hit; the bottom band of a cell
  is off. Drag up or down inside a cell to ride its level, or drag across the row to paint
  that level onto every cell you cross. Right-click (or long-press on iPad) a cell for Full,
  75, 50, 25, or Off. While you drag, the readout at the top shows the lane, the step, and
  the level.
- **Play while you edit** — the pattern loops as you work, so you hear each change
  immediately.
- **Meter and Subdivision** — change either from the editor's transport row, next to the
  tempo, and the grid regroups to match. Each combination keeps its own active pattern,
  so switching loads that one; unsaved edits ask to be saved or discarded first.
- **Rows at once** — right-click (or long-press) a lane's name for *Fill Row*, *Accent
  Beats*, or *Clear Row*. Accent Beats keeps the row's hits and re-levels them the way the
  defaults are built: full on the beat, lighter in between.
- **Library** — every meter ships with a few *Defaults*: *Basic*, and where the meter earns
  them *Rock*, *Hats only*, *Light* and *Shuffle*; the odd meters get their groupings
  instead, *3+2* and *2+3* in 5/4, *2+2+3* and *3+2+2* in 7/8. Save a pattern under a name,
  mark one as active, duplicate one as a starting point, rename, or delete.
  Edited-but-unsaved patterns are badged *Edited*, and closing with unsaved work asks
  before discarding it.
- **Reset** — restores the default steps and levels for the current meter.

From the metronome panel itself, changing the meter or the subdivision loads that
combination's active pattern straight away — the editor is the place that asks first.

## Guitar amp

Plug a guitar into an audio interface and monitor it through a **Neural Amp Modeler**
profile — the amp captures shared as `.nam` files. Fretling ships with a set of starter
models and loads any other `.nam` file you point it at.

The panel holds amp matters only. Anything about the *input* — which interface, which
channel, how much gain, buffer size and sample rate — lives in the [input console](#input)
in the top bar, because the tuner and Live Detect listen through the same input and none of
it needs a model loaded.

- **Model** — pick a starter profile — *Starter Clean (A1)*, *Starter Clean (A2)*,
  *Starter Acoustic*, *Starter Warm* or *Starter Crunch* — or **Load .nam…** to use your
  own. A badge names the generation of the loaded model, and if a file uses a newer NAM
  format than Fretling fully supports, or carries built-in controls Fretling cannot set yet,
  the panel says so instead of sounding wrong in silence.
- **Monitor / Stop** — starts and stops live monitoring. Stopping genuinely releases the
  microphone; a loop that is playing keeps playing.
- **Output gain** — level out of the amp path.
- **Model input level** and **Model output level** — trim around the model itself, which is
  how you match a profile that was captured hot or quiet.
- **Model size** — appears for a model that carries several sizes of the same network, from
  *Light* up to *Full*. Smaller sizes cost less CPU and keep less detail; Full is the model
  as captured, and it is what loads by default.

## Input

Choosing an interface is not an amp question, so it does not live in the amp. The top bar
carries a microphone lamp and a level meter: the lamp is the master switch, and the meter
shows what is arriving before you open any tool at all. Press the meter to open the console,
which is where every input setting lives — for the amp, the tuner and Live Detect alike.

The lamp lights whenever the microphone is genuinely open *somewhere* — whether you opened
it yourself or the tuner, Live Detect or the amp's Monitor did. Pressing a lit lamp is
always the release: it lets go everywhere at once, and every tool listening through it
stops. A loop that is already playing keeps playing. On both platforms the same switch sits
in the **Input** menu as **Turn Microphone On / Off**, on `⌘⇧M`.

If the system refuses the microphone, the lamp shows a struck-through mic with a red rim and
the console opens by itself with the reason named and **Open Sound settings** — **Open
Settings** on iPad — in reach.

The console opens on **Level**, which is what you need mid-session, and keeps routing and
timing behind **Setup**.

- **Microphone** — the same master switch as the lamp. Under it a status line says what is
  happening, and when something else is holding the input it names what: *In use by Amp ·
  Tuner · Live Detect*, so turning it off is never a surprise.
- **Input gain** — applied before anything listens, so the amp, the tuner and Live Detect
  all hear the same level.

Under **Setup**:

- **Input device** — the interface your guitar is on. On Mac an audio device; on iPad one of
  the inputs iPadOS offers. Either way, if a saved one is gone the picker says so rather than
  failing silently.
- **Channel** — which of that interface's inputs your guitar is plugged into. It appears
  whenever the input has more than one, and says so plainly when there is nothing yet to
  choose between.
- **Route** (iPad) — what the input and output actually resolved to. iPadOS still picks the
  **output** for you: plug in headphones or an interface and it switches automatically. The
  console warns here when the route would feed back.
- **Buffer size** and **Sample rate** — the latency trade. Fretling supports 44.1, 48, 88.2,
  96 and 192 kHz. On iPad these are requests rather than settings: iPadOS answers them when
  the input starts, so a line under the pickers reports what it actually granted.
- **Latency** — the resulting monitoring latency, reported in milliseconds so the trade is a
  number rather than a guess.

Every slider has tick marks, a dB readout, and a double-click reset back to its default.

## Performance

Fretling does a lot at once — an amp model, a looper, the tuner and Live Detect listening,
the click — so the top bar shows how hard it is working, in a small readout to the left of
the microphone lamp. Two rows:

- **Audio** — how much of each audio cycle's time the audio engines are using. This is the
  number that predicts trouble: as it nears 100% the engine runs out of time to fill the
  next buffer, and you hear clicks or dropouts. The bar turns amber above 70% and red above
  90%.
- **CPU** — Fretling's share of your whole Mac or iPad, the number behind fans and battery.

Press the readout to open the Performance console. It shows the two audio engines
separately — **Playback** carries notes, chords and the click; **Amp** carries the amp model
and the looper, and reads *Not running* while the amp is down — each with the buffer it is
measured against (frames, sample rate, and the milliseconds a cycle has) and a count of
overloads: cycles that ran past their deadline since that engine started. Below a seam, the
CPU share, and a warning when the machine itself is running hot and may be slowing things
down.

If Audio runs hot, raise the buffer size in [Input settings](#input) or choose a smaller amp
model. A bigger buffer gives every cycle more time; a smaller model needs less of it.

## Looper

Record a phrase and play over it. The looper sits on the amp's monitoring path, so **turn
Monitor on in the amp first** — the looper says as much if you have not. Once a loop exists
it keeps playing on its own: turning Monitor off releases the microphone but leaves the loop
running, and Play brings it back even with the amp down.

One big button drives the take, and its label always says what it will do next:

- **Record** — starts the take, after the count-in if you set one; while the count runs, the
  same button reads **Cancel**. Press it again, now reading **Set Loop**, to close the loop
  and start it playing. With **Bars** set it closes itself on the bar line instead, and a
  free-length take closes at 60 seconds if you have not closed it yourself.
- **Overdub** — while the loop plays, press again to record a new layer on top of it;
  **End Overdub** keeps the layer. Stack as many as you like.
- **Undo / Redo** — takes back the last overdub layer, or puts it back.
- **Play / Stop** — stops the loop, and starts it again on the bar line. With the loop
  stopped, the big button reads **Record New**: press it and a fresh take replaces the old
  loop.
- **Clear** — throws the loop away.

Under the transport:

- **Bars** — *Free*, 1, 2, 4 or 8. With a length set, recording stops itself on the bar
  line, so the loop is in time without you catching it by hand; *Free* leaves the close to
  you.
- **Count-in** — *Off*, 1 or 2 bars of clicks before recording starts.
- **Click while recording** — keeps the metronome audible through the take.
- **Loop volume** — how loud the loop plays back under you.
- **Layer fade** — how much earlier layers fade back as you stack new ones on top.

The record button doubles as the beat readout: the count-in counts down to the punch, then
the beat counts up the bar, and a status line under the controls names the state —
recording, playing, overdubbing — with the bar and the time. Changing the sample rate clears
the loop — the recording no longer matches the engine — and the looper tells you when that
has happened.

Loops live in memory for the session only. Nothing is written to disk, and quitting the app
discards them.

## Mixer

One panel for every sound Fretling makes, so you can balance them instead of hunting for the
level that is too loud.

| Strip | Controls |
|-------|----------|
| **Notes** | Notes you tap on the neck, and scale playback. |
| **Chord** | Chords played from the timeline and the Chord Atlas. |
| **Prog** | Progression playback. |
| **Click** | Metronome and drums. |
| **Amp** | Your monitored guitar. |
| **Loop** | Looper playback. |
| **Main** | Master output. |

Every strip except Main has **mute** and **solo**; a badge on the panel reminds you when
something is muted or soloed, so a silent app is never a mystery. Levels persist between
sessions.

## Live Detect

Live Detect listens to what you play and marks it on the neck in real time, so you can check
that what you are fingering is what you think it is.

In [identify](learning-modes.md#identify-a-chord) mode it gains a **Send to fretboard**
button, which takes the notes it just heard and places them on the neck as an identification
query — play a chord you cannot name, send it over, and read the ranked answers.

## Microphone access

The tuner, Live Detect, and the amp all need audio input, so the first time you open one —
or turn the microphone on from the top bar — your device asks permission. Audio is analyzed
live and never recorded, stored, or transmitted. Capture stops when you close the tools, and
turning the microphone off from the [top bar](#input) releases it everywhere at once. Full
detail is in the [privacy policy](../privacy.html).
