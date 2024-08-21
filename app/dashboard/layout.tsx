import Header from '@/components/layout/header'
import Sidebar from '@/components/layout/sidebar'
import type { Metadata } from 'next'
import { auth } from '@/auth'
import { APP_NAME } from '@/constants/constant'

export const metadata: Metadata = {
  title: `Admin Dashboard - ${APP_NAME}`,
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if ((session?.user.role as string) !== 'ADMIN') {
    return (
      <div className="relative flex flex-grow p-4 justify-center items-center pt-24">
        <div className="text-center">
          <h1 className="text-2xl">Unauthorized</h1>
          <p>Admin permission required</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full pt-16">{children}</main>
      </div>
    </>
  )
}
