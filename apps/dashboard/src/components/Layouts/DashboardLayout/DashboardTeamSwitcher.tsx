"use client"

import {
  AudioWaveform,
  ChevronsUpDown,
  GalleryVerticalEnd,
  Plus,
  Command,
} from "lucide-react"
import { useTeam } from "@/hooks/useTeam"

import { NewTeamDialog } from "@/components/Misc"

import { Button } from "@package/ui/button"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@package/ui/dropdown-menu"

interface TeamSwitcherProps {
  className?: string
}

export function DashboardTeamSwitcher({ className }: TeamSwitcherProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false)

  const { tenants, currentTenant, handleSetCurrentTenant } = useTeam()

  const openCreateTeamDialog = () => {
    setPopoverOpen(false)
    setShowNewTeamDialog(true)
  }

  const hostTenant = tenants?.find((tenant) => tenant.isHost)
  const nonHostTenants = tenants?.filter((tenant) => !tenant.isHost) || []

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-primary-background text-foreground flex space-x-4">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              {currentTenant?.tenant?.logo ? (
                <img
                  src={currentTenant.tenant.logo.url}
                  className="size-4"
                  alt="Team logo"
                />
              ) : (
                <GalleryVerticalEnd className="size-4" />
              )}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {currentTenant?.isHost
                  ? "Host Organization"
                  : currentTenant?.tenant?.displayName}
              </span>
              <span className="truncate text-xs">
                {currentTenant?.isHost
                  ? "Administrator"
                  : currentTenant?.tenant?.plan?.active
                    ? currentTenant?.tenant?.plan?.displayName
                    : "Free"}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto" size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          {hostTenant && (
            <>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Host
              </DropdownMenuLabel>
              <DropdownMenuItem
                key={hostTenant.tenantId}
                onClick={() =>
                  handleSetCurrentTenant(hostTenant?.tenant?.id || "-")
                }
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {hostTenant.tenant?.logo ? (
                    <img
                      src={hostTenant.tenant?.logo.url}
                      className="size-4 shrink-0"
                      alt="Host logo"
                    />
                  ) : (
                    <GalleryVerticalEnd className="size-4" />
                  )}
                </div>
                Host Organization
                <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Teams
          </DropdownMenuLabel>
          {nonHostTenants.map((tenant, index) => (
            <DropdownMenuItem
              key={tenant.tenantId}
              onClick={() => handleSetCurrentTenant(tenant?.tenant?.id || "-")}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-sm border">
                {tenant.tenant?.logo ? (
                  <img
                    src={tenant.tenant?.logo.url}
                    className="size-4 shrink-0"
                    alt="Team logo"
                  />
                ) : (
                  <GalleryVerticalEnd className="size-4" />
                )}
              </div>
              {tenant.tenant?.displayName}
              <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 p-2"
            onClick={openCreateTeamDialog}
          >
            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
              <Plus className="size-4" />
            </div>
            <div className="font-medium text-muted-foreground">Add team</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <NewTeamDialog
        open={showNewTeamDialog}
        onClose={() => setShowNewTeamDialog(false)}
      />
    </>
  )
}
