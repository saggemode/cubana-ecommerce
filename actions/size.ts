"use server";

import * as z from "zod";
import prisma from "@/lib/prisma";
import { SizeSchema } from "@/schemas";

export const size = async (values: z.infer<typeof SizeSchema>) => {
  const validatedFields = SizeSchema.safeParse(values);

  try {
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { name, value } = validatedFields.data;

    await prisma.size.create({
      data: {
        name,
        value,
      },
    });

    return { success: "SIZE_POST!" };
  } catch (error) {
    console.error(error);
    return { error: error };
  }
};
