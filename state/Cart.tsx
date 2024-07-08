
import { getLocalCart, writeLocalCart } from '@/lib/cart'
import { isVariableValid } from '@/lib/utils'
import { useUserContext } from '@/state/User'
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

interface CartContextType {
  cart: any
  loading: boolean
  refreshCart: () => void
  dispatchCart: (cart: any) => void
}

const CartContext = createContext<CartContextType>({
  cart: null,
  loading: true,
  refreshCart: () => {},
  dispatchCart: (cart: any) => {},
})

export const useCartContext = () => {
  return useContext(CartContext)
}

interface UserType {
  cart: any
}

interface UserContextType {
  user: UserType | null
  refreshUser: () => void
}

interface CartContextProviderProps {
  children: ReactNode
}

export const CartContextProvider = ({ children }: CartContextProviderProps) => {
  const { refreshUser, user } = useUserContext() as UserContextType

  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const dispatchCart = async (cart: any) => {
    setCart(cart)
    writeLocalCart(cart)
  }

  const refreshCart = async () => {
    setLoading(true)

    if (isVariableValid(user)) {
      setCart(user?.cart)
      writeLocalCart(user?.cart)
    } else {
      setCart(getLocalCart())
    }

    setLoading(false)
  }

  useEffect(() => {
    if (isVariableValid(user)) {
      setCart(user?.cart)
      writeLocalCart(user?.cart)
    } else if (!isVariableValid(getLocalCart())) {
      writeLocalCart({ items: [] })
    }
    setCart(getLocalCart())
    setLoading(false)
  }, [user])

  return (
    <CartContext.Provider value={{ cart, loading, refreshCart, dispatchCart }}>
      {children}
    </CartContext.Provider>
  )
}
