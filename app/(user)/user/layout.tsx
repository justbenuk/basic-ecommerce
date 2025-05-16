import { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import Menu from "@/components/shared/header/menu"
import { APP_NAME } from "@/lib/constants"
import MainNav from "@/components/shared/navigation/main-nav"


type LayoutProps = {
  children: ReactNode
}

export default function UserLayoutPage({ children }: LayoutProps) {
  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="flex items-center h-16 px-4">
          <Link href={'/'} className="w-22">
            <Image src={'/images/logo.svg'} alt={`${APP_NAME} logo`} width={48} height={48} />
          </Link>
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Menu />
          </div>
        </div>
      </div>
      <main className="flex-1 space-y-4 p-8 pt-6 container mx-auto">{children}</main>
    </div>
  )
}

