import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { SizeColumn } from "./_components/columns";
import { SizesClient } from "./_components/client";

const page = async () => {
  const sizes = await prisma.size.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <SizesClient data={formattedSizes} />
    </div>
  </div>
  );
};

export default page;
