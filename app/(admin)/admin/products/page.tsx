import { requireAdmin } from "@/lib/auth-guard"
import Link from "next/link"
import { deleteProduct, getAllProducts } from "@/actions/product-actions"
import { formatCurrency, formatId } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Pagination from "@/components/shared/pagination/pagination"
import DeleteDialog from "@/components/shared/delete-dialog"

export const metadata = {
  title: 'All Products'
}

export default async function AdminProductsPage(props: {
  searchParams: Promise<{ page: string, query: string, category: string }>
}) {
  await requireAdmin()
  const searchParams = await props.searchParams
  const page = Number(searchParams.page) || 1
  const searchtext = searchParams.query || ''
  const category = searchParams.category || ''
  const products = await getAllProducts({ query: searchtext, page, category })

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
        <Button asChild variant={'default'}>
          <Link href={'/admin/products/create'}>Create Product</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{formatId(product.id)}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className={`${product.stock < 3 && 'text-red-500 font-bold'}`}>{product.stock}</TableCell>
              <TableCell className={`${Number(product.rating) < 4.0 && 'text-red-500 font-bold'}`}>{product.rating}</TableCell>
              <TableCell className="flex space-x-4">
                <Button asChild variant={'outline'} size={'sm'}>
                  <Link href={`/admin/products/${product.id}`}>Edit</Link>
                </Button>
                <Button asChild variant={'outline'} size={'sm'}>
                  <DeleteDialog action={deleteProduct} id={product.id} />
                </Button>
              </TableCell>
            </TableRow>
          ))}</TableBody>
      </Table>
      {products?.totalPages && products.totalPages > 1 && (
        <Pagination page={page} totalPages={products.totalPages} />
      )}
    </div>
  )
}

