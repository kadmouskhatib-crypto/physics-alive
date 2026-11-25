# Physics Alive V2

Experience → Predict → Experiment → Measure → Discover → Understand → Apply → Remember.

Plain HTML/CSS/JS, no framework, no build step. Works offline after the first visit (service worker).

## Files
| Path | Role |
|---|---|
| `index.html` | App shell (top bar, 4 modes, dialogs) |
| `css/app.css` | Design tokens, dark + light themes, RTL-safe layout |
| `js/i18n.js` | Interface text in EN / FR / AR |
| `js/core.js` | Shared engine: modes, highlights, Practice grading, Textbook, encrypted vault, Notebook, PDF, progress export/import |
| `lessons/coulomb.js` | One lesson: physics engine, lab, text in 3 languages, formulas, practice |
| `vault/*.enc.json` | Original textbook text, AES-256-GCM encrypted. The password is never stored in the site |
| `scripts/encrypt-vault.mjs` | Re-encrypt the original text / change the password |
| `scripts/build-sw.mjs` | Regenerate `sw.js` (run after every change) |

## Add a lesson
Copy `lessons/coulomb.js` and keep the same object shape: `id, ref, title, i18n, formulas, summary, textbook, practice, vault, mount, onLang, progress, recordsTable, loadLab`.
Compute every practice answer with the lesson's own physics functions, so the lab, examples and grading always agree.

## Add a language
Add a block to `js/i18n.js` (with `dir:'rtl'` if needed) and the same keys in each lesson's `i18n`, `textbook`, `summary` and `practice` texts. Maths and units are shared.

## Change the vault password
```
node scripts/encrypt-vault.mjs "NEW-PASSWORD" ../PhysicsAlive/public/packs 0 vault/coulomb.enc.json
node scripts/build-sw.mjs
```
