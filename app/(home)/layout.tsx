import ClientOnly from '@/components/ClientOnly'
import Footer from './_components/Footer'
import SiteHeader from './SiteHeader'

// interface ProtectedLayoutProps {
//   children: React.ReactNode
//   modal?: React.ReactNode
// }



// const ProtectedLayout = ({ children, modal }: ProtectedLayoutProps) => {
//   return (
//     <ClientOnly>
//       <SiteHeader />
//       <div className="px-[1.5rem] md:px-[3rem] lg:px-[3rem] xl:px-[4rem] 2xl:px-[6rem]">
//         <main>{children}</main>
//       </div>
//       {modal}
//       <Footer />
//     </ClientOnly>
//   )
// }

// export default ProtectedLayout


export default function HomeLayout({

  children,
}: {
  children: React.ReactNode
 
}) {
  return (
    <ClientOnly>
      <SiteHeader />
      <div className="px-[1.5rem] md:px-[3rem] lg:px-[3rem] xl:px-[4rem] 2xl:px-[6rem]">
        <main>{children}</main>
      </div>
    
      <Footer />
    </ClientOnly>
  )
}