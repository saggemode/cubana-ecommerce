import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import { BrandForm } from "../_components/brand-form";

const BrandIdPage = async ({ params }: { params: { brandId: string } }) => {
  const brand = await prisma.brand.findUnique({
    where: {
      id: params.brandId,
    },
  });

  if (!brand) {
    return redirect("/");
  }

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <BrandForm brandId={brand.id} initialData={brand} />
        </div>
      </div>
    </>
  );
};

export default BrandIdPage;
