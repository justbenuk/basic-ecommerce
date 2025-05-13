import { auth } from "@/auth"
import { getMyCart } from "@/actions/cart-actions"
import { redirect } from "next/navigation"
import { ShippingAddress } from "@/types"
import { getUserById } from "@/actions/user-actions"
import ShippingAddressForm from "@/forms/shipping-address-form"

export const metadata = {
  title: 'Shipping Assdress'
}

export default async function ShippingAddressPage() {

  //get the users cart
  const cart = await getMyCart()
  //check if the user has a valid cart
  if (!cart || cart.items.length === 0) redirect('/cart')

  //get the session - to get the user id
  const session = await auth()
  //get the user id 
  const userId = session?.user?.id
  if (!userId) throw new Error('No user id')

  const user = await getUserById(userId)

  return (
    <div>
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </div>
  )
}

