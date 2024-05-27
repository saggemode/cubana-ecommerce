import { format } from "date-fns";
import prisma from "@/lib/prisma";
import { ProductsClient } from "./_components/client";
import { formatPrice } from "@/lib/utils";
import { ProductColumn } from "./_components/columns";

const page = async () => {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      size: true,
      color: true,
      brand: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatPrice(Number(item.price)),
    category: item.category?.title,
    brand: item.brand?.name,
    size: item.size?.name,
    color: item.color?.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    // <div>
    //   <Link href="/dashboard/products/create">
    //   <Button>
    //     new Products
    //   </Button>
    //   </Link>

    // </div>

    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default page;
