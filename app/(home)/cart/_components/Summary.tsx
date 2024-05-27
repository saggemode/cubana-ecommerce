"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Separator } from "@/components/native/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import getCurrentUser from "@/actions/getCurrentUser";
import Currency from "@/lib/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import { isVariableValid } from "@/lib/utils";

const Summary = () => {
  const authenticated = true;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [primeShipping, setPrimeShipping] = useState(false);
  const [isCod, setIsCod] = useState(false);
  // const currentUser = await getCurrentUser();
  //const items = useCart((state) => state.items);
  //const removeAll = useCart((state) => state.removeAll);

  const removeAll = useCart.useRemoveAll();
  const items = useCart.useItems();

  const totalPrice = useCart.useGetTotalAmount();

  useEffect(() => {
    if (searchParams?.get("success")) {
      toast.success("Payment completed.");
      removeAll();
    }

    if (searchParams?.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  //   const totalPrice = items.reduce((total, item) => {
  //     return total + Number(item.price);
  //   }, 0);

  const onCheckout = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
      {
        productIds: items.map((item) => item.id),
      }
    );

    window.location = response.data.url;
  };

  const handleCheckoutRedirect = () => {
    const data = {
      products: {
        connect: items.map((product) => {
          return { id: product.id };
        }),
      },

      status: {
        paymentMode: isCod ? "cash-on-deliver" : "stripe",
      },
      paymentIntent: "",
      price: totalPrice() + (primeShipping ? 40 : 0),
    };
    // setOrdersInfo(data);
    router.push("/checkout");
  };

  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <h2 className="font-bold tracking-tight">Receipt</h2>
      </CardHeader>
      <CardContent className="p-4 text-sm">
        <div className="block space-y-[1vh]">
          <div className="flex justify-between">
            <p>Total Amount</p>
            <Currency value={totalPrice()} />

            {/* <h3>${calculatePayableCost().totalAmount}</h3> */}
          </div>
          <div className="flex justify-between">
            <p>Discount Amount</p>
            {/* <h3>${calculatePayableCost().discountAmount}</h3> */}
          </div>
          <div className="flex justify-between">
            <p>Tax Amount</p>
            {/* <h3>${calculatePayableCost().taxAmount}</h3> */}
          </div>
        </div>

        <div className="flex flex-col gap-2 my-5">
          <div className="flex ">
            <div className="flex items-center h-5">
              <input
                id="cod"
                aria-describedby="payment-method-text"
                type="radio"
                value=""
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                name="payment-method"
                onClick={() => setIsCod(true)}
              />
            </div>
            <div className="ml-2 text-sm">
              <label
                htmlFor="cod"
                className="font-medium text-gray-900 dark:text-gray-300"
              >
                Cash on Delivery
              </label>
            </div>
          </div>
          <div className="flex">
            <div className="flex items-center h-5">
              <input
                id="stripe"
                aria-describedby="payment-method-text"
                type="radio"
                value=""
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                name="payment-method"
                onClick={() => setIsCod(false)}
              />
            </div>
            <div className="ml-2 text-sm">
              <label
                htmlFor="stripe"
                className="font-medium text-gray-900 dark:text-gray-300"
              >
                Stripe
              </label>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between">
          <p>Payable Amount</p>
          {/* <h3>${calculatePayableCost().payableAmount}</h3> */}
        </div>
      </CardContent>
      <Separator />
      <CardFooter>
        <Button
          onClick={onCheckout}
          disabled={items.length === 0 || !authenticated}
          className="w-full"
        >
          Checkout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Summary;
