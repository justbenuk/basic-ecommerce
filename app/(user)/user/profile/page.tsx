import UpdateProfileForm from "@/forms/update-profile-form";
import { SessionProvider } from 'next-auth/react'
import { auth } from "@/auth";
import { notFound } from "next/navigation";

export const metadata = {
  title: 'Your Profile'
}

export default async function ProfilePage() {
  const session = await auth()

  if (!session) return notFound()

  return (
    <SessionProvider session={session}>
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="h2-bold">Profile</h2>
        <UpdateProfileForm />
      </div>
    </SessionProvider>
  )
}

