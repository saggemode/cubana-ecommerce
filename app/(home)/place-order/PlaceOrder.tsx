'use client'

import useCart from '@/hooks/use-cart'
import { Card, CardContent } from '@/components/ui/card'
import Price from '@/components/price'
import PlaceOrderForm from './PlaceOrderForm'

const PlaceOrder = () => {
  const cart = useCart()

  const total = cart.cartItems.reduce(
    (acc, cartItem) => acc + (cartItem.item.price ?? 0) * cartItem.quantity,
    0
  )
  const totalRounded = parseFloat(total.toFixed(2))

  return (
    <div>
      <Card>
        <CardContent className="p-4 gap-4 space-y-4">
          <div className="flex justify-between">
            <div>Total</div>
            <div>
              <Price
                amount={totalRounded !== null ? totalRounded.toString() : ''}
              />
            </div>
          </div>
          <PlaceOrderForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default PlaceOrder
