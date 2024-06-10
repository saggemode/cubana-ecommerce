'use client'
import React from 'react'
//import ReactStars from "react-rating-star-with-type";
import { FaRegCommentDots } from 'react-icons/fa'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { setTransition } from '@/lib/transition'
import { Product } from '@/types'

import Link from 'next/link'

import CartButton from './CartButton'
import { Separator } from '@/components/ui/separator'
import Price from '@/components/price'

interface InfoProps {
  product: Product
}

const DataColumn: React.FC<InfoProps> = ({ product }) => {
  // function Price() {
  //   if (product?.discount > 0) {
  //     const price = product?.price - product?.discount;
  //     const percentage = (product?.discount / product?.price) * 100;

  //     return (
  //       <div className="flex gap-2 items-center">
  //         <Badge className="flex gap-4" variant="destructive">
  //           <div className="line-through text-lg">
  //             <Currency value={product?.price} />
  //           </div>
  //           <div className="">%{percentage.toFixed(2)}</div>
  //         </Badge>
  //         <h2 className="text-3xl">
  //           <Currency value={price.toFixed(2)} />
  //         </h2>
  //       </div>
  //     );
  //   }

  //   return (
  //     <h2>
  //       <Currency value={product?.price} />
  //     </h2>
  //   );
  // }

  return (
    <motion.div
      className="flex w-full shrink flex-col gap-4 self-start rounded-lg
                 border border-border-primary p-4 lg:max-w-none xl:max-w-xl"
      {...setTransition({ direction: 'bottom' })}
    >
      <div className="col-span-2 w-full rounded-lg bg-neutral-100 p-6 dark:bg-neutral-900">
        <h3 className="mb-4 text-xl font-medium text-black dark:text-white">
          {product.name}
        </h3>

        {/* <ReactStars value={product?.rating} size={20} /> */}

        <span className="flex items-start space-x-3">
          <FaRegCommentDots size={22} />

          <span className="opacity-70 text-sm">
            {/* {product?.numbercomments} comments */}
          </span>
        </span>
        {/* <div className=" float-right text-2xl"> <Price /></div> */}
        <h1 className="text-sm">
          {/* <Currency value={product?.price ?? undefined} /> */}
          <Price
            amount={product?.price !== null ? product.price.toString() : ''}
          />
        </h1>
        {/* <span className="text-slate-500">
        ({product.numberReviews}{" "}
        {product.numberReviews >= 1 ? "reviews" : "review"})
      </span> */}
        <hr className="my-4 w-full border-neutral-200 dark:border-neutral-800 sm:mx-auto" />
        <div className="flex gap-2 mb-2">
          <p className="text-sm">Brand:</p>
          <Badge variant="outline">{product?.brand?.name}</Badge>
        </div>
        <div className="flex gap-2 items-center">
          <h3 className="font-semibold">Category:</h3>
          <Link href={`/product?categories=${product.category?.title}`}>
            <Badge variant="outline">{product.category?.title}</Badge>
          </Link>
        </div>

        <Separator />

        <div className="flex gap-2 items-center">
          <h3 className="font-semibold">Size:</h3>
          <div>{product?.size?.value}</div>
        </div>

        <Separator />

        <div className="flex gap-2 items-center">
          <h3 className="font-semibold">Color:</h3>
          <div
            className="h-6 w-6 rounded-full border border-gray-600"
            style={{ backgroundColor: product?.color?.value }}
          ></div>
        </div>

        <Separator />

        <small className="text-black dark:text-white">
          {product.description}
        </small>

        <Separator />

        {/* <div className="block space-y-2">
          <div className="flex gap-2 pt-5">
            <CartButton product={product} />
          </div>
        </div> */}
      </div>
    </motion.div>
  )
}

export default DataColumn
