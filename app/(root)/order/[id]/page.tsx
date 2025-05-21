import { getOrderById } from "@/actions/order-actions"
import { auth } from "@/auth"
import OrderdetailsTable from "@/components/order/order-details-table"
import { ShippingAddress } from "@/types"
import { notFound } from "next/navigation"

export const metadata = {
  title: 'Your Order'
}

type ParamsProps = {
  params: Promise<{ id: string }>
}

export default async function OrderDetailsPage({ params }: ParamsProps) {
  const session = await auth()
  const { id } = await params
  const order = await getOrderById(id)
  const paypalClientId = process.env.PAYPAL_CLIENT_ID || 'sb'

  if (!order) return notFound()

  return (
    <>
      <OrderdetailsTable order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress
      }}
        paypalClientId={paypalClientId} isAdmin={session?.user?.role === 'admin' || false} />
    </>
  )
}

