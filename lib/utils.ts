import { type ClassValue, clsx } from 'clsx'
import { NextResponse } from 'next/server'
import { twMerge } from 'tailwind-merge'
import { ZodError } from 'zod'
import { Metadata } from 'next'
import qs from 'query-string'
import { ReadonlyURLSearchParams } from 'next/navigation'

import { Active, DataRef, Over } from '@dnd-kit/core'
import { ColumnDragData } from '@/components/kanban/board-column'
import { TaskDragData } from '@/components/kanban/task-card'
import { OrderWithProduct } from '@/types'

type DraggableData = ColumnDragData | TaskDragData

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`
}

export const formatId2 = (x: string) => {
  return `..${x.substring(20, 24)}`
}



export const convertDocToObj = (doc: any) => {
  doc.id = doc.id.toString()
  return doc
}


export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const formatNumber22 = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// export function formatNumber(num: number) {
//   return (num / 100).toFixed(2).toLocaleString()
// }



export function xor(a: boolean, b: boolean) {
  return a !== b
}

export function generateRandomNumber(): number {
  return Math.floor(Math.random() * 100) + 1
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 2,
})

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
})

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount)
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount))
  } else {
    return 'NaN'
  }
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
  }).format(price)
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  }
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  )
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  )
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  )
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  }
}

export const formatError = (error: any): string => {
  if (error.name === 'ZodError') {
    const fieldErrors = Object.keys(error.errors).map((field) => {
      const errorMessage = error.errors[field].message
      return `${error.errors[field].path}: ${errorMessage}` // field: errorMessage
    })
    return fieldErrors.join('. ')
  } else if (error.name === 'ValidationError') {
    const fieldErrors = Object.keys(error.errors).map((field) => {
      const errorMessage = error.errors[field].message
      return errorMessage
    })
    return fieldErrors.join('. ')
  } else {
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message)
  }
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}

export const formatNumberWithDecimal = (num: number): string => {
  const [int, decimal] = num.toString().split('.')
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : int //12.1 => 12.10
}

export const round2 = (value: number | string) => {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100 // avoid rounding errors
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100
  } else {
    throw new Error('value is not a number nor a string')
  }
}

// export function formatDate(input: string | number): string {
//    const date = new Date(input)
//    return date.toLocaleDateString('en-US', {
//       month: 'long',
//       day: 'numeric',
//       year: 'numeric',
//    })
// }

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString()
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`

  return `${pathname}${queryString}`
}

export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`
  return `http://localhost:${process.env.PORT ?? 3000}${path}`
}

export function isVariableValid(variable: any) {
  return variable !== null && variable !== undefined
}

export function validateBoolean(variable: any, value: any) {
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

export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string
  key: string
  value: string | null
}) {
  const currentUrl = qs.parse(params)

  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

export function constructMetadata({
  title = 'Auxdoris - E-commerce',
  description = 'Auxdoris is an open-source software to make chatting to your PDF files easy.',
  image = '/thumbnail.png',
  icons = '/favicon.ico',
  noIndex = false,
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
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@joshtriedcoding',
    },
    icons,
    metadataBase: new URL('https://quill-jet.vercel.app'),
    //   themeColor: '#FFF',
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>
} {
  if (!entry) {
    return false
  }

  const data = entry.data.current

  if (data?.type === 'Column' || data?.type === 'Task') {
    return true
  }

  return false
}

export const transformOrderData = (order: OrderWithProduct) => {
  return order.orderItem.map((item) => ({
    ...item.product,
    quantity: item.quantity,
  }))
}

// export const transformOrderData = (order: OrderWithProduct[]) => {
//   return order.map(order => order.orderItem.map(item => ({
//     ...item.product,
//     quantity: item.quantity,
//   })));
// };
