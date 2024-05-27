import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: {colorId: string } }
) {
  try {
    const course = await prisma.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedProuct = await prisma.color.delete({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(deletedProuct);
  } catch (error) {
    console.log("[COLOR_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    const { colorId } = params;
    const values = await req.json();

    const course = await prisma.color.update({
      where: {
        id: colorId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COLOR_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

