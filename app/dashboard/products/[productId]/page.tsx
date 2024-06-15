import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { currentRole } from '@/lib/auth'
import { ProductForm } from '../_components/product-form'
import { ScrollArea } from '@/components/ui/scroll-area'

const ProductIdPage = async ({ params }: { params: { productId: string } }) => {
  const role = await currentRole()

  const product = await prisma.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    },
  })

  const categories = await prisma.category.findMany({
    // where: {
    //   id: params.productId,
    // },
    orderBy: {
      title: 'asc',
    },
  })

  const sizes = await prisma.size.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  const colors = await prisma.color.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  const brands = await prisma.brand.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  if (!product) {
    return redirect('/')
  }

  return (
    <>
      <ScrollArea className="h-full">
        <div className="flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <ProductForm
              categories={categories}
              colors={colors}
              sizes={sizes}
              brands={brands}
              productId={product.id}
              initialData={product}
            />
          </div>
        </div>
      </ScrollArea>
    </>
  )
}

export default ProductIdPage
