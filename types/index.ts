import { insertProductScheme, insertCartScheme, cartItemScheme } from '@/lib/validators'
import { z } from 'zod'


export type Product = z.infer<typeof insertProductScheme> & {
  id: string
  rating: number
  createdAt: Date
}

export type Cart = z.infer<typeof insertCartScheme>
export type CartItem = z.infer<typeof cartItemScheme>
