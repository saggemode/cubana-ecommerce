import { Separator } from "@/components/ui/separator";
import { Heading } from "./_components/heading";
import prisma from "@/lib/prisma";
import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import Carousel from "./_components/Carousel";

//import { sendMail } from "@/lib/node-mails";
import { isVariableValid } from "@/lib/utils";
import { ProductGrid, ProductSkeletonGrid } from "@/components/Products";
import { ThreeItemGrid } from "@/components/grid/three-items";
import { HomeCarousel } from "@/components/HomeCarousel";
import getProducts from "@/actions/getProducts";

export const metadata = {
  description:
    "High-performance ecommerce store built with Next.js, Vercel, and Shopify.",
  openGraph: {
    type: "website",
  },
};

export default async function Home() {
  // await sendMail({to:"saggemode@gmail.com", subject:"test", body:"hello word"})
  // const products = await prisma.product.findMany({
  //   include: {
  //     brand: true,
  //     category: true,
  //     color: true,
  //     size: true,
  //     images: true,
  //   },
  // });
  const products = await getProducts();
  //console.log(products);
  if (products.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  const banners = await prisma.banner.findMany();

  return (
    // <div div className="flex flex-col border-neutral-200 dark:border-neutral-700">
    <>
      <Carousel imageUrl={banners?.map((obj: any) => obj.imageUrl)} />

      <Separator className="my-8" />
      <Heading
        title="Products"
        description="Below is a list of products we have available for you."
      />

      {isVariableValid(products) ? (
        <ProductGrid items={products} />
      ) : (
        <ProductSkeletonGrid />
      )}

      <Separator className="my-8" />
      <HomeCarousel />
      <Separator className="my-8" />
      <ThreeItemGrid />
    </>
  );
}
