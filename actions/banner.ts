"use server";

import * as z from "zod";
import prisma from "@/lib/prisma";
import { BannerSchema } from "@/schemas";

export const banner = async (values: z.infer<typeof BannerSchema>) => {
  const validatedFields = BannerSchema.safeParse(values);

  try {
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { label, imageUrl } = validatedFields.data;

    await prisma.banner.create({
      data: {
        label,
        imageUrl,
      },
    });

    return { success: "BANNER_POST!" };
  } catch (error) {
    console.error(error);
    return { error: error };
  }
};
