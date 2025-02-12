import type { ChartData } from "@package/ui/charts"

export type ChartProps = {
  lineColors: Record<string, string>
  chartData: ChartData
}

export type Statistics = {
  models: {
    total: number
    active: number
  }
  deployments: {
    total: number
    active: number
  }
}
