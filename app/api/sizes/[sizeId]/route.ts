import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: {sizeId: string } }
) {
  try {
    const course = await prisma.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedProuct = await prisma.size.delete({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(deletedProuct);
  } catch (error) {
    console.log("[SIZE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    const { sizeId } = params;
    const values = await req.json();

    const course = await prisma.size.update({
      where: {
        id: sizeId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[SIZE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

