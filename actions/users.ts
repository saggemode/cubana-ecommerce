"use server";


import prisma from "@/lib/prisma";

export const users = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch (error) {
    return { error: "Forbidden Server Action!" };
  }
};
