# Type 2 grammar — UI assembly (small animations)

**Idea:** the product builds itself in front of you like a fast, well-made app loading. Then it *rests*
so it can be read. It is a small proof that something works, not a spectacle.

## 1. The four phases (keep the shape, change everything inside)
| Phase | Share | What happens | Rules |
|---|---|---|---|
| **Frame** | 0–15% | A container arrives: window, card, terminal, pill, panel | Rise + fade (`enter`, 500–800ms) or scale 96 → 100% + fade. Only one container moves. |
| **Build** | to about 35%, ≤ 2.5s | Children assemble in reading order: structure → skeleton → content → state | Use anchor-then-extend (below) and two-speed cascades |
| **Resolve** | one beat | The result appears: success, answer, created item, live badge | The only place a 5% overshoot is allowed. A floating result card rises 35px from below. |
| **Hold** | the rest | Still, readable | At most **one** idle accent (a turning sparkle, blinking cursor or breathing dot) |

## 2. Atomic patterns (grammar, not the reference choreography)
| Pattern | Rule | Invent with it |
|---|---|---|
| **Anchor → extend** | A small anchor appears first (dot, icon, checkbox). Its extension follows as it settles (bar, label, row), about 200ms later. | Avatar → name, node → edge, bullet → sentence, pin → route |
| **Two-speed cascade** | Siblings use a micro beat (33–50ms). Groups and rows use a macro beat (~300ms). Parallel columns interleave by half a beat. | Grids of tiles, table columns, kanban lanes |
| **Placeholder → truth** | Grey or skeleton state fades (100ms), then real content reveals left-to-right (mask wipe) | Search results, typed commands, loading graphs, filled forms |
| **Reading-order build** | Build in reading order: top → bottom, left → right, outer → inner | Any layout |
| **Outcome arrives last, from below** | The result of the interaction rises over the UI and floats slightly | Toasts, created records, deploy URLs, AI answers |
| **Single heartbeat** | During the hold, one accent loops on a 2s step (rotate 90°, squash 0.8) | Sparkle, live dot, cursor, ring sweep |

## 3. Writing new Type 2 motion
> **Freshness first:** pick the surface, framing, interaction and outcome from `create/freshness.md` §2. The agent window, the ✓ ladder and the Live chip are retired as heroes.

- **Ask:** "What would a real user see in the first 2 seconds of this feature?" Build *that*, then simplify it to skeleton plus 1–2 real strings.
- **Choose one hero string.** It's the query, the command, the record name. Type it on and leave the rest as skeleton bars.
- **Keep the scale near 100%.** Pops go 0 → 1 only for atoms smaller than 24px. Larger pieces use scale 96–98 → 100%.
- **Never build two Type 2 sequences at once.** If two UIs are needed, the second one starts after the first resolves.
- **Restraint test:** if you can remove a moving piece and the story survives, remove it.

## 4. Forbidden in Type 2
- Bouncy springs, elastic, overshoot over 5%
- Blur-in, 3D flips, colour flashes
- Animating the background (Type 1 ambience behind it is fine, at ≤ 45% opacity)
- Builds longer than 2.5s, or a hold shorter than 1.5s
