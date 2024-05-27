import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const course = await prisma.category.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedProuct = await prisma.category.delete({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(deletedProuct);
  } catch (error) {
    console.log("[CATEGORY_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { categoryId } = params;
    const values = await req.json();

    const course = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[Category_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// export async function PATCH(
//   req: Request,
//   { params }: { params: { productId: string } }
// ) {
//   try {
//     const { productId } = params;
//     const values = await req.json();

//     const { images } = values;

//     if (!images || !images.length) {
//       return new NextResponse("Images are required", { status: 400 });
//     }

//     await prisma.product.update({
//       where: {
//         id: productId,
//       },
//       data: {
//         images: {
//           deleteMany: {},
//         },
//       },
//     });

//     const product = await prisma.product.update({
//       where: {
//         id: params.productId,
//       },
//       data: {
//         ...values,
//         images: {
//           createMany: {
//             data: [...images.map((image: { url: string }) => image)],
//           },
//         },
//       },
//     });

//     return NextResponse.json(product);
//   } catch (error) {
//     console.log("[PRODUCT_PATCH]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }
