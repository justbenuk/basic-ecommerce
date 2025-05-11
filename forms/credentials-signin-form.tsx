'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useActionState } from "react"
import { signInWithCredentials } from "@/actions/user-actions"
import { useFormStatus } from "react-dom"


export default function CredentialsSigninForm() {
  const defaultValues = {
    email: '',
    password: ''
  }

  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: ''
  })

  function SignInButton() {
    const { pending } = useFormStatus()
    return (
      <Button disabled={pending} className="w-full" variant={'default'}>
        {pending ? 'Signing In...' : 'Sign In'}
      </Button>
    )
  }

  return (
    <form action={action}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id='email' name='email' type='email' required autoComplete="email" defaultValue={defaultValues.email} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id='password' name='password' type='password' required autoComplete="password" defaultValue={defaultValues.password} />
        </div>
        <div>
          <SignInButton />
        </div>
        {data && !data.success && (
          <div className="text-center text-destructive">
            {data.message}
          </div>
        )}
        <div className="text-sm text-center text-muted-foreground">Don&apos;t have an account? <Link href='/sign-up' className="link">Sign Up</Link></div>
      </div>
    </form>
  )
}

