'use client'

import { Card, CardContent } from '@/components/ui/card'
import Price from '@/components/price'
import PlaceOrderForm from './PlaceOrderForm'
import useCartService from '@/hooks/use-cart'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const PlaceOrder = () => {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { items, itemsPrice } = useCartService()

  useEffect(() => {
    setMounted(true)
  }, [items, itemsPrice])

  const totalRounded = parseFloat(itemsPrice.toFixed(2))

  if (!mounted) return <>Loading...</>

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
