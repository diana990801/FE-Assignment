import type { NewsAnalyticsSummary } from '@/types'

interface SummarySidebarProps {
  summary: NewsAnalyticsSummary | null
  loading: boolean
  onGenerate: () => void
}

export function SummarySidebar({ summary, loading, onGenerate }: SummarySidebarProps) {
  return (
    <aside className="w-64 shrink-0 border-r border-[#2a2a2a] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5">
        <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#e0e0e0] mb-4 flex items-center gap-1.5">
          Summary of the Day
          <span className="text-[#555] font-normal">ⓘ</span>
        </h2>

        {!summary && !loading && (
          <div className="space-y-3 text-[11px] text-[#777] leading-relaxed">
            <p>
              Use the button below to summarize global news and explore what's happening in your
              selected location.
            </p>
            <p>
              This summary focuses on key risk factors, security concerns, and other developments
              that could affect national stability. You'll get an overview of emerging threats,
              political tensions, economic pressures, and events that may influence the safety and
              stability of selected country or region.
            </p>
            <p>
              We provide short and plain Key Points that resonated most in the latest news, helping
              you grasp the essentials quickly.
            </p>
            <p>
              Stay informed about the most critical issues shaping the world and make sense of
              complex situations at a glance.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="w-5 h-5 border-2 border-[#444] border-t-[#aaa] rounded-full animate-spin" />
            <p className="text-[11px] text-[#555]">Generating…</p>
          </div>
        )}

        {summary && (
          <div className="text-[11px] text-[#b0b0b0] leading-relaxed whitespace-pre-wrap">
            {/* Strip markdown bold markers for cleaner rendering */}
            {summary.body.replace(/\*\*/g, '')}
          </div>
        )}
      </div>

      <div className="p-5 border-t border-[#2a2a2a] shrink-0">
        <button
          onClick={onGenerate}
          disabled={loading}
          className="w-full border border-[#555] text-[#ccc] text-[11px] py-2 px-4 tracking-wider hover:border-[#aaa] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating…' : 'Generate summary'}
        </button>
      </div>
    </aside>
  )
}
