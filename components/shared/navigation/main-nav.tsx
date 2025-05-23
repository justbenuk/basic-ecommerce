'use client'
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"

const menuItems = [
  {
    title: 'Profile',
    href: '/user/profile'
  },
  {
    title: 'Orders',
    href: '/user/orders'
  }]

export default function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      {menuItems.map((item) => (
        <Link key={item.href} href={item.href} className={cn('text-sm font-medium transition-colors hover:text-primary', pathname.includes(item.href) ? '' : 'text-muted-foreground')}>{item.title}</Link>
      ))}
    </nav>
  )
}

