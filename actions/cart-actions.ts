'use server'
import { db } from "@/db/db"
import { auth } from "@/auth"
import { convertToPlainObject, formatError, round2 } from "@/lib/utils"
import { CartItem } from "@/types"
import { cookies } from 'next/headers'
import { cartItemScheme, insertCartScheme } from "@/lib/validators"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

// calculate the cart prices 
function calcPrice(items: CartItem[]) {
  const itemsPrice = round2(items.reduce(
    (acc, item) => acc + Number(item.price) * item.qty, 0)
  ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.20 * itemsPrice),
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice)

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  }
}

export async function addCartItem(data: CartItem) {

  try {
    //check for the cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value

    if (!sessionCartId) throw new Error('Cart session not found')

    // get the user id 
    const session = await auth()
    const userId = session?.user?.id ? (session.user.id as string) : undefined

    const cart = await getMyCart()

    //parse and validate item
    const item = cartItemScheme.parse(data)

    //find the product in the db
    const product = await db.product.findFirst({
      where: { id: item.productId }
    })

    if (!product) throw new Error('product not found')
    if (!cart) {
      //create a new cart 
      const newCart = insertCartScheme.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item])
      })

      //add cart to db 
      await db.cart.create({
        data: newCart
      })

      revalidatePath('/product')

      return {
        success: true,
        message: `${product.name} added to cart`
      }
    } else {
      // check if item is in the cart
      const existItem = (cart.items as CartItem[]).find((x) => x.productId === item.productId)
      if (existItem) {
        //check the stock
        if (product.stock < existItem.qty + 1) {
          throw new Error('Not enough stock')
        }

        //increae the qty
        (cart.items as CartItem[]).find((x) => x.productId === item.productId)!.qty = existItem.qty + 1
      } else {
        if (product.stock < 1) throw new Error('not enough stock')
        cart.items.push(item)
      }
      await db.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[])
        }
      })

      revalidatePath(`/prodcut/${product.slug}`)
      return {
        success: true,
        message: `${existItem ? 'updated in' : 'added to'} cart`
      }

    }


  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get('sessionCartId')?.value
  if (!sessionCartId) throw new Error('Cart session not found')

  // get the user id 
  const session = await auth()
  const userId = session?.user?.id ? (session.user.id as string) : undefined

  //get user cart from db 
  const cart = await db.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId }
  })

  if (!cart) return undefined

  //convert decimals then return 
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  })

}

export async function removeItemFromCart(productId: string) {
  try {

    const sessionCartId = (await cookies()).get('sessionCartId')?.value
    if (!sessionCartId) throw new Error('Cart session not found')

    // get the product 
    const product = await db.product.findFirst({
      where: { id: productId }
    })

    if (!product) throw new Error('Product not found')

    //get user cart
    const cart = await getMyCart()

    if (!cart) throw new Error('No cart found')

    //check for item
    const exists = (cart.items as CartItem[]).find((x) => x.productId === product.id)
    if (!exists) throw new Error('Item not found')

    //check the qty of the product 
    if (exists.qty === 1) {
      cart.items = (cart.items as CartItem[]).filter((x) => x.productId !== product.id)
    } else {
      //decrease the qty
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty = exists.qty - 1
    }

    await db.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[])
      }
    })
    revalidatePath(`/product/${product.slug}`)

    return {
      success: true,
      message: 'was removed from cart'
    }

  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}
