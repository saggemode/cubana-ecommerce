import NoResults from './no-results'
import Link from 'next/link'
import { Product } from '@/types'

import ProductCard from './ProductCard'
import { ImageSkeleton } from './ui/icons'
//import { SafeProduct } from "@/type";

interface ProductListProps {
  items: Product[]
}

export const ProductGrid: React.FC<ProductListProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.length === 0 && <NoResults />}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {items.map((item, index) => (
          <ProductCard data={item} key={index} />
        ))}
      </div>
    </div>
  )
}

export const ProductSkeletonGrid = () => {
  return (
    <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {[...Array(12)].map(() => (
        <ProductSkeleton key={Math.random()} />
      ))}
    </div>
  )
}

export function ProductSkeleton() {
  return (
    <Link href="#">
      <div className="animate-pulse rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
        <div className="relative h-full w-full">
          <div className="flex h-40 w-full items-center justify-center rounded bg-neutral-300 dark:bg-neutral-700 ">
            <ImageSkeleton />
          </div>
        </div>
        <div className="p-5">
          <div className="w-full">
            <div className="mb-4 h-2.5 w-48 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="mb-2.5 h-2 max-w-[480px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="mb-2.5 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="mb-2.5 h-2 max-w-[440px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="mb-2.5 h-2 max-w-[460px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="h-2 max-w-[360px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
          </div>
        </div>
      </div>
    </Link>
  )
}



const ProductItemSkeleton = () => {
  return (
    <div className="card mb-4 bg-base-300">
      <div>
        <div className="skeleton relative aspect-square h-full w-full" />
      </div>
      <div className="card-body">
        <div className="skeleton mb-2 h-6 w-3/4" />
        <div className="skeleton mb-2 h-4 w-1/2" />
        <div className="skeleton mb-2 h-4 w-1/3" />
        <div className="card-actions flex items-center justify-between">
          <div className="skeleton h-8 w-20" />
        </div>
      </div>
    </div>
  )
}

export const ProductItemsSkeleton = ({
  quantity,
  name,
}: {
  quantity: number
  name: string
}) => {
  return (
    <div>
      <h2 className="my-2 text-2xl md:my-4">{name}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {Array.from({ length: quantity }).map((_, i) => {
          return <ProductItemSkeleton key={i} />
        })}
      </div>
    </div>
  )
}