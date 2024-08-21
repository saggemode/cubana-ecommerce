'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import useCartService from '@/hooks/use-cart'
//import { OrderItem } from '@prisma/client'
import { Loader, Minus, Plus } from 'lucide-react'
import { OrderItem } from '@/types'

const AddToCart = ({ item }: { item: OrderItem }) => {
  const router = useRouter()
  const { items, increase, decrease } = useCartService()
  const [existItem, setExistItem] = useState<OrderItem | undefined>()

  useEffect(() => {
    setExistItem(items.find((x) => x.id === item.id))
  }, [item, items])

  const addToCartHandler = () => {
    increase(item)
  }
  return existItem ? (
    <div>
      <Button
        size="sm"
        type="button"
        variant="outline"
        onClick={() => decrease(existItem)}
      >
        remove
      </Button>
    </div>
  ) : (
    // <div>
    //   <Button
    //     type="button"
    //     variant="outline"
    //     onClick={() => decrease(existItem)}
    //   >
    //     <Minus className="w-4 h-4" />
    //   </Button>

    //   <span className="px-2">{existItem.quantity}</span>

    //   <Button
    //     type="button"
    //     variant="outline"
    //     onClick={() => increase(existItem)}
    //   >
    //     <Plus className="w-4 h-4" />
    //   </Button>
    // </div>
    <Button
      size="sm"
      className="w-full"
      type="button"
      onClick={addToCartHandler}
    >
      Add to cart
    </Button>
  )
}
export default AddToCart
