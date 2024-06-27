//import { useCartStore } from '@/stores/cart'
import useCart from '@/hooks/use-cart'
import { useWishlistStore } from '@/hooks/use-wish'
import { Product } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ChevronDown, Trash } from 'tabler-icons-react'
// import AddToCartBtn from '../AddToCartBtn'

type WishlistItemProps = {
  item: Product
}

const WishlistItem = ({ item }: WishlistItemProps) => {
  const [size, setSize] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  //const addToCart = cart((state) => state.addToCart)
  const cart = useCart()
  const { addItem } = cart
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishList
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setAddedToCart(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [addedToCart])

  const handleAddToCart = () => {
    // if (size === null) {
    //   setError(true)
    //   return
    // }
    addItem(WishlistItemProps)
    setAddedToCart(true)
  }


  return (
    <div className="p-4 shadow-md rounded-md">
      <Link href={`/product/${item.id}`} passHref>
        <a className="block">
          <div className="relative w-full h-64">
            <Image
              src={item?.attributes?.image1?.data?.attributes?.url}
              alt={item?.attributes?.image1?.data?.attributes?.alternativeText}
              layout="fill"
              objectFit="cover"
              objectPosition="50% 10%"
              sizes="(min-width: 1400px) 298px, (min-width: 1200px) 25vw, (min-width: 768px) 33vw, (min-width: 500px) 50vw, 100vw"
              placeholder="blur"
              blurDataURL={
                item?.attributes?.image1?.data?.attributes?.placeholder
              }
              className="rounded-t-md"
            />
          </div>
        </a>
      </Link>
      <Link href={`/product/${item.id}`} passHref>
        <a className="block text-gray-900 mt-4">
          <p className="font-medium">{item?.attributes?.title}</p>
          <p className="my-2">
            {item?.attributes?.brand?.data?.attributes?.title}
          </p>
          <p className="font-medium">${item?.attributes?.price}.00</p>
        </a>
      </Link>
      {/* Uncomment the Select component if you need it and replace with a Tailwind-compatible component */}
      {/* <Select
        placeholder="Pick a size"
        data={item?.attributes?.sizes}
        size="md"
        radius={2}
        rightSection={<ChevronDown size={20} color="#22B8CF" />}
        styles={{ rightSection: { pointerEvents: "none" } }}
        aria-label="Pick a size"
        value={size}
        onChange={(value) => {
          setSize(value);
          setError(false);
        }}
        mt={10}
        mb={15}
        error={error}
      /> */}
      {/* <AddToCartBtn
        height={44}
        size="sm"
        addedToCart={addedToCart}
        handleAddToCart={handleAddToCart}
      /> */}
      <button
        className="w-full h-11 mt-4 flex items-center justify-center bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        onClick={() => removeFromWishlist(item.id)}
      >
        <Trash size={18} className="mr-2" />
        REMOVE
      </button>
    </div>
  )
}

export default WishlistItem
