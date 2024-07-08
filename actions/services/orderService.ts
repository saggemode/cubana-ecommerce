'use server'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect'
import prisma from '@/lib/prisma'
import { formatError } from '@/lib/utils'
import { insertOrderSchema } from '@/schemas'
import { getUserById } from './userService'
import { getMyCart } from './cartService'
import { PAGE_SIZE } from '@/constants/constant'
import useCart from '@/hooks/use-cart'

export const createOrder = async () => {
  try {
    const session = await auth()
    if (!session) throw new Error('User is not authenticated')

    //const cart = await getMyCart()
    const cart = useCart.getState()

    const user = await getUserById(session?.user.id!)

    if (!cart.cartItems || cart.cartItems.length === 0) {
      throw new Error('Cart is empty or undefined')
    }

    const total = cart.cartItems.reduce(
      (acc, cartItem) => acc + (cartItem.item.price ?? 0) * cartItem.quantity,
      0
    )

    const totalRounded = parseFloat(total.toFixed(2))

    console.log(totalRounded)

    // Check if cart or cart.items are null or undefined
    // if ( cart.cartItems.length === 0) {
    //   redirect('/cart')
    //   return // Ensuring that the function exits if there's a redirect
    // }

    if (!user.address) {
      redirect('/shipping-address')
      return // Ensuring that the function exits if there's a redirect
    }

    if (!user.paymentMethod) {
      redirect('/payment-method')
      return // Ensuring that the function exits if there's a redirect
    }

    const orderData = insertOrderSchema.parse({
      userId: user.id!,
      shippingAddress: user.address!,
      paymentMethod: user.paymentMethod!,
      amountTotal: totalRounded!,
    })

    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({
        data: {
          ...orderData,
          userId: user.id!,
          shippingAddress: user.address!,
          paymentMethod: user.paymentMethod!,
          amountTotal: totalRounded,
        },
      })

      // const orderItemsData = (cart.cartItems as any[]).map((item) => {
      //   if (typeof item === 'object' && item !== null) {
      //     return {
      //       quantity: item.quantity,
      //       price: item.price,
      //       name: item.name,
      //       slug: item.slug,
      //       image: item.image,
      //       orderId: insertedOrder.id,
      //       productId: item.productId,
      //     }
      //   } else {
      //     throw new Error('Cart item is not a valid object')
      //   }
      // })

      // await tx.orderItem.createMany({
      //   data: orderItemsData,
      // })

      // await tx.cart.update({
      //   where: { id: cart.id },
      //   data: {
      //     items: [],
      //     totalPrice: 0,
      //   },
      // })

      // for (const item of cart.cartItems) {
      //   if (typeof item === 'object' && item !== null) {
      //     await tx.orderItem.create({
      //       data: {
      //         productId: item.productId,
      //         quantity: item.quantity,
      //         price: totalRounded, // assuming item.item.price holds the correct price for each item
      //         orderId: insertedOrder.id,
      //       },
      //     })
      //   } else {
      //     throw new Error('Cart item is not a valid object')
      //   }
      // }

      // await tx.cart.update({
      //   where: { id: cart.id },
      //   data: {
      //     items: [],
      //     totalPrice: 0,
      //   },
      // })

      for (const item of cart?.cartItems) {
        // Ensure item is an object before processing
        if (typeof item === 'object' && item !== null) {
          await tx.orderItem.create({
            data: {
              ...item,
              price: totalRounded, // Ensure price is correctly formatted
              orderId: insertedOrder.id,
            },
          })
        } else {
          throw new Error('Cart item is not a valid object')
        }
      }

      return insertedOrder.id
    })

    if (!insertedOrderId) throw new Error('Order not created')

    redirect(`/order/${insertedOrderId}`)
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    return { success: false, message: formatError(error) }
  }
}


// ...............................................

// import { paypal } from '../paypal'
// import { revalidatePath } from 'next/cache'
// import { PaymentResult } from '@/types'
// import { sendPurchaseReceipt } from '@/email'

// export const createOrder = async () => {
//   try {
//     const session = await auth()
//     if (!session) throw new Error('User is not authenticated')

//     const cart = await getMyCart()
//     const user = await getUserById(session.user.id!)
//     if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
//       redirect('/cart')
//       return // Ensuring that the function exits if there's a redirect
//     }

//     if (!user.address) {
//       redirect('/shipping-address')
//       return // Ensuring that the function exits if there's a redirect
//     }

//     if (!user.paymentMethod) {
//       redirect('/payment-method')
//       return // Ensuring that the function exits if there's a redirect
//     }

//     const orderData = insertOrderSchema.parse({
//       userId: user.id!,
//       shippingAddress: JSON.stringify(user.address!),
//       paymentMethod: user.paymentMethod!,
//       totalPrice: cart.totalPrice!,
//     })

//     const insertedOrder = await prisma.$transaction(async (tx) => {
//       const newOrder = await tx.order.create({
//         data: {
//           ...orderData,
//           userId: user.id!,
//           shippingAddress: JSON.stringify(user.address!),
//           paymentMethod: user.paymentMethod!,
//           totalPrice: cart.totalPrice!,
//         },
//       })

//       if (Array.isArray(cart.items)) {
//         const orderItemsData = cart.items.map((item) => {
//           if (typeof item === 'object' && item !== null) {
//             return {
//               ...item,
//               //price: parseFloat(item.price.toFixed(2)),
//               orderId: newOrder.id,
//             }
//           } else {
//             throw new Error('Cart item is not a valid object')
//           }
//         })

//         await tx.orderItem.createMany({
//           data: orderItemsData,
//         })
//       }

//       await tx.cart.update({
//         where: { id: cart.id },
//         data: {
//           items: [],
//           totalPrice: 0,
//         },
//       })

//       return newOrder
//     })

//     if (!insertedOrder) throw new Error('Order not created')
//     redirect(`/order/${insertedOrder.id}`)
//   } catch (error) {
//     if (isRedirectError(error)) {
//       throw error
//     }
//     return { success: false, message: formatError(error) }
//   }
// }

// export const createOrder = async () => {
//   try {
//     const session = await auth()
//     if (!session) throw new Error('User is not authenticated')

//     const cart = await getMyCart()
//     const user = await getUserById(session?.user.id!)

//     if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
//       redirect('/cart')
//       return // Ensuring that the function exits if there's a redirect
//     }

//     if (!user.address) {
//       redirect('/shipping-address')
//       return // Ensuring that the function exits if there's a redirect
//     }

//     if (!user.paymentMethod) {
//       redirect('/payment-method')
//       return // Ensuring that the function exits if there's a redirect
//     }

//     const orderData = insertOrderSchema.parse({
//       userId: user.id!,
//       shippingAddress: JSON.stringify(user.address!),
//       paymentMethod: user.paymentMethod!,
//       totalPrice: cart.totalPrice!,
//     })

//     const insertedOrderId = await prisma.$transaction(async (tx) => {
//       const insertedOrder = await tx.order.create({
//         data: {
//           ...orderData,
//           userId: user.id!,
//           shippingAddress: JSON.stringify(user.address!),
//           paymentMethod: user.paymentMethod!,
//           totalPrice: cart.totalPrice!,
//         },
//       })

//       for (const item of cart?.items) {
//         // Ensure item is an object before processing
//         if (typeof item === 'object' && item !== null) {
//           await tx.orderItem.create({
//             data: {
//               ...item,
//               price: parseFloat(item.price.toFixed(2)), // Ensure price is correctly formatted
//               orderId: insertedOrder.id,
//             },
//           })
//         } else {
//           throw new Error('Cart item is not a valid object')
//         }
//       }

//       await tx.cart.update({
//         where: { id: cart.id },
//         data: {
//           items: [],
//           totalPrice: 0,
//         },
//       })

//       return insertedOrder.id
//     })

//     if (!insertedOrderId) throw new Error('Order not created')

//     redirect(`/order/${insertedOrderId}`)
//   } catch (error) {
//     if (isRedirectError(error)) {
//       throw error
//     }
//     return { success: false, message: formatError(error) }
//   }
// }

// export const createOrder = async () => {
//   try {
//     const session = await auth()
//     if (!session) throw new Error('User is not authenticated')

//     const cart = await getMyCart()
//     const user = await getUserById(session?.user.id!)

//     if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
//       redirect('/cart')
//       return // Ensuring that the function exits if there's a redirect
//     }

//     if (!user.address) {
//       redirect('/shipping-address')
//       return // Ensuring that the function exits if there's a redirect
//     }

//     if (!user.paymentMethod) {
//       redirect('/payment-method')
//       return // Ensuring that the function exits if there's a redirect
//     }

//     const orderData = insertOrderSchema.parse({
//       userId: user.id!,
//       shippingAddress: JSON.stringify(user.address!),
//       paymentMethod: user.paymentMethod!,
//       totalPrice: cart.totalPrice!,
//     })

//     const insertedOrderId = await prisma.$transaction(async (tx) => {
//       const insertedOrder = await tx.order.create({
//         data: {
//           ...orderData,
//           userId: user.id!,
//           shippingAddress: JSON.stringify(user.address!),
//           paymentMethod: user.paymentMethod!,
//           totalPrice: cart.totalPrice!,
//         },
//       })

//       if (Array.isArray(cart.items)) {
//         for (const item of cart.items) {
//           // Ensure item is an object before processing
//           if (typeof item === 'object' && item !== null) {
//             await tx.orderItem.create({
//               data: {
//                 ...item,
//                 price: parseFloat(item.price.toFixed(2)), // Ensure price is correctly formatted
//                 orderId: insertedOrder.id,
//               },
//             })
//           } else {
//             throw new Error('Cart item is not a valid object')
//           }
//         }
//       } else {
//         throw new Error('Cart items are not valid')
//       }

//       await tx.cart.update({
//         where: { id: cart.id },
//         data: {
//           items: [],
//           totalPrice: 0,
//         },
//       })

//       return insertedOrder.id
//     })

//     if (!insertedOrderId) throw new Error('Order not created')

//     redirect(`/order/${insertedOrderId}`)
//   } catch (error) {
//     if (isRedirectError(error)) {
//       throw error
//     }
//     return { success: false, message: formatError(error) }
//   }
// }
