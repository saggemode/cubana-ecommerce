import { useCurrentUser } from '@/hooks/use-current-user'
import React from 'react'
import { redirect } from 'next/navigation'
import ShippingAddressForm from './shipping-address-form'
import useCart from '@/hooks/use-cart'
import { auth } from '@/auth'
import { getUserById } from '@/actions/services/userService'
import { ShippingAddress } from '@/types'

const ShippingPage = async () => {
  const session = await auth()
  const user = await getUserById(session?.user.id)

  const isShippingAddress = (address: any): address is ShippingAddress => {
    return (
      typeof address.fullName === 'string' &&
      typeof address.streetAddress === 'string' &&
      typeof address.city === 'string' &&
      typeof address.country === 'string' &&
      (typeof address.postalCode === 'undefined' ||
        typeof address.postalCode === 'string') &&
      (typeof address.lat === 'undefined' || typeof address.lat === 'number') &&
      (typeof address.lng === 'undefined' || typeof address.lng === 'number')
    )
  }

  const validatedAddress =
    user?.address && isShippingAddress(user.address) ? user.address : null

  return <ShippingAddressForm address={validatedAddress} />
}

export default ShippingPage
