"use server";

import * as z from "zod";
import prisma from "@/lib/prisma";
import { ColorSchema } from "@/schemas";

export const color = async (values: z.infer<typeof ColorSchema>) => {
  const validatedFields = ColorSchema.safeParse(values);

  try {
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { name, value } = validatedFields.data;

    await prisma.color.create({
      data: {
        name,
        value,
      },
    });

    return { success: "COLOR_POST!" };
  } catch (error) {
    console.error(error);
    return { error: error };
  }
};
