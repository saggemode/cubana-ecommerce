'use client'
import React from 'react'
//import ReactStars from "react-rating-star-with-type";
import { FaRegCommentDots } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { setTransition } from '@/lib/transition'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/types'
import Price from '@/components/price'
import { RiStarSFill } from '@/assets/icons'
import Link from 'next/link'

interface InfoProps {
  product: Product
}

const ProductDetails: React.FC<InfoProps> = ({ product }) => {
  return (
    <motion.div
      className="flex w-full shrink flex-col gap-4 self-start rounded-lg
                 border border-border-primary p-4 lg:max-w-none xl:max-w-xl"
      {...setTransition({ direction: 'bottom' })}
    >
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="flex gap-1">
            <p>
              Sold <span className="font-light">{'60'}</span>
            </p>
            <i>•</i>
            <p className="flex items-center justify-center">
              <i className="text-yellow-400">
                <RiStarSFill />
              </i>{' '}
              {'rate'}
            </p>
          </div>
        </div>
        <h2 className="text-3xl font-bold">
          <Price
            amount={product?.price !== null ? product.price.toString() : ''}
          />
        </h2>
      </div>
      <hr />
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-secondary">
            Category:{' '}
            <span className="capitalize text-white">
              {product.category?.title}
            </span>
          </p>
        </div>
        <div>
          <p>{product.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductDetails
