'use client'

import useCart from '@/hooks/use-cart'
import Price from '@/components/price'
// import { useUser } from '@clerk/nextjs'
import { MinusCircle, PlusCircle, Trash } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const Cart = () => {
  const router = useRouter()
  // const { user } = useUser()
  const cart = useCart()
  // const items = useCart.useCartItems
  const { removeItem, increaseQuantity, decreaseQuantity } = useCart()

  const total = cart.cartItems.reduce(
    (acc, cartItem) => acc + (cartItem.item.price ?? 0) * cartItem.quantity,
    0
  )
  const totalRounded = parseFloat(total.toFixed(2))

  const handleCheckout = async () => {
    router.push('/shipping-address')
    // try {
    //   if (!user) {
    //     router.push('sign-in')
    //   } else {
    //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
    //       method: 'POST',
    //       body: JSON.stringify({ cartItems: cart.cartItems, customer }),
    //     })
    //     const data = await res.json()
    //     window.location.href = data.url
    //     console.log(data)
    //   }
    // } catch (err) {
    //   console.log('[checkout_POST]', err)
    // }
  }

  return (
    <div className="flex gap-20 py-16 px-10 max-lg:flex-col max-sm:px-3">
      <div className="w-2/3 max-lg:w-full">
        <p className="text-heading3-bold">Shopping Cart</p>
        <hr className="my-6" />

        {cart.cartItems.length === 0 ? (
          <p className="text-body-bold">No item in cart</p>
        ) : (
          <div>
            {cart.cartItems.map((cartItem, index) => (
              <div
                key={index}
                className="w-full flex max-sm:flex-col max-sm:gap-3 hover:bg-grey-1 px-4 py-3 items-center max-sm:items-start justify-between"
              >
                <div className="flex items-center">
                  <Image
                    src={cartItem.item.images[0].url}
                    width={100}
                    height={100}
                    className="rounded-lg w-32 h-32 object-cover"
                    alt="product"
                  />
                  <div className="flex flex-col gap-3 ml-4">
                    <p className="text-body-bold">{cartItem.item.name}</p>
                    {/* {cartItem.color && (
                      <p className="text-small-medium">{cartItem.color}</p>
                    )}
                    {cartItem.size && (
                      <p className="text-small-medium">{cartItem.size}</p>
                    )} */}
                    {/* <p className="text-small-medium">${cartItem.item.price}</p> */}

                    <p>
                      <Price
                        amount={
                          cartItem.item.price !== null
                            ? cartItem.item.price.toString()
                            : ''
                        }
                      />
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <MinusCircle
                    className="hover:text-red-1 cursor-pointer"
                    onClick={() => decreaseQuantity(cartItem.item.id)}
                  />
                  <p className="text-body-bold">{cartItem.quantity}</p>
                  <PlusCircle
                    className="hover:text-red-1 cursor-pointer"
                    onClick={() => increaseQuantity(cartItem.item.id)}
                  />
                </div>

                <Trash
                  className="hover:text-red-1 cursor-pointer"
                  onClick={() => removeItem(cartItem.item.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-1/3 max-lg:w-full flex flex-col gap-8 bg-grey-1 rounded-lg px-4 py-5">
        <p className="text-heading4-bold pb-4">
          Summary{' '}
          <span>{`(${cart.cartItems.length} ${
            cart.cartItems.length > 1 ? 'items' : 'item'
          })`}</span>
        </p>
        <div className="flex justify-between text-body-semibold">
          <span>Total Amount</span>
          {/* <span>$ {totalRounded}</span> */}
          <span>
            <Price
              amount={totalRounded !== null ? totalRounded.toString() : ''}
            />
          </span>
        </div>

        <Button
          onClick={handleCheckout}
          //disabled={items.length === 0 || !authenticated}
          className="w-full"
        >
          Checkout
        </Button>
      </div>
    </div>
  )
}

export default Cart
