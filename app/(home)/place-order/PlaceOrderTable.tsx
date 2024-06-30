'use client'

import useCart from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { MinusCircle, PlusCircle, Trash } from 'lucide-react'
import Price from '@/components/price'

import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Image from 'next/image'
import Link from 'next/link'

const PlaceOrderTable = () => {
  const cart = useCart()
  // const items = useCart.useCartItems
  const { removeItem, increaseQuantity, decreaseQuantity } = useCart()

  const total = cart.cartItems.reduce(
    (acc, cartItem) => acc + (cartItem.item.price ?? 0) * cartItem.quantity,
    0
  )
  const totalRounded = parseFloat(total.toFixed(2))

  return (
    <Card>
      <CardContent className="p-4 gap-4">
        <h2 className="text-xl pb-4">Order Items</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.cartItems.map((cartItem, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Link
                    href={`/products/${cartItem.item.id}`}
                    className="flex items-center"
                  >
                    <div className="flex items-center">
                      <Image
                        src={cartItem.item.images[0].url}
                        width={50}
                        height={50}
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
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="px-2">
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
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Trash
                    className="hover:text-red-1 cursor-pointer"
                    onClick={() => removeItem(cartItem.item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Link href="/cart">
          <Button variant="outline">Edit</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default PlaceOrderTable
