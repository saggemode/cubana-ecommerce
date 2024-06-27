"use server";

import * as z from "zod";

import prisma from "@/lib/prisma";
import { ProductSchema } from "@/schemas";
import slugify from "slugify";

export const addProductAction = async (values: z.infer<typeof ProductSchema>) => {
  const validatedFields = ProductSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, description, price, stock, images } = validatedFields.data;

  await prisma.product.create({
    data: {
      name,
      description,
      price,
      slug: slugify(name),
      stock,
      images: {
        createMany: {
          data: [...images.map((image: { url: string }) => image)],
        },
      },
    },
  });

  return { success: "Product created successfully" };
};
