# Copy ledger — what our scripts have already said

The script-freshness gate (`script-freshness.md`) reads this file. Append one entry per finished film; newest at the bottom.
- **Benched:** used in either of the last 2 films. It can't be the opening, the closing or the hero line.
- **Retired:** used in 3 or more films. Not used at all until 3 films pass without it.

Last 2 films: **SmartBrowz 30s, SmartBrowz 30s v2**.

## Status
| Pattern | Films | Status |
|---|---|---|
| Narrator as the only voice mode | all 8 films | **Retired**, except when the user asks for a narrator. If so, vary everything else. |
| "Pay for what you ship / store. Nothing else." | CloudScale 1, CloudScale 2, Slate 30s, Stratus manifesto | **Retired** (word-for-word tagline used 4×) |
| Spoken "Catalyst ___." as the final line | all 8 films | **Retired** as the default ending; the name can be on screen only |
| "Ask your agent / your coding agent …" | CloudScale 2, Slate 30s, AppSail, Stratus manifesto, Stratus corporate, Stratus One file | **Retired** |
| Q→A pairs ("Traffic spikes? …", "Still on another platform? …") | CloudScale 2, Slate 30s, AppSail | **Retired** |
| Spoken name lists (agents, frameworks, components, standards) | CloudScale 1, CloudScale 2, Slate 30s, Stratus manifesto | **Retired**; show lists on screen |
| "agent-ready" / "built for the agent era" | Slate 10s, CloudScale 1, CloudScale 2, Slate 30s | **Retired** as spoken copy |
| "for you and your agents" / "teams and AI agents alike" | CloudScale 1, CloudScale 2, Stratus corporate | **Retired** |
| "X. Then Y." twist opener ("…in minutes. Then the back end takes weeks.") | CloudScale 2, Slate 30s | Available (last used 3 films ago) |
| Second-person "Your ___" opener | CloudScale 2, Slate 30s, Stratus manifesto, Stratus corporate | **Retired** |
| 6 lines, one feature per line | CloudScale 1, CloudScale 2, Slate 30s, AppSail, Stratus manifesto, Stratus corporate, Stratus One file | **Retired** as the default structure |
| "This is one file." (demonstrative, object-led opener) | Stratus One file | Available |
| Callback ending ("One file, or millions.") | Stratus One file | Available |
| Numbered benefits read in order (01 / 02 / 03) | Stratus corporate | Available |
| "Start free with five gigabytes." CTA line | Stratus corporate | Available |
| "Only the required tools. Every action, completed." (fragment ending) | Progressive MCP | Available |
| Problem → solution narrated over fixed user timestamps | Progressive MCP | Available |
| First person — the product speaks ("Until someone calls, I don't exist.") | Catalyst Functions | Available |
| "Call me…" repetition at line starts | Catalyst Functions | Available |
| Command ending as a callback ("So go on. Call me.") | Catalyst Functions | Available |
| Code line as the silent opening (sound first) | Catalyst Functions | Available |
| "Your code. Infinite possibilities." (fragment ending) | Functions 30s | Available |
| "Introducing Zoho Catalyst ___." reveal line | Functions 30s | Available |
| "___ deserves a faster way to run." opener | Functions 30s | Available |
| Letter / note voice mode ("Dear browser," salutation opening) | SmartBrowz 30s | Benched |
| "P.S." ending line ("P.S. Use as many of you as it takes.") | SmartBrowz 30s | Benched |
| Escalating errand list (each request bigger than the last) | SmartBrowz 30s | Benched |
| "No window needed." · "Read it anyway." | SmartBrowz 30s | Benched |
| First person (product) voice mode: SmartBrowz as "I" | SmartBrowz 30s v2 | Benched |
| Countdown device: each line opens on a clock time ("Eight forty." · "Eight fifty-five.") | SmartBrowz 30s v2 | Benched |
| Number opening "Eight o'clock." · callback command ending "Nine. Open the doors." | SmartBrowz 30s v2 | Benched |
| "Nobody watched. Everything passed." · on screen "Real browsers. Nobody at the screen." | SmartBrowz 30s v2 | Benched |

## Entries (last 3 films; older ones in `copy-ledger-archive.md`)
### Stratus corporate
- **Mode:** narrator (user asked for a corporate explainer).
- **Opening:** "Your data keeps growing. So does the cost of accessing it."
- **Ending:** "Catalyst Stratus. Start free with five gigabytes."
- **Device:** numbered benefits.
- **Phrases:** "teams and AI agents alike" · "zero egress fees" · "leading compliance standards".


### Stratus "One file"
- **Mode:** narrator.
- **Opening:** "This is one file."
- **Ending:** "One file, or millions. Catalyst Stratus." (a callback)
- **Device:** an object's journey.
- **Phrases:** "Download it ten thousand times. The egress bill stays at zero."


### Progressive Zoho MCP
- **Mode:** narrator (the user's own script, verbatim; user brief wins).
- **Opening:** "Using the context from your prompt, AI models such as Claude, GPT, Copilot, and Cursor, access the MCP tools…"
- **Ending:** "Only the required tools. Every action, completed." (trimmed with approval)
- **Device:** contrast (all tools vs only the required tools).
- **Phrases:** "context may get exhausted, causing hallucinations and wasted tokens" · "tool discovery becomes dynamic". One spoken name list (user's), shown as highlights.

### Progressive Zoho MCP v2
- Same VO as Progressive Zoho MCP (the user's script, re-cut visually). No new copy patterns; on-screen type adds "Dynamic tool discovery" and "Every action, completed."

### Progressive Zoho MCP v2 test (`outputs/progressive mcp v2 test/`)
- Test rebuild of v2: same VO, copied verbatim. No new copy patterns; the copy-ledger gate was waived by the user for the test.

### Catalyst Functions (`outputs/functions/`)
- **Mode:** first person (the function speaks).
- **Opening:** sound + a typed code line, then "Until someone calls, I don't exist."
- **Ending:** "So go on. Call me." (a command; name on screen only)
- **Device:** repetition ("Call me with a request… at midnight… when an order lands… a million times.")
- **Phrases:** "No server waiting. No bill running." · "You're billed for the seconds I worked." · 7 lines, 2 silent beats.

### Catalyst Functions 30s
- **Mode:** narrator (the user's pasted copy, verbatim; user brief wins). "backend" spoken as "back end".
- **Opening:** "Your backend logic deserves a faster way to run." (retired "Your ___" opener, kept by user brief)
- **Ending:** "Zoho Catalyst Functions. Your code. Infinite possibilities." (spoken name ending, kept by user brief)
- **Device:** one object's birth and life.
- **Phrases:** "deploy in seconds" · "let Catalyst handle the infrastructure" · "without managing servers" · "focus on what matters". On screen: "Scales as you grow." · "No servers to manage." · "Build faster."

### SmartBrowz 30s (`outputs/smartbrowz 30s/`)
- **Mode:** letter / note (a developer's note to the browser), Kokoro af_heart @1.05.
- **Opening:** "Dear browser," (salutation)
- **Ending:** "P.S. Use as many of you as it takes." (a P.S.; name on screen only)
- **Device:** escalation of requests. 6 lines, 1 silent beat 4.6s.
- **Phrases:** "Forty stores changed their prices overnight. Check every one." · "Make me a PDF by morning." · "The old portal has no API. Read it anyway." · "No window needed. I'll be asleep." On screen: "Reads any page a person can." · "Headless browsers, in parallel."

### SmartBrowz 30s v2 (`outputs/smartbrowz 30s v2/`)
- **Mode:** first person (product: SmartBrowz speaks as "I"), Kokoro af_heart @1.05.
- **Opening:** "Eight o'clock. The sale opens at nine, and nobody has tested checkout." (a number)
- **Ending:** "Nine. Open the doors." (a command + callback to the clock; name on screen only)
- **Device:** countdown. 6 lines, 1 silent beat 4.7s.
- **Phrases:** "So I run it. Chrome and Firefox, two hundred at once." · "A coupon for every customer, from one template." · "A screenshot of every page, for the record." · "Nobody watched. Everything passed." On screen: "Sale opens 9:00" · "Real browsers. Nobody at the screen." · "Doors open." 
