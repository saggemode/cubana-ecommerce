import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { bannerId: string } }
) {
  try {
    const course = await prisma.banner.findUnique({
      where: {
        id: params.bannerId,
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedProuct = await prisma.color.delete({
      where: {
        id: params.bannerId,
      },
    });

    return NextResponse.json(deletedProuct);
  } catch (error) {
    console.log("[BANNER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { bannerId: string } }
) {
  try {
    const { bannerId } = params;
    const values = await req.json();
    const { label, imageUrl } = values;

    const course = await prisma.banner.update({
      where: {
        id: bannerId,
      },
      data: {
        ...values,
        label,
        imageUrl,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COLOR_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}