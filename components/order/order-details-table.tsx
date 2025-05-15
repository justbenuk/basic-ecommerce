'use client'
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils"
import { Order } from "@/types"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import Link from "next/link"
import Image from "next/image"
import { approvePaypalOrder, createPaypalOrder } from '@/actions/order-actions'
import { toast } from 'sonner'
export default function OrderdetailsTable({ order, paypalClientId }: { order: Order, paypalClientId: string }) {
  const { shippingPrice, shippingAddress, itemsPrice, OrderItem, taxPrice, totalPrice, paymentMethod, isPaid, isDelivered, id, paidAt } = order

  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer()

    let status = ''

    if (isPending) {
      status = 'Loading Paypal...'
    } else if (isRejected) {
      status = 'Loading Paypal Failed'
    }
    return status
  }

  async function handleCreatePaypalOrder() {
    const response = await createPaypalOrder(order.id)

    if (!response.success) {
      toast('Payment Error', {
        description: 'Failed to create payment'
      })
    }

    return response.data
  }

  async function handleApprovePaypalOrder(data: { orderID: string }) {
    console.log(data)
    const response = await approvePaypalOrder(order.id, data)

    console.log(response.message)

    if (response.success) {
      toast('Payment Made', {
        description: response.message
      })
    }


  }
  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatId(id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          <Card>
            <CardContent className="gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant={'secondary'}>Paid on {formatDateTime(paidAt!).dateTime}</Badge>
              ) : (
                <Badge variant={'destructive'}>Not Paid</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>{shippingAddress.streetAddress}, {shippingAddress.city}</p>
              <p>{shippingAddress.postCode}, {shippingAddress.country}</p>
              {isDelivered ? (
                <Badge variant={'secondary'}>Delivered at {formatDateTime(paidAt!).dateTime}</Badge>
              ) : (
                <Badge variant={'destructive'}>Not Delivered</Badge>
              )}
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
                  {OrderItem.map((item) => (
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
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax Price</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
            </CardContent>
          </Card>
          {/* Paypal Payment*/}
          {!isPaid && paymentMethod === 'Paypal' && (
            <div>
              <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "GBP" }}>
                <PrintLoadingState />
                <PayPalButtons createOrder={handleCreatePaypalOrder} onApprove={handleApprovePaypalOrder} />
              </PayPalScriptProvider>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

