import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { BrandColumn } from "./_components/columns";
import { BrandsClient } from "./_components/client";

const page = async() => {
  const brands = await prisma.brand.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBrands: BrandColumn[] = brands.map((item) => ({
    id: item.id,
    name: item.name,
    //description: item.description,

    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <BrandsClient data={formattedBrands} />
    </div>
  </div>
  );
};

export default page;
