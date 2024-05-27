import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SizesForm } from "../_components/sizes-form";




const ColorsIdPage = async ({
  params,
}: {
  params: { sizeId: string };
}) => {
  const size = await prisma.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });

  if (!size) {
    return redirect("/");
  }

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <SizesForm
            sizeId={size.id}
            initialData={size}
          />
        </div>
      </div>
    </>
  );
};

export default ColorsIdPage;
