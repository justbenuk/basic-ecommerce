'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useActionState } from "react"
import { signUpUser } from "@/actions/user-actions"
import { useFormStatus } from "react-dom"
import { useSearchParams } from "next/navigation"

export default function CredentialsSignupForm() {
  const defaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''

  }

  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: ''
  })

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackurl') || '/'

  function SignInButton() {
    const { pending } = useFormStatus()
    return (
      <Button disabled={pending} className="w-full" variant={'default'}>
        {pending ? 'Signing Up...' : 'Sign Up'}
      </Button>
    )
  }

  return (
    <form action={action}>
      <div className="space-y-6">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id='name' name='name' type='name' required autoComplete="name" defaultValue={defaultValues.name} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id='email' name='email' type='email' required autoComplete="email" defaultValue={defaultValues.email} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id='password' name='password' type='password' required autoComplete="password" defaultValue={defaultValues.password} />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Conform Password</Label>
          <Input id='confirmPassword' name='confirmPassword' type='password' required defaultValue={defaultValues.confirmPassword} />
        </div>
        <div>
          <SignInButton />
        </div>
        {data && !data.success && (
          <div className="text-center text-destructive">
            {data.message}
          </div>
        )}
        <div className="text-sm text-center text-muted-foreground">Already have an account? <Link href='/sign-in' className="link">Sign In</Link></div>
      </div>
    </form>
  )
}

