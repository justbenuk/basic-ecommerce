import {
  insertProductScheme,
  insertCartScheme,
  cartItemScheme,
  shippingAddressSchema,
} from '@/lib/validators';
import { z } from 'zod';

export type Product = z.infer<typeof insertProductScheme> & {
  id: string;
  rating: number;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartScheme>;
export type CartItem = z.infer<typeof cartItemScheme>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
