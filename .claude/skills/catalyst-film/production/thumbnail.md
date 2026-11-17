# YouTube thumbnail

Every film that goes to YouTube gets a thumbnail, made in the same Remotion project as a `<Still>` and exported as a PNG
into the film folder. Template: `template/src/Thumbnail.tsx` (registered as `Thumbnail` in `template/src/Root.tsx`).
Worked example: `examples/thumbnail-datastreams.tsx` (the Data Streams thumbnail, 2026-11).

## Agree the content first
Before drawing anything, settle these in chat with the user and wait for approval:
1. **Name:** the product name, big. Two words → two-tone (first white, second in the accent gradient), as "Data Streams". One word → one colour, all in the accent gradient ("AppSail"): splitting a one-word name makes it read as two words.
2. **One line:** what it does, in plain product words, **3–5 words** so it reads on a phone, in the **docs' own term** for the product. Data Streams: "Real-time messaging for your Catalyst apps". AppSail: "Deploy any web service" ("web app" would blur it with Slate, the front-end service).
3. **Tag:** the video type, top right. Data Streams: "FEATURE OVERVIEW" (it was a feature explainer, not a tutorial).
4. **Hero:** **one focal object** that shows the product's real behaviour, so someone in the category names it in
   2 seconds. Data Streams: Backend (publisher) → channel → three live apps (score, dashboard, chat), with the payload
   `{ "score": "2–1" }` on its way. AppSail: three live instance tiles stacked in depth, each with its load bar
   (90 · 80 · 35, the 80% scale-up tick from the docs); the runtimes as a small logo row under the line.

## Rules (from the Data Streams and AppSail rounds)
- **Channel layout:** Catalyst by Zoho logo top left, tag pill top right, name + line on the left, hero on the right.
- **Dark theme** (black stage, faint grid, soft cyan glow), in the catalyst.zoho.com look. Not the channel's old deep blue: the user found it "very dark, scary".
- **Feature-owner copy.** Sell the product the standard way. No slogans that sound AI-written, no clickbait, no jokes, nothing that looks like prompting Claude Code. A niche product's name is not clickbait.
- **Give the hero room.** The first flowchart was "too much clubbed together": spread the pieces so each card has air around it.
- **Design inside the name and the flow, not around them:** gradient wires, a pulse with a trail on its way, ripples off the channel, a dotted stream from the title into the flow. No extra boxes or borders.
- **One focal point, not a diagram.** A flowchart of 8 boxes and 7 wires competes with the name however you shrink
  it (AppSail: four rounds of "still crowded"). The name leads; one object supports it. If the user rejects a hero twice,
  change the concept, not the size.
- **Keep the bottom-right corner empty.** YouTube puts the duration badge there. No labels, cards or text in it; no
  row of small captions along the bottom.
- **Test like YouTube shows it:** at 320 px wide (search), 168 px wide with a duration badge (phone sidebar), and in
  greyscale. The name, the line and the hero must still read.
- **Honest, no clickbait.** Show only what the video delivers. No third-party logos or use cases the video doesn't
  cover (they also imply a partnership that needs sign-off); no public mention of a sister product's gap.
- **Real numbers and real marks.** Values from the docs (not invented), runtime logos in their brand colours from files
  the user supplies, and the product mark with room inside its tile.
- **Big enough to survive.** YouTube shows it at ~360px wide and recompresses it. Nothing under ~16px at 1280 wide; labels, grid lines and code bubbles are the first to smear.
- **Export at 2×.** A 1280×720 upload looks soft on Retina screens. Export 2560×1440 (stays under YouTube's 2 MB limit as PNG; ~1.1 MB for Data Streams):
  ```sh
  npx remotion still Thumbnail ../<slug>-thumbnail-2x.png --image-format=png --scale=2
  npx remotion still Thumbnail ../<slug>-thumbnail.png --image-format=png        # 1280×720, if the user wants it too
  ```
- **Variants are previews.** Show 2–4 options as separate, clearly named Stills (`Thumbnail-F-Deck`), each a different idea. Edit only the one the user names; delete only the ones they name. Keep only the chosen one once approved.
- **Fine-tuning:** for drag-and-drop nudging in the Studio, make a copy with `Interactive.Div` pieces (see `LEARNINGS.md` §Editing in the Studio), then copy the final values back.
