'use client'

import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ChartsCard({
  data: { salesData },
}: {
  data: { salesData: { months: string; totalSales: number }[] }
}) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={salesData}>
            <XAxis
              dataKey="months"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              axisLine={false}
              tick={{ fill: '#d1d5db' }}
              tickLine={false}
            />
          
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Bar
              dataKey="totalSales"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
              legendType="circle"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
