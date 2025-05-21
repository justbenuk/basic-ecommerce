import { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import Menu from "@/components/shared/header/menu"
import { APP_NAME } from "@/lib/constants"
import { Input } from "@/components/ui/input"
import AdminNav from "@/components/shared/navigation/admin-nav"
import { requireAdmin } from "@/lib/auth-guard"


type LayoutProps = {
  children: ReactNode
}

export default async function AdminLayoutPage({ children }: LayoutProps) {
  await requireAdmin()
  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="flex items-center h-16 px-4">
          <Link href={'/'} className="w-22">
            <Image src={'/images/logo.svg'} alt={`${APP_NAME} logo`} width={48} height={48} />
          </Link>
          <AdminNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <div>
              <Input type="search" placeholder="Search..." className="md:w-[100px] lg:w-[300px]" />
            </div>
            <Menu />
          </div>
        </div>
      </div>
      <main className="flex-1 space-y-4 p-8 pt-6 container mx-auto">{children}</main>
    </div>
  )
}

