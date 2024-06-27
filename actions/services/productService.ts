import prisma from '@/lib/prisma'
import type { z } from 'zod'
import slugify from 'slugify'
import { NextResponse } from 'next/server'
import {
  productActionSchema,
  updateProductActionSchema,
  deleteProductActionSchema,
  updateProductStatusActionSchema,
} from '@/schemas'
import type { Product } from '@prisma/client'

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
