# Audio: voice-over, score, SFX, mix

All audio is generated locally and is original. No stock music and no cloud TTS.

## 1. Voice-over — Kokoro-82M (Apache-2.0, github.com/hexgrad/kokoro)
- **Voice:** `af_heart` at 1.05×. The user chose it over macOS voices for sounding natural.
  - Alternatives to audition: `af_bella`, `af_nicole`, and `bf_emma` (British).
- **Environment (macOS):**
  - Python ≥ 3.10 in a venv with `kokoro soundfile numpy`.
  - `brew install espeak-ng`.
  - Set `ESPEAK_DATA_PATH=/opt/homebrew/share/espeak-ng-data` and `PHONEMIZER_ESPEAK_LIBRARY=/opt/homebrew/lib/libespeak-ng.dylib`.
- **Run:** `python scripts/film.py vo` (uses the persistent venv `~/.catalyst-film/venv`; skipped when the VO text, voice and speed are unchanged).
  This reads `vo[].text`, `voice` and `speed` from the timeline. It writes trimmed `outputs/<film>/build/vo/t<N>.wav` files and **writes the measured `dur` and word timestamps of each line back into `timeline.json`**, so checks and cues use real durations.
- **Word timestamps are automatic.** `kokoro_vo.py` stores every word's film-clock onset in `vo[].words` (Kokoro token timestamps, corrected for the silence trim). Use `word(3, "Claude")` / `cue("agents.claude")` in TS, and `WORD()` / `CUE()` in `make_sound.py`. List them with `python scripts/film.py words`.
- *Fallback only* (if timestamps are ever missing), find the word gaps with:
  ```sh
  ffmpeg -i ../build/vo/t2.wav -af silencedetect=noise=-38dB:d=0.06 -f null -
  ```
  Put those offsets into the scene's cue constants.
- If a line overflows its slot, rewrite it shorter. Raise the speed only as far as 1.1×.

## 2. Score — `audio-src/make_sound.py` (numpy synthesis, 48 kHz stereo)
- **Tempo: 120 BPM, so one beat = 500ms.** That matches the LottieFiles STANDARD duration and the 500ms event grid, so cuts on 0.5s multiples land on beats.
- **Instruments:** detuned pad chords, plucked arpeggio, sine bass, kick / hat / clap, noise risers, sub impacts and bells.
- **Arrangement follows the arc.** Each shape in `story/arcs.md` has its own music line. For problem → solution:

  | Arc stage | Music |
  |---|---|
  | Problem | Sparse: pad and a filtered arp, maybe a dissonant sus chord |
  | Solution | Riser, then a drop |
  | How | Groove: kick on 1 and 3, building to four-on-the-floor |
  | Payoff | A break, then the resolve chord, a bell and the tail |

- **Two files:** `audio-src/synth.py` is the instrument library (identical for every film; don't edit or re-read it — the instrument list is in `template/KIT.md`). `audio-src/make_sound.py` is only this film's score and SFX: `from synth import *`, then `add(...)` / `chord(...)` calls, then `finish()`.

## 3. SFX — synced to the motion, in the same file
| Motion | Sound |
|---|---|
| Solid lands (assembled entrance) | `settle()` |
| Trace draws / fan-out | `sparkle_run()` |
| Packet arrives / chip pops | `blip()`, pitched by meaning (e.g. you vs agent) |
| Type-on | `tick()` per 2 characters on the same eased curve |
| Success / resolve | `blip()` and a two-note `bell()` |
| Scene exit | `whoosh()` at cut − 0.3s |
| Push-in / light wipe | Short `riser()` into `air()` |
| Rejected / failed | Low `blip(330)` |

Take times from the scene constants (`ms()` values plus the scene's cut time), never by ear.

## 4. Mix — `audio-src/mix.py`
```sh
python audio-src/mix.py src/timeline.json
```
- **VO:** placed at `vo[].at`, then high-pass at 80Hz, a 3:1 compressor and +5.6 dB.
- **Music:** −5 dB, and side-chain ducked by the VO (threshold 0.03, ratio 6, attack 20ms, release 350ms).
- **SFX:** mixed at 0.8.
- **Loudness:** `loudnorm` to **−14 LUFS integrated, −1.5 dBTP**.
- **Outputs:**
  - `outputs/<film>/build/audio/voiceover.wav`
  - `outputs/<film>/build/audio/mix.wav`
