import { getProductBySlug } from "@/actions/product-actions"
import { notFound } from "next/navigation"
import { Badge } from '@/components/ui/badge'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ProductPrice from "@/components/products/product-price"
import ProductImages from "@/components/products/product-images"

export default async function ProductDetailPage(props: {
  params: Promise<{ slug: string }>
}) {

  //first we get the slug that was passed in
  const { slug } = await props.params

  //then we use that slug in the server action to get the product
  const product = await getProductBySlug(slug)

  //check to make sure we get a product back 
  if (!product) return notFound()

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
                    <Button className="w-full">Add to cart</Button>
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

