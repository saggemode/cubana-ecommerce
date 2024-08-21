import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { formatError } from '@/lib/utils'
import { paymentMethodSchema } from '@/schemas'
import { currentUser } from '@/lib/auth' // Ensure this imports the correct function

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) throw new Error('No current user')

    const currentUserRecord = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!currentUserRecord) throw new Error('User not found')

    const body = await req.json()
    const paymentMethod = paymentMethodSchema.parse(body)

    await prisma.user.update({
      where: { id: user.id },
      data: { paymentMethod: paymentMethod.type },
    })

    revalidatePath('/place-order')

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
    })
  } catch (error) {
    console.error('Error updating user payment method:', error)
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    )
  }
}

// import { NextApiRequest, NextApiResponse } from 'next'
// import prisma from '@/lib/prisma'
// import { revalidatePath } from 'next/cache'
// import { formatError } from '@/lib/utils'
// import { paymentMethodSchema } from '@/schemas'
// import { currentUser } from '@/lib/auth' // Ensure this imports the correct function

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     if (req.method !== 'POST') {
//       return res
//         .status(405)
//         .json({ success: false, message: 'Method not allowed' })
//     }

//     const user = await currentUser()
//     if (!user) throw new Error('No current user')

//     const currentUserRecord = await prisma.user.findUnique({
//       where: { id: user.id },
//     })

//     if (!currentUserRecord) throw new Error('User not found')

//     const paymentMethod = paymentMethodSchema.parse(req.body)

//     await prisma.user.update({
//       where: { id: user.id },
//       data: { paymentMethod: paymentMethod.type },
//     })

//     revalidatePath('/place-order')

//     res
//       .status(200)
//       .json({ success: true, message: 'User updated successfully' })
//   } catch (error) {
//     console.error('Error updating user payment method:', error)
//     res.status(500).json({ success: false, message: formatError(error) })
//   }
// }
