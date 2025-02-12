import { V1User } from "@package/api"
import { Button } from "@package/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@package/ui/dropdown-menu"
import {
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"

type MemberTableActionsProps = {
  user: V1User
  onEditClick: () => void
  onDeleteClick: () => void
}

export function MembersTableActions({
  user,
  onEditClick,
  onDeleteClick,
}: MemberTableActionsProps) {
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
        <DropdownMenuItem onClick={() => router.push(`/members/${user.id}`)}>
          <UserIcon className="mr-2 size-4" />
          View profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEditClick}>
          <PencilIcon className="mr-2 size-4" />
          Edit member
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDeleteClick}
          className="text-destructive focus:text-destructive"
        >
          <TrashIcon className="mr-2 size-4" />
          Delete member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
