'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { Cart as Carts } from '@prisma/client'
import { formatError, round2 } from '@/lib/utils'
import { CartItem } from '@/types'
import { revalidatePath } from 'next/cache'
import { cartItemSchema, CartSchema } from '@/schemas'


const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + item.price * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  }
}

export const addItemToCart = async (data: CartItem) => {
  try {
    const sessionCartId = cookies().get('sessionCartId')?.value
    if (!sessionCartId) throw new Error('Cart Session not found')
    const session = await auth()
    const userId = session?.user.id as string | undefined
    const cart = await getMyCart()
    const item = cartItemSchema.parse(data)
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    })
    if (!product) throw new Error('Product not found')
    const stock = product.stock ?? 0
    if (!cart) {
      if (stock < 1) throw new Error('Not enough stock')
      await prisma.cart.create({
        data: {
          userId: userId,
          sessionCartId: sessionCartId,
          items: {
            create: {
              productId: item.productId,
              name: item.name,
              slug: item.slug,
              qty: item.quantity,
              image: item.image,
              price: item.price,
            },
          },
          ...calcPrice([item]),
        },
      })
      revalidatePath(`/product/${product.slug}`)
      return {
        success: true,
        message: 'Item added to cart successfully',
      }
    } else {
      const items = cart.items as CartItem[] // Ensure TypeScript treats this as CartItem[]
      const existItem = items.find((x) => x.productId === item.productId)
      if (existItem) {
        if (stock < existItem.qty + 1) throw new Error('Not enough stock')
        existItem.qty += 1
      } else {
        if (stock < 1) throw new Error('Not enough stock')
        items.push({
          ...item,
          qty: item.quantity,
          cartId: cart.id,
        })
      }
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: {
            upsert: items.map((item) => ({
              where: { id: item.id },
              update: item,
              create: item,
            })),
          },
          ...calcPrice(items),
        },
      })

      revalidatePath(`/product/${product.slug}`)
      return {
        success: true,
        message: `${product.name} ${
          existItem ? 'updated in' : 'added to'
        } cart successfully`,
      }
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}


export async function getMyCart() {
 
  if (!sessionCartId) return undefined
  const session = await auth()
  const userId = session?.user.id
  const cart = await prisma.cart.findFirst({
    where: userId ,
  })
  return cart
}

export const removeItemFromCart = async (productId: string) => {
  try {
    const sessionCartId = cookies().get('sessionCartId')?.value
    if (!sessionCartId) throw new Error('Cart Session not found')

    const product = await prisma.product.findFirst({
      where: { id: productId },
    })
    if (!product) throw new Error('Product not found')

    const cart = await getMyCart()
    if (!cart) throw new Error('Cart not found')

    const exist = cart.items.find((x) => x.productId === productId)
    if (!exist) throw new Error('Item not found')

    if (exist.qty === 1) {
      cart.items = cart.items.filter((x) => x.productId !== exist.productId)
    } else {
      cart.items.find((x) => x.productId === productId)!.qty = exist.qty - 1
    }
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: {
          update: cart.items.map((item) => ({
            where: { id: item.id },
            data: item,
          })),
        },
        ...calcPrice(cart.items),
      },
    })
    revalidatePath(`/product/${product.slug}`)
    return {
      success: true,
      message: `${product.name}  ${
        cart.items.find((x) => x.productId === productId)
          ? 'updated in'
          : 'removed from'
      } cart successfully`,
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}





// const calcPrice = (items: CartItem[]) => {
//   const itemsPrice = round2(
//       items.reduce((acc, item) => acc + item.price * item.qty, 0)
//     ),
//     shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
//     taxPrice = round2(0.15 * itemsPrice),
//     totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
//   return {
//     itemsPrice: itemsPrice.toFixed(2),
//     shippingPrice: shippingPrice.toFixed(2),
//     taxPrice: taxPrice.toFixed(2),
//     totalPrice: totalPrice.toFixed(2),
//   }
// }

// export async function getMyCart() {
//   const sessionCartId = cookies().get('sessionCartId')?.value
//   if (!sessionCartId) return undefined
//   const session = await auth()
//   const userId = session?.user.id

//   const cart = await prisma.cart.findFirst({
//     where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
//   })

//   return cart
// }

// export const addItemToCart = async (data: CartItem) => {
//   try {
//     const sessionCartId = cookies().get('sessionCartId')?.value
//     if (!sessionCartId) throw new Error('Cart Session not found')
//     const session = await auth()
//     const userId = session?.user.id as string | undefined
//     const cart = await getMyCart()
//     const item = cartItemSchema.parse(data)
//     const product = await prisma.product.findUnique({
//       where: { id: item.productId },
//     })
//     if (!product) throw new Error('Product not found')
//     if (!cart) {
//       if (product?.stock < 1) throw new Error('Not enough stock')
//       await prisma.cart.create({
//         data: {
//           userId: userId,
//           items: [item],
//           sessionCartId: sessionCartId,
//           ...calcPrice([item]),
//         },
//       })
//       revalidatePath(`/product/${product.slug}`)
//       return {
//         success: true,
//         message: 'Item added to cart successfully',
//       }
//     } else {
//       const existItem = cart.items.find((x) => x.productId === item.productId)
//       if (existItem) {
//         if (product.stock < existItem.qty + 1)
//           throw new Error('Not enough stock')
//         cart.items.find((x) => x.productId === item.productId)!.qty =
//           existItem.qty + 1
//       } else {
//         if (product.stock < 1) throw new Error('Not enough stock')
//         cart.items.push(item)
//       }
//       await prisma.cart.update({
//         where: { id: cart.id },
//         data: {
//           items: cart.items,
//           ...calcPrice(cart.items),
//         },
//       })
//       revalidatePath(`/product/${product.slug}`)
//       return {
//         success: true,
//         message: `${product.name} ${
//           existItem ? 'updated in' : 'added to'
//         } cart successfully`,
//       }
//     }
//   } catch (error) {
//     return { success: false, message: formatError(error) }
//   }
// }

// export async function getMyCart() {
//   const sessionCartId = cookies().get('sessionCartId')?.value
//   if (!sessionCartId) return undefined
//   const session = await auth()
//   const userId = session?.user.id
//   const cart = await prisma.cart.findFirst({
//     where: {
//       OR: [{ userId: userId }],
//     },
//   })
//   return cart
// }

// export const removeItemFromCart = async (productId: string) => {
//   try {
//     const sessionCartId = cookies().get('sessionCartId')?.value
//     if (!sessionCartId) throw new Error('Cart Session not found')

//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//     })
//     if (!product) throw new Error('Product not found')

//     const cart = await getMyCart()
//     if (!cart) throw new Error('Cart not found')

//     const exist = cart.items.find((x) => x.productId === productId)
//     if (!exist) throw new Error('Item not found')

//     if (exist.qty === 1) {
//       cart.items = cart.items.filter((x) => x.productId !== exist.productId)
//     } else {
//       cart.items.find((x) => x.productId === productId)!.qty = exist.qty - 1
//     }
//     await prisma.cart.update({
//       where: { id: cart.id },
//       data: {
//         items: cart.items,
//         ...calcPrice(cart.items),
//       },
//     })
//     revalidatePath(`/product/${product.slug}`)
//     return {
//       success: true,
//       message: `${product.name} ${
//         cart.items.find((x) => x.productId === productId)
//           ? 'updated in'
//           : 'removed from'
//       } cart successfully`,
//     }
//   } catch (error) {
//     return { success: false, message: formatError(error) }
//   }
// }
