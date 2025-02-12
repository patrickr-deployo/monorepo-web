import { DataTableColumnHeader } from "@package/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { V1User } from "@package/api"
import { MembersTableActions } from "../MembersTableActions/MembersTableActions"
import { Badge } from "@package/ui/badge"
import Link from "next/link"

const formatDateTime = (date: string) => {
  if (!date) return "-"
  return new Date(date).toLocaleString()
}

export const memberColumns: ColumnDef<V1User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="ID"
        className="hidden md:table-cell"
      />
    ),
    cell: ({ getValue }) => (
      <div className="hidden md:table-cell">{getValue<string>()}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => {
      const id = row.original.id
      return (
        <Link href={`/members/${id}`} className="hover:underline">
          {row.original.username}
        </Link>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ getValue }) => getValue<string>() || "-",
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Email"
        className="hidden md:table-cell"
      />
    ),
    cell: ({ getValue }) => (
      <div className="hidden md:table-cell">{getValue<string>() || "-"}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Phone"
        className="hidden lg:table-cell"
      />
    ),
    cell: ({ getValue }) => (
      <div className="hidden lg:table-cell">{getValue<string>() || "-"}</div>
    ),
  },
  {
    id: "roles",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Roles"
        className="hidden md:table-cell"
      />
    ),
    cell: ({ row }) => (
      <div className="hidden md:table-cell flex gap-1 flex-wrap">
        {row.original.roles?.map((role) => (
          <Badge key={role.id} variant="secondary">
            {role.name}
          </Badge>
        )) || "-"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created At"
        className="hidden lg:table-cell"
      />
    ),
    cell: ({ getValue }) => (
      <div className="hidden lg:table-cell">
        {formatDateTime(getValue<string>())}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      return (
        <MembersTableActions
          user={user}
          // TODO: Implement delete modal
          onDeleteClick={() => {}}
          // TODO: Implement edit modal
          onEditClick={() => {}}
        />
      )
    },
  },
]
