'use client'
import { useState, useTransition } from "react"
import { Button } from "../ui/button"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { toast } from "sonner"

type DeleteDialogProps = {
  id: string
  action: (id: string) => Promise<{ success: boolean, message: string | undefined }>
}

export default function DeleteDialog({ id, action }: DeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDeleteClick() {
    startTransition(async () => {
      const response = await action(id)

      if (!response.success) {
        toast('Delete Order Error', {
          description: response.message
        })
      } else (
        toast('Delete Order', {
          description: 'Order deleted successfully'
        })
      )
      setOpen(!open)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size={'sm'} variant={'destructive'}>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action can not be undone</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant={'destructive'} size={'sm'} disabled={isPending} onClick={handleDeleteClick}>{isPending ? 'Deleting...' : 'Delete'}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

