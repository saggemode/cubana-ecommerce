'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { PRODUCT_URL } from '@/constants/urls'
import ProductService from '../services/productService'
import { adminAction } from './safe-actions'
import { productActionSchema } from '@/schemas'

// export const addProduct = async (data: any) => {
//   try {
//     await ProductService.createProduct(data)
//   } catch (error) {
//     if (error instanceof Error) return { error: error.message }
//   }

//   revalidatePath(PRODUCT_URL)
//   redirect(PRODUCT_URL)
// }

export const addProduct = adminAction(productActionSchema, async (data: any) => {
  try {
    await ProductService.createProduct(data)
  } catch (error) {
    if (error instanceof Error) return { error: error.message }
  }

  revalidatePath(PRODUCT_URL)
  redirect(PRODUCT_URL)
})

export const updateProduct = async (data: any) => {
  try {
    await ProductService.updateProduct(data)
  } catch (error) {
    if (error instanceof Error) return { error: error.message }
  }

  revalidatePath(PRODUCT_URL)
  redirect(PRODUCT_URL)
}
