"use client";

import Image from "next/image";
import { MouseEventHandler } from "react";
import { FaHeart } from "react-icons/fa";

import { LuExpand, LuShoppingCart } from "react-icons/lu";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import usePreviewModal from "@/hooks/use-preview-modal";
//import Currency from "./ui/currency";
import Price from "./price";

interface ProductCardProps {
  data: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const previewModal = usePreviewModal();
  // const cart = useCart();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${data?.id}`);
  };

  // onPreview
  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    previewModal.onOpen(data);
  };

  // add to cart
  // const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
  //   event.stopPropagation();
  //   cart.addItem(data);
  // };

  // function Price() {
  //   if (
  //     data?.discount !== null &&
  //     typeof data.discount === "number" &&
  //     data.discount > 0 &&
  //     typeof data.price === "number"
  //   ) {
  //     const price = data.price - data.discount;
  //     const percentage = (data.discount / data.price) * 100;

  //     return (
  //       <div className="flex gap-2 items-center">
  //         <Badge className="flex gap-4" variant="destructive">
  //           <div className="line-through">
  //             <Currency value={data.price} />
  //           </div>
  //           <div>%{percentage.toFixed(2)}</div>
  //         </Badge>
  //         <h2 className="text-sm">
  //           <Currency value={price.toFixed(2)} />
  //         </h2>
  //       </div>
  //     );
  //   }

  //   if (typeof data.price === "number") {
  //     return (
  //       <h2>
  //         <Currency value={data.price} />
  //       </h2>
  //     );
  //   }

  //   return null; // or any other fallback JSX you want
  // }

  return (
    <div className="col-span-1 cursor-pointer group">
      <Card className="h-full">
        <CardHeader className="p-0">
          <div
            className="relative 
          overflow-hidden 
          rounded-xl h-60 w-full"
          >
            <Image
              onClick={handleClick}
              className="rounded-t-lg"
              src={data.images?.[0]?.url}
              alt="product image"
              fill
              style={{ objectFit: "cover" }}
            />

            <div className="w-12 h-24 absolute bottom-10 right-0 border-[1px] border-gray-400 bg-white rounded-md flex flex-col translate-x-20 group-hover:translate-x-0 transition-transform duration-300">
              <span
                // onClick={onAddToCart}

                className="w-full h-full border-b-[1px] border-b-gray-400 flex items-center justify-center text-xl bg-transparent hover:bg-amazon_yellow cursor-pointer duration-300"
              >
                <LuShoppingCart />
              </span>

              <span className="w-full h-full border-b-[1px] border-b-gray-400 flex items-center justify-center text-xl bg-transparent hover:bg-amazon_yellow cursor-pointer duration-300">
                <FaHeart />
              </span>
              <span
                onClick={onPreview}
                className="w-full h-full border-b-[1px] border-b-gray-400 flex items-center justify-center text-xl bg-transparent hover:bg-amazon_yellow cursor-pointer duration-300"
              >
                <LuExpand />
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-1 p-4" onClick={handleClick}>
          <Badge variant="outline" className="w-min text-neutral-500">
            {data?.category?.title}
          </Badge>

          <h2 className="mt-2">{data.name}</h2>
          <p className="text-xs text-neutral-500 text-justify">
            {data?.description?.substring(0, 40) + "..."}
          </p>
        </CardContent>
        <CardFooter>
          {/* <h2 className="text-lg">${data?.price}</h2> */}

          {/* <h2 className="text-sm">
            <Currency value={data?.price ?? undefined}/>
          </h2> */}

          {data?.isFeatured != false ? (
            <Price amount={data?.price !== null ? data.price.toString() : ""} />
          ) : (
            // <h2 className="text-sm">
            //   <Currency value={data?.price ?? undefined} />
            // </h2>
            <Badge variant="secondary">Out of stock</Badge>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductCard;
