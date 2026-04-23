import { useState } from 'react'
import type { DataMode } from '@/types'
import { TopBar } from '@/components/TopBar'
import { SummarySidebar } from '@/components/SummarySidebar'
import { NavSidebar } from '@/components/NavSidebar'
import { SentimentBarChart } from '@/components/SentimentBarChart'
import { SankeyDiagram } from '@/components/SankeyDiagram'
import { ArticlesSection } from '@/components/ArticlesSection'
import { useAvailableCountries, useNewsAnalytics, useSummary } from '@/hooks/useNewsAnalytics'

// Fixed date window matching the reference design
const DATE_FROM = '2025-02-06'
const DATE_TO = '2025-02-12'

export default function NewsAnalyticsPage() {
  const [countryCode, setCountryCode] = useState('GB')
  const [mode, setMode] = useState<DataMode>('news')

  const { countries } = useAvailableCountries()
  const { data, loading, error } = useNewsAnalytics(countryCode, mode, DATE_FROM, DATE_TO)
  const { summary, loading: summaryLoading, generate } = useSummary(countryCode)

  return (
    <div className="flex flex-col h-screen bg-[#111] text-[#e0e0e0] overflow-hidden">
      <TopBar
        countries={countries}
        selectedCountry={countryCode}
        onCountryChange={setCountryCode}
        mode={mode}
        onModeChange={setMode}
      />

      <div className="flex flex-1 overflow-hidden">
        <SummarySidebar summary={summary} loading={summaryLoading} onGenerate={generate} />

        <main className="flex-1 overflow-y-auto px-8 py-6 min-w-0">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="w-6 h-6 border-2 border-[#333] border-t-[#aaa] rounded-full animate-spin" />
            </div>
          )}

          {error && !loading && (
            <div className="text-[#C9695A] text-sm text-center py-20">
              Failed to load data. Please try again.
            </div>
          )}

          {!loading && !error && data && (
            <>
              <SentimentBarChart countries={data.topInfluentialCountries} />
              <SankeyDiagram flows={data.sourceLanguageFlows} />
              <ArticlesSection
                articles={data.articles}
                dateRange={data.dateRange}
                totalCount={data.totalArticleCount}
              />
            </>
          )}
        </main>

        <NavSidebar />
      </div>
    </div>
  )
}
