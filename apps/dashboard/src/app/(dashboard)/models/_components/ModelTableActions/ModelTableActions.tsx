"use client"

import { V1beta1Model } from "@package/api"
import { Button } from "@package/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@package/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import { useRouter } from "next/navigation"

type ModelTableActionsProps = {
  model: V1beta1Model
  onDeleteModelActionClick: () => void
}

export function ModelTableActions({
  model,
  onDeleteModelActionClick,
}: ModelTableActionsProps) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-8 p-0" variant="ghost">
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/models/${model.id}`)}>
          View model
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
