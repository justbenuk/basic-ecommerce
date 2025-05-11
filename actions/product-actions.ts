'use server'
import { convertToPlainObject } from "@/lib/utils"
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants"
import { db } from "@/db/db"

//Get latest products
export async function getLatesProducts() {

  const data = await db.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' }
  })

  return convertToPlainObject(data)
}

//get a single product
export async function getProductBySlug(slug: string) {
  return await db.product.findFirst({
    where: {
      slug
    }
  })
}
