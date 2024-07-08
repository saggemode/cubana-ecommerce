import React from 'react'
import { redirect } from 'next/navigation'
//import ShippingAddressForm from './shipping-address-form'
import useCart from '@/hooks/use-cart'
import { auth } from '@/auth'
import { currentUser } from '@/lib/auth'
import { useCurrentUser } from '@/hooks/use-current-user'
import { getUserById } from '@/actions/services/userService'
import { ShippingAddress } from '@/types'
import PaymentMethodForm from './payment-method-form'

const PaymentMethodPage = async () => {
  const session = await currentUser()
    if (!session || !session.id) return redirect('/login')
  const user = await getUserById(session?.id)
  //console.log(user)
  return <PaymentMethodForm preferredPaymentMethod={user?.paymentMethod} />
}

export default PaymentMethodPage
