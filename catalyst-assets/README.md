# Catalyst assets

Official brand files. Permanent: don't edit, recolour or redraw them; use them as they are.

## Logo animations (`logo-animations/`, Lottie JSON, 30 fps)

| File | Size | Length | Use |
|---|---|---|---|
| `catalyst-lockup-animation-darkBG.json` | 928×244 | 90 f (3.0 s) | **Default film end card.** Mark + "Catalyst by Zoho", white type, for the `#000` void. |
| `catalyst-lockup-animation.json` | 928×244 | 90 f (3.0 s) | Same lockup, black type, for light backgrounds only. |
| `catalyst-logo-animation.json` | 512×512 | 91 f (3.0 s) | Mark only (no wordmark): avatars, intros, small bugs, loaders. |

Motion: the mark draws on as two strokes, four colour passes (red → green → blue → yellow, 3 f apart), ending red top /
blue bottom. In the lockups the mark then slides left and scales 130% → 100% (f34–59) while "Catalyst" (f38–51) and
"by Zoho" (f42–53) slide in per letter with a fade. Rests from f59 (lockup) / f49 (logo); hold it ≥ 1 s.

## Using it in a film
- Dark background (every film) → `catalyst-lockup-animation-darkBG.json`. Light background → `catalyst-lockup-animation.json`.
- The template ships both lockups in `public/brand/` and `src/EndLockup.tsx` (`<EndLockup at={s} />`, `@remotion/lottie@4.0.539` pinned):
  scaled uniformly, centred, never cropped, ≥ 56px clear space around it. Leave ≥ 3.0s from `at` to the end of the film.
- Let the lottie's own timing run at 30 fps; don't retime, recolour or add effects to it.
