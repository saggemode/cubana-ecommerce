'use client'
import { auth } from '@/auth'
import CheckoutSteps from '@/components/checkout-steps'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getUserById } from '@/actions/services/userService'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import PlaceOrderTable from './PlaceOrderTable'
import PlaceOrder from './PlaceOrder'

import useCartService from '@/hooks/use-cart'

export default function PlaceOrderPage() {
  const router = useRouter()
  const { paymentMethod, shippingAddress, items } = useCartService()

  useEffect(() => {
    if (!paymentMethod) {
      return router.push('/payment')
    }
    if (items.length === 0) {
      return router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, router])

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <>Loading...</>

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className="py-4 text-2xl">Place Order</h1>

      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="overflow-x-auto md:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress?.fullName}</p>
              <p>
                {shippingAddress?.address}, {shippingAddress?.city},{' '}
                {shippingAddress?.postalCode}, {shippingAddress?.country}{' '}
              </p>
              <div>
                <Link href="/shipping-address">
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{paymentMethod}</p>
              <div>
                <Link href="/payment-method">
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <PlaceOrderTable />
        </div>

        <PlaceOrder />
      </div>
    </>
  )
}

// import { auth } from '@/auth'
// import CheckoutSteps from '@/components/checkout-steps'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'
// import { getUserById } from '@/actions/services/userService'
// import { redirect } from 'next/navigation'
// import Link from 'next/link'
// // import PlaceOrderTable from './PlaceOrderTable'
// // import PlaceOrder from './PlaceOrder'
// import { ShippingAddress } from '@/types'
// import useCartService from '@/hooks/use-cart'

// export default async function PlaceOrderPage() {
//   const session = await auth()
//   const user = await getUserById(session?.user.id!)

//     const {
//       paymentMethod,
//       shippingAddress,
//       items,
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       totalPrice,
//       clear,
//     } = useCartService()

//    const isShippingAddress = (address: any): address is ShippingAddress => {
//      return (
//        typeof address.fullName === 'string' &&
//        typeof address.streetAddress === 'string' &&
//        typeof address.city === 'string' &&
//        typeof address.country === 'string' &&
//        (typeof address.postalCode === 'undefined' ||
//          typeof address.postalCode === 'string') &&
//        (typeof address.lat === 'undefined' ||
//          typeof address.lat === 'number') &&
//        (typeof address.lng === 'undefined' || typeof address.lng === 'number')
//      )
//    }

//      const validatedAddress =
//        user?.address && isShippingAddress(user.address) ? user.address : null

//   if (!user) {
//     redirect('/login')
//     return null
//   }

//   if (!user.address) {
//     redirect('/shipping-address')
//     return null
//   }

//   if (!user.paymentMethod) {
//     redirect('/payment-method')
//     return null
//   }

//   return (
//     <>
//       <CheckoutSteps current={3} />
//       <h1 className="py-4 text-2xl">Place Order</h1>

//       <div className="grid md:grid-cols-3 md:gap-5">
//         <div className="overflow-x-auto md:col-span-2 space-y-4">
//           <Card>
//             <CardContent className="p-4 gap-4">
//               <h2 className="text-xl pb-4">Shipping Address</h2>
//               <p>{validatedAddress?.fullName}</p>
//               <p>
//                 {validatedAddress?.address}, {validatedAddress?.city},{' '}
//                 {validatedAddress?.postalCode}, {validatedAddress?.country}{' '}
//               </p>
//               <div>
//                 <Link href="/shipping-address">
//                   <Button variant="outline">Edit</Button>
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 gap-4">
//               <h2 className="text-xl pb-4">Payment Method</h2>
//               <p>{user.paymentMethod}</p>
//               <div>
//                 <Link href="/payment-method">
//                   <Button variant="outline">Edit</Button>
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>
//           {/* <PlaceOrderTable /> */}
//         </div>

//         {/* <PlaceOrder /> */}
//       </div>
//     </>
//   )
// }
