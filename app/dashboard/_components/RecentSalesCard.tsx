// components/RecentSalesCard.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RecentSales } from '@/components/recent-sales'
import { formatCurrency } from '@/lib/utils'

interface RecentSalesCardProps {
  latestOrders: Array<{
    id: string
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
    }
    totalPrice: number
  }>
}

const RecentSalesCard: React.FC<RecentSalesCardProps> = ({ latestOrders }) => {
  return (
    <Card className="col-span-4 md:col-span-3">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>
          You made {latestOrders.length} sales this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {latestOrders.map((order) => (
          <RecentSales
            key={order.id}
            name={order.user?.name ?? 'Deleted user'}
            email={order.user?.email}
            amount={formatCurrency(order.totalPrice)}
            avatarSrc={order.user?.image ?? undefined}
            order={order.id}
            // fallback={order.fallback}
          />
        ))}
      </CardContent>
    </Card>
  )
}

export default RecentSalesCard
