'use server'

import { auth } from '@/auth'

import { redirect } from 'next/navigation'

import { isRedirectError } from 'next/dist/client/components/redirect'
import prisma from '@/lib/prisma'
import { formatError } from '@/lib/utils'
import { insertOrderSchema } from '@/schemas'
import { getUserById } from './userService'
import { getMyCart } from './cartService'

// import { paypal } from '../paypal'
// import { revalidatePath } from 'next/cache'
// import { PaymentResult } from '@/types'
// import { PAGE_SIZE } from '../constants'
// import { sendPurchaseReceipt } from '@/email'

// GET
// export async function getOrderById(orderId: string) {
//   return await prisma.order.findUnique({
//     where: { id: orderId },
//     include: {
//       orderItems: true,
//       user: { select: { name: true, email: true } },
//     },
//   })
// }

// export async function getMyOrders({
//   limit = PAGE_SIZE,
//   page,
// }: {
//   limit?: number
//   page: number
// }) {
//   const session = await auth()
//   if (!session) throw new Error('User is not authenticated')

//   const data = await prisma.order.findMany({
//     where: { userId: session.user.id! },
//     orderBy: { createdAt: 'desc' },
//     take: limit,
//     skip: (page - 1) * limit,
//   })

//   const dataCount = await prisma.order.count({
//     where: { userId: session.user.id! },
//   })

//   return {
//     data,
//     totalPages: Math.ceil(dataCount / limit),
//   }
// }

// export async function getOrderSummary() {
//   const ordersCount = await prisma.order.count()
//   const productsCount = await prisma.product.count()
//   const usersCount = await prisma.user.count()
//   const ordersPrice = await prisma.order.aggregate({
//     _sum: { totalPrice: true },
//   })

//   const salesData = await prisma.order.groupBy({
//     by: ['createdAt'],
//     _sum: { totalPrice: true },
//     orderBy: { createdAt: 'asc' },
//   })

//   const latestOrders = await prisma.order.findMany({
//     orderBy: { createdAt: 'desc' },
//     include: { user: { select: { name: true } } },
//     take: 6,
//   })

//   return {
//     ordersCount,
//     productsCount,
//     usersCount,
//     ordersPrice: ordersPrice._sum.totalPrice,
//     salesData,
//     latestOrders,
//   }
// }

// export async function getAllOrders({
//   limit = PAGE_SIZE,
//   page,
// }: {
//   limit?: number
//   page: number
// }) {
//   const data = await prisma.order.findMany({
//     orderBy: { createdAt: 'desc' },
//     take: limit,
//     skip: (page - 1) * limit,
//     include: { user: { select: { name: true } } },
//   })

//   const dataCount = await prisma.order.count()

//   return {
//     data,
//     totalPages: Math.ceil(dataCount / limit),
//   }
// }

// CREATE
export const createOrder = async () => {
  try {
    const session = await auth()
    if (!session) throw new Error('User is not authenticated')

    const cart = await getMyCart()
    const user = await getUserById(session.user.id!)
    if (!cart || cart.items.length === 0) redirect('/cart')
    if (!user.address) redirect('/shipping-address')
    if (!user.paymentMethod) redirect('/payment-method')

    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      totalPrice: cart.totalPrice,
    })

    const insertedOrder = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: order,
      })

      await tx.orderItem.createMany({
        data: cart.items.map((item) => ({
          ...item,
          price: parseFloat(item.price.toFixed(2)),
          orderId: newOrder.id,
        })),
      })

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          itemsPrice: 0,
        },
      })

      return newOrder
    })

    if (!insertedOrder) throw new Error('Order not created')
    redirect(`/order/${insertedOrder.id}`)
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    return { success: false, message: formatError(error) }
  }
}

// DELETE
//export async function deleteOrder(id: string) {
//   try {
//     await prisma.order.delete({ where: { id } })
//     revalidatePath('/admin/orders')
//     return { success: true, message: 'Order deleted successfully' }
//   } catch (error) {
//     return { success: false, message: formatError(error) }
//   }
// }

// UPDATE
// export async function createPayPalOrder(orderId: string) {
//   try {
//     const order = await prisma.order.findUnique({ where: { id: orderId } })
//     if (order) {
//       const paypalOrder = await paypal.createOrder(Number(order.totalPrice))
//       await prisma.order.update({
//         where: { id: orderId },
//         data: {
//           paymentResult: {
//             id: paypalOrder.id,
//             email_address: '',
//             status: '',
//             pricePaid: 0,
//           },
//         },
//       })
//       return {
//         success: true,
//         message: 'PayPal order created successfully',
//         data: paypalOrder.id,
//       }
//     } else {
//       throw new Error('Order not found')
//     }
//   } catch (err) {
//     return { success: false, message: formatError(err) }
//   }
// }

// export async function approvePayPalOrder(
//   orderId: string,
//   data: { orderID: string }
// ) {
//   try {
//     const order = await prisma.order.findUnique({ where: { id: orderId } })
//     if (!order) throw new Error('Order not found')

//     const captureData = await paypal.capturePayment(data.orderID)
//     if (
//       !captureData ||
//       captureData.id !== order.paymentResult?.id ||
//       captureData.status !== 'COMPLETED'
//     )
//       throw new Error('Error in PayPal payment')

//     await updateOrderToPaid({
//       orderId,
//       paymentResult: {
//         id: captureData.id,
//         status: captureData.status,
//         email_address: captureData.payer.email_address,
//         pricePaid: parseFloat(
//           captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value
//         ),
//       },
//     })

//     revalidatePath(`/order/${orderId}`)
//     return {
//       success: true,
//       message: 'Your order has been successfully paid by PayPal',
//     }
//   } catch (err) {
//     return { success: false, message: formatError(err) }
//   }
// }

// export const updateOrderToPaid = async ({
//   orderId,
//   paymentResult,
// }: {
//   orderId: string
//   paymentResult?: PaymentResult
// }) => {
//   const order = await prisma.order.findUnique({
//     where: { id: orderId },
//     include: { orderItems: true },
//   })

//   if (!order) throw new Error('Order not found')
//   if (order.isPaid) throw new Error('Order is already paid')

//   await prisma.$transaction(async (tx) => {
//     await Promise.all(
//       order.orderItems.map((item) =>
//         tx.product.update({
//           where: { id: item.productId },
//           data: { stock: { decrement: item.qty } },
//         })
//       )
//     )

//     await tx.order.update({
//       where: { id: orderId },
//       data: {
//         isPaid: true,
//         paidAt: new Date(),
//         paymentResult,
//       },
//     })
//   })

//   const updatedOrder = await prisma.order.findUnique({
//     where: { id: orderId },
//     include: {
//       orderItems: true,
//       user: { select: { name: true, email: true } },
//     },
//   })

//   if (!updatedOrder) throw new Error('Order not found')

//   await sendPurchaseReceipt({ order: updatedOrder })
// }

// export async function updateOrderToPaidByCOD(orderId: string) {
//   try {
//     await updateOrderToPaid({ orderId })
//     revalidatePath(`/order/${orderId}`)
//     return { success: true, message: 'Order paid successfully' }
//   } catch (err) {
//     return { success: false, message: formatError(err) }
//   }
// }

// export async function deliverOrder(orderId: string) {
//   try {
//     const order = await prisma.order.findUnique({ where: { id: orderId } })
//     if (!order) throw new Error('Order not found')
//     if (!order.isPaid) throw new Error('Order is not paid')

//     await prisma.order.update({
//       where: { id: orderId },
//       data: {
//         isDelivered: true,
//         deliveredAt: new Date(),
//       },
//     })

//     revalidatePath(`/order/${orderId}`)
//     return { success: true, message: 'Order delivered successfully' }
//   } catch (err) {
//     return { success: false, message: formatError(err) }
//   }
// }
