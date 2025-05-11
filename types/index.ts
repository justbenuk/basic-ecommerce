import { insertProductScheme } from '@/lib/validators'
import { z } from 'zod'


export type Product = z.infer<typeof insertProductScheme> & {
  id: string
  rating: number
  createdAt: Date
}
