import ClientOnly from '@/components/ClientOnly'
import { Navbar } from './_components/navbar'
import Footer from './_components/Footer'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <ClientOnly>
      <Navbar />
      <div className="px-[1.5rem] md:px-[3rem] lg:px-[3rem] xl:px-[4rem] 2xl:px-[6rem]">
        <main>{children}</main>
      </div>

      <Footer />
    </ClientOnly>
  )
}

export default ProtectedLayout
