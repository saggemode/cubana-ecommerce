// import type { Metadata } from "next";
// import { notFound } from "next/navigation";

import getProductById from '@/actions/getProductById'
import ClientOnly from '@/components/ClientOnly'
import EmptyState from '@/components/EmptyState'
// import prisma from "@/lib/prisma";
import Breadcrumbs from './_components/Breadcrumbs'
import DataColumn from './_components/DataColumn'
import Gallery from './_components/gallery'
import Link from 'next/link'
import { GridTileImage } from '@/components/grid/tile'
// import getProducts from "@/actions/getProducts";
import getRelatedProducts from '@/actions/getRelatedProduct'
interface IParams {
  params: {
    productId: string
  }
}

const ProductPage: React.FC<IParams> = async ({ params }) => {
  const product = await getProductById(params)
  // const suggestedProducts = await getRelatedProducts({
  //   categoryId: product?.category?.title,
  //   params,
  // });

  // const productId = parseInt(params.productId, 10);

  // const product = await prisma.product.findUnique({
  //   where: {
  //     id: params.productId,
  //   },
  //   include: {
  //     category: true,
  //     size: true,
  //     brand: true,
  //     color: true,
  //     images: true,
  //   },
  // });

  // const urlString = product?.images;

  if (!product) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <div className='mt-12 pt-12'>
        <Breadcrumbs product={product} />
        <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-3">
          <Gallery images={product.images} />
          <DataColumn product={product} />
        </div>
        <RelatedProducts productId={product.id} />
      </div>
    </ClientOnly>
  )
}

export default ProductPage

async function RelatedProducts({ productId }: { productId: string }) {
  const relatedProducts = await getRelatedProducts(productId)

  if (!relatedProducts.length) return null

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => (
          <li
            key={product.name}
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <Link
              className="relative h-full w-full"
              href={`/products/${product.id}`}
            >
              <GridTileImage
                alt={product.name}
                label={{
                  title: product.name as string,
                  amount:
                    product.price !== null ? product.price.toString() : '',
                  currencyCode:
                    product.price !== null ? product.price.toString() : '',
                }}
                src={product.images?.[0]?.url}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
