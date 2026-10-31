# Chordling's site

Chordling's site: the product page, the user guide, what is free and what is Pro, and the
privacy policy, each in English and Latin American Spanish (`es/`). It is published from
the app repository by `Scripts/publish-site.sh` into the `chordling/` folder of Fretling's
public site repository, `adofito/fretling-site`, served at `www.fretling.app/chordling/` until
chordling.app is registered; edit it in the app repository, never there.

| Page | App Store field |
|---|---|
| `index.html` | Marketing URL |
| `guide.html` | Support URL |
| `privacy.html` | Privacy Policy URL |
| `free-and-pro.html` | — |

On launch day, flip `data-store-state="soon"` to `"live"` on the home page's call to
action, in both languages; nothing else changes.
