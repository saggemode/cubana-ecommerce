import { Icons } from '@/components/icons'
import { shippingAddressSchema, paymentResultSchema } from '@/schemas'
import type { z } from 'zod'
import type {
  //CustomerInformation,
  Order,
  Review,
  Cart,
  CartItem,
  Product as OrderTypeProduct,
} from '@prisma/client'

export interface CustomerInformation {
  id: string
  name: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
}

export interface ShippingAddress {
  id: string
  orderId: string
  fullName: string
  address: string
  city: string
  country: string
  postalCode: string
  lat?: number
  lng?: number
}

//  export type ShippingAddress = z.infer<typeof shippingAddressSchema>
export type Review = InferSelectModel<typeof Review> & {
  user?: { name: string }
}

//export type Cart = InferSelectModel<typeof Cart>
export type CartItem = z.infer<typeof cartItemSchema>
export type PaymentResult = z.infer<typeof paymentResultSchema>

export type Order = Prisma.OrderGetPayload<{
  include: {
    user: true
    items: true
    shippingAddress: true
    paymentResult: true
  }
}>

export type OrderItem = Prisma.OrderItemGetPayload<{
  include: {
    product: true
  }
}>

export type Product = Prisma.ProductGetPayload<{
  include: {
    size: true
    brand: true
    images: true
    color: true
    category: true
  }
}>

// export type Order = {
//   id: string
//   user?: {
//     name: string | null
//   }
//   items: [OrderItem]
//   shippingAddress: {
//     fullName: string
//     address: string
//     city: string
//     postalCode: string
//     country: string
//   }
//   paymentMethod: string
//   paymentResult?: { id: string; status: string; email_address: string }
//   itemsPrice: number
//   shippingPrice: number
//   taxPrice: number
//   totalPrice: number
//   isPaid: boolean
//   isDelivered: boolean
//   paidAt?: DateTime
//   deliveredAt?: DateTime
//   createdAt: DateTime
// }

// export type OrderItem = {
//   id: string
//   name: string
//   quantity: number
//   image: string
//   price: number
//   color: string
//   size: string
// }

export type ShippingAddress = Prisma.ShippingAddressGetPayload<{}>

export type PaymentResult = Prisma.PaymentResultGetPayload<{}>

// export interface OrderItem {
//   id: string
//   name: string
//   description: string | null
//   slug: string
//   price: number | null
//   discount: number | null
//   quantity?: number // Add the quantity property here
//   stock: number | null
//   rating: number | null
//   isFeatured: boolean
//   isArchived: boolean
//   isAvailable?: boolean // Optional

//   //orders :   OrderItem[]
//   //customerInformation: CustomerInformation[];
//   images: Image[]
//   category?: Category | null
//   size?: Size | null
//   brand?: Brand | null
//   color?: Color | null
// }

// export interface Product {
//   id: string
//   name: string
//   description: string | null
//   slug: string
//   price: number | null
//   discount: number | null
//   quantity?: number // Add the quantity property here
//   stock: number | null
//   rating: number | null
//   isFeatured: boolean
//   isArchived: boolean
//   isAvailable?: boolean // Optional

//   //orders :   OrderItem[]
//   //customerInformation: CustomerInformation[];
//   images: Image[]
//   category?: Category | null
//   size?: Size | null
//   brand?: Brand | null
//   color?: Color | null
// }

export interface IBreadcrumb {
  breadcrumb: string
  href: string
}

export interface Image {
  id: string
  url: string
}

export interface Billboard {
  id: string
  label: string
  imageUrl: string
}

export interface Category {
  id: string | null
  title: string | null
}

export interface Brand {
  id: string
  name: string
}

export interface Size {
  id: string
  name: string
  value: string
}

export interface Color {
  id: string
  name: string
  value: string
}

export type User = {
  id: string
  role: 'user' | 'admin' | 'moderator'
  name: string
  email: string
  phone: string
  address: string
  token: string
}

export type ProtectedRoute = {
  path: string
  type: 'auth' | 'all' | 'user' | 'admin'
}

export type SideNavItem = {
  title: string
  path: string
  icon?: JSX.Element
  submenu?: boolean
  subMenuItems?: SideNavItem[]
}

export type SideNavItemGroup = {
  title: string
  menuList: SideNavItem[]
}

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
  description?: string
  children?:string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[]
}

export interface FooterItem {
  title: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}

export type Menu = {
  title: string
  path: string
}

export interface ResponseData {
  url: string
  // Include other properties as needed
}

export interface IconProps {
  width: number
  height: number
  fill?: string
}

export interface CloudinaryResponse {
  secure_url: string
  // add other properties if needed
}

// order types
export interface OrderWithCustomerInformation extends Order {
  customerInformation: CustomerInformation
}

export interface OrderWithProduct extends OrderWithCustomerInformation {
  orderItem: {
    product: OrderTypeProduct
    quantity: number
  }[]
}

export interface OrderProduct extends OrderTypeProduct {
  quantity: number
}

export type CreditCard =
  | 'mastercard'
  | 'unionpay'
  | 'visa'
  | 'opay'
  | 'unknown'
  | 'moniepoint'

export type MainNavItem = NavItemWithOptionalChildren

export type SidebarNavItem = NavItemWithChildren
