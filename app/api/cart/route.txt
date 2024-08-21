import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { currentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { formatError } from '@/lib/utils'

export async function POST(req: Request, res: Response) {
  //const user = await currentUser()
  try {
    const user = await currentUser()
    const userId = user?.id
    if (!user) throw new Error('No current user')

    const currentUserRecord = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!currentUserRecord) throw new Error('User not found')

    const { cartItems, shippingAddress, paymentMethod } = await req.json()

    const cart = await prisma.cart.findUnique({
      where: { userId },
    })

    if (cart) {
      // Update existing cart
      const updatedCart = await prisma.cart.update({
        where: { userId },
        data: cartItems,
      })
      // res.status(200).json(updatedCart)
    } else {
      // Create new cart
      const newCart = await prisma.cart.create({
        data: {
          userId: user.id,
          cartItems,
          shippingAddress,
          paymentMethod,
        },
      })

       return NextResponse.json(newCart)
      
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.log('[Category]', formatError(error))
    return new NextResponse('Internal Error', { status: 500 })
  }
}
