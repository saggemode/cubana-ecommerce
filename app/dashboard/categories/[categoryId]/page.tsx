import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import { CategoryForm } from "../_components/category-form";

const ProductIdPage = async ({
  params,
}: {
  params: { categoryId: string };
}) => {
  const category = await prisma.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  if (!category) {
    return redirect("/");
  }

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <CategoryForm
            categoryId={category.id}
            initialData={category}
          />
        </div>
      </div>
    </>
  );
};

export default ProductIdPage;
