import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface TotalProductsCardProps {
  productsCount: number | null
}

export default function TotalProductsCard({
  productsCount,
}: TotalProductsCardProps) {
  const displayproductsCount = productsCount ?? 0
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatNumber(displayproductsCount)}
        </div>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardContent>
    </Card>
  )
}
