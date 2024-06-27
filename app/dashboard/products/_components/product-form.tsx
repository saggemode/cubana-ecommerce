'use client'

import * as z from 'zod'
import axios from 'axios'
import { useTransition, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { LuTrash } from 'react-icons/lu'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Category, Color, Image, Product, Size, Brand } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'

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
// import ProductService, {
//   ProductWithVariants,
// } from '@/actions/admins/services/productService'
import { addProduct, updateProduct } from '@/actions/admins/products'

interface ProductFormProps {
  initialData?:
    | (Product & {
        images: Image[]
      })
    | null
  categories: Category[]
  colors: Color[]
  sizes: Size[]
  brands: Brand[]
  productId?: string
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  sizes,
  colors,
  brands,

  productId,
}) => {
  const { toast } = useToast()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit product' : 'Create product'
  const description = initialData ? 'Edit a product.' : 'Add a new product'
  // const toastMessage = initialData ? 'Product updated.' : 'Product created.'
  const action = initialData ? 'Save changes' : 'Create'

  const defaultValues = initialData
    ? {
        ...initialData,
        price: parseFloat(String(initialData?.price)),
        description: String(initialData?.description || 'No Description'),
        categoryId: String(initialData?.categoryId || ''),
        brandId: String(initialData?.brandId || ''),
        sizeId: String(initialData?.sizeId || ''),
        colorId: String(initialData?.colorId || ''),
        discount: parseFloat(String(initialData?.discount?.toFixed(2))),
        stock: parseFloat(String(initialData?.stock?.toFixed(2))),
      }
    : {
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
        isFeatured: false,
        isArchived: false,
      }

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues,
  })

  // const onSubmit = async (values: z.infer<typeof ProductSchema>) => {
  //   try {
  //     setLoading(true)
  //     if (initialData) {
  //       await axios.patch(`/api/products/${productId}`, values)
  //     } else {
  //       await axios.post(`/api/products`, values)
  //     }
  //     router.refresh()
  //     router.push(`/dashboard/products`)
  //     toast.success(toastMessage)
  //   } catch (error: any) {
  //     toast.error('Something went wrong.')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const values = form.getValues()

  const onSubmit = async (values: z.infer<typeof ProductSchema>) => {
    setError('')
    setSuccess('')

    // console.log('clicked')

    startTransition(async () => {
      const addProductValues = {
        name: values.name,
        description: values.description,
        price: values.price,
        stock: values.stock,
        discount: values.discount,
        images: values.images,
        categoryId: values.categoryId,
        colorId: values.colorId,
        sizeId: values.sizeId,
        brandId: values.brandId,
        isFeatured: values.isFeatured,
        isArchived: values.isArchived,
      }

      if (initialData && productId) {
        const updateProductValues = {
          ...addProductValues,
          id: productId,
        }

        await updateProduct(updateProductValues)
      } else {
        await addProduct(addProductValues)
        //await ProductService.createProduct(addProductValues);
      }

      toast({
        title: initialData ? 'Product modified' : 'Product added',
        description: initialData
          ? 'Product successfully modified'
          : 'Product successfully added',
      })
    })
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/products/${params.productId}`)
      router.refresh()
      router.push(`/dashboard/products`)
      //toast.success('Product deleted.')
    } catch (error: any) {
      //toast.error('Something went wrong.')
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
          loading={isPending}
        />
        <div className="flex items-center justify-between">
          <Heading title={title} subtitle={description} />
          {initialData && (
            <Button
              disabled={isPending}
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)}
            >
              <LuTrash className="h-4 w-4" />
            </Button>
          )}
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
                      disabled={isPending}
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

            <div className="md:grid md:grid-cols-3 gap-8">
              <InputForm
                control={form.control}
                name="name"
                label="Name"
                placeholder="Product Name"
                disabled={isPending}
              />

              <InputForm
                control={form.control}
                name="price"
                label="Price"
                placeholder="9.99"
                type="number"
                disabled={isPending}
              />

              <InputForm
                control={form.control}
                name="discount"
                label="Discount"
                placeholder="9.99"
                type="number"
                disabled={isPending}
              />

              <InputForm
                control={form.control}
                name="stock"
                label="Stock"
                placeholder="10"
                type="number"
                disabled={isPending}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        disabled={isPending}
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
                      disabled={isPending}
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
                      disabled={isPending}
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
                      disabled={isPending}
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
                    <FormLabel>Brand</FormLabel>
                    <Select
                      disabled={isPending}
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
                        disabled={isPending}
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
                        disabled={isPending}
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
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} className="ml-auto" type="submit">
              {action}
            </Button>
          </form>
        </Form>
      </div>
    </ScrollArea>
  )
}
