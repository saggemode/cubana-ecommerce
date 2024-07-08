import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import { Product } from '@/types'
import type { ChangeEvent } from 'react'
import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useWindowSize } from './useWindowSize'

interface CartItem {
  item: Product
  quantity: number
  color?: string
  size?: string
}

interface CartStore {
  cartItems: CartItem[]
  // addItem: (item: CartItem) => void
  addItem: (item: CartItem) => Promise<{ success: boolean; message: string }>
  // removeItem: (idToRemove: string) => void
  removeItem: (
    idToRemove: string
  ) => Promise<{ success: boolean; message: string }>
  increaseQuantity: (
    idToIncrease: string
  ) => Promise<{ success: boolean; message: string }>
  decreaseQuantity: (
    idToDecrease: string
  ) => Promise<{ success: boolean; message: string }>

  clearCart: () => void
  total: number
  totalPrice: number
  isMobile: boolean
  handleProductQuantity: (
    productId: string,
    type?: 'increment' | 'decrement'
  ) => (e?: ChangeEvent<HTMLInputElement>) => void

  populate: (items: Product[], total: number) => void
  getQuantityById: (id: string) => number | undefined // New metho
  getTotalAmount: () => number // New method

  paymentIntent: string
  setPaymentIntent: (value: string) => void

  toggleCart: () => void

  isOpen: boolean
}

const calcPrice = (items: CartItem[]) => {
  const round2 = (num: number) => Math.round(num * 100) / 100
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + (item.item.price ?? 0) * item.quantity, 0)
  )
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10)
  const taxPrice = round2(0.15 * itemsPrice)
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

  return {
    itemsPrice, // return as number
    shippingPrice, // return as number
    taxPrice, // return as number
    totalPrice, // return as number
  }
}

const useCartStoreBase = create(
  persist<CartStore>(
    (set, get) => ({
      isOpen: false,
      cartItems: [],
      totalPrice: 0,
      total: 0,
      isMobile: false,

      paymentIntent: '',
      setPaymentIntent: (value) => set({ paymentIntent: value }),
      toggleCart: () => set((state) => ({ ...state, isOpen: !state.isOpen })),
      addItem: async (data: CartItem) => {
        const { item, quantity, color, size } = data
        const currentItems = get().cartItems
        const isExisting = currentItems.find(
          (cartItem) => cartItem.item.id === item.id
        )

        if (isExisting) {
          toast('Item already in cart')
          return { success: false, message: 'Item already in cart' }
        }

        set({ cartItems: [...currentItems, { item, quantity, color, size }] })
        set({
          ...calcPrice([...currentItems, { item, quantity, color, size }]),
        })
        toast.success('Item added to cart', { icon: '🛒' })
        return { success: true, message: 'Item added to cart' }
      },

      removeItem: async (idToRemove: String) => {
        const newCartItems = get().cartItems.filter(
          (cartItem) => cartItem.item.id !== idToRemove
        )
        set({ cartItems: newCartItems })
        toast.success('Item removed from cart')
        set({ ...calcPrice(newCartItems) })
        return { success: true, message: 'Item removed from cart' }
      },

      increaseQuantity: async (idToIncrease: String) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.item.id === idToIncrease
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
        set({ cartItems: newCartItems })
        set({ ...calcPrice(newCartItems) })
        //toast.success('Item quantity increased')
        return { success: true, message: 'Item quantity increased' }
      },

      decreaseQuantity: async (idToDecrease: string) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.item.id === idToDecrease && cartItem.quantity > 1
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        set({ cartItems: newCartItems })
        set({ ...calcPrice(newCartItems) })
        // toast.success('Item quantity decreased')
        return { success: true, message: 'Item quantity decreased' }
      },

      // this is the testing type
      handleProductQuantity:
        (productId: string, type?: 'increment' | 'decrement') =>
        (e?: ChangeEvent<HTMLInputElement>) => {
          let inputValue = !type
            ? parseInt(e?.target.value as string, 10)
            : null
          if (!type && !inputValue) inputValue = 1
          else if (inputValue && inputValue >= 10_000) inputValue = 10_000

          const newCartItems = get().cartItems.map((cartItem) =>
            cartItem.item.id === productId
              ? {
                  ...cartItem,
                  quantity:
                    inputValue ??
                    (type === 'increment'
                      ? cartItem.quantity + 1
                      : cartItem.quantity - 1),
                }
              : cartItem
          )
          set({ cartItems: newCartItems })
          set({ ...calcPrice(newCartItems) })
        },

      getTotalAmount: () => {
        const { cartItems } = get()
        const totalPrice = cartItems.reduce((acc, cartItem) => {
          return acc + Number(cartItem.item.price ?? 0) * cartItem.quantity
        }, 0)
        return totalPrice
      },

      getQuantityById: (id: string) => {
        // Find the product in the cart
        const product = get().cartItems.find(
          (product) => product.item.id === id
        )

        // If the product is found, return its quantity; otherwise, return undefined
        return product ? product.quantity : undefined
      },

      populate: (items, total) => {
        set((state) => ({ ...state, items, total }))
      },

      totalProductInCarts() {
        return get().cartItems.length
      },

      clearCart: () => set({ cartItems: [], paymentIntent: '' }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
const useCart = createSelectorHooks(useCartStoreBase)
export default useCart

// 'use client'

//.................1...........................

// import { create } from 'zustand'
// import { toast } from 'react-hot-toast'
// import { Product } from '@/types'
// import type { ChangeEvent } from 'react'
// import { createSelectorHooks } from 'auto-zustand-selectors-hook'
// import { persist, createJSONStorage } from 'zustand/middleware'

// interface CartItem {
//   item: Product
//   quantity: number
//   color?: string
//   size?: string
// }

// interface CartStore {
//   cartItems: CartItem[]
//   addItem: (item: CartItem) => Promise<{ success: boolean; message: string }>
//   removeItem: (
//     idToRemove: string
//   ) => Promise<{ success: boolean; message: string }>
//   increaseQuantity: (
//     idToIncrease: string
//   ) => Promise<{ success: boolean; message: string }>
//   decreaseQuantity: (
//     idToDecrease: string
//   ) => Promise<{ success: boolean; message: string }>

//   clearCart: () => void
//   total: number
//   totalPrice: number
//   isMobile: boolean
//   handleProductQuantity: (
//     productId: string,
//     type?: 'increment' | 'decrement'
//   ) => (e?: ChangeEvent<HTMLInputElement>) => void

//   populate: (items: Product[], total: number) => void
//   getQuantityById: (id: string) => number | undefined // New metho
//   getTotalAmount: () => number // New method

//   paymentIntent: string
//   setPaymentIntent: (value: string) => void

//   toggleCart: () => void

//   isOpen: boolean
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
//       cartItems: [],
//       totalPrice: 0,
//       total: 0,
//       isMobile: false,

//       paymentIntent: '',
//       setPaymentIntent: (value) => set({ paymentIntent: value }),
//       toggleCart: () => set((state) => ({ ...state, isOpen: !state.isOpen })),
//       addItem: async (data: CartItem) => {
//         const { item, quantity, color, size } = data
//         const currentItems = get().cartItems
//         const isExisting = currentItems.find(
//           (cartItem) => cartItem.item.id === item.id
//         )

//         if (isExisting) {
//           toast('Item already in cart')
//           return { success: false, message: 'Item already in cart' }
//         }

//         set({ cartItems: [...currentItems, { item, quantity, color, size }] })
//         set({
//           ...calcPrice([...currentItems, { item, quantity, color, size }]),
//         })
//         toast.success('Item added to cart', { icon: '🛒' })
//         return { success: true, message: 'Item added to cart' }
//       },

//       removeItem: async (idToRemove: String) => {
//         const newCartItems = get().cartItems.filter(
//           (cartItem) => cartItem.item.id !== idToRemove
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

//       clearCart: () => set({ cartItems: [], paymentIntent: '' }),
//     }),
//     {
//       name: 'cart-storage',
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// )
// const useCart = createSelectorHooks(useCartStoreBase)
// export default useCart

//.................2...........................

// import { create } from 'zustand'
// import { toast } from 'react-hot-toast'
// import { Product } from '@/types'
// import type { ChangeEvent } from 'react'
// import { createSelectorHooks } from 'auto-zustand-selectors-hook'
// import { persist, createJSONStorage } from 'zustand/middleware'

// interface CartItem {
//   id: string
//   item: Product
//   quantity: number
//   color?: string
//   size?: string
// }

// interface CartStore {
//   id: string
//   cartItems: CartItem[]
//   addItem: (item: CartItem) => Promise<{ success: boolean; message: string }>
//   removeItem: (
//     idToRemove: string
//   ) => Promise<{ success: boolean; message: string }>
//   increaseQuantity: (
//     idToIncrease: string
//   ) => Promise<{ success: boolean; message: string }>
//   decreaseQuantity: (
//     idToDecrease: string
//   ) => Promise<{ success: boolean; message: string }>

//   clearCart: () => void
//   total: number
//   totalPrice: number
//   isMobile: boolean
//   handleProductQuantity: (
//     productId: string,
//     type?: 'increment' | 'decrement'
//   ) => (e?: ChangeEvent<HTMLInputElement>) => void

//   populate: (items: Product[], total: number) => void
//   getQuantityById: (id: string) => number | undefined
//   getTotalAmount: () => number

//   paymentIntent: string
//   setPaymentIntent: (value: string) => void

//   toggleCart: () => void

//   isOpen: boolean
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
//     itemsPrice,
//     shippingPrice,
//     taxPrice,
//     totalPrice,
//   }
// }

// const useCartStoreBase = create(
//   persist<CartStore>(
//     (set, get) => ({
//       id: 'cart-id', // Set a default id or dynamically generate one
//       isOpen: false,
//       cartItems: [],
//       totalPrice: 0,
//       total: 0,
//       isMobile: false,

//       paymentIntent: '',
//       setPaymentIntent: (value) => set({ paymentIntent: value }),
//       toggleCart: () => set((state) => ({ ...state, isOpen: !state.isOpen })),
//       addItem: async (data: CartItem) => {
//         const { item, quantity, color, size } = data
//         const currentItems = get().cartItems
//         const isExisting = currentItems.find(
//           (cartItem) => cartItem.item.id === item.id
//         )

//         if (isExisting) {
//           toast('Item already in cart')
//           return { success: false, message: 'Item already in cart' }
//         }

//         set({
//           cartItems: [
//             ...currentItems,
//             { id: item.id, item, quantity, color, size },
//           ],
//         })
//         set({
//           ...calcPrice([
//             ...currentItems,
//             { id: item.id, item, quantity, color, size },
//           ]),
//         })
//         toast.success('Item added to cart', { icon: '🛒' })
//         return { success: true, message: 'Item added to cart' }
//       },

//       removeItem: async (idToRemove: string) => {
//         const newCartItems = get().cartItems.filter(
//           (cartItem) => cartItem.item.id !== idToRemove
//         )
//         set({ cartItems: newCartItems })
//         toast.success('Item removed from cart')
//         set({ ...calcPrice(newCartItems) })
//         return { success: true, message: 'Item removed from cart' }
//       },

//       increaseQuantity: async (idToIncrease: string) => {
//         const newCartItems = get().cartItems.map((cartItem) =>
//           cartItem.item.id === idToIncrease
//             ? { ...cartItem, quantity: cartItem.quantity + 1 }
//             : cartItem
//         )
//         set({ cartItems: newCartItems })
//         set({ ...calcPrice(newCartItems) })
//         return { success: true, message: 'Item quantity increased' }
//       },

//       decreaseQuantity: async (idToDecrease: string) => {
//         const newCartItems = get().cartItems.map((cartItem) =>
//           cartItem.item.id === idToDecrease && cartItem.quantity > 1
//             ? { ...cartItem, quantity: cartItem.quantity - 1 }
//             : cartItem
//         )
//         set({ cartItems: newCartItems })
//         set({ ...calcPrice(newCartItems) })
//         return { success: true, message: 'Item quantity decreased' }
//       },

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
//         const product = get().cartItems.find(
//           (product) => product.item.id === id
//         )
//         return product ? product.quantity : undefined
//       },

//       populate: (items, total) => {
//         set((state) => ({ ...state, items, total }))
//       },

//       totalProductInCarts() {
//         return get().cartItems.length
//       },

//       clearCart: () => set({ cartItems: [], paymentIntent: '' }),
//     }),
//     {
//       name: 'cart-storage',
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// )
// const useCart = createSelectorHooks(useCartStoreBase)
// export default useCart

//.................3...........................

// 'use client'

// import { create } from 'zustand'
// import { toast } from 'react-hot-toast'
// import { v4 as uuidv4 } from 'uuid' // Import uuid
// import { Product } from '@/types'
// import type { ChangeEvent } from 'react'
// import { createSelectorHooks } from 'auto-zustand-selectors-hook'
// import { persist, createJSONStorage } from 'zustand/middleware'

// interface CartItem {
//   id: string // Add id to CartItem
//   item: Product
//   quantity: number
//   color?: string
//   size?: string

//   productId: string
// }

// interface CartStore {
//   cartItems: CartItem[]
//   addItem: (item: CartItem) => Promise<{ success: boolean; message: string }>
//   removeItem: (idToRemove: string) => Promise<{ success: boolean; message: string }>
//   increaseQuantity: (idToIncrease: string) => Promise<{ success: boolean; message: string }>
//   decreaseQuantity: (idToDecrease: string) => Promise<{ success: boolean; message: string }>
//   clearCart: () => void
//   total: number
//   totalPrice: number
//   isMobile: boolean
//   handleProductQuantity: (productId: string, type?: 'increment' | 'decrement') => (e?: ChangeEvent<HTMLInputElement>) => void
//   populate: (items: Product[], total: number) => void
//   getQuantityById: (id: string) => number | undefined // New method
//   getTotalAmount: () => number // New method
//   paymentIntent: string
//   setPaymentIntent: (value: string) => void
//   toggleCart: () => void
//   isOpen: boolean
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
//     itemsPrice,
//     shippingPrice,
//     taxPrice,
//     totalPrice,
//   }
// }

// const useCartStoreBase = create(
//   persist<CartStore>(
//     (set, get) => ({
//       isOpen: false,
//       cartItems: [],
//       totalPrice: 0,
//       total: 0,
//       isMobile: false,

//       paymentIntent: '',
//       setPaymentIntent: (value) => set({ paymentIntent: value }),
//       toggleCart: () => set((state) => ({ ...state, isOpen: !state.isOpen })),
//       addItem: async (data: Omit<CartItem, 'id'>) => {
//         const { item, quantity, color, size, productId } = data
//         const currentItems = get().cartItems
//         const isExisting = currentItems.find(
//           (cartItem) => cartItem.item.id === item.id
//         )

//         if (isExisting) {
//           toast('Item already in cart')
//           return { success: false, message: 'Item already in cart' }
//         }

//         const newCartItem = { ...data, id: uuidv4() } // Generate unique id for new item
//         set({ cartItems: [...currentItems, newCartItem, ] })
//         set({
//           ...calcPrice([...currentItems, newCartItem]),
//         })
//         toast.success('Item added to cart', { icon: '🛒' })
//         return { success: true, message: 'Item added to cart' }
//       },

//       removeItem: async (idToRemove: string) => {
//         const newCartItems = get().cartItems.filter(
//           (cartItem) => cartItem.id !== idToRemove
//         )
//         set({ cartItems: newCartItems })
//         toast.success('Item removed from cart')
//         set({ ...calcPrice(newCartItems) })
//         return { success: true, message: 'Item removed from cart' }
//       },

//       increaseQuantity: async (idToIncrease: string) => {
//         const newCartItems = get().cartItems.map((cartItem) =>
//           cartItem.id === idToIncrease
//             ? { ...cartItem, quantity: cartItem.quantity + 1 }
//             : cartItem
//         )
//         set({ cartItems: newCartItems })
//         set({ ...calcPrice(newCartItems) })
//         return { success: true, message: 'Item quantity increased' }
//       },

//       decreaseQuantity: async (idToDecrease: string) => {
//         const newCartItems = get().cartItems.map((cartItem) =>
//           cartItem.id === idToDecrease && cartItem.quantity > 1
//             ? { ...cartItem, quantity: cartItem.quantity - 1 }
//             : cartItem
//         )
//         set({ cartItems: newCartItems })
//         set({ ...calcPrice(newCartItems) })
//         return { success: true, message: 'Item quantity decreased' }
//       },

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
//         const product = get().cartItems.find((product) => product.id === id)
//         return product ? product.quantity : undefined
//       },

//       populate: (items, total) => {
//         set((state) => ({ ...state, items, total }))
//       },

//       totalProductInCarts() {
//         return get().cartItems.length
//       },

//       clearCart: () => set({ cartItems: [], paymentIntent: '' }),
//     }),
//     {
//       name: 'cart-storage',
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// )

// const useCart = createSelectorHooks(useCartStoreBase)
// export default useCart

//.................4...........................

// import { create } from 'zustand'
// import { toast } from 'react-hot-toast'
// import { v4 as uuidv4 } from 'uuid' // Import uuid
// import { Product } from '@/types'
// import type { ChangeEvent } from 'react'
// import { createSelectorHooks } from 'auto-zustand-selectors-hook'
// import { persist, createJSONStorage } from 'zustand/middleware'

// interface CartItem {
//   id: string // Add id to CartItem
//   item: Product
//   quantity: number
//   color?: string
//   size?: string
//   productId: string
// }

// interface CartStore {
//   cartItems: CartItem[]
//   addItem: (item: CartItem) => Promise<{ success: boolean; message: string }>
//   removeItem: (
//     idToRemove: string
//   ) => Promise<{ success: boolean; message: string }>
//   increaseQuantity: (
//     idToIncrease: string
//   ) => Promise<{ success: boolean; message: string }>
//   decreaseQuantity: (
//     idToDecrease: string
//   ) => Promise<{ success: boolean; message: string }>
//   clearCart: () => void
//   total: number
//   totalPrice: number
//   isMobile: boolean
//   handleProductQuantity: (
//     productId: string,
//     type?: 'increment' | 'decrement'
//   ) => (e?: ChangeEvent<HTMLInputElement>) => void
//   populate: (items: Product[], total: number) => void
//   getQuantityById: (id: string) => number | undefined // New method
//   getTotalAmount: () => number // New method
//   paymentIntent: string
//   setPaymentIntent: (value: string) => void
//   toggleCart: () => void
//   isOpen: boolean
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
//     itemsPrice,
//     shippingPrice,
//     taxPrice,
//     totalPrice,
//   }
// }

// const useCartStoreBase = create(
//   persist<CartStore>(
//     (set, get) => ({
//       isOpen: false,
//       cartItems: [],
//       totalPrice: 0,
//       total: 0,
//       isMobile: false,

//       paymentIntent: '',
//       setPaymentIntent: (value) => set({ paymentIntent: value }),
//       toggleCart: () => set((state) => ({ ...state, isOpen: !state.isOpen })),
//       addItem: async (data: Omit<CartItem, 'id'>) => {
//         const { item, quantity, color, size, productId } = data
//         const currentItems = get().cartItems
//         const isExisting = currentItems.find(
//           (cartItem) => cartItem.item.id === item.id
//         )

//         if (isExisting) {
//           toast('Item already in cart')
//           return { success: false, message: 'Item already in cart' }
//         }

//         const newCartItem: CartItem = { ...data, id: uuidv4() } // Generate unique id for new item
//         set({ cartItems: [...currentItems, newCartItem] })

//         set({
//           ...calcPrice([...currentItems, newCartItem]),
//         })
//         toast.success('Item added to cart', { icon: '🛒' })
//         return { success: true, message: 'Item added to cart' }
//       },

//       removeItem: async (idToRemove: string) => {
//         const newCartItems = get().cartItems.filter(
//           (cartItem) => cartItem.id !== idToRemove
//         )
//         set({ cartItems: newCartItems })
//         toast.success('Item removed from cart')
//         set({ ...calcPrice(newCartItems) })
//         return { success: true, message: 'Item removed from cart' }
//       },

//       increaseQuantity: async (idToIncrease: string) => {
//         const newCartItems = get().cartItems.map((cartItem) =>
//           cartItem.id === idToIncrease
//             ? { ...cartItem, quantity: cartItem.quantity + 1 }
//             : cartItem
//         )
//         set({ cartItems: newCartItems })
//         set({ ...calcPrice(newCartItems) })
//         return { success: true, message: 'Item quantity increased' }
//       },

//       decreaseQuantity: async (idToDecrease: string) => {
//         const newCartItems = get().cartItems.map((cartItem) =>
//           cartItem.id === idToDecrease && cartItem.quantity > 1
//             ? { ...cartItem, quantity: cartItem.quantity - 1 }
//             : cartItem
//         )
//         set({ cartItems: newCartItems })
//         set({ ...calcPrice(newCartItems) })
//         return { success: true, message: 'Item quantity decreased' }
//       },

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
//         const product = get().cartItems.find((product) => product.id === id)
//         return product ? product.quantity : undefined
//       },

//       populate: (items, total) => {
//         set((state) => ({ ...state, items, total }))
//       },

//       totalProductInCarts() {
//         return get().cartItems.length
//       },

//       clearCart: () => set({ cartItems: [], paymentIntent: '' }),
//     }),
//     {
//       name: 'cart-storage',
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// )

// const useCart = createSelectorHooks(useCartStoreBase)
// export default useCart
