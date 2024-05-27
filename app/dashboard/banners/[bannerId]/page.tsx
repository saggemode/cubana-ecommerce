import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BannerForm } from "../_components/banner-form";



const BrandIdPage = async ({ params }: { params: { bannerId: string } }) => {
  const banner = await prisma.banner.findUnique({
    where: {
      id: params.bannerId,
    },
  });

  if (!banner) {
    return redirect("/");
  }

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <BannerForm bannerId={banner.id} initialData={banner} />
        </div>
      </div>
    </>
  );
};

export default BrandIdPage;
