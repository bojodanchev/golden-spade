"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

const STAGE_COLORS: Record<string, string> = {
  initial_contact: "#718096",
  lead: "#718096",
  contacted: "#4299e1",
  discovery: "#4299e1",
  qualified: "#d69e2e",
  proposal: "#dd6b20",
  negotiation: "#805ad5",
  closed_won: "#38a169",
  closed_lost: "#e53e3e",
}

const STAGE_LABELS: Record<string, string> = {
  initial_contact: "Initial Contact",
  lead: "Lead",
  contacted: "Contacted",
  discovery: "Discovery",
  qualified: "Qualified",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
}

interface PipelineData {
  stage: string
  count: number
  totalValue: number
}

interface PipelineSummaryProps {
  data: PipelineData[]
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: PipelineData }>
}) {
  if (!active || !payload?.length) return null

  const item = payload[0].payload
  return (
    <div className="rounded-lg border bg-card p-3 shadow-md">
      <p className="font-medium">{STAGE_LABELS[item.stage] || item.stage}</p>
      <p className="text-sm text-muted-foreground">
        {item.count} deal{item.count !== 1 ? "s" : ""}
      </p>
      <p className="text-sm font-mono text-muted-foreground">
        {formatCurrency(item.totalValue)}
      </p>
    </div>
  )
}

export function PipelineSummary({ data }: PipelineSummaryProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: STAGE_LABELS[d.stage] || d.stage,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No deals in pipeline yet
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
            >
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="label"
                width={110}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.stage}
                    fill={STAGE_COLORS[entry.stage] || "#718096"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
