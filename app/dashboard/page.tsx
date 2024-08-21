import { getOrderSummary } from '@/actions/services/orderService'

import { CalendarDateRangePicker } from '@/components/date-range-picker'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ChartsCard from './_components/ChartsCard'
import { APP_NAME } from '@/constants/constant'
import { Metadata } from 'next'
import TotalRevenueCard from './_components/TotalRevenueCard'
import TotalSalesCard from './_components/TotalSalesCard'
import CustomersCard from './_components/TotalCustomersCard'
import TotalProductsCard from './_components/TotalProductsCard'
import RecentSalesCard from './_components/RecentSalesCard'
import EventCalendarCard from './_components/EventCalendarCard'

export const metadata: Metadata = {
  title: `Admin Dashboard - ${APP_NAME}`,
}

export default async function page() {
  const summary = await getOrderSummary()

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
          <div className="hidden md:flex items-center space-x-2">
            <CalendarDateRangePicker />
            {/* <EventCalendarCard /> */}
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <TotalRevenueCard ordersPrice={summary.ordersPrice} />

              <TotalSalesCard ordersCount={summary.ordersCount} />

              <CustomersCard usersCount={summary.usersCount} />

              <TotalProductsCard productsCount={summary.productsCount} />
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <ChartsCard
                data={{
                  salesData: summary.salesData,
                }}
              />

              <RecentSalesCard latestOrders={summary.latestOrders} />

              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>My Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <EventCalendarCard />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}
