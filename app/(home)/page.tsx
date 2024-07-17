import { Separator } from '@/components/ui/separator'
import { Heading } from './_components/heading'
import prisma from '@/lib/prisma'
import ClientOnly from '@/components/ClientOnly'
import EmptyState from '@/components/EmptyState'
import Carousel from './_components/Carousel'

//import { sendMail } from "@/lib/node-mails";
import { isVariableValid } from '@/lib/utils'
import { ProductGrid, ProductSkeletonGrid } from '@/components/Products'
import { ThreeItemGrid } from '@/components/grid/three-items'
import { HomeCarousel } from '@/components/HomeCarousel'
import getProducts from '@/actions/getProducts'
import { Listing } from './products/components/Listing'
import { MainLayout } from '@/components/main-layout'

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website',
  },
}

export default async function Home() {
  const products = await getProducts()
  const allProducts = await getProducts()

  if (products.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    )
  }

  const banners = await prisma.banner.findMany()

  return (
    // <div div className="flex flex-col border-neutral-200 dark:border-neutral-700">
    <>
      <Carousel imageUrl={banners?.map((obj: any) => obj.imageUrl)} />

      <Separator className="my-8" />
      <Heading
        title="Products"
        description="Below is a list of products we have available for you."
      />

      {/* {isVariableValid(products) ? (
        <ProductGrid items={products} />

      ) : (
        <ProductSkeletonGrid />
      )} */}

      <MainLayout
        className="flex flex-col items-start gap-6 md:flex-row md:gap-8 pt-16"
        title="ADIL Cart | Store"
        description="You can find everything you need here."
        image="/store.png"
        url="/store"
      >
        {/* <Aside isMobile={isMobile} />
     <Listing allProducts={allProducts} isMobile={isMobile} /> */}

        {isVariableValid(allProducts) ? (
          <Listing allProducts={allProducts} />
        ) : (
          <ProductSkeletonGrid />
        )}
      </MainLayout>

      <Separator className="my-8" />
      <HomeCarousel />
      <Separator className="my-8" />
      <ThreeItemGrid />
    </>
  )
}
