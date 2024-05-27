import { Product } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";

interface State {
  cart: Product[];
  totalItems: number;
  totalPrice: number;
}

interface Actions {
  addToCart: (Item: Product) => void;
  removeFromCart: (productId: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (productId: string) => void;
  populate: (items: Product[], total: number) => void;
  resetCart: () => void;
  getTotalAmount: () => number; 
  
}

const INITIAL_STATE: State = {
  cart: [],
  totalItems: 0,
  totalPrice: 0,
};

export const useCart = create(
  persist<State & Actions>(
    (set, get) => ({
      cart: INITIAL_STATE.cart,
      totalItems: INITIAL_STATE.totalItems,
      totalPrice: INITIAL_STATE.totalPrice,

      addToCart: (product: Product) => {
        const cart = get().cart;
        const cartItem = cart.find((item) => item.id === product.id);

        if (cartItem) {
          const updatedCart = cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: (item.quantity as number) + 1 }
              : item
          );
          toast("Item alread in cart.");
          set((state) => ({
            cart: updatedCart,
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + (product.price || 0), // Handle null price
          }));
        } else {
          const updatedCart = [...cart, { ...product, quantity: 1 }];

          set((state) => ({
            cart: updatedCart,
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + (product.price || 0), // Handle null price
          }));
          toast.success("Item added to cart.");
        }
      },

      incrementQuantity: (id) => {
        set((state) => {
          const updatedCart = state.cart.map((item) =>
            item.id === id
              ? { ...item, quantity: (item.quantity as number) + 1 }
              : item
          );
          toast("Item increased in cart.");
          const totalPrice = updatedCart.reduce(
            (acc, item) => acc + (item.price || 0) * (item.quantity ?? 0),
            0
          );
          return {
            cart: updatedCart,
            totalItems: state.totalItems + 1,
            totalPrice,
          };
        });
      },


      decrementQuantity: (id) => {
        set((state) => {
          const updatedCart = state.cart.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: Math.max(1, ((item.quantity ?? 0) as number) - 1),
                }
              : item
          );
          const totalPrice = updatedCart.reduce(
            (acc, item) => acc + (item.price || 0) * (item.quantity ?? 0),
            0
          );
          return {
            cart: updatedCart,
            totalItems: Math.max(0, state.totalItems - 1),
            totalPrice,
          };
        });
      },

    //   removeFromCart: (product: Product) => {
    //     set((state) => ({
    //       cart: state.cart.filter((item) => item.id !== product.id),
    //       totalItems: state.totalItems - 1,
    //       totalPrice: state.totalPrice - (product.price || 0),
    //     }));
    //   },

    removeFromCart: (id) =>
        set((state) => {
          return {
            cart: state.cart.filter((item) => {
              if (item.id === id) {
                return false;
              }
              return true;
            }),
          };
        }),

      getTotalAmount: () => {
        const { cart } = get();
        const totalPrice = cart.reduce((total, item) => {
          return total + Number(item.price);
        }, 0);
        return totalPrice;
      },

      populate: (items, total) => {
        set((state) => ({ ...state, items, total }));
      },

      totalProductInCarts() {
        return get().cart.length;
      },

      resetCart: () =>
        set(() => {
          return {
            cart: [],
          };
        }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);


export const useCartStore = () => {
    const initialCart = useCart((state) => state.cart);
    const [cart, setCart] = useState<Product[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);
  
    useEffect(() => {
      setCart(initialCart);
      setIsHydrated(true);
    }, [initialCart]);
  
    return { cart, isHydrated };
  };
  
  export const useTotalQuantity = () => {
    const cart = useCart((state) => state.cart);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [isHydrated, setIsHydrated] = useState(false);
  
    useEffect(() => {
        setTotalQuantity(cart.reduce((prev, cur) => prev + (cur.quantity || 0), 0));
      setIsHydrated(true);
    }, [cart]);
  
    return { totalQuantity, isHydrated };
  };
  
  export const useTotalPrice = () => {
    const cart = useCart((state) => state.cart);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isHydrated, setIsHydrated] = useState(false);
  
    useEffect(() => {
      setTotalPrice(
        cart.reduce((prev, cur) => prev + (cur.quantity || 0), 0)
      );
      setIsHydrated(true);
    }, [cart]);
  
    return { totalPrice, isHydrated };
  };