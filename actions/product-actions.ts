"use server";
import { convertToPlainObject, formatError } from "@/lib/utils";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";
import { db } from "@/db/db";
import { revalidatePath } from "next/cache";
import { insertProductScheme, updateProductScheme } from "@/lib/validators";
import { z } from "zod";

//Get latest products
export async function getLatesProducts() {
  const data = await db.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data);
}

//get a single product
export async function getProductBySlug(slug: string) {
  return await db.product.findFirst({
    where: {
      slug,
    },
  });
}

//get all products
export async function getAllProducts({
  query,
  limit = 20,
  page,
  category,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
}) {
  const q = query;
  const c = category;

  const data = await db.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: 'desc'
    }
  });

  const dataCount = await db.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

//delete a product
export async function deleteProduct(id: string) {
  try {
    const productExits = await db.product.findFirst({
      where: { id },
    });

    if (!productExits) throw new Error("Product Not Found");

    await db.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    return { success: true, message: "Product Deleted" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function createProduct(data: z.infer<typeof insertProductScheme>) {
  try {
    const product = insertProductScheme.parse(data);

    await db.product.create({ data: product });
    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product Added",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateProduct(data: z.infer<typeof updateProductScheme>) {

  try {
    const product = updateProductScheme.parse(data);
    const productExists = await db.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error("Product not found");

    await db.product.update({
      where: { id: product.id },
      data: product,
    });
    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product updated",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
