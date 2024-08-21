import { auth } from '@/auth'
import { OrderItem } from '@prisma/client'
import prisma from '@/lib/prisma'

const round2 = (num: number) => Math.round(num * 100) / 100

const calcPrices = (orderItems: OrderItem[]) => {
  const itemsPrice = round2(
    orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10)
  const taxPrice = round2(Number((0.1 * itemsPrice).toFixed(2)))
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
  return { itemsPrice, shippingPrice, taxPrice, totalPrice }
}

export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return new Response(JSON.stringify({ message: 'unauthorized' }), {
      status: 401,
    })
  }

  const { user } = req.auth

  try {
    const payload = await req.json()

    const dbProductPrices = await prisma.product.findMany({
      where: {
        id: {
          in: payload.items.map((item: { id: string }) => item.id),
        },
      },
      select: {
        id: true,
        price: true,
        images:true
      },
    })

    const dbOrderItems = payload.items.map((item: { id: string }) => ({
      ...item,
      productId: item.id,
      price:
        dbProductPrices.find((product) => product.id === item.id)?.price || 0,
    }))

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems)

      console.log(dbOrderItems)

    const createdOrder = await prisma.order.create({
      data: {
        items: {
          create: dbOrderItems.map((item: any) => ({
            name: item.name,
            slug: item.slug,
            quantity: item.quantity,
            image: item?.images[0].url,
            price: item.price,
            color: item.color,
            size: item.size,
            productId: item.productId,
          })),
        },
        
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        shippingAddress: {
          create: payload.shippingAddress,
        },
        paymentMethod: payload.paymentMethod,
        userId: user.id,
      },
      include: {
        items: true,
        shippingAddress: true,
      },
      
    })

    return new Response(
      JSON.stringify({
        message: 'Order has been created',
        order: createdOrder,
      }),
      { status: 200 }
    )
  } catch (err: any) {
    console.error('Error creating order:', err)
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
    })
  } 
})

// import { auth } from '@/auth'
// import prisma from '@/lib/prisma'
// import { round2 } from '@/lib/utils'
// import { formatError } from '@/lib/utils'
// import { OrderItem } from '@/types'

// const calcPrices = (orderItems: OrderItem[]) => {
//   const itemsPrice = round2(
//     orderItems.reduce(
//       (acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 0),
//       0
//     )
//   )
//   const shippingPrice = round2(itemsPrice > 100 ? 0 : 10)
//   const taxPrice = round2(Number((0.15 * itemsPrice).toFixed(2)))
//   const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
//   return { itemsPrice, shippingPrice, taxPrice, totalPrice }
// }

// export const POST = auth(async (req: any) => {
//   if (!req.auth) {
//     return Response.json(
//       { message: 'unauthorized' },
//       {
//         status: 401,
//       }
//     )
//   }

//   const { user } = req.auth

//   try {
//     const payload = await req.json()
//     console.log('Payload received:', payload)

//     const dbProductPrices = await prisma.product.findMany({
//       where: {
//         id: { in: payload.items.map((x: { id: string }) => x.id) },
//       },
//       select: {
//         id: true,
//         price: true,
//       },
//     })
//     console.log('Product prices from DB:', dbProductPrices)

//     const dbOrderItems = payload.items.map((x: { id: string }) => ({
//       ...x,
//       product: { connect: { id: x.id } },
//       price: dbProductPrices.find((item) => item.id === x.id)?.price,
//     }))
//     console.log('Order items with prices:', dbOrderItems)

//     const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
//       calcPrices(dbOrderItems)
//     console.log('Calculated prices:', {
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       totalPrice,
//     })

//     const createdOrder = await prisma.order.create({
//       data: {
//         user: {
//           connect: {
//             id: user.id,
//           },
//         },
//         items: {
//           create: dbOrderItems?.map((orderItem: any) => ({
//             quantity: orderItem.quantity,
//             price: orderItem.price,
//             product: {
//               connect: {
//                 id: orderItem.productId,
//               },
//             },
//           })),
//         },
//         itemsPrice,
//         totalPrice,
//         shippingAddress: {
//           create: payload.shippingAddress,
//         },
//         paymentMethod: payload.paymentMethod,
//       },
//       include: {
//         items: true,
//         shippingAddress: true,
//       },
//     })

//     console.log('Order created:', createdOrder)

//     return Response.json(
//       { message: 'Order has been created', order: createdOrder },
//       {
//         status: 201,
//       }
//     )
//   } catch (err: any) {
//     console.error('Error creating order:', err)
//     return Response.json(
//       { message: formatError(err) },
//       {
//         status: 500,
//       }
//     )
//   }
// })

// import { auth } from '@/auth'
// import prisma from '@/lib/prisma'
// import { round2 } from '@/lib/utils'
// import { formatError } from '@/lib/utils'
// import { OrderItem } from '@/types'

// const calcPrices = (orderItems: OrderItem[]) => {
//   const itemsPrice = round2(
//     orderItems.reduce(
//       (acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 0),
//       0
//     )
//   )
//   const shippingPrice = round2(itemsPrice > 100 ? 0 : 10)
//   const taxPrice = round2(Number((0.15 * itemsPrice).toFixed(2)))
//   const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
//   return { itemsPrice, shippingPrice, taxPrice, totalPrice }
// }

// export const POST = auth(async (req: any) => {
//   if (!req.auth) {
//     return Response.json(
//       { message: 'unauthorized' },
//       {
//         status: 401,
//       }
//     )
//   }

//   const { user } = req.auth

//   try {
//     const payload = await req.json()

//     const dbProductPrices = await prisma.product.findMany({
//       where: {
//         id: { in: payload.items.map((x: { id: string }) => x.id) },
//       },
//       select: {
//         id: true,
//         price: true,
//       },
//     })

//     const dbOrderItems = payload.items.map((x: { id: string }) => ({
//       ...x,
//       product: { connect: { id: x.id } },
//       price: dbProductPrices.find((item) => item.id === x.id)?.price,
//     }))

//     const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
//       calcPrices(dbOrderItems)

//     const createdOrder = await prisma.order.create({
//       data: {
//         items: {
//           create: dbOrderItems,
//         },
//         itemsPrice,
//         //taxPrice,
//         //shippingPrice,
//         totalPrice,
//         shippingAddress: {
//           create: payload.shippingAddress,
//         },
//         paymentMethod: payload.paymentMethod,
//         user: { connect: { id: user.id } },
//       },
//       include: {
//         items: true,
//         shippingAddress: true,
//       },
//     })

//     return Response.json(
//       { message: 'Order has been created', order: createdOrder },
//       {
//         status: 201,
//       }
//     )
//   } catch (err: any) {
//     return Response.json(
//       { message: formatError(err) },
//       {
//         status: 500,
//       }
//     )
//   }
// })

// import { NextResponse } from 'next/server'
// import prisma from '@/lib/prisma'
// import { currentUser } from '@/lib/auth'
// import { redirect } from 'next/navigation'
// import { formatError } from '@/lib/utils'

// export async function POST(req: Request) {
//   //const user = await currentUser()
//   try {
//     const user = await currentUser()
//     if (!user) throw new Error('No current user')

//     const currentUserRecord = await prisma.user.findUnique({
//       where: { id: user.id },
//     })

//     if (!currentUserRecord) throw new Error('User not found')

//     const { shippingAddress, paymentMethod, amountTotal } = await req.json()

//     if (!shippingAddress || !paymentMethod || amountTotal === undefined) {
//       throw new Error('Missing required fields')
//     }

//     const insertedOrderId = await prisma.$transaction(async (tx) => {
//       const insertedOrder = await tx.order.create({
//         data: {
//           userId: user.id,
//           shippingAddress,
//           paymentMethod,
//           amountTotal,
//         },
//       })

//       return insertedOrder.id
//     })

//     if (!insertedOrderId) throw new Error('Order not created')

//     return NextResponse.json({ id: insertedOrderId })
//   } catch (error) {
//     console.log('[Category]', formatError(error))
//     return new NextResponse('Internal Error', { status: 500 })
//   }
// }

// import { NextResponse } from 'next/server'
// import prisma from '@/lib/prisma'
// import { currentUser } from '@/lib/auth'

// import { formatError } from '@/lib/utils'

// export async function POST(req: Request) {
//   //const user = await currentUser()
//   try {
//     const user = await currentUser()
//     if (!user) throw new Error('No current user')

//     const currentUserRecord = await prisma.user.findUnique({
//       where: { id: user.id },
//     })

//     if (!currentUserRecord) throw new Error('User not found')

//     const { shippingAddress, paymentMethod, amountTotal } = await req.json()

//     if (!shippingAddress || !paymentMethod || amountTotal === undefined) {
//       throw new Error('Missing required fields')
//     }

//     const product = await prisma.order.create({
//       data: {
//         userId: user.id,
//         shippingAddress,
//         paymentMethod,
//         amountTotal,
//       },
//     })

//     return NextResponse.json(product)
//   } catch (error) {
//     console.log('[Category]', formatError(error))
//     return new NextResponse('Internal Error', { status: 500 })
//   }
// }

// import { auth } from '@/auth'
// import { formatError } from '@/lib/utils'
// import { OrderItem } from '@/types'
// import { PrismaClient } from '@prisma/client'
// import { round2 } from '@/lib/utils'

// const prisma = new PrismaClient()

// const calcPrices = (orderItems: OrderItem[]) => {
//   // Calculate the items price
//   const itemsPrice = round2(
//     orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
//   )
//   // Calculate the shipping price
//   const shippingPrice = round2(itemsPrice > 100 ? 0 : 10)
//   // Calculate the tax price
//   const taxPrice = round2(Number((0.15 * itemsPrice).toFixed(2)))
//   // Calculate the total price
//   const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
//   return { itemsPrice, shippingPrice, taxPrice, totalPrice }
// }

// export const POST = auth(async (req: any) => {
//   if (!req.auth) {
//     return new Response(JSON.stringify({ message: 'unauthorized' }), {
//       status: 401,
//     })
//   }
//   const { user } = req.auth
//   try {
//     const payload = await req.json()
//     const productIds = payload.items.map((x: { _id: string }) => x._id)

//     const dbProductPrices = await prisma.product.findMany({
//       where: {
//         id: { in: productIds },
//       },
//       select: {
//         id: true,
//         price: true,
//       },
//     })

//     const dbOrderItems = payload.items.map((x: { _id: string }) => ({
//       ...x,
//       productId: x._id,
//       price: dbProductPrices.find((item) => item.id === x._id)?.price,
//     }))

//     const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
//       calcPrices(dbOrderItems)

//     const createdOrder = await prisma.order.create({
//       data: {
//         items: {
//           create: dbOrderItems.map((item: any) => ({
//             productId: item.productId,
//             name: item.name,
//             slug: item.slug,
//             quantity: item.quantity,
//             image: item.image,
//             price: item.price,
//           })),
//         },
//         itemsPrice,
//         // taxPrice,
//         //shippingPrice,
//         totalPrice,
//         shippingAddress: {
//           create: {
//             fullName: payload.shippingAddress.fullName,
//             address: payload.shippingAddress.address,
//             city: payload.shippingAddress.city,
//             postalCode: payload.shippingAddress.postalCode,
//             country: payload.shippingAddress.country,
//           },
//         },
//         paymentMethod: payload.paymentMethod,
//         user: {
//           connect: { id: user._id },
//         },
//       },
//     })

//     return new Response(
//       JSON.stringify({
//         message: 'Order has been created',
//         order: createdOrder,
//       }),
//       {
//         status: 201,
//       }
//     )
//   } catch (err: any) {
//     return new Response(JSON.stringify({ message: formatError(err) }), {
//       status: 500,
//     })
//   } finally {
//     await prisma.$disconnect()
//   }
// })
