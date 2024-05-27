import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ColorsForm } from "../_components/colors-form";



const ColorsIdPage = async ({
  params,
}: {
  params: { colorId: string };
}) => {
  const color = await prisma.color.findUnique({
    where: {
      id: params.colorId,
    },
  });

  if (!color) {
    return redirect("/");
  }

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ColorsForm
            colorId={color.id}
            initialData={color}
          />
        </div>
      </div>
    </>
  );
};

export default ColorsIdPage;
