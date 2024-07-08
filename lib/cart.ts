export function writeLocalCart(items:any) {
  window.localStorage.setItem('Cart', JSON.stringify(items))
}

export function getLocalCart() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const cart = window.localStorage.getItem('Cart')
      return cart ? JSON.parse(cart) : { items: [] }
    } catch (error) {
      writeLocalCart({ items: [] })
      return { items: [] }
    }
  }
}

export function getCountInCart({ cartItems, productId }:any) {
  try {
    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i]?.productId === productId) {
        return cartItems[i]?.count
      }
    }

    return 0
  } catch (error) {
    console.error({ error })
    return 0
  }
}
