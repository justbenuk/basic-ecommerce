import { getMyOrders } from "@/actions/order-actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils"
import Link from "next/link"
import Pagination from "@/components/shared/pagination/pagination"

export const metadata = {
  title: 'All Orders'
}

type searchParamsProps = {
  searchParams: Promise<{ page: string }>
}
export default async function OrdersPage({ searchParams }: searchParamsProps) {
  const { page } = await searchParams
  const orders = await getMyOrders({ page: Number(page) || 1 })

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Orders</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Delivered</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.data.map((order, idx) => (
            <TableRow key={idx}>
              <TableCell>{formatId(order.id)}</TableCell>
              <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
              <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
              <TableCell>{order.isPaid && order.paidAt ? formatDateTime(order.paidAt).dateTime : 'Not Paid'}</TableCell>
              <TableCell>{order.isDelivered && order.deliveredAt ? formatDateTime(order.deliveredAt).dateTime : 'Not Delivered'}</TableCell>
              <TableCell>
                <Link href={`/order/${order.id}`}>
                  <span className="px-2">Details</span>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {orders.totalPages > 1 && <Pagination page={Number(page) || 1} totalPages={orders.totalPages} />}
    </div>
  )
}

