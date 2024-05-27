"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
//import ImageUpload from "@/components/ui/image-upload";
import Heading from "@/components/Heading";

import { Separator } from "@/components/ui/separator";


import { columns, CategoryColumn } from "./columns";


interface CategoriesClientProps {
  data: CategoryColumn[];
}

export const CategoriesClient: React.FC<CategoriesClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Categories (${data.length})`} subtitle="Manage categories for your store" />
        <Button onClick={() => router.push(`/dashboard/categories/create`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" subtitle="API Calls for Categories" />
      <Separator />
     
    </>
  );
};
