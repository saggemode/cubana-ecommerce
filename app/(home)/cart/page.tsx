'use client'

import React, { useEffect, useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { Trash } from 'lucide-react'
import useCartService from '@/hooks/use-cart'
import Image from 'next/image'
import Link from 'next/link'
import Price from '@/components/price'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'

const CartPage = () => {
  const { items, itemsPrice, decrease, increase, deleteItem } = useCartService()
  
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [items, itemsPrice, decrease, increase])

  const totalRounded = parseFloat(itemsPrice.toFixed(2))

  if (!mounted) return <>Loading...</>

  const handleCheckout = async () => {
    router.push('/shipping-address')
  }

  const renderProduct = (cartItem: any, index: any) => {
    return (
      <div className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0">
        <React.Fragment key={index}>
          <div className="relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <Image
              fill
              src={cartItem.images[0]?.url}
              alt={cartItem.name}
              sizes="300px"
              className="h-full w-full object-contain object-center"
            />
            <Link
              href={`/products/${cartItem.id}`}
              className="absolute inset-0"
            ></Link>
          </div>

          <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
            <div>
              <div className="flex justify-between ">
                <div className="flex-[1.5] ">
                  <h3 className="text-base font-semibold">
                    <Link href={`/products/${cartItem.id}`}>
                      {cartItem.name}
                    </Link>
                  </h3>
                  <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center space-x-1.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M7.01 18.0001L3 13.9901C1.66 12.6501 1.66 11.32 3 9.98004L9.68 3.30005L17.03 10.6501C17.4 11.0201 17.4 11.6201 17.03 11.9901L11.01 18.0101C9.69 19.3301 8.35 19.3301 7.01 18.0001Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8.35 1.94995L9.69 3.28992"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.07 11.92L17.19 11.26"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 22H16"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.85 15C18.85 15 17 17.01 17 18.24C17 19.26 17.83 20.09 18.85 20.09C19.87 20.09 20.7 19.26 20.7 18.24C20.7 17.01 18.85 15 18.85 15Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <span>{cartItem.color?.name}</span>
                    </div>
                    <span className="mx-4 border-l border-slate-200 dark:border-slate-700 "></span>
                    <div className="flex items-center space-x-1.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M21 9V3H15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 15V21H9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 3L13.5 10.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10.5 13.5L3 21"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <span>{cartItem.size?.value}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between w-full sm:hidden relative">
                    <select
                      name="qty"
                      id="qty"
                      className="form-select text-sm rounded-md py-1 border-slate-200 dark:border-slate-700 relative z-10 dark:bg-slate-800 "
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                    </select>

                    <Price
                      amount={
                        cartItem.price !== null ? cartItem.price.toString() : ''
                      }
                      className="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                    />
                  </div>
                </div>

                <div className="hidden sm:block text-center relative">
                  <div className="flex gap-4 items-center">
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center border border-neutral-400 dark:border-neutral-500 bg-white dark:bg-neutral-900 focus:outline-none hover:border-neutral-700 dark:hover:border-neutral-400 disabled:hover:border-neutral-400 dark:disabled:hover:border-neutral-500 disabled:opacity-50 disabled:cursor-default"
                      type="button"
                      onClick={() => decrease(cartItem)}
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>

                    <p className="text-body-bold">{cartItem.quantity}</p>

                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center border border-neutral-400 dark:border-neutral-500 bg-white dark:bg-neutral-900 focus:outline-none hover:border-neutral-700 dark:hover:border-neutral-400 disabled:hover:border-neutral-400 dark:disabled:hover:border-neutral-500 disabled:opacity-50 disabled:cursor-default"
                      type="button"
                      onClick={() => increase(cartItem)}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="hidden flex-1 sm:flex justify-end">
                  <Price
                    amount={
                      cartItem.price !== null ? cartItem.price.toString() : ''
                    }
                    className="mt-0.5"
                  />
                </div>
              </div>
            </div>

            <div className="flex mt-auto pt-4 items-end justify-between text-sm">
              <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <CheckIcon className="w-3.5 h-3.5" />
                <span className="ml-1 leading-none">{cartItem.stock}</span>
              </div>

              <Trash
                className="hover:text-red-1 cursor-pointer relative z-10 flex items-center mt-3 font-medium text-primary-6000 hover:text-primary-500 text-sm"
                onClick={() => deleteItem(cartItem.id)}
              />
            </div>
          </div>
        </React.Fragment>
      </div>
    )
  }

  return (
    <div className="nc-CartPage">
      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-12 sm:mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
            Shopping Cart
          </h2>
          <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400">
            <Link href={'/'} className="">
              Homepage
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <Link href={'/collection'} className="">
              Clothing Categories
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <span className="underline">Shopping Cart</span>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700 my-10 xl:my-12" />

        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-[60%] xl:w-[55%] divide-y divide-slate-200 dark:divide-slate-700 ">
            {items.length === 0 ? (
              <p className="text-body-bold">No item in cart</p>
            ) : (
              items.map((cartItem, index) => renderProduct(cartItem, index))
             
            )}
          </div>
          <div className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0"></div>
          <div className="flex-1">
            <div className="sticky top-28">
              <h3 className="text-lg font-semibold ">Order Summary</h3>
              <span>{`(${items.length} ${
                items.length > 1 ? 'items' : 'item'
              })`}</span>
              <div className="mt-7 text-sm text-slate-500 dark:text-slate-400 divide-y divide-slate-200/70 dark:divide-slate-700/80">
                <div className="flex justify-between pb-4">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    $249.00
                  </span>
                </div>
                <div className="flex justify-between py-4">
                  <span>Shpping estimate</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    $5.00
                  </span>
                </div>
                <div className="flex justify-between py-4">
                  <span>Tax estimate</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    $24.90
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                  <span>Order total</span>
                  <span>
                    <Price
                      amount={
                        totalRounded !== null ? totalRounded.toString() : ''
                      }
                    />
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                //disabled={items..length === 0 || !authenticated}
                className="w-full mt-8"
              >
                Checkout
              </Button>
              <div className="mt-5 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center">
                <p className="block relative pl-5">
                  <svg
                    className="w-4 h-4 absolute -left-1 top-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 8V13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.9945 16H12.0035"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Learn more{` `}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="##"
                    className="text-slate-900 dark:text-slate-200 underline font-medium"
                  >
                    Taxes
                  </a>
                  <span>
                    {` `}and{` `}
                  </span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="##"
                    className="text-slate-900 dark:text-slate-200 underline font-medium"
                  >
                    Shipping
                  </a>
                  {` `} infomation
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CartPage
