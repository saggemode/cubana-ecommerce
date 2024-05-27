"use server";

import * as z from "zod";
import prisma from "@/lib/prisma";
import { BrandSchema } from "@/schemas";

export const brand = async (values: z.infer<typeof BrandSchema>) => {
  const validatedFields = BrandSchema.safeParse(values);

  try {
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { name } = validatedFields.data;

    await prisma.brand.create({
      data: {
        name,
      },
    });

    return { success: "BRAND_POST!" };
  } catch (error) {
    console.error(error);
    return { error: error };
  }
};
