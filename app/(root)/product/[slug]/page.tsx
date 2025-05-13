import { getProductBySlug } from "@/actions/product-actions"
import { notFound } from "next/navigation"
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from "@/components/ui/card"
import ProductPrice from "@/components/products/product-price"
import ProductImages from "@/components/products/product-images"
import AddToCart from "@/components/cart/add-to-cart"
import { getMyCart } from "@/actions/cart-actions"

type ParamsProps = {
  params: Promise<{ slug: string }>
}

//get the metadata
export async function generateMetadata({ params }: ParamsProps) {
  const { slug } = await params

  const product = await getProductBySlug(slug)

  if (product) {
    return {
      title: product.name,
      description: product.description
    }
  }
  return null
}

export default async function ProductDetailPage({ params }: ParamsProps) {

  //first we get the slug that was passed in
  const { slug } = await params

  //then we use that slug in the server action to get the product
  const product = await getProductBySlug(slug)

  //check to make sure we get a product back 
  if (!product) return notFound()

  const cart = await getMyCart()

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>{product.brand} {product.category}</p>
              <h1 className="h3-bold">{product.name}</h1>
              <p>{product.rating} of {product.numReviews} Reviews</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ProductPrice value={Number(product.price)} className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2" />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.description}</p>
            </div>
          </div>
          <div>
            <Card>
              <CardContent>
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant={'outline'}>In stock</Badge>
                  ) : (
                    <Badge variant={'destructive'}>Out of stock</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        qty: 1,
                        image: product.images![0]
                      }} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}

