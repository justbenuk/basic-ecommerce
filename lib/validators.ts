import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly 2 decimal places",
  );

//inserting product schema
export const insertProductScheme = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least 1 image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

export const updateProductScheme = insertProductScheme.extend({
  id: z.string().min(1, "Id is required"),
});

//scheme for signing users in
export const signInFormScheme = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least characters"),
});

//scheme for signing users up
export const signUpFormScheme = z
  .object({
    name: z.string().min(3, "Name must at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least characters"),
    confirmPassword: z.string().min(6, "Confirm Password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords dont match",
    path: ["confirmPassword"],
  });

//cart schema
export const cartItemScheme = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a posative number"),
  image: z.string().min(1, "Image is required"),
  price: currency,
});

export const insertCartScheme = z.object({
  items: z.array(cartItemScheme),
  itemsPrice: currency,
  totalPrice: currency,
  taxPrice: currency,
  shippingPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  streetAddress: z.string().min(1, "Street Adress is required"),
  city: z.string().min(1, "City is required"),
  postCode: z.string().min(1, "Postcode is required"),
  country: z.string().min(1, "Country is required"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

const PAYMENT_METHODS = ["Paypal", "Stripe", "Cash On Delivery"];

//schema for pm
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Must choose a payment method",
  });

export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment method",
  }),
  shippingAddress: shippingAddressSchema,
});

export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

//profile scheme
export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().min(1, "Email is required"),
});
