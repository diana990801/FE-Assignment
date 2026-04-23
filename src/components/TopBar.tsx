import type { Country, DataMode } from '@/types'

interface TopBarProps {
  countries: Country[]
  selectedCountry: string
  onCountryChange: (code: string) => void
  mode: DataMode
  onModeChange: (mode: DataMode) => void
}

export function TopBar({
  countries,
  selectedCountry,
  onCountryChange,
  mode,
  onModeChange,
}: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-6 h-12 border-b border-[#2a2a2a] bg-[#111] shrink-0 z-10">
      <span className="text-white font-semibold tracking-widest text-sm select-none">
        CulturePulse
      </span>

      <div className="flex items-center gap-1">
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="appearance-none bg-transparent border-b border-[#666] text-white text-xs uppercase tracking-[0.15em] px-2 py-0.5 pr-5 focus:outline-none cursor-pointer"
          style={{ backgroundImage: 'none' }}
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code} className="bg-[#1a1a1a] text-white normal-case">
              {c.name.toUpperCase()}
            </option>
          ))}
        </select>
        <span className="text-[#888] text-xs pointer-events-none -ml-4">▾</span>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`text-xs tracking-widest transition-colors ${
            mode === 'news' ? 'text-white' : 'text-[#555]'
          }`}
        >
          NEWS
        </span>
        <button
          onClick={() => onModeChange(mode === 'news' ? 'social_media' : 'news')}
          aria-label="Toggle data mode"
          className="relative w-9 h-5 rounded-full bg-[#333] flex items-center focus:outline-none"
        >
          <div
            className={`absolute w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${
              mode === 'social_media' ? 'translate-x-[22px]' : 'translate-x-[3px]'
            }`}
          />
        </button>
        <span
          className={`text-xs tracking-widest transition-colors ${
            mode === 'social_media' ? 'text-white' : 'text-[#555]'
          }`}
        >
          SOCIAL MEDIA
        </span>
      </div>
    </header>
  )
}
