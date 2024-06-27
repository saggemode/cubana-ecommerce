import { Icons } from '@/components/icons'
import { shippingAddressSchema } from '@/schemas'
import type { z } from 'zod'
import type {
  //CustomerInformation,
  Order,
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

// export interface ShippingAddress {
//   id: string
//   fullName: string
//   streetAddress: string
//   postalCode: string
//   city: string
//   country: string
// }

export interface ShippingAddress {
  fullName: string
  streetAddress: string
  city: string
  country: string | null
  postalCode?: string | null
  lat?: number
  lng?: number
}

//  export type ShippingAddress = z.infer<typeof shippingAddressSchema>

export interface Product {
  id: string
  name: string
  description: string | null
  slug: string
  price: number | null
  discount: number | null
  quantity?: number // Add the quantity property here
  stock: number | null
  rating: number | null
  isFeatured: boolean
  isArchived: boolean
  isAvailable?: boolean // Optional

  //orders :   OrderItem[]
  //customerInformation: CustomerInformation[];
  images: Image[]
  category?: Category | null
  size?: Size | null
  brand?: Brand | null
  color?: Color | null
}

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
  // description: string | null;
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
  | 'amex'
  | 'diners'
  | 'discover'
  | 'eftpos_au'
  | 'jcb'
  | 'mastercard'
  | 'unionpay'
  | 'visa'
  | 'opay'
  | 'unknown'

export type MainNavItem = NavItemWithOptionalChildren

export type SidebarNavItem = NavItemWithChildren
