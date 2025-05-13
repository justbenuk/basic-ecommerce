"use server";
import {
  shippingAddressSchema,
  signInFormScheme,
  signUpFormScheme,
} from "@/lib/validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { db } from "@/db/db";
import { formatError } from "@/lib/utils";
import { ShippingAddress } from "@/types";

//sign in user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signInFormScheme.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid user credentials" };
  }
}

//sign user out
export async function signOutUser() {
  await signOut();
}

//sign a user up
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormScheme.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const hashedPassword = hashSync(user.password, 10);

    await db.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: user.password,
    });

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

//get a user by id
export async function getUserById(userId: string) {
  const user = await db.user.findFirst({
    where: { id: userId },
  });

  //check if a user is return
  if (!user) throw new Error("User not found");

  return user;
}

//update the users address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("No user found");

    const address = shippingAddressSchema.parse(data);

    await db.user.update({
      where: { id: userId },
      data: { address },
    });

    return {
      success: true,
      message: "User updated address successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to update address",
    };
  }
}
