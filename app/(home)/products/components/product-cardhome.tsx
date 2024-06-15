'use client'
import { useState, useEffect, MouseEvent, useTransition } from 'react'
import Image from 'next/image'
import {
  RiStarSFill,
  MdAddShoppingCart,
  MdRemoveShoppingCart,
} from '@/assets/icons'
import { Loader, Minus, Plus } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useCart from '@/hooks/use-cart'
import { Product } from '@/types'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import Link from 'next/link'
import { ImageLoader } from '@/components/ui/image-loader'
import { delayScroll } from '@/lib/scroll'
import { useRouter } from 'next/navigation'
import Price from '@/components/price'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  productData: Product
}

const ProductCardHome: React.FC<ProductCardProps> = ({ productData }) => {
  const cart = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [quantity, setQuantity] = useState<number>(1)

  const existItem =
    cart && cart.cartItems.find((x) => x.item.id === productData.id)

  const handleClick = () => {
    router.push(`/products/${productData?.id}`)
  }

  //    const [productQuantity, setProductQuantity] = useState(0)

  //    useEffect(() => {
  //      setProductQuantity(quantity ?? 0)
  //    }, [quantity])

  //    const { label, Icon, onClick } = productQuantity
  //      ? {
  //          label: 'Remove',
  //          Icon: MdRemoveShoppingCart,
  //          onClick: cart.removeItem(productData.id),
  //        }
  //      : {
  //          label: 'Add',
  //          Icon: MdAddShoppingCart,
  //          onClick: cart.addItem({
  //            item: productData,
  //            quantity,
  //          }),
  //        }

  //    const handleClick = (e?: React.MouseEvent<HTMLButtonElement>): void => {
  //      e?.stopPropagation()
  //      e?.preventDefault()
  //      onClick()
  //    }

  return (
    <>
      {/* <Link href={`/products/${productData.id}`} scroll={false} legacyBehavior> */}
      <div
        className="tab group relative rounded-lg ring-2 ring-border-primary
                   transition duration-300 hover:ring hover:ring-accent"
      >
        <div className="transition duration-300 group-hover:brightness-90 group-focus-visible:brightness-90">
          <ImageLoader
            divStyle="flex h-[230px] items-center justify-center rounded-t-lg "
            imageStyle="!p-4"
            src={productData.images?.[0]?.url}
            alt={productData.name}
            objectFit="fill"
            onClick={handleClick}
          />
        </div>
        <div className="flex flex-col gap-1 p-2" onClick={handleClick}>
          <div>
            <p
              className="overflow-hidden text-ellipsis [display:-webkit-box]
                         [-webkit-line-clamp:2] [-webkit-box-orient:vertical]"
            >
              {productData.name}
            </p>
            <p className="font-bold">
              {' '}
              {productData?.isFeatured ? (
                <Price
                  amount={
                    productData?.price !== null
                      ? productData.price.toString()
                      : ''
                  }
                />
              ) : (
                <Badge variant="secondary">Out of stock</Badge>
              )}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-sm font-light">
              <i className="text-yellow-400">
                <RiStarSFill />
              </i>{' '}
              {'rate'} | Sold {'7'}
            </p>
          </div>
        </div>
        <div className="absolute bottom-2 right-2">
          {existItem ? (
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const res = await cart.removeItem(productData.id)
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
          ) : (
            <Button
              className="w-full"
              type="button"
              disabled={isPending || !productData?.isFeatured}
              onClick={() => {
                startTransition(async () => {
                  const res = await cart.addItem({
                    item: productData,
                    quantity,
                  })

                  toast({
                    variant: res.success ? 'default' : 'destructive',
                    description: res.message,
                  })
                  return
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
          )}
          {/* <Button
            className="border border-transparent text-sm group-hover:border-border-secondary"
            label={label}
            Icon={Icon}
            onClick={handleClick}
          /> */}
        </div>
      </div>
    </>
  )
}

export default ProductCardHome
