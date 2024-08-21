'use client'

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js'
import { useSession } from 'next-auth/react'
import Price from '@/components/price'
import useCart from '@/hooks/use-cart'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import StripePayment from './stripe-payment'
import Image from 'next/image'
import Link from 'next/link'
import {
  approvePayPalOrder,
  createPayPalOrder,
  deliverOrder,
  updateOrderToPaidByCOD,
} from '@/actions/services/orderService'
import { Order } from '@/types'

export default function OrderDetailsForm({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}: {
  order: Order
  paypalClientId: string
  isAdmin: boolean
  stripeClientSecret: string | null
}) {
  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = order

  const cart = useCart()
  const total = cart.items.reduce(
    (acc, cartItem) => acc + (cartItem.price ?? 0) * cartItem.quantity,
    0
  )
  const totalRounded = parseFloat(total.toFixed(2))

  const { toast } = useToast()

  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer()
    let status = ''
    if (isPending) {
      status = 'Loading PayPal...'
    } else if (isRejected) {
      status = 'Error in loading PayPal.'
    }
    return status
  }
  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id)
    if (!res.success)
      return toast({
        description: res.message,
        variant: 'destructive',
      })
    return res.data
  }

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data)
    toast({
      description: res.message,
      variant: res.success ? 'default' : 'destructive',
    })
  }

  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()
    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidByCOD(order.id)
            toast({
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            })
          })
        }
      >
        {isPending ? 'processing...' : 'Mark As Paid'}
      </Button>
    )
  }

  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()
    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(order.id)
            toast({
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            })
          })
        }
      >
        {isPending ? 'processing...' : 'Mark As Delivered'}
      </Button>
    )
  }

  return (
    <div className="mt-20 pt-20">
      <h1 className="py-4 text-2xl"> Order {formatId(order.id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="overflow-x-auto md:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant="secondary">
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not paid</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress?.fullName}</p>
              <p>
                {shippingAddress?.address}, {shippingAddress?.city},{' '}
                {shippingAddress?.postalCode}, {shippingAddress?.country}{' '}
              </p>

              {isDelivered ? (
                <Badge variant="secondary">
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not delivered</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item: Order) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Link
                          href={`/products/${item.id}`}
                          className="flex items-center"
                        >
                          <div className="flex items-center">
                            <Image
                              src={item.image}
                              width={50}
                              height={50}
                              className="rounded-lg w-32 h-32 object-cover"
                              alt="product"
                            />
                            <span className="px-2">{item.name}</span>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.quantity}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Price
                          amount={
                            item.price !== null ? item.price.toString() : ''
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 space-y-4 gap-4">
              <h2 className="text-xl pb-4">Order Summary</h2>
              <div className="flex justify-between">
                <div>Items</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>

              <div className="flex justify-between">
                <div>Total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
              {!isPaid && paymentMethod === 'PayPal' && (
                <div>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
              {!isPaid && paymentMethod === 'Stripe' && stripeClientSecret && (
                <StripePayment
                  priceInCents={Number(order.totalPrice) * 100}
                  orderId={order.id}
                  clientSecret={stripeClientSecret}
                />
              )}
              {isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
                <MarkAsPaidButton />
              )}
              {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />} 
            
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
