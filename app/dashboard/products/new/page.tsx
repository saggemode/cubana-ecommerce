import React from 'react'
import prisma from '@/lib/prisma'
import { ProductForm } from '../_components/product-form'

const AddProductPage = async () => {
  const categories = await prisma.category.findMany({
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

  return (
    <div className="h-full">
      <ProductForm
        categories={categories}
        colors={colors}
        sizes={sizes}
        brands={brands}
      />
    </div>
  )
}

export default AddProductPage
