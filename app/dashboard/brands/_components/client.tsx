"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

import Heading from "@/components/Heading";

import { Separator } from "@/components/ui/separator";


import { columns, BrandColumn } from "./columns";


interface BrandsClientProps {
  data: BrandColumn[];
}

export const BrandsClient: React.FC<BrandsClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Brands (${data.length})`} subtitle="Manage brands for your store" />
        <Button onClick={() => router.push(`/dashboard/brands/create`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" subtitle="API Calls for Brands" />
      <Separator />
     
    </>
  );
};
