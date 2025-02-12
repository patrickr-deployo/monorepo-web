"use client"

import { ChevronDownIcon } from "lucide-react"

import { Button } from "@package/ui/button"
import { Typography } from "@package/ui/typography"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@package/ui/dropdown-menu"
import { Tooltip, TooltipProvider } from "@package/ui/tooltip"

import { useRouter } from "next/navigation"

type HeroProps = {
  isLoading: boolean
}

export function Hero({ isLoading }: HeroProps) {
  const { push } = useRouter()

  return (
    <section className="flex gap-4 justify-between">
      <Typography className="mb-4" variant="h1">
        Overview
      </Typography>
      <section className="flex flex-wrap gap-2 md:items-center">
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={isLoading} isLoading={isLoading}>
                  Add New...
                  <ChevronDownIcon className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col">
                <DropdownMenuItem
                  className="cursor-pointer p-3"
                  onClick={() => push("/models/new")}
                >
                  <span>Model</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer p-3"
                  onClick={() => push("/deployments/new")}
                >
                  <span>Deployment</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer p-3"
                  onClick={() => push("/members")}
                >
                  <span>Team Member</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Tooltip>
        </TooltipProvider>
      </section>
    </section>
  )
}
