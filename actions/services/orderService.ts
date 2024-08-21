'use server'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { OrderItem } from '@prisma/client'
import prisma from '@/lib/prisma'
import { formatError } from '@/lib/utils'
import { insertOrderSchema } from '@/schemas'
import { getUserById } from './userService'

import { PAGE_SIZE } from '@/constants/constant'
import { currentUser } from '@/lib/auth'
import { paypal } from '@/lib/paypal'
import { revalidatePath } from 'next/cache'
import { PaymentResult } from '@/types'
import useCartService from '@/hooks/use-cart'

const round2 = (num: number) => Math.round(num * 100) / 100

const calcPrices = (orderItems: OrderItem[]) => {
  const itemsPrice = round2(
    orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10)
  const taxPrice = round2(Number((0.15 * itemsPrice).toFixed(2)))
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
  return { itemsPrice, shippingPrice, taxPrice, totalPrice }
}

// GET
export async function getOrderById(orderId: string) {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      shippingAddress: true,
      user: true,
    },
  })
}

export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number
  page: number
}) {
  const session = await auth()
  if (!session) throw new Error('User is not authenticated')

  const userId = session.user.id!
  const data = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  })

  const dataCount = await prisma.order.count({
    where: { userId },
  })

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  }
}

export async function getOrderSummary() {
  const ordersCount = await prisma.order.count()
  const productsCount = await prisma.product.count()
  const usersCount = await prisma.user.count()
  const ordersPrice = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  })

  const salesDataRaw = await prisma.order.groupBy({
    by: ['createdAt'],
    _sum: { totalPrice: true },
    _count: {
      _all: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  // Transform the data to the format your chart expects
  const salesData = salesDataRaw.map((item) => {
    const month = item.createdAt.toLocaleString('default', { month: 'long' })
    const totalSales = item._sum.totalPrice || 0

    return {
      months: month,
      totalSales: totalSales,
    }
  })

  const latestOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: {
      user: { select: { name: true, email: true, image: true } },
    },
  })

  const productsData = await prisma.product.groupBy({
    by: ['categoryId'],
    _count: {
      _all: true,
    },
    // orderBy: {
    //   createdAt: 'asc',
    // },
  })

  const usersData = await prisma.user.groupBy({
    by: ['createdAt'],
    _count: {
      _all: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return {
    ordersCount,
    productsCount,
    usersCount,
    ordersPrice: ordersPrice._sum.totalPrice,
    salesData,
    latestOrders,
    productsData,
    usersData,
  }
}

export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number
  page: number
}) {
  const data = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } } },
  })

  const dataCount = await prisma.order.count()

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  }
}

// CREATE
export const CreateOrder = async () => {
  try {
    const session = await auth()
    if (!session) throw new Error('User is not authenticated')

    const user = await getUserById(session?.user.id!)
    const orders = await getOrderById(session?.user.id!)

    console.log(user)
    console.log(orders)
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    return { success: false, message: formatError(error) }
  }
}

// DELETE
export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({
      where: { id },
    })
    revalidatePath('/dashboard/orders')
    return {
      success: true,
      message: 'Order deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// UPDATE
export async function createPayPalOrder(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })
    if (order) {
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice))
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: '',
            status: '',
            pricePaid: '0',
          },
        },
      })
      return {
        success: true,
        message: 'PayPal order created successfully',
        data: paypalOrder.id,
      }
    } else {
      throw new Error('Order not found')
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })
    if (!order) throw new Error('Order not found')

    const captureData = await paypal.capturePayment(data.orderID)
    order.isPaid = true
    order.paidAt = new Date()
    // if (
    //   !captureData ||
    //   captureData.id !== order.paymentResult?.id ||
    //   captureData.status !== 'COMPLETED'
    // )
    if (
      !captureData ||
      captureData.id !== (order.paymentResult as { id: string }).id ||
      captureData.status !== 'COMPLETED'
    )
      throw new Error('Error in paypal payment')

    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    })
    revalidatePath(`/order/${orderId}`)
    return {
      success: true,
      message: 'Your order has been successfully paid by PayPal',
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

export const updateOrderToPaid = async ({
  orderId,
  paymentResult,
}: {
  orderId: string
  paymentResult?: PaymentResult
}) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  })
  if (!order) throw new Error('Order not found')
  if (order.isPaid) throw new Error('Order is already paid')

  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity ?? 0,
          },
        },
      })
    }

    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    })
  })

  const updatedOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      user: { select: { name: true, email: true } },
    },
  })

  if (!updatedOrder) {
    throw new Error('Order not found')
  }

  // await sendPurchaseReceipt({ order: updatedOrder })
}

export async function updateOrderToPaidByCOD(orderId: string) {
  try {
    await updateOrderToPaid({ orderId })
    revalidatePath(`/order/${orderId}`)
    return { success: true, message: 'Order paid successfully' }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })
    if (!order) throw new Error('Order not found')
    if (!order.isPaid) throw new Error('Order is not paid')

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    })
    revalidatePath(`/order/${orderId}`)
    return { success: true, message: 'Order delivered successfully' }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}
