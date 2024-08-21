import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { currentUser } from '@/lib/auth'
import { formatError } from '@/lib/utils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const user = await currentUser()
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { productId, quantity } = req.body
    await prisma.cartItem.create({
      data: {
        productId,
        quantity,
        userId: user.id,
      },
    })

    return res.status(200).json({ message: 'Item added to cart' })
  } catch (error) {
    console.error('Failed to add item to cart:', formatError(error))
    return res.status(500).json({ message: formatError(error) })
  }
}
