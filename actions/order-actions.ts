"use server";
import { db } from "@/db/db";
import { auth } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getMyCart } from "./cart-actions";
import { getUserById } from "./user-actions";
import { insertOrderSchema } from "@/lib/validators";
import { CartItem, PaymentResult } from "@/types";
import { convertToPlainObject, formatError } from "@/lib/utils";
import { paypal } from "@/lib/paypal";
import { revalidatePath } from "next/cache";

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");

    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error("User not found");

    const user = await getUserById(userId);

    //pass the redirect back to the client...
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };
    }
    if (!user.address) {
      return {
        success: false,
        message: "No shipping address",
        redirectTo: "/shipping-address",
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "No payment method",
        redirectTo: "/payment-method",
      };
    }

    //create the order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    //create a transaction to create both order and order item
    const insertedOrderId = await db.$transaction(async (tx) => {
      //create the order
      const insertedOrder = await tx.order.create({ data: order });
      // create the order items from cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }

      //clear the cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });
      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order not created");
    return {
      success: true,
      message: "Order Created",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: "Order Failed",
    };
  }
}

export async function getOrderById(orderId: string) {
  const data = await db.order.findFirst({
    where: { id: orderId },
    include: {
      OrderItem: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return convertToPlainObject(data);
}

//create new paypal order
export async function createPaypalOrder(orderId: string) {
  try {
    const order = await db.order.findFirst({
      where: { id: orderId },
    });

    if (order) {
      //create paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      //update the order with payment response
      await db.order.update({
        where: { id: orderId },
        data: {
          paymentresult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            pricePaid: 0,
          },
        },
      });

      return {
        success: true,
        message: "item order created",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function approvePaypalOrder(
  orderId: string,
  data: { orderID: string },
) {
  try {
    const order = await db.order.findFirst({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    const captureData = await paypal.capturePayment(data.orderID);

    if (
      !captureData ||
      captureData.id !== (order.paymentresult as PaymentResult)?.id ||
      captureData.status !== "COMPLETED"
    ) {
      throw new Error("Error in Paypal payment");
    }

    //update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });
    revalidatePath(`/order/${orderId}`);
    return {
      success: true,
      message: "Your order has been paid",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  const order = await db.order.findFirst({
    where: { id: orderId },
    include: {
      OrderItem: true,
    },
  });

  if (!order) throw new Error("Order not found");
  if (order.isPaid) throw new Error("Order is paid");
  await db.$transaction(async (tx) => {
    //change stock levels
    for (const item of order.OrderItem) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.qty } },
      });
    }

    //set order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentresult: paymentResult,
      },
    });
  });
  //get updated order
  const updatedOrder = await db.order.findFirst({
    where: { id: orderId },
    include: {
      OrderItem: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!updatedOrder) throw new Error("Order not found");
}

//get the users orders
export async function getMyOrders({
  limit = 15,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) throw new Error("User not authorised");

  const data = await db.order.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const dataCount = await db.order.count({
    where: { userId: session?.user?.id },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}
