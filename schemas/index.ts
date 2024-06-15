import * as z from "zod";
import { UserRole } from "@prisma/client";
import { PAYMENT_METHODS } from "@/constants/constant";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER, UserRole.MODERATOR]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    phone: z.optional(z.string()),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const BannerSchema = z.object({
  label: z.string().min(4, {
    message: "Minimum 6 characters required",
  }),
  imageUrl: z.string().min(1),
});

export const CategorySchema = z.object({
  title: z.string().min(1, {
    message: "Minimum 1 characters required",
  }),
  // description: z.string().min(4, {
  //   message: "Minimum 6 characters required",
  // }),
});

export const BrandSchema = z.object({
  name: z.string().min(1, {
    message: "Minimum 1 characters required",
  }),
});

export const SizeSchema = z.object({
  name: z.string().min(1, {
    message: "Minimum 1 characters required",
  }),

  value: z.string().min(1, {
    message: "Minimum 1 characters required",
  }),
});

export const ColorSchema = z.object({
  name: z.string().min(2, {
    message: "Minimum 1 characters required",
  }),

  value: z.string().min(4).max(9).regex(/^#/, {
    message: "String must be a valid hex code",
  }),
});


const MAX_FILE_SIZE = 10000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const ProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  stock: z.coerce.number().min(1),
  description: z.string().min(1),
  discount: z.coerce.number().optional(),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  brandId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

export const productActionSchema = z.object({
  ...ProductSchema.shape, // Spread all fields from ProductSchema
});

export const updateProductActionSchema = z.object({
  ...ProductSchema.shape,
  id: z.string(),
});

export const deleteProductActionSchema = z.object({
  id: z.string(),
});

export const updateProductStatusActionSchema = z.object({
  id: z.string(),
  status: z.enum(["ACTIVE", "DRAFT"]),
});

const OptionValueSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  stock: z.number(),
  variantId: z.number(),
});

const VariantSchema = z.object({
  id: z.number(),
  name: z.string(),
  productId: z.number(),
  optionValues: z.array(OptionValueSchema), // Add this line
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  streetAddress: z.string().min(3, 'Address must be at least 3 characters'),
  city: z.string().min(3, 'city must be at least 3 characters'),
  postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
  country: z.string().min(3, 'Country must be at least 3 characters'),
  lat: z.number().optional(),
  lng: z.number().optional(),
})

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, 'Payment method is required'),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ['type'],
    message: 'Invalid payment method',
  })

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
})
