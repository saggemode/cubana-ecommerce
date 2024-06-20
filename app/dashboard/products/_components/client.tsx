'use client'

import { LuPlus } from 'react-icons/lu'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { ProductColumn, columns } from './columns'
import Heading from '@/components/Heading'

import { DataTable } from '@/components/ui/data-table'

interface ProductsClientProps {
  data: ProductColumn[]
}

export const ProductsClient: React.FC<ProductsClientProps> = ({ data }) => {
  const router = useRouter()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          subtitle="Manage products for your store"
        />
        <Button onClick={() => router.push(`/dashboard/products/new`)}>
          <LuPlus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" subtitle="API Calls for Products" />
      <Separator />
    </>
  )
}
