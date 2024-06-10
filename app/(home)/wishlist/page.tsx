import { motion, AnimatePresence } from 'framer-motion'
import Head from 'next/head'
import React from 'react'
// import WishlistItem from '@/components/WishlistItem';
import { useWishlist } from '@/hooks/use-wish'

const Wishlist = () => {
  const { wishlist, isHydrated } = useWishlist()

  if (!isHydrated) {
    return null
  }

  return (
    <>
      <Head>
        <title>Wishlist | LUXE</title>
      </Head>
      <div className="px-4 sm:px-8 md:px-16 lg:px-20 xl:px-24 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-5">My Wishlist</h1>
          <AnimatePresence initial={false}>
            {wishlist.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="mt-8 mb-5 text-lg font-medium text-center">
                  Your wishlist is currently empty.
                </p>
                <p className="text-center">
                  Click the heart button to add items on your wishlist.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {wishlist.length > 0 && (
            <div className="grid grid-cols-1 gap-9 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence>
                {wishlist.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={false}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { ease: 'linear' },
                      layout: { duration: 0.4 },
                    }}
                  >
                    {/* <WishlistItem item={item} /> */}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Wishlist
