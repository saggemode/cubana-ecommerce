import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export const GET = auth(async (req: any, res: any) => {
  if (!req.auth) {
    return res.status(401).json({ message: 'unauthorized' })
  }
  const { user } = req.auth

  try {
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: true,
        shippingAddress: true,
        //paymentResult: true,
      },
    })
    return res.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return res.status(500).json({ message: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
})
