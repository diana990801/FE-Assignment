import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import type { InfluentialCountry } from '@/types'

interface SentimentBarChartProps {
  countries: InfluentialCountry[]
}

const NEG_COLOR = '#C9695A'
const POS_COLOR = '#6B5BD6'

export function SentimentBarChart({ countries }: SentimentBarChartProps) {
  const data = countries.map(({ country, sentimentScore }) => ({
    name: country.name.toUpperCase(),
    value: sentimentScore,
  }))

  return (
    <section className="mb-10">
      <h3 className="text-xs font-semibold text-[#e0e0e0] mb-4 flex items-center gap-1.5 tracking-wide">
        Top 20 influential countries
        <span className="text-[#555] font-normal">ⓘ</span>
      </h3>

      <ResponsiveContainer width="100%" height={480}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 40, left: 160, bottom: 20 }}
          barSize={9}
          barCategoryGap="25%"
        >
          <XAxis
            type="number"
            domain={[-3.5, 1.5]}
            ticks={[-3, -2, -1, 0, 1]}
            tick={{ fill: '#666', fontSize: 10, fontFamily: 'inherit' }}
            axisLine={{ stroke: '#2a2a2a' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={155}
            tick={{ fill: '#888', fontSize: 9.5, fontFamily: 'inherit' }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine x={0} stroke="#444" strokeWidth={1} />
          <Bar dataKey="value" isAnimationActive={false} radius={0}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.value >= 0 ? POS_COLOR : NEG_COLOR} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  )
}
