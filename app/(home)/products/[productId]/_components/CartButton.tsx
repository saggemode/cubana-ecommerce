'use client'

import { useState } from 'react'
import useCart from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { LuShoppingCart } from 'react-icons/lu'



const CartButton = ({ product }:any) => {
  const [quantity, setQuantity] = useState<number>(1)
  const cart = useCart()

  const onAddToCart = () => {
    // addToCart(product);
    cart.increase({
      item: product,
      quantity,
      // color: selectedColor,
      // size: selectedSize,
    })
  }

  return (
    <div>
      <Button onClick={onAddToCart} className="flex items-center gap-x-2">
        Add To Cart
        <LuShoppingCart size={20} />
      </Button>
    </div>
  )
}

export default CartButton
