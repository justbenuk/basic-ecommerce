'use client'
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { paymentMethodSchema } from "@/lib/validators"
import { useTransition } from "react"
import { FormLabel, Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { updateUsersPaymentMethod } from "@/actions/user-actions"

export default function PaymentMethodForm({ PPM }: { PPM: string | null }) {

  const router = useRouter()
  const PAYMENT_METHODS = ['Paypal', 'Stripe', 'Cash On Delivery']
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: PPM || 'Paypal' || 'Stripe' || 'Cash On Delivery'
    }
  })

  const [isPending, startTransition] = useTransition()

  async function handleSubmit(values: z.infer<typeof paymentMethodSchema>) {
    startTransition(async () => {
      const response = await updateUsersPaymentMethod(values)

      if (!response.success) {
        toast('Sorry! something went wrong', {
          description: "We cound't save your payment method"
        })
        return
      }
      router.push('/place-order')
    })
  }

  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Payment Method</h1>
        <p className="text-sm text-muted-foreground">Please select your payment method</p>
        <Form {...form}>
          <form method="post" className="space-y-4" onClick={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-2">
                        {PAYMENT_METHODS.map((type) => (
                          <FormItem key={type} className="flex items-center space-x-3 space-y-0">
                            <RadioGroupItem value={type} checked={field.value === type} />
                            <FormLabel>{type}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
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

    </>
  )
}

