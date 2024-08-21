import { toast } from 'react-hot-toast'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {  OrderItem } from '@/types'
import { ShippingAddress } from '@prisma/client'
import { round2 } from '@/lib/utils'

interface Cart {
  items: OrderItem[]
  itemsPrice: number
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  paymentMethod: string
  shippingAddress: ShippingAddress
}

const initialState: Cart = {
  items: [],

  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
  paymentMethod: '',

  shippingAddress: {
    id: '',
    orderId: '',
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  },
}

export const cartStore = create<Cart>()(
  persist(() => initialState, {
    name: 'cartStore',
  })
)

const useCartService = () => {
  const {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,
  } = cartStore()

  return {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,

    increase: (item: OrderItem) => {
      const exist = items.find((x) => x.id === item.id)

      const updatedCartItems = exist
        ? items.map((x) =>
            x.id === item.id
              ? { ...exist, quantity: (exist.quantity ?? 0) + 1 }
              : x
          )
        : [...items, { ...item, quantity: 1 }]

      const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
        calcPrice(updatedCartItems)
      cartStore.setState({
        items: updatedCartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    },

    decrease: (item: OrderItem) => {
      const exist = items.find((x) => x.id === item.id)
      if (!exist) return

      const updatedCartItems =
        (exist.quantity ?? 0) === 1
          ? items.filter((x) => x.id !== item.id)
          : items.map((x) =>
              x.id === item.id
                ? { ...exist, quantity: (exist.quantity ?? 0) - 1 }
                : x
            )

      const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
        calcPrice(updatedCartItems)
      cartStore.setState({
        items: updatedCartItems,
        itemsPrice,
        // shippingPrice,
        // taxPrice,
        totalPrice,
      })
    },

    deleteItem: (id: string) => {
      const updatedCartItems = items.filter((x) => x.id !== id)

      const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
        calcPrice(updatedCartItems)
      cartStore.setState({
        items: updatedCartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })

      toast.success('Item removed from cart')
    },

    getItemById: (id: string) => {
      return items.find((item) => item.id === id)
    },

    saveShippingAddress: (shippingAddress: ShippingAddress) => {
      cartStore.setState({
        shippingAddress,
      })
    },
    savePaymentMethod: (paymentMethod: string) => {
      cartStore.setState({
        paymentMethod,
      })
    },
    clear: () => {
      cartStore.setState({
        items: [],
      })
    },
    init: () => cartStore.setState(initialState),
  }
}

export default useCartService

export const calcPrice = (items: OrderItem[]) => {
  const itemsPrice = round2(
      items.reduce(
        (acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 0),
        0
      )
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 0),
    taxPrice = round2(Number(0 * itemsPrice)),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
  return { itemsPrice, shippingPrice, taxPrice, totalPrice }
}

// export const calcPrice = (items: OrderItem[]) => {
//   const itemsPrice = round2(
//       items.reduce((acc, item) => acc + item.price * (item.quantity ?? 0), 0)
//     ),
//     shippingPrice = round2(itemsPrice > 100 ? 0 : 0),
//     taxPrice = round2(Number(0 * itemsPrice)),
//     totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
//   return { itemsPrice, shippingPrice, taxPrice, totalPrice }
// }

// import { create } from 'zustand'
// import { toast } from 'react-hot-toast'
//import { Product } from '@/types'
// import type { ChangeEvent } from 'react'

// import { createSelectorHooks } from 'auto-zustand-selectors-hook'
// import { persist, createJSONStorage } from 'zustand/middleware'
// import { useWindowSize } from './useWindowSize'
// import prisma from '@/lib/prisma'
// import { OrderItem, ShippingAddress } from '@prisma/client'
// import { formatError } from '@/lib/utils'
// import { currentUser } from '@/lib/auth'
// import axios from 'axios'
// import Cookies from 'js-cookie'

// interface CartItem {
//   item: Product
//   quantity: number
//   color?: string
//   size?: string
//   price?: number
// }

// const initialState = {
//   cartItems: Cookies.get('cart')
//     ? JSON.parse(Cookies.get('cart') || '{}').cartItems
//     : [],
//   shippingAddress: Cookies.get('cart')
//     ? JSON.parse(Cookies.get('cart') || '{}').shippingAddress
//     : {},
//   paymentMethod: Cookies.get('cart')
//     ? JSON.parse(Cookies.get('cart') || '{}').paymentMethod
//     : '',
// }

// interface CartStore {
//   cartItems: CartItem[]
//   shippingAddress: object
//   paymentMethod: string
//   clearCart: () => void
//   resetCart: () => void
//   total: number
//   totalPrice: number
//   isMobile: boolean
//   getQuantityById: (id: string) => number | undefined
//   getTotalAmount: () => number
//   saveShippingAddress: (address: object) => void
//   savePaymentMethod: (method: string) => void
//   populate: (items: Product[], total: number) => void

//   paymentIntent: string
//   setPaymentIntent: (value: string) => void

//   toggleCart: () => void

//   isOpen: boolean

//   // addItem: (item: CartItem) => void
//   addItem: (item: CartItem) => Promise<{ success: boolean; message: string }>
//   // removeItem: (idToRemove: string) => void
//   removeItem: (
//     idToRemove: string
//   ) => Promise<{ success: boolean; message: string }>
//   increaseQuantity: (
//     idToIncrease: string
//   ) => Promise<{ success: boolean; message: string }>
//   decreaseQuantity: (
//     idToDecrease: string
//   ) => Promise<{ success: boolean; message: string }>

//   handleProductQuantity: (
//     productId: string,
//     type?: 'increment' | 'decrement'
//   ) => (e?: ChangeEvent<HTMLInputElement>) => void
// }

// const calcPrice = (items: CartItem[]) => {
//   const round2 = (num: number) => Math.round(num * 100) / 100
//   const itemsPrice = round2(
//     items.reduce((acc, item) => acc + (item.item.price ?? 0) * item.quantity, 0)
//   )
//   const shippingPrice = round2(itemsPrice > 100 ? 0 : 10)
//   const taxPrice = round2(0.15 * itemsPrice)
//   const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

//   return {
//     itemsPrice, // return as number
//     shippingPrice, // return as number
//     taxPrice, // return as number
//     totalPrice, // return as number
//   }
// }

// const useCartStoreBase = create(
//   persist<CartStore>(
//     (set, get) => ({
//       isOpen: false,
//       // cartItems: [],
//       totalPrice: 0,
//       total: 0,
//       isMobile: false,

//       cartItems: initialState.cartItems,
//       shippingAddress: initialState.shippingAddress,
//       paymentMethod: initialState.paymentMethod,

//       paymentIntent: '',
//       setPaymentIntent: (value) => set({ paymentIntent: value }),
//       toggleCart: () => set((state) => ({ ...state, isOpen: !state.isOpen })),

//       addItem: async (data: CartItem) => {
//         const { item, quantity, color, size } = data
//         const currentItems = get().cartItems

//         const isExisting = currentItems.find(
//           (cartItem) => cartItem.item.id === item.id
//         )

//         const updatedCartItems = isExisting
//           ? currentItems.map((item) =>
//               item.item.id === data.item.id ? data : item
//             )
//           : [...currentItems, data]

//         Cookies.set(
//           'cart',
//           JSON.stringify({ ...get(), cartItems: updatedCartItems })
//         )

//         if (isExisting) {
//           toast('Item already in cart')
//           return { success: false, message: 'Item already in cart' }
//         }

//         set({ cartItems: updatedCartItems })
//         set({ cartItems: [...currentItems, { item, quantity, color, size }] })
//         set({
//           ...calcPrice([...currentItems, { item, quantity, color, size }]),
//         })

//         Cookies.set(
//           'cart',
//           JSON.stringify({ ...get(), cartItems: currentItems })
//         )

//         //  await axios.post(`/api/cart`, {
//         //    data: { cartItems: updatedCartItems },
//         //  })
//         toast.success('Item added to cart', { icon: '🛒' })
//         return { success: true, message: 'Item added to cart' }
//       },

//       removeItem: async (idToRemove: String) => {
//         const newCartItems = get().cartItems.filter(
//           (cartItem) => cartItem.item.id !== idToRemove
//         )
//         Cookies.set(
//           'cart',
//           JSON.stringify({ ...get(), cartItems: newCartItems })
//         )
//         set({ cartItems: newCartItems })
//         toast.success('Item removed from cart')
//         set({ ...calcPrice(newCartItems) })
//         return { success: true, message: 'Item removed from cart' }
//       },

//       increaseQuantity: async (idToIncrease: String) => {
//         const newCartItems = get().cartItems.map((cartItem) =>
//           cartItem.item.id === idToIncrease
//             ? { ...cartItem, quantity: cartItem.quantity + 1 }
//             : cartItem
//         )
//         Cookies.set(
//           'cart',
//           JSON.stringify({ ...get(), cartItems: newCartItems })
//         )
//         set({ cartItems: newCartItems })
//         set({ ...calcPrice(newCartItems) })
//         //toast.success('Item quantity increased')
//         return { success: true, message: 'Item quantity increased' }
//       },

//       decreaseQuantity: async (idToDecrease: string) => {
//         const newCartItems = get().cartItems.map((cartItem) =>
//           cartItem.item.id === idToDecrease && cartItem.quantity > 1
//             ? { ...cartItem, quantity: cartItem.quantity - 1 }
//             : cartItem
//         )
//         Cookies.set(
//           'cart',
//           JSON.stringify({ ...get(), cartItems: newCartItems })
//         )
//         set({ cartItems: newCartItems })
//         set({ ...calcPrice(newCartItems) })
//         // toast.success('Item quantity decreased')
//         return { success: true, message: 'Item quantity decreased' }
//       },

//       // this is the testing type
//       handleProductQuantity:
//         (productId: string, type?: 'increment' | 'decrement') =>
//         (e?: ChangeEvent<HTMLInputElement>) => {
//           let inputValue = !type
//             ? parseInt(e?.target.value as string, 10)
//             : null
//           if (!type && !inputValue) inputValue = 1
//           else if (inputValue && inputValue >= 10_000) inputValue = 10_000

//           const newCartItems = get().cartItems.map((cartItem) =>
//             cartItem.item.id === productId
//               ? {
//                   ...cartItem,
//                   quantity:
//                     inputValue ??
//                     (type === 'increment'
//                       ? cartItem.quantity + 1
//                       : cartItem.quantity - 1),
//                 }
//               : cartItem
//           )
//           set({ cartItems: newCartItems })
//           set({ ...calcPrice(newCartItems) })
//         },

//       getTotalAmount: () => {
//         const { cartItems } = get()
//         const totalPrice = cartItems.reduce((acc, cartItem) => {
//           return acc + Number(cartItem.item.price ?? 0) * cartItem.quantity
//         }, 0)
//         return totalPrice
//       },

//       getQuantityById: (id: string) => {
//         // Find the product in the cart
//         const product = get().cartItems.find(
//           (product) => product.item.id === id
//         )

//         // If the product is found, return its quantity; otherwise, return undefined
//         return product ? product.quantity : undefined
//       },

//       populate: (items, total) => {
//         set((state) => ({ ...state, items, total }))
//       },

//       totalProductInCarts() {
//         return get().cartItems.length
//       },

//       saveShippingAddress: (address: object) => {
//         const { cartItems, paymentMethod } = get()
//         const updatedState = {
//           cartItems,
//           shippingAddress: address,
//           paymentMethod,
//         }
//         Cookies.set('cart', JSON.stringify(updatedState))
//         set({ shippingAddress: address })
//         toast.success('Shipping address saved')
//       },

//       savePaymentMethod: (method: string) => {
//         const { cartItems, shippingAddress } = get()
//         const updatedState = {
//           cartItems,
//           shippingAddress,
//           paymentMethod: method,
//         }
//         Cookies.set('cart', JSON.stringify(updatedState))
//         set({ paymentMethod: method })
//         toast.success('Payment method saved')
//       },

//       clearCart: () => {
//         const clearedCart = {
//           cartItems: [],
//           shippingAddress: get().shippingAddress,
//           paymentMethod: get().paymentMethod,
//         }
//         Cookies.set('cart', JSON.stringify(clearedCart))
//         set({ cartItems: [], paymentIntent: '' })
//         toast.success('Cart cleared')
//       },

//       resetCart: () => {
//         const resetState = {
//           cartItems: [],
//           shippingAddress: { location: {} },
//           paymentMethod: '',
//         }
//         Cookies.set('cart', JSON.stringify(resetState))
//         set(resetState)
//       },
//     }),
//     {
//       name: 'cart-storage',
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// )
// const useCart = createSelectorHooks(useCartStoreBase)
// export default useCart
