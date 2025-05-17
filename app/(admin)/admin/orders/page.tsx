import { getAllOrders } from "@/actions/order-actions"
import Pagination from "@/components/shared/pagination/pagination"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { requireAdmin } from "@/lib/auth-guard"
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils"
import Link from "next/link"

export const metadata = {
  title: 'All Orders'
}

type SearchParamProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminOrdersPage({ searchParams }: SearchParamProps) {

  const { page = '1' } = await searchParams
  await requireAdmin()
  const orders = await getAllOrders({
    page: Number(page),
    limit: 2
  })

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">All Orders</h2>
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
              <TableCell className="flex gap-4">
                <Button asChild variant={'outline'} size={'sm'}>
                  <Link href={`/order/${order.id}`}>
                    Details
                  </Link>
                </Button>
                <Button asChild variant={'destructive'} size={'sm'}>
                  <Link href={`/order/${order.id}`}>
                    Delete
                  </Link>
                </Button>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {orders.totalPages > 1 && <Pagination page={Number(page) || 1} totalPages={orders.totalPages} />}
    </div>
  )
}

