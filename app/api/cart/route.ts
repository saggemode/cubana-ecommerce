"use server"

import prisma from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse, NextRequest } from 'next/server'
import { auth } from '@/auth'

// export async function GET(req: Request) {
//   try {
//     const userId = req.headers.get('X-USER-ID')

//     if (!userId) {
//       return new NextResponse('Unauthorized', { status: 401 })
//     }

//     const cart = await prisma.cart.findUniqueOrThrow({
//       where: { userId },
//       include: {
//         items: {
//           include: {
//             product: {
//               include: {
//                 brand: true,
//                 category: true,
//               },
//             },
//           },
//         },
//       },
//     })

//     return NextResponse.json(cart)
//   } catch (error) {
//     console.error('[GET_CART]', error)
//     return new NextResponse('Internal error', { status: 500 })
//   }
// }

// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//   const { productId, userId } = req.body

//   try {
//     // Find the cart item if it exists
//     let cartItem = await prisma.cartItem.findFirst({
//       where: {
//         userId,
//         productId,
//       },
//     })

//     if (cartItem) {
//       // If the item is already in the cart, increase the quantity
//       cartItem = await prisma.cartItem.update({
//         where: { id: cartItem.id },
//         data: { quantity: { increment: 1 } },
//       })
//     } else {
//       // If the item is not in the cart, add it
//       cartItem = await prisma.cartItem.create({
//         data: {
//           user: { connect: { id: userId } },
//           product: { connect: { id: productId } },
//           quantity: 1,
//         },
//       })
//     }

//     res.status(200).json(cartItem)
//   } catch (error) {
//     res.status(500).json({ error: 'Unable to add item to cart' })
//   }
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { cartItems } = req.body
       const session = await auth()
      const user = await prisma.user.findUnique({
        where: { email: session?.user.email! },
      })

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      for (const cartItem of cartItems) {
        await prisma.cartItem.upsert({
          where: {
            UniqueCartItem: {
              userId: user.id,
              productId: cartItem.item.id,
            },
          },
          update: {
            quantity: {
              increment: cartItem.quantity,
            },
          },
          create: {
            userId: user.id,
            productId: cartItem.item.id,
            quantity: cartItem.quantity,
          },
        })
      }

      res.status(200).json({ message: 'Cart updated successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

// export async function POST(req: Request) {
//   try {
//     const userId = req.headers.get('X-USER-ID')

//     if (!userId) {
//       return new NextResponse('Unauthorized', { status: 401 })
//     }

//     const { productId, count } = await req.json()

//     if (count < 1) {
//       await prisma.cartItem.delete({
//         where: { UniqueCartItem: { cartId: userId, productId } },
//       })
//     } else {
//       await prisma.cart.upsert({
//         where: {
//           userId,
//         },
//         create: {
//           user: {
//             connect: {
//               id: userId,
//             },
//           },
//         },
//         update: {
//           items: {
//             upsert: {
//               where: {
//                 UniqueCartItem: {
//                   cartId: userId,
//                   productId,
//                 },
//               },
//               update: {
//                 count,
//               },
//               create: {
//                 productId,
//                 count,
//               },
//             },
//           },
//         },
//       })
//     }

//     const cart = await prisma.cart.findUniqueOrThrow({
//       where: {
//         userId,
//       },
//       include: {
//         items: {
//           include: {
//             product: true,
//           },
//         },
//       },
//     })

//     return NextResponse.json(cart)
//   } catch (error) {
//     console.error('[PRODUCT_DELETE]', error)
//     return new NextResponse('Internal error', { status: 500 })
//   }
// }
