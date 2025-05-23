import { deleteOrder, getAllOrders } from "@/actions/order-actions"
import DeleteDialog from "@/components/shared/delete-dialog"
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
    limit: 20
  })

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">All Orders</h2>
      <Table className="border rounded-xl mt-10">
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
            <TableRow key={idx} className="even:bg-muted">
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
                <DeleteDialog action={deleteOrder} id={order.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {orders.totalPages > 1 && <Pagination page={Number(page) || 1} totalPages={orders.totalPages} />}
    </div>
  )
}

