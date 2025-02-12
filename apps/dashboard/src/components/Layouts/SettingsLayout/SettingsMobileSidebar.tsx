"use client"

import { useState } from "react"

import { Button } from "@package/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@package/ui/sheet"
import { Menu } from "lucide-react"

import { SettingsLinks } from "./SettingsLinks"

export function SettingsMobileSidebar() {
  const [open, setOpen] = useState(false)

  function handleCloseSidebar() {
    if (open) {
      setOpen(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="shrink-0 lg:hidden" size="icon" variant="outline">
          <Menu className="size-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col" side="left">
        <SettingsLinks onLinkClick={handleCloseSidebar} />
      </SheetContent>
    </Sheet>
  )
}
