import { getMyCart } from "@/actions/cart-actions";
import { getUserById } from "@/actions/user-actions";
import { auth } from "@/auth";
import CheckoutSteps from "@/components/checkout/checkout-steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CreateOrderForm from "@/forms/create-order-form";
import { formatCurrency } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Place Order'
}
export default async function PlaceOrder() {
  const cart = await getMyCart()
  const session = await auth()
  const userId = session?.user?.id

  //check that we have a user
  if (!userId) throw new Error('User not found')

  // check we have everything we need for the user to complete their purchase
  const user = await getUserById(userId)
  if (!cart || cart.items.length === 0) redirect('/cart')
  if (!user.address) redirect('/shipping-Address')
  if (!user.paymentMethod) redirect('/payment-method')

  const userAddress = user.address as ShippingAddress

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className="py-4 text-2xl">Place Order</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          <Card>
            <CardContent>
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{userAddress.fullName}</p>
              <p>{userAddress.streetAddress}, {userAddress.city} {' '}</p>
              <p>{userAddress.postCode}, {userAddress.country} {' '}</p>
              <div className="mt-3">
                <Button asChild variant={'outline'}>
                  <Link href={'/shipping-address'}>Edit</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{user.paymentMethod}</p>
              <div className="mt-3">
                <Button asChild variant={'outline'}>
                  <Link href={'/payment-method'}>Edit</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="text-xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link href={`/product/${item.slug}`} className="flex items-center">
                          <Image src={item.image} alt={item.name} width={50} height={50} />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.qty}</span>
                      </TableCell>
                      <TableCell>£{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <div>Items</div>
                <div>{formatCurrency(cart.itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax Price</div>
                <div>{formatCurrency(cart.taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{formatCurrency(cart.shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Total</div>
                <div>{formatCurrency(cart.totalPrice)}</div>
              </div>
            </CardContent>
          </Card>
          <CreateOrderForm />
        </div>
      </div>
    </>
  )
}

