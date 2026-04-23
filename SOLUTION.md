# SOLUTION.md

## 1. Approach

### Task 1 — News Analytics

I started from the reference screenshot and worked outside-in: layout first, then data, then interaction. The reference gave me the overall structure (fixed top bar, three-column body: summary sidebar / main content / nav sidebar), and I matched it closely while keeping the implementation pragmatic.

**Key decisions:**

- **Recharts for the bar chart.** The horizontal sentiment chart needs signed bars — bars that grow left for negative values and right for positive ones. Recharts handles this naturally with `layout="vertical"` and a numeric X-axis including negative domains. I considered `@nivo/bar` but Recharts has simpler bindings for this case.
- **`@nivo/sankey` for the alluvial diagram.** It handles the core layout math (node positioning, flow routing, width proportional to volume) out of the box, and renders cleanly in dark-themed SVG. Building it with raw D3 would have taken significantly longer for equivalent quality.
- **Language node IDs prefixed with `lang:`** to avoid collisions between country names and language names (e.g., "Russian Federation" vs "Russian"). The prefix is stripped in the label function so the user never sees it.
- **Filters are client-side**, applied to the 40 articles already returned by the API. In production this would be server-side pagination, but the mock returns a fixed set so filtering in the browser is correct here.
- **Country selector resets summary.** When the country changes, the old summary is cleared immediately — it would be confusing to show a GB summary while viewing DE data.

### Task 2 — Entity Monitor

No design reference, so I thought about what an analyst needs and in what order:

1. **Immediate orientation** — what is the overall threat posture right now? (Overview panel with stat cards and a stacked threat-level bar)
2. **Entity-level drill-down** — select an entity, see how its mention volume and sentiment evolved over 30 days (ComposedChart with dual Y-axes)
3. **Triage queue** — the signal feed, sorted by recency, filtered by threat level and entity type. Threat level is the most critical signal attribute, so the badge is visually dominant (leftmost, colored, with a faint vertical accent line).

I chose a single-page layout (no nested routing) since the analyst should be able to see overview, entity trend, and signals without navigating away.

---

## 2. Trade-offs

**Prioritised:**
- Faithfulness to the reference design for Task 1 — the dark palette, typography scale, and chart style were the primary quality signal
- Information density for Task 2 — compact cards, small font sizes, color-coded badges let the analyst scan quickly
- Clean TypeScript — no `any`, explicit prop interfaces, hooks that encapsulate all data concerns

**Left out or simplified:**
- **Server-side article pagination.** The mock returns 40 articles; I filter/search them in the browser. A real API would take `page`, `q`, and filter params.
- **Markdown rendering in the summary.** The generated summary body uses `**bold**` markers. I strip them with a simple replace rather than importing a markdown library — the content is readable without it, and adding a parser felt like over-engineering for a text-only output.
- **Sankey interactivity.** The reference shows node-level tooltips; @nivo/sankey provides them out of the box, but I didn't add custom tooltip content. The defaults are sufficient for a submission.
- **Error boundaries.** I handle errors with inline state but didn't add a React error boundary component — worth doing in production.
- **Tests.** No unit or integration tests are included. I'd prioritise testing the filter logic in `ArticlesSection` and the `useSignals` dependency array first.

---

## 3. If I had more time

- **Proper article pagination** — pass `page`, `search`, and filter params to the API rather than slicing in the browser
- **Animated Sankey transitions** — when the country changes, a smooth re-layout would make the flow changes readable
- **Responsive layout** — the current layout is designed for wide screens; a collapsed sidebar mode for narrower viewports would be needed in production
- **Summary markdown** — use `react-markdown` to render the bold/list formatting in the AI summary body
- **Keyboard navigation** — the entity list and signal feed should be fully keyboard-accessible
- **E2E smoke test** — a single Playwright test asserting that both routes render without errors would give confidence during CI

---

## 4. Assumptions and notes

- **Fixed date window for Task 1.** The API takes `dateFrom`/`dateTo` parameters but the mock ignores them. I hardcoded `2025-02-06` to `2025-02-12` (matching the "06 Feb – 12 Feb" label in the reference) and keep it fixed. In a real app, this would be a date-range picker.
- **"Social Media" mode** shares the same API shape and mock data as "News." The toggle switches the `mode` param and refetches — the data looks the same, which is expected given the mock.
- **Nav sidebar is decorative.** Only "News Analytics" is active; the other links are rendered but disabled, as specified.
- **User info in the nav sidebar** ("Adam Zurek", trial countdown) is hardcoded to match the reference. These would come from an auth context in a real app.
- **`@nivo/sankey` color function.** The library's `colors` prop accepts a function `(node) => string`, which I use to map country names to a hand-picked palette. Language nodes fall back to a neutral gray — they receive color via the link gradient, which inherits the source-node color.
