// components/SearchServer.tsx
import ProductService from '@/actions/services/productService'

export default async function SearchServer() {
  const categories = await ProductService.getCategories()
  const filteredCategories = categories.filter(
    (c): c is string => c !== undefined
  )

  return filteredCategories
}
