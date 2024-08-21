import { auth } from '@/auth'
import prisma  from '@/lib/prisma' // Adjust the path according to your setup

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return new Response(JSON.stringify({ message: 'unauthorized' }), {
      status: 401,
    })
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true } } }, // Fetching the user's name
  })

  return new Response(JSON.stringify(orders), { status: 200 })
}) as any
