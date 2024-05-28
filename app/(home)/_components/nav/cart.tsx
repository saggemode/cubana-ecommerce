"use client";

import useCart from '@/hooks/use-cart'
import { useRouter } from "next/navigation";
import { CiShoppingCart } from "react-icons/ci";

import useFromStore from "@/hooks/useFromStore"

const CartNav = () => {
	//const cart = useFromStore(useCart, state => state.cart)
 const cart = useCart()
  const router = useRouter();
  return (
    <div
      className="relative cursor-pointer gap-x-4 ml-auto  "
      onClick={() => router.push('/cart')}
    >
      <div className="text-3xl ">
        <CiShoppingCart />
      </div>
      <span className="absolute ml-2  top-[-10px] right-[-10px] bg-slate-700 text-white h-6 w-6 rounded-full flex items-center justify-center text-sm">
        {cart?.cartItems.length}
      </span>
    </div>
  )
};

export default CartNav;

// "use client";

// import { LuShoppingBag } from "react-icons/lu";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { LockClosedIcon } from "@radix-ui/react-icons";
// import { Button } from "@/components/ui/button";

// import Link from "next/link";
// // import useCart from "@/hooks/useCart";

// export function CartNav() {
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const router = useRouter();
//   // const cart = useCart();

//   if (!isMounted) {
//     return null;
//   }

//   return (
//     // <Link href="/cart">
//     //     <Button size="icon" variant="outline" className="h-9">
//     //         <LockClosedIcon />
//     //     </Button>
//     // </Link>

//     <div className="ml-auto flex items-center gap-x-4">
//       <Button
//         onClick={() => router.push("/cart")}
//         className="flex items-center rounded-full bg-black px-4 py-2"
//       >
//         <LuShoppingBag size={20} color="white" />
//         <span className="ml-2 text-sm font-medium text-white">
//           {/* {cart.items.length} */} 0
//         </span>
//       </Button>
//     </div>
//   );
// }
