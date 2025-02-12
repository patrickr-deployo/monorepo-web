import { UserMenu } from "./UserMenu"
import { SheetMenu } from "./DashboardSheetMenu"
import { NotificationMenu } from "./NotificationMenu"
import { DashboardTeamSwitcher } from "./DashboardTeamSwitcher"
import { featureFlags } from "@package/utils"
import React from "react"
import { Badge } from "@package/ui/badge"

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <DashboardTeamSwitcher />
        </div>
        <div className="flex flex-1 items-center justify-end gap-3">
          <Badge variant="outline" className="h-8 font-extralight">
            Beta 0.0.1
          </Badge>
          {featureFlags.enableNotifications && <NotificationMenu />}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
