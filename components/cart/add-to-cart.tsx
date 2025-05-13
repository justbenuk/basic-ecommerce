'use client'
import { Cart, CartItem } from "@/types"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { Plus, Minus, Loader } from "lucide-react"
import { toast } from "sonner"
import { addCartItem, removeItemFromCart } from "@/actions/cart-actions"
import { useTransition } from "react"

export default function AddToCart({ cart, item }: { cart?: Cart, item: CartItem }) {

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  async function handleAddToCart() {
    startTransition(
      //@ts-expect-error - ill fix this soon
      async () => {
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
    )
  }

  //check if item is in cart
  const existItem = cart && cart.items.find((x) => x.productId === item.productId)

  async function handleRemoveFromCart() {
    //@ts-expect-error - ill fix this soon
    startTransition(async () => {
      const response = await removeItemFromCart(item.productId)

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
    })

  }

  return (
    existItem ? (
      <div>
        <Button type="button" variant={'outline'} onClick={handleRemoveFromCart}>
          {isPending ? (<Loader size={4} className="animate-spin" />) : (<Minus size={4} />)}
        </Button>
        <span className="px-2">{existItem.qty}</span>
        <Button type="button" variant={'outline'} onClick={handleAddToCart}>
          {isPending ? (<Loader size={4} className="animate-spin" />) : (<Plus size={4} />)}
        </Button>
      </div>
    ) : (
      <Button className="w-full" type="button" onClick={handleAddToCart}><Plus /> Add to cart</Button >
    )
  )
}

