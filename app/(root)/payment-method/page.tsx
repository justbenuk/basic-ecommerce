import CheckoutSteps from "@/components/checkout/checkout-steps"
import { auth } from "@/auth"
import { getUserById } from "@/actions/user-actions"
import PaymentMethodForm from "@/forms/payment-method-form"


export const metadata = {
  title: 'Payment Method'
}

export default async function PaymentMethodPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) throw new Error('User Not Found')

  const user = await getUserById(userId)

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm PPM={user.paymentMethod} />
    </>
  )
}

