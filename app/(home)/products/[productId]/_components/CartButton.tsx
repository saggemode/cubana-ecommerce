"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { LuShoppingCart } from "react-icons/lu";

const CartButton = ({ product }: any) => {
  const addToCart = useCart((state) => state.addToCart);
  //const cart = useCart();

  const onAddToCart = () => {
    addToCart(product);
  };
  return (
    <div>
      <Button onClick={onAddToCart} className="flex items-center gap-x-2">
        Add To Cart
        <LuShoppingCart size={20} />
      </Button>

      {/* <Button className="flex items-center gap-x-2">
        Add To Cart
        <LuShoppingCart size={20} />
      </Button> */}
    </div>
  );
};

export default CartButton;
