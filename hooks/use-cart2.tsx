import { useWindowSize } from './useWindowSize'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from 'react-hot-toast'
import { Product } from '@/types'
import type { ChangeEvent } from 'react'

interface CartItem {
  item: Product
  quantity: number
  color?: string // ? means optional
  size?: string // ? means optional
}

interface CartStore {
  cartItems: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (idToRemove: string) => void
  increaseQuantity: (idToIncrease: string) => void
  decreaseQuantity: (idToDecrease: string) => void
  clearCart: () => void
  totalPrice: number
  isMobile: boolean
  windowSize: [number, number]
  updateIsMobile: () => void
  handleProductQuantity: (
    productId: string,
    type?: 'increment' | 'decrement'
  ) => (e?: ChangeEvent<HTMLInputElement>) => void
}

const useCartStore = () => {
  const windowSize = useWindowSize()

  return create(
    persist<CartStore>(
      (set, get) => ({
        cartItems: [],
        totalPrice: 0,
        isMobile: false,
        windowSize,
        addItem: (data: CartItem) => {
          const { item, quantity, color, size } = data
          const currentItems = get().cartItems // all the items already in cart
          const isExisting = currentItems.find(
            (cartItem) => cartItem.item.id === item.id
          )

          if (isExisting) {
            return toast('Item already in cart')
          }

          set({ cartItems: [...currentItems, { item, quantity, color, size }] })
          toast.success('Item added to cart', { icon: '🛒' })
        },
        removeItem: (idToRemove: string) => {
          const newCartItems = get().cartItems.filter(
            (cartItem) => cartItem.item.id !== idToRemove
          )
          set({ cartItems: newCartItems })
          toast.success('Item removed from cart')
        },
        increaseQuantity: (idToIncrease: string) => {
          const newCartItems = get().cartItems.map((cartItem) =>
            cartItem.item.id === idToIncrease
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
          set({ cartItems: newCartItems })
        },
        decreaseQuantity: (idToDecrease: string) => {
          const newCartItems = get().cartItems.map((cartItem) =>
            cartItem.item.id === idToDecrease
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          )
          set({ cartItems: newCartItems })
        },
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
          },
        updateIsMobile: () => {
          const width = get().windowSize[0]
          set({ isMobile: width < 768 })
        },
        clearCart: () => set({ cartItems: [] }),
      }),
      {
        name: 'cart-storage',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
}

export default useCartStore


