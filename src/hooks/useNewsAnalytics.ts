import { useCallback, useEffect, useState } from 'react'
import { fetchAvailableCountries, fetchNewsAnalytics, generateSummary } from '@/api/mock'
import type { Country, DataMode, NewsAnalyticsData, NewsAnalyticsSummary } from '@/types'

export function useAvailableCountries() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAvailableCountries()
      .then(setCountries)
      .finally(() => setLoading(false))
  }, [])

  return { countries, loading }
}

export function useNewsAnalytics(
  countryCode: string,
  mode: DataMode,
  dateFrom: string,
  dateTo: string,
) {
  const [data, setData] = useState<NewsAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchNewsAnalytics(countryCode, mode, dateFrom, dateTo)
      .then(setData)
      .catch((e: Error) => setError(e))
      .finally(() => setLoading(false))
  }, [countryCode, mode, dateFrom, dateTo])

  return { data, loading, error }
}

export function useSummary(countryCode: string) {
  const [summary, setSummary] = useState<NewsAnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(false)

  const generate = useCallback(() => {
    setLoading(true)
    setSummary(null)
    generateSummary(countryCode)
      .then(setSummary)
      .finally(() => setLoading(false))
  }, [countryCode])

  return { summary, loading, generate }
}
