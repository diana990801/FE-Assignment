// ─── Shared ────────────────────────────────────────────────────────────────

export type DataMode = 'news' | 'social_media'

export type SentimentScore = number // typically -3 to +1

// ─── Task 1: News Analytics ─────────────────────────────────────────────────

export interface Country {
  code: string // ISO 3166-1 alpha-2
  name: string
}

export interface InfluentialCountry {
  country: Country
  sentimentScore: SentimentScore
}

export interface SourceLanguageFlow {
  sourceCountry: Country
  language: string
  articleCount: number
  proportion: number // 0–1
}

export interface NewsArticle {
  id: string
  title: string
  domain: string
  sourceCountry: Country
  language: string
  publishedAt: string // ISO 8601
  sentimentScore: SentimentScore
  url: string
}

export interface NewsAnalyticsSummary {
  generatedAt: string
  country: Country
  body: string
}

export interface NewsAnalyticsData {
  selectedCountry: Country
  mode: DataMode
  dateRange: { from: string; to: string }
  topInfluentialCountries: InfluentialCountry[]
  sourceLanguageFlows: SourceLanguageFlow[]
  articles: NewsArticle[]
  totalArticleCount: number
}

// ─── Task 2: Entity Monitor ─────────────────────────────────────────────────

export type ThreatLevel = 'critical' | 'high' | 'medium' | 'low' | 'informational'

export type EntityType = 'person' | 'organisation' | 'location' | 'topic' | 'event'

export interface Entity {
  id: string
  name: string
  type: EntityType
  tags: string[]
  watchlisted: boolean
}

export interface SignalDataPoint {
  timestamp: string // ISO 8601
  mentionCount: number
  sentimentScore: SentimentScore
}

export interface Signal {
  id: string
  entityId: string
  entityName: string
  entityType: EntityType
  title: string
  summary: string
  threatLevel: ThreatLevel
  sentimentScore: SentimentScore
  sourceCountry: Country
  sourceDomain: string
  language: string
  detectedAt: string // ISO 8601
  articleCount: number
  relatedEntities: string[]
}

export interface EntityMonitorOverview {
  periodStart: string
  periodEnd: string
  totalSignals: number
  criticalSignals: number
  newEntitiesSurfaced: number
  topThreatLevelBreakdown: Record<ThreatLevel, number>
}

export interface EntityTrendResponse {
  entity: Entity
  dataPoints: SignalDataPoint[]
  peakMentionDate: string
  averageSentiment: SentimentScore
}

export interface SignalsResponse {
  signals: Signal[]
  total: number
  page: number
  pageSize: number
}

export interface SignalFilters {
  entityId?: string
  threatLevel?: ThreatLevel[]
  entityType?: EntityType[]
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}
