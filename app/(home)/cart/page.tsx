import Border from '@/components/Border'
import Heading from '@/components/Heading'
import React from 'react'
import CartSection from './_components/CartSection'

const CartsPage = () => {
  return (
    <div className='pt-12'>
      <Border />
      <Heading
        title="Cart"
        subtitle="Below is a list of products you have in your cart."
      />
      <CartSection />
    </div>
  )
}

export default CartsPage
