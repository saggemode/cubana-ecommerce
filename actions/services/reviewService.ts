'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { z } from 'zod'

import { insertReviewSchema } from '@/schemas'

import { formatError } from '@/lib/utils'
import { auth } from '@/auth'

import { PAGE_SIZE } from '@/constants/constant'

export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>
) {
  try {
    const session = await auth()
    if (!session) throw new Error('User is not authenticated')

    const review = insertReviewSchema.parse({
      ...data,
      userId: session.user.id,
    })

    const product = await prisma.product.findUnique({
      where: { id: review.productId },
    })
    if (!product) throw new Error('Product not found')

    const reviewExists = await prisma.review.findFirst({
      where: {
        productId: review.productId,
        userId: review.userId,
      },
    })

    await prisma.$transaction(async (prisma) => {
      if (reviewExists) {
        await prisma.review.update({
          where: { id: reviewExists.id },
          data: {
            description: review.description,
            title: review.title,
            rating: review.rating,
          },
        })
      } else {
        await prisma.review.create({
          data: review,
        })
      }

      const averageRating = await prisma.review.aggregate({
        _avg: { rating: true },
        where: { productId: review.productId },
      })

      const numReviews = await prisma.review.count({
        where: { productId: review.productId },
      })

      await prisma.product.update({
        where: { id: review.productId },
        data: {
          rating: averageRating._avg.rating,
          numReviews: numReviews,
        },
      })
    })

    // Assuming you have a function to revalidate the path
    revalidatePath(`/products/${product.id}`)

    return {
      success: true,
      message: 'Review updated successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function getReviews({
  productId,
  limit = PAGE_SIZE,
  page,
}: {
  productId: string
  limit?: number
  page: number
}) {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  })

  const totalReviews = await prisma.review.count({
    where: { productId },
  })

  return {
    data: reviews,
    totalPages: Math.ceil(totalReviews / limit),
  }
}

export const getUserReviewByProductId = async ({
  productId,
}: {
  productId: string
}) => {
  const session = await auth()
  if (!session) throw new Error('User is not authenticated')

  return await prisma.review.findFirst({
    where: {
      productId,
      userId: session.user.id,
    },
  })
}
