import { useMemo, useState } from 'react'
import type { NewsArticle } from '@/types'

interface ArticlesSectionProps {
  articles: NewsArticle[]
  dateRange: { from: string; to: string }
  totalCount: number
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

export function ArticlesSection({ articles, dateRange, totalCount }: ArticlesSectionProps) {
  const [search, setSearch] = useState('')
  const [domainFilter, setDomainFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [languageFilter, setLanguageFilter] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const domains = useMemo(() => [...new Set(articles.map((a) => a.domain))].sort(), [articles])
  const countries = useMemo(
    () => [...new Set(articles.map((a) => a.sourceCountry.name))].sort(),
    [articles],
  )
  const languages = useMemo(
    () => [...new Set(articles.map((a) => a.language))].sort(),
    [articles],
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return articles.filter((a) => {
      if (q && !a.title.toLowerCase().includes(q)) return false
      if (domainFilter && a.domain !== domainFilter) return false
      if (countryFilter && a.sourceCountry.name !== countryFilter) return false
      if (languageFilter && a.language !== languageFilter) return false
      return true
    })
  }, [articles, search, domainFilter, countryFilter, languageFilter])

  const dateLabel = `${fmtDate(dateRange.from)} – ${fmtDate(dateRange.to)}`

  return (
    <section className="pb-10">
      <h3 className="text-xs font-semibold text-[#e0e0e0] mb-4 flex items-center gap-1.5 tracking-wide">
        News articles
        <span className="text-[#555] font-normal">ⓘ</span>
        <span className="ml-auto text-[#555] font-normal text-[10px]">
          {totalCount.toLocaleString()} total
        </span>
      </h3>

      {/* Search row */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex flex-col gap-0.5">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border border-[#333] text-[#e0e0e0] text-[11px] px-3 py-1.5 w-52 focus:outline-none focus:border-[#666] placeholder-[#444]"
          />
          <span className="text-[10px] text-[#444] pl-1">(Search in {dateLabel})</span>
        </div>
        <span className="text-xs text-[#888] tracking-wider">{dateLabel}</span>
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="ml-auto border border-[#333] text-[10px] text-[#888] px-4 py-1.5 tracking-widest hover:border-[#666] hover:text-white transition-colors"
        >
          FILTER
        </button>
      </div>

      {/* Filter row */}
      {filtersOpen && (
        <div className="flex gap-2 mb-3 flex-wrap">
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-[#333] text-[#888] text-[11px] px-2 py-1.5 focus:outline-none"
          >
            <option value="">Domain</option>
            {domains.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-[#333] text-[#888] text-[11px] px-2 py-1.5 focus:outline-none"
          >
            <option value="">Source country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-[#333] text-[#888] text-[11px] px-2 py-1.5 focus:outline-none"
          >
            <option value="">Language</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          {(domainFilter || countryFilter || languageFilter) && (
            <button
              onClick={() => {
                setDomainFilter('')
                setCountryFilter('')
                setLanguageFilter('')
              }}
              className="text-[11px] text-[#C9695A] hover:text-[#e07060] transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="border border-[#2a2a2a] overflow-x-auto">
        <table className="w-full text-[11px] min-w-[700px]">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              {['Title', 'Domain', 'Source Country', 'Language', 'Published'].map((col) => (
                <th
                  key={col}
                  className="text-left px-3 py-2 text-[#555] font-normal tracking-wide whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-[#444]">
                  No articles match your search.
                </td>
              </tr>
            ) : (
              filtered.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-[#1d1d1d] hover:bg-[#181818] transition-colors"
                >
                  <td className="px-3 py-2 text-[#d0d0d0] max-w-xs">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white hover:underline line-clamp-2"
                    >
                      {article.title}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-[#777] whitespace-nowrap">{article.domain}</td>
                  <td className="px-3 py-2 text-[#777] whitespace-nowrap">
                    {article.sourceCountry.name}
                  </td>
                  <td className="px-3 py-2 text-[#777] whitespace-nowrap">{article.language}</td>
                  <td className="px-3 py-2 text-[#777] whitespace-nowrap font-mono">
                    {fmtDate(article.publishedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
