'use client'
import { Cart } from "@/types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTransition } from "react"
import { addCartItem, removeItemFromCart } from "@/actions/cart-actions"
import { ArrowRight, Loader, Minus, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { TableBody, Table, TableHead, TableHeader, TableRow, TableCell } from "../ui/table"
import { Button } from "../ui/button"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent } from "../ui/card"

export default function CartTable({ cart }: { cart?: Cart }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  return (
    <div>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>Cart is empty. <Link href={'/'}>Go Shopping</Link></div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Link href={`/product/${item.slug}`} className="flex items-center">
                        <Image src={item.image} alt={item.name} width={50} height={50} />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button disabled={isPending} variant={'outline'} type="button" onClick={() => startTransition(async () => {
                        const res = await removeItemFromCart(item.productId)

                        if (!res.success) {
                          toast('', {
                            description: res.message
                          })
                        }
                      })}>
                        {isPending ? (<Loader size={4} className="animate-spin" />) : <Minus size={4} />}
                      </Button>
                      <span>{item.qty}</span>
                      <Button disabled={isPending} variant={'outline'} type="button" onClick={() => startTransition(async () => {
                        const res = await addCartItem(item)

                        if (!res.success) {
                          toast(item.name, {
                            description: res.message
                          })
                        }
                      })}>
                        {isPending ? (<Loader size={4} className="animate-spin" />) : <Plus size={4} />}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">£{item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="gap-4">
              <div className="pb-3 text-xl">
                Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)}):
                <span className="font-bold"> {formatCurrency(cart.itemsPrice)}</span>
              </div>
              <Button className="w-full" disabled={isPending} onClick={() => startTransition(() => router.push('/shipping-address'))}>
                {isPending ? (
                  <Loader size={4} className="animate-spin" />
                ) : (
                  <ArrowRight size={4} />
                )}
                Proceed to checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
