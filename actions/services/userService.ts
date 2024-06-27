import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { z } from 'zod'

import { shippingAddressSchema } from '@/schemas'

import { formatError } from '@/lib/utils'
import { auth, signIn, signOut } from '@/auth'
import { ShippingAddress } from '@/types'

export async function getUserById(userId:  string | undefined) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) throw new Error('User not found')

    return user
  } catch (error: any) {
    throw new Error(error)
  }
}

// export async function updateUserAddress(data: ShippingAddress) {
//   try {
//     const session = await auth()
//     const currentUser = await prisma.user.findUnique({
//       where: { id: session?.user?.id },
//     })
//     if (!currentUser) throw new Error('User not found')

//     const address = shippingAddressSchema.parse(data)
//     await prisma.user.update({
//       where: { id: currentUser.id },
//       data: { address },
//     })
//     revalidatePath('/place-order')
//     return {
//       success: true,
//       message: 'User updated successfully',
//     }
//   } catch (error) {
//     return { success: false, message: formatError(error) }
//   }
// }

// DELETE

export const updateUserAddress = async (
  values: z.infer<typeof shippingAddressSchema>
) => {
  try {
    const session = await auth()
    const currentUser = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    })
    if (!currentUser) throw new Error('User not found')
     

    const address = shippingAddressSchema.parse(values)
    
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    })
    revalidatePath('/place-order')
    return {
      success: true,
      message: 'User updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    })
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
