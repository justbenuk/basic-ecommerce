import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { APP_NAME } from "@/lib/constants"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import CredentialsSignupForm from "@/forms/credentials-signup-form"

export const metadata: Metadata = {
  title: 'Sign Up'
}

type SearchParamsProps = {
  searchParams: Promise<{ callbackUrl: string }>
}

export default async function SigUpPage({ searchParams }: SearchParamsProps) {

  const { callbackUrl } = await searchParams

  //get the user session so we can redirect
  const session = await auth()

  //redirect user if they have logged in
  if (session) {
    return redirect(callbackUrl || '/')
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href={'/'} className="flex-center">
            <Image src={'/images/logo.svg'} width={100} height={100} alt={APP_NAME} />
          </Link>
          <CardTitle className="text-center">Create Account</CardTitle>
          <CardDescription className="text-center">Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CredentialsSignupForm />
        </CardContent>
      </Card>
    </ div>
  )
}

