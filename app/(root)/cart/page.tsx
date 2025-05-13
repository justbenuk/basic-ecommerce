import { getMyCart } from "@/actions/cart-actions"
import CartTable from "@/components/cart/cart-table"

export const metadata = {
  title: 'Your Cart'
}
export default async function CartPage() {
  const cart = await getMyCart()

  return (
    <>
      <CartTable cart={cart} />
    </>
  )
}

