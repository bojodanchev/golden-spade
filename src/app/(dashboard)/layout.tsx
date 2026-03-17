"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  Users,
  Building2,
  Kanban,
  Calendar,
  Settings,
  LogOut,
  Menu,
  Spade,
  ChevronRight,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Contacts", href: "/dashboard/contacts", icon: Users },
  { label: "Companies", href: "/dashboard/companies", icon: Building2 },
  { label: "Pipeline", href: "/dashboard/pipeline", icon: Kanban },
  { label: "Events", href: "/dashboard/events", icon: Calendar },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-secondary">
          <Spade className="h-5 w-5 text-brand-primary" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-white">
            Golden Spades
          </h1>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

function Breadcrumbs({ pathname }: { pathname: string }) {
  const segments = pathname.split("/").filter(Boolean)
  const crumbs = segments.map((segment, index) => ({
    label:
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
    href: "/" + segments.slice(0, index + 1).join("/"),
    isLast: index === segments.length - 1,
  }))

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      {crumbs.map((crumb, i) => (
        <div key={crumb.href} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="transition-colors hover:text-foreground"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="lg:hidden" />
                }
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 bg-sidebar p-0 text-sidebar-foreground"
              >
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarContent
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>

            <Breadcrumbs pathname={pathname} />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="relative flex h-9 w-9 items-center justify-center rounded-full outline-none hover:opacity-80" />
                }
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-brand-primary text-sm font-semibold text-white">
                    GS
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuItem
                  render={<Link href="/dashboard/settings" />}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
