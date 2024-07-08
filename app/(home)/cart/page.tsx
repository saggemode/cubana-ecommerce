'use client'

import Border from '@/components/Border'
import Heading from '@/components/Heading'
import React from 'react'
import CartGrid from './_components/Grid'

const CartsPage = () => {
  return (
    <div className="pt-12">
      <Border />
      <Heading
        title="Cart"
        subtitle="Below is a list of products you have in your cart."
      />
      <CartGrid />
    </div>
  )
}

export default CartsPage
