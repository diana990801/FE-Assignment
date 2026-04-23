/**
 * Task 2 — Entity Monitor
 *
 * Implement this screen based on the product requirements and API definitions below.
 * There is no design reference — layout, visual hierarchy, and UX decisions are yours to make.
 *
 * ─── Product Requirements ──────────────────────────────────────────────────────
 *
 * Analysts need a single screen to monitor a curated set of tracked entities
 * (people, organisations, locations, topics, events) for emerging threat signals.
 *
 * The screen must allow an analyst to:
 *
 *   1. Get an at-a-glance overview of monitoring activity:
 *      - Total signals detected in the current period
 *      - Number of critical signals
 *      - Newly surfaced entities
 *      - A breakdown of signals by threat level (Critical / High / Medium / Low / Informational)
 *
 *   2. Explore individual entity activity:
 *      - Select an entity from a list
 *      - See a time-series chart of mention counts and sentiment score over the last 30 days
 *
 *   3. Browse and triage signals:
 *      - View a paginated list of signals, each showing:
 *          - Entity name and type
 *          - Signal title and summary
 *          - Threat level (visually distinct — this is the primary triage dimension)
 *          - Detected date/time
 *          - Source domain and country
 *          - Number of related articles
 *      - Filter signals by: threat level, entity type
 *      - The list should update without a full page reload
 *
 * ─── API Reference ─────────────────────────────────────────────────────────────
 *
 * All functions are available in @/api/mock.ts. Their signatures are:
 *
 *   fetchEntityMonitorOverview(dateFrom: string, dateTo: string)
 *     → Promise<EntityMonitorOverview>
 *
 *   fetchEntities()
 *     → Promise<Entity[]>
 *
 *   fetchEntityTrend(entityId: string)
 *     → Promise<EntityTrendResponse>
 *
 *   fetchSignals(filters?: SignalFilters)
 *     → Promise<SignalsResponse>
 *
 * All types are defined in @/types/index.ts.
 *
 * ─── Notes ─────────────────────────────────────────────────────────────────────
 *
 * - The people using this tool operate in high-pressure environments. Clarity and
 *   information density matter more than decoration.
 * - Consider what happens when data is loading, empty, or returns an error.
 * - You do not need to implement authentication, routing, or persistence.
 */

import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  useEntities,
  useEntityMonitorOverview,
  useEntityTrend,
  useSignals,
} from '@/hooks/useEntityMonitor'
import type { Entity, EntityType, ThreatLevel } from '@/types'

// ─── Constants ───────────────────────────────────────────────────────────────

const DATE_FROM = new Date(Date.now() - 30 * 86_400_000).toISOString()
const DATE_TO = new Date().toISOString()

const THREAT_LEVELS: ThreatLevel[] = ['critical', 'high', 'medium', 'low', 'informational']
const ENTITY_TYPES: EntityType[] = ['person', 'organisation', 'location', 'topic', 'event']

const THREAT_COLORS: Record<ThreatLevel, string> = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#EAB308',
  low: '#3B82F6',
  informational: '#6B7280',
}

const ENTITY_TYPE_COLORS: Record<EntityType, string> = {
  person: '#8888D6',
  organisation: '#C8A86C',
  location: '#88C8A8',
  topic: '#C87DA0',
  event: '#88A8C8',
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="border border-[#2a2a2a] bg-[#161616] px-4 py-3 flex flex-col gap-1 min-w-[120px]">
      <span className="text-[10px] uppercase tracking-[0.15em] text-[#555]">{label}</span>
      <span className={`text-2xl font-semibold tabular-nums ${accent ?? 'text-[#e0e0e0]'}`}>
        {value.toLocaleString()}
      </span>
    </div>
  )
}

function ThreatBreakdownBar({ breakdown }: { breakdown: Record<ThreatLevel, number> }) {
  const total = Object.values(breakdown).reduce((s, v) => s + v, 0)
  if (!total) return null
  return (
    <div className="border border-[#2a2a2a] bg-[#161616] px-4 py-3 flex-1 min-w-[200px]">
      <span className="text-[10px] uppercase tracking-[0.15em] text-[#555] block mb-2">
        Signal breakdown
      </span>
      <div className="flex h-4 rounded overflow-hidden gap-px">
        {THREAT_LEVELS.map((level) => {
          const pct = (breakdown[level] / total) * 100
          return pct > 0 ? (
            <div
              key={level}
              title={`${level}: ${breakdown[level]}`}
              style={{ width: `${pct}%`, backgroundColor: THREAT_COLORS[level] }}
            />
          ) : null
        })}
      </div>
      <div className="flex gap-3 mt-2 flex-wrap">
        {THREAT_LEVELS.map((level) => (
          <span key={level} className="flex items-center gap-1 text-[10px] text-[#666]">
            <span
              className="inline-block w-2 h-2 rounded-sm"
              style={{ backgroundColor: THREAT_COLORS[level] }}
            />
            {level.charAt(0).toUpperCase() + level.slice(1)} ({breakdown[level]})
          </span>
        ))}
      </div>
    </div>
  )
}

function EntityRow({
  entity,
  selected,
  onClick,
}: {
  entity: Entity
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 border-b border-[#1d1d1d] flex items-start gap-2 hover:bg-[#1a1a1a] transition-colors ${
        selected ? 'bg-[#1e1e1e] border-l-2 border-l-[#6B5BD6]' : 'border-l-2 border-l-transparent'
      }`}
    >
      <span
        className="mt-0.5 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
        style={{
          backgroundColor: ENTITY_TYPE_COLORS[entity.type] + '33',
          color: ENTITY_TYPE_COLORS[entity.type],
        }}
      >
        {entity.type}
      </span>
      <div className="min-w-0">
        <div className="text-[12px] text-[#d0d0d0] truncate">{entity.name}</div>
        {entity.tags.length > 0 && (
          <div className="flex gap-1 mt-0.5 flex-wrap">
            {entity.tags.map((tag) => (
              <span key={tag} className="text-[9px] text-[#555] bg-[#222] px-1 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {entity.watchlisted && (
        <span className="ml-auto text-[#C9695A] text-xs shrink-0" title="Watchlisted">
          ★
        </span>
      )}
    </button>
  )
}

function TrendChart({
  entityId,
  entityName,
}: {
  entityId: string
  entityName: string
}) {
  const { data, loading } = useEntityTrend(entityId)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-5 h-5 border-2 border-[#333] border-t-[#aaa] rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) return null

  const chartData = data.dataPoints.map((dp) => ({
    date: new Date(dp.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    mentions: dp.mentionCount,
    sentiment: dp.sentimentScore,
  }))

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-xs font-semibold text-[#e0e0e0] tracking-wide truncate">
          {entityName}
        </h3>
        <div className="flex gap-4 text-[10px] text-[#555] shrink-0 ml-2">
          <span>
            avg sentiment:{' '}
            <span className={data.averageSentiment >= 0 ? 'text-[#6B5BD6]' : 'text-[#C9695A]'}>
              {data.averageSentiment.toFixed(2)}
            </span>
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="#222" strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#555', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            interval={6}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: '#555', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[-3, 1]}
            tick={{ fill: '#555', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: 2,
              fontSize: 11,
              color: '#e0e0e0',
            }}
            itemStyle={{ color: '#aaa' }}
          />
          <Legend
            iconSize={8}
            wrapperStyle={{ fontSize: 10, color: '#666' }}
            formatter={(value) => (value === 'mentions' ? 'Mentions' : 'Sentiment')}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="mentions"
            stroke="#6B5BD6"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="sentiment"
            stroke="#C9695A"
            strokeWidth={1.5}
            dot={false}
            strokeDasharray="4 2"
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

function ThreatBadge({ level }: { level: ThreatLevel }) {
  return (
    <span
      className="text-[9px] uppercase tracking-[0.12em] font-bold px-2 py-0.5 rounded"
      style={{
        backgroundColor: THREAT_COLORS[level] + '22',
        color: THREAT_COLORS[level],
        border: `1px solid ${THREAT_COLORS[level]}44`,
      }}
    >
      {level}
    </span>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function EntityMonitorPage() {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null)
  const [threatFilter, setThreatFilter] = useState<ThreatLevel[]>([])
  const [typeFilter, setTypeFilter] = useState<EntityType[]>([])
  const [page, setPage] = useState(1)

  const { data: overview, loading: overviewLoading } = useEntityMonitorOverview(
    DATE_FROM,
    DATE_TO,
  )
  const { entities, loading: entitiesLoading } = useEntities()

  const signalFilters = useMemo(
    () => ({
      threatLevel: threatFilter.length ? threatFilter : undefined,
      entityType: typeFilter.length ? typeFilter : undefined,
      page,
      pageSize: 10,
    }),
    // stringify arrays so the object ref doesn't change on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [threatFilter.join(','), typeFilter.join(','), page],
  )

  const { response: signalsResponse, loading: signalsLoading } = useSignals(signalFilters)

  const selectedEntity = entities.find((e) => e.id === selectedEntityId) ?? null

  function toggleThreat(level: ThreatLevel) {
    setPage(1)
    setThreatFilter((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    )
  }

  function toggleType(type: EntityType) {
    setPage(1)
    setTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }

  const totalPages = signalsResponse
    ? Math.ceil(signalsResponse.total / signalsResponse.pageSize)
    : 1

  return (
    <div className="min-h-screen bg-[#111] text-[#e0e0e0] flex flex-col">
      {/* Page header */}
      <header className="flex items-center justify-between px-6 h-12 border-b border-[#2a2a2a] shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-white font-semibold tracking-widest text-sm">CulturePulse</span>
          <span className="text-[#444] text-xs">|</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#888]">
            Entity Monitor
          </span>
        </div>
        <span className="text-[10px] text-[#555]">
          Last 30 days &mdash;{' '}
          {new Date(DATE_FROM).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} –{' '}
          {new Date(DATE_TO).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      </header>

      <div className="flex-1 px-6 py-5 space-y-6 max-w-screen-2xl w-full mx-auto">
        {/* ── Overview Panel ── */}
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#555] mb-3">Overview</h2>
          {overviewLoading ? (
            <div className="h-20 flex items-center">
              <div className="w-5 h-5 border-2 border-[#333] border-t-[#aaa] rounded-full animate-spin" />
            </div>
          ) : overview ? (
            <div className="flex flex-wrap gap-3 items-stretch">
              <StatCard label="Total signals" value={overview.totalSignals} />
              <StatCard
                label="Critical signals"
                value={overview.criticalSignals}
                accent="text-[#EF4444]"
              />
              <StatCard label="New entities" value={overview.newEntitiesSurfaced} />
              <ThreatBreakdownBar breakdown={overview.topThreatLevelBreakdown} />
            </div>
          ) : null}
        </section>

        {/* ── Entity Activity ── */}
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#555] mb-3">
            Entity Activity
          </h2>
          <div className="flex gap-4">
            {/* Entity list */}
            <div className="w-72 shrink-0 border border-[#2a2a2a] overflow-y-auto max-h-80">
              {entitiesLoading ? (
                <div className="flex items-center justify-center h-20">
                  <div className="w-4 h-4 border-2 border-[#333] border-t-[#aaa] rounded-full animate-spin" />
                </div>
              ) : (
                entities.map((entity) => (
                  <EntityRow
                    key={entity.id}
                    entity={entity}
                    selected={entity.id === selectedEntityId}
                    onClick={() =>
                      setSelectedEntityId((prev) => (prev === entity.id ? null : entity.id))
                    }
                  />
                ))
              )}
            </div>

            {/* Trend chart */}
            <div className="flex-1 border border-[#2a2a2a] bg-[#161616] p-4 min-h-[200px]">
              {selectedEntity ? (
                <TrendChart entityId={selectedEntity.id} entityName={selectedEntity.name} />
              ) : (
                <div className="flex items-center justify-center h-full text-[#444] text-sm">
                  Select an entity to view its 30-day trend
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Signal Feed ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#555]">Signal Feed</h2>
            {signalsResponse && (
              <span className="text-[10px] text-[#555]">
                {signalsResponse.total} signal{signalsResponse.total !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <span className="text-[9px] uppercase tracking-[0.12em] text-[#555] block mb-1.5">
                Threat level
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {THREAT_LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => toggleThreat(level)}
                    className="text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 rounded border transition-all"
                    style={
                      threatFilter.includes(level)
                        ? {
                            backgroundColor: THREAT_COLORS[level] + '33',
                            borderColor: THREAT_COLORS[level],
                            color: THREAT_COLORS[level],
                          }
                        : {
                            backgroundColor: 'transparent',
                            borderColor: '#333',
                            color: '#555',
                          }
                    }
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.12em] text-[#555] block mb-1.5">
                Entity type
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {ENTITY_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className="text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 rounded border transition-all"
                    style={
                      typeFilter.includes(type)
                        ? {
                            backgroundColor: ENTITY_TYPE_COLORS[type] + '33',
                            borderColor: ENTITY_TYPE_COLORS[type],
                            color: ENTITY_TYPE_COLORS[type],
                          }
                        : {
                            backgroundColor: 'transparent',
                            borderColor: '#333',
                            color: '#555',
                          }
                    }
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            {(threatFilter.length > 0 || typeFilter.length > 0) && (
              <button
                onClick={() => {
                  setThreatFilter([])
                  setTypeFilter([])
                  setPage(1)
                }}
                className="text-[11px] text-[#C9695A] hover:text-[#e07060] transition-colors self-end mb-0.5"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Signal list */}
          {signalsLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-5 h-5 border-2 border-[#333] border-t-[#aaa] rounded-full animate-spin" />
            </div>
          ) : signalsResponse && signalsResponse.signals.length > 0 ? (
            <div className="space-y-2">
              {signalsResponse.signals.map((signal) => (
                <div
                  key={signal.id}
                  className="border border-[#2a2a2a] bg-[#161616] hover:bg-[#1a1a1a] transition-colors p-4 flex gap-4"
                >
                  {/* Threat badge — leftmost, most prominent */}
                  <div className="shrink-0 flex flex-col items-center justify-start pt-0.5 w-24">
                    <ThreatBadge level={signal.threatLevel} />
                    <div
                      className="w-px flex-1 mt-2 opacity-20"
                      style={{ backgroundColor: THREAT_COLORS[signal.threatLevel] }}
                    />
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-[13px] text-[#d0d0d0] font-medium leading-snug">
                        {signal.title}
                      </span>
                      <span className="text-[10px] text-[#555] whitespace-nowrap shrink-0 font-mono">
                        {new Date(signal.detectedAt).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#666] leading-relaxed mb-2">{signal.summary}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#555]">
                      <span className="flex items-center gap-1">
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] uppercase"
                          style={{
                            backgroundColor: ENTITY_TYPE_COLORS[signal.entityType] + '22',
                            color: ENTITY_TYPE_COLORS[signal.entityType],
                          }}
                        >
                          {signal.entityType}
                        </span>
                        <span className="text-[#888]">{signal.entityName}</span>
                      </span>
                      <span>{signal.sourceDomain}</span>
                      <span>{signal.sourceCountry.name}</span>
                      <span>{signal.articleCount} article{signal.articleCount !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-[#2a2a2a] py-12 text-center text-[#444] text-sm">
              No signals match the current filters.
            </div>
          )}

          {/* Pagination */}
          {!signalsLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border border-[#333] text-[#888] text-[11px] px-3 py-1.5 hover:border-[#666] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-default"
              >
                ← Prev
              </button>
              <span className="text-[11px] text-[#555]">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border border-[#333] text-[#888] text-[11px] px-3 py-1.5 hover:border-[#666] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-default"
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
