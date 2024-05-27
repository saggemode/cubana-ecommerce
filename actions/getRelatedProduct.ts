import prisma from "@/lib/prisma";

export default async function getRelatedProducts(productId: string) {
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
    });

    if (!product) {
      throw new Error("Product not found");
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
    });

    return relatedProducts;
  } catch (error) {
    console.error("Error retrieving related products:", error);
    throw error;
  }
}
