"use client"
import { Typography } from "@package/ui/typography"
import { MembersTable } from "../MembersTable/MembersTable"
import { useState, useEffect } from "react"
import { useMembers } from "../../_hooks/useMembers"
import { toast } from "@package/ui/toast"
export function MembersContent() {
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")

  const { members, totalSize, isLoading, error } = useMembers({
    pageSize,
    pageOffset: (currentPage - 1) * pageSize,
    search,
  })



  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load members",
        variant: "destructive",
      })
    }
  }, [error])

  return (
    <div className="space-y-4">
      <Typography variant="h1">Members</Typography>
      <MembersTable
        members={members}
        isLoading={isLoading}
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalSize}
        onSearch={setSearch}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  )
}
