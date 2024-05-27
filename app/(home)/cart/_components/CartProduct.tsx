import React, { useRef, useState } from "react";

import Image from "next/image";
import { toast } from "react-hot-toast";
import { LuX } from "react-icons/lu";
import { HiMinusSm, HiOutlinePlusSm, HiOutlineTrash } from "react-icons/hi";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/types";
// import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
// import {Currency} from "@/lib/utils";


// import useCart  from "@/store/cart";



interface CartItemProps {
  data: Product;
}

const CartProduct: React.FC<CartItemProps> = ({ data }) => {

  const cart = useCart();
  //const { items } = useCart();
  const [total, setTotal] = React.useState(cart);

  const [quantity, setQuantity] = useState<number | "">(data.quantity ?? "");

  // const onRemove = () => {
  //   cart.removeItem(data.id);
  // };

  // const increment2 = () => {
  //   cart.increaseQuantity(data.id);
  // };

  const increment = useCart((state) => state.incrementQuantity);
  const decrement = useCart((state) => state.decrementQuantity);
  const removeFromCart = useCart((state) => state.removeFromCart);

  const handleIncrement = () => {
   
    increment(data.id);
  };

  const handleDecrement = (item: Product) => {

    decrement(item.id);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(data.id);
  };



  const handleIncrementQuantity = (itemId: number) => {
    setTotal((prevCart: any) =>
      prevCart.map((item: any) => {
        return item.id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item;
      })
    );
  };

  // const onRemove = () => {
  //   cart.removeItem(data.id);
  // };
  // const getQuantityById = () => {
  //   cart.getQuantityById(data.id);
  // };

  React.useEffect(() => {
    setTotal(cart);
  }, [cart]);

  // const increment = () => {
  //   cart.incrementItem(data.id);
  // };

  // const increment2 = () => {
  //   cart.increaseQuantity(data.id);
  // };

  // const decrement = () => {
  //   cart.removeItem(data.id);
  // };

  //const populate = useCart.usePopulate();
  // const remove = useCart.useRemove();
  // const update = useCart.useUpdate();

  return (
    <Card>
      <CardHeader className="p-0 md:hidden">
        <div className="relative h-32 w-full">
          <div className="absolute z-10 right-0 top-0">
            <LuX size={15} />
            {/* <IconButton onClick={onRemove} icon={<LuX size={15} />} /> */}
          </div>
          {/* <Link href={`/product/${data?.id}`}>
            <Image
              className="rounded-t-lg"
              src={data.images.split(',')}
              alt="product image"
              fill
              style={{ objectFit: "cover" }}
            />
          </Link> */}
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-6 gap-4 p-3">
        <div className="relative w-full col-span-2 hidden md:inline-flex">
          <div className="absolute z-10 right-0 top-0">
            <IconButton
              onClick={handleRemoveFromCart}
              icon={<LuX size={15} />}
            />
          </div>
          <Link href={`/product/${data?.id}`}>
            <Image
              className="rounded-lg"
              src={data.images?.[0]?.url}
              alt="item image"
              fill
              style={{ objectFit: "cover" }}
            />
          </Link>
        </div>
        <div className="col-span-4">
          <div className="absolute z-10 right-0 top-0">
            {/* <IconButton onClick={onRemove} icon={<LuX size={15} />} /> */}
          </div>
          <Link href={`/product/${data?.id}`}>
            <h2>{data?.name}</h2>
          </Link>
          <p className="my-2 text-xs text-neutral-500 text-justify">
            {data?.description}
          </p>
          <h2 className="text-lg mb-4">
            {data?.price}
            {/* <Currency value={data?.price} /> */}
          </h2>
          {/* <CartButton /> */}

          <h6>cart buttonss</h6>

          <button className="w-8 h-8" onClick={() => handleIncrement()}>
            +
          </button>

        

          {/* {Number(quantity) }.00 */}
          {/* 
          {total.map((item) => (
            <tr key={item.id}>
              <td>
                <span className="flex items-center px-2">{item.quantity}</span>
              </td>
            </tr>
          ))} */}
        </div>
      </CardContent>
    </Card>
  );
};

export default CartProduct;
