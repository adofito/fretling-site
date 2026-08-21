/*
  Fretling user guide — the one script on the site.

  Four jobs:
    1. The appearance control (System / Light / Dark), mirroring the app's
       AppThemePreference.
    2. The sentence header: real dropdowns for the root note and the scale
       type, ordered the way StyledDropdown orders them.
    3. The marker display bar — the app's Labels / Colors / Accidentals radio
       groups — driving the neck below it.
    4. Drawing that neck, sounding a note when one is tapped, and playing the
       scale up its degrees the way the app's Play Scale button does.

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

  // Scale types. `lane: 'beginner'` are the four the app's menu shows first;
  // the rest sit under "More scales" (ScaleTypeMenuOrdering).
  var SCALES = [
    { id: 'major',            name: 'Major',            lane: 'beginner', steps: [0, 2, 4, 5, 7, 9, 11] },
    { id: 'minor',            name: 'Minor',            lane: 'beginner', steps: [0, 2, 3, 5, 7, 8, 10] },
    { id: 'pentatonic-major', name: 'Pentatonic Major', lane: 'beginner', steps: [0, 2, 4, 7, 9] },
    { id: 'pentatonic-minor', name: 'Pentatonic Minor', lane: 'beginner', steps: [0, 3, 5, 7, 10] },
    { id: 'blues',            name: 'Blues',            steps: [0, 3, 5, 6, 7, 10] },
    { id: 'dorian',           name: 'Dorian',           steps: [0, 2, 3, 5, 7, 9, 10] },
    { id: 'mixolydian',       name: 'Mixolydian',       steps: [0, 2, 4, 5, 7, 9, 10] },
    { id: 'phrygian',         name: 'Phrygian',         steps: [0, 1, 3, 5, 7, 8, 10] },
    { id: 'lydian',           name: 'Lydian',           steps: [0, 2, 4, 6, 7, 9, 11] },
    { id: 'locrian',          name: 'Locrian',          steps: [0, 1, 3, 5, 6, 8, 10] },
    { id: 'harmonic-minor',   name: 'Harmonic Minor',   steps: [0, 2, 3, 5, 7, 8, 11] },
    { id: 'melodic-minor',    name: 'Melodic Minor',    steps: [0, 2, 3, 5, 7, 9, 11] }
  ];

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
    root: 4,                 // E
    scale: 'major',
    labels: 'notes',         // notes | intervals | none
    colors: 'color',         // color | gray
    flats: false
  };

  /* ---------------------------------------------------------------
     Geometry — proportions taken from the app's neck
     --------------------------------------------------------------- */

  var GEO = {
    padL: 10, padR: 10,
    openW: 48, fretW: 60,
    top: 34, rowH: 36,
    radius: 14
  };
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

  function renderFretboard(state) {
    var s = {};
    for (var k in DEFAULT_STATE) { s[k] = (state && state[k] !== undefined) ? state[k] : DEFAULT_STATE[k]; }

    var steps = scaleById(s.scale).steps;
    var inScale = {};
    for (var i = 0; i < steps.length; i++) { inScale[(s.root + steps[i]) % 12] = steps[i]; }

    var names = s.flats ? FLAT_NAMES : SHARP_NAMES;
    var out = [];

    out.push('<svg viewBox="0 0 ' + GEO.width + ' ' + GEO.height + '" role="img" ' +
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
    for (var st2 = 0; st2 < STRINGS.length; st2++) {
      for (var fr2 = 0; fr2 <= FRET_COUNT; fr2++) {
        var midi = STRINGS[st2].midi + fr2;
        var pc = midi % 12;
        if (!(pc in inScale)) continue;

        var semitone = inScale[pc];
        var isRoot = semitone === 0;
        var isPrimary = lowest[pc] === midi && !claimed[pc];
        if (isPrimary) claimed[pc] = true;
        var mx = fretCenterX(fr2);
        var cls = 'fb-marker' + (isRoot ? ' fb-marker--root' : '') +
          (s.colors === 'gray' ? ' fb-t-gray' : ' fb-t-' + semitone);
        var label = s.labels === 'notes' ? names[pc]
          : s.labels === 'intervals' ? INTERVAL_NAMES[semitone] : '';

        out.push('<g class="' + cls + '" role="button" tabindex="0"' +
          ' data-midi="' + midi + '" data-degree="' + semitone + '"' +
          (isPrimary ? ' data-primary="1"' : '') +
          ' style="--x:' + (mx / GEO.width).toFixed(3) + '"' +
          ' aria-label="' + esc(names[pc] + ', string ' + STRINGS[st2].label + ', fret ' + fr2 + '. Play') + '">');
        out.push('<circle cx="' + mx + '" cy="' + stringY(st2) + '" r="' + GEO.radius + '" fill="var(--m-fill)"/>');
        if (label) {
          out.push('<text x="' + mx + '" y="' + (stringY(st2) + 4.5) +
            '" text-anchor="middle" fill="var(--m-text)">' + label + '</text>');
        }
        out.push('</g>');
      }
    }

    out.push('</svg>');
    return out.join('');
  }

  function neckSummary(s, names) {
    return 'Fretboard showing ' + names[s.root] + ' ' + scaleById(s.scale).name +
      ' in standard tuning, open position to fret ' + FRET_COUNT +
      '. Each marker is a note in the scale, colored by its interval from the root.';
  }

  function esc(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var API = {
    renderFretboard: renderFretboard,
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

  function applyTheme(pref) {
    var el = document.documentElement;
    if (pref === 'light' || pref === 'dark') { el.setAttribute('data-theme', pref); }
    else { el.removeAttribute('data-theme'); }
    try { localStorage.setItem('fretling-theme', pref); } catch (e) { /* private mode */ }

    var buttons = document.querySelectorAll('.theme-control button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].dataset.theme === pref));
    }
  }

  function initTheme() {
    var stored = 'system';
    try { stored = localStorage.getItem('fretling-theme') || 'system'; } catch (e) { /* ignore */ }
    applyTheme(stored);
    var control = document.querySelector('.theme-control');
    if (!control) return;
    control.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-theme]');
      if (button) applyTheme(button.dataset.theme);
    });
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
      root: Number(stage.dataset.root || DEFAULT_STATE.root),
      scale: stage.dataset.scale || DEFAULT_STATE.scale,
      labels: DEFAULT_STATE.labels,
      colors: DEFAULT_STATE.colors,
      flats: DEFAULT_STATE.flats
    };

    var runTimers = [];
    var running = false;
    var entranceDone = false;

    function names() { return state.flats ? FLAT_NAMES : SHARP_NAMES; }

    function draw(animate) {
      stopRun();
      board.innerHTML = renderFretboard(state);
      if (animate && !reduceMotion.matches) {
        board.querySelector('svg').classList.add('is-entering');
      }
      syncSentence();
    }

    function syncSentence() {
      var note = stage.querySelector('[data-sentence-note]');
      if (note) note.textContent = names()[state.root];
      var scale = stage.querySelector('[data-sentence-scale]');
      if (scale) scale.textContent = scaleById(state.scale).name;
    }

    /* -- Playing the scale up its degrees ---------------------------------- */

    function stopRun() {
      runTimers.forEach(clearTimeout);
      runTimers = [];
      silence();
      running = false;
      if (playButton) {
        playButton.setAttribute('aria-pressed', 'false');
        playButton.querySelector('[data-play-label]').textContent = 'Play scale';
      }
      var lit = board.querySelectorAll('.is-ringing, .is-echoing');
      for (var i = 0; i < lit.length; i++) lit[i].classList.remove('is-ringing', 'is-echoing');
    }

    function runScale(withSound) {
      stopRun();
      running = true;
      if (withSound && playButton) {
        playButton.setAttribute('aria-pressed', 'true');
        playButton.querySelector('[data-play-label]').textContent = 'Stop';
      }

      // Degrees of the scale, then the octave — the app's ascending run.
      var steps = scaleById(state.scale).steps.slice();
      var sequence = steps.concat([12]);
      var gap = withSound ? 190 : 70;
      // Root an octave above the low open strings, so the run sits in a
      // register that reads on small speakers.
      var base = 52 + ((state.root - 4) % 12 + 12) % 12;

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
            runTimers.push(setTimeout(stopRun, withSound ? 900 : 400));
          }
        }, index * gap);
        runTimers.push(timer);
      });
    }

    if (playButton) {
      playButton.addEventListener('click', function () {
        if (running) stopRun(); else runScale(true);
      });
    }

    /* -- Marker display bar: three radio groups ----------------------------- */

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
        if (key === 'flats') state.flats = value === 'flats';
        else state[key] = value;
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

    board.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var marker = event.target.closest('.fb-marker');
      if (!marker) return;
      event.preventDefault();
      strike(marker);
    });

    /* -- Sentence dropdowns -------------------------------------------------- */

    wireMenu(stage.querySelector('[data-menu="root"]'), function () {
      return names().map(function (name, pc) {
        return { value: String(pc), label: name, selected: pc === state.root };
      });
    }, function (value) {
      state.root = Number(value);
      draw(true);
    });

    wireMenu(stage.querySelector('[data-menu="scale"]'), function () {
      return SCALES.map(function (scale) {
        return {
          value: scale.id,
          label: scale.name,
          selected: scale.id === state.scale,
          section: scale.lane === 'beginner' ? null : 'More scales'
        };
      });
    }, function (value) {
      state.scale = value;
      draw(true);
    });

    /* -- First view: run the scale silently, once ---------------------------- */

    if (!reduceMotion.matches && 'IntersectionObserver' in global) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || entranceDone) return;
          entranceDone = true;
          observer.disconnect();
          setTimeout(function () { runScale(false); }, 260);
        });
      }, { threshold: 0.35 });
      observer.observe(board);
    }

    syncAccidentals();
    syncSentence();
  }

  /* ---------------------------------------------------------------
     Dropdown menus — StyledDropdown, on the web
     --------------------------------------------------------------- */

  function wireMenu(wrap, buildItems, onPick) {
    if (!wrap) return;
    var button = wrap.querySelector('.chip');
    var panel = wrap.querySelector('.chip-menu');
    if (!button || !panel) return;

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
        option.textContent = item.label;
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
      if (event.key === 'ArrowDown') { event.preventDefault(); items[(index + 1) % items.length].focus(); }
      if (event.key === 'ArrowUp') { event.preventDefault(); items[(index - 1 + items.length) % items.length].focus(); }
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

  function init() { initTheme(); initStage(); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})(typeof globalThis !== 'undefined' ? globalThis : this);
