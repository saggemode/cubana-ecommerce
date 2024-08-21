'use client'

import { Check, Loader } from 'lucide-react'
import axios from 'axios'
import { useFormState, useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { CreateOrder } from '@/actions/services/orderService'
import { useEffect, useState } from 'react'
import { currentUser } from '@/lib/auth'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { redirect } from 'next/navigation'
import useCartService from '@/hooks/use-cart'
import useSWRMutation from 'swr/mutation'

export default function PlaceOrderForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const {
    paymentMethod,
    shippingAddress,
    items,
    taxPrice,
    shippingPrice,
    itemsPrice,
    totalPrice,
    clear,
  } = useCartService()

  const amountTotal = parseFloat(itemsPrice.toFixed(2))

  const [data, action] = useFormState(CreateOrder, {
    success: false,
    message: '',
  })

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus()
    return (
      <Button disabled={pending} className="w-full">
        {pending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}
        Place Order Now
      </Button>
    )
  }

  const { trigger: placeOrder, isMutating: isPlacing } = useSWRMutation(
    `/api/orders/mine`,
    async (url) => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod,
          shippingAddress,
          items,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        clear()
        toast.success('Order placed successfully')
        return router.push(`/order/${data?.order?.id}`)
      } else {
        toast.error(data.message)
      }
    }
  )

  return (
    <form action={action} className="w-full">
      <Button
        onClick={() => placeOrder()}
        disabled={isPlacing}
        className="w-full"
      >
        {isPlacing ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}
        Place Order Now
      </Button>
      {!data?.success && (
        <p className="text-destructive py-4">{data?.message}</p>
      )}
    </form>
    // <form action={action} className="w-full">
    //   <PlaceOrderButton />
    //   {!data.success && <p className="text-destructive py-4">{data.message}</p>}
    // </form>
  )
}

// 'use client'

// import { Check, Loader } from 'lucide-react'
// import axios from 'axios'
// import { useFormState, useFormStatus } from 'react-dom'
// import { Button } from '@/components/ui/button'
// import { createOrder } from '@/actions/services/orderService'

// export default function PlaceOrderForm() {
//   const [data, action] = useFormState(createOrder, {
//     success: false,
//     message: '',
//   })

//   const PlaceOrderButton = () => {
//     const { pending } = useFormStatus()
//     return (
//       <Button disabled={pending} className="w-full">
//         {pending ? (
//           <Loader className="w-4 h-4 animate-spin" />
//         ) : (
//           <Check className="w-4 h-4" />
//         )}
//         Place Order Now
//       </Button>
//     )
//   }

//   return (
//     <form action={action} className="w-full">
//       <PlaceOrderButton />
//       {!data?.success && <p className="text-destructive py-4">{data?.message}</p>}
//     </form>
//   )
// }
