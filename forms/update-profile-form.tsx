'use client'
import { updateProfile } from "@/actions/user-actions"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { updateProfileSchema } from "@/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"


export default function UpdateProfileForm() {
  const { data: session, update } = useSession()
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? ''
    }
  })

  async function onSubmit(values: z.infer<typeof updateProfileSchema>) {
    const response = await updateProfile(values)

    if (!response.success) {
      return toast('Something Went Wrong', {
        description: 'Unable to update profile'
      })
    }

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name
      }
    }

    await update(newSession)

    return toast('Update Profile', {
      description: 'Profile updated successfully'
    })


  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input disabled placeholder="email" className="input-field" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="name" className="input-field" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" size={'lg'} className="button col-span-2 w-full" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Submittin...' : 'Update Profile'}</Button>
      </form>
    </Form>
  )
}

