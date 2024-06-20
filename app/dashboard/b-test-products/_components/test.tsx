'use client'

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { LuTrash } from 'react-icons/lu'
import { Category, Color, Image, Product, Size, Brand } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { AlertModal } from '@/components/modals/alert-modal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/ui/image-upload'
import { Checkbox } from '@/components/ui/checkbox'
import Heading from '@/components/Heading'
import { ProductSchema } from '@/schemas'
import { InputForm } from '@/components/ui/input-form'

import { useTransition, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
//import { createProduct } from '@/actions/admins/services/productService'
import { SubmitButton } from '@/components/auth/SubmitButton'

import ProductService, {
  ProductWithVariants,
} from '@/actions/admins/services/productService'
import { addProduct, updateProduct } from '@/actions/admins/actions/products'
import { addProductAction } from '@/actions/admins/actions/product'

type ProductFormProps = {
  // product?: ProductWithVariants & {
  //   images: Image[]
  // }
  product?:
    | (ProductWithVariants & {
        images: Image[]
      })
    | null
  categories: Category[]
  colors: Color[]
  sizes: Size[]
  brands: Brand[]
  asEdit?: boolean
}

const defaultValues = {
  name: '',
  description: '',
  images: [],
  price: 0,
  discount: 0,
  stock: 0,
  categoryId: '',
  colorId: '',
  sizeId: '',
  brandId: '',
  // isFeatured: false,
  // isArchived: false,
}

export const ProductForm = ({
  asEdit,
  product,
  categories,
  sizes,
  colors,
  brands,
}: ProductFormProps) => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()
  const action = asEdit ? 'Modify the product' : 'Add the product'

  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const params = useParams()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues:
      asEdit && product
        ? {
            name: product.name,
            description: String(product?.description || 'No Description'),
            price: parseFloat(String(product?.price)),
            categoryId: String(product?.categoryId || ''),
            brandId: String(product?.brandId || ''),
            sizeId: String(product?.sizeId || ''),
            colorId: String(product?.colorId || ''),
            discount: parseFloat(String(product?.discount?.toFixed(2))),
            stock: parseFloat(String(product?.stock?.toFixed(2))),
          }
        : defaultValues,
  })

  const onSubmit = async (values: z.infer<typeof ProductSchema>) => {
    const addProductValues = {
      name: values.name,
      description: values.description,
      price: values.price,
      stock: values.stock,
      images: values.images,
      discount: values.discount,
      categoryId: values.categoryId,
      colorId: values.colorId,
      sizeId: values.sizeId,
      brandId: values.brandId,
      isFeatured: values.isFeatured,
      isArchived: values.isArchived,
      slug: values.slug,
    }

    if (asEdit && product) {
      const updateProductValues = {
        ...addProductValues,
        id: product.id,
      }

      await updateProduct(updateProductValues)
    } else {
      await addProduct(addProductValues)
    }

    // try to catch error from response action

    toast({
      title: asEdit ? 'Product modified' : 'Product added',
      description: asEdit
        ? 'Product successfully modified'
        : 'Product successfully added',
    })
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/products/${params.productId}`)
      router.refresh()
      router.push(`/dashboard/products`)
      // toast.success("Product deleted.");
    } catch (error: any) {
      //toast.error("Something went wrong.");
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={onDelete}
          loading={loading}
        />
        <div className="flex items-center justify-between">
          <Heading title={'title'} subtitle={'description'} />
          {/* {initialData && (
            <Button
              disabled={loading}
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)}
            >
              <LuTrash className="h-4 w-4" />
            </Button>
          )} */}
        </div>
        <Separator />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={
                        Array.isArray(field.value)
                          ? field.value.map((image) => image.url)
                          : []
                      }
                      //disabled={isPending}
                      onChange={(url) =>
                        field.onChange([
                          ...(Array.isArray(field.value) ? field.value : []),
                          { url },
                        ])
                      }
                      onRemove={(url) =>
                        field.onChange(
                          Array.isArray(field.value)
                            ? field.value.filter(
                                (current) => current.url !== url
                              )
                            : []
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SubmitButton pending={isPending}>
              {asEdit ? 'Modify the product' : 'Add the product'}
            </SubmitButton>

            <div className="md:grid md:grid-cols-3 gap-8">
              <InputForm
                control={form.control}
                name="name"
                label="Name"
                placeholder="Product Name"
                disabled={loading}
              />

              <InputForm
                control={form.control}
                name="price"
                label="Price"
                placeholder="9.99"
                type="number"
                disabled={loading}
              />

              <InputForm
                control={form.control}
                name="discount"
                label="Discount"
                placeholder="9.99"
                type="number"
                disabled={loading}
              />

              <InputForm
                control={form.control}
                name="stock"
                label="Stock"
                placeholder="10"
                type="number"
                disabled={loading}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        // disabled={isSubmitting}
                        placeholder="e.g. 'This course is about...'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sizeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a size"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizes.map((size) => (
                          <SelectItem key={size.id} value={size.id}>
                            {size.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a color"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem key={color.id} value={color.id}>
                            {color.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a brand"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        // @ts-ignore
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This product will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isArchived"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        // @ts-ignore
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Archived</FormLabel>
                      <FormDescription>
                        This product will not appear anywhere in the store.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            {/* <Button disabled={isPending} className="ml-auto" type="submit">
              {action}
            </Button> */}
            <SubmitButton pending={isPending}>
              {asEdit ? 'Modify the product' : 'Add the product'}
            </SubmitButton>
          </form>
        </Form>
      </div>
    </ScrollArea>
  )
}
