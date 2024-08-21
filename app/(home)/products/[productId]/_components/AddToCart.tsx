'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import useCartService from '@/hooks/use-cart'
import { OrderItem } from '@prisma/client'
import { setTransition } from '@/lib/transition'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader, Minus, Plus } from 'lucide-react'
import { MdAddShoppingCart, MdRemoveShoppingCart } from 'react-icons/md'

const AddToCart = ({ item }: { item: OrderItem }) => {
  const router = useRouter()
  const { items, increase, decrease, deleteItem } = useCartService()
  const [existItem, setExistItem] = useState<OrderItem | undefined>()

  console.log(items)

  useEffect(() => {
    setExistItem(items.find((x) => x.id === item.id))
  }, [item, items])

  const addToCartHandler = () => {
    increase(item)
  }
  return (
    <AnimatePresence mode="wait">
      {existItem ? (
        <motion.div
          className="flex flex-col gap-4"
          {...setTransition({ direction: 'top', distance: 25 })}
          key={item.id}
        >
          <div className="flex items-center justify-center gap-1 inner:border-neutral-400">
            <Button
              type="button"
              variant="outline"
              onClick={() => decrease(existItem)}
            >
              <Minus className="w-4 h-4" />
            </Button>
            {/* <input
              className="flex-1 rounded-lg border bg-background px-1 py-1
                             text-center transition focus:ring-2 focus:ring-accent
                             focus:ring-offset-4 focus:ring-offset-background"
              type="number"
              min={1}
              max={10_000}
              value={existItem.quantity}
              onChange={cart.handleProductQuantity(product.id)}
            /> */}

            <span className="px-2">{existItem.quantity}</span>

            <Button
              type="button"
              variant="outline"
              onClick={() => increase(existItem)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => deleteItem(item.id)}
          >
            <MdRemoveShoppingCart className="w-4 h-4" />
            delete
          </Button>
        </motion.div>
      ) : (
        <motion.div
          {...setTransition({
            direction: 'bottom',
            distance: 25,
          })}
          key={item.quantity}
        >
          <Button
            className="w-full"
            type="button"
            //disabled={isPending}
            onClick={addToCartHandler}
          >
            <MdAddShoppingCart />
            Add to cart
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
export default AddToCart
