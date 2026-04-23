import { ResponsiveSankey } from '@nivo/sankey'
import type { SourceLanguageFlow } from '@/types'

interface SankeyDiagramProps {
  flows: SourceLanguageFlow[]
}

// Palette for source-country nodes — muted but distinct
const COUNTRY_COLORS: Record<string, string> = {
  Germany: '#C87DA0',
  'Russian Federation': '#C85858',
  International: '#C8A86C',
  'United Kingdom': '#8888D6',
  Ireland: '#88C8A8',
  Unknown: '#8898C8',
  Australia: '#C8C888',
  Brazil: '#88A8C8',
  Greece: '#A888C8',
  Italy: '#C8A888',
  Romania: '#88C8C8',
}

const FALLBACK_COLOR = '#666'

export function SankeyDiagram({ flows }: SankeyDiagramProps) {
  // Build unique node set and link array
  const nodeSet = new Set<string>()
  const links: { source: string; target: string; value: number }[] = []

  for (const { sourceCountry, language, articleCount } of flows) {
    nodeSet.add(sourceCountry.name)
    nodeSet.add(`lang:${language}`)
    links.push({
      source: sourceCountry.name,
      target: `lang:${language}`,
      value: articleCount,
    })
  }

  const nodes = Array.from(nodeSet).map((id) => ({ id }))

  return (
    <section className="mb-10">
      <h3 className="text-xs font-semibold text-[#e0e0e0] mb-1 flex items-center gap-1.5 tracking-wide">
        Source countries and languages of articles
        <span className="text-[#555] font-normal">ⓘ</span>
      </h3>
      <div className="flex justify-between text-[10px] text-[#555] uppercase tracking-[0.12em] mb-1 px-0">
        <span>Country</span>
        <span>Language</span>
      </div>

      <div style={{ height: 420 }}>
        <ResponsiveSankey
          data={{ nodes, links }}
          margin={{ top: 8, right: 140, bottom: 8, left: 140 }}
          align="justify"
          colors={({ id }) =>
            id.toString().startsWith('lang:')
              ? FALLBACK_COLOR
              : COUNTRY_COLORS[id.toString()] ?? FALLBACK_COLOR
          }
          nodeOpacity={1}
          nodeThickness={20}
          nodeInnerPadding={2}
          nodeSpacing={10}
          nodeBorderWidth={0}
          nodeBorderRadius={0}
          linkOpacity={0.35}
          enableLinkGradient
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={14}
          label={({ id }) =>
            id.toString().startsWith('lang:') ? id.toString().replace('lang:', '') : id.toString()
          }
          theme={{
            background: 'transparent',
            text: {
              fill: '#888',
              fontSize: 11,
            },
            tooltip: {
              container: {
                background: '#1a1a1a',
                color: '#e0e0e0',
                fontSize: 11,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              },
            },
          }}
        />
      </div>
    </section>
  )
}
