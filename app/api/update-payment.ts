import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { formatError } from '@/lib/utils'
import { paymentMethodSchema } from '@/schemas'
import { currentUser } from '@/lib/auth' // Ensure this imports the correct function

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') {
      return res
        .status(405)
        .json({ success: false, message: 'Method not allowed' })
    }

    const user = await currentUser()
    if (!user) throw new Error('No current user')

    const currentUserr = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!currentUserr) throw new Error('User not found')

    const paymentMethod = paymentMethodSchema.parse(req.body)

    console.log('Updating user with ID:', user.id)
    console.log('New payment method:', paymentMethod.type)

    await prisma.user.update({
      where: { id: user.id },
      data: { paymentMethod: paymentMethod.type },
    })

    // Assuming revalidatePath is a valid function for revalidating
    revalidatePath('/place-order')

    res
      .status(200)
      .json({ success: true, message: 'User updated successfully' })
  } catch (error) {
    console.error('Error updating user payment method:', error)
    res.status(500).json({
      success: false,
      message: formatError(error),
    })
  }
}


// import { NextApiRequest, NextApiResponse } from 'next'
// import prisma from '@/lib/prisma'
// import { revalidatePath } from 'next/cache'
// import { formatError } from '@/lib/utils'
// import { paymentMethodSchema } from '@/schemas'
// import { getSession } from 'next-auth/react'

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     if (req.method !== 'POST') {
//       return res.status(405).json({ message: 'Method not allowed' })
//     }

//     const session = await getSession();
//     if (!session) {
//       return res.status(401).json({ message: 'Unauthorized' })
//     }

//     const user = session.user
//     const data = req.body

//     const paymentMethod = paymentMethodSchema.parse(data)

//     console.log('Updating user with ID:', user.id)
//     console.log('New payment method:', paymentMethod.type)

//     await prisma.user.update({
//       where: { id: user.id },
//       data: { paymentMethod: paymentMethod.type },
//     })

//     // You might need to adjust this line according to your setup
//     // revalidatePath('/place-order');

//     return res
//       .status(200)
//       .json({ success: true, message: 'User updated successfully' })
//   } catch (error) {
//     console.error('Error updating user payment method:', error)
//     return res
//       .status(500)
//       .json({
//         success: false,
//         message: formatError(error),
//       })
//   }
// }


