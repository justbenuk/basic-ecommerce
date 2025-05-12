'use client'
import { CartItem } from "@/types"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { addCartItem } from "@/actions/cart-actions"


export default function AddToCart({ item }: { item: CartItem }) {

  const router = useRouter()

  async function handleAddToCart() {
    const response = await addCartItem(item)

    if (!response.success) {
      return toast(response.message)
    }

    toast(item.name, {
      description: response.message,
      action: {
        label: 'View Cart',
        onClick: () => router.push('/cart')
      }
    })
  }

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}><Plus /> Add to cart</Button>
  )
}

