'use client'

import { ShippingAddress } from '@/types'
//import { ShippingAddress } from '@prisma/client'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import { useTransition } from 'react'
import useCartService from '@/hooks/use-cart'
import CheckoutSteps from '@/components/checkout-steps'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader } from 'lucide-react'
import { shippingAddressSchema } from '@/schemas'
import { shippingAddressDefaultValues } from '@/constants/constant'
import { updateUserAddress } from '@/actions/services/userService'
import useCart from '@/hooks/use-cart'

export default function ShippingAddressForm({
  address,
}: {
  address: ShippingAddress | null
}) {
  const router = useRouter()

 const { saveShippingAddress, shippingAddress } = useCartService()


  const form = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,

  })
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()
  const onSubmit: SubmitHandler<ShippingAddress> = async (values) => {
    startTransition(async () => {
      const res = await updateUserAddress(values)
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
        return
      }

      // Cookies.set(
      //   'cart',
      //   JSON.stringify({ saveShippingAddress: { ...values } })
      // )

      saveShippingAddress(values)
      router.push('/payment-method')
    })
  }

  return (
    <>
      <CheckoutSteps current={1} />
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Please enter the address that you want to ship to
        </p>
        <Form {...form}>
          <form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }: { field: any }) => (
                  <FormItem className="w-full">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }: { field: any }) => (
                  <FormItem className="w-full">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="city"
                render={({ field }: { field: any }) => (
                  <FormItem className="w-full">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }: { field: any }) => (
                  <FormItem className="w-full">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }: { field: any }) => (
                  <FormItem className="w-full">
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter postal phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader className="animate-spin w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}




// 'use client'

// import { useRouter } from 'next/navigation'
// import { useEffect } from 'react'
// import { SubmitHandler, ValidationRule, useForm } from 'react-hook-form'
//  import { zodResolver } from '@hookform/resolvers/zod'
//  import { useToast } from '@/components/ui/use-toast'
// import CheckoutSteps from '@/components/checkout/CheckoutSteps'
// import useCartService from '@/hooks/use-cart'
// import { ShippingAddress } from '@prisma/client'
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { shippingAddressSchema } from '@/schemas'
//  import { shippingAddressDefaultValues } from '@/constants/constant'

// const ShippingForm = () => {
//   const router = useRouter()
//   const { saveShippingAddress, shippingAddress } = useCartService()

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors, isSubmitting },
//   } = useForm<ShippingAddress>({
//     defaultValues: {
//       fullName: '',
//       address: '',
//       city: '',
//       postalCode: '',
//       country: '',
//     },
//   })

//   useEffect(() => {
//     setValue('fullName', shippingAddress.fullName)
//     setValue('address', shippingAddress.address)
//     setValue('city', shippingAddress.city)
//     setValue('postalCode', shippingAddress.postalCode)
//     setValue('country', shippingAddress.country)
//   }, [setValue, shippingAddress])

//   const formSubmit: SubmitHandler<ShippingAddress> = async (form) => {
//     saveShippingAddress(form)
//     router.push('/payment-method')
//   }

//   const FormInput = ({
//     id,
//     name,
//     required,
//     pattern,
//   }: {
//     id: keyof ShippingAddress
//     name: string
//     required?: boolean
//     pattern?: ValidationRule<RegExp>
//   }) => (
//     <div className="mb-2">
//       <label className="label" htmlFor={id}>
//         {name}
//       </label>
//       <input
//         type="text"
//         id={id}
//         {...register(id, {
//           required: required && `${name} is required`,
//           pattern,
//         })}
//         className="input input-bordered w-full max-w-sm"
//       />
//       {errors[id]?.message && (
//         <div className="text-error">{errors[id]?.message}</div>
//       )}
//     </div>
//   )



//   return (
//     <div>
//       <CheckoutSteps current={1} />
//       <div className="card mx-auto my-4 max-w-sm bg-base-300">
//         <div className="card-body">
//           <h1 className="card-title">Shipping Address</h1>
//           <form onSubmit={handleSubmit(formSubmit)}>
//             <FormInput name="Full Name" id="fullName" required />
//             <FormInput name="Address" id="address" required />
//             <FormInput name="City" id="city" required />
//             <FormInput name="Postal Code" id="postalCode" required />
//             <FormInput name="Country" id="country" required />
//             <div className="my-2">
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="btn btn-primary w-full"
//               >
//                 {isSubmitting && <span className="loading loading-spinner" />}
//                 Next
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ShippingForm
