import { type ClassValue, clsx } from 'clsx'
import { NextResponse } from 'next/server'
import { twMerge } from 'tailwind-merge'
import { ZodError } from 'zod'
import { Metadata } from 'next'
import { ReadonlyURLSearchParams } from 'next/navigation';

import { Active, DataRef, Over } from "@dnd-kit/core";
import { ColumnDragData } from "@/components/kanban/board-column";
import { TaskDragData } from "@/components/kanban/task-card";
import { OrderWithProduct } from '@/types'


type DraggableData = ColumnDragData | TaskDragData;

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}

export function formatNumber(num: number) {
  return (num / 100).toFixed(2).toLocaleString();
}

export function xor(a: boolean, b: boolean) {
  return a !== b;
}


export function generateRandomNumber(): number {
   return Math.floor(Math.random() * 100) + 1;
 }

export const formatter = new Intl.NumberFormat('en-US', {
   style: 'currency',
   currency: 'NGN',
   maximumFractionDigits: 2,
})

export const formatPrice = (price: number) => {
   return new Intl.NumberFormat("en-US", {
     style: "currency",
     currency: "NGN"
   }).format(price)
 }


export function formatDate(input: string | number): string {
   const date = new Date(input)
   return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
   })
}

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export function absoluteUrl(path: string) {
   if (typeof window !== 'undefined') return path
   if (process.env.VERCEL_URL)
     return `https://${process.env.VERCEL_URL}${path}`
   return `http://localhost:${
     process.env.PORT ?? 3000
   }${path}`
 }

export function isVariableValid(variable:any) {
   return variable !== null && variable !== undefined
}

export function validateBoolean(variable:any, value:any) {
   if (isVariableValid(variable) && variable === value) {
      return true
   }

   return false
}

export function isMacOs() {
   return window.navigator.userAgent.includes('Mac')
}

export function getErrorResponse(
   status: number = 500,
   message: string,
   errors: ZodError | null = null
) {
   console.error({ errors, status, message })

   return new NextResponse(
      JSON.stringify({
         status: status < 500 ? 'fail' : 'error',
         message,
         errors: errors ? errors.flatten() : null,
      }),
      {
         status,
         headers: { 'Content-Type': 'application/json' },
      }
   )
}

export function constructMetadata({
   title = "Auxdoris - E-commerce",
   description = "Auxdoris is an open-source software to make chatting to your PDF files easy.",
   image = "/thumbnail.png",
   icons = "/favicon.ico",
   noIndex = false
 }: {
   title?: string
   description?: string
   image?: string
   icons?: string
   noIndex?: boolean
 } = {}): Metadata {
   return {
     title,
     description,
     openGraph: {
       title,
       description,
       images: [
         {
           url: image
         }
       ]
     },
     twitter: {
       card: "summary_large_image",
       title,
       description,
       images: [image],
       creator: "@joshtriedcoding"
     },
     icons,
     metadataBase: new URL('https://quill-jet.vercel.app'),
   //   themeColor: '#FFF',
     ...(noIndex && {
       robots: {
         index: false,
         follow: false
       }
     })
   }
 }


 export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined,
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === "Column" || data?.type === "Task") {
    return true;
  }

  return false;
}

export const transformOrderData = (order: OrderWithProduct) => {
  return order.orderItem.map((item) => ({
    ...item.product,
    quantity: item.quantity,
  }));
};



// export const transformOrderData = (order: OrderWithProduct[]) => {
//   return order.map(order => order.orderItem.map(item => ({
//     ...item.product,
//     quantity: item.quantity,
//   })));
// };