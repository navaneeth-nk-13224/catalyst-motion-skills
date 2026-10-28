# Verify — before saying "done"

Review stills before rendering. Render only once the frames are right.

## 1. Stills and contact sheet
`./film stills` renders the entry, middle and hold frame of every scene, plus the last frame, from **one bundle** using the shipped props. It writes `outputs/<film>/preview/f<frame>.png` and `sheet.png`. Pass frame numbers to target specific moments.

Check the sheet against `LEARNINGS.md` §Stills checklist:
- the hero object is literally relevant (`catalyst-motion/create/relevance.md`)
- no wrapped headlines, no label collisions
- each hero fills its zone
- transitions show content
- each resolve stays on screen ≥ 0.7s
- the row doesn't look like one template
- no benched motif is a hero

## 2. Delivery checks (automatic)
`./film verify` checks the one deliverable `outputs/<film>/<slug>.mp4`, prints a table and writes `outputs/<film>/build/review/verify.json`. Exit code 1 means a failure.

| Check | Pass |
|---|---|
| Size / fps | Matches `timeline.json` (1920×1080, 30) |
| Duration | Within 1 frame (+ AAC padding) of the last cut |
| Codecs | h264 + aac |
| Loudness | −14 ±0.5 LUFS integrated (two-pass mix lands on ≈ −14.0) |
| True peak | ≤ −1.0 dBTP |
| VO | Every line has measured `dur` and `words` |
| Single deliverable | `out/` holds exactly one video, `<slug>.mp4`: no music-only, no alternate cuts, no `.srt`; no captions in the picture |
| Ledger | The film is logged in `catalyst-motion/ledger.md`. This is a reminder only; it doesn't block. |

## 3. Things only a human pass catches
- SFX balance against the VO. Listen once at normal volume.
- Pronunciation of brand words.

## 4. Report honestly
- Paste the verify table into brief §5.
- List the copy that is "my wording" or illustrative.
- Flag anything not checked.
- Append the ledger entry (pipeline step 11), then `open outputs/<film>/<slug>.mp4`.
