import { useEffect, useState } from 'react'
import {
  fetchEntities,
  fetchEntityMonitorOverview,
  fetchEntityTrend,
  fetchSignals,
} from '@/api/mock'
import type {
  Entity,
  EntityMonitorOverview,
  EntityTrendResponse,
  SignalFilters,
  SignalsResponse,
} from '@/types'

export function useEntityMonitorOverview(dateFrom: string, dateTo: string) {
  const [data, setData] = useState<EntityMonitorOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchEntityMonitorOverview(dateFrom, dateTo)
      .then(setData)
      .finally(() => setLoading(false))
  }, [dateFrom, dateTo])

  return { data, loading }
}

export function useEntities() {
  const [entities, setEntities] = useState<Entity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEntities()
      .then(setEntities)
      .finally(() => setLoading(false))
  }, [])

  return { entities, loading }
}

export function useEntityTrend(entityId: string | null) {
  const [data, setData] = useState<EntityTrendResponse | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!entityId) return
    setLoading(true)
    setData(null)
    fetchEntityTrend(entityId)
      .then(setData)
      .finally(() => setLoading(false))
  }, [entityId])

  return { data, loading }
}

export function useSignals(filters: SignalFilters) {
  const [response, setResponse] = useState<SignalsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const threatLevelKey = filters.threatLevel?.join(',') ?? ''
  const entityTypeKey = filters.entityType?.join(',') ?? ''
  const page = filters.page ?? 1
  const entityId = filters.entityId ?? ''

  useEffect(() => {
    setLoading(true)
    fetchSignals(filters)
      .then(setResponse)
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threatLevelKey, entityTypeKey, page, entityId])

  return { response, loading }
}
