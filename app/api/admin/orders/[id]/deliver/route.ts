import { auth } from '@/auth'
import prisma from '@/lib/prisma' // Adjust the path according to your setup

export const PUT = auth(async (req: any, res: any) => {
  // Extract the order ID from the URL or request body
  const { id } = req.query || req.body

  if (!req.auth || !req.auth.user?.isAdmin) {
    return res.status(401).json({ message: 'unauthorized' })
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: id as string },
    })

    if (order) {
      if (!order.isPaid) {
        return res.status(400).json({ message: 'Order is not paid' })
      }

      const updatedOrder = await prisma.order.update({
        where: { id: id as string },
        data: {
          isDelivered: true,
          deliveredAt: new Date(),
        },
      })

      return res.status(200).json(updatedOrder)
    } else {
      return res.status(404).json({ message: 'Order not found' })
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message })
  }
}) as any
