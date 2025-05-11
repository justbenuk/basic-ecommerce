import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CredentialsSigninForm from "@/forms/credentials-signin-form"
import { APP_NAME } from "@/lib/constants"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: 'Sign In'
}

export default async function SignInPage() {

  //get the user session so we can redirect
  const session = await auth()

  //redirect user if they have logged in
  if (session) {
    return redirect('/')
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href={'/'} className="flex-center">
            <Image src={'/images/logo.svg'} width={100} height={100} alt={APP_NAME} />
          </Link>
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CredentialsSigninForm />
        </CardContent>
      </Card>
    </ div>
  )
}

