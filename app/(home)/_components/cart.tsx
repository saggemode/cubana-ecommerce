'use client'

import useCart from '@/hooks/use-cart'
import { useRouter } from 'next/navigation'
import { CiShoppingCart } from 'react-icons/ci'

const CartNav = () => {
  const cart = useCart()
  const router = useRouter()
  return (
    <div
      className="relative cursor-pointer gap-x-4 ml-auto  "
      onClick={() => router.push('/cart')}
    >
      <div className="text-3xl ">
        <CiShoppingCart />
      </div>
      <span className="absolute ml-2  top-[-10px] right-[-10px] bg-slate-700 text-white h-6 w-6 rounded-full flex items-center justify-center text-sm">
        {cart?.items.length}
      </span>
    </div>
  )
}

export default CartNav
