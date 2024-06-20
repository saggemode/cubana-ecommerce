import { NextResponse } from 'next/server'

import slugify from 'slugify'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json()
  try {
    const {
      name,
      description,
      price,
      stock,
      brandId,
      discount,
      images,
      categoryId,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
    } = body

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        discount,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        brandId,
        sizeId,
        stock,
        slug: slugify(name),

        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[product]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

// import { NextResponse } from 'next/server'

// import slugify from 'slugify'
// import prisma from '@/lib/prisma'

// export async function POST(req: Request) {
//   try {
//     const {
//       name,
//       description,
//       price,
//       stock,
//       categoryId,
//       colorId,
//       sizeId,
//       images,
//       isFeatured,
//       isArchived,
//     } = await req.json()

//     const product = await prisma.product.create({
//       data: {
//         name,
//         description,
//         price,
//         isFeatured,
//         isArchived,
//         categoryId,
//         colorId,
//         sizeId,
//         stock,

//         slug: slugify(name),
//         images: {
//           createMany: {
//             data: [...images.map((image: { url: string }) => image)],
//           },
//         },
//       },
//     })

//     return NextResponse.json(product)
//   } catch (error) {
//     console.log('[product]', error)
//     return new NextResponse('Internal Error', { status: 500 })
//   }
// }

// import { NextApiRequest, NextApiResponse } from 'next'
// import slugify from 'slugify'
// import prisma from '@/lib/prisma'

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === 'POST') {
//     try {
//       const {
//         name,
//         description,
//         price,
//         discount,
//         stock,
//         categoryId,
//         colorId,
//         sizeId,
//         brandId,
//         images,
//         isFeatured,
//         isArchived,
//       } = req.body

//       const product = await prisma.product.create({
//         data: {
//           name,
//           description,
//           price: parseFloat(price),
//           discount: parseFloat(discount),
//           stock: parseFloat(stock),
//           slug: slugify(name),
//           categoryId,
//           colorId,
//           sizeId,
//           brandId,
//           images: {
//             create: images.map((image: { url: string }) => ({
//               url: image.url,
//             })),
//           },
//           isFeatured,
//           isArchived,
//         },
//       })

//       res.status(200).json(product)
//     } catch (error) {
//       res.status(500).json({ error: 'Unable to create product' })
//     }
//   } else {
//     res.setHeader('Allow', ['POST'])
//     res.status(405).end(`Method ${req.method} Not Allowed`)
//   }
// }
