import { DataTable } from "@package/ui/data-table"
import { memberColumns } from "../MembersColumns/MembersColumns"
import { V1User } from "@package/api"
import { useState, useMemo, useEffect } from "react"
import { Input } from "@package/ui/input"
import { SearchIcon } from "lucide-react"
import type { PaginationState } from "@tanstack/react-table"
import { Dispatch, SetStateAction } from "react"

interface MembersTableProps {
  members: V1User[]
  isLoading: boolean
  onSearch?: (search: string) => void
  pageSize?: number
  currentPage?: number
  totalItems?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

export function MembersTable({
  members,
  onSearch,
  pageSize = 10,
  currentPage = 1,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
}: MembersTableProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const columns = useMemo(() => memberColumns, [])

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: currentPage - 1,
    pageSize: pageSize,
  })

  useEffect(() => {
    setPagination({
      pageIndex: currentPage - 1,
      pageSize: pageSize,
    })
  }, [currentPage, pageSize])

  const handlePaginationChange = (updatedPagination: PaginationState) => {
    setPagination(updatedPagination)
    onPageChange?.(updatedPagination.pageIndex + 1)
    onPageSizeChange?.(updatedPagination.pageSize)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearch?.(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-8"
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={members}
        showPagination
        columnToggle
        customPagination={{
          pagination,
          setPagination: handlePaginationChange as Dispatch<
            SetStateAction<PaginationState>
          >,
          hasMore: currentPage * pageSize < totalItems,
          totalPages: Math.ceil(totalItems / pageSize),
        }}
        initialState={{
          columnVisibility: {
            id: false,
            phone: false,
            createdAt: false,
            updatedAt: false,
          },
        }}
      />
    </div>
  )
}
