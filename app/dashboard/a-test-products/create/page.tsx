'use client'

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import Heading from '@/components/Heading'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { InputForm } from '@/components/ui/input-form'

const ProductSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),

  //slug: z.string().min(1),
  stock: z.coerce.number().min(1),
  description: z.string().min(1),
  discount: z.coerce.number().optional(),
  price: z.coerce.number().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
})

const CreatePage = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      discount: 0,
      stock: 0,
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof ProductSchema>) => {
    try {
      const response = await axios.post('/api/products', values)
      router.push(`/dashboard/products/${response.data.id}`)
      toast.success('Products created')
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading title={'Create product'} subtitle={'Add a new product'} />
        </div>
        <Separator />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <InputForm
              control={form.control}
              name="name"
              label="Name"
              placeholder="Product Name"
              disabled={isSubmitting}
            />

            <InputForm
              control={form.control}
              name="price"
              label="Price"
              placeholder="9.99"
              type="number"
              disabled={isSubmitting}
            />

            <InputForm
              control={form.control}
              name="discount"
              label="Discount"
              placeholder="9.99"
              type="number"
              disabled={isSubmitting}
            />

            <InputForm
              control={form.control}
              name="stock"
              label="Stock"
              placeholder="10"
              type="number"
              disabled={isSubmitting}
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
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ScrollArea>
  )
}

export default CreatePage
