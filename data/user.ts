import prisma from "@/lib/prisma";
// import { ExtendedUser } from "@/next-auth";
//import { User } from "@prisma/client";

// export const getUserByEmail = async (email: string) => {
  
//   try {
//     const user = await prisma.user.findUnique({ where: { email } });

//     if (!user) return null;
    

//     return user;
//   } catch {
//     return null;
//   }
// };

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return null;

    // Ensure that the user object has all the required properties
    // const extendedUser: ExtendedUser = {
    //   id: user.id,
    //   email: user.email,
    //   emailVerified: user.emailVerified,
    //   isBanned: user.isBanned,
    //   name: user.name,
    //   image: user.image,
    //   password: user.password,
    //   isOAuth: false, // assuming this property is not retrieved from the database
    //   phone: user.phone,
    //   createdAt: user.createdAt,
    //   updatedAt: user.updatedAt,
    //   role: user.role,
    //   isTwoFactorEnabled: user.isTwoFactorEnabled,
    //   accessToken: "", // Add appropriate values or leave it empty/null depending on your logic
    //   refreshToken: "", // Add appropriate values or leave it empty/null depending on your logic
    //   exp: Math.floor(Date.now() / 1000) + (60 * 60), // Example: 1 hour expiratio
    //   expts: Math.floor(Date.now() / 1000) + (60 * 60), // Example: 1 hour expiratio
    // };

    return {
      ...user,
      accessToken: "", // Add appropriate values or leave it empty/null depending on your logic
      refreshToken: "", // Add appropriate values or leave it empty/null depending on your logic
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // Example: 1 hour expiratio
      expts: Math.floor(Date.now() / 1000) + (60 * 60), // Example: 1 hour expiratio
    };
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

export const getUserById = async (id: string | undefined) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};
