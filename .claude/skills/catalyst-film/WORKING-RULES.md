# Working rules: how a film is reviewed and finished

These rules come from every review round of the long-form films (Data Streams overview, AppSail agents overview).
The user starts with a short prompt, Claude shows a version, the user asks for more depth or a change, and the film
converges through many small rounds. Follow these rules in every round. They override defaults; the user's explicit
words in the current session override them.

## 1. The review loop
- **Every visible change is a preview first.** A design, copy, layout, timing, voice or music change is built as its
  own Studio composition (or `<Still>`) next to the film, never straight into the film. The user approves it, then it
  goes into the film and the preview is deleted ("update the main and delete the preview"). A clear bug (an element
  off its line, a typo, a misalignment the user pointed at) may be fixed directly; say what changed.
- **Options are named and side by side.** When the user asks for options, give 2–4 (never more), each a separate
  composition with a short descriptive id (`Close-A-Console`, `Thumbnail-F-Deck`), each one idea that differs clearly
  from the others. Say which one you would pick and why, in one or two lines.
- **Touch only what was asked.** "Reduce the icon" means the icon inside the box, not the box. "Edit F" means only F.
  Never change, rename or delete a version or element the user didn't name, even while tidying. If you removed
  something by mistake, say so and restore it exactly.
- **Delete only on request, and only what was named.** When the user picks, delete the versions they told you to
  delete, not the ones you think are unused. Project code you remove goes to the Trash, not `rm`.
- **Ask what a vague note means only when two readings lead to different work.** Otherwise pick the most likely
  reading, say it in one line ("I read this as …"), and build it.
- **If the user rejects a direction twice, change the concept, not the size.** Shrinking a flowchart that "looks
  crowded" doesn't fix it; a different single-object concept does.
- **Short answers, one point at a time.** Lead with the result, then the few facts that matter. Tables for
  comparisons. No recaps of what didn't change.

## 2. Studio and renders
- **One Studio tab.** Never open a new browser tab per preview (`open http://localhost:…/Comp`); name the composition
  and let the user pick it in the sidebar. Several Studio tabs on one port make Studio throw `AbortError: signal is
  aborted without reason` on every zoom (each tab refetches on the others' `storage` events).
- **Previews start at frame 0.** Never preview with a negative `<Sequence from>` offset: `OffthreadVideo` desyncs and
  per-frame overlays (blurs, dummy text) appear in the wrong place. To preview a late moment, register the scene
  itself, or pass the frame offset into the component.
- **Self-check before showing.** Render a still of every new preview and look at it (crop details) before telling the
  user it is ready. Check text clipping, overlap, alignment and the small-size view.
- **Never render the film unless asked.** When asked: typecheck, check the voice files exist, render to a temporary
  path, then verify the file (resolution, audio stream, length, a contact sheet of frames every 3s across the whole
  film, a full transcript against the script). Only when it all passes, move the old file to the Trash and put the new
  one in its place. Report what was checked.

## 3. Product truth (before any claim reaches the script or the screen)
- **Valid and safe claims only.** Every architecture or capability claim must be something the product team states
  or the docs state, and that works for real. When a product team objects (e.g. "AppSail can't guarantee the
  instance stays up after the response"), change the architecture and the film, don't argue around it.
- **Test the claim for real when it matters.** "What happens if the service goes down mid-task?" is answered by a
  real test (take it down, watch the job, check the data), not by reasoning. Report observed results separately from
  what you expected.
- **Use the docs' numbers and words.** Real limits (100 concurrent requests per AppSail instance, a new instance at
  80%) beat invented ones. Use the docs' term for the product (AppSail deploys "web services"; Slate deploys front-end
  "web applications") so sister products are never confused.
- **The thumbnail and screen promise only what the video shows.** No third-party logos or use cases (e.g. "vibe-coded
  apps") the video doesn't cover; no public mention of a sister product's current gap. Suggest a separate video instead.
- **Model-neutral.** Never promote one AI model or vendor; demos run an open-source model set by env vars.

## 4. Narration and script
- **Story first, plain words.** Open on a real moment or a plain definition, not a slogan; no generic AI claims.
  Sell it like the feature owner (`LEARNINGS.md` → Direction).
- **Point to an explainer where its term first appears.** "If you're new to Data Streams, we've got a separate
  video…" goes right after the first sentence that names Data Streams, not in the middle of another flow. Keep a
  technical flow (request → save → submit → reply) unbroken.
- **Every visual beat lands on its word.** Spotlights, highlights and cards arrive on the spoken word (± 0.3s), from
  the word timings, never by eye. A line that describes a possibility ("can scale down to zero") may show the real
  state first and then the possibility (1 live instance → back to 0).
- **No captions, ever.**

## 5. Voice
- **The user's recorded voice is the source.** Re-recorded lines are spliced into the existing take at real silences
  (find the quietest 20 ms point inside each gap; 10 ms fades), so the total length changes only by the new words.
  Reordering a sentence is a splice too: cut at three silences, swap, and shift the visuals by the moved length.
- **Verify every voice edit by transcript** (faster-whisper `small`) against the script. Transcribers drop or misspell
  words ("AppSale", a skipped "So the"); check a suspected gap in the audio itself before reporting it.
- **Deliver a voice-only file on request** from the final render (`-vn`), at the film's length, so timings match.

## 6. Design
- **Measure alignment, don't eyeball it.** "Is this centred?" is answered in pixels: equal gaps, centred groups,
  mirrored edges. Mirror the edge that faces the subject (the gap to the deck), not the outer edge, when widths differ.
- **Nothing touches.** Text never runs to a card edge, under another element or onto two lines by accident
  (`nowrap` or a narrower font); give cards real padding. Dots and pulses sit exactly on their line
  (`offset-path` already centres the element; never add negative margins).
- **A bigger thing is bigger on both sides.** A front card in a deck is taller above and below its neighbours, never
  top-aligned with them.
- **No childish labels.** "running your app" under an instance reads cheap; show state by design (a live dot, a load
  bar, a tile), not by a sentence.
- **Real brand marks in their real colours** for third-party runtimes and tools (Node, Python, Java, Docker), using
  files the user supplies when they do. White marks only when the design is deliberately monochrome.
- **Realistic, readable numbers.** Use plausible values from the docs, and show a number or a bar, not both, when
  space is tight.

## 7. Screen recordings
- **Replace personal data, don't blur it.** Paint a dummy value ("developer@example.com") over each email, in the
  console's own font (**Inter** for the Catalyst console, verified by overlaying the real string at 28 px), in the
  text colour **as it appears in the render** (measure the neighbouring text in a rendered still; the render shifts
  colours slightly), on each row's own background, with feathered cover edges. Check the last, half-hidden row of a
  table too. Instance IDs and other non-personal IDs don't need hiding.
- **Patch a recording with a real screenshot** when the recorded state is wrong for the story (0 live instances where
  the voice talks about activity): take the panel from a real console screenshot at the same pixel scale, match its
  whites to the recording, and grow the spotlight with it.

## 8. Music
- **Original only** (the kit synth), unless the user supplies a track. A pad-only bed reads as "humming that fills
  the silence"; a score needs **rhythm, a bass line and a recognisable hook**.
- **Audition 3 short options** (30s each, under the real voice, ducked) in clearly different styles before scoring
  the full film. Offer the YouTube Audio Library (no Content ID claims) as the alternative if none fits; the user
  downloads the track.
- Under a voice, music sits ~11–12 dB below the voice in gaps and ducks a further ~7–8 dB while speaking.

## 9. Thumbnail
See `production/thumbnail.md`. In short: one focal object, a 3–5 word line in the docs' terms, nothing in the
bottom-right corner, test at 320 px and 168 px wide and in greyscale, the product name in one colour, honest content.

## 10. Hard limits
| Limit | Value |
|---|---|
| Options per request | 2–4 |
| Thumbnail line | 3–5 words; product's official term |
| Smallest text on a 1280×720 thumbnail | 16 px |
| Visual beat vs its spoken word | ± 0.3 s |
| Text clear space | ≥ 56 px from art, ≥ 40 px between blocks (`./film layout`) |
| Music under voice | −11 dB in gaps, ducked a further 7–8 dB while speaking |
| Renders | only when asked; verified before replacing the old file |
| Studio tabs per port | 1 |
| Claims | docs- or team-stated and tested; nothing the video doesn't show |
