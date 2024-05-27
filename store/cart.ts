import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types";

interface CartStore {
  items: Product[];
  addItem: (data: Product) => void;
  total: number;
  totalPrice: number;
  totalQuantity: number;
  populate: (items: Product[], total: number) => void;
  removeItem: (id: string) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  removeAll: () => void;

  // paymentIntent: string;
  // onCheckout: string;
  // setPaymentIntent: (val: string) => void;
  // setCheckout: (val: string) => void;

  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  getQuantityById: (id: string) => number | undefined; // New method
  getTotalAmount: () => number; // New method
}

const useCartStoreBase = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      total: 0,

      totalPrice: 0,
      totalQuantity: 0,

      addItem: (data: Product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          return toast("Item already in cart.");
        }

        set({ items: [...get().items, data] });
        toast.success("Item added to cart.");
      },

      incrementItem: (id: string) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }));

        toast.success("Item increased from cart.");
      },

      increaseQuantity: (id: string) => {
        set((state) => {
          // Find the product in the cart
          const product = state.items.find((product) => product.id === id);

          if (product) {
            // Increase its quantity by 1
            product.quantity += 1;
            toast.success("Item increased from cart.");
          }

          return { items: [...state.items] };
        });
      },

      decreaseQuantity: (id: string) => {
        set((state) => {
          // Find the product in the cart
          const product = state.items.find((product) => product.id === id);

          if (product && product.quantity > 1) {
            // Decrease its quantity by 1, but ensure it doesn't go below 1
            product.quantity -= 1;
          }

          return { items: [...state.items] };
        });
      },

      // incrementItem: () => set((state) => ({ total: state.total + 1 })),

      decrementItem: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item?.quantity > 1
              ? { ...item, quantity: item?.quantity - 1 }
              : item
          ),
        }));
      },

      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.success("Item removed from cart.");
      },

      //getQuantity by id

      getQuantityById: (id: string) => {
        // Find the product in the cart
        const product = get().items.find((product) => product.id === id);

        // If the product is found, return its quantity; otherwise, return undefined
        return product ? product.quantity : undefined;
      },

      //get total amount
      getTotalAmount: () => {
        const { items } = get();
        const totalPrice = items.reduce((total, item) => {
          return total + Number(item.price);
        }, 0);
        return totalPrice;
      },

      populate: (items, total) => {
        set((state) => ({ ...state, items, total }));
      },

      totalProductInCarts() {
        return get().items.length;
      },

      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

const useCart = createSelectorHooks(useCartStoreBase);
export default useCart;
