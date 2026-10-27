---
name: ui-check
description: Quick, consistent checklist to verify UI quality. If something is missing or broken, apply the smallest correct change that achieves the goal without regressing existing behavior.
---

Checklist
- Load the page locally and in a narrow/mobile width (>=320px) and a wide/desktop width.
- Verify no console errors or network failures during load and interactions.
- Check critical flows: navigation links, level switcher, pricing cards, time calculator inputs and outputs.
- Validate dynamic updates: switching levels updates curriculum and pricing; calculator recomputes ETA and shows plan.
- Ensure inputs have sensible defaults and accessible labels; focus styles visible; keyboard navigation works for interactive elements.
- Confirm responsive layout: content not overflowing, readable spacing/typography, images/icons sized correctly.
- Verify states: hover, focus, active; disabled/invalid states where applicable; error/help messages are informative.
- Cross‑browser sanity: test at least one Chromium and one non‑Chromium engine if available.
- Performance sanity: initial JS/CSS size reasonable; no obvious jank on interactions.
- Visual consistency: spacing scale, colors, and components align with the existing design system.

When Issues Are Found
- Prefer minimal diffs: fix only the specific missing/broken piece.
- Avoid refactors unless required to unblock the fix; do not introduce new dependencies.
- Add or adjust the smallest CSS/JS needed; keep changes localized to the affected component/module.
- Re‑verify the original flows to ensure no regressions.

Artifacts
- Optional: a short note in the commit message summarizing what was fixed and why.

Process Rules
- After adding any feature or applying a fix, run the project's tests and ensure they pass. Update/add only the minimal tests necessary to cover the new behavior.
- Do not commit without the user's permission.
