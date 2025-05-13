'use client'
import { ShippingAddress } from "@/types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { shippingAddressSchema } from "@/lib/validators"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { useTransition } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader } from "lucide-react"
import { updateUserAddress } from "@/actions/user-actions"
import { SubmitHandler } from "react-hook-form"


export default function ShippingAddressForm({ address }: { address: ShippingAddress }) {

  //create the router
  const router = useRouter()

  //build the form
  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || {
      fullName: '',
      streetAddress: '',
      city: '',
      postCode: '',
      country: ''
    }
  })

  const [isPending, startTransition] = useTransition()

  const handleSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (values: ShippingAddress) => {
    startTransition(async () => {
      const response = await updateUserAddress(values)
      if (!response.success) {
        toast('Error Updating address', {
          description: response.message
        })
        return
      }
      router.push('/payment-method')
    })
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="h2-bold mt-4">Shipping Address</h1>
      <p className="text-sm text-muted-foreground">Please enter your address</p>
      <Form {...form}>
        <form method="post" className="space-y-4" onClick={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="postCode"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Postcode</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (<Loader size={4} className="animate-spin" />) : (<ArrowRight size={4} />)} Continue
            </Button>
          </div>
        </form>
      </Form>
    </div >
  )
}

