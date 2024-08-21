import { Metadata } from 'next'
import { Suspense } from 'react'
import Carousel, { CarouselSkeleton } from './_components/carousel/carousel'

//import Carousel, { CarouselSkeleton } from '@/components/carousel/carousel'
import { Separator } from '@/components/ui/separator'
import { Heading } from './_components/heading'
import prisma from '@/lib/prisma'
import ClientOnly from '@/components/ClientOnly'
import EmptyState from '@/components/EmptyState'
//import Carousel from './_components/Carousel'
import { isVariableValid } from '@/lib/utils'
import {
  ProductGrid,
  ProductItemsSkeleton,
  ProductSkeletonGrid,
} from '@/components/Products'
import { ThreeItemGrid } from '@/components/grid/three-items'
import { HomeCarousel } from '@/components/HomeCarousel'
import getProducts from '@/actions/getProducts'
import { Listing } from './products/components/Listing'
import { MainLayout } from '@/components/main-layout'
import ProductService from '@/actions/services/productService'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Fullstack Next.js Store',
  description:
    process.env.NEXT_PUBLIC_APP_DESC ||
    'Fullstack Next.js Store - Server Components, MongoDB, Next Auth, Tailwind, Zustand',
  openGraph: {
    type: 'website',
  },
}

export default async function Home() {
  const products = await ProductService.findProducts()
  const allProducts = await ProductService.findProducts()
  const featuredProducts = await ProductService.getFeatured()

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
      {/* <Carousel imageUrl={banners?.map((obj: any) => obj.imageUrl)} />
       */}
      {featuredProducts.length > 0 && (
        <Suspense fallback={<CarouselSkeleton />}>
          <Carousel data={featuredProducts} />
        </Suspense>
      )}

      <Separator className="my-8" />
      <Heading
        title="Latest Products"
        description="Below is a list of Latest Products  we have available for you."
      />

      <MainLayout className="flex flex-col items-start gap-6 md:flex-row md:gap-8 pt-16">
        <Suspense
          fallback={
            <ProductItemsSkeleton quantity={8} name="Latest Products" />
          }
        >
          {isVariableValid(allProducts) ? (
            <Listing allProducts={allProducts} />
          ) : (
            <ProductSkeletonGrid />
          )}
        </Suspense>
      </MainLayout>

      <Separator className="my-8" />
      <HomeCarousel />
      <Separator className="my-8" />
      <ThreeItemGrid />
    </>
  )
}
