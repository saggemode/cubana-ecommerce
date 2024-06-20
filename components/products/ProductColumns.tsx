"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom/Delete";
import Link from "next/link";


export interface ProductColumn {
  id: string
  name: string
  isFeatured: boolean
  isArchived: boolean
  price: string // Change 'string' to 'number'
  category: string | undefined
  brand: string | undefined
  size: string | undefined
  color: string | undefined
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link href={`/products/${row.original.id}`} className="hover:text-red-1">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },

  {
    accessorKey: 'price',
    header: 'Price ($)',
  },
  {
    accessorKey: 'stock',
    header: 'Stock ($)',
  },
  {
    id: 'actions',
    cell: ({ row }) => <Delete item="product" id={row.original.id} />,
  },
]
