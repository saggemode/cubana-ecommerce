import prisma from "@/lib/prisma";
import Link from "next/link";
import { GridTileImage } from "./grid/tile";

export async function HomeCarousel() {
  // Collections that start with `hidden-*` are hidden from the search page.
  const products = await prisma.product.findMany({
    include: {
      brand: true,
      category: true,
      color: true,
      size: true,
      images: true,
    },
  });
  if (!products?.length) return null;

  // Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className=" w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex animate-carousel gap-4">
        {carouselProducts.map((product, i) => (
          <li
            key={`${product.id}${i}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
          >
            <Link
              href={`/products/${product.id}`}
              className="relative h-full w-full"
            >
              <GridTileImage
                alt={product.name}
                label={{
                  title: product.name as string,
                  amount:
                    product.price !== null ? product.price.toString() : "",
                  currencyCode:
                    product.price !== null ? product.price.toString() : "",
                }}
                src={product.images?.[0]?.url}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
