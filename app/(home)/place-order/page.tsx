import { auth } from '@/auth'
import CheckoutSteps from '@/components/checkout-steps'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getUserById } from '@/actions/services/userService'
import { redirect } from 'next/navigation'
import PlaceOrderForm from './PlaceOrderForm'
import Image from 'next/image'
import Link from 'next/link'
import PlaceOrderTable from './PlaceOrderTable'
import PlaceOrder from './PlaceOrder'

export default async function PlaceOrderPage() {
  const session = await auth()
  const user = await getUserById(session?.user.id!)
  if (!user.address) redirect('/shipping-address')
  if (!user.paymentMethod) redirect('/payment-method')

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className="py-4 text-2xl">Place Order</h1>

      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="overflow-x-auto md:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{user.address.fullName}</p>
              <p>
                {user.address.streetAddress}, {user.address.city},{' '}
                {user.address.postalCode}, {user.address.country}{' '}
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
              <p>{user.paymentMethod}</p>
              <div>
                <Link href="/payment-method">
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <PlaceOrderTable />
          
        </div>

        <PlaceOrder/>
      </div>

      
    </>
  )
}
