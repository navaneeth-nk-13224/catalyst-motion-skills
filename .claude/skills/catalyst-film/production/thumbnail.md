# YouTube thumbnail

Every film that goes to YouTube gets a thumbnail, made in the same Remotion project as a `<Still>` and exported as a PNG
into the film folder. Template: `template/src/Thumbnail.tsx` (registered as `Thumbnail` in `template/src/Root.tsx`).
Worked example: `examples/thumbnail-datastreams.tsx` (the Data Streams thumbnail, 2026-11).

## Agree the content first
Before drawing anything, settle these in chat with the user and wait for approval:
1. **Name:** the product name, big and two-tone (first word white, second in the accent gradient).
2. **One line:** what it does, in plain product words. Data Streams: "Real-time messaging for your Catalyst apps".
3. **Tag:** the video type, top right. Data Streams: "FEATURE OVERVIEW" (it was a feature explainer, not a tutorial).
4. **Hero:** the product's real flow, drawn so someone in the category names it in 2 seconds. Data Streams:
   Backend (publisher) → channel → three live apps (score, dashboard, chat), with the payload `{ "score": "2–1" }` on its way.

## Rules (from the Data Streams rounds)
- **Channel layout:** Catalyst by Zoho logo top left, tag pill top right, name + line on the left, hero on the right.
- **Dark theme** (black stage, faint grid, soft cyan glow), in the catalyst.zoho.com look. Not the channel's old deep blue: the user found it "very dark, scary".
- **Feature-owner copy.** Sell the product the standard way. No slogans that sound AI-written, no clickbait, no jokes, nothing that looks like prompting Claude Code. A niche product's name is not clickbait.
- **Give the hero room.** The first flowchart was "too much clubbed together": spread the pieces so each card has air around it.
- **Design inside the name and the flow, not around them:** gradient wires, a pulse with a trail on its way, ripples off the channel, a dotted stream from the title into the flow. No extra boxes or borders.
- **Big enough to survive.** YouTube shows it at ~360px wide and recompresses it. Nothing under ~16px at 1280 wide; labels, grid lines and code bubbles are the first to smear.
- **Export at 2×.** A 1280×720 upload looks soft on Retina screens. Export 2560×1440 (stays under YouTube's 2 MB limit as PNG; ~1.1 MB for Data Streams):
  ```sh
  npx remotion still Thumbnail ../<slug>-thumbnail-2x.png --image-format=png --scale=2
  npx remotion still Thumbnail ../<slug>-thumbnail.png --image-format=png        # 1280×720, if the user wants it too
  ```
- **Variants are previews.** Show options as separate Stills, then keep only the chosen one and delete the rest (and their PNGs) once approved.
- **Fine-tuning:** for drag-and-drop nudging in the Studio, make a copy with `Interactive.Div` pieces (see `LEARNINGS.md` §Editing in the Studio), then copy the final values back.
