import prisma from "@/lib/prisma";

interface IParams {
  productId?: string;
}

export default async function getProductById(params: IParams) {
  try {
    const { productId } = params;

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
    });

    if (!product) {
      return null;
    }


    
 
    return {
      ...product,
      createdAt: product?.createdAt.toString(),
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
