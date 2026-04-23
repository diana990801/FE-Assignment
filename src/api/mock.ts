/**
 * Mock API layer
 *
 * Each function simulates a network request with a configurable delay.
 * Replace these with real fetch() calls against the backend API.
 * The function signatures and return types reflect the actual API contract.
 */

import type {
  Country,
  DataMode,
  Entity,
  EntityMonitorOverview,
  EntityTrendResponse,
  EntityType,
  InfluentialCountry,
  NewsAnalyticsData,
  NewsAnalyticsSummary,
  Signal,
  SignalFilters,
  SignalsResponse,
  SourceLanguageFlow,
  ThreatLevel,
} from '@/types'

// ─── Helpers ────────────────────────────────────────────────────────────────

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms))

const COUNTRIES: Country[] = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'PL', name: 'Poland' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'RU', name: 'Russia' },
  { code: 'CN', name: 'China' },
]

// ─── Task 1 – News Analytics ─────────────────────────────────────────────────

const TOP_COUNTRIES_RAW: Array<{ name: string; code: string; score: number }> = [
  { name: 'ISRAEL', code: 'IL', score: -2.94 },
  { name: 'RUSSIA', code: 'RU', score: -2.61 },
  { name: 'CHINA', code: 'CN', score: -2.44 },
  { name: 'PAKISTAN', code: 'PK', score: -2.31 },
  { name: 'UKRAINE', code: 'UA', score: -2.18 },
  { name: 'AUSTRALIA', code: 'AU', score: -2.02 },
  { name: 'SPAIN', code: 'ES', score: -1.89 },
  { name: 'UNITED STATES', code: 'US', score: -1.76 },
  { name: 'BELGIUM', code: 'BE', score: -1.63 },
  { name: 'FRANCE', code: 'FR', score: -1.51 },
  { name: 'IRELAND', code: 'IE', score: -1.38 },
  { name: 'GERMANY', code: 'DE', score: -1.24 },
  { name: 'NORWAY', code: 'NO', score: -1.11 },
  { name: 'CANADA', code: 'CA', score: -0.97 },
  { name: 'UNITED ARAB EMIRATES', code: 'AE', score: -0.84 },
  { name: 'EGYPT', code: 'EG', score: -0.72 },
  { name: 'TURKEY', code: 'TR', score: -0.58 },
  { name: 'INDIA', code: 'IN', score: -0.45 },
  { name: 'ITALY', code: 'IT', score: -0.21 },
  { name: 'SAUDI ARABIA', code: 'SA', score: 0.87 },
]

export async function fetchNewsAnalytics(
  countryCode: string,
  mode: DataMode,
  dateFrom: string,
  dateTo: string,
): Promise<NewsAnalyticsData> {
  await delay()

  const topInfluentialCountries: InfluentialCountry[] = TOP_COUNTRIES_RAW.map((c) => ({
    country: { code: c.code, name: c.name },
    sentimentScore: c.score,
  }))

  const sourceLanguageFlows: SourceLanguageFlow[] = [
    { sourceCountry: { code: 'DE', name: 'Germany' }, language: 'German', articleCount: 3821, proportion: 0.28 },
    { sourceCountry: { code: 'RU', name: 'Russian Federation' }, language: 'Russian', articleCount: 1204, proportion: 0.09 },
    { sourceCountry: { code: 'INT', name: 'International' }, language: 'English', articleCount: 4102, proportion: 0.30 },
    { sourceCountry: { code: 'GB', name: 'United Kingdom' }, language: 'English', articleCount: 2876, proportion: 0.21 },
    { sourceCountry: { code: 'IE', name: 'Ireland' }, language: 'Spanish', articleCount: 241, proportion: 0.02 },
    { sourceCountry: { code: 'XX', name: 'Unknown' }, language: 'Arabic', articleCount: 189, proportion: 0.01 },
    { sourceCountry: { code: 'AU', name: 'Australia' }, language: 'Portuguese', articleCount: 312, proportion: 0.02 },
    { sourceCountry: { code: 'BR', name: 'Brazil' }, language: 'Portuguese', articleCount: 288, proportion: 0.02 },
    { sourceCountry: { code: 'GR', name: 'Greece' }, language: 'Greek', articleCount: 156, proportion: 0.01 },
    { sourceCountry: { code: 'IT', name: 'Italy' }, language: 'Italian', articleCount: 198, proportion: 0.01 },
    { sourceCountry: { code: 'RO', name: 'Romania' }, language: 'Romanian', articleCount: 134, proportion: 0.01 },
  ]

  const articles = Array.from({ length: 40 }, (_, i) => ({
    id: `article-${i + 1}`,
    title: [
      'UK Prime Minister addresses Parliament amid rising economic tensions',
      'New cybersecurity directive proposed by European Commission',
      'Trade talks between UK and Gulf states resume in London',
      'Climate adaptation funding shortfall threatens coastal communities',
      'NATO exercise concludes with record participation across Eastern flank',
      'Energy grid resilience concerns grow following winter stress tests',
      'Diplomatic row over maritime boundaries enters second week',
      'Opposition parties call for independent inquiry into intelligence leaks',
      'Central bank holds rates as inflation data surprises analysts',
    ][i % 9],
    domain: ['bbc.co.uk', 'ft.com', 'theguardian.com', 'reuters.com', 'spiegel.de', 'lemonde.fr'][i % 6],
    sourceCountry: COUNTRIES[i % COUNTRIES.length],
    language: ['English', 'German', 'French', 'Russian'][i % 4],
    publishedAt: new Date(Date.now() - i * 3_600_000).toISOString(),
    sentimentScore: parseFloat(((Math.random() * 4) - 3).toFixed(2)),
    url: `https://example.com/article-${i + 1}`,
  }))

  return {
    selectedCountry: COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0],
    mode,
    dateRange: { from: dateFrom, to: dateTo },
    topInfluentialCountries,
    sourceLanguageFlows,
    articles,
    totalArticleCount: 13_721,
  }
}

export async function generateSummary(countryCode: string): Promise<NewsAnalyticsSummary> {
  await delay(1800)
  return {
    generatedAt: new Date().toISOString(),
    country: COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0],
    body: `This week's intelligence digest for **${
      COUNTRIES.find((c) => c.code === countryCode)?.name ?? countryCode
    }** highlights elevated tensions across multiple domains.\n\n**Key risk factors:**\n- Ongoing parliamentary debate over emergency powers legislation is drawing significant international media attention, with coverage skewing strongly negative.\n- Economic indicators show diverging signals: labour market remains resilient but manufacturing output contracted for a third consecutive month.\n- Regional security environment remains volatile; cross-border incidents reported in three neighbouring states.\n\n**Emerging signals:**\n- Coordinated social media narratives detected originating from external state-linked accounts targeting domestic political fault lines.\n- Energy infrastructure vulnerability assessments have been leaked to several outlets, prompting official responses.\n\nOverall risk posture: **Elevated**. Recommend continued monitoring of legislative developments and information environment.`,
  }
}

export async function fetchAvailableCountries(): Promise<Country[]> {
  await delay(200)
  return COUNTRIES
}

// ─── Task 2 – Entity Monitor ─────────────────────────────────────────────────

const MOCK_ENTITIES: Entity[] = [
  { id: 'e1', name: 'Viktor Petrov', type: 'person', tags: ['government', 'intelligence'], watchlisted: true },
  { id: 'e2', name: 'Meridian Capital Group', type: 'organisation', tags: ['finance', 'sanctions'], watchlisted: true },
  { id: 'e3', name: 'Black Sea Region', type: 'location', tags: ['military', 'maritime'], watchlisted: false },
  { id: 'e4', name: 'Operation Coldfront', type: 'event', tags: ['cyber', 'infrastructure'], watchlisted: true },
  { id: 'e5', name: 'Disinformation Campaign – EU Elections', type: 'topic', tags: ['influence-ops', 'election'], watchlisted: true },
  { id: 'e6', name: 'Dr. Amara Nwosu', type: 'person', tags: ['academia', 'biosecurity'], watchlisted: false },
  { id: 'e7', name: 'Helios Energy Holdings', type: 'organisation', tags: ['energy', 'critical-infrastructure'], watchlisted: true },
  { id: 'e8', name: 'Northern Corridor', type: 'location', tags: ['logistics', 'supply-chain'], watchlisted: false },
]

const THREAT_LEVELS: ThreatLevel[] = ['critical', 'high', 'medium', 'low', 'informational']

const SIGNAL_TITLES = [
  'Unusual financial transfers traced to monitored entity',
  'New public statements contradict previously recorded positions',
  'Spike in coordinated online activity around entity',
  'Entity linked to procurement of dual-use components',
  'Travel pattern anomaly detected — unexpected border crossings',
  'Entity appears in leaked documents obtained by media',
  'New corporate structure obscures beneficial ownership',
  'Dormant entity reactivated following sanctions announcement',
  'Entity cited in parliamentary intelligence committee report',
  'Cross-referencing confirms undisclosed network connection',
]

const generateMockSignals = (): Signal[] =>
  Array.from({ length: 60 }, (_, i) => {
    const entity = MOCK_ENTITIES[i % MOCK_ENTITIES.length]
    return {
      id: `sig-${i + 1}`,
      entityId: entity.id,
      entityName: entity.name,
      entityType: entity.type,
      title: SIGNAL_TITLES[i % SIGNAL_TITLES.length],
      summary:
        'Automated analysis flagged this signal based on a combination of source credibility, semantic proximity to watchlisted identifiers, and deviation from established baseline behaviour.',
      threatLevel: THREAT_LEVELS[i % THREAT_LEVELS.length],
      sentimentScore: parseFloat(((Math.random() * 4) - 3).toFixed(2)),
      sourceCountry: COUNTRIES[i % COUNTRIES.length],
      sourceDomain: ['reuters.com', 'bellingcat.com', 'occrp.org', 'ft.com', 'lemonde.fr'][i % 5],
      language: ['English', 'German', 'French'][i % 3],
      detectedAt: new Date(Date.now() - i * 7_200_000).toISOString(),
      articleCount: Math.floor(Math.random() * 40) + 1,
      relatedEntities: MOCK_ENTITIES.filter((e) => e.id !== entity.id)
        .slice(0, 2)
        .map((e) => e.name),
    }
  })

const ALL_SIGNALS = generateMockSignals()

/**
 * GET /api/v1/entity-monitor/overview
 * Returns high-level metrics for the monitoring period.
 */
export async function fetchEntityMonitorOverview(
  _dateFrom: string,
  _dateTo: string,
): Promise<EntityMonitorOverview> {
  await delay()
  return {
    periodStart: _dateFrom,
    periodEnd: _dateTo,
    totalSignals: 247,
    criticalSignals: 12,
    newEntitiesSurfaced: 5,
    topThreatLevelBreakdown: {
      critical: 12,
      high: 38,
      medium: 91,
      low: 74,
      informational: 32,
    },
  }
}

/**
 * GET /api/v1/entity-monitor/entities
 * Returns list of tracked entities.
 */
export async function fetchEntities(): Promise<Entity[]> {
  await delay(300)
  return MOCK_ENTITIES
}

/**
 * GET /api/v1/entity-monitor/entities/:id/trend
 * Returns time-series mention and sentiment data for a specific entity.
 */
export async function fetchEntityTrend(entityId: string): Promise<EntityTrendResponse> {
  await delay()
  const entity = MOCK_ENTITIES.find((e) => e.id === entityId) ?? MOCK_ENTITIES[0]
  const dataPoints = Array.from({ length: 30 }, (_, i) => ({
    timestamp: new Date(Date.now() - (29 - i) * 86_400_000).toISOString(),
    mentionCount: Math.floor(Math.random() * 80) + 5,
    sentimentScore: parseFloat(((Math.random() * 4) - 3).toFixed(2)),
  }))
  return {
    entity,
    dataPoints,
    peakMentionDate: dataPoints.reduce((a, b) => (a.mentionCount > b.mentionCount ? a : b)).timestamp,
    averageSentiment: parseFloat(
      (dataPoints.reduce((s, d) => s + d.sentimentScore, 0) / dataPoints.length).toFixed(2),
    ),
  }
}

/**
 * GET /api/v1/entity-monitor/signals
 * Returns paginated list of signals, with optional filters.
 *
 * Query params:
 *   entityId?       string
 *   threatLevel?    ThreatLevel[]  (comma-separated)
 *   entityType?     EntityType[]   (comma-separated)
 *   dateFrom?       ISO 8601 string
 *   dateTo?         ISO 8601 string
 *   page?           number (default: 1)
 *   pageSize?       number (default: 20)
 */
export async function fetchSignals(filters: SignalFilters = {}): Promise<SignalsResponse> {
  await delay()
  const { entityId, threatLevel, entityType, page = 1, pageSize = 20 } = filters

  let filtered = ALL_SIGNALS
  if (entityId) filtered = filtered.filter((s) => s.entityId === entityId)
  if (threatLevel?.length) filtered = filtered.filter((s) => threatLevel.includes(s.threatLevel))
  if (entityType?.length) filtered = filtered.filter((s) => entityType.includes(s.entityType as EntityType))

  const total = filtered.length
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  return { signals: paginated, total, page, pageSize }
}
