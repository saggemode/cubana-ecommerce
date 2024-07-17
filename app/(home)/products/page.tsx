import { MainLayout } from '@/components/main-layout'
import React from 'react'
import { Listing } from './components/Listing'
import getProducts from '@/actions/getProducts'

const page = async () => {
  const allProducts = await getProducts()
  return (
    <MainLayout
      className="flex flex-col items-start gap-6 md:flex-row md:gap-8 pt-20 mt-20"
      title="Shopping Cart | Store"
      description="You can find everything you need here."
      image="/store.png"
      url="/store"
    >
      <h4>hello</h4>
      {/* <Aside isMobile={isMobile} />
     <Listing allProducts={allProducts} isMobile={isMobile} /> */}

      <Listing allProducts={allProducts} />
    </MainLayout>
  )
}

export default page
