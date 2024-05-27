import { NextResponse } from "next/server";

import slugify from "slugify";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    const product = await prisma.product.create({
      data: {
        name,
        slug: slugify(name),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[product]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
