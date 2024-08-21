'use client'

import React, { useEffect, useState } from 'react'
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
import useCartService from '@/hooks/use-cart'
import { useRouter } from 'next/navigation'

const PlaceOrderTable = () => {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { items, itemsPrice } = useCartService()

  useEffect(() => {
    setMounted(true)
  }, [items, itemsPrice])

  const totalRounded = parseFloat(itemsPrice.toFixed(2))

  if (!mounted) return <>Loading...</>

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
            {items.map((cartItem, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Link
                    href={`/products/${cartItem.id}`}
                    className="flex items-center"
                  >
                    <div className="flex items-center">
                      <Image
                        src={cartItem.images[0].url}
                        width={50}
                        height={50}
                        className="rounded-lg w-32 h-32 object-cover"
                        alt="product"
                      />
                      <div className="flex flex-col gap-3 ml-4">
                        <p className="text-body-bold">{cartItem.name}</p>
                        {/* {cartItem.color && (
                      <p className="text-small-medium">{cartItem.color}</p>
                    )}
                    {cartItem.size && (
                      <p className="text-small-medium">{cartItem.size}</p>
                    )} */}
                        {/* <p className="text-small-medium">${cartItem.item.price}</p> */}

                        <p></p>
                      </div>
                    </div>
                  </Link>
                </TableCell>

                <TableCell>{cartItem.quantity}</TableCell>
                <TableCell>
                  <Price
                    amount={
                      cartItem.price !== null ? cartItem.price.toString() : ''
                    }
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
