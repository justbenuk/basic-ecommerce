'use client'
import { createOrder } from "@/actions/order-actions"
import { useFormStatus } from "react-dom"
import { Check, Loader } from 'lucide-react'
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function CreateOrderForm() {

  const router = useRouter()

  async function handleSumbit(event: React.FormEvent) {
    event.preventDefault()

    const response = await createOrder()
    if (response.redirectTo) {
      router.push(response.redirectTo)
    }
  }

  function PlaceOrderButton() {
    const { pending } = useFormStatus()
    return (
      <Button disabled={pending} className="w-full" variant={'default'}>
        {pending ? (<Loader size={4} className="animate-spin" />) : (<Check size={4} />)} {' '} Place Order
      </Button>
    )
  }
  return (
    <form className="w-full" onSubmit={handleSumbit}>
      <PlaceOrderButton />
    </form>
  )
}

