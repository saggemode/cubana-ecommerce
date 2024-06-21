import { NextResponse } from 'next/server'

import slugify from 'slugify'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json()
  try {
    const {
      name,
      description,
      price,
      stock,
      brandId,
      discount,
      images,
      categoryId,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
    } = body

    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        discount,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        brandId,
        sizeId,
        stock,
        slug: slugify(name),

        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[product]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
