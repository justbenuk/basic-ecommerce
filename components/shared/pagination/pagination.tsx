'use client'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

type PaginationProps = {
  page: number | string
  totalPages: number
  urlPathName?: string
}

export default function Pagination({ page, totalPages }: PaginationProps) {

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleClick(btnType: string) {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1

    const params = new URLSearchParams(searchParams)
    params.set('page', pageValue.toString())
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex gap-2">
      <Button size='lg' variant={'outline'} disabled={page === 1} className="w-28" onClick={() => handleClick('prev')}>Previous</Button>
      <Button size='lg' variant={'outline'} disabled={page === totalPages} className="w-28" onClick={() => handleClick('next')}>Next</Button>
    </div>
  )
}

