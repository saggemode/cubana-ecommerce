import prisma from "@/lib/prisma";

export interface IProductsParams {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
}

export default async function getProducts() {
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
        createdAt: "desc",
      },
    });

    const safeProducts = products.map((products) => ({
      ...products,
      createdAt: products.createdAt.toISOString(),
    }));

    return safeProducts;
  } catch (error: any) {
    throw new Error(error);
  }
}
