const NAV_LINKS = [
  { label: 'News Analytics', active: true },
  { label: 'Society Profiling', active: false },
  { label: 'Policy Resonance', active: false },
  { label: 'Communications Resonance', active: false },
]

export function NavSidebar() {
  return (
    <aside className="w-48 shrink-0 border-l border-[#2a2a2a] flex flex-col p-5">
      <nav className="flex flex-col gap-4">
        {NAV_LINKS.map(({ label, active }) => (
          <button
            key={label}
            disabled={!active}
            className={`text-left text-[10px] tracking-[0.15em] uppercase transition-colors ${
              active ? 'text-white font-semibold' : 'text-[#444] cursor-default'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Right-side sentiment scale – decorative, matches the reference */}
      <div className="flex-1 flex justify-end items-stretch pointer-events-none py-4">
        <div className="flex flex-col items-end gap-0 text-[9px] text-[#555] tracking-[0.15em] uppercase justify-between h-full max-h-72 mt-auto">
          <span>Negative</span>
          <div className="w-0.5 flex-1 mx-auto bg-gradient-to-b from-[#C9695A] via-[#555] to-[#6B5BD6] my-1 self-end mr-0" />
          <span>Neutral</span>
          <div className="w-0.5 flex-1 mx-auto bg-gradient-to-b from-[#555] to-[#6B5BD6] my-1 self-end mr-0" />
          <span>Positive</span>
        </div>
      </div>

      <div className="border-t border-[#2a2a2a] pt-4 mt-auto">
        <div className="text-[10px] text-[#555] mb-0.5">Your trial ends in:</div>
        <div className="text-[11px] text-[#888] mb-3">3 days 14h 8m 34s</div>
        <button className="w-full bg-[#C9695A] hover:bg-[#d4786a] text-white text-[10px] tracking-widest py-1.5 mb-4 transition-colors">
          UPGRADE NOW
        </button>
        <div className="flex items-center gap-1.5 text-[11px] text-[#888] mb-2">
          <span aria-hidden>⬡</span>
          <span>Adam Zurek</span>
        </div>
        <button className="text-[11px] text-[#555] hover:text-[#aaa] transition-colors">
          Logout
        </button>
      </div>
    </aside>
  )
}
