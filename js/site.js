/*
  Fretling user guide — the one script on the site.

  Five jobs:
    1. The appearance control (System / Light / Dark), mirroring the app's
       AppThemePreference.
    2. The sentence header: real dropdowns for the learning mode, the root note, and
       the scale or triad type, ordered the way StyledDropdown orders them.
    3. The chord picker that appears in Chords mode — the chords of the key, derived
       by stacking thirds inside the scale, with their Roman numerals.
    4. The marker display bar — the app's Labels / Shapes / Colors / Accidentals radio
       groups — driving the neck below it.
    5. Drawing that neck, sounding a note when one is tapped, and playing the scale,
       chord or triad the way the app's transport does.

  Every chip in the stage does what its shape promises. The three sentence chips and
  the four radio groups are live; nothing in the stage is a link wearing a control's
  uniform, because a visitor testing "say it, see it" should never be thrown out of
  the demo by a word that looked like a dropdown.

  renderFretboard() returns a string and touches no DOM, so the same function
  runs under Node to pre-render the default E Major neck into index.html. The
  page therefore shows a correct fretboard with scripting turned off; with
  scripting on, this file re-renders it from the current state.
*/
(function (global) {
  'use strict';

  /* ---------------------------------------------------------------
     Music model
     --------------------------------------------------------------- */

  var SHARP_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  var FLAT_NAMES  = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
  var INTERVAL_NAMES = ['R', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♭6', '6', '♭7', '7'];

  // The Spanish mirror (docs/website/es/) loads this same file with <html lang="es">.
  // Everything the script writes into the page at runtime goes through T(), so the
  // demo neck stays in the page's language after the first interaction; the scale
  // names match Fretling's own ScaleTypes table.
  // Guarded, because this line runs before the `module.exports` escape hatch below:
  // the pre-render command in README.md requires this file in node, where there is no
  // document at all. Unguarded, it threw and the neck could not be regenerated.
  // Prefix-matched, not equality: the Spanish pages declare `es-419` so a screen reader
  // picks a Latin American voice, and an exact test for "es" would have silently sent the
  // whole runtime — the scale names, the play button, all 54 marker labels — back to
  // English on every Spanish page.
  var LANG_ES = typeof document !== 'undefined'
    && /^es\b/i.test(document.documentElement.lang || '');
  var STRINGS_ES = {
    'More scales': 'Más escalas',
    'Play scale': 'Reproducir escala',
    'Play chord': 'Reproducir acorde',
    'Play triad': 'Reproducir tríada',
    'Stop': 'Detener',
    'scales': 'escalas', 'chords': 'acordes', 'triads': 'tríadas',
    'Major': 'Mayor', 'Minor': 'Menor',
    'Diminished': 'Disminuida', 'Augmented': 'Aumentada',
    'Pentatonic Major': 'Pentatónica mayor', 'Pentatonic Minor': 'Pentatónica menor',
    'Blues': 'Blues', 'Dorian': 'Dórico', 'Mixolydian': 'Mixolidio', 'Phrygian': 'Frigio',
    'Lydian': 'Lidio', 'Locrian': 'Locrio', 'Harmonic Minor': 'Menor armónica',
    'Melodic Minor': 'Menor melódica',
    'System': 'Sistema', 'Light': 'Claro', 'Dark': 'Oscuro',
    'Pro': 'Pro',
    'Now showing': 'Ahora se muestra'
  };
  function T(text) { return (LANG_ES && STRINGS_ES[text]) || text; }

  // Scale types. `lane: 'beginner'` are the four the app's menu shows first;
  // the rest sit under "More scales" (ScaleTypeMenuOrdering).
  var SCALES = [
    { id: 'major',            name: 'Major',            lane: 'beginner', steps: [0, 2, 4, 5, 7, 9, 11] },
    { id: 'minor',            name: 'Minor',            lane: 'beginner', steps: [0, 2, 3, 5, 7, 8, 10] },
    { id: 'pentatonic-major', name: 'Pentatonic Major', lane: 'beginner', steps: [0, 2, 4, 7, 9] },
    { id: 'pentatonic-minor', name: 'Pentatonic Minor', lane: 'beginner', steps: [0, 3, 5, 7, 10] },
    // `pro` marks the seven the unlock adds. The demo still plays them — this is a
    // marketing page, not the paywall — but a menu that gave no sign of the line while
    // the copy beside it said seven scales need Pro was the site disagreeing with itself.
    { id: 'blues',            name: 'Blues',            steps: [0, 3, 5, 6, 7, 10] },
    { id: 'dorian',           name: 'Dorian',           pro: true, steps: [0, 2, 3, 5, 7, 9, 10] },
    { id: 'mixolydian',       name: 'Mixolydian',       pro: true, steps: [0, 2, 4, 5, 7, 9, 10] },
    { id: 'phrygian',         name: 'Phrygian',         pro: true, steps: [0, 1, 3, 5, 7, 8, 10] },
    { id: 'lydian',           name: 'Lydian',           pro: true, steps: [0, 2, 4, 6, 7, 9, 11] },
    { id: 'locrian',          name: 'Locrian',          pro: true, steps: [0, 1, 3, 5, 6, 8, 10] },
    { id: 'harmonic-minor',   name: 'Harmonic Minor',   pro: true, steps: [0, 2, 3, 5, 7, 8, 11] },
    { id: 'melodic-minor',    name: 'Melodic Minor',    pro: true, steps: [0, 2, 3, 5, 7, 9, 11] }
  ];

  // The three learning modes the app ships. The words are lower case because they are
  // words in a sentence, not menu headings — the chip reads "I want to learn scales".
  var MODES = [
    { id: 'scales', name: 'scales' },
    { id: 'chords', name: 'chords' },
    { id: 'triads', name: 'triads' }
  ];

  // Triads mode picks a type rather than a scale; the chip is the same slot.
  var TRIADS = [
    { id: 'major',      name: 'Major',      steps: [0, 4, 7] },
    { id: 'minor',      name: 'Minor',      steps: [0, 3, 7] },
    { id: 'diminished', name: 'Diminished', steps: [0, 3, 6] },
    { id: 'augmented',  name: 'Augmented',  steps: [0, 4, 8] }
  ];

  // Quality is read off the intervals, never assumed from the degree: the same routine
  // has to be right for the modes and for harmonic minor, whose third degree carries an
  // augmented triad and whose seventh carries a diminished one.
  var QUALITIES = [
    { third: 4, fifth: 7, suffix: '',  minor: false, mark: '' },
    { third: 3, fifth: 7, suffix: 'm', minor: true,  mark: '' },
    { third: 3, fifth: 6, suffix: '°', minor: true,  mark: '°' },
    { third: 4, fifth: 8, suffix: '+', minor: false, mark: '+' }
  ];
  var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

  /* The chords of a key, built by stacking thirds inside the scale itself — so a mode
     gives the mode's chords and harmonic minor gives its augmented III. Five- and
     six-note scales have no thirds to stack, which is why Chords mode offers only the
     seven-note keys. A degree whose stack is not one of the four triad qualities is
     dropped rather than named wrongly. */
  function keyChords(rootPc, scaleId) {
    var steps = scaleById(scaleId).steps;
    if (steps.length !== 7) return [];
    var out = [];
    for (var d = 0; d < 7; d++) {
      var third = (steps[(d + 2) % 7] - steps[d] + 12) % 12;
      var fifth = (steps[(d + 4) % 7] - steps[d] + 12) % 12;
      var quality = null;
      for (var q = 0; q < QUALITIES.length; q++) {
        if (QUALITIES[q].third === third && QUALITIES[q].fifth === fifth) quality = QUALITIES[q];
      }
      if (!quality) continue;
      var numeral = quality.minor ? ROMAN[d].toLowerCase() : ROMAN[d];
      out.push({
        degree: d,
        root: (rootPc + steps[d]) % 12,
        steps: [0, third, fifth],
        suffix: quality.suffix,
        numeral: numeral + quality.mark
      });
    }
    return out;
  }

  function chordSymbol(chord, names) { return names[chord.root] + chord.suffix; }

  /* Which spelling a key takes — a port of `KeySignature` (Fretling/Models/KeySignature.swift).

     The signature belongs to the **parent major scale**, not to the tonic. Two shortcuts
     look right and are not, and both were written here first: reading the quality and
     using the tonic's own key spells C Mixolydian as C D E F G A A♯ when its notes are
     F major's, and sending minor keys to their relative major spells D Dorian with flats
     when its notes are C major's. So the parent is searched for: of the twelve major
     scales, the one containing most of the scale's notes, ties going to the smaller
     signature.

     Copied from the app rather than re-derived, for the same reason the silhouette
     ladder is: a hand-written mirror of a real rule diverges, and this page's whole
     claim is that it is the app's screen. */

  var FLAT_MAJOR_TONICS = [1, 3, 5, 8, 10];        // D♭ E♭ F A♭ B♭ (6 is F♯, sharp side)
  var SIGNATURE_SIZE = [0, 5, 2, 3, 4, 1, 6, 1, 4, 3, 2, 5];
  var AMBIGUOUS_TONIC = 6;                          // F♯ against G♭, six either way
  var MAJOR_OFFSETS = [0, 2, 4, 5, 7, 9, 11];
  var NATURAL_MINOR_OFFSETS = [0, 2, 3, 5, 7, 8, 10];

  function norm(value) { return ((value % 12) + 12) % 12; }

  function pitchClassesOf(rootPc, offsets) {
    var out = {};
    for (var i = 0; i < offsets.length; i++) out[norm(rootPc + offsets[i])] = true;
    return Object.keys(out).map(Number);
  }

  function majorPitchClasses(tonic) {
    return MAJOR_OFFSETS.map(function (o) { return norm(tonic + o); });
  }

  function parentMajorTonic(pitches) {
    var best = 0, bestScore = -1;
    for (var tonic = 0; tonic < 12; tonic++) {
      var scale = majorPitchClasses(tonic);
      var contained = pitches.filter(function (pc) { return scale.indexOf(pc) !== -1; }).length;
      if (contained > bestScore ||
          (contained === bestScore && SIGNATURE_SIZE[tonic] < SIGNATURE_SIZE[best])) {
        best = tonic;
        bestScore = contained;
      }
    }
    return best;
  }

  function distinctLetters(pitches, flats) {
    var names = flats ? FLAT_NAMES : SHARP_NAMES;
    var seen = {};
    pitches.forEach(function (pc) { seen[names[pc].charAt(0)] = true; });
    return Object.keys(seen).length;
  }

  function hasMinorThird(offsets) {
    var set = offsets.map(norm);
    return set.indexOf(3) !== -1 && set.indexOf(4) === -1;
  }

  function keyPrefersFlats(rootPc, offsets) {
    var pitches = pitchClassesOf(rootPc, offsets);
    var parent = parentMajorTonic(pitches);

    // A minor scale is never written with its parallel major's signature. Melodic minor
    // raises both the 6th and the 7th, which leaves it one note from the parallel and two
    // from the relative, so containment alone picks the wrong one.
    if (hasMinorThird(offsets) && parent === norm(rootPc)) {
      parent = parentMajorTonic(pitchClassesOf(rootPc, NATURAL_MINOR_OFFSETS));
    }

    // At six accidentals the spelling is a coin toss; the note names break it, and a true
    // tie keeps sharps, which is F♯ major's side.
    if (parent === AMBIGUOUS_TONIC) {
      return distinctLetters(pitches, true) > distinctLetters(pitches, false);
    }
    return FLAT_MAJOR_TONICS.indexOf(parent) !== -1;
  }

  // A triad is answered as the natural scale of its own quality, so one rule serves both.
  function triadPrefersFlats(rootPc, triadId) {
    var minorish = triadId === 'minor' || triadId === 'diminished';
    return keyPrefersFlats(rootPc, minorish ? NATURAL_MINOR_OFFSETS : MAJOR_OFFSETS);
  }

  function modeById(id) {
    for (var i = 0; i < MODES.length; i++) { if (MODES[i].id === id) return MODES[i]; }
    return MODES[0];
  }

  function triadById(id) {
    for (var i = 0; i < TRIADS.length; i++) { if (TRIADS[i].id === id) return TRIADS[i]; }
    return TRIADS[0];
  }

  // Chords mode needs a key with thirds in it.
  function keyScales() {
    return SCALES.filter(function (s) { return s.steps.length === 7; });
  }

  // Standard tuning, drawn high string first: e B G D A E.
  var STRINGS = [
    { label: 'e', midi: 64 },
    { label: 'B', midi: 59 },
    { label: 'G', midi: 55 },
    { label: 'D', midi: 50 },
    { label: 'A', midi: 45 },
    { label: 'E', midi: 40 }
  ];

  var MARKER_FRETS = [3, 5, 7, 9, 12, 15];
  var FRET_COUNT = 15;

  function scaleById(id) {
    for (var i = 0; i < SCALES.length; i++) { if (SCALES[i].id === id) return SCALES[i]; }
    return SCALES[0];
  }

  var DEFAULT_STATE = {
    mode: 'scales',          // scales | chords | triads
    root: 4,                 // E
    scale: 'major',          // the key, in Scales and Chords
    triad: 'major',          // the triad type, in Triads
    chord: 0,                // which chord of the key, in Chords
    labels: 'notes',         // notes | intervals | none
    shapes: 'intervals',     // circles | intervals
    colors: 'color',         // color | gray
    flats: false
  };

  /* What the neck is drawing, resolved from the mode.

     `root` is the pitch the interval colors are measured from — the key's root in
     Scales and Triads, and the chord's own root in Chords, because a player reading
     a chord wants its third and fifth, not the key's. `context` is the rest of the
     key: in Chords mode the app keeps those notes on the neck in flat gray so the
     chord can be seen inside the key it came from. */
  function subject(s) {
    if (s.mode === 'triads') {
      return { root: s.root, steps: triadById(s.triad).steps, context: [] };
    }
    if (s.mode === 'chords') {
      var chords = keyChords(s.root, s.scale);
      var chord = chords[Math.min(s.chord, chords.length - 1)];
      if (!chord) return { root: s.root, steps: scaleById(s.scale).steps, context: [] };
      var tones = chord.steps.map(function (st) { return (chord.root + st) % 12; });
      var context = scaleById(s.scale).steps
        .map(function (st) { return (s.root + st) % 12; })
        .filter(function (pc) { return tones.indexOf(pc) === -1; });
      return { root: chord.root, steps: chord.steps, context: context, chord: chord };
    }
    return { root: s.root, steps: scaleById(s.scale).steps, context: [] };
  }

  /* ---------------------------------------------------------------
     Geometry — proportions taken from the app's neck
     --------------------------------------------------------------- */

  var GEO = {
    padL: 10, padR: 10,
    openW: 48, fretW: 60,
    top: 34, rowH: 36,
    radius: 14
  };
  // Half the target square. 16 against a 14 marker radius, so even the narrowest
// silhouette keeps a 32-unit box — 24 CSS px once the neck is scaled down on a phone.
GEO.hit = 16;
GEO.nutX = GEO.padL + GEO.openW;
  GEO.boardW = FRET_COUNT * GEO.fretW;
  GEO.width = GEO.nutX + GEO.boardW + GEO.padR;
  GEO.boardH = STRINGS.length * GEO.rowH;
  GEO.bottom = GEO.top + GEO.boardH;
  GEO.height = GEO.bottom + 10;

  function stringY(i) { return GEO.top + GEO.rowH * (i + 0.5); }
  function fretCenterX(f) {
    return f === 0 ? GEO.padL + GEO.openW / 2 : GEO.nutX + (f - 0.5) * GEO.fretW;
  }

  /* ---------------------------------------------------------------
     Render — returns SVG markup, no DOM
     --------------------------------------------------------------- */

  /* `interactive` defaults to false, which is the state the baked SVG in index.html has
     to ship in: without scripting nothing can answer a press, and 54 elements announcing
     themselves as buttons to a screen reader is a promise the page cannot keep. The page
     re-renders once on load with it true. */
  function renderFretboard(state, interactive) {
    var s = {};
    for (var k in DEFAULT_STATE) { s[k] = (state && state[k] !== undefined) ? state[k] : DEFAULT_STATE[k]; }

    var subj = subject(s);
    var inScale = {};
    for (var i = 0; i < subj.steps.length; i++) { inScale[(subj.root + subj.steps[i]) % 12] = subj.steps[i]; }
    var context = {};
    for (var c = 0; c < subj.context.length; c++) { context[subj.context[c]] = true; }

    var names = s.flats ? FLAT_NAMES : SHARP_NAMES;
    var out = [];

    /* A group, not an image. `role="img"` makes every descendant presentational by
       spec, so the 54 note buttons inside it were reaching a screen reader only
       through one browser's error repair. The roving tabindex below then makes the
       whole neck one tab stop, which is the other half of the same problem: 54 stops
       to cross a diagram is not navigation. */
    out.push('<svg viewBox="0 0 ' + GEO.width + ' ' + GEO.height + '" role="group" ' +
      'aria-roledescription="fretboard" ' +
      'aria-label="' + esc(neckSummary(s, names)) + '">');

    // Fret numbers, with the app's warm-brown wells on the marker frets
    out.push('<g aria-hidden="true">');
    out.push('<text class="fb-open-label" x="' + fretCenterX(0) + '" y="26" text-anchor="middle">Open</text>');
    for (var f = 1; f <= FRET_COUNT; f++) {
      var cx = fretCenterX(f);
      var on = MARKER_FRETS.indexOf(f) !== -1;
      if (on) out.push('<circle class="fb-fretnum-bg" cx="' + cx + '" cy="21" r="10"/>');
      out.push('<text class="fb-fretnum' + (on ? ' fb-fretnum--on' : '') + '" x="' + cx +
        '" y="25.5" text-anchor="middle">' + f + '</text>');
    }
    out.push('</g>');

    // Frets, nut, strings
    out.push('<g aria-hidden="true">');
    for (var g = 1; g <= FRET_COUNT; g++) {
      var fx = GEO.nutX + g * GEO.fretW;
      out.push('<line class="fb-fret" x1="' + fx + '" y1="' + GEO.top + '" x2="' + fx + '" y2="' + GEO.bottom + '"/>');
    }
    out.push('<line class="fb-nut" x1="' + GEO.nutX + '" y1="' + (GEO.top + 2) + '" x2="' + GEO.nutX + '" y2="' + (GEO.bottom - 2) + '"/>');
    for (var t = 0; t < STRINGS.length; t++) {
      var sy = stringY(t);
      out.push('<line class="fb-string" x1="' + (GEO.nutX - GEO.openW + 20) + '" y1="' + sy + '" x2="' + (GEO.width - GEO.padR) + '" y2="' + sy + '"/>');
      out.push('<text class="fb-string-label" x="' + GEO.padL + '" y="' + (sy + 4) + '">' + STRINGS[t].label + '</text>');
    }
    out.push('</g>');

    // Markers. The lowest-pitched instance of each note is the primary one:
    // it blooms on playback, the rest echo (the app's NoteStrike model).
    var lowest = {};
    for (var st = 0; st < STRINGS.length; st++) {
      for (var fr = 0; fr <= FRET_COUNT; fr++) {
        var m = STRINGS[st].midi + fr;
        if (!((m % 12) in inScale)) continue;
        var key = m % 12;
        if (lowest[key] === undefined || m < lowest[key]) lowest[key] = m;
      }
    }

    var claimed = {};
    var first = true;   // one tab stop for the whole neck; arrows move inside it
    for (var st2 = 0; st2 < STRINGS.length; st2++) {
      for (var fr2 = 0; fr2 <= FRET_COUNT; fr2++) {
        var midi = STRINGS[st2].midi + fr2;
        var pc = midi % 12;
        var isTone = pc in inScale;
        if (!isTone && !(pc in context)) continue;

        var mx = fretCenterX(fr2);
        var semitone = isTone ? inScale[pc] : -1;
        var isRoot = semitone === 0;
        var isPrimary = isTone && lowest[pc] === midi && !claimed[pc];
        if (isPrimary) claimed[pc] = true;

        // A note of the key that the chord does not use stays on the neck in flat
        // gray, and keeps the plain circle: the silhouette ladder means an interval,
        // and this note has none to state.
        var cls = 'fb-marker' + (isRoot ? ' fb-marker--root' : '') +
          (isTone ? '' : ' fb-marker--context') +
          (!isTone || s.colors === 'gray' ? ' fb-t-gray' : ' fb-t-' + semitone);
        var label = s.labels === 'notes' ? names[pc]
          : (s.labels === 'intervals' && isTone) ? INTERVAL_NAMES[semitone] : '';

        out.push('<g class="' + cls + '"' +
          (interactive ? ' role="button" tabindex="' + (first ? '0' : '-1') + '"' : '') +
          ' data-midi="' + midi + '" data-string="' + st2 + '" data-fret="' + fr2 + '"' +
          (isTone ? ' data-degree="' + semitone + '"' : '') +
          (isPrimary ? ' data-primary="1"' : '') +
          ' style="--x:' + (mx / GEO.width).toFixed(3) + '"' +
          ' aria-label="' + esc(markerLabel(names[pc], STRINGS[st2].label, fr2)) + '">');
        out.push(markerShape(isTone ? s.shapes : 'circles', semitone, mx, stringY(st2), GEO.radius, s.flats));
        if (label) {
          out.push('<text x="' + mx + '" y="' + (stringY(st2) + 4.5) +
            '" text-anchor="middle" fill="var(--m-text)">' + label + '</text>');
        }
        /* The target, drawn last and invisible, because the silhouette is not the
           target: a triangle's own ink covers about half the square a finger needs, so
           the 3rd was the hardest degree to hit on the one control the caption tells
           you to tap. Last rather than first so `.fb-marker > :first-child` still means
           the shape, which every hover, ring and strike rule reads. */
        out.push('<rect class="fb-hit" x="' + (mx - GEO.hit) + '" y="' + (stringY(st2) - GEO.hit) +
          '" width="' + (GEO.hit * 2) + '" height="' + (GEO.hit * 2) + '" fill="transparent"/>');
        out.push('</g>');
        first = false;
      }
    }

    out.push('</svg>');
    return out.join('');
  }

  /* ---------------------------------------------------------------
     Marker silhouettes — the degree ladder

     A port of `IntervalShapeFactory` (Fretling/Views/IntervalShapes.swift), value for
     value, because the demo claims to be the app's screen rather than a picture of one.

     The corner count is the degree number: a circle for the root, the circle broken
     once for the 2nd, then three corners for the 3rd up to seven for the 7th. A lowered
     degree leans one way and a raised one the other, so a player learns two rules
     instead of twelve glyphs. The tritone follows the Accidentals chip, because the
     silhouette has to agree with the label sitting on it — ♭5 is a lowered fifth with
     five corners, ♯4 a raised fourth with four.

     This used to be four quality buckets: a hexagon for the perfect intervals, a square
     for the minor ones, a diamond for the tritone. That drew the root as a hexagon,
     which in the app is the 6th, and gave twelve degrees four outlines under a sentence
     promising each of them its own. A hand-written mirror of a real system diverges;
     the values below are copied rather than re-derived so the next divergence is a diff.
     --------------------------------------------------------------- */

  var LOWERED_TILT = -20, RAISED_TILT = 20;
  //                       R  ♭2  2  ♭3  3  4  —  5  ♭6  6  ♭7  7
  var DEGREE_BY_SEMITONE = [1, 2, 2, 3, 3, 4, 0, 5, 6, 6, 7, 7];
  var LOWERED_SEMITONES = [1, 3, 8, 10];

  // Radius grows as the corner count falls, because a polygon inscribed in the circle
  // carries less ink the fewer sides it has; rotation alternates so the odd degrees
  // stand on a point and the even ones on a flat.
  var POLYGON_METRICS = {
    3: { rotation: 0,  radiusScale: 1.30 },
    4: { rotation: 45, radiusScale: 1.20 },
    5: { rotation: 0,  radiusScale: 1.12 },
    6: { rotation: 30, radiusScale: 1.08 },
    7: { rotation: 0,  radiusScale: 1.05 }
  };
  var CORNER_SCALE = 0.15;   // absolute, not a fraction of the edge — see DESIGN.md
  var DOME_FLAT_OFFSET = 0.40;

  function intervalForm(semitone, preferFlats) {
    var n = ((semitone % 12) + 12) % 12;
    if (n === 6) {
      return preferFlats
        ? { degree: 5, tilt: LOWERED_TILT }
        : { degree: 4, tilt: RAISED_TILT };
    }
    return {
      degree: DEGREE_BY_SEMITONE[n],
      tilt: LOWERED_SEMITONES.indexOf(n) !== -1 ? LOWERED_TILT : 0
    };
  }

  function polygonPath(sides, cx, cy, base, metrics) {
    var radius = base * metrics.radiusScale;
    var start = -Math.PI / 2 + metrics.rotation * Math.PI / 180;
    var vertices = [];
    for (var i = 0; i < sides; i++) {
      var angle = start + i * 2 * Math.PI / sides;
      vertices.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
    }
    var edge = 2 * radius * Math.sin(Math.PI / sides);
    var corner = Math.min(base * CORNER_SCALE, edge * 0.45);

    function unit(a, b) {
      var dx = b[0] - a[0], dy = b[1] - a[1];
      var length = Math.max(Math.sqrt(dx * dx + dy * dy), 0.0001);
      return [dx / length, dy / length];
    }
    function fmt(p) { return p[0].toFixed(2) + ' ' + p[1].toFixed(2); }

    var d = [];
    for (var v = 0; v < sides; v++) {
      var previous = vertices[(v - 1 + sides) % sides];
      var current = vertices[v];
      var next = vertices[(v + 1) % sides];
      var entering = unit(previous, current), leaving = unit(current, next);
      var approach = [current[0] - entering[0] * corner, current[1] - entering[1] * corner];
      var departure = [current[0] + leaving[0] * corner, current[1] + leaving[1] * corner];
      d.push((v === 0 ? 'M' : 'L') + fmt(approach));
      d.push('Q' + fmt(current) + ' ' + fmt(departure));
    }
    d.push('Z');
    return d.join(' ');
  }

  /* The 2nd: the root's circle with one flat cut across it. It sits on its own centroid
     rather than the disc's center, so the lean pivots about the cell and the label keeps
     its clearance — the same reason the app lifts it. */
  function domePath(cx, cy, base) {
    var half = Math.acos(Math.min(Math.max(DOME_FLAT_OFFSET, -1), 1));
    var segment = half - Math.sin(half) * Math.cos(half);
    var lift = 2 * Math.pow(Math.sin(half), 3) / (3 * (Math.PI - segment));
    var center = cy + base * lift;
    var facing = Math.PI / 2;
    var sweep = 2 * Math.PI - 2 * half;
    var steps = 32;

    function at(angle) {
      return (cx + base * Math.cos(angle)).toFixed(2) + ' ' +
        (center + base * Math.sin(angle)).toFixed(2);
    }
    var d = ['M' + at(facing - half), 'L' + at(facing + half)];
    for (var step = 1; step <= steps; step++) {
      d.push('L' + at(facing + half + sweep * step / steps));
    }
    d.push('Z');
    return d.join(' ');
  }

  function markerShape(mode, semitone, cx, cy, r, preferFlats) {
    var fill = ' fill="var(--m-fill)"';
    if (mode !== 'intervals' || semitone < 0) {
      return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"' + fill + '/>';
    }

    var form = intervalForm(semitone, preferFlats);
    var lean = form.tilt
      ? ' transform="rotate(' + form.tilt + ' ' + cx + ' ' + cy + ')"'
      : '';

    if (form.degree === 1) {
      return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"' + fill + lean + '/>';
    }
    if (form.degree === 2) {
      return '<path d="' + domePath(cx, cy, r) + '"' + fill + lean + '/>';
    }
    var metrics = POLYGON_METRICS[form.degree] || POLYGON_METRICS[7];
    return '<path d="' + polygonPath(form.degree, cx, cy, r, metrics) + '"' + fill + lean + '/>';
  }

  /* What the neck is showing, named once so the summary, the announcement and any
     future readout cannot drift apart. */
  function subjectNaming(s, names) {
    if (s.mode === 'triads') {
      return {
        name: names[s.root] + ' ' + T(triadById(s.triad).name),
        kind: LANG_ES ? 'la tríada' : 'the triad'
      };
    }
    if (s.mode === 'chords') {
      var chords = keyChords(s.root, s.scale);
      var chord = chords[Math.min(s.chord, chords.length - 1)];
      var inKey = names[s.root] + ' ' + T(scaleById(s.scale).name);
      return {
        name: (chord ? chordSymbol(chord, names) : names[s.root])
          + (chord ? (LANG_ES ? ' (' + chord.numeral + ' de ' + inKey + ')'
                              : ' (' + chord.numeral + ' of ' + inKey + ')') : ''),
        kind: LANG_ES ? 'el acorde' : 'the chord'
      };
    }
    return {
      name: names[s.root] + ' ' + T(scaleById(s.scale).name),
      kind: LANG_ES ? 'la escala' : 'the scale'
    };
  }

  function neckSummary(s, names) {
    var naming = subjectNaming(s, names);
    var subjectName = naming.name, kind = naming.kind;
    if (LANG_ES) {
      return 'Diapasón con ' + subjectName +
        ' en afinación estándar, de la posición al aire al traste ' + FRET_COUNT +
        '. Cada marcador es una nota de ' + kind +
        ', coloreada según su intervalo desde la fundamental.';
    }
    return 'Fretboard showing ' + subjectName +
      ' in standard tuning, open position to fret ' + FRET_COUNT +
      '. Each marker is a note in ' + kind +
      ', colored by its interval from the root.';
  }

  function markerLabel(note, string, fret) {
    return LANG_ES
      ? note + ', cuerda ' + string + ', traste ' + fret + '. Reproducir'
      : note + ', string ' + string + ', fret ' + fret + '. Play';
  }

  function esc(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var API = {
    renderFretboard: renderFretboard,
    // Exposed so the port can be checked against the app's own battery cases; the page
    // itself never calls these.
    keyPrefersFlats: keyPrefersFlats,
    triadPrefersFlats: triadPrefersFlats,
    DEFAULT_STATE: DEFAULT_STATE,
    SCALES: SCALES,
    SHARP_NAMES: SHARP_NAMES,
    FLAT_NAMES: FLAT_NAMES
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = API; return; }
  global.Fretling = API;

  var reduceMotion = global.matchMedia
    ? global.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  /* ---------------------------------------------------------------
     Appearance control — System / Light / Dark
     --------------------------------------------------------------- */

  var THEMES = [
    { id: 'system', name: 'System' },
    { id: 'light',  name: 'Light' },
    { id: 'dark',   name: 'Dark' }
  ];
  var themePreference = 'system';

  function themeById(id) {
    for (var i = 0; i < THEMES.length; i++) { if (THEMES[i].id === id) return THEMES[i]; }
    return THEMES[0];
  }

  function applyTheme(pref) {
    var el = document.documentElement;
    if (pref === 'light' || pref === 'dark') { el.setAttribute('data-theme', pref); }
    else { el.removeAttribute('data-theme'); }
    try { localStorage.setItem('fretling-theme', pref); } catch (e) { /* private mode */ }

    themePreference = pref;
    var label = document.querySelector('[data-theme-label]');
    if (label) label.textContent = T(themeById(pref).name);
  }

  function initTheme() {
    var stored = 'system';
    try { stored = localStorage.getItem('fretling-theme') || 'system'; } catch (e) { /* ignore */ }
    applyTheme(stored);
    wireMenu(document.querySelector('[data-menu="theme"]'), function () {
      return THEMES.map(function (theme) {
        return { value: theme.id, label: T(theme.name), selected: theme.id === themePreference };
      });
    }, applyTheme);
  }

  /* ---------------------------------------------------------------
     Sound — tap a marker, hear the note (as on the app's neck)
     --------------------------------------------------------------- */

  var audioContext = null;
  var voices = [];

  function play(midi, when, gainScale) {
    var Ctor = global.AudioContext || global.webkitAudioContext;
    if (!Ctor) return 0;
    if (!audioContext) audioContext = new Ctor();
    if (audioContext.state === 'suspended') audioContext.resume();

    var at = (when || 0) + audioContext.currentTime;
    var freq = 440 * Math.pow(2, (midi - 69) / 12);
    var peak = 0.22 * (gainScale === undefined ? 1 : gainScale);

    var gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(peak, at + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.6);

    var tone = audioContext.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.setValueAtTime(Math.min(6000, freq * 8), at);

    [[1, 1], [2, 0.32], [3, 0.12]].forEach(function (partial) {
      var osc = audioContext.createOscillator();
      var level = audioContext.createGain();
      osc.type = partial[0] === 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq * partial[0], at);
      level.gain.setValueAtTime(partial[1], at);
      osc.connect(level).connect(tone);
      osc.start(at);
      osc.stop(at + 1.7);
      voices.push(osc);
    });

    tone.connect(gain).connect(audioContext.destination);
    return at;
  }

  function silence() {
    voices.forEach(function (osc) { try { osc.stop(); } catch (e) { /* already stopped */ } });
    voices = [];
  }

  /* ---------------------------------------------------------------
     The stage: sentence, marker display bar, neck
     --------------------------------------------------------------- */

  function initStage() {
    var stage = document.querySelector('[data-stage]');
    if (!stage) return;

    var board = stage.querySelector('[data-fretboard]');
    var playButton = stage.querySelector('[data-play]');
    var state = {
      mode: DEFAULT_STATE.mode,
      root: Number(stage.dataset.root || DEFAULT_STATE.root),
      scale: stage.dataset.scale || DEFAULT_STATE.scale,
      triad: DEFAULT_STATE.triad,
      chord: DEFAULT_STATE.chord,
      labels: DEFAULT_STATE.labels,
      shapes: DEFAULT_STATE.shapes,
      colors: DEFAULT_STATE.colors,
      flats: DEFAULT_STATE.flats
    };

    var runTimers = [];
    var running = false;
    var entranceDone = false;
    var announced = false;     // the live region stays quiet until the reader acts
    var flatsPinned = false;   // set the moment the reader picks a spelling themselves

    function names() { return state.flats ? FLAT_NAMES : SHARP_NAMES; }

    /* The key's own spelling, until the reader overrides it. Runs before every draw so
       the sentence, the neck, the chord menu and the tritone's silhouette all agree. */
    function followKeySignature() {
      if (flatsPinned) return;
      var wanted = state.mode === 'triads'
        ? triadPrefersFlats(state.root, state.triad)
        : keyPrefersFlats(state.root, scaleById(state.scale).steps);
      if (wanted === state.flats) return;
      state.flats = wanted;

      var group = stage.querySelector('[data-setting="flats"]');
      if (!group) return;
      var chips = group.querySelectorAll('[role="radio"]');
      for (var i = 0; i < chips.length; i++) {
        var on = (chips[i].dataset.value === 'flats') === state.flats;
        chips[i].setAttribute('aria-checked', String(on));
        chips[i].tabIndex = on ? 0 : -1;
      }
    }

    function draw(animate) {
      stopRun();
      followKeySignature();

      /* Every chip change rebuilds the board, and the rebuilt board always put its one
         tab stop back on the first marker — so a keyboard reader who had walked to the
         ninth fret and switched Labels lost their hand. Remember the string and fret,
         and put focus back on whatever is nearest to it. */
      var previous = document.activeElement;
      var held = previous && previous.closest && previous.closest('.fb-marker');
      var anchor = held
        ? { string: Number(held.dataset.string), fret: Number(held.dataset.fret) }
        : null;

      board.innerHTML = renderFretboard(state, true);
      if (animate && !reduceMotion.matches) {
        board.querySelector('svg').classList.add('is-entering');
      }
      if (anchor) restoreFocus(anchor);
      syncSentence();
      announceSubject();
    }

    /* The page's whole promise is "change a word and the neck redraws", and until now the
       redraw was silent to a screen reader: the SVG's label was rewritten in place, which
       nothing announces. The first call is swallowed, because a live region that speaks on
       load is noise rather than feedback. It also covers the one change the reader did not
       ask for — switching to Chords from a pentatonic moves the key, because chords are
       stacked thirds and five notes have none. */
    function announceSubject() {
      var status = stage.querySelector('[data-stage-status]');
      if (!status) return;
      if (!announced) { announced = true; return; }
      var naming = subjectNaming(state, names());
      status.textContent = T('Now showing') + ' ' + naming.name;
    }

    function restoreFocus(anchor) {
      var all = Array.prototype.slice.call(board.querySelectorAll('.fb-marker'));
      if (!all.length) return;
      var best = null;
      all.forEach(function (marker) {
        // Same string first, then the nearest fret on it; the whole neck as a fallback,
        // because a mode change can empty the string the reader was standing on.
        var distance = Math.abs(Number(marker.dataset.fret) - anchor.fret)
          + Math.abs(Number(marker.dataset.string) - anchor.string) * 100;
        if (!best || distance < best.distance) best = { marker: marker, distance: distance };
      });
      if (!best) return;
      all.forEach(function (m) { m.setAttribute('tabindex', m === best.marker ? '0' : '-1'); });
      best.marker.focus();
    }

    /* The sentence is the readout as well as the control: every chip says what it is
       set to, and the chord slot only exists in the mode that has chords. */
    function syncSentence() {
      var mode = stage.querySelector('[data-sentence-mode]');
      if (mode) mode.textContent = T(modeById(state.mode).name);

      var note = stage.querySelector('[data-sentence-note]');
      if (note) note.textContent = names()[state.root];

      var scale = stage.querySelector('[data-sentence-scale]');
      if (scale) {
        scale.textContent = state.mode === 'triads'
          ? T(triadById(state.triad).name)
          : T(scaleById(state.scale).name);
      }

      var slot = stage.querySelector('[data-chord-slot]');
      var chords = keyChords(state.root, state.scale);
      var chord = chords[Math.min(state.chord, chords.length - 1)];
      if (slot) {
        var showing = state.mode === 'chords' && !!chord;
        slot.hidden = !showing;
        if (showing) {
          var label = stage.querySelector('[data-sentence-chord]');
          if (label) label.textContent = chordSymbol(chord, names());
        }
      }

      if (playButton) {
        var idle = state.mode === 'chords' ? 'Play chord'
          : state.mode === 'triads' ? 'Play triad' : 'Play scale';
        playButton.dataset.idleLabel = idle;
        if (!running) playButton.querySelector('[data-play-label]').textContent = T(idle);
      }
    }

    /* -- Playing the scale up its degrees ---------------------------------- */

    function stopRun() {
      runTimers.forEach(clearTimeout);
      runTimers = [];
      silence();
      running = false;
      if (playButton) {
        playButton.setAttribute('aria-pressed', 'false');
        playButton.querySelector('[data-play-label]').textContent =
          T(playButton.dataset.idleLabel || 'Play scale');
      }
      var lit = board.querySelectorAll('.is-ringing, .is-echoing');
      for (var i = 0; i < lit.length; i++) lit[i].classList.remove('is-ringing', 'is-echoing');
    }

    function runSubject(withSound) {
      stopRun();
      /* `running` means "sounding", not "animating". The neck runs itself once, silently,
         when it scrolls into view; while that played, `running` was true and the control
         labeled "Play scale" performed Stop for about a second — so a reader who reached
         straight for it got silence. */
      running = withSound;
      if (withSound && playButton) {
        playButton.setAttribute('aria-pressed', 'true');
        playButton.querySelector('[data-play-label]').textContent = T('Stop');
      }

      // Degrees of the subject, then the octave — the app's ascending run. A chord is
      // the same notes rolled fast enough to land as one voicing rather than a scale.
      var subj = subject(state);
      var sequence = subj.steps.slice().concat([12]);
      var chordal = state.mode === 'chords';
      var gap = chordal ? (withSound ? 70 : 55) : (withSound ? 190 : 70);
      // Root an octave above the low open strings, so the run sits in a
      // register that reads on small speakers.
      var base = 52 + ((subj.root - 4) % 12 + 12) % 12;

      sequence.forEach(function (semitone, index) {
        var timer = setTimeout(function () {
          var degree = semitone % 12;
          var group = board.querySelectorAll('[data-degree="' + degree + '"]');
          for (var i = 0; i < group.length; i++) {
            var isPrimary = group[i].hasAttribute('data-primary');
            group[i].classList.add(isPrimary ? 'is-ringing' : 'is-echoing');
            (function (el, primary) {
              setTimeout(function () {
                el.classList.remove(primary ? 'is-ringing' : 'is-echoing');
              }, primary ? 460 : 620);
            })(group[i], isPrimary);
          }
          if (withSound) play(base + semitone);
          if (index === sequence.length - 1) {
            runTimers.push(setTimeout(stopRun, withSound ? (chordal ? 1500 : 900) : 400));
          }
        }, index * gap);
        runTimers.push(timer);
      });
    }

    if (playButton) {
      playButton.addEventListener('click', function () {
        if (running) stopRun(); else runSubject(true);
      });
    }

    /* -- Marker display bar: four radio groups ------------------------------ */

    var groups = stage.querySelectorAll('[role="radiogroup"]');
    for (var i = 0; i < groups.length; i++) { wireGroup(groups[i]); }

    function wireGroup(group) {
      var chips = Array.prototype.slice.call(group.querySelectorAll('[role="radio"]'));

      function select(chip) {
        if (group.dataset.state === 'disabled') return;
        chips.forEach(function (other) {
          var on = other === chip;
          other.setAttribute('aria-checked', String(on));
          other.tabIndex = on ? 0 : -1;
        });
        var key = group.dataset.setting;
        var value = chip.dataset.value;
        if (key === 'flats') {
          state.flats = value === 'flats';
          flatsPinned = true;    // an explicit choice outranks the key signature
        } else {
          state[key] = value;
        }
        if (key === 'labels') syncAccidentals();
        draw(true);
      }

      group.addEventListener('click', function (event) {
        var chip = event.target.closest('[role="radio"]');
        if (chip) select(chip);
      });

      group.addEventListener('keydown', function (event) {
        var index = chips.indexOf(document.activeElement);
        if (index === -1) return;
        var next = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = chips[(index + 1) % chips.length];
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = chips[(index - 1 + chips.length) % chips.length];
        if (!next) return;
        event.preventDefault();
        next.focus();
        select(next);
      });
    }

    // Accidentals are disabled and dimmed — never hidden — when Labels ≠ Notes.
    function syncAccidentals() {
      var group = stage.querySelector('[data-setting="flats"]');
      if (!group) return;
      var active = state.labels === 'notes';
      group.dataset.state = active ? 'enabled' : 'disabled';
      var chips = group.querySelectorAll('[role="radio"]');
      for (var i = 0; i < chips.length; i++) {
        chips[i].disabled = !active;
        chips[i].setAttribute('aria-disabled', String(!active));
      }
    }

    /* -- Tap a marker to hear it -------------------------------------------- */

    function strike(marker) {
      stopRun();
      play(Number(marker.dataset.midi));
      marker.classList.add('is-ringing');
      setTimeout(function () { marker.classList.remove('is-ringing'); }, 460);
    }

    board.addEventListener('click', function (event) {
      var marker = event.target.closest('.fb-marker');
      if (marker) strike(marker);
    });

    /* Arrows walk the neck the way a hand does: along the string, or across to the
       nearest note on the neighbouring one. The roving tabindex means Tab enters the
       neck once and leaves it once — it used to cost 54 stops, more than half of every
       tab stop on the page. */
    function markers() {
      return Array.prototype.slice.call(board.querySelectorAll('.fb-marker'));
    }

    function focusMarker(marker) {
      if (!marker) return;
      markers().forEach(function (other) { other.setAttribute('tabindex', other === marker ? '0' : '-1'); });
      marker.focus();
    }

    function step(from, direction) {
      var all = markers();
      var string = Number(from.dataset.string);
      var fret = Number(from.dataset.fret);
      var onString = all.filter(function (m) { return Number(m.dataset.string) === string; });

      if (direction === 'next' || direction === 'prev') {
        var index = onString.indexOf(from) + (direction === 'next' ? 1 : -1);
        return onString[index] || null;
      }
      if (direction === 'first' || direction === 'last') {
        return direction === 'first' ? onString[0] : onString[onString.length - 1];
      }
      // Up and down cross strings and keep the hand where it is: the nearest fret.
      var target = string + (direction === 'up' ? -1 : 1);
      if (target < 0 || target >= STRINGS.length) return null;
      var candidates = all.filter(function (m) { return Number(m.dataset.string) === target; });
      var best = null;
      candidates.forEach(function (m) {
        var distance = Math.abs(Number(m.dataset.fret) - fret);
        if (!best || distance < best.distance) best = { marker: m, distance: distance };
      });
      return best ? best.marker : null;
    }

    var ARROWS = {
      ArrowRight: 'next', ArrowLeft: 'prev',
      ArrowUp: 'up', ArrowDown: 'down',
      Home: 'first', End: 'last'
    };

    board.addEventListener('keydown', function (event) {
      var marker = event.target.closest('.fb-marker');
      if (!marker) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        strike(marker);
        return;
      }
      var direction = ARROWS[event.key];
      if (!direction) return;
      var next = step(marker, direction);
      if (!next) return;
      event.preventDefault();
      focusMarker(next);
    });

    /* -- Sentence dropdowns -------------------------------------------------- */

    wireMenu(stage.querySelector('[data-menu="mode"]'), function () {
      return MODES.map(function (mode) {
        return { value: mode.id, label: T(mode.name), selected: mode.id === state.mode };
      });
    }, function (value) {
      state.mode = value;
      // Chords are stacked thirds, so the key has to be a seven-note scale. Coming from
      // a pentatonic, fall back to the nearest seven-note key rather than showing a mode
      // with nothing in it.
      if (state.mode === 'chords' && scaleById(state.scale).steps.length !== 7) {
        state.scale = /minor/.test(state.scale) ? 'minor' : 'major';
      }
      draw(true);
    });

    wireMenu(stage.querySelector('[data-menu="root"]'), function () {
      return names().map(function (name, pc) {
        return { value: String(pc), label: name, selected: pc === state.root };
      });
    }, function (value) {
      state.root = Number(value);
      draw(true);
    }, { columns: 3 });

    wireMenu(stage.querySelector('[data-menu="scale"]'), function () {
      if (state.mode === 'triads') {
        return TRIADS.map(function (triad) {
          return { value: triad.id, label: T(triad.name), selected: triad.id === state.triad };
        });
      }
      var list = state.mode === 'chords' ? keyScales() : SCALES;
      return list.map(function (scale) {
        return {
          value: scale.id,
          label: T(scale.name),
          selected: scale.id === state.scale,
          detail: scale.pro ? T('Pro') : null,
          section: scale.lane === 'beginner' ? null : T('More scales')
        };
      });
    }, function (value) {
      if (state.mode === 'triads') state.triad = value; else state.scale = value;
      draw(true);
    });

    wireMenu(stage.querySelector('[data-menu="chord"]'), function () {
      var chords = keyChords(state.root, state.scale);
      return chords.map(function (chord, index) {
        return {
          value: String(index),
          label: chordSymbol(chord, names()),
          detail: chord.numeral,
          selected: index === Math.min(state.chord, chords.length - 1)
        };
      });
    }, function (value) {
      state.chord = Number(value);
      draw(true);
    });

    /* -- First view: run the scale silently, once ---------------------------- */

    if (!reduceMotion.matches && 'IntersectionObserver' in global) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || entranceDone) return;
          entranceDone = true;
          observer.disconnect();
          setTimeout(function () { runSubject(false); }, 260);
        });
      }, { threshold: 0.35 });
      observer.observe(board);
    }

    syncAccidentals();
    // The baked SVG ships inert (see renderFretboard); this is the upgrade to the
    // interactive one, and it is also what puts the roving tabindex in place.
    draw(false);
  }

  /* ---------------------------------------------------------------
     Dropdown menus — StyledDropdown, on the web
     --------------------------------------------------------------- */

  function wireMenu(wrap, buildItems, onPick, options) {
    if (!wrap) return;
    var button = wrap.querySelector('.chip, .theme-button');
    var panel = wrap.querySelector('.chip-menu');
    if (!button || !panel) return;
    var columns = (options && options.columns) || 1;

    function close(focusButton) {
      if (!wrap.classList.contains('is-open')) return;
      wrap.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
      if (focusButton) button.focus();
    }

    function open() {
      panel.innerHTML = '';
      var section = null;
      buildItems().forEach(function (item) {
        if (item.section && item.section !== section) {
          section = item.section;
          var heading = document.createElement('p');
          heading.className = 'chip-menu-section';
          heading.textContent = section;
          panel.appendChild(heading);
        }
        var option = document.createElement('button');
        option.type = 'button';
        option.className = 'chip-menu-item';
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', String(!!item.selected));
        option.dataset.value = item.value;
        if (item.detail) {
          // The chord's Roman numeral rides in its own column, the way the Atlas
          // carries it: the symbol names the chord, the numeral places it in the key.
          var name = document.createElement('span');
          name.textContent = item.label;
          var detail = document.createElement('span');
          detail.className = 'chip-menu-detail';
          detail.textContent = item.detail;
          option.classList.add('chip-menu-item--split');
          option.appendChild(name);
          option.appendChild(detail);
        } else {
          option.textContent = item.label;
        }
        panel.appendChild(option);
      });

      panel.hidden = false;
      wrap.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
      var selected = panel.querySelector('[aria-selected="true"]') || panel.querySelector('.chip-menu-item');
      if (selected) selected.focus();
    }

    button.addEventListener('click', function () {
      if (wrap.classList.contains('is-open')) close(true); else open();
    });

    panel.addEventListener('click', function (event) {
      var option = event.target.closest('.chip-menu-item');
      if (!option) return;
      onPick(option.dataset.value);
      close(true);
    });

    panel.addEventListener('keydown', function (event) {
      var items = Array.prototype.slice.call(panel.querySelectorAll('.chip-menu-item'));
      var index = items.indexOf(document.activeElement);
      if (event.key === 'Escape') { event.preventDefault(); close(true); return; }
      if (event.key === 'Tab') { close(false); return; }
      if (index === -1) return;
      // In a grid — the root note's three-column chromatic keypad — Down means the row
      // below, not the next item. Down from E used to land on F, which is what a list
      // does and not what the reader is looking at.
      function move(delta) {
        event.preventDefault();
        items[(index + delta + items.length) % items.length].focus();
      }
      if (event.key === 'ArrowDown') move(columns);
      if (event.key === 'ArrowUp') move(-columns);
      if (columns > 1 && event.key === 'ArrowRight') move(1);
      if (columns > 1 && event.key === 'ArrowLeft') move(-1);
      if (event.key === 'Home') { event.preventDefault(); items[0].focus(); }
      if (event.key === 'End') { event.preventDefault(); items[items.length - 1].focus(); }
    });

    document.addEventListener('pointerdown', function (event) {
      if (!wrap.contains(event.target)) close(false);
    });
  }

  /* ---------------------------------------------------------------
     Boot
     --------------------------------------------------------------- */

  /*
    The header is one row, or it says so and stops pinning.

    A breakpoint cannot answer this, because the question is not how wide the window is
    but whether these particular labels fit in it: the Spanish nav is 781px against the
    English 624px, so between about 1000 and 1160px English fits on one line and Spanish
    does not.

    The measurement lays the row out at `max-content` — with the wrapped class off and
    the container's cap lifted — and reads what it actually came to. An earlier version
    added up the nav's list items instead, which came to 1086px for Spanish and missed
    the truth by enough to leave a 50px band where the header was two rows and still
    pinned: exactly the defect this exists to prevent. Summing the parts of a flex row is
    guessing; asking the layout engine is not.

    Two details keep it honest. The class comes off before measuring, because it is what
    forces the nav to a full-width row — measuring with it on would make the evidence a
    product of the conclusion, and the header would latch. And a reentrancy flag stops
    the observer reacting to the reflow the measurement itself causes.
  */
  function initStickyGuard() {
    var header = document.querySelector('.site-header');
    var inner = header && header.querySelector('.header-inner');
    if (!inner) return;
    var measuring = false;

    function check() {
      if (measuring) return;
      measuring = true;

      header.classList.remove('is-wrapped');

      var available = inner.getBoundingClientRect().width;
      var savedWidth = inner.style.width;
      var savedMaxWidth = inner.style.maxWidth;
      inner.style.maxWidth = 'none';
      inner.style.width = 'max-content';
      var needed = inner.getBoundingClientRect().width;
      inner.style.width = savedWidth;
      inner.style.maxWidth = savedMaxWidth;

      header.classList.toggle('is-wrapped', needed > available + 0.5);
      measuring = false;
    }

    if (global.ResizeObserver) new ResizeObserver(check).observe(inner);
    global.addEventListener('resize', check);
    check();
  }

  /* Everything in the stage ships disabled and is enabled here.

     Without scripting the stylesheet hid only the theme control and the transport, so
     the mode, root, scale and chord chips and all nine display chips still rendered as
     controls — 68 of them, under a caption saying they worked. A control the page cannot
     honor should not be in the tab order or the accessibility tree as a button, and
     shipping them disabled is the only version of that which is true before the script
     runs rather than after. */
  function enableStageControls() {
    var pending = document.querySelectorAll('[data-needs-js][disabled]');
    for (var i = 0; i < pending.length; i++) pending[i].disabled = false;
  }

  function init() { enableStageControls(); initTheme(); initStage(); initStickyGuard(); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})(typeof globalThis !== 'undefined' ? globalThis : this);
