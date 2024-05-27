"use server";

import * as z from "zod";
import prisma from "@/lib/prisma";
import { CategorySchema } from "@/schemas";

export const category = async (values: z.infer<typeof CategorySchema>) => {
  const validatedFields = CategorySchema.safeParse(values);

  try {
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { title } = validatedFields.data;

    await prisma.category.create({
      data: {
        title,
      },
    });

    return { success: "CATEGORY_POST!" };
  } catch (error) {
    console.error(error);
    return { error: error };
  }
};
