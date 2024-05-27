"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Card, CardContent } from "@/components/ui/card";
import { isVariableValid } from "@/lib/utils";
import CartProduct from "./CartProduct";
// import Summary from "./Summary";
import useFromStore from "@/hooks/useFromStore";

const CartSection = () => {
  const [isMounted, setIsMounted] = useState(false);
  // const cart = useCart();
  const cart = useFromStore(useCart, (state) => state.cart);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  //cart.items.length === 0;
  if (cart?.length === 0) {
    return (
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-4">
              <p>Your Cart is empty...</p>
            </CardContent>
          </Card>
        </div>

        {/* <Summary /> */}
        
      </div>
    );
  }

  return (
    <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="md:col-span-2">
        {cart?.map((cartItem, index) => (
          <CartProduct key={index} data={cartItem} />
        ))}
      </div>

      {/* <Summary /> */}
    </div>
  );
};

export default CartSection;
