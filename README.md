# Frontend Engineer — Technical Assignment
---

## Context

You are joining a small, senior engineering team building an analytics and intelligence platform used by professionals working in security-sensitive, high-stakes environments. The platform ingests large volumes of news and social media data, applies quantitative analysis, and surfaces it through an interface that analysts rely on to make decisions.

The frontend is data-intensive. It combines charts, tables, text, and filters — often on the same screen. The people using it are not casual users; they work under time pressure and need clear, reliable information.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A package manager of your choice (`npm`, `yarn`, or `pnpm`)

### Setup

```bash
# Install dependencies
npm install        # or: yarn / pnpm install

# Start the development server
npm run dev        # opens at http://localhost:5173
```

### Project structure

```
src/
├── api/
│   └── mock.ts          # Simulated API layer — all data lives here
├── types/
│   └── index.ts         # Shared TypeScript types
├── pages/
│   ├── NewsAnalytics/   # Task 1 — implement here
│   └── EntityMonitor/   # Task 2 — implement here
├── components/          # Your shared components go here
├── hooks/               # Your custom hooks go here
└── App.tsx              # Routing is already wired up
```

The app has two routes pre-configured:
- `/news-analytics` → Task 1
- `/entity-monitor` → Task 2

The mock API in `src/api/mock.ts` simulates real network latency. All types are defined in `src/types/index.ts`. **Do not modify the API or types files** — treat them as you would a real backend contract.

---

## Task 1 — News Analytics Screen

**Implement the News Analytics screen based on the design reference.**

The reference screenshot is at: **`public/app-screenshot.png`**

This is the platform's primary analytics view. It gives analysts an overview of how a selected country is covered across global news sources during a given time window, including sentiment signals, article origins, and individual article access.

### What to build

The screen contains the following areas:

#### Top bar
- Application logo / name on the left
- A **country selector** in the centre — the selected country drives all data on the screen
- A **News / Social Media toggle** on the right — this switches the data mode (both modes use the same API shape)

#### Left sidebar — "Summary of the Day"
- Explanatory copy about what the summary does (refer to the screenshot for the text)
- A **"Generate summary"** button — clicking it should call `generateSummary()` and display the returned text. Model a loading state.

#### Right sidebar — Section navigation
- Navigation links: **News Analytics**, Society Profiling, Policy Resonance, Communications Resonance
- The non-Analytics links do not need to be functional — style them as inactive
- User account area at the bottom with a placeholder name and a logout link

#### Main content — three sections

**1. Top 20 influential countries**

A horizontal bar chart. Each bar represents a country, plotted by its `sentimentScore` (ranging from approximately −3 to +1). The chart should:
- Make the sentiment axis clearly legible
- Visually distinguish negative from positive scores (refer to the colour treatment in the reference)
- Label each country on the y-axis

**2. Source countries and languages of articles**

A Sankey / alluvial diagram. Left nodes are source countries; right nodes are languages. The width of each flow represents the volume of articles. This is the most technically interesting visualisation on the screen — use whichever library you consider appropriate.

**3. News articles**

A searchable, filterable list of articles. Each row should show at minimum: title, domain, source country, language, and published date. Include:
- A free-text search input
- Filter controls for domain, source country, and language
- A visible date range (refer to the reference: "06 Feb – 12 Feb")

### Notes

- You may deviate from the reference design where you have a good reason. Be prepared to explain your choices.
- The mock API already returns all data you need — see `fetchNewsAnalytics()`, `fetchAvailableCountries()`, and `generateSummary()` in `src/api/mock.ts`.
- Pay attention to loading and empty states.

---

## Task 2 — Entity Monitor Screen

**Implement the Entity Monitor screen based on product requirements only. There is no design reference.**

Analysts use this screen to monitor a curated set of tracked entities — people, organisations, locations, topics, and events — for emerging threat signals surfaced from across the monitored information environment.

### Product requirements

The screen must allow an analyst to:

#### 1. Overview panel
Get an at-a-glance summary of the current monitoring period:
- Total signals detected
- Number of critical signals
- Newly surfaced entities
- A visual breakdown of signals by threat level: **Critical / High / Medium / Low / Informational**

#### 2. Entity activity
- Browse a list of tracked entities
- Select one to see a **time-series chart** of that entity's mention count and sentiment score over the last 30 days
- Clearly indicate which entity is selected

#### 3. Signal feed
A paginated list of signals. Each signal should show:
- Entity name and type
- Signal title and summary
- **Threat level** — this is the primary triage dimension; make it visually prominent
- Detected date/time
- Source domain and country
- Number of related articles

The feed should support:
- **Filtering** by threat level and entity type
- **Pagination** — the list updates without a full page reload

### API reference

All functions are in `src/api/mock.ts`. The relevant ones are:

| Function | Description |
|---|---|
| `fetchEntityMonitorOverview(dateFrom, dateTo)` | Overview metrics for the period |
| `fetchEntities()` | List of tracked entities |
| `fetchEntityTrend(entityId)` | 30-day mention + sentiment series for one entity |
| `fetchSignals(filters?)` | Paginated, filterable signal feed |

All types are in `src/types/index.ts`.

### Notes

- The people using this tool work under pressure. **Clarity and information density matter** more than decoration.
- Layout, visual hierarchy, and component structure are entirely your decision — think about what an analyst would need to orient themselves quickly.
- Handle loading, error, and empty states thoughtfully.

---
