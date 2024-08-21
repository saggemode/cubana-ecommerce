'use server'

import { cache } from 'react'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import type { z } from 'zod'
import slugify from 'slugify'
import { NextResponse } from 'next/server'
import {
  productActionSchema,
  updateProductActionSchema,
  deleteProductActionSchema,
  updateProductStatusActionSchema,
} from '@/schemas'
import { Product } from '@/types'
// import type { Product } from '@prisma/client'

interface IParams {
  productId?: string
}

type ResolvedType<T> = T extends Promise<infer R> ? R : never

class ProductService {
  static async findProducts() {
    try {
      const products = await prisma.product.findMany({
        include: {
          brand: true,
          category: true,
          color: true,
          size: true,
          images: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      const safeProducts = products.map((products) => ({
        ...products,
        createdAt: products.createdAt.toISOString(),
      }))

      return safeProducts
    } catch (error: any) {
      throw new Error(error)
    }
  }

  // ............start new functions...................

  static getLatest = cache(async () => {
    const products = await prisma.product.findMany({
      orderBy: {
        id: 'desc',
      },
      take: 8,
    })
    return products
  })

  static getTopRated = cache(async () => {
    const products = await prisma.product.findMany({
      orderBy: {
        rating: 'desc',
      },
      take: 8,
    })
    return products
  })

  static getFeatured = async () => {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
      },
      include: {
        images: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    })
    return products
  }

  static getBySlug = cache(async (slug: string) => {
    const product = await prisma.product.findFirst({
      where: {
        slug: slug,
      },
    })
    return product
  })

  static getByQuery = cache(
    async ({
      q,
      category,
      sort,
      price,
      rating,
      page = '1',
    }: {
      q: string
      category: string
      price: string
      rating: string
      sort: string
      page: string
    }) => {
      const PAGE_SIZE = 3

      // Ensure the correct type is used for the name filter
      const queryFilter: Prisma.ProductWhereInput =
        q && q !== 'all' ? { name: { contains: q, mode: 'insensitive' } } : {}

      const categoryFilter: Prisma.ProductWhereInput =
        category && category !== 'all' ? { categoryId: category } : {}

      const ratingFilter: Prisma.ProductWhereInput =
        rating && rating !== 'all' ? { rating: { gte: Number(rating) } } : {}

      const priceFilter: Prisma.ProductWhereInput =
        price && price !== 'all'
          ? {
              price: {
                gte: Number(price.split('-')[0]),
                lte: Number(price.split('-')[1]),
              },
            }
          : {}

      //  const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
      //    if (sort === 'lowest') return { price: 'asc' }
      //    if (sort === 'highest') return { price: 'desc' }
      //    if (sort === 'toprated') return { rating: 'desc' }
      //    return { id: 'desc' }
      //  })()

      const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
        if (sort === 'lowest') return { price: 'asc' }
        if (sort === 'highest') return { price: 'desc' }
        if (sort === 'toprated') return { rating: 'desc' }
        return { id: 'desc' }
      })()

      const products = await prisma.product.findMany({
        where: {
          ...queryFilter,
          ...categoryFilter,
          ...priceFilter,
          ...ratingFilter,
        },
        orderBy,
        skip: PAGE_SIZE * (Number(page) - 1),
        take: PAGE_SIZE,
        select: {
          id: true,
          name: true,
          price: true,
          category: true,
          rating: true,
          images:true,
          slug: true,
        },
      })

      const countProducts = await prisma.product.count({
        where: {
          ...queryFilter,
          ...categoryFilter,
          ...priceFilter,
          ...ratingFilter,
        },
      })

      const categories = await prisma.product.findMany({
        distinct: ['categoryId'],
        select: { category: true },
      })

      return {
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / PAGE_SIZE),
        categories: categories.map((c) => c.category),
      }
    }
  )

  // static getCategories = cache(async () => {
  //   const categories = await prisma.product.findMany({
  //     distinct: ['categoryId'],
  //     select: { category: true },
  //   })
  //   return categories.map((c) => c.category)
  // })

  // ............end new functions...................

  static getCategories = cache(async () => {
    const categories = await prisma.product.findMany({
      distinct: ['categoryId'],
      select: { category: true },
    })
    return categories.map((c) => c.category?.title) 
  })

  static async findProduct(params: IParams) {
    try {
      const { productId } = params

      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },

        include: {
          category: true,
          size: true,
          brand: true,
          color: true,
          images: true,
        },
      })

      if (!product) {
        return null
      }

      return {
        ...product,
        createdAt: product?.createdAt.toString(),
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  static async relatedProducts(productId: string) {
    try {
      // Fetch the product details based on the product ID
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          category: true,
          images: true,
        },
      })

      if (!product) {
        throw new Error('Product not found')
      }

      // Fetch related products based on the category of the given product
      const relatedProducts = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          // Exclude the current product from the related products
          NOT: {
            id: productId,
          },
        },

        include: {
          images: true,
        },
      })

      return relatedProducts
    } catch (error) {
      console.error('Error retrieving related products:', error)
      throw error
    }
  }

  static async updatedProducts() {
    const products = await prisma.product.findMany()
    const checkoutSessions = await prisma.checkoutSession.findMany()

    const updatedProducts: Product[] = products.map((product) => {
      const sessionsForProduct = checkoutSessions.filter((session: any) =>
        session.productIds.includes(product.id)
      )
      const totalQuantityOrdered = sessionsForProduct.reduce(
        (total: any, session: any) =>
          total + session.quantities[session.productIds.indexOf(product.id)]!,
        0
      )

      const stock = product.stock ?? 0 // Provide a default value if product.stock is null

      return { ...product, stock: stock - totalQuantityOrdered }
    })

    return { products, updatedProducts }
  }

  static async createProduct(values: z.infer<typeof productActionSchema>) {
    try {
      const validatedFields = productActionSchema.safeParse(values)
      if (!validatedFields.success) {
        return { error: 'Invalid fields!' }
      }

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
      } = validatedFields.data

      await prisma.product.create({
        data: {
          name,
          description,
          price,
          brandId,
          discount,
          isFeatured,
          isArchived,
          categoryId,
          colorId,
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
      return { success: 'Product Created' }
      // return NextResponse.json(product);
    } catch (error) {
      console.log('[product]', error)
      return new NextResponse('Internal Error', { status: 500 })
    }
  }

  static async updateProduct(data: z.infer<typeof updateProductActionSchema>) {
    try {
      if (!data) return

      const {
        id,
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
      } = data

      await prisma.product.update({
        where: { id },
        data: {
          images: {
            deleteMany: {},
          },
        },
      })

      const product = await prisma.product.update({
        where: {
          id: id,
        },
        data: {
          name,
          description,
          price,
          isFeatured,
          isArchived,
          categoryId,
          brandId,
          discount,
          colorId,
          sizeId,
          stock,
          images: {
            createMany: {
              data: [...images.map((image: { url: string }) => image)],
            },
          },
        },
      })
      return NextResponse.json(product)
    } catch (error) {
      console.log('[Prouct_ID]', error)
      return new NextResponse('Internal Error', { status: 500 })
    }
  }

  static async updateProductStatus(
    data: z.infer<typeof updateProductStatusActionSchema>
  ) {
    if (!data) return

    const { id, isFeatured } = data

    await prisma.product.update({
      where: { id },
      data: {
        isFeatured,
      },
    })
  }

  static async deleteProduct(data: z.infer<typeof deleteProductActionSchema>) {
    if (!data) return

    const { id } = data

    await prisma.product.delete({ where: { id } })
  }
}

export type ProductWithVariants = ResolvedType<
  ReturnType<typeof ProductService.findProduct>
>

export default ProductService
