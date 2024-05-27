import Link from "next/link";
import { ChevronRightIcon } from "@radix-ui/react-icons";

const Breadcrumbs = ({ product }: any) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            Home
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRightIcon />
            <Link
              className="ml-1 text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white md:ml-2"
              href="/products"
            >
              Products
            </Link>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <ChevronRightIcon />
            <span className="ml-1 text-sm font-medium text-neutral-500 dark:text-neutral-400 md:ml-2">
              {product.name || "---"}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
