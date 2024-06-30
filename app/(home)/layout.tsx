import ClientOnly from '@/components/ClientOnly'
import { Navbar } from './_components/navbar'
import Footer from './_components/Footer'

import { Metadata } from 'next'
import { APP_NAME } from '@/constants/constant'

interface ProtectedLayoutProps {
  children: React.ReactNode
  modal: React.ReactNode
}

export const metadata: Metadata = {
  title: `ADIL- ${APP_NAME}`,
}

const ProtectedLayout = ({ children, modal }: ProtectedLayoutProps) => {
  return (
    <ClientOnly>
      <Navbar />
      <div className="px-[1.5rem] md:px-[3rem] lg:px-[3rem] xl:px-[4rem] 2xl:px-[6rem]">
        <main>{children}</main>
      </div>
      {modal}
      <Footer />
    </ClientOnly>
  )
}

export default ProtectedLayout
