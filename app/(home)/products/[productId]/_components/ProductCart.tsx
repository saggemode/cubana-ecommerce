'use client'
import React from 'react'
import {
  MdAdd,
  MdRemove,
  MdAddShoppingCart,
  MdRemoveShoppingCart,
} from '@/assets/icons'
import { Loader, Minus, Plus } from 'lucide-react'
import { useState, useEffect, useTransition } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useCart from '@/hooks/use-cart'
import { setTransition } from '@/lib/transition'
//import { Button } from '@/components/ui/button2'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const ProductCart = ({ product }: any) => {
  const cart = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [quantity, setQuantity] = useState<number>(1)

  const existItem = cart && cart.cartItems.find((x) => x.item.id === product.id)
 
  return (
    <motion.div className="w-full shrink-[1.25] lg:max-w-none xl:max-w-xs">
      <motion.div
        className="flex flex-col gap-6 self-start overflow-hidden 
                   rounded-lg border border-border-primary p-4"
        animate={{ height: isPending ? 200 : quantity ? 183 : 133 }}
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-medium text-center">Buy product</h2>
          <hr />
        </div>
        {isPending ? (
          <div
            className="grid h-full grid-cols-2 gap-4 inner:animate-pulse 
                       inner:rounded-lg inner:bg-primary"
          >
            <div className="col-span-2" />
            <div />
            <div />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {existItem ? (
              <motion.div
                className="flex flex-col gap-4"
                {...setTransition({ direction: 'top', distance: 25 })}
                key={product.id}
              >
                <div className="flex items-center justify-center gap-1 inner:border-neutral-400">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        const res = await cart.decreaseQuantity(product.id)
                        toast({
                          variant: res.success ? 'default' : 'destructive',
                          description: res.message,
                        })
                        return
                      })
                    }}
                  >
                    {isPending ? (
                      <Loader className="w-4 h-4  animate-spin" />
                    ) : (
                      <Minus className="w-4 h-4" />
                    )}
                  </Button>
                  <input
                    className="flex-1 rounded-lg border bg-background px-1 py-1
                             text-center transition focus:ring-2 focus:ring-accent
                             focus:ring-offset-4 focus:ring-offset-background"
                    type="number"
                    min={1}
                    max={10_000}
                    value={existItem.quantity}
                    onChange={cart.handleProductQuantity(product.id)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        const res = await cart.increaseQuantity(product.id)
                        toast({
                          variant: res.success ? 'default' : 'destructive',
                          description: res.message,
                        })
                        return
                      })
                    }}
                  >
                    {isPending ? (
                      <Loader className="w-4 h-4  animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => {
                    startTransition(async () => {
                      const res = await cart.removeItem(product.id)
                      toast({
                        variant: res.success ? 'default' : 'destructive',
                        description: res.message,
                      })
                      return
                    })
                  }}
                >
                  {isPending ? (
                    <Loader className="w-4 h-4  animate-spin" />
                  ) : (
                    <MdRemoveShoppingCart className="w-4 h-4" />
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                {...setTransition({
                  direction: 'bottom',
                  distance: 25,
                })}
                key={quantity}
              >
                <Button
                  className="w-full"
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    startTransition(async () => {
                      const res = await cart.addItem({
                        item: product,
                        quantity,
                      })
                      toast({
                        variant: res.success ? 'default' : 'destructive',
                        description: res.message,
                      })
                      return

                      toast({
                        description: `${product.name} added to the cart`,
                        action: (
                          <ToastAction
                            className="bg-primary"
                            onClick={() => router.push('/cart')}
                            altText="Go to cart"
                          >
                            Go to cart
                          </ToastAction>
                        ),
                      })
                    })
                  }}
                >
                  {isPending ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <MdAddShoppingCart />
                  )}
                  Add to cart
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  )

  // return existItem ? (
  //   <div>
  //     <Button
  //       type="button"
  //       variant="outline"
  //       disabled={isPending}
  //       onClick={() => {
  //         startTransition(async () => {
  //           const res = await cart.removeItem(product.id)
  //         })
  //       }}
  //     >
  //       {isPending ? (
  //         <Loader className="w-4 h-4  animate-spin" />
  //       ) : (
  //         <Minus className="w-4 h-4" />
  //       )}
  //     </Button>
  //     <span className="px-2">{existItem.quantity}</span>
  //     <Button
  //       type="button"
  //       variant="outline"
  //       disabled={isPending}
  //       onClick={() => {
  //         startTransition(async () => {
  //           const res = await cart.increaseQuantity(product.id)
  //         })
  //       }}
  //     >
  //       {isPending ? (
  //         <Loader className="w-4 h-4 animate-spin" />
  //       ) : (
  //         <Plus className="w-4 h-4" />
  //       )}
  //     </Button>
  //   </div>
  // ) : (
  //   <Button
  //     className="w-full"
  //     type="button"
  //     disabled={isPending}
  //     onClick={() => {
  //       startTransition(async () => {
  //         const res = await onAddToCart()

  //         toast({
  //           description: `${product.name} added to the cart`,
  //           action: (
  //             <ToastAction
  //               className="bg-primary"
  //               onClick={() => router.push('/cart')}
  //               altText="Go to cart"
  //             >
  //               Go to cart
  //             </ToastAction>
  //           ),
  //         })
  //       })
  //     }}
  //   >
  //     {isPending ? <Loader className="animate-spin" /> : <Plus />}
  //     Add to cart
  //   </Button>
  // )
}

export default ProductCart

// 'use client'

// import {
//   MdAdd,
//   MdRemove,
//   MdAddShoppingCart,
//   MdRemoveShoppingCart,
// } from '@/assets/icons'
// import { useState, useEffect, useTransition } from 'react'
// import { AnimatePresence, motion } from 'framer-motion'
// import useCart from '@/hooks/use-cart'
// import { setTransition } from '@/lib/transition'
// import { Button } from '@/components/ui/button2'
// import { Button as uButton } from '@/components/ui/button'

// const ProductCart = ({ product }: any) => {
//   const cart = useCart()
//   const [isPending, startTransition] = useTransition()
//   const [loading, setLoading] = useState(true)
//   const [productQuantity, setProductQuantity] = useState(0)
//   const [quantity, setQuantity] = useState<number>(1)

//   const total = cart.cartItems.reduce(
//     (acc, cartItem) => acc + (cartItem.item.price ?? 0) * cartItem.quantity,
//     0
//   )
//   const totalRounded = parseFloat(total.toFixed(2))

//   useEffect(() => {
//     const timeoutId = setTimeout(() => setLoading(false), 500)
//     return () => clearTimeout(timeoutId)
//   }, [])

//   useEffect(() => {
//     setQuantity(quantity ?? 1)
//   }, [quantity])

//   const onAddToCart = () => {
//     // addToCart(product);
//     cart.addItem({
//       item: product,
//       quantity,
//     })
//   }

//   return (
//     <motion.div className="w-full shrink-[1.25] lg:max-w-none xl:max-w-xs">
//       <motion.div
//         className="flex flex-col gap-6 self-start overflow-hidden
//                    rounded-lg border border-border-primary p-4"
//         animate={{ height: loading ? 200 : quantity ? 183 : 133 }}
//       >
//         <div className="flex flex-col gap-2">
//           <h2 className="text-xl font-medium">Buy product</h2>
//           <hr />
//         </div>
//         {loading ? (
//           <div
//             className="grid h-full grid-cols-2 gap-4 inner:animate-pulse
//                        inner:rounded-lg inner:bg-primary"
//           >
//             <div className="col-span-2" />
//             <div />
//             <div />
//           </div>
//         ) : (
//           <AnimatePresence mode="wait">
//             {productQuantity ? (
//               <motion.div
//                 className="flex flex-col gap-4"
//                 {...setTransition({ direction: 'top', distance: 25 })}
//                 key={product.id}
//               >
//                 <div className="flex items-center justify-center gap-4 inner:border-neutral-400">
//                   <Button
//                     Icon={MdRemove}
//                     className="rounded-full border !p-1 text-sm"
//                     //onClick={() => cart.decreaseQuantity(product.id)}
//                     onClick={cart.handleProductQuantity(product.id, 'decrement')}
//                     disabled={totalRounded <= 1}
//                   />
//                   <input
//                     className="flex-1 rounded-lg border bg-background px-2 py-1
//                              text-center transition focus:ring-2 focus:ring-accent
//                              focus:ring-offset-4 focus:ring-offset-background"
//                     type="number"
//                     min={1}
//                     max={10_000}
//                     value={quantity}
//                     //onChange={cart.handleProductQuantity(id)}
//                     onClick={() => cart.handleProductQuantity(product.id)}
//                   />
//                   <Button
//                     Icon={MdAdd}
//                     className="rounded-full border !p-1 text-sm"
//                     onClick={() => cart.increaseQuantity(product.id)}
//                     //onClick={cart.handleProductQuantity(id, 'increment')}
//                     disabled={totalRounded >= 10_000}
//                   />
//                 </div>
//                 <Button
//                   Icon={MdRemoveShoppingCart}
//                   className="border border-neutral-400 text-sm"
//                   //onClick={deleteProduct(id)}
//                   onClick={() => cart.removeItem(product.id)}
//                   label="Remove from cart"
//                 />
//               </motion.div>
//             ) : (
//               <motion.div
//                 {...setTransition({
//                   direction: 'bottom',
//                   distance: 25,
//                 })}
//                 key={quantity}
//               >
//                 <Button
//                   Icon={MdAddShoppingCart}
//                   className="w-full border border-neutral-400 text-sm"
//                   onClick={onAddToCart}
//                   label="Add to cart"
//                 />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         )}
//       </motion.div>
//     </motion.div>
//   )
// }

// export default ProductCart
