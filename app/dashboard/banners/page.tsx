import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { BannerColumn } from "./_components/columns";
import { BannerClient } from "./_components/client";

const page = async () => {
  const banner = await prisma.banner.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBrands: BannerColumn[] = banner.map((item) => ({
    id: item.id,
    label: item.label,

    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BannerClient data={formattedBrands} />
      </div>
    </div>
  );
};

export default page;
