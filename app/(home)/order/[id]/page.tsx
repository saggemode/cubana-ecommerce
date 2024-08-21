import React from 'react'
import { auth } from '@/auth'
import Stripe from 'stripe'
import OrderDetailsForm from './order-details-form'
import { currentUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { getOrderById } from '@/actions/services/orderService'

const OrderDetailsPage = async ({
  params: { id },
}: {
  params: {
    id: string
  }
}) => {
  const session = await auth()
  const order = await getOrderById(id)
  if (!order) notFound()

  order.user.name = order.user.name || 'Unknown'

  let client_secret = null
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'NGN',
      metadata: { orderId: order.id },
    })
    client_secret = paymentIntent.client_secret
  }

  //const isAdmin = session?.user?.role === 'admin'

  return (
    <OrderDetailsForm
      order={order}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      isAdmin={session?.user.role === 'ADMIN' || false}
      stripeClientSecret={client_secret}
    />
  )
}

export default OrderDetailsPage
