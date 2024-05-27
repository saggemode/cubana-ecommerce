import Image from "next/image";
import { toast } from "react-hot-toast";
import { LuTrash } from "react-icons/lu";
import { HiMinusSm, HiOutlinePlusSm, HiOutlineTrash } from "react-icons/hi";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
// import { useLanguage } from "@/hooks/useLanguage";
import Link from "next/link";

interface CartItemProps {
  data: Product;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  // const { t } = useLanguage();
  const cart = useCart();

  const onRemove = () => {
    cart.removeItem(data.id);
  };

  const increment = () => {
    cart.removeItem(data.id);
  };

  const decrement = () => {
    cart.removeItem(data.id);
  };

  return (
    <div className="flex items-center flex-wrap sm:my-4 sm:py-4 px-2 border-b-2">
      <div className="lg:w-1/2 sm:min-w-[290px]">
        <Link href={"/"} legacyBehavior>
          <a className="flex flex-wrap sm:flex-nowrap justify-center items-center flex-grow">
            <div className="sm:min-w-[100px] md:min-w-[130px]">
              <Image
                 src={data.images[0].url}
                width={100}
                height={100}
                alt={data.name}
                className="object-contain"
              />
            </div>
            <div className="flex-grow text-sm font-normal mb-2 sm:mb-0 mx-2 w-full">
              {data.name}
            </div>
          </a>
        </Link>
      </div>
      <div className="flex flex-wrap flex-grow md:items-center mb-4 sm:mb-0">
        <div className="flex-grow my-2 sm:my-0">
          <div className="flex items-center justify-start lg:justify-center cursor-pointer">
            <div className="p-2" onClick={() => increment()}>
              <HiOutlinePlusSm style={{ fontSize: "1rem" }} />
            </div>
            <input
              className="inline-block w-[65px] rtl:pr-7 ltr:pl-7 py-2 mx-1 border-[1px] border-gray-400"
              type="number"
              min={1}
              max={10}
              // value={counter}
              // onChange={onInputNumberChangeHandler}
            />

            <div
              //onClick={() => decrement(product.slug.current)}
              className="p-1"
            >
              <HiOutlineTrash style={{ fontSize: "1.3rem", color: "red" }} />
            </div>

            <div
              //onClick={() => decrement(product.slug.current)}
              className="p-1"
            >
              <HiMinusSm style={{ fontSize: "1rem" }} />
            </div>
          </div>
        </div>
        {/* <div className="flex flex-col flex-grow font-normal rtl:mr-1 lrt:ml-1">
        <p>{t.totalAmount}</p>
        <ProductPrice
          price={product.price * counter!}
          discount={product.discount}
        />
      </div> */}

        <h4>Product price</h4>
      </div>
    </div>
  );
};

export default CartItem;
