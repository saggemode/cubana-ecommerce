'use client'

import { Popover, Transition } from '@/components/headlessui'
import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import ButtonSecondary from '@/shared/Button/ButtonSecondary'
import Image from 'next/image'
import { Trash } from 'lucide-react'
import Link from 'next/link'
import useCartService from '@/hooks/use-cart'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'
import Price from '@/components/price'
import { Product } from '@/types'
//import { Product } from '@/types'

export default function CartDropdown() {
  const { items, itemsPrice, decrease, increase, deleteItem } = useCartService()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [items, itemsPrice, decrease, increase])

  const totalRounded = parseFloat(itemsPrice.toFixed(2))

  if (!mounted) return <>Loading...</>

  const renderProduct = (cartItem: Product, index: any, close: () => void) => {
    console.log(cartItem.color)
    return (
      <div key={index} className="flex py-5 last:pb-0">
        <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            fill
            src={cartItem.images[0]?.url}
            alt={cartItem.name}
            className="h-full w-full object-contain object-center"
          />
          <Link
            onClick={close}
            className="absolute inset-0"
            href={`/products/${cartItem.id}`}
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium ">
                  <Link onClick={close} href={`/products/${cartItem.id}`}>
                    {cartItem.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>{cartItem.color?.name}</span>
                  <span className="mx-2 border-l border-slate-200 dark:border-slate-700 h-4"></span>
                  <span>{cartItem.size?.value}</span>
                </p>
              </div>
              <Price
                amount={
                  cartItem.price !== null ? cartItem.price.toString() : ''
                }
                className="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
              />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400">
              {cartItem.quantity}
            </p>

            <div className="flex">
              <Trash
                className="hover:text-red-1 cursor-pointer relative z-10 flex items-center mt-3 font-medium text-primary-6000 hover:text-primary-500 text-sm"
                onClick={() => deleteItem(cartItem.id)}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`
                ${open ? '' : 'text-opacity-90'}
                 group w-10 h-10 sm:w-12 sm:h-12 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 relative`}
          >
            <div className="w-3.5 h-3.5 flex items-center justify-center bg-primary-500 absolute top-1.5 right-1.5 rounded-full text-[10px] leading-none text-white font-medium">
              <span className="mt-[1px]">
                {items.length > 0 && (
                  <Badge className="ml-4">
                    {/* {items.reduce((a, c) => a + c.quantity, 0)} */}
                    {items.length}
                  </Badge>
                )}
              </span>
            </div>
            <ShoppingCart className="mr-1" />

            <Link className="block md:hidden absolute inset-0" href={'/cart'} />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="hidden md:block absolute z-10 w-screen max-w-xs sm:max-w-md px-4 mt-3.5 -right-28 sm:right-0 sm:px-0">
              <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                <div className="relative bg-white dark:bg-neutral-800">
                  <div className="max-h-[60vh] p-5 overflow-y-auto hiddenScrollbar">
                    <h3 className="text-xl font-semibold">Shopping cart</h3>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                      {items.length === 0 ? (
                        <p className="text-body-bold">No item in cart</p>
                      ) : (
                        items.map((cartItem, index) =>
                          renderProduct(cartItem, index, close)
                        )
                      )}
                    </div>
                  </div>
                  <div className="bg-neutral-50 dark:bg-slate-900 p-5">
                    <p className="flex justify-between font-semibold text-slate-900 dark:text-slate-100">
                      <span>
                        <span>Subtotal</span>
                        <span className="block text-sm text-slate-500 dark:text-slate-400 font-normal">
                          Shipping and taxes calculated at checkout.
                        </span>
                      </span>
                      <span className="">
                        {' '}
                        <Price
                          amount={
                            totalRounded !== null ? totalRounded.toString() : ''
                          }
                        />
                      </span>
                    </p>
                    <div className="flex space-x-2 mt-5">
                      <ButtonSecondary
                        href="/cart"
                        className="flex-1 border border-slate-200 dark:border-slate-700"
                        onClick={close}
                      >
                        View cart
                      </ButtonSecondary>
                      <ButtonPrimary
                        href="/checkout"
                        onClick={close}
                        className="flex-1"
                      >
                        Check out
                      </ButtonPrimary>
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
