'use client'

import { Product } from '@/types'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import cn from 'clsx'
import { setTransition } from '@/lib/transition'
import { Loading } from '@/components/ui/loading'
import { Empty } from '@/components/ui/empty'
import type { QueryType } from './aside'
import { useRouter } from 'next/router'
import ProductCardHome from './product-cardhome'

interface ProductListProps {
  allProducts: Product[]
}

export const Listing: React.FC<ProductListProps> = ({ allProducts }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const productsNotFound = allProducts.length === 0

  return (
    <motion.div
      className={cn('grid w-full gap-x-4 gap-y-6', {
        'self-center': isLoading,
        'justify-center': productsNotFound,
        '[grid-template-columns:repeat(auto-fill,minmax(230px,1fr))]':
          !isLoading && !productsNotFound,
      })}
      //    {...setTransition({ direction: isMobile ? 'bottom' : 'right' })}
      //   key={isLoading ? null : key}
    >
      {isLoading ? (
        <Loading />
      ) : productsNotFound ? (
        <Empty searchQuery={searchQuery} />
      ) : (
        allProducts.map((productData) => (
          <ProductCardHome productData={productData} key={productData.id} />
        ))
      )}
    </motion.div>
  )
}
