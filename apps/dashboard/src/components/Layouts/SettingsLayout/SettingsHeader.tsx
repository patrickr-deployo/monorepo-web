import { Typography } from "@package/ui/typography"
import { ThemeToggle } from "@package/ui/theme-toggle"
import { ArrowLeft, Bell } from "lucide-react"
import { Button } from "@package/ui/button"
import { DropdownMenu, DropdownMenuTrigger } from "@package/ui/dropdown-menu"
import Link from "next/link"

import { SettingsMobileSidebar } from "./SettingsMobileSidebar"

export function SettingsHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between p-4">
        <div className="hidden h-14 items-center px-3 lg:flex lg:h-[60px]">
          <Link className="flex items-center gap-2" href="/">
            <ArrowLeft className="size-5" />
            <Typography variant="h4" className="text-lg font-medium">
              Settings
            </Typography>
          </Link>
        </div>
        <SettingsMobileSidebar />
        <aside className="flex items-center gap-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full" size="icon" variant="outline">
                <Bell className="size-5" />
                <span className="sr-only">Toggle notification menu</span>
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </aside>
      </div>
    </header>
  )
}
