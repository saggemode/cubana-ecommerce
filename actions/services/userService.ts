'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { z } from 'zod'

import { shippingAddressSchema, paymentMethodSchema } from '@/schemas'

import { formatError } from '@/lib/utils'
import { auth} from '@/auth'
import { currentUser } from '@/lib/auth'
import { ShippingAddress } from '@/types'
import { getSession } from 'next-auth/react'




export async function getUserById(userId: string | undefined) {
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
    const currentUserr = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    })
    if (!currentUserr) throw new Error('User not found')

    const address = shippingAddressSchema.parse(values)

    await prisma.user.update({
      where: { id: currentUserr.id },
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

// export async function updateUserPaymentMethod(
//   data: z.infer<typeof paymentMethodSchema>
// ) {
//   try {
//     const user = await currentUser()
//     const currentUserr = await prisma.user.findUnique({
//       where: { id: user?.id },
//     })
//     if (!currentUserr) throw new Error('User not found')

//     const paymentMethod = paymentMethodSchema.parse(data)

//      console.log('Updating user with ID:', user?.id)
//      console.log('New payment method:', paymentMethod.type)

//     await prisma.user.update({
//       where: { id: user?.id },
//       data: { paymentMethod: paymentMethod.type },
//     })

//     revalidatePath('/place-order')
//     return {
//       success: true,
//       message: 'User updated successfully',
//     }
//   } catch (error) {
//     console.error('Error updating user payment method:', formatError(error))

//     return { success: false, message: formatError(error) }
//   }
// }

// export async function updateUserPaymentMethod(data:any) {
//   try {

//     const user = await currentUser()
//     if (!user) throw new Error('No current user')

//     const currentUserr = await prisma.user.findUnique({
//       where: { id: user.id },
//     })

//     if (!currentUserr) throw new Error('User not found')

//     const paymentMethod = paymentMethodSchema.parse(data)

//     console.log('Updating user with ID:', user.id)
//     console.log('New payment method:', paymentMethod.type)

//     await prisma.user.update({
//       where: { id: user.id },
//       data: { paymentMethod: paymentMethod.type },
//     })

//     revalidatePath('/place-order')
//     return {
//       success: true,
//       message: 'User updated successfully',
//     }
//   } catch (error) {
//     console.error('Error updating user payment method:', formatError(error))

//     return { success: false, message: formatError(error) }
//   }
// }

export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const user = await currentUser()
    if (!user || !user.id) throw new Error('User not authenticated')

    const currentUserRecord = await prisma.user.findUnique({
      where: { id: user.id },
    })
    if (!currentUserRecord) throw new Error('User not found')

    const paymentMethod = paymentMethodSchema.parse(data)

    console.log('Updating user with ID:', user.id)
    console.log('New payment method:', paymentMethod.type)

    await prisma.user.update({
      where: { id: user.id },
      data: { paymentMethod: paymentMethod.type },
    })

    revalidatePath('/place-order')
    return {
      success: true,
      message: 'User updated successfully',
    }
  } catch (error) {
    console.error('Error updating user payment method:', formatError(error))

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
