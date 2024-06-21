import prisma from '@/lib/prisma'
import type { z } from 'zod'
import slugify from 'slugify'
import { NextResponse } from 'next/server'
import { productActionSchema, updateProductActionSchema } from '@/schemas'

interface IParams {
  productId?: string
}

type ResolvedType<T> = T extends Promise<infer R> ? R : never

class ProductService {
  static async findProducts() {
    const products = await prisma.product.findMany()
    return products
  }

  static async findProduct(params: IParams) {
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

    // return product;
    return {
      ...product,
      createdAt: product?.createdAt.toString(),
    }
  }

  //   static async updatedProducts() {
  //     const products = await prisma.product.findMany();
  //     const checkoutSessions = await prisma.checkoutSession.findMany();

  //     const updatedProducts: Product[] = products.map((product) => {
  //       const sessionsForProduct = checkoutSessions.filter((session) =>
  //         session.productIds.includes(product.id),
  //       );
  //       const totalQuantityOrdered = sessionsForProduct.reduce(
  //         (total, session) =>
  //           total + session.quantities[session.productIds.indexOf(product.id)]!,
  //         0,
  //       );
  //       return { ...product, stock: product.stock - totalQuantityOrdered };
  //     });

  //     return { products, updatedProducts };
  //   }

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

  //   static async updateProductStatus(
  //     data: z.infer<typeof updateProductStatusActionSchema>,
  //   ) {
  //     if (!data) return;

  //     const { id, status } = data;

  //     await db.product.update({
  //       where: { id },
  //       data: {
  //         status,
  //       },
  //     });
  //   }

  //   static async deleteProduct(data: z.infer<typeof deleteProductActionSchema>) {
  //     if (!data) return;

  //     const { id } = data;

  //     await db.product.delete({ where: { id } });
  //   }
}

export type ProductWithVariants = ResolvedType<
  ReturnType<typeof ProductService.findProduct>
>

export default ProductService
